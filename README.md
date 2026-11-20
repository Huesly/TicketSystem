# TicketSystem — Workspace Frontend Multi-Canal (App Clientes, Terminal Caja POS / Backoffice y App Móvil)

Repositorio oficial de la **Capa de Presentación y Aplicaciones Cliente** de **ConfyTickets (TicketSystem)**, estructurado con **NPM Workspaces** sobre **Vue 3 + TypeScript + Vite + Tailwind CSS + Ionic / Capacitor 6**.

> **Nota de Arquitectura:** El motor transaccional en Python (`FastAPI`), el escudo WAF de Ciberseguridad, la base de datos `PostgreSQL 15`, `Redis 7` y el generador UBL 2.1 de Facturación Electrónica DIAN residen en su propio repositorio independiente: **[`Huesly/TicketSystemBack`](https://github.com/Huesly/TicketSystemBack)**.

---

## 1. Aplicaciones Incluidas en este Workspace

| Aplicación | Ruta Workspace | Puerto Local | Audiencia y Propósito |
| :--- | :--- | :---: | :--- |
| **App Web de Clientes (`customer-web`)** | [`apps/customer-web`](./apps/customer-web) | `3010` | Aplicación pública para clientes de la cafetería: Login/Registro con Habeas Data (Ley 1581), recuperación de clave con código OTP, tarjeta digital interactiva de 8 sellos en tiempo real, generación de QR efímero y Carnet QR permanente estilo Starbucks, vitrina de productos, sedes y **reimpresión de Facturas Electrónicas DIAN (PDF / XML UBL 2.1)**. |
| **Terminal Caja POS y Backoffice (`admin-web`)** | [`apps/admin-web`](./apps/admin-web) | `3020` | Aplicación corporativa para Cajeros y Administradores: Escáner QR por cámara (`@zxing/library`) e ingreso manual, acreditación de sellos y emisión automática de **Factura Electrónica DIAN con CUFE SHA-384**, canje asistido de premios en barra, Dashboard de KPIs, anulación con **Nota Crédito DIAN**, gestión de clientes y ajustes manuales de sellos, CRUD de sedes/productos/banner y configuración de resolución DIAN. |
| **App Móvil Híbrida (`customer-mobile`)** | [`apps/customer-mobile`](./apps/customer-mobile) | `3030` | Aplicación móvil nativa/híbrida construida con **Ionic Framework + Vue 3 + Capacitor 6** lista para empaquetado Android (`.apk` / `.aab`) e iOS. |

---

## 2. Estructura del Repositorio

```text
TicketSystem/
├── apps/
│   ├── customer-web/                   # SPA/PWA de Clientes (Vue 3 + Vite + Tailwind)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── AuthModal.vue       # Autenticación JWT
│   │   │   │   └── DianInvoiceModal.vue# Visor e impresora térmica/PDF + descarga XML DIAN
│   │   │   ├── views/
│   │   │   │   ├── HomeView.vue        # Inicio, progreso de 8 sellos, banner dinámico y vitrina
│   │   │   │   ├── CardView.vue        # Tarjeta digital, carnet QR de socio e historial de ciclos
│   │   │   │   ├── RewardsView.vue     # Billetera de premios y generación de QR de canje
│   │   │   │   ├── StoresView.vue      # Directorio de sedes físicas
│   │   │   │   └── ProfileView.vue     # Perfil, NIT/CC DIAN, Mis Facturas DIAN y seguridad
│   │   │   ├── api.ts                  # Cliente HTTP con inyección JWT Bearer
│   │   │   └── debugConsole.ts         # SDK interactivo de consola JS (window.__confyDebug)
│   │   └── vite.config.ts
│   │
│   ├── admin-web/                      # Terminal Caja POS y Backoffice Administrativo
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   └── DianInvoiceModal.vue# Tirilla POS 80mm, QR DIAN, CUFE, descarga XML/JSON
│   │   │   ├── views/
│   │   │   │   ├── CashierView.vue     # Terminal POS de caja + editor de banner con vista previa
│   │   │   │   └── DashboardView.vue   # Backoffice: KPIs, Productos, Sedes, Clientes y DIAN
│   │   │   ├── api.ts                  # Cliente HTTP administrativo y POS
│   │   │   └── debugConsole.ts         # SDK de diagnóstico en consola JS
│   │   └── vite.config.ts
│   │
│   └── customer-mobile/                # App Móvil Ionic + Capacitor 6 (Android / iOS)
│       ├── src/views/                  # TabHome, TabCard, TabQr, TabCatalog, TabProfile
│       └── capacitor.config.ts
│
├── scripts/                            # Scripts de automatización de túneles de desarrollo
├── package.json                        # Configuración central de NPM Workspaces
└── .env.example                        # Variables de conexión con TicketSystemBack
```

---

## 3. Instalación y Ejecución Local

### Requisitos Previos
* **Node.js 20+** y **NPM 10+**
* Tener corriendo el backend **[`TicketSystemBack`](https://github.com/Huesly/TicketSystemBack)** en `http://localhost:8088` (el proxy de Vite en `customer-web` y `admin-web` redirige automáticamente `/api` hacia `http://127.0.0.1:8088`).

### Comandos de Desarrollo

```bash
# 1. Instalar dependencias de las 3 aplicaciones en un solo paso
npm install

# 2. Iniciar App Web de Clientes (http://localhost:3010)
npm run dev:web

# 3. Iniciar Terminal Caja POS y Backoffice Admin (http://localhost:3020)
npm run dev:admin

# 4. Iniciar App Móvil Híbrida (http://localhost:3030)
npm run dev:mobile

# 5. Compilar y verificar tipado TypeScript de todas las aplicaciones para producción
npm run build:all
```

---

## 4. Despliegue en Producción (Vercel / Cloudflare Pages / Netlify)

Gracias a la arquitectura de **NPM Workspaces**, puedes conectar este repositorio `Huesly/TicketSystem` en **Vercel** o **Cloudflare Pages** y desplegar cada aplicación en su propio subdominio de forma independiente:

1. **Despliegue de App de Clientes (`app.tudominio.com`):**
   - **Root Directory:** `apps/customer-web`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Variable de Entorno:** `VITE_API_URL=https://api.tudominio.com/api/v1`

2. **Despliegue de Terminal POS y Backoffice (`pos.tudominio.com`):**
   - **Root Directory:** `apps/admin-web`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Variable de Entorno:** `VITE_API_URL=https://api.tudominio.com/api/v1`

---

## 5. Consola Interactiva de Diagnóstico JS (`window.__confyDebug`)

Tanto `customer-web` como `admin-web` exponen en las herramientas de desarrollador del navegador (**F12 → Console**) el objeto `window.__confyDebug` para pruebas de ciberseguridad y diagnóstico en vivo:

```javascript
__confyDebug.help()                   // Muestra la tabla de comandos interactivos
await __confyDebug.securityAudit()    // Verifica cabeceras CSP/HSTS, WAF, Rate Limit e IP
await __confyDebug.testSqlInjection() // Simula un payload SQLi y verifica el bloqueo 400 del WAF
await __confyDebug.testRateLimit(5)   // Dispara una ráfaga de peticiones y mide X-RateLimit-Remaining
__confyDebug.inspectSession()         // Decodifica el token JWT activo, roles y fecha de expiración
__confyDebug.clearSession()           // Limpia el token JWT en localStorage y recarga en pantalla de Login
```
