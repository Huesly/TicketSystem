# Diccionario Técnico de Datos

**Proyecto:** Plataforma de Fidelización Multisede para Cafeterías (ConfyTickets)  
**Motor:** PostgreSQL 15+  
**Versión:** 1.0  
**Fecha:** Noviembre 2026  

---

## 1. Módulo Organización y Multisedes

### Tabla: `businesses`
Almacena la entidad jurídica o marca comercial propietaria de la cadena de cafeterías.

| Columna | Tipo de Dato | Nulo | Default | Restricciones | Descripción |
|---|---|:---:|---|---|---|
| `id` | `UUID` | No | `gen_random_uuid()` | PK | Identificador único del negocio |
| `name` | `VARCHAR(120)` | No | | | Nombre comercial de la marca de cafeterías |
| `legal_name` | `VARCHAR(180)` | Sí | NULL | | Razón social o persona jurídica |
| `status` | `VARCHAR(20)` | No | `'active'` | CHECK (`status IN ('active', 'suspended', 'archived')`) | Estado operativo del negocio |
| `default_currency` | `CHAR(3)` | No | `'COP'` | | Código ISO 4217 de la moneda inicial |
| `timezone` | `VARCHAR(50)` | No | `'America/Bogota'` | | Zona horaria principal |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | | Fecha de creación del registro |
| `updated_at` | `TIMESTAMPTZ` | No | `NOW()` | | Fecha de última modificación |

---

### Tabla: `stores`
Establecimientos físicos o sucursales donde los clientes realizan consumos y redenciones.

| Columna | Tipo de Dato | Nulo | Default | Restricciones | Descripción |
|---|---|:---:|---|---|---|
| `id` | `UUID` | No | `gen_random_uuid()` | PK | Identificador único de la sede |
| `business_id` | `UUID` | No | | FK -> `businesses(id)` ON DELETE RESTRICT | Negocio al que pertenece la sede |
| `code` | `VARCHAR(30)` | No | | UNIQUE por `business_id` | Código interno de la sede (ej. `SEDE-01`) |
| `name` | `VARCHAR(120)` | No | | | Nombre visible al público (ej. "Sede Cabecera") |
| `address` | `VARCHAR(255)` | No | | | Dirección física completa |
| `city` | `VARCHAR(80)` | No | | | Ciudad (ej. Bucaramanga, Bogotá) |
| `department` | `VARCHAR(80)` | No | | | Departamento / Estado |
| `country` | `CHAR(2)` | No | `'CO'` | | Código ISO del país |
| `latitude` | `NUMERIC(10, 7)`| Sí | NULL | | Latitud para geofencing |
| `longitude` | `NUMERIC(10, 7)`| Sí | NULL | | Longitud para geofencing |
| `geofence_radius_meters` | `INTEGER` | No | `150` | CHECK (`> 0`) | Radio perimetral para notificaciones de cercanía |
| `timezone` | `VARCHAR(50)` | No | `'America/Bogota'` | | Zona horaria específica de la sede |
| `opening_hours` | `JSONB` | No | `'{}'::jsonb` | | Estructura semanal de horarios de apertura |
| `phone` | `VARCHAR(30)` | Sí | NULL | | Teléfono de contacto de la sucursal |
| `status` | `VARCHAR(20)` | No | `'active'` | CHECK (`status IN ('active', 'inactive')`) | Estado de la sede |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | | Fecha de creación |
| `updated_at` | `TIMESTAMPTZ` | No | `NOW()` | | Fecha de actualización |

---

## 2. Módulo Usuarios, Membresías y Roles

### Tabla: `profiles`
Información de perfil de los usuarios (clientes y empleados), vinculada a Supabase Auth.

| Columna | Tipo de Dato | Nulo | Default | Restricciones | Descripción |
|---|---|:---:|---|---|---|
| `id` | `UUID` | No | | PK, FK -> `auth.users(id)` ON DELETE CASCADE | ID de usuario emitido por Supabase Auth |
| `full_name` | `VARCHAR(150)` | No | | | Nombre completo o nombre preferido |
| `email` | `VARCHAR(255)` | No | | UNIQUE | Correo electrónico principal |
| `phone` | `VARCHAR(30)` | Sí | NULL | | Teléfono móvil opcional |
| `status` | `VARCHAR(20)` | No | `'active'` | CHECK (`status IN ('active', 'blocked', 'suspended')`) | Estado de la cuenta en el sistema |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | | Fecha de registro |
| `updated_at` | `TIMESTAMPTZ` | No | `NOW()` | | Fecha de modificación |

