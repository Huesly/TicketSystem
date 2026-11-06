# Especificación Técnica del Área Web Admin y Punto de Caja (POS)

**Proyecto:** Plataforma de Fidelización Multisede para Cafeterías (ConfyTickets)  
**Tecnología Base:** Vue 3 (Composition API) + TypeScript + Tailwind CSS  
**Versión:** 1.0  
**Fecha:** Noviembre 2026  

---

## 1. Módulo Operativo de Caja (Cashier Interface)

El módulo de caja está diseñado para operar con máxima rapidez y ergonomía en pantallas táctiles de terminales de punto de venta (tablets o monitores POS), minimizando el tiempo de atención al cliente en la barra de café.

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [CONFY CAJA]  Sede: Centro   Cajero: Juan P.       [Cerrar Turno]      │
├──────────────────────────────────┬─────────────────────────────────────┤
│ 1. ESCANEAR CÓDIGO QR            │ 2. DATOS DE FACTURA                 │
│                                  │                                     │
│ ┌──────────────────────────────┐ │ Referencia de Factura / Ticket:    │
│ │   [ CÁMARA / LECTOR ACTIVO ] │ │ [ FAC-2026-09841                  ] │
│ │                              │ │                                     │
│ │        [  ||||||||  ]        │ │ Importe Total de la Venta (COP):    │
│ │                              │ │ [ $ 35.000                        ] │
│ └──────────────────────────────┘ │                                     │
│ O ingresar token de contingencia:│ Descuentos Aplicados (COP):         │
│ [ CFY-842                      ] │ [ $ 0                             ] │
│                                  │                                     │
│ Cliente identificado:            │ Valor Elegible para Sellos:         │
│ >> Camila Rodríguez              │ >> $ 35.000 COP                     │
│ Saldo actual: 5 de 8 sellos      │ Sellos a otorgar: +3 sellos         │
│                                  │                                     │
│                                  │ [ REGISTRAR COMPRA Y ACREDITAR ]    │
│                                  │                                     │
│                                  │ [ MODALIDAD CANJE DE RECOMPENSA ]   │
└──────────────────────────────────┴─────────────────────────────────────┘
```

### 1.1. Modos de Lectura de QR en Caja
1. **Lector de Código de Barras 2D (Recomendado para alto tráfico):** Escáner USB o Bluetooth conectado al terminal que emula teclado (*keyboard wedge*). Al escanear el QR, el valor se escribe automáticamente en el campo de texto y dispara la consulta en milisegundos.
2. **Cámara Web / Tablet:** Integración mediante `@zxing/library` o `html5-qrcode` para terminales que utilicen la cámara integrada.

### 1.2. Validaciones en Tiempo Real en la Interfaz de Caja
- **Bloqueo de Envío Duplicado:** Al hacer clic en "Registrar Compra", el botón se deshabilita instantáneamente, genera una clave única `Idempotency-Key: <UUID>` y muestra un indicador de carga.
- **Retroalimentación Visual Inmediata:** Si la compra completa la tarjeta del cliente (alcanza 8 sellos), la pantalla emite un aviso sonoro agradable y despliega una alerta verde: *"¡El cliente ha ganado un Café Americano de Cortesía!"*.

---

## 2. Módulo de Administración y Gestión Central (Backoffice)

### 2.1. Panel de Control y Analítica Multisede (`/admin/dashboard`)
- **Filtros Globales:** Selector de rango de fechas (Hoy, Últimos 7 días, Mes actual, Personalizado) y selector de sedes físicas (Todas las sedes o sede específica).
- **Tarjetas de KPI Principales:**
  - Clientes Registrados Totales y Nuevos en el periodo.
  - Sellos Emitidos vs. Sellos Revertidos.
  - Tarjetas de 8 Sellos Completadas en el periodo.
  - Tasa de Redención de Recompensas ($ \frac{\text{Premios Redimidos}}{\text{Premios Emitidos}} \times 100 $).
  - Volumen Total de Ventas Identificadas con Fidelización en COP.
- **Gráficos Comparativos:**
  - Gráfico de barras de ventas y sellos acumulados por sede física.
  - Gráfico de línea con la afluencia de clientes por franjas horarias.

### 2.2. Gestión de Sedes y Personal (`/admin/stores`, `/admin/staff`)
- **Catálogo de Sedes:** Alta, baja lógica y edición de sedes (nombre, código interno, dirección, coordenadas geográficas, radio de geocerca en metros, horarios de apertura y teléfono).
- **Asignación de Personal:** Invitación de usuarios por correo, selección de rol en el negocio (`OWNER`, `GENERAL_ADMIN`, `STORE_ADMIN`, `CASHIER`, `MARKETING`) y asignación múltiple de sedes donde tienen autorización para operar.

### 2.3. Configuración del Programa de Fidelización (`/admin/loyalty`)
- Vista de la versión activa de reglas.
- Formulario de nueva versión (`version_number + 1`) con fecha de inicio de vigencia:
  - Meta de sellos (base: 8 sellos).
  - Compra mínima ($M$).
  - Valor por sello ($T$).
  - Tope de sellos por compra ($C$).
  - Días de expiración de sellos y de recompensas.
- Previsualizador interactivo que simula cuántos sellos recibiría un cliente con diferentes importes antes de publicar las reglas.

### 2.4. Gestión de los 5 Productos Destacados (`/admin/products`)
- Interfaz drag-and-drop con exactamente 5 casillas numeradas del 1 al 5.
- Carga de fotografía con recorte automático a formato cuadrado/16:9 optimizado en WebP.
- Edición de nombre, descripción corta, precio en COP y switch de disponibilidad en inventario.

### 2.5. Gestión de Banners y Campañas (`/admin/marketing`)
- **Banners:** Carga de imágenes para el carrusel de inicio, título, texto complementario, link de destino y programación de fechas (`starts_at`, `ends_at`).
- **Campañas Push:** Diseñador de mensajes con previsualización en pantalla de teléfono (Android / iOS). Filtros de audiencia (ej. clientes que llevan más de 15 días sin compras o clientes que tienen 7 sellos). Control automático de límites de saturación (máximo 1 push comercial diario).

### 2.6. Auditoría Forense (`/admin/audit`)
- Tabla de eventos de seguridad y transacciones sensibles:
  - Fecha y hora exacta.
  - Usuario responsable (Cajero / Administrador / Proceso automático).
  - Sede de ocurrencia.
  - Tipo de acción (`PURCHASE_CANCELLED`, `MANUAL_STAMP_ADJUSTMENT`, `STORE_STATUS_CHANGED`).
  - Visor de diferencias JSON (*diff visual*) entre `before_data` y `after_data`.
  - Justificación obligatoria capturada en la operación.
