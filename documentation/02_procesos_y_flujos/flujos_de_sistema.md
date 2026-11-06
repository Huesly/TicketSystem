# Flujos Detallados del Sistema y Diagramas de Secuencia

**Proyecto:** Plataforma de Fidelización Multisede para Cafeterías (ConfyTickets)  
**Versión:** 1.0  
**Fecha:** Noviembre 2026  

---

## 1. Flujo 01: Registro, Autenticación y Onboarding del Cliente

Este flujo describe la incorporación del usuario a la plataforma, cumpliendo con la separación obligatoria de consentimientos según la Ley 1581 de 2012.

```mermaid
sequenceDiagram
    autonumber
    actor C as Cliente
    participant UI as App Mobile / Web
    participant SA as Supabase Auth
    participant API as FastAPI Backend
    participant DB as PostgreSQL

    C->>UI: Ingresa Email, Password, Nombre
    C->>UI: Marca Consentimiento de Tratamiento (Obligatorio)
    C->>UI: Marca Opcional: Notificaciones de Marketing
    UI->>SA: signUp(email, password)
    SA-->>UI: Retorna session / token + user_id (UUID)
    UI->>API: POST /me/onboarding (Nombre, Consentimientos)
    Note over API,DB: Transacción Inicial
    API->>DB: INSERT INTO profiles (id, full_name, email)
    API->>DB: INSERT INTO consents (user_id, purpose, status='granted')
    API->>DB: INSERT INTO loyalty_cards (customer_id, program_id, cycle_number=1, status='accumulating')
    DB-->>API: Onboarding completado con éxito
    API-->>UI: 201 Created (Perfil + Tarjeta Ciclo 1 con 0/8 sellos)
    UI-->>C: Despliega Home con tarjeta vacía lista para sellos
```

---

## 2. Flujo 02: Generación y Validación de QR Dinámico (Purchase & Redemption)

El código QR dinámico previene la suplantación o fraude por capturas de pantalla, utilizando tokens opacos de un solo uso con expiración a los 60 segundos.

```mermaid
sequenceDiagram
    autonumber
    actor C as Cliente
    participant App as App Móvil (Capacitor)
    participant API as FastAPI Backend
    participant DB as PostgreSQL

    C->>App: Pulsa "Mostrar mi Código QR"
    App->>API: POST /api/v1/me/qr/purchase (Bearer JWT)
    API->>API: Genera secret_token aleatorio (32 bytes criptográficos)
    API->>API: Calcula token_hash = SHA256(secret_token)
    API->>DB: INSERT INTO qr_tokens (token_hash, user_id, purpose='PURCHASE', expires_at = NOW() + 60s)
    DB-->>API: Confirmado
    API-->>App: { token: secret_token, expires_in: 60, purpose: "PURCHASE" }
    App->>App: Renderiza QR con secret_token + Temporizador 60s
    Note over App,C: Si el contador llega a 0s, se bloquea el QR y solicita uno nuevo
```

---

## 3. Flujo 03: Registro de Compra en Caja y Acumulación de Sellos con Arrastre (Carry-Over)

Este es el flujo nuclear del negocio. Demuestra cómo se procesa una compra en caja, cómo se bloquea la tarjeta para evitar condiciones de carrera y cómo se realiza el arrastre cuando una compra supera la meta de 8 sellos.