---

### Tabla: `business_memberships`
Roles del personal administrativo y operativo asignados a un negocio.

| Columna | Tipo de Dato | Nulo | Default | Restricciones | Descripción |
|---|---|:---:|---|---|---|
| `id` | `UUID` | No | `gen_random_uuid()` | PK | Identificador único de la membresía |
| `business_id` | `UUID` | No | | FK -> `businesses(id)` ON DELETE CASCADE | Negocio donde labora el empleado |
| `user_id` | `UUID` | No | | FK -> `profiles(id)` ON DELETE CASCADE | Usuario asignado |
| `role` | `VARCHAR(30)` | No | | CHECK (`role IN ('OWNER', 'GENERAL_ADMIN', 'STORE_ADMIN', 'CASHIER', 'MARKETING')`) | Rol con permisos en el sistema |
| `status` | `VARCHAR(20)` | No | `'active'` | CHECK (`status IN ('active', 'inactive')`) | Estado de la asignación |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | | Fecha de vinculación |
| `updated_at` | `TIMESTAMPTZ` | No | `NOW()` | | Fecha de actualización |

*Restricción:* `UNIQUE(business_id, user_id)`

---

### Tabla: `membership_store_assignments`
Sedes físicas específicas en las que un empleado está autorizado a operar en caja o administración.

| Columna | Tipo de Dato | Nulo | Default | Restricciones | Descripción |
|---|---|:---:|---|---|---|
| `membership_id` | `UUID` | No | | PK, FK -> `business_memberships(id)` ON DELETE CASCADE | Membresía del empleado |
| `store_id` | `UUID` | No | | PK, FK -> `stores(id)` ON DELETE CASCADE | Sede donde tiene permisos operativos |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | | Fecha de asignación |

---

## 3. Módulo Programas, Versiones y Reglas de Fidelización

### Tabla: `loyalty_programs`
Cabecera del programa de fidelización del negocio.

| Columna | Tipo de Dato | Nulo | Default | Restricciones | Descripción |
|---|---|:---:|---|---|---|
| `id` | `UUID` | No | `gen_random_uuid()` | PK | Identificador del programa |
| `business_id` | `UUID` | No | | FK -> `businesses(id)` ON DELETE RESTRICT | Negocio dueño del programa |
| `name` | `VARCHAR(120)` | No | | | Nombre del programa (ej. "Club Café Confy") |
| `status` | `VARCHAR(20)` | No | `'active'` | CHECK (`status IN ('draft', 'active', 'paused', 'archived')`) | Estado general |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | | Fecha de creación |
| `updated_at` | `TIMESTAMPTZ` | No | `NOW()` | | Fecha de actualización |

---

### Tabla: `loyalty_program_versions`
Versiones inmutables de las reglas comerciales de fidelización.

| Columna | Tipo de Dato | Nulo | Default | Restricciones | Descripción |
|---|---|:---:|---|---|---|
| `id` | `UUID` | No | `gen_random_uuid()` | PK | Identificador de la versión de reglas |
| `program_id` | `UUID` | No | | FK -> `loyalty_programs(id)` ON DELETE RESTRICT | Programa asociado |
| `version_number` | `INTEGER` | No | `1` | CHECK (`version_number >= 1`) | Número secuencial de versión |
| `stamps_required`| `SMALLINT` | No | `8` | CHECK (`stamps_required > 0`) | Meta de sellos por tarjeta (inicialmente 8) |
| `minimum_purchase`| `BIGINT` | No | `0` | CHECK (`minimum_purchase >= 0`) | Compra mínima para obtener sello (COP) |
| `amount_per_stamp`| `BIGINT` | No | `10000` | CHECK (`amount_per_stamp > 0`) | Valor elegible por sello (COP) |
| `max_stamps_per_purchase`| `SMALLINT`| No | `3` | CHECK (`>= 1`) | Máximo de sellos en una misma compra |
| `stamp_expiry_days`| `INTEGER` | Sí | NULL | CHECK (`> 0`) | Días de vigencia del sello (null = no vence) |
| `reward_expiry_days`| `INTEGER`| Sí | `30` | CHECK (`> 0`) | Días para redimir recompensa generada |
| `effective_from` | `TIMESTAMPTZ`| No | `NOW()` | | Inicio de vigencia de las reglas |
| `effective_until`| `TIMESTAMPTZ`| Sí | NULL | | Fin de vigencia de las reglas |
| `rules_snapshot` | `JSONB` | No | `'{}'::jsonb`| | Snapshot de parámetros complementarios |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | | Fecha de registro |

