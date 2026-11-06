# Matriz de Decisiones Comerciales Previas al Desarrollo (Go-Live)

**Proyecto:** Plataforma de Fidelización Multisede para Cafeterías (ConfyTickets)  
**Versión:** 1.0  
**Fecha:** Noviembre 2026  
**Propósito:** Definir los parámetros de negocio pendientes que deben ser formalmente aprobados por el propietario de la marca antes de la puesta en marcha de las reglas comerciales en producción.

---

## 1. Matriz de Decisiones Comerciales y Operativas

| N.º | Tema Comercial | Pregunta por Resolver | Recomendación Técnica / Por Defecto | Impacto en Desarrollo | Estado de Aprobación |
|:---:|---|---|---|---|:---:|
| **01** | **Importe Mínimo ($M$)** | ¿Cuál es el valor mínimo de compra para tener derecho a sello? | **$10.000 COP** (fomenta ticket promedio). | Motor de sellos (`loyalty_program_versions`) | [ ] Pendiente |
| **02** | **Valor por Sello ($T$)** | ¿Cuánto consumo elegible equivale a un sello? | **$10.000 COP** por sello acumulado. | Fórmula de cálculo en backend | [ ] Pendiente |
| **03** | **Tope por Compra ($C$)** | ¿Cuántos sellos como máximo puede generar una sola factura? | **Máximo 3 sellos** por compra (evita agotar tarjetas en una sola cuenta grupal). | Límite superior de acumulación | [ ] Pendiente |
| **04** | **Fórmula de Cálculo** | ¿Una compra que supera el mínimo siempre gana al menos 1 sello? | **Sí**: $\min(C, \max(1, \lfloor V / T \rfloor))$ | Algoritmo nuclear de fidelización | [ ] Pendiente |
| **05** | **Descuentos Comerciales** | ¿El cálculo se realiza sobre valor bruto o neto de descuentos? | **Neto de descuentos** (solo sobre dinero efectivamente pagado). | Normalización de factura en caja | [ ] Pendiente |
| **06** | **Impuestos (IVA / INC)** | ¿El impuesto al consumo/IVA suma para sellos? | **Sí**, para simplificar la lectura directa del total de la factura por el cajero. | Cálculo del importe elegible | [ ] Pendiente |
| **07** | **Propinas voluntarias** | ¿Las propinas suman para otorgar sellos? | **No**, se excluyen estrictamente. | Lógica de cálculo en caja | [ ] Pendiente |
| **08** | **Cortesías y bonos** | ¿Productos de cortesía o bonos de regalo suman sellos? | **No**, se excluyen de la base elegible. | Validación en backend | [ ] Pendiente |
| **09** | **Devoluciones de Venta** | ¿Cómo se procede ante una anulación o devolución en caja? | **Reversión de sellos** (`movement_type = 'REVERSAL'`) con registro de motivo. | Auditoría y balance de tarjeta | [ ] Pendiente |
| **10** | **Arrastre de Sellos** | ¿Los sellos sobrantes pasan a la tarjeta del ciclo siguiente? | **Sí**, arrastre atómico (*carry-over*) al ciclo consecutivo. | Lógica de transición de tarjetas | [ ] Pendiente |
| **11** | **Vencimiento de Sellos** | ¿Cuánto tiempo dura un sello antes de expirar? | **Sin vencimiento en MVP** o 180 días por inactividad prolongada. | Celery Beat Worker diario | [ ] Pendiente |
| **12** | **Vencimiento de Premios**| ¿Cuántos días tiene el cliente para redimir su recompensa? | **30 días calendario** desde su emisión. | Celery Beat Worker diario | [ ] Pendiente |
| **13** | **Catálogo de Premios** | ¿Qué recompensas se ofrecerán al completar los 8 sellos? | **1 Bebida a base de café (12oz) o 1 porción de repostería del día**. | Catálogo inicial en base de datos | [ ] Pendiente |
| **14** | **Sedes Iniciales** | ¿Cuáles son las sedes, nombres, direcciones y coordenadas? | Registrar las primeras sucursales piloto (ej. Sede Centro, Sede Principal). | Seed inicial de base de datos | [ ] Pendiente |
| **15** | **Ajustes Manuales** | ¿Quién puede asignar sellos manuales de excepción? | **Solo rol OWNER y GENERAL_ADMIN** con justificación obligatoria. | Permisos RBAC | [ ] Pendiente |
| **16** | **Numeración de Factura** | ¿Qué formato tienen los comprobantes de caja de la cafetería? | Formato alfanumérico del POS (ej. `FAC-XXXXX` o número de ticket). | Restricción única antiduplicados | [ ] Pendiente |
| **17** | **Integración POS** | ¿El sistema de caja actual cuenta con API para sincronización? | En MVP: **Registro manual asistido por lector QR**. En Fase 2: Integración API POS. | Alcance de desarrollo | [ ] Pendiente |
| **18** | **Categorías de Alerta** | ¿Qué categorías de notificación se habilitan en el MVP? | **Transaccionales** (compras/premios) y **Recordatorios** de bienvenida. | Configuración inicial de mensajería | [ ] Pendiente |
| **19** | **Frecuencia de Marketing**| ¿Se aprueban los límites de saturación comercial sugeridos? | **Máximo 1 push comercial al día, máximo 3 por semana**. | Filtro de audiencia en Celery | [ ] Pendiente |
| **20** | **Radio de Geocerca** | ¿Qué perímetro de proximidad se configura por sede? | **150 metros** alrededor de las coordenadas de la sede. | Plugin nativo de geofencing | [ ] Pendiente |
| **21** | **Identidad de Marca** | ¿Se cuenta con manual de marca, paleta oficial y logotipo? | Usar paleta cálida (Café/Moca/Crema) hasta entrega de branding oficial. | Hojas de estilo y assets UI | [ ] Pendiente |
| **22** | **Responsable Legal Datos**| ¿Quién figura como responsable del tratamiento de datos? | Razón social y NIT de la empresa propietaria de la cafetería. | Política de Tratamiento Ley 1581 | [ ] Pendiente |
| **23** | **Infraestructura Cloud**| ¿Qué proveedor y presupuesto se destinarán al hosting? | Servidor VPS Dockerizado (FastAPI + Postgres + Redis) + Supabase Cloud. | Configuración de despliegue | [ ] Pendiente |
| **24** | **Cuentas de App Store** | ¿Quién será el titular de las cuentas de Google Play y Apple? | Cuentas corporativas a nombre de la empresa titular. | Publicación y certificados nativos | [ ] Pendiente |
