# Especificación de Requerimientos No Funcionales (RNF)

**Proyecto:** Plataforma de Fidelización Multisede para Cafeterías (ConfyTickets)  
**Estándar de Clasificación:** ISO/IEC 25010 (Calidad del Producto de Software)  
**Versión:** 1.0  
**Fecha:** Noviembre 2026  

---

## 1. Matriz de Requerimientos No Funcionales

| Código | Categoría ISO 25010 | Requisito Clave | Métrica / Criterio Objetivo | Nivel Crítico |
|---|---|---|---|:---:|
| **RNF-001** | Rendimiento (Eficiencia de Desempeño) | Tiempo de Respuesta API | $p95 < 800\text{ ms}$ en endpoints de lectura y cálculo habituales | ALTO |
| **RNF-002** | Rendimiento (Eficiencia de Desempeño) | Latencia en Registro de Caja | $p99 < 1.2\text{ s}$ en la transacción combinada de consumo de QR + compra + sellos | CRÍTICO |
| **RNF-003** | Rendimiento (Eficiencia de Desempeño) | Rendimiento Concurrente | Soportar mínimo 50 transacciones concurrentes simultáneas sin bloqueos de tabla | ALTO |
| **RNF-004** | Seguridad (Confidencialidad) | Autenticación y Autorización | Validación estricta de JWT en cada petición con firma criptográfica asimétrica | CRÍTICO |
| **RNF-005** | Seguridad (Integridad) | Protección contra Doble Gasto | Idempotencia en endpoints mutables con cabecera `Idempotency-Key` y bloqueos de fila (`FOR UPDATE`) | CRÍTICO |
| **RNF-006** | Seguridad (No repudio) | Bitácora de Auditoría Completa | Registro inmutable de acciones privilegiadas en tabla `audit_logs` con JSONB diff | ALTO |
| **RNF-007** | Seguridad (Comunicaciones) | Cifrado en Tránsito y Reposo | TLS 1.3 obligatorio en todas las capas; AES-256 en base de datos y respaldos | CRÍTICO |
| **RNF-008** | Seguridad (Protección QR) | Token Efímero de Alta Entropía | Tokens aleatorios con hash SHA-256 en base de datos; caducidad fija a 60 segundos; 1 solo uso | CRÍTICO |
| **RNF-009** | Fiabilidad (Disponibilidad) | Nivel de Servicio (SLA) | 99.5 % de disponibilidad mensual en servicios core de backend y base de datos | ALTO |
| **RNF-010** | Fiabilidad (Recuperabilidad) | Objetivos RPO y RTO | $\text{RPO} \le 24\text{ horas}$ (backups diarios) o PITR; $\text{RTO} \le 4\text{ horas}$ para restauración total | ALTO |
| **RNF-011** | Usabilidad (Experiencia de Usuario) | Tiempo de Obtención de QR | Menos de 2 clics desde la pantalla principal para desplegar el QR de identificación | ALTO |
| **RNF-012** | Usabilidad (Accesibilidad) | Estándar WCAG 2.2 Nivel AA | Contraste mínimo 4.5:1, etiquetas ARIA, soporte para lectores de pantalla y fuentes escalables | MEDIO |
| **RNF-013** | Compatibilidad (Plataformas) | Ecosistema Móvil Multiplataforma | Android 8.0+ (API 26+) y iOS 14.0+ mediante runtime Capacitor | CRÍTICO |
| **RNF-014** | Compatibilidad (Web Browsers) | Navegadores Modernos | Chrome 100+, Safari 15+, Firefox 100+, Edge (últimas 2 versiones) | ALTO |
| **RNF-015** | Mantenibilidad (Modularidad) | Arquitectura Hexagonal / Limpia | Código estructurado por módulos de dominio independientes en FastAPI y Vue 3 | ALTO |
| **RNF-016** | Mantenibilidad (Versionado BD) | Control de Esquema por Migraciones | Uso estricto de Alembic para todos los cambios DDL de PostgreSQL | ALTO |
| **RNF-017** | Mantenibilidad (Cobertura de Pruebas) | Cobertura Mínima Automatizada | $\ge 80\,\%$ de cobertura en el núcleo de cálculo de sellos, redención y transacciones | ALTO |
| **RNF-018** | Escalabilidad (Capacidad) | Crecimiento Multisede Horizontal | Soporte para incorporar nuevas sedes y programas sin alterar esquemas ni código base | ALTO |
| **RNF-019** | Cumplimiento Legal (Privacidad) | Ley 1581 de 2012 (Colombia) | Separación obligatoria de finalidades (Operación vs Marketing vs Ubicación); registro de consentimientos | CRÍTICO |
| **RNF-020** | Protección de Datos | Principio de Minimización | El QR y los registros de caja no contienen PII innecesaria (sin cédulas ni emails expuestos en pantallas) | ALTO |

---

## 2. Detalle de Requerimientos Críticos

### 2.1. Concurrencia e Integridad Transaccional (RNF-002, RNF-005)
1. **Aislamiento:** La base de datos debe utilizar nivel de aislamiento `READ COMMITTED` como mínimo, y bloqueos pesimistas `SELECT ... FOR UPDATE` sobre la fila de la tarjeta (`loyalty_cards`) al calcular sellos o emitir recompensas.
2. **Idempotencia:** Toda petición `POST /cashier/purchases` o `POST /cashier/redemptions` debe validar la cabecera `Idempotency-Key: <UUID>`. Si la petición ya fue procesada, el backend retorna exactamente el resultado previo almacenado sin re-ejecutar el cálculo ni duplicar sellos.

### 2.2. Seguridad de Códigos QR (RNF-008)
1. Los códigos QR nunca representan un ID estático de cliente ni un JWT.
2. Cada solicitud de QR genera un string aleatorio de 32 bytes criptográficos (alta entropía).
3. En la base de datos se almacena únicamente el hash SHA-256 del token: `token_hash = sha256(secret_token)`.
4. El cajero envía el token en texto plano escaneado, el backend aplica `sha256` y busca el hash exacto en la tabla `qr_tokens` verificando `consumed_at IS NULL AND expires_at > NOW()`.
5. Si coincide, se actualiza atómicamente `consumed_at = NOW()` dentro de la misma transacción de compra.

### 2.3. Cumplimiento Legal Habeas Data - Colombia (RNF-019)
1. **Consentimiento Explícito:** Al registrarse, el cliente debe marcar activamente (sin casillas premarcadas) la aceptación de los Términos y la Política de Tratamiento de Datos.
2. **Canales de Revocación:** El cliente puede en cualquier momento revocar el consentimiento de comunicaciones comerciales desde su pantalla de Perfil (`PATCH /me/notification-preferences`), lo cual no bloquea su derecho a seguir acumulando sellos transaccionales.
3. **Derechos ARCO:** El backend debe proporcionar mecanismos para exportar datos del cliente y tramitar solicitudes de supresión de datos conforme a los tiempos de retención fiscal y comercial establecidos por ley.