*Restricción:* `UNIQUE(program_id, version_number)`

---

### Tabla: `program_stores`
Sedes físicas que participan en un programa de fidelización determinado.

| Columna | Tipo de Dato | Nulo | Default | Restricciones | Descripción |
|---|---|:---:|---|---|---|
| `program_id` | `UUID` | No | | PK, FK -> `loyalty_programs(id)` ON DELETE CASCADE | Programa de fidelización |
| `store_id` | `UUID` | No | | PK, FK -> `stores(id)` ON DELETE CASCADE | Sede participante |
| `active` | `BOOLEAN` | No | `TRUE` | | Si la sede está activa en el programa |

---

## 4. Módulo Tarjetas, Ciclos y Movimientos de Sellos

### Tabla: `loyalty_cards`
Ciclos individuales de acumulación de sellos de cada cliente.

| Columna | Tipo de Dato | Nulo | Default | Restricciones | Descripción |
|---|---|:---:|---|---|---|
| `id` | `UUID` | No | `gen_random_uuid()` | PK | Identificador de la tarjeta/ciclo |
| `customer_id` | `UUID` | No | | FK -> `profiles(id)` ON DELETE RESTRICT | Cliente dueño de la tarjeta |
| `program_id` | `UUID` | No | | FK -> `loyalty_programs(id)` ON DELETE RESTRICT | Programa de fidelización |
| `program_version_id`| `UUID` | No | | FK -> `loyalty_program_versions(id)` | Versión con la que inició el ciclo |
| `cycle_number` | `INTEGER` | No | `1` | CHECK (`cycle_number >= 1`) | Consecutivo de tarjeta del cliente (1, 2, 3...) |
| `stamps_required_snapshot`| `SMALLINT`| No | `8` | CHECK (`> 0`) | Meta de sellos fotografiada para este ciclo |
| `status` | `VARCHAR(20)` | No | `'accumulating'` | CHECK (`status IN ('accumulating', 'completed', 'expired', 'cancelled')`) | Estado actual de la tarjeta |
| `opened_at` | `TIMESTAMPTZ` | No | `NOW()` | | Fecha de apertura de la tarjeta |
| `completed_at` | `TIMESTAMPTZ` | Sí | NULL | | Fecha en que completó los 8 sellos |
| `closed_at` | `TIMESTAMPTZ` | Sí | NULL | | Fecha de cierre definitivo |

*Restricción:* `UNIQUE (customer_id, program_id, cycle_number)`

---

### Tabla: `stamp_movements`
Registro de auditoría de cada variación de sellos (ganancia, reversión, vencimiento o arrastre).

| Columna | Tipo de Dato | Nulo | Default | Restricciones | Descripción |
|---|---|:---:|---|---|---|
| `id` | `UUID` | No | `gen_random_uuid()` | PK | Identificador del movimiento |
| `card_id` | `UUID` | No | | FK -> `loyalty_cards(id)` ON DELETE RESTRICT | Tarjeta afectada |
| `purchase_id` | `UUID` | Sí | NULL | FK -> `purchases(id)` ON DELETE RESTRICT | Compra que originó el sello (si aplica) |
| `quantity` | `SMALLINT` | No | | CHECK (`quantity > 0`) | Cantidad de sellos del movimiento |
| `movement_type`| `VARCHAR(20)` | No | | CHECK (`movement_type IN ('EARN', 'REVERSAL', 'EXPIRATION', 'ADJUSTMENT', 'CARRY_IN', 'CARRY_OUT')`) | Tipo de operación |
| `reverses_movement_id`| `UUID`| Sí | NULL | FK -> `stamp_movements(id)` | Movimiento que es anulado por este registro |
| `source_store_id`| `UUID` | Sí | NULL | FK -> `stores(id)` | Sede física donde se originó el movimiento |
| `created_by` | `UUID` | Sí | NULL | FK -> `profiles(id)` | Empleado o proceso responsable |
| `reason` | `TEXT` | Sí | NULL | | Justificación obligatoria en ajustes manuales |
| `expires_at` | `TIMESTAMPTZ` | Sí | NULL | | Fecha de expiración de este lote de sellos |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | | Fecha de acreditación del movimiento |

