# Especificación Técnica de API REST

**Proyecto:** Plataforma de Fidelización Multisede para Cafeterías (ConfyTickets)  
**Estándar:** OpenAPI 3.1 / RESTful JSON  
**Versión de API:** `v1`  
**URL Base de Referencia:** `https://api.confytickets.com/api/v1`  
**Fecha:** Noviembre 2026  

---

## 1. Convenciones y Estándares Globales

### 1.1. Autenticación y Cabeceras
Toda solicitud hacia endpoints protegidos debe incluir el JWT emitido por Supabase Auth:
```http
Authorization: Bearer <ACCESS_TOKEN_JWT>
Content-Type: application/json
Accept: application/json
```

### 1.2. Idempotencia en Operaciones Mutables
Para endpoints financieros o transaccionales (`/cashier/purchases`, `/cashier/redemptions`), el cliente debe enviar la cabecera:
```http
Idempotency-Key: <UUID_V4>
```
Si se reenvía una petición con la misma clave dentro de las siguientes 24 horas, la API devolverá exactamente la respuesta almacenada sin duplicar el cobro ni la acreditación de sellos.

### 1.3. Formato Estándar de Errores (RFC 7807 modificado)
```json
{
  "error": {
    "code": "QR_EXPIRED",
    "message": "El código QR ha expirado. Por favor genera uno nuevo.",
    "details": [],
    "request_id": "8fa1e410-b74f-47dc-9f06-88b901a8f94d"
  }
}
```

---

## 2. Endpoints del Cliente (`/me`)

### 2.1. Consultar Perfil Propio
- **Método:** `GET`
- **Ruta:** `/me`
- **Respuesta Exitosa (200 OK):**
```json
{
  "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "full_name": "Camila Rodríguez",
  "email": "camila.rodriguez@email.com",
  "phone": "+573001234567",
  "status": "active",
  "created_at": "2026-11-06T10:00:00Z"
}
```

### 2.2. Consultar Tarjeta Activa e Historial de Ciclos
- **Método:** `GET`
- **Ruta:** `/me/loyalty/cards`
- **Respuesta Exitosa (200 OK):**
```json
{
  "active_card": {
    "id": "1d8b671a-293e-4e4c-bca6-559d8fa72101",
    "cycle_number": 2,
    "stamps_count": 5,
    "stamps_required": 8,
    "stamps_remaining": 3,
    "progress_percentage": 62.5,
    "status": "accumulating",
    "opened_at": "2026-11-01T15:30:00Z"
  },
  "past_cycles": [
    {
      "id": "993c12aa-41fa-4001-a18c-7f8e87612345",
      "cycle_number": 1,
      "stamps_count": 8,
      "stamps_required": 8,
      "status": "completed",
      "completed_at": "2026-10-31T18:20:00Z",
      "reward_issued": true
    }
  ]
}
```

### 2.3. Generar Código QR Dinámico de Compra
- **Método:** `POST`
- **Ruta:** `/me/qr/purchase`
- **Respuesta Exitosa (201 Created):**
```json
{
  "qr_token": "cfy_live_9a7d8c6b5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b",
  "purpose": "PURCHASE",
  "expires_in_seconds": 60,
  "expires_at": "2026-11-06T12:35:00Z"
}
```

### 2.4. Consultar Recompensas del Cliente
- **Método:** `GET`
- **Ruta:** `/me/rewards`
- **Parámetros Query:** `status` (opcional: `AVAILABLE`, `REDEEMED`, `EXPIRED`)
- **Respuesta Exitosa (200 OK):**
```json
[
  {
    "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    "name": "Café Americano 12oz de Cortesía",
    "description": "Válido en cualquier sede presentando el QR de redención.",
    "reward_type": "product",
    "status": "AVAILABLE",
    "issued_at": "2026-10-31T18:20:00Z",
    "expires_at": "2026-11-30T23:59:59Z",
    "eligible_stores": ["Sede Centro", "Sede Cabecera", "Sede Cañaveral"]
  }
]
```

### 2.5. Generar QR de Redención para Recompensa
- **Método:** `POST`
- **Ruta:** `/me/rewards/{reward_id}/qr`
- **Respuesta Exitosa (201 Created):**
```json
{
  "qr_token": "cfy_rdm_4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b",
  "customer_reward_id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
  "purpose": "REDEMPTION",
  "expires_in_seconds": 60,
  "expires_at": "2026-11-06T12:40:00Z"
}
```

---

## 3. Endpoints del Personal de Caja (`/cashier`)