```mermaid
sequenceDiagram
    autonumber
    actor C as Cliente
    actor K as Cajero
    participant POS as Panel Caja (Web)
    participant API as FastAPI Backend
    participant DB as PostgreSQL
    participant FCM as Firebase Cloud Messaging

    C->>K: Presenta su QR dinámico en pantalla
    K->>POS: Escanea QR con cámara/lector
    K->>POS: Ingresa Referencia Factura (ej. FAC-1024) e Importe ($30.000 COP)
    POS->>API: POST /api/v1/cashier/purchases<br/>Header: Idempotency-Key: <UUID><br/>Body: { qr_token, store_id, receipt_reference, gross_amount: 30000, discount_amount: 0 }
    
    Note over API,DB: INICIO DE TRANSACCIÓN ATÓMICA (SERIALIZABLE O ROW LOCK)
    API->>API: Calcula SHA256(qr_token)
    API->>DB: SELECT * FROM qr_tokens WHERE token_hash = :hash FOR UPDATE
    Note over API,DB: Valida: exists, consumed_at IS NULL, expires_at > NOW()
    
    API->>DB: UPDATE qr_tokens SET consumed_at = NOW(), consumed_by = :cashier_id
    API->>DB: Valida cajero asignado a store_id
    API->>DB: INSERT INTO purchases (...)
    
    API->>DB: SELECT * FROM loyalty_cards WHERE customer_id = :cid AND status = 'accumulating' FOR UPDATE
    API->>API: Aplica Fórmula: V=30000, M=10000, T=10000, C=3 => S = 3 sellos ganados
    
    alt Caso Normal: Sellos caben en la tarjeta actual (ej. tenía 3, suma 3 => 6/8)
        API->>DB: INSERT INTO stamp_movements (card_id, purchase_id, quantity=3, movement_type='EARN')
        Note over API,DB: Tarjeta queda con 6/8
    else Caso Arrastre (Carry-over): Tenía 7 sellos, suma 3 sellos (Total 10)
        API->>DB: INSERT INTO stamp_movements (card_id=ciclo1, purchase_id, quantity=1, movement_type='EARN')
        API->>DB: UPDATE loyalty_cards SET status='completed', completed_at=NOW() WHERE id=ciclo1
        API->>DB: INSERT INTO customer_rewards (customer_id, card_id=ciclo1, status='AVAILABLE', expires_at = NOW()+30d)
        API->>DB: INSERT INTO loyalty_cards (customer_id, cycle_number=2, status='accumulating')
        API->>DB: INSERT INTO stamp_movements (card_id=ciclo2, purchase_id, quantity=2, movement_type='CARRY_IN')
        Note over API,DB: Ciclo 1 completado con premio emitido; Ciclo 2 abierto con 2/8 sellos
    end
    
    Note over API,DB: COMMIT DE LA TRANSACCIÓN
    DB-->>API: Transacción Exitosa
    
    API-->>POS: 200 OK: { purchase_id, stamps_awarded: 3, current_card: { stamps: 2, required: 8 }, rewards_issued: 1 }
    K-->>C: "¡Compra registrada! Ganaste 3 sellos y obtuviste una nueva recompensa."
    
    API--)FCM: Encola notificación push transaccional para el cliente
    FCM--)C: Notificación Push: "¡Completaste tu tarjeta! Tienes un café gratis esperándote ☕"
```

---

## 4. Flujo 04: Ciclo de Vida de Tarjeta y Recompensa (State Machine)

Diagrama de estados que modela el comportamiento de las tarjetas digitales y las instancias de recompensas otorgadas al cliente.

```mermaid
stateDiagram-v2
    [*] --> Ciclo_Acumulando: Apertura de tarjeta (0/8 sellos)
    
    state Ciclo_Acumulando {
        [*] --> Sello_Acreditado
        Sello_Acreditado --> Sello_Acreditado: Compra válida (+1..C sellos)
        Sello_Acreditado --> Sello_Revertido: Devolución / Error en caja (-N sellos)
    }

    Ciclo_Acumulando --> Ciclo_Completado: Alcanza 8 sellos
    Ciclo_Acumulando --> Ciclo_Vencido: Pasa tiempo límite sin compras (Inactividad)
    
    state Recompensa {
        [*] --> Recompensa_Disponible: Emisión automática al completar ciclo
        Recompensa_Disponible --> Recompensa_EnProceso: Cliente genera QR de redención
        Recompensa_EnProceso --> Recompensa_Disponible: QR expira sin ser escaneado
        Recompensa_EnProceso --> Recompensa_Redimida: Cajero confirma entrega en tienda
        Recompensa_Disponible --> Recompensa_Expirada: Pasa vigencia límite (ej. 30 días)
        Recompensa_Disponible --> Recompensa_Cancelada: Reversión de compra origen
    }

    Ciclo_Completado --> Recompensa_Disponible: Dispara emisión de beneficio
    Ciclo_Completado --> Ciclo_Acumulando: Se abre automáticamente el siguiente ciclo consecutivo
```

---

## 5. Flujo 05: Redención de Recompensas en Tienda

Secuencia de operaciones para canjear un beneficio acumulado en caja física.

