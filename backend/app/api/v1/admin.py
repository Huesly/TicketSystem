# =============================================================================
# ENDPOINTS REST: ADMINISTRACIÓN Y REPORTES (/api/v1/admin)
# =============================================================================

from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.models.business import Store
from app.models.user import Profile
from app.models.loyalty import LoyaltyCard, StampMovement
from app.models.purchase import Purchase
from app.models.reward import CustomerReward, RewardRedemption
from app.models.content import Product

router = APIRouter(prefix="/admin", tags=["Administración"])

@router.get("/dashboard", summary="Resumen ejecutivo de KPIs multisede")
async def get_dashboard(
    store_id: Optional[UUID] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    # Total clientes
    total_customers = (await db.execute(select(func.count(Profile.id)))).scalar_one()

    # Total tarjetas activas y completadas
    active_cards = (await db.execute(
        select(func.count(LoyaltyCard.id)).where(LoyaltyCard.status == "accumulating")
    )).scalar_one()

    completed_cards = (await db.execute(
        select(func.count(LoyaltyCard.id)).where(LoyaltyCard.status == "completed")
    )).scalar_one()

    # Total ventas y sellos
    purchases_query = select(
        func.coalesce(func.sum(Purchase.eligible_amount), 0),
        func.count(Purchase.id)
    ).where(Purchase.status == "confirmed")

    if store_id:
        purchases_query = purchases_query.where(Purchase.store_id == store_id)

    sales_amount, total_purchases = (await db.execute(purchases_query)).one()

    # Sellos emitidos
    stamps_awarded = (await db.execute(
        select(func.coalesce(func.sum(StampMovement.quantity), 0))
        .where(StampMovement.movement_type.in_(["EARN", "CARRY_IN"]))
    )).scalar_one()

    # Recompensas redimidas
    redeemed_count = (await db.execute(
        select(func.count(RewardRedemption.id)).where(RewardRedemption.status == "confirmed")
    )).scalar_one()

    return {
        "summary": {
            "total_customers": total_customers,
            "active_cards": active_cards,
            "completed_cards": completed_cards,
            "total_purchases_count": total_purchases,
            "total_sales_amount_cop": sales_amount,
            "total_stamps_awarded": stamps_awarded,
            "total_rewards_redeemed": redeemed_count
        }
    }

@router.get("/stores", summary="Listar todas las sedes del negocio")
async def list_stores(db: AsyncSession = Depends(get_db)):
    stmt = select(Store).order_by(Store.name.asc())
    stores = (await db.execute(stmt)).scalars().all()
    return stores

@router.get("/products", summary="Listar productos del menú y vitrina")
async def list_products(db: AsyncSession = Depends(get_db)):
    stmt = select(Product).order_by(Product.featured_order.asc().nulls_last())
    products = (await db.execute(stmt)).scalars().all()
    return products