### 3.1. Registrar Compra Escaneada y Acreditar Sellos
- **Método:** `POST`
- **Ruta:** `/cashier/purchases`
- **Cabeceras Obligatorias:** `Idempotency-Key: <UUID>`
- **Cuerpo de Solicitud (JSON):**
```json
{
  "qr_token": "cfy_live_9a7d8c6b5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b",
  "store_id": "87c69994-6e69-425b-8cb0-b08be5f97371",
  "receipt_reference": "FAC-2026-09841",
  "gross_amount": 30000,
  "discount_amount": 0,
  "currency": "COP"
}
```
- **Respuesta Exitosa (201 Created):**
```json
{
  "purchase_id": "67de14f5-5689-4bc2-b91c-197e889312fe",
  "status": "confirmed",
  "receipt_reference": "FAC-2026-09841",
  "eligible_amount": 30000,
  "stamps_awarded": 3,
  "allocation": [
    {
      "card_cycle": 1,
      "stamps_added": 1,
      "total_in_card": 8,
      "cycle_status": "completed"
    },
    {
      "card_cycle": 2,
      "stamps_added": 2,
      "total_in_card": 2,
      "cycle_status": "accumulating"
    }
  ],
  "rewards_issued": [
    {
      "reward_id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      "name": "Café Americano 12oz de Cortesía"
    }
  ],
  "customer_name": "Camila Rodríguez"
}
```

### 3.2. Confirmar Redención de Recompensa en Caja
- **Método:** `POST`
- **Ruta:** `/cashier/redemptions`
- **Cabeceras Obligatorias:** `Idempotency-Key: <UUID>`
- **Cuerpo de Solicitud (JSON):**
```json
{
  "qr_token": "cfy_rdm_4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b",
  "store_id": "87c69994-6e69-425b-8cb0-b08be5f97371",
  "purchase_id": null
}
```
- **Respuesta Exitosa (200 OK):**
```json
{
  "redemption_id": "e3b0c442-98fc-1c14-9afb-4c8996fb9242",
  "status": "confirmed",
  "reward_name": "Café Americano 12oz de Cortesía",
  "customer_name": "Camila Rodríguez",
  "redeemed_at": "2026-11-06T12:41:10Z"
}
```

### 3.3. Cancelar Compra y Revertir Sellos
- **Método:** `POST`
- **Ruta:** `/cashier/purchases/{purchase_id}/cancel`
- **Cuerpo de Solicitud (JSON):**
```json
{
  "reason": "Error en digitación de monto por cajero"
}
```
- **Respuesta Exitosa (200 OK):**
```json
{
  "purchase_id": "67de14f5-5689-4bc2-b91c-197e889312fe",
  "status": "cancelled",
  "stamps_reversed": 3,
  "cancelled_at": "2026-11-06T12:45:00Z"
}
```

---

## 4. Endpoints Administrativos y Contenido (`/admin`)

### 4.1. Dashboard de Métricas
- **Método:** `GET`
- **Ruta:** `/admin/dashboard`
- **Parámetros Query:** `store_id`, `from_date`, `to_date`
- **Respuesta Exitosa (200 OK):**
```json
{
  "summary": {
    "total_customers": 1420,
    "active_cards": 1280,
    "stamps_awarded": 8540,
    "stamps_reversed": 45,
    "cards_completed": 620,
    "rewards_redeemed": 510,
    "total_sales_amount_cop": 85400000
  },
  "stores_breakdown": [
    {
      "store_code": "SEDE-CENTRO",
      "store_name": "Sede Centro",
      "sales_count": 520,
      "stamps_awarded": 1560
    }
  ]
}
```

### 4.2. Gestión de los 5 Productos Destacados
- **Método:** `GET` / `POST` / `PATCH`
- **Rutas:** `/admin/products`, `/admin/products/{id}`
- **Ejemplo Payload `PATCH /admin/products/{id}`:**
```json
{
  "name": "Cappuccino Vainilla Francesa",
  "description": "Espresso doble con leche vaporizada y jarabe artesanal de vainilla.",
  "price": 12500,
  "featured_order": 1,
  "available": true
}
```

### 4.3. Gestión de Banners Publicitarios
- **Método:** `POST`
- **Ruta:** `/admin/banners`
- **Ejemplo Payload:**
```json
{
  "title": "Temporada de Café de Origen Huila",
  "description": "Notas florales y caramelo. Prueba nuestra nueva cosecha.",
  "image_path": "banners/huila-2026.webp",
  "target_url": "/products/origen-huila",
  "sort_order": 1,
  "starts_at": "2026-11-01T00:00:00Z",
  "ends_at": "2026-11-30T23:59:59Z"
}
```
