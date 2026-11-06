# =============================================================================
# ENDPOINTS REST: CLIENTE Y PERFIL (/api/v1/me)
# =============================================================================

from uuid import UUID
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.schemas.user import UserProfileSchema, UserUpdateSchema
from app.schemas.loyalty import CustomerCardsResponse, CardSummarySchema
from app.schemas.qr import QrTokenResponse
from app.schemas.reward import CustomerRewardSchema
from app.models.user import Profile
from app.models.loyalty import LoyaltyCard, StampMovement
from app.models.reward import CustomerReward, RewardDefinition
from app.services.qr_service import QrService

router = APIRouter(prefix="/me", tags=["Cliente"])

# Simula extracción de usuario autenticado desde el JWT (para desarrollo)
async def get_current_user_id(
    authorization: Optional[str] = Header(None)
) -> UUID:
    # ID demo por defecto
    return UUID("00000000-0000-0000-0000-000000000001")

@router.get("", response_model=UserProfileSchema, summary="Consultar perfil del cliente actual")
async def get_my_profile(
    user_id: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    profile = await db.get(Profile, user_id)
    if not profile:
        # Si no existe en BD local (primera ejecución), crear perfil de prueba
        profile = Profile(
            id=user_id,
            full_name="Camila Rodríguez",
            email="camila.rodriguez@email.com",
            phone="+573001234567",
            status="active"
        )
        db.add(profile)
        await db.commit()
    return profile

@router.get("/loyalty/cards", response_model=CustomerCardsResponse, summary="Consultar tarjeta activa e historial")
async def get_my_cards(
    user_id: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    # Obtener todas las tarjetas del cliente
    cards_stmt = (
        select(LoyaltyCard)
        .where(LoyaltyCard.customer_id == user_id)
        .order_by(LoyaltyCard.cycle_number.desc())
    )
    cards = (await db.execute(cards_stmt)).scalars().all()

    active_card_summary: Optional[CardSummarySchema] = None
    past_cards: List[CardSummarySchema] = []

    for card in cards:
        # Calcular balance neto de sellos
        balance_stmt = (
            select(func.coalesce(func.sum(StampMovement.quantity), 0))
            .where(
                StampMovement.card_id == card.id,
                StampMovement.movement_type.in_(["EARN", "CARRY_IN", "ADJUSTMENT"])
            )
        )
        balance = (await db.execute(balance_stmt)).scalar_one()

        deductions_stmt = (
            select(func.coalesce(func.sum(StampMovement.quantity), 0))
            .where(
                StampMovement.card_id == card.id,
                StampMovement.movement_type.in_(["REVERSAL", "EXPIRATION", "CARRY_OUT"])
            )
        )
        deductions = (await db.execute(deductions_stmt)).scalar_one()
        net_stamps = max(0, min(8, balance - deductions))

        target = card.stamps_required_snapshot or 8
        remaining = max(0, target - net_stamps)
        progress = round((net_stamps / target) * 100, 1)

        summary = CardSummarySchema(
            id=card.id,
            cycle_number=card.cycle_number,
            stamps_count=net_stamps,
            stamps_required=target,
            stamps_remaining=remaining,
            progress_percentage=progress,
            status=card.status,
            opened_at=card.opened_at,
            completed_at=card.completed_at
        )

        if card.status == "accumulating" and active_card_summary is None:
            active_card_summary = summary
        else:
            past_cards.append(summary)

    return CustomerCardsResponse(
        active_card=active_card_summary,
        past_cycles=past_cards
    )

@router.post("/qr/purchase", response_model=QrTokenResponse, status_code=status.HTTP_201_CREATED, summary="Generar QR temporal de compra (60 segundos)")
async def generate_purchase_qr(
    user_id: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """
    Genera un token aleatorio opaco y efímero con vigencia de 60 segundos.
    El QR no expone PII ni credenciales de acceso.
    """
    qr_res = await QrService.create_token(
        db=db,
        user_id=user_id,
        purpose="PURCHASE"
    )
    await db.commit()
    return qr_res

@router.get("/rewards", response_model=List[CustomerRewardSchema], summary="Consultar recompensas disponibles y canjeadas")
async def get_my_rewards(
    status_filter: Optional[str] = None,
    user_id: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(CustomerReward, RewardDefinition)
        .join(RewardDefinition, CustomerReward.definition_id == RewardDefinition.id)
        .where(CustomerReward.customer_id == user_id)
        .order_by(CustomerReward.issued_at.desc())
    )
    if status_filter:
        stmt = stmt.where(CustomerReward.status == status_filter)

    results = (await db.execute(stmt)).all()

    response: List[CustomerRewardSchema] = []
    for reward, r_def in results:
        response.append(CustomerRewardSchema(
            id=reward.id,
            name=r_def.name,
            description=r_def.description,
            reward_type=r_def.reward_type,
            status=reward.status,
            issued_at=reward.issued_at,
            expires_at=reward.expires_at,
            eligible_stores=["Todas las sedes participantes"]
        ))
    return response

@router.post("/rewards/{reward_id}/qr", response_model=QrTokenResponse, status_code=status.HTTP_201_CREATED, summary="Generar QR temporal de redención (60 segundos)")
async def generate_redemption_qr(
    reward_id: UUID,
    user_id: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    # Verificar pertenencia y estado AVAILABLE
    reward = await db.get(CustomerReward, reward_id)
    if not reward or reward.customer_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recompensa no encontrada.")

    if reward.status != "AVAILABLE":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"La recompensa no puede canjearse (estado: {reward.status})."
        )

    qr_res = await QrService.create_token(
        db=db,
        user_id=user_id,
        purpose="REDEMPTION",
        resource_id=reward.id
    )
    await db.commit()
    return qr_res
