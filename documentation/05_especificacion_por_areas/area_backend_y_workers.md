# Especificación Técnica del Área Backend y Workers

**Proyecto:** Plataforma de Fidelización Multisede para Cafeterías (ConfyTickets)  
**Tecnología Base:** Python 3.11+ / FastAPI / SQLAlchemy 2.0 (Async) / Redis / Celery  
**Versión:** 1.0  
**Fecha:** Noviembre 2026  

---

## 1. Patrón Arquitectónico del Backend

El backend se estructura bajo los principios de **Clean Architecture / Arquitectura en Capas**, garantizando una estricta separación entre el transporte HTTP, la lógica de negocio y el acceso a base de datos:

```text
backend/app/
├── core/                   # Configuraciones globales, seguridad y middlewares
│   ├── config.py           # Settings pydantic-settings (variables de entorno .env)
│   ├── database.py         # Engine asyncpg de SQLAlchemy 2.0 y SessionLocal
│   ├── security.py         # Validador de JWT Supabase vía JWKS asimétrico
│   ├── permissions.py      # Dependencias FastAPI para RBAC y control multisede
│   └── logging.py          # Logger estructurado en JSON con correlación de Request-ID
├── schemas/                # Modelos de entrada y salida Pydantic v2
│   ├── purchase.py
│   ├── loyalty.py
│   ├── reward.py
│   └── admin.py
├── models/                 # Modelos ORM de SQLAlchemy mapeados a las tablas
│   ├── user.py
│   ├── store.py
│   ├── card.py
│   ├── purchase.py
│   └── reward.py
├── repositories/           # Capa de persistencia (Consultas SQL y transacciones)
│   ├── card_repository.py
│   ├── purchase_repository.py
│   └── qr_repository.py
├── services/               # Lógica de dominio nuclear (Reglas de Negocio)
│   ├── loyalty_engine.py   # Cálculo matemático de sellos y evaluación de ciclos
│   ├── qr_service.py       # Criptografía, generación de hashes y consumo atómico
│   ├── purchase_service.py # Orquestación transaccional con arrastre (carry-over)
│   └── reward_service.py   # Emisión y validación de canje
├── integrations/           # Adaptadores para servicios externos
│   ├── supabase_auth.py    # Cliente JWKS y validación de tokens
│   ├── fcm_client.py       # Firebase Admin SDK para envío de notificaciones push
│   └── storage_client.py   # Carga y firmado de URLs para imágenes
└── api/
    └── v1/                 # Endpoints REST agrupados por ámbito
        ├── me.py
        ├── cashier.py
        └── admin.py
```

---

## 2. Motor de Fidelización y Transaccionalidad Atómica

El corazón del backend reside en `purchase_service.py`. A continuación se detalla la lógica de ejecución en pseudocódigo técnico para garantizar **cero duplicados, cero condiciones de carrera y arrastre consistente**:

```python
async def process_cashier_purchase(
    db: AsyncSession,
    cashier_user_id: UUID,
    payload: PurchaseCreateSchema,
    idempotency_key: str | None
) -> PurchaseResponseSchema:
    # 1. Validar Idempotencia
    if idempotency_key:
        cached_response = await idempotency_repo.get(db, idempotency_key)
        if cached_response:
            return cached_response

    async with db.begin(): # INICIO DE TRANSACCIÓN ATÓMICA
        # 2. Validar y consumir el QR Token
        token_hash = hashlib.sha256(payload.qr_token.encode()).hexdigest()
        qr = await qr_repo.get_by_hash_for_update(db, token_hash)
        
        if not qr or qr.consumed_at is not None or qr.expires_at < utcnow():
            raise HTTPException(status_code=400, detail="QR_INVALID_OR_EXPIRED")
        
        customer_id = qr.user_id
        qr.consumed_at = utcnow()
        qr.consumed_by = cashier_user_id

        # 3. Validar permisos del cajero en la sede
        await permissions_service.verify_cashier_store(db, cashier_user_id, payload.store_id)

        # 4. Obtener reglas vigentes del programa de la sede
        rules = await loyalty_repo.get_active_version_for_store(db, payload.store_id)

        # 5. Calcular sellos (Modo Combinado)
        eligible_amount = payload.gross_amount - payload.discount_amount
        if eligible_amount < rules.minimum_purchase:
            stamps_to_award = 0
        else:
            stamps_to_award = min(
                rules.max_stamps_per_purchase,
                max(1, eligible_amount // rules.amount_per_stamp)
            )

        # 6. Registrar la Compra
        purchase = await purchase_repo.create(
            db,
            business_id=rules.business_id,
            store_id=payload.store_id,
            customer_id=customer_id,
            cashier_id=cashier_user_id,
            receipt_reference=payload.receipt_reference,
            gross_amount=payload.gross_amount,
            discount_amount=payload.discount_amount,
            eligible_amount=eligible_amount,
            program_version_id=rules.id
        )

        # 7. Obtener tarjeta activa con bloqueo de fila (FOR UPDATE)
        card = await card_repo.get_active_for_update(db, customer_id, rules.program_id)
        current_stamps = await stamp_repo.get_card_balance(db, card.id)
        target = card.stamps_required_snapshot # 8 sellos

        stamps_needed = target - current_stamps

        if stamps_to_award <= stamps_needed:
            # Los sellos caben en la tarjeta actual
            await stamp_repo.insert_movement(db, card.id, purchase.id, stamps_to_award, "EARN")
            if current_stamps + stamps_to_award == target:
                card.status = "completed"
                card.completed_at = utcnow()
                await reward_repo.issue_reward(db, customer_id, card.id)
        else:
            # ARRASTRE (CARRY-OVER): Supera los 8 sellos
            # Completar tarjeta actual
            await stamp_repo.insert_movement(db, card.id, purchase.id, stamps_needed, "EARN")
            card.status = "completed"
            card.completed_at = utcnow()
            await reward_repo.issue_reward(db, customer_id, card.id)

            # Abrir nuevo ciclo consecutivo
            new_cycle_number = card.cycle_number + 1
            new_card = await card_repo.create_card(
                db, customer_id, rules.program_id, rules.id, new_cycle_number, target
            )
            carry_stamps = stamps_to_award - stamps_needed
            await stamp_repo.insert_movement(db, new_card.id, purchase.id, carry_stamps, "CARRY_IN")

        # 8. Guardar resultado de idempotencia
        response_data = build_purchase_response(...)
        if idempotency_key:
            await idempotency_repo.save(db, idempotency_key, response_data)

    # Fuera de la transacción: Encolar notificación push en Celery
    send_push_notification.delay(customer_id, "Compra registrada", f"¡Ganaste {stamps_to_award} sellos!")
    return response_data
```

---

## 3. Celery Workers y Procesamiento en Segundo Plano

Para mantener los endpoints de la API con tiempos de respuesta inferiores a 300 ms, las tareas pesadas o recurrentes se delegan al broker Redis y son procesadas por trabajadores de Celery.

### 3.1. Cronograma de Tareas Programadas (Celery Beat)

```python
# workers/celery_schedule.py
from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    # Todos los días a las 02:00 AM (UTC-5 Bogotá)
    "expire-unclaimed-rewards-daily": {
        "task": "workers.tasks.expire_rewards_task",
        "schedule": crontab(hour=2, minute=0),
    },
    # Todos los días a las 03:00 AM
    "expire-old-stamps-daily": {
        "task": "workers.tasks.expire_stamps_task",
        "schedule": crontab(hour=3, minute=0),
    },
    # Cada 15 minutos: procesar campañas push programadas
    "dispatch-scheduled-campaigns": {
        "task": "workers.tasks.dispatch_campaigns_task",
        "schedule": crontab(minute="*/15"),
    },
}
```

### 3.2. Políticas de Reintentos en Envío de Push
- Si Firebase Cloud Messaging (FCM) retorna un error temporal (`UNAVAILABLE` o `RATE_LIMIT_EXCEEDED`), la tarea de Celery aplica reintento con backoff exponencial:
  $$\text{Delay} = 2^{\text{reintentos}} \times 5\text{ segundos}$$
- Si FCM reporta un token inválido o desinstalado (`UNREGISTERED`), el worker marca automáticamente el dispositivo como `active = FALSE` en la tabla `push_devices` para evitar desperdicio de peticiones futuras.
