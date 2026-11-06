# Especificación de Requerimientos Funcionales (RF)

**Proyecto:** Plataforma de Fidelización Multisede para Cafeterías (ConfyTickets)  
**Versión:** 1.0  
**Fecha:** Noviembre 2026  
**Estado:** Aprobado para diseño e ingeniería  

---

## 1. Introducción y Convenciones

Este documento detalla el catálogo completo de requerimientos funcionales del sistema. Cada requisito cuenta con un identificador único, nombre, descripción detallada, actores involucrados, reglas de negocio asociadas y criterios de aceptación verificables.

**Prioridades:**
- **ALTA (MVP):** Indispensable para el lanzamiento del producto mínimo viable.
- **MEDIA (Fase 1.5):** Complementario para operación avanzada y automatización.
- **BAJA (Futuro / Fase 2):** Mejoras de escala y personalización.

---

## 2. Módulo 01: Autenticación, Cuentas y Accesos (AUTH)

### RF-001: Registro de Clientes
- **Prioridad:** ALTA (MVP)
- **Actores:** Cliente
- **Descripción:** El sistema debe permitir a nuevos clientes registrarse utilizando correo electrónico y contraseña. Opcionalmente podrá solicitarse el número de teléfono celular (si el negocio demuestra su necesidad operativa). Se debe capturar obligatoriamente la aceptación de la Política de Tratamiento de Datos Personales.
- **Reglas Asociadas:** RB-001, RB-052, RB-053.
- **Criterios de Aceptación:**
  1. El correo electrónico debe validarse sintácticamente y ser único en el sistema.
  2. La contraseña debe cumplir criterios de robustez (mínimo 8 caracteres, mayúscula, minúscula, número).
  3. No se permite continuar sin aceptar expresamente el tratamiento de datos personales.

### RF-002: Verificación y Recuperación de Cuenta
- **Prioridad:** ALTA (MVP)
- **Actores:** Cliente, Personal del Negocio
- **Descripción:** El sistema debe enviar un enlace o código de un solo uso por correo electrónico para verificar la dirección registrada y para restablecer la contraseña en caso de olvido.
- **Reglas Asociadas:** RB-001.
- **Criterios de Aceptación:**
  1. El enlace de recuperación tiene una vigencia máxima configurable (ej. 15 minutos).
  2. Al cambiar la contraseña exitosamente, se invalidan las sesiones activas previas.

### RF-003: Inicio de Sesión y Renovación de Tokens
- **Prioridad:** ALTA (MVP)
- **Actores:** Todos los actores (Cliente, Cajero, Admin, Propietario)
- **Descripción:** Autenticación segura mediante Supabase Auth. El backend emite/valida JWT con rotación de refresh tokens.
- **Reglas Asociadas:** RB-003, RB-005.
- **Criterios de Aceptación:**
  1. Si la cuenta está en estado `BLOCKED` o `INACTIVE`, el sistema rechaza el login indicando el motivo de forma neutral.
  2. Los JWT deben expirar en un plazo corto (ej. 15 a 60 min) y requerir refresh token.

### RF-004: Autenticación Multifactor (MFA) para Personal Administrativo
- **Prioridad:** ALTA (MVP para Admin/Propietario)
- **Actores:** Administrador General, Propietario
- **Descripción:** Obligatoriedad o recomendación reforzada de MFA (TOTP vía Authenticator app) para roles con privilegios sobre reglas, finanzas o auditoría.
- **Reglas Asociadas:** RB-054.

---

## 3. Módulo 02: Gestión de Sedes y Personal (STORES & USERS)

### RF-005: Administración de Sedes Multisede
- **Prioridad:** ALTA (MVP)
- **Actores:** Propietario, Administrador General
- **Descripción:** El sistema debe permitir registrar, editar y desactivar sedes físicas de la cafetería con: nombre, código interno único, dirección completa, coordenadas geográficas (lat/lng), horarios de atención, teléfono y zona horaria (`America/Bogota`).
- **Reglas Asociadas:** RB-038, RB-039.
- **Criterios de Aceptación:**
  1. Una sede inactiva no permite emitir compras ni redimir premios.
  2. La desactivación de una sede nunca borra su histórico transaccional.

