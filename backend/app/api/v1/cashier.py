# =============================================================================
# ENPOINTS REST: CAJA Y TERMINAL POS (/api/v1/cashier)
# =============================================================================

from uuid import UUID
from typing import Optional
from fastapi import APIRouter, Depends, Header, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.schemas.purchase import (
    PurchaseCreateRequest,
    PurchaseResponse,
    PurchaseCancelRequest
)
from app.schemas.reward import (
    RedemptionCreateRequest,
    RedemptionResponse
)
from app.services.loyalty_service import LoyaltyService
from app.services.qr_service import QrService
from app.models.reward import CustomerReward, RewardRedemption, RewardDefinition
from app.models.user import Profile
from datetime import datetime, timezone

router = APIRouter(prefix="/cashier", tags=["Caja y POS"])

# Helper simulador de cajero autenticado (en producción proviene del JWT validado)
async def get_current_cashier_id(
    authorization: Optional[str] = Header(None)
) -> UUID:
    # Por defecto para pruebas de desarrollo local, si no se envía JWT se usa un ID de cajero demo
    # En producción: decodificar claims de JWT Supabase
    return UUID("11111111-1111-1111-1111-111111111111")

@router.post(
    "/purchases",
    response_model=PurchaseResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar compra escaneada y acreditar sellos"
)
async def create_purchase(
    payload: PurchaseCreateRequest,
    idempotency_key: Optional[UUID] = Header(None, alias="Idempotency-Key"),
    cashier_id: UUID = Depends(get_current_cashier_id),
    db: AsyncSession = Depends(get_db)
):
    """
    Escanea el QR temporal del cliente, registra la factura y calcula los sellos.
    Si la tarjeta alcanza 8 sellos, se completa y emite recompensa; los sellos
    sobrantes pasan automáticamente al ciclo consecutivo (arrastre atómico).
    """
    return await LoyaltyService.process_purchase(
        db=db,
        cashier_id=cashier_id,
        payload=payload,
        idempotency_key=idempotency_key
    )

@router.post(
    "/redemptions",
    response_model=RedemptionResponse,
    status_code=status.HTTP_200_OK,
    summary="Confirmar canje de recompensa en caja física"
)
async def redeem_reward(
    payload: RedemptionCreateRequest,
    idempotency_key: Optional[UUID] = Header(None, alias="Idempotency-Key"),
    cashier_id: UUID = Depends(get_current_cashier_id),
    db: AsyncSession = Depends(get_db)
):
    """
    Escanea el QR de redención del cliente y marca la recompensa como canjeada.
    """
    now = datetime.now(timezone.utc)
    # Validar y consumir QR de redención
    qr = await QrService.consume_token(
        db=db,
        raw_token=payload.qr_token,
        expected_purpose="REDEMPTION",
        consumer_id=cashier_id,
        store_id=payload.store_id
    )

    if not qr.resource_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "QR_NO_REWARD", "message": "El código QR no tiene un premio asociado."}
        )

    # Bloqueo pesimista de la recompensa
    reward_stmt = (
        select(CustomerReward)
        .where(CustomerReward.id == qr.resource_id)
        .with_for_update()
    )
    reward = (await db.execute(reward_stmt)).scalar_one_or_none()

    if not reward:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recompensa no encontrada.")

    if reward.status != "AVAILABLE":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "REWARD_NOT_AVAILABLE", "message": f"La recompensa no está disponible (estado actual: {reward.status})."}
        )

    if reward.expires_at and reward.expires_at < now:
        reward.status = "EXPIRED"
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "REWARD_EXPIRED", "message": "La recompensa ha vencido y ya no puede ser canjeada."}
        )

    # Marcar como redimida
    reward.status = "REDEEMED"
    reward.redeemed_at = now

    redemption = RewardRedemption(
        customer_reward_id=reward.id,
        purchase_id=payload.purchase_id,
        store_id=payload.store_id,
        cashier_id=cashier_id,
        status="confirmed",
        idempotency_key=idempotency_key,
        created_at=now
    )
    db.add(redemption)
    await db.commit()

    # Cargar nombre de recompensa y cliente
    reward_def = await db.get(RewardDefinition, reward.definition_id)
    customer = await db.get(Profile, reward.customer_id)

    return RedemptionResponse(
        redemption_id=redemption.id,
        status=redemption.status,
        reward_name=reward_def.name if reward_def else "Cortesía",
        customer_name=customer.full_name if customer else "Cliente",
        redeemed_at=now
    )
