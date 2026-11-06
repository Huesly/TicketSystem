# Suite de Documentación Técnica y de Ingeniería — ConfyTickets

**Proyecto:** Plataforma de Fidelización Multisede para Cafeterías (Mobile Android/iOS, Web Clientes y Panel POS/Admin)  
**Versión:** 1.0  
**Fecha de Publicación:** Noviembre 2026  
**Línea Base de Referencia:** Especificación de Producto v1.0  

---

## 1. Índice General de Documentos

Toda la documentación técnica previa a la fase de desarrollo ha sido desacoplada y estructurada en carpetas temáticas especializadas para cada equipo y área de trabajo:

```text
documentation/
├── 01_levantamiento_requerimientos/
│   ├── requerimientos_funcionales.md        # Catálogo RF-001 a RF-026 por módulos funcionales
│   └── requerimientos_no_funcionales.md      # Catálogo RNF-001 a RNF-020 bajo estándar ISO/IEC 25010
│
├── 02_procesos_y_flujos/
│   ├── mapa_de_procesos.md                  # Macroprocesos Estratégicos, Misionales y de Soporte
│   └── flujos_de_sistema.md                 # Diagramas de secuencia y flujogramas Mermaid punto a punto
│
├── 03_base_de_datos/
│   ├── mer_conceptual.md                    # Modelo Entidad-Relación Conceptual y Cardinalidades
│   ├── der_logico_fisico.md                 # Diagrama Entidad-Relación (ERD) Lógico y Físico con tipos
│   ├── diccionario_de_datos.md              # Diccionario detallado de las 25 tablas del sistema
│   └── esquema_ddl_postgresql.sql           # Script SQL ejecutable en PostgreSQL 15+ con índices y constraints
│
├── 04_arquitectura_y_apis/
│   ├── arquitectura_tecnica.md              # Topología de software, micro-frontends, FastAPI y Celery
│   └── especificacion_api_rest.md           # Contratos RESTful, endpoints, payloads JSON e idempotencia
│
├── 05_especificacion_por_areas/
│   ├── area_mobile_android_ios.md           # Ionic 7, Vue 3, Capacitor 6, plugins nativos y geofencing
│   ├── area_web_clientes.md                 # Vue 3, PWA, Web Push y navegación adaptativa
│   ├── area_web_admin_y_caja.md             # Terminal POS de caja (escaneo QR) y backoffice administrativo
│   └── area_backend_y_workers.md            # Clean Architecture en FastAPI, motor transaccional y Celery
│
└── 06_seguridad_y_decisiones/
    ├── seguridad_y_privacidad.md            # Mitigación OWASP API Security y Habeas Data (Ley 1581)
    └── checklist_decisiones_negocio.md      # 24 decisiones de negocio pendientes previo a producción
```

---

## 2. Acceso Rápido por Perfil del Equipo

- **Equipo de Base de Datos y Backend:** Consultar el [Diccionario de Datos](file:///c:/Users/devfs/Desktop/ConfyTickets/documentation/03_base_de_datos/diccionario_de_datos.md), el [Script DDL](file:///c:/Users/devfs/Desktop/ConfyTickets/documentation/03_base_de_datos/esquema_ddl_postgresql.sql) y la [Arquitectura Backend](file:///c:/Users/devfs/Desktop/ConfyTickets/documentation/05_especificacion_por_areas/area_backend_y_workers.md).
- **Equipo Mobile (Android & iOS):** Consultar la [Especificación Mobile](file:///c:/Users/devfs/Desktop/ConfyTickets/documentation/05_especificacion_por_areas/area_mobile_android_ios.md) y los [Flujos del Sistema](file:///c:/Users/devfs/Desktop/ConfyTickets/documentation/02_procesos_y_flujos/flujos_de_sistema.md).
- **Equipo Frontend Web y Punto de Venta:** Consultar la [Especificación Web Clientes](file:///c:/Users/devfs/Desktop/ConfyTickets/documentation/05_especificacion_por_areas/area_web_clientes.md) y la [Especificación de Caja/Admin](file:///c:/Users/devfs/Desktop/ConfyTickets/documentation/05_especificacion_por_areas/area_web_admin_y_caja.md).
- **Product Owners y Stakeholders:** Consultar los [Requerimientos Funcionales](file:///c:/Users/devfs/Desktop/ConfyTickets/documentation/01_levantamiento_requerimientos/requerimientos_funcionales.md), el [Mapa de Procesos](file:///c:/Users/devfs/Desktop/ConfyTickets/documentation/02_procesos_y_flujos/mapa_de_procesos.md) y la [Matriz de Decisiones Comerciales](file:///c:/Users/devfs/Desktop/ConfyTickets/documentation/06_seguridad_y_decisiones/checklist_decisiones_negocio.md).