### RF-006: Asignación de Roles y Sedes a Empleados
- **Prioridad:** ALTA (MVP)
- **Actores:** Propietario, Administrador General
- **Descripción:** Los empleados (cajeros, administradores de sede) deben tener un rol explícito (`CASHIER`, `STORE_ADMIN`, `GENERAL_ADMIN`, `MARKETING`, `OWNER`) y una lista de sedes autorizadas para operar.
- **Reglas Asociadas:** RB-005, RB-037.
- **Criterios de Aceptación:**
  1. Un cajero no puede registrar una compra o redención en una sede a la cual no está asignado explícitamente en `membership_store_assignments`.

### RF-007: Bloqueo y Gestión de Cuentas de Clientes
- **Prioridad:** ALTA (MVP)
- **Actores:** Administrador General, Propietario
- **Descripción:** El panel debe permitir consultar la lista de clientes, sus tarjetas, movimientos y suspender temporal o permanentemente cuentas por conducta irregular, registrando el motivo en auditoría.
- **Reglas Asociadas:** RB-003, RB-004, RB-054.

---

## 4. Módulo 03: Motor de Fidelización y Tarjetas (LOYALTY)

### RF-008: Configuración y Versionado de Programas de Fidelización
- **Prioridad:** ALTA (MVP)
- **Actores:** Propietario, Administrador General
- **Descripción:** El sistema debe gestionar el programa de sellos con reglas versionadas (`loyalty_program_versions`): cantidad de sellos requeridos (meta base: 8 sellos), importe mínimo de compra ($M$), importe elegible por sello ($T$), tope de sellos por compra ($C$), días de vigencia de sellos y de recompensas.
- **Reglas Asociadas:** RB-006, RB-010, RB-011, RB-021.
- **Criterios de Aceptación:**
  1. Cualquier cambio en las reglas crea una versión nueva (`version_number + 1`) con fecha de vigencia `effective_from`.
  2. Las tarjetas o compras existentes conservan la referencia a la versión con la que fueron creadas.

### RF-009: Cálculo Automatizado de Sellos (Modo Combinado)
- **Prioridad:** ALTA (MVP)
- **Actores:** Backend (Cálculo exclusivo en servidor)
- **Descripción:** El servidor calcula los sellos resultantes de una compra aplicando la fórmula:
  $$\text{Si } V < M \implies S = 0$$
  $$\text{Si } V \ge M \implies S = \min(C, \max(1, \lfloor V / T \rfloor))$$
  Donde $V$ es el importe neto elegible, $M$ compra mínima, $T$ valor por sello, $C$ tope por compra.
- **Reglas Asociadas:** RB-009, RB-012, RB-015, RB-016.
- **Criterios de Aceptación:**
  1. El cliente o la app de caja no pueden enviar el valor de sellos; sólo envían los importes del comprobante.
  2. El resultado debe redondearse al entero inferior y respetar el tope $C$.

### RF-010: Tarjetas Digitales de 8 Sellos y Ciclos Consecutivos
- **Prioridad:** ALTA (MVP)
- **Actores:** Cliente, Backend
- **Descripción:** Cada cliente tiene una tarjeta activa asociada al programa. La tarjeta tiene una meta de 8 sellos. Al llegar al sello número 8, la tarjeta cambia su estado a `COMPLETED` y se genera automáticamente una instancia de recompensa.
- **Reglas Asociadas:** RB-006, RB-007, RB-021, RB-027.

### RF-011: Arrastre Atómico de Sellos Sobrantes (Carry-Over)
- **Prioridad:** ALTA (MVP)
- **Actores:** Backend
- **Descripción:** Si un cliente tiene 7 sellos y su compra genera 3 sellos, el sistema debe:
  1. Asignar 1 sello a la tarjeta actual (alcanzando 8/8) y marcarla como completada.
  2. Emitir la recompensa correspondiente.
  3. Crear un nuevo ciclo de tarjeta (ciclo 2).
  4. Asignar los 2 sellos restantes al nuevo ciclo con tipo `CARRY_IN`.
  5. Toda la operación debe ocurrir en una única transacción atómica de base de datos.
