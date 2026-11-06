# Diagrama Entidad-Relación Lógico y Físico (DER)

**Proyecto:** Plataforma de Fidelización Multisede para Cafeterías (ConfyTickets)  
**Motor de Base de Datos:** PostgreSQL 15+  
**Versión:** 1.0  
**Fecha:** Noviembre 2026  

---

## 1. Diagrama Entidad-Relación Consolidado (ERD)

A continuación se presenta el diagrama físico de la base de datos con sus tablas, llaves primarias (`PK`), llaves foráneas (`FK`), tipos de datos e índices únicos.

```mermaid
erDiagram
    businesses ||--o{ stores : "posee"
    businesses ||--o{ loyalty_programs : "configura"
    businesses ||--o{ business_memberships : "emplea"
    businesses ||--o{ reward_definitions : "ofrece"
    businesses ||--o{ products : "cataloga"
    businesses ||--o{ banners : "publica"
    businesses ||--o{ notification_campaigns : "envia"
    businesses ||--o{ audit_logs : "audita"

    stores ||--o{ purchases : "registra_en"
    stores ||--o{ reward_redemptions : "redime_en"
    stores ||--o{ program_stores : "participa"
    stores ||--o{ membership_store_assignments : "asigna_empleado"
    stores ||--o{ reward_store_eligibility : "habilita_premio"

    loyalty_programs ||--o{ loyalty_program_versions : "versiona"
    loyalty_programs ||--o{ program_stores : "incluye_sedes"
    loyalty_programs ||--o{ loyalty_cards : "rige"

    profiles ||--o{ business_memberships : "vincula_rol"
    profiles ||--o{ loyalty_cards : "acumula_en"
    profiles ||--o{ purchases : "compra_como_cliente"
    profiles ||--o{ customer_rewards : "recibe_premios"
    profiles ||--o{ qr_tokens : "genera_tokens"
    profiles ||--o{ consents : "otorga"
    profiles ||--o{ push_devices : "registra_dispositivos"
    profiles ||--o{ notification_preferences : "configura_alertas"

    business_memberships ||--o{ membership_store_assignments : "sedes_autorizadas"
    
    loyalty_cards ||--o{ stamp_movements : "contiene_sellos"
    loyalty_cards ||--o{ customer_rewards : "origina_al_completar"

    purchases ||--o{ stamp_movements : "acredita_sellos"
    purchases ||--o1 reward_redemptions : "aplica_beneficio"

    reward_definitions ||--o{ reward_store_eligibility : "sedes_validas"
    reward_definitions ||--o{ customer_rewards : "instancia_premio"

    customer_rewards ||--o1 reward_redemptions : "consumida_en"

    notification_campaigns ||--o{ notification_deliveries : "despacha"
    push_devices ||--o{ notification_deliveries : "recibe_en_dispositivo"

    businesses {
        uuid id PK
        varchar name
        varchar legal_name
        varchar status
        char default_currency
        varchar timezone
        timestamptz created_at
        timestamptz updated_at
    }

    stores {
        uuid id PK
        uuid business_id FK
        varchar code
        varchar name
        varchar address
        varchar city
        numeric latitude
        numeric longitude
        varchar timezone
        jsonb opening_hours
        varchar status
        timestamptz created_at
    }

    profiles {
        uuid id PK
        varchar full_name
        varchar email
        varchar phone
        varchar status
        timestamptz created_at
        timestamptz updated_at
    }

    business_memberships {
        uuid id PK
        uuid business_id FK
        uuid user_id FK
        varchar role
        varchar status
        timestamptz created_at
    }

    membership_store_assignments {
        uuid membership_id PK,FK
        uuid store_id PK,FK
        timestamptz created_at
    }

    loyalty_programs {
        uuid id PK
        uuid business_id FK
        varchar name
        varchar status
        timestamptz created_at
    }

    loyalty_program_versions {
        uuid id PK
        uuid program_id FK
        int version_number
        smallint stamps_required
        bigint minimum_purchase
        bigint amount_per_stamp
        smallint max_stamps_per_purchase
        int stamp_expiry_days
        int reward_expiry_days
        timestamptz effective_from
        timestamptz effective_until
        jsonb rules_snapshot
    }

    program_stores {
        uuid program_id PK,FK
        uuid store_id PK,FK
        boolean active
    }

    loyalty_cards {
        uuid id PK
        uuid customer_id FK
        uuid program_id FK
        uuid program_version_id FK
        int cycle_number
        smallint stamps_required_snapshot
        varchar status
        timestamptz opened_at
        timestamptz completed_at
        timestamptz closed_at
    }

    purchases {
        uuid id PK
        uuid business_id FK
        uuid store_id FK
        uuid customer_id FK
        uuid cashier_id FK
        varchar receipt_reference
        bigint gross_amount
        bigint discount_amount
        bigint eligible_amount
        char currency
        uuid program_version_id FK
        varchar status
        timestamptz created_at
        timestamptz cancelled_at
    }

    stamp_movements {
        uuid id PK
        uuid card_id FK
        uuid purchase_id FK
        smallint quantity
        varchar movement_type
        uuid reverses_movement_id FK
        uuid source_store_id FK
        uuid created_by FK
        text reason
        timestamptz expires_at
        timestamptz created_at
    }

    qr_tokens {
        uuid id PK
        text token_hash UK
        uuid user_id FK
        varchar purpose
        uuid resource_id
        uuid store_id FK
        timestamptz expires_at
        timestamptz consumed_at
        uuid consumed_by FK
        timestamptz created_at
    }

    reward_definitions {
        uuid id PK
        uuid business_id FK
        varchar name
        text description
        varchar reward_type
        text reward_value
        jsonb terms_snapshot
        varchar status
        timestamptz starts_at
        timestamptz ends_at
    }

    reward_store_eligibility {
        uuid reward_definition_id PK,FK
        uuid store_id PK,FK
    }

    customer_rewards {
        uuid id PK
        uuid customer_id FK
        uuid definition_id FK
        uuid card_id FK
        varchar status
        timestamptz issued_at
        timestamptz expires_at
        timestamptz redeemed_at
        jsonb terms_snapshot
    }

    reward_redemptions {
        uuid id PK
        uuid customer_reward_id FK
        uuid purchase_id FK
        uuid store_id FK
        uuid cashier_id FK
        varchar status
        uuid idempotency_key
        timestamptz created_at
        timestamptz reversed_at
    }

    products {
        uuid id PK
        uuid business_id FK
        varchar name
        text description
        bigint price
        char currency
        text image_path
        smallint featured_order
        boolean available
        timestamptz published_at
    }

    banners {
        uuid id PK
        uuid business_id FK
        varchar title
        text description
        text image_path
        text target_url
        smallint sort_order
        varchar status
        timestamptz starts_at
        timestamptz ends_at
    }

    notification_campaigns {
        uuid id PK
        uuid business_id FK
        varchar title
        text body
        varchar category
        jsonb audience_config
        timestamptz scheduled_at
        varchar status
        uuid created_by FK
    }

    notification_preferences {
        uuid user_id PK,FK
        varchar category PK
        boolean enabled
        timestamptz updated_at
    }

    push_devices {
        uuid id PK
        uuid user_id FK
        varchar platform
        text push_token
        timestamptz last_seen_at
        boolean active
    }

    notification_deliveries {
        uuid id PK
        uuid campaign_id FK
        uuid user_id FK
        uuid device_id FK
        varchar provider_message_id
        varchar status
        timestamptz sent_at
    }

    consents {
        uuid id PK
        uuid user_id FK
        varchar purpose
        varchar policy_version
        varchar status
        timestamptz granted_at
        timestamptz revoked_at
        jsonb evidence_metadata
    }

    audit_logs {
        uuid id PK
        uuid business_id FK
        uuid actor_id FK
        uuid store_id FK
        varchar action
        varchar entity_type
        uuid entity_id
        jsonb before_data
        jsonb after_data
        text reason
        inet ip_address
        text user_agent
        timestamptz created_at
    }
```

---

## 2. Restricciones de Integridad y Claves Únicas

1. **Unicidad de Comprobante de Venta por Sede:**
   `UNIQUE (business_id, store_id, receipt_reference)`  
   *Justificación:* Evita que un mismo ticket o factura de caja sea utilizado más de una vez para acreditar sellos dentro de la misma sucursal.

2. **Unicidad de Ciclo de Tarjeta por Cliente:**
   `UNIQUE (customer_id, program_id, cycle_number)`  
   *Justificación:* Garantiza la secuencia matemática estricta de las tarjetas ($1, 2, 3 \dots$) sin saltos ni duplicaciones.

3. **Posición de Productos Destacados (Vitrina de 5 espacios):**
   `UNIQUE (business_id, featured_order)` donde `featured_order IS NOT NULL`  
   *Justificación:* Garantiza a nivel de base de datos que nunca coexistan dos productos disputando la posición 1, 2, 3, 4 o 5.

4. **Hash de Token QR Temporal:**
   `UNIQUE (token_hash)`  
   *Justificación:* Garantiza la unicidad absoluta de cada código generado.

5. **Versiones de Programa de Fidelización:**
   `UNIQUE (program_id, version_number)`  
   *Justificación:* Orden cronológico estricto de las reglas comerciales.
