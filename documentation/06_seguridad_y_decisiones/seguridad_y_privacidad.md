# Seguridad, Mitigación de Fraude y Privacidad (Habeas Data)

**Proyecto:** Plataforma de Fidelización Multisede para Cafeterías (ConfyTickets)  
**Marco Normativo:** Ley 1581 de 2012 (Colombia) / Circular Externa 002 SIC  
**Estándar de Seguridad:** OWASP API Security Top 10 (2023)  
**Versión:** 1.0  
**Fecha:** Noviembre 2026  

---

## 1. Mitigación OWASP API Security Top 10

| Riesgo OWASP | Vector Potencial en la Plataforma | Mecanismo de Control y Mitigación Implementado |
|---|---|---|
| **API1:2023 - BOLA (Broken Object Level Authorization)** | Un cliente intenta consultar compras o tarjetas de otro usuario cambiando el UUID en la URL. | Validación forzada de pertenencia: el backend extrae el `user_id` exclusivamente del JWT verificado y restringe las consultas a `WHERE customer_id = :authenticated_user_id`. |
| **API2:2023 - Broken Authentication** | Robo o interceptación de tokens; ataques de fuerza bruta en login. | Autenticación gestionada por Supabase Auth con JWKS asimétrico, expiración corta de JWT, refresh tokens con rotación y MFA obligatorio para administradores. |
| **API3:2023 - BOPLA (Broken Property Level Authorization)** | Un cliente intenta inyectar el número de sellos a acreditar enviando campos ocultos en la petición. | Modelos estrictos de entrada con Pydantic (`extra = "forbid"`). Los endpoints de caja solo reciben importe y comprobante; el cálculo de sellos se realiza estrictamente en el backend. |
| **API4:2023 - Consumo Desmedido de Recursos** | Ataque de denegación de servicio solicitando miles de códigos QR por minuto. | Rate limiting en Redis: máximo 5 solicitudes de QR por minuto por cliente y máximo 60 peticiones por minuto por IP. |
| **API5:2023 - BFLA (Broken Function Level Authorization)** | Un cajero intenta modificar la configuración de reglas del programa o un cliente intenta acceder a `/admin`. | Sistema RBAC estricto evaluado mediante dependencias de FastAPI (`RoleChecker(['OWNER', 'GENERAL_ADMIN'])`). |
| **API6:2023 - Acceso a Flujos Sensibles del Negocio** | Doble redención de un beneficio o acreditación duplicada de sellos con el mismo comprobante. | Idempotencia en cabecera `Idempotency-Key`, restricción de base de datos `UNIQUE (business_id, store_id, receipt_reference)` y consumo atómico de tokens QR con `SELECT FOR UPDATE`. |
| **API7:2023 - Server-Side Request Forgery (SSRF)** | Inyección de URLs maliciosas en enlaces de banners para escanear redes internas. | Lista blanca de dominios permitidos y validación estricta de esquemas URL antes de persistir banners. |
| **API8:2023 - Configuración Errónea de Seguridad** | Exposición de trazas de error con información de base de datos o claves API en clientes móviles. | Manejador global de excepciones que retorna un envelope neutral (`INTERNAL_ERROR`) con un identificador de seguimiento `request_id`. Auditoría de bundles de Capacitor para evitar inclusión de secretos de backend. |
| **API9:2023 - Gestión Inadecuada de Inventario** | Coexistencia de endpoints deprecados y desprotegidos. | Versionamiento explícito en ruta `/api/v1` y documentación automática generada con OpenAPI / Swagger protegida en ambientes productivos. |
| **API10:2023 - Consumo Inseguro de APIs Externas** | Fallos en la comunicación con Firebase Cloud Messaging o Supabase Storage. | Timeouts estrictos de 3 segundos, validación de payloads de respuesta y reintentos automáticos desacoplados en trabajadores Celery. |

---

## 2. Marco de Privacidad y Habeas Data (Colombia - Ley 1581 de 2012)

La plataforma recopila información personal identificable (PII) de ciudadanos en Colombia, por lo cual su arquitectura cumple de forma nativa con los principios rectores de tratamiento de datos:

### 2.1. Separación de Finalidades y Consentimiento Informado
El sistema divide las finalidades de tratamiento en la tabla `consents`:
1. **Finalidad Esencial (Obligatoria):** Gestión de la cuenta, tarjeta de fidelización, acumulación de sellos y entrega de premios en caja.
2. **Finalidad Publicitaria (Opcional):** Envío de promociones comerciales, ofertas de temporada y banners informativos por push.
3. **Finalidad de Geolocalización (Opcional):** Detección de proximidad física a las sedes de la cafetería.

> **Regla de Producto:** El cliente puede desmarcar en cualquier momento las finalidades opcionales desde su Perfil sin perder su cuenta ni los sellos que haya acumulado.

### 2.2. Principio de Minimización de Datos
- El código QR presentado en caja **no contiene datos personales** (sin nombre, sin correo, sin teléfono y sin cédula). Únicamente transmite un token temporal opaco aleatorio.
- Las notificaciones de proximidad por geofencing se procesan **localmente en el dispositivo del cliente**, evitando registrar un historial continuo de ubicaciones GPS del usuario en el servidor.

### 2.3. Trazabilidad y Atención de Derechos ARCO
- El titular de los datos puede ejercer sus derechos de Actualización, Rectificación y Cancelación/Supresión a través de los canales configurados en la aplicación.
- En caso de solicitud de supresión de cuenta, los registros contables y fiscales de compras se anonimizan conforme a las obligaciones de conservación del estatuto tributario colombiano.