---

## 5. Módulo Compras y Códigos QR

### Tabla: `purchases`
Registro transaccional de compras realizadas por clientes identificados en caja.

| Columna | Tipo de Dato | Nulo | Default | Restricciones | Descripción |
|---|---|:---:|---|---|---|
| `id` | `UUID` | No | `gen_random_uuid()` | PK | Identificador único de compra |
| `business_id` | `UUID` | No | | FK -> `businesses(id)` | Negocio donde se efectúa la compra |
| `store_id` | `UUID` | No | | FK -> `stores(id)` | Sede física de la compra |
| `customer_id` | `UUID` | No | | FK -> `profiles(id)` | Cliente identificado vía QR |
| `cashier_id` | `UUID` | No | | FK -> `profiles(id)` | Cajero que procesó la venta |
| `receipt_reference`| `VARCHAR(100)`| No | | | Consecutivo de factura o comprobante POS |
| `gross_amount` | `BIGINT` | No | | CHECK (`gross_amount >= 0`) | Importe bruto de la factura en COP |
| `discount_amount`| `BIGINT` | No | `0` | CHECK (`discount_amount >= 0`) | Valor de descuentos aplicados |
| `eligible_amount`| `BIGINT` | No | | CHECK (`eligible_amount >= 0`) | Base neta calculada para sellos |
| `currency` | `CHAR(3)` | No | `'COP'` | | Moneda de la transacción |
| `program_version_id`| `UUID` | No | | FK -> `loyalty_program_versions(id)` | Versión de reglas aplicada al cálculo |
| `status` | `VARCHAR(30)` | No | `'confirmed'` | CHECK (`status IN ('confirmed', 'cancelled', 'partially_refunded', 'refunded', 'under_review')`) | Estado transaccional |
| `idempotency_key`| `UUID` | Sí | NULL | | Clave de idempotencia de la petición HTTP |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | | Fecha y hora de registro de la venta |
| `cancelled_at` | `TIMESTAMPTZ` | Sí | NULL | | Fecha de anulación si fue revertida |

*Restricción:* `UNIQUE (business_id, store_id, receipt_reference)`

---

### Tabla: `qr_tokens`
Tokens efímeros de un solo uso utilizados para compra o redención en caja.

| Columna | Tipo de Dato | Nulo | Default | Restricciones | Descripción |
|---|---|:---:|---|---|---|
| `id` | `UUID` | No | `gen_random_uuid()` | PK | Identificador del token |
| `token_hash` | `TEXT` | No | | UNIQUE | Hash SHA-256 del token secreto |
| `user_id` | `UUID` | No | | FK -> `profiles(id)` | Cliente que generó el código |
| `purpose` | `VARCHAR(20)` | No | | CHECK (`purpose IN ('PURCHASE', 'REDEMPTION')`) | Propósito del código |
| `resource_id` | `UUID` | Sí | NULL | | ID de `customer_rewards` si es de redención |
| `store_id` | `UUID` | Sí | NULL | FK -> `stores(id)` | Sede fija si el token fue limitado a ella |
| `expires_at` | `TIMESTAMPTZ` | No | | | Fecha exacta de expiración (NOW + 60s) |
| `consumed_at` | `TIMESTAMPTZ` | Sí | NULL | | Fecha y hora en que fue escaneado y usado |
| `consumed_by` | `UUID` | Sí | NULL | FK -> `profiles(id)` | Cajero que lo consumió en caja |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | | Fecha de emisión |

---

## 6. Módulo Recompensas y Redenciones

### Tabla: `reward_definitions`
Catálogo de premios parametrizados por la cafetería.