```mermaid
sequenceDiagram
    autonumber
    actor C as Cliente
    actor K as Cajero
    participant App as App Móvil Cliente
    participant POS as Terminal Caja Web
    participant API as FastAPI Backend
    participant DB as PostgreSQL

    C->>App: Abre pestaña "Recompensas" y selecciona "Café Americano Gratis"
    C->>App: Pulsa botón "Redimir en Caja"
    App->>API: POST /api/v1/me/rewards/{reward_id}/qr
    API->>DB: Verifica customer_reward_id = :id AND status = 'AVAILABLE'
    API->>DB: INSERT INTO qr_tokens (token_hash, user_id, purpose='REDEMPTION', resource_id = :reward_id)
    API-->>App: Retorna QR de redención temporal (60s)
    
    C->>K: Muestra el QR de redención al cajero
    K->>POS: Escanea QR de redención
    POS->>API: POST /api/v1/cashier/redemptions<br/>Body: { qr_token, store_id }
    
    Note over API,DB: Transacción de Redención
    API->>DB: SELECT * FROM qr_tokens WHERE token_hash = :hash FOR UPDATE
    API->>DB: SELECT * FROM customer_rewards WHERE id = :reward_id FOR UPDATE
    API->>DB: Verifica elegibilidad de sede (reward_store_eligibility)
    API->>DB: UPDATE customer_rewards SET status = 'REDEEMED', redeemed_at = NOW()
    API->>DB: UPDATE qr_tokens SET consumed_at = NOW(), consumed_by = :cashier_id
    API->>DB: INSERT INTO reward_redemptions (customer_reward_id, store_id, cashier_id, status='confirmed')
    DB-->>API: Confirmación exitosa
    
    API-->>POS: 200 OK: { message: "Recompensa redimida con éxito", reward_name: "Café Americano" }
    K-->>C: Entrega el producto al cliente
    API--)App: WebSocket / SSE / Polling actualiza estado a "Redimida"
```

---

## 6. Flujo 06: Devolución de Compra y Reversión de Sellos

Manejo seguro de incidencias cuando una compra registrada debe anularse sin romper la consistencia del historial.

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Administrador de Sede
    participant POS as Panel Web
    participant API as FastAPI Backend
    participant DB as PostgreSQL

    Admin->>POS: Ubica compra por Referencia o ID
    Admin->>POS: Pulsa "Solicitar Anulación" e ingresa justificación (ej. "Error en tipeo de monto")
    POS->>API: POST /api/v1/cashier/purchases/{purchase_id}/cancel<br/>Body: { reason: "Error de digitación" }
    
    Note over API,DB: Transacción de Reversión
    API->>DB: SELECT * FROM purchases WHERE id = :purchase_id FOR UPDATE
    API->>DB: Verifica que purchase.status == 'confirmed'
    API->>DB: UPDATE purchases SET status = 'cancelled', cancelled_at = NOW()
    API->>DB: SELECT * FROM stamp_movements WHERE purchase_id = :purchase_id
    API->>DB: INSERT INTO stamp_movements (card_id, purchase_id, quantity, movement_type='REVERSAL', reason, reverses_movement_id)
    API->>DB: INSERT INTO audit_logs (actor_id, action='PURCHASE_CANCELLED', entity_type='purchases', entity_id, reason)
    DB-->>API: Reversión completada
    
    API-->>POS: 200 OK: { message: "Compra anulada y sellos revertidos correctamente" }
```

---

## 7. Flujo 07: Notificaciones de Proximidad por Geofencing (Nativo en Dispositivo)

Garantiza la privacidad del cliente al procesar la entrada a la geocerca de forma local en el dispositivo del usuario, sin enviar un rastreo de GPS continuo a los servidores.

```mermaid
sequenceDiagram
    autonumber
    actor C as Cliente con Teléfono
    participant OS as Sistema Operativo (Android/iOS)
    participant Cap as Plugin Geofence (Capacitor)
    participant Local as Notificación Local del Sistema

    Note over OS,Cap: La app descargó previamente las coordenadas y radios de las sedes activas
    C->>OS: El usuario camina y entra al radio de 150m de la Sede "Centro"
    OS->>Cap: Evento nativo onGeofenceEnter(store_id="centro")
    Cap->>Cap: Comprueba consentimientos locales de usuario (¿Aceptó proximidad?)
    Cap->>Cap: Comprueba límite de frecuencia local (¿Recibió push en las últimas 24h?)
    Cap->>Cap: Comprueba horario comercial de la sede (ej. entre 8:00 AM y 7:00 PM)
    alt Cumple todas las condiciones
        Cap->>Local: Disparar notificación local del sistema
        Local-->>C: "¡Estás cerca de tu cafetería favorita! ☕ Pasa y aprovecha tus sellos."
        Cap->>Cap: Actualiza timestamp de última notificación mostrada
    else No cumple condiciones
        Cap->>Cap: Descarta el evento silenciosamente
    end
```
