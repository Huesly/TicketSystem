# ConfyTickets — Plataforma Digital de Fidelización Multisede

Plataforma de fidelización para cafeterías con múltiples sedes. Permite acumular sellos en compras realizadas en establecimientos participantes, completar tarjetas digitales de 8 sellos y redimir recompensas configurables mediante códigos QR dinámicos de un solo uso.

---

## 📁 Estructura del Monorepo

```text
ConfyTickets/
├── apps/
│   ├── customer-mobile/       # App móvil Android & iOS (Ionic 7 + Vue 3 + Capacitor 6)
│   ├── customer-web/          # Aplicación Web de Clientes (Vue 3 + Vite + PWA)
│   ├── admin-web/             # Panel Web Administrativo y Punto de Caja (POS)
│   └── shared/                # Tipos TypeScript, constantes y contratos comunes
│
├── backend/
│   ├── app/                   # API Central en FastAPI (Python 3.11+)
│   ├── migrations/            # Migraciones de base de datos con Alembic
│   ├── tests/                 # Suite de pruebas unitarias y de integración (Pytest)
│   ├── requirements.txt       # Dependencias de Python
│   └── Dockerfile             # Contenedor del backend
│
├── workers/                   # Tareas programadas y asíncronas con Celery & Redis
├── infrastructure/            # Manifiestos de despliegue y configuraciones Docker
├── documentation/             # Documentación técnica completa previa al desarrollo
├── docker-compose.yml         # Servicios locales (PostgreSQL 15, Redis 7, Adminer)
└── .env.example               # Variables de entorno base
```

---

## 🚀 Inicio Rápido del Entorno de Desarrollo

### 1. Prerrequisitos
- **Node.js** v20+ o v25+ con **npm** (Verificado)
- **Git** (Verificado)
- **Docker & Docker Compose** (Verificado)
- **Python** 3.11+ (Recomendado para desarrollo local del backend)

### 2. Levantar Servicios de Infraestructura (Base de Datos y Cache)
```bash
# Copiar variables de entorno
cp .env.example .env

# Levantar PostgreSQL 15, Redis 7 y Adminer
docker compose up -d
```
- **PostgreSQL:** `localhost:5432` (El esquema de 25 tablas se inicializa automáticamente).
- **Adminer (Visor BD):** `http://localhost:8080` (Sistema: PostgreSQL, Servidor: `postgres`, Usuario: `confy_admin`, BD: `confytickets_db`).
- **Redis:** `localhost:6379`.

---

## 📚 Documentación Técnica Completa
Para consultar especificaciones de requerimientos, MER, DER, APIs y flujos de negocio, visita:  
👉 **[documentation/README.md](./documentation/README.md)**