| Columna | Tipo de Dato | Nulo | Default | Restricciones | Descripción |
|---|---|:---:|---|---|---|
| `id` | `UUID` | No | `gen_random_uuid()` | PK | Identificador del beneficio |
| `business_id` | `UUID` | No | | FK -> `businesses(id)` | Negocio que ofrece el premio |
| `name` | `VARCHAR(120)` | No | | | Nombre (ej. "Café Americano 12oz") |
| `description` | `TEXT` | No | | | Descripción y condiciones |
| `reward_type` | `VARCHAR(30)` | No | | CHECK (`reward_type IN ('product', 'percentage_discount', 'fixed_discount', 'special')`) | Tipo de beneficio |
| `reward_value` | `TEXT` | Sí | NULL | | Valor en COP, porcentaje o SKU del producto |
| `terms_snapshot`| `JSONB` | No | `'{}'::jsonb`| | Snapshot de términos y condiciones |
| `status` | `VARCHAR(20)` | No | `'active'` | CHECK (`status IN ('draft', 'active', 'inactive', 'archived')`) | Estado |
| `starts_at` | `TIMESTAMPTZ` | No | `NOW()` | | Inicio de vigencia |
| `ends_at` | `TIMESTAMPTZ` | Sí | NULL | | Fin de vigencia |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | | Fecha de creación |
| `updated_at` | `TIMESTAMPTZ` | No | `NOW()` | | Fecha de modificación |

---

### Tabla: `reward_store_eligibility`
Sedes físicas donde es válido canjear una definición de recompensa.

| Columna | Tipo de Dato | Nulo | Default | Restricciones | Descripción |
|---|---|:---:|---|---|---|
| `reward_definition_id`| `UUID`| No | | PK, FK -> `reward_definitions(id)` ON DELETE CASCADE | Beneficio |
| `store_id` | `UUID` | No | | PK, FK -> `stores(id)` ON DELETE CASCADE | Sede habilitada para canje |

---

### Tabla: `customer_rewards`
Instancias concretas de premios otorgadas a clientes individuales al completar 8 sellos.

| Columna | Tipo de Dato | Nulo | Default | Restricciones | Descripción |
|---|---|:---:|---|---|---|
| `id` | `UUID` | No | `gen_random_uuid()` | PK | Identificador de la recompensa emitida |
| `customer_id` | `UUID` | No | | FK -> `profiles(id)` | Cliente titular del premio |
| `definition_id` | `UUID` | No | | FK -> `reward_definitions(id)` | Beneficio obtenido |
| `card_id` | `UUID` | No | | FK -> `loyalty_cards(id)` | Tarjeta/ciclo que originó el premio |
| `status` | `VARCHAR(20)` | No | `'AVAILABLE'` | CHECK (`status IN ('AVAILABLE', 'REDEEMED', 'EXPIRED', 'CANCELLED', 'PENDING_REVIEW')`) | Estado actual del premio |
| `issued_at` | `TIMESTAMPTZ` | No | `NOW()` | | Fecha de emisión |
| `expires_at` | `TIMESTAMPTZ` | Sí | NULL | | Fecha límite para canjearlo en caja |
| `redeemed_at` | `TIMESTAMPTZ` | Sí | NULL | | Fecha y hora en que fue redimido |
| `terms_snapshot`| `JSONB` | No | `'{}'::jsonb`| | Snapshot de condiciones al momento de emitir |

---

### Tabla: `reward_redemptions`
Registro físico de canje en caja de un premio de cliente.

| Columna | Tipo de Dato | Nulo | Default | Restricciones | Descripción |
|---|---|:---:|---|---|---|
| `id` | `UUID` | No | `gen_random_uuid()` | PK | Identificador de la redención |
| `customer_reward_id`| `UUID` | No | | UNIQUE, FK -> `customer_rewards(id)` | Recompensa canjeada (1 canje máximo) |
| `purchase_id` | `UUID` | Sí | NULL | FK -> `purchases(id)` | Venta en la que se aplicó (si hubo consumo adicional) |
| `store_id` | `UUID` | No | | FK -> `stores(id)` | Sede física del canje |
| `cashier_id` | `UUID` | No | | FK -> `profiles(id)` | Empleado que validó y entregó el premio |
| `status` | `VARCHAR(20)` | No | `'confirmed'` | CHECK (`status IN ('confirmed', 'reversed', 'under_review')`) | Estado de la redención |
| `idempotency_key`| `UUID` | Sí | NULL | | Clave de idempotencia de la petición |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | | Fecha y hora del canje |
| `reversed_at` | `TIMESTAMPTZ` | Sí | NULL | | Fecha de reversión en caso de error |

---