- **Reglas Asociadas:** RB-019, RB-020.

### RF-012: Vencimiento Individual de Sellos por Lote
- **Prioridad:** MEDIA (Fase 1.5)
- **Actores:** Proceso Programado (Celery Worker)
- **Descripción:** Si el programa define días de vigencia de sellos, cada lote de sellos ganado tiene una fecha `expires_at`. Un worker diario evalúa sellos expirados no convertidos en recompensa y crea un movimiento de tipo `EXPIRATION`.
- **Reglas Asociadas:** RB-023, RB-024, RB-025.

---

## 5. Módulo 04: Compras y Códigos QR Dinámicos (PURCHASES & QR)

### RF-013: Generación de QR Dinámico de Compra
- **Prioridad:** ALTA (MVP)
- **Actores:** Cliente (Mobile / Web)
- **Descripción:** La app solicita un token temporal para identificación en caja. El servidor genera un token criptográfico opaco, almacena su hash SHA-256 en `qr_tokens` con propósito `PURCHASE` y vigencia de 60 segundos (configurable).
- **Reglas Asociadas:** RB-014, RB-040, RB-041, RB-042, RB-043.
- **Criterios de Aceptación:**
  1. El QR no contiene información personal (PII) ni JWT.
  2. Al vencer el contador regresivo, la app solicita un nuevo token automáticamente o por acción del usuario.

### RF-014: Escaneo y Registro de Compra en Caja
- **Prioridad:** ALTA (MVP)
- **Actores:** Cajero
- **Descripción:** El cajero escanea el QR del cliente, ingresa el número de referencia del comprobante de pago/factura POS, el importe bruto y los descuentos aplicables. El backend valida el QR, el cajero, la sede y la unicidad del comprobante.
- **Reglas Asociadas:** RB-013, RB-014, RB-036, RB-044, RB-045.
- **Criterios de Aceptación:**
  1. Si el QR ya fue consumido o expiró, retorna error `QR_ALREADY_USED` o `QR_EXPIRED`.
  2. El consumo del token QR y el registro de la compra ocurren en la misma transacción (`SELECT ... FOR UPDATE`).
  3. Se rechaza la operación si el comprobante ya existe en esa sede (`UNIQUE (business_id, store_id, receipt_reference)`).

### RF-015: Reversión y Cancelación de Compras
- **Prioridad:** ALTA (MVP)
- **Actores:** Administrador de Sede, Administrador General
- **Descripción:** En caso de devolución o error tipográfico en caja, un usuario autorizado puede cancelar una compra indicando el motivo justificado. El sistema revierte los sellos generados (`REVERSAL`) y audita el evento.
- **Reglas Asociadas:** RB-017, RB-034, RB-054.

---

## 6. Módulo 05: Recompensas y Canjes (REWARDS)

### RF-016: Catálogo y Definición de Recompensas
- **Prioridad:** ALTA (MVP)
- **Actores:** Administrador General, Propietario
- **Descripción:** Configuración de beneficios canjeables: tipo (producto gratis, descuento porcentual, descuento fijo en COP, beneficio especial), descripción, imagen, vigencia, sedes habilitadas y condiciones.
- **Reglas Asociadas:** RB-028, RB-032, RB-033.

### RF-017: Emisión y Consulta de Recompensas de Cliente
- **Prioridad:** ALTA (MVP)
- **Actores:** Cliente, Backend
- **Descripción:** Al completarse un ciclo de 8 sellos, se genera un registro en `customer_rewards` en estado `AVAILABLE`. El cliente puede ver sus recompensas activas, vencimiento y términos.
- **Reglas Asociadas:** RB-027, RB-028, RB-029.

### RF-018: Generación de QR de Redención
- **Prioridad:** ALTA (MVP)
- **Actores:** Cliente
- **Descripción:** Cuando el cliente desea reclamar su premio, presiona "Redimir". El backend genera un QR dinámico temporal con propósito `REDEMPTION`, asociado al `customer_reward_id`.
- **Reglas Asociadas:** RB-030, RB-040, RB-041.