## 7. Módulo Contenido (Vitrina de 5 Productos y Banners)

### Tabla: `products`
Vitrina de productos con soporte para los 5 espacios destacados.

| Columna | Tipo de Dato | Nulo | Default | Restricciones | Descripción |
|---|---|:---:|---|---|---|
| `id` | `UUID` | No | `gen_random_uuid()` | PK | Identificador del producto |
| `business_id` | `UUID` | No | | FK -> `businesses(id)` | Negocio dueño |
| `name` | `VARCHAR(120)` | No | | | Nombre del café / postre |
| `description` | `TEXT` | No | | | Descripción comercial |
| `price` | `BIGINT` | Sí | NULL | CHECK (`price >= 0`) | Precio de referencia en COP |
| `currency` | `CHAR(3)` | No | `'COP'` | | Moneda |
| `image_path` | `TEXT` | Sí | NULL | | Ruta en Supabase Storage |
| `featured_order`| `SMALLINT` | Sí | NULL | CHECK (`featured_order BETWEEN 1 AND 5`) | Posición destacada en vitrina (1 al 5) |
| `available` | `BOOLEAN` | No | `TRUE` | | Si está disponible actualmente |
| `published_at` | `TIMESTAMPTZ` | No | `NOW()` | | Fecha de publicación |
| `updated_at` | `TIMESTAMPTZ` | No | `NOW()` | | Fecha de modificación |

*Restricción:* `UNIQUE(business_id, featured_order)` condicional a `featured_order IS NOT NULL`.

---

### Tabla: `banners`
Piezas publicitarias del home de la app móvil y web.

| Columna | Tipo de Dato | Nulo | Default | Restricciones | Descripción |
|---|---|:---:|---|---|---|
| `id` | `UUID` | No | `gen_random_uuid()` | PK | Identificador del banner |
| `business_id` | `UUID` | No | | FK -> `businesses(id)` | Negocio |
| `title` | `VARCHAR(120)` | No | | | Título visible |
| `description` | `TEXT` | Sí | NULL | | Subtítulo explicativo |
| `image_path` | `TEXT` | No | | | Ruta en Supabase Storage |
| `target_url` | `TEXT` | Sí | NULL | | Enlace interno en la app o externo seguro |
| `sort_order` | `SMALLINT` | No | `0` | | Orden de visualización en carrusel |
| `status` | `VARCHAR(20)` | No | `'active'` | CHECK (`status IN ('active', 'inactive')`) | Estado |
| `starts_at` | `TIMESTAMPTZ` | No | `NOW()` | | Inicio de exhibición |
| `ends_at` | `TIMESTAMPTZ` | Sí | NULL | | Fin de exhibición |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | | Fecha de creación |
| `updated_at` | `TIMESTAMPTZ` | No | `NOW()` | | Fecha de modificación |

---

## 8. Módulo Notificaciones, Dispositivos y Consentimientos

### Tabla: `push_devices`
Tokens de FCM registrados por los dispositivos móviles y navegadores de los clientes.

| Columna | Tipo de Dato | Nulo | Default | Restricciones | Descripción |
|---|---|:---:|---|---|---|
| `id` | `UUID` | No | `gen_random_uuid()` | PK | Identificador del dispositivo |
| `user_id` | `UUID` | No | | FK -> `profiles(id)` ON DELETE CASCADE | Usuario dueño del dispositivo |
| `platform` | `VARCHAR(20)` | No | | CHECK (`platform IN ('android', 'ios', 'web')`) | Sistema operativo o navegador |
| `push_token` | `TEXT` | No | | UNIQUE | Token de registro de FCM / APNs |
| `last_seen_at` | `TIMESTAMPTZ` | No | `NOW()` | | Última vez que abrió la app |
| `active` | `BOOLEAN` | No | `TRUE` | | Si el token es válido |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | | Fecha de registro inicial |

---

### Tabla: `notification_preferences`
Preferencias y exclusiones de categorías de mensajes definidas por el usuario.

| Columna | Tipo de Dato | Nulo | Default | Restricciones | Descripción |
|---|---|:---:|---|---|---|
| `user_id` | `UUID` | No | | PK, FK -> `profiles(id)` ON DELETE CASCADE | Usuario |
| `category` | `VARCHAR(30)` | No | | PK, CHECK (`category IN ('transactional', 'marketing', 'proximity', 'reminders')`) | Categoría de notificación |
| `enabled` | `BOOLEAN` | No | `TRUE` | | Activado o desactivado por el cliente |
| `updated_at` | `TIMESTAMPTZ` | No | `NOW()` | | Fecha de actualización |