### RF-019: Confirmación de Redención en Caja
- **Prioridad:** ALTA (MVP)
- **Actores:** Cajero
- **Descripción:** El cajero escanea el QR de redención. El backend valida que la recompensa pertenezca a la sede actual, esté `AVAILABLE` y no expirada. Se marca inmediatamente como `REDEEMED` y se crea el registro en `reward_redemptions`.
- **Reglas Asociadas:** RB-030, RB-031, RB-044.
- **Criterios de Aceptación:**
  1. Es imposible redimir la misma recompensa dos veces (bloqueo a nivel de base de datos).

---

## 7. Módulo 06: Vitrina de Productos y Banners Promocionales (CONTENT)

### RF-020: Gestión de 5 Productos Destacados
- **Prioridad:** ALTA (MVP)
- **Actores:** Marketing, Administrador General
- **Descripción:** El panel permite mantener exactamente hasta 5 productos en vitrina (posiciones 1 a 5) con nombre, descripción corta, precio orientativo en COP, fotografía y disponibilidad.
- **Criterios de Aceptación:**
  1. La app móvil y web cliente renderizan la lista ordenada por `featured_order`.
  2. Los cambios en el panel se reflejan inmediatamente en las apps de los clientes sin recompilar código.

### RF-021: Gestión de Banners Publicitarios
- **Prioridad:** ALTA (MVP)
- **Actores:** Marketing, Administrador General
- **Descripción:** Carga de imágenes promocionales en Supabase Storage / S3 con título, descripción, enlace interno opcional en la app, rango de fechas de visualización y estado activo/inactivo.

---

## 8. Módulo 07: Notificaciones, Campañas y Proximidad (NOTIFICATIONS)

### RF-022: Notificaciones Push Transaccionales
- **Prioridad:** ALTA (MVP)
- **Actores:** Backend (FCM)
- **Descripción:** Envío de push inmediato ante eventos clave: compra registrada, sellos acreditados, tarjeta completada con premio obtenido, recompensa redimida con éxito.
- **Reglas Asociadas:** RB-046.

### RF-023: Gestión de Campañas de Marketing y Segmentación
- **Prioridad:** MEDIA (Fase 1.5)
- **Actores:** Marketing, Administrador General
- **Descripción:** Creación de campañas masivas o segmentadas (clientes inactivos hace >15 días, clientes con 7 sellos, clientes de cierta sede). Control de límites de frecuencia (máx. 1 al día, máx. 3 por semana).
- **Reglas Asociadas:** RB-047, RB-048, RB-049.

### RF-024: Notificaciones de Proximidad por Geofencing (Nativo)
- **Prioridad:** MEDIA (Fase 1.5 - Segunda entrega)
- **Actores:** App Mobile (Capacitor Background Geolocation / Geofence)
- **Descripción:** Detección de entrada en el radio perimetral (ej. 150m) de una sede activa. Si el usuario otorgó permiso de ubicación y aceptó notificaciones de cercanía, el dispositivo muestra un mensaje local amigable sin enviar trazas constantes al servidor.
- **Reglas Asociadas:** RB-050, RB-055.

---

## 9. Módulo 08: Auditoría, Reportes y Dashboard (ADMIN)

### RF-025: Dashboard de Indicadores de Negocio
- **Prioridad:** ALTA (MVP)
- **Actores:** Propietario, Administrador General, Administrador de Sede
- **Descripción:** Métricas en tiempo real: clientes totales, sellos emitidos/revertidos, tarjetas completadas, recompensas redimidas, volumen de compras en COP, filtrable por rango de fechas y por sede.
- **Reglas Asociadas:** RB-039.

### RF-026: Bitácora de Auditoría Inmutable
- **Prioridad:** ALTA (MVP)
- **Actores:** Sistema
- **Descripción:** Registro inmutable de cada acción administrativa o financiera: actor, IP, acción, tabla/registro afectado, snapshot previo y posterior (`before_data`, `after_data`), sede y justificación.
- **Reglas Asociadas:** RB-054.