*Nota:* La categoría `'transactional'` debe permanecer siempre habilitada por seguridad operativa.

---

### Tabla: `consents`
Registro de consentimientos legales (Ley 1581 de 2012 de Colombia - Habeas Data).

| Columna | Tipo de Dato | Nulo | Default | Restricciones | Descripción |
|---|---|:---:|---|---|---|
| `id` | `UUID` | No | `gen_random_uuid()` | PK | Identificador del consentimiento |
| `user_id` | `UUID` | No | | FK -> `profiles(id)` ON DELETE CASCADE | Usuario titular del dato personal |
| `purpose` | `VARCHAR(50)` | No | | CHECK (`purpose IN ('general_terms', 'marketing_communications', 'geolocation_proximity')`) | Finalidad autorizada |
| `policy_version`| `VARCHAR(20)`| No | | | Versión de la política aceptada (ej. `v1.0-2026`) |
| `status` | `VARCHAR(20)` | No | `'granted'` | CHECK (`status IN ('granted', 'revoked')`) | Estado de la autorización |
| `granted_at` | `TIMESTAMPTZ` | No | `NOW()` | | Fecha y hora en que otorgó el consentimiento |
| `revoked_at` | `TIMESTAMPTZ` | Sí | NULL | | Fecha y hora en que revocó el permiso |
| `evidence_metadata`| `JSONB` | No | `'{}'::jsonb`| | Metadatos probatorios (IP, User-Agent) |

---

## 9. Módulo Auditoría e Idempotencia

### Tabla: `audit_logs`
Bitácora forense e inmutable de eventos sensibles.

| Columna | Tipo de Dato | Nulo | Default | Restricciones | Descripción |
|---|---|:---:|---|---|---|
| `id` | `UUID` | No | `gen_random_uuid()` | PK | Identificador de auditoría |
| `business_id` | `UUID` | No | | FK -> `businesses(id)` | Negocio auditado |
| `actor_id` | `UUID` | Sí | NULL | FK -> `profiles(id)` | Empleado o proceso que ejecutó la acción |
| `store_id` | `UUID` | Sí | NULL | FK -> `stores(id)` | Sede donde ocurrió el hecho |
| `action` | `VARCHAR(50)` | No | | | Código de acción (ej. `PURCHASE_CANCELLED`) |
| `entity_type` | `VARCHAR(50)` | No | | | Tabla afectada (ej. `purchases`, `cards`) |
| `entity_id` | `UUID` | No | | | ID del registro modificado |
| `before_data` | `JSONB` | Sí | NULL | | Snapshot previo del registro (sin secretos) |
| `after_data` | `JSONB` | Sí | NULL | | Snapshot posterior del registro (sin secretos) |
| `reason` | `TEXT` | Sí | NULL | | Justificación ingresada por el usuario |
| `ip_address` | `INET` | Sí | NULL | | Dirección IP de origen |
| `user_agent` | `TEXT` | Sí | NULL | | Navegador / cliente HTTP |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | | Momento exacto de la acción |

---

### Tabla: `idempotency_keys`
Garantiza que peticiones repetidas por conexiones inestables no dupliquen transacciones.

| Columna | Tipo de Dato | Nulo | Default | Restricciones | Descripción |
|---|---|:---:|---|---|---|
| `key` | `VARCHAR(128)`| No | | PK | UUID o hash provisto en `Idempotency-Key` |
| `user_id` | `UUID` | No | | FK -> `profiles(id)` | Usuario autenticado que emitió la petición |
| `endpoint` | `VARCHAR(255)`| No | | | Endpoint HTTP invocado |
| `request_hash` | `TEXT` | No | | | Hash SHA-256 del cuerpo de la petición |
| `response_code`| `INTEGER` | No | | | Código de estado HTTP devuelto (ej. 200, 201) |
| `response_body`| `JSONB` | No | | | Respuesta serializada devuelta |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | | Momento de la primera ejecución |
| `expires_at` | `TIMESTAMPTZ` | No | | | Fecha de caducidad del registro (NOW + 24h) |
