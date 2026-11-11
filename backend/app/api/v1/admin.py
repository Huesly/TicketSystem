# =============================================================================
# ENDPOINTS REST: ADMINISTRACIÓN, GESTIÓN CRUD Y AUDITORÍA (/api/v1/admin)
# =============================================================================

import uuid
from typing import List, Optional
from uuid import UUID
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_

from app.core.database import get_db
from app.models.business import Business, Store
from app.models.user import Profile
from app.models.loyalty import LoyaltyCard, StampMovement
from app.models.purchase import Purchase
from app.models.reward import CustomerReward, RewardRedemption, RewardDefinition
from app.models.content import Product, Banner
from app.schemas.admin import (
    ProductCreateSchema,
    ProductUpdateSchema,
    ProductResponseSchema,
    StoreCreateSchema,
    StoreUpdateSchema,
    AuditTransactionItem,
    BannerUpdateSchema,
    BannerResponseSchema
)
from app.api.deps import get_current_cashier_or_admin, get_current_admin

router = APIRouter(prefix="/admin", tags=["Administración y Backoffice"])

# Helper para obtener el business_id principal
async def get_default_business_id(db: AsyncSession) -> UUID:
    stmt = select(Business.id).limit(1)
    res = await db.execute(stmt)
    bid = res.scalar_one_or_none()
    if not bid:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se encontró una empresa configurada en el sistema"
        )
    return bid

# -----------------------------------------------------------------------------
# 1. DASHBOARD & MÉTRICAS GLOBALES
# -----------------------------------------------------------------------------
@router.get("/dashboard", summary="Resumen ejecutivo de KPIs multisede")
async def get_dashboard(
    store_id: Optional[UUID] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    total_customers = (await db.execute(select(func.count(Profile.id)))).scalar_one()

    active_cards = (await db.execute(
        select(func.count(LoyaltyCard.id)).where(LoyaltyCard.status == "accumulating")
    )).scalar_one()

    completed_cards = (await db.execute(
        select(func.count(LoyaltyCard.id)).where(LoyaltyCard.status == "completed")
    )).scalar_one()

    purchases_query = select(
        func.coalesce(func.sum(Purchase.eligible_amount), 0),
        func.count(Purchase.id)
    ).where(Purchase.status == "confirmed")

    if store_id:
        purchases_query = purchases_query.where(Purchase.store_id == store_id)

    sales_amount, total_purchases = (await db.execute(purchases_query)).one()

    stamps_awarded = (await db.execute(
        select(func.coalesce(func.sum(StampMovement.quantity), 0))
        .where(StampMovement.movement_type.in_(["EARN", "CARRY_IN"]))
    )).scalar_one()

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


# -----------------------------------------------------------------------------
# 2. AUDITORÍA DE TRANSACCIONES EN VIVO
# -----------------------------------------------------------------------------
@router.get("/transactions", response_model=List[AuditTransactionItem], summary="Bitácora en vivo de compras y canjes")
async def list_transactions(
    store_id: Optional[UUID] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db)
):
    """
    Retorna el flujo unificado en tiempo real de facturas registradas y
    recompensas redimidas en caja, con datos de auditoría completos.
    """
    # 1. Consultar Compras
    purchase_stmt = (
        select(
            Purchase.id,
            Purchase.receipt_reference,
            Purchase.created_at,
            Purchase.gross_amount,
            Purchase.status,
            Store.name.label("store_name"),
            Profile.full_name.label("customer_name"),
            Profile.email.label("customer_email")
        )
        .join(Store, Purchase.store_id == Store.id)
        .join(Profile, Purchase.customer_id == Profile.id)
        .order_by(Purchase.created_at.desc())
        .limit(limit)
    )
    if store_id:
        purchase_stmt = purchase_stmt.where(Purchase.store_id == store_id)

    purchases = (await db.execute(purchase_stmt)).all()

    # 2. Consultar Canjes de Recompensas
    redemption_stmt = (
        select(
            RewardRedemption.id,
            RewardRedemption.created_at,
            RewardRedemption.status,
            RewardDefinition.name.label("reward_name"),
            Store.name.label("store_name"),
            Profile.full_name.label("customer_name"),
            Profile.email.label("customer_email")
        )
        .join(Store, RewardRedemption.store_id == Store.id)
        .join(CustomerReward, RewardRedemption.customer_reward_id == CustomerReward.id)
        .join(RewardDefinition, CustomerReward.definition_id == RewardDefinition.id)
        .join(Profile, CustomerReward.customer_id == Profile.id)
        .order_by(RewardRedemption.created_at.desc())
        .limit(limit)
    )
    if store_id:
        redemption_stmt = redemption_stmt.where(RewardRedemption.store_id == store_id)

    redemptions = (await db.execute(redemption_stmt)).all()

    items: List[AuditTransactionItem] = []

    for p in purchases:
        # Calcular sellos asignados a esta compra
        stamps_stmt = (
            select(func.coalesce(func.sum(StampMovement.quantity), 0))
            .where(StampMovement.purchase_id == p.id)
        )
        stamps_count = (await db.execute(stamps_stmt)).scalar_one()

        items.append(AuditTransactionItem(
            id=p.id,
            type="PURCHASE",
            reference=f"Factura #{p.receipt_reference}",
            created_at=p.created_at,
            store_name=p.store_name,
            customer_name=p.customer_name,
            customer_email=p.customer_email,
            cashier_name="Cajero en Turno",
            amount_cop=p.gross_amount,
            stamps_awarded=stamps_count,
            reward_name=None,
            status=p.status
        ))

    for r in redemptions:
        items.append(AuditTransactionItem(
            id=r.id,
            type="REDEMPTION",
            reference=f"Canje de {r.reward_name}",
            created_at=r.created_at,
            store_name=r.store_name,
            customer_name=r.customer_name,
            customer_email=r.customer_email,
            cashier_name="Cajero en Turno",
            amount_cop=None,
            stamps_awarded=None,
            reward_name=r.reward_name,
            status=r.status
        ))

    # Ordenar unificado cronológico descendente
    items.sort(key=lambda x: x.created_at, reverse=True)
    return items[:limit]


# -----------------------------------------------------------------------------
# 3. GESTIÓN CRUD DE SEDES FÍSICAS
# -----------------------------------------------------------------------------
@router.get("/stores", summary="Listar todas las sedes del negocio")
async def list_stores(db: AsyncSession = Depends(get_db)):
    stmt = select(Store).order_by(Store.name.asc())
    stores = (await db.execute(stmt)).scalars().all()
    return stores

@router.post("/stores", status_code=status.HTTP_201_CREATED, summary="Registrar nueva sede física")
async def create_store(
    payload: StoreCreateSchema,
    db: AsyncSession = Depends(get_db)
):
    business_id = await get_default_business_id(db)

    # Verificar unicidad de código
    exists = await db.execute(select(Store).where(Store.code == payload.code.strip()))
    if exists.scalar_one_or_none():
        raise HTTPException(status_code=400, detail=f"El código de sede '{payload.code}' ya existe.")

    new_store = Store(
        id=uuid.uuid4(),
        business_id=business_id,
        code=payload.code.strip(),
        name=payload.name.strip(),
        address=payload.address.strip(),
        city=payload.city.strip(),
        department=payload.department.strip(),
        phone=payload.phone.strip() if payload.phone else None,
        status=payload.status,
        timezone="America/Bogota",
        geofence_radius_meters=150,
        opening_hours={}
    )
    db.add(new_store)
    await db.commit()
    await db.refresh(new_store)
    return new_store

@router.put("/stores/{store_id}", summary="Actualizar datos de una sede física")
async def update_store(
    store_id: UUID,
    payload: StoreUpdateSchema,
    db: AsyncSession = Depends(get_db)
):
    store = await db.get(Store, store_id)
    if not store:
        raise HTTPException(status_code=404, detail="Sede no encontrada")

    if payload.name is not None:
        store.name = payload.name.strip()
    if payload.address is not None:
        store.address = payload.address.strip()
    if payload.city is not None:
        store.city = payload.city.strip()
    if payload.phone is not None:
        store.phone = payload.phone.strip()
    if payload.status is not None:
        store.status = payload.status

    await db.commit()
    await db.refresh(store)
    return store


# -----------------------------------------------------------------------------
# 4. GESTIÓN CRUD DE PRODUCTOS DEL MENÚ Y VITRINA
# -----------------------------------------------------------------------------
@router.get("/products", summary="Listar productos del menú y vitrina")
async def list_products(db: AsyncSession = Depends(get_db)):
    stmt = select(Product).order_by(Product.featured_order.asc().nulls_last(), Product.name.asc())
    products = (await db.execute(stmt)).scalars().all()
    return products

@router.post("/products", response_model=ProductResponseSchema, status_code=status.HTTP_201_CREATED, summary="Crear nuevo producto en vitrina")
async def create_product(
    payload: ProductCreateSchema,
    db: AsyncSession = Depends(get_db)
):
    business_id = await get_default_business_id(db)

    new_product = Product(
        id=uuid.uuid4(),
        business_id=business_id,
        name=payload.name.strip(),
        description=payload.description.strip(),
        price=payload.price,
        currency=payload.currency,
        available=payload.available,
        featured_order=payload.featured_order,
        published_at=datetime.now(timezone.utc)
    )
    db.add(new_product)
    await db.commit()
    await db.refresh(new_product)
    return new_product

@router.put("/products/{product_id}", response_model=ProductResponseSchema, summary="Modificar producto del catálogo")
async def update_product(
    product_id: UUID,
    payload: ProductUpdateSchema,
    db: AsyncSession = Depends(get_db)
):
    product = await db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    if payload.name is not None:
        product.name = payload.name.strip()
    if payload.description is not None:
        product.description = payload.description.strip()
    if payload.price is not None:
        product.price = payload.price
    if payload.available is not None:
        product.available = payload.available
    if payload.featured_order is not None:
        product.featured_order = payload.featured_order

    await db.commit()
    await db.refresh(product)
    return product

@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Eliminar producto")
async def delete_product(
    product_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    product = await db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    await db.delete(product)
    await db.commit()
    return None


# -----------------------------------------------------------------------------
# 5. GESTIÓN DE BANNER Y NOVEDADES DINÁMICAS
# -----------------------------------------------------------------------------
@router.get("/banner", response_model=BannerResponseSchema, summary="Obtener configuración del banner activo")
async def get_admin_banner(
    current_user = Depends(get_current_cashier_or_admin),
    db: AsyncSession = Depends(get_db)
):
    bid = await get_default_business_id(db)
    stmt = select(Banner).where(Banner.business_id == bid).order_by(Banner.sort_order.asc()).limit(1)
    res = await db.execute(stmt)
    banner = res.scalar_one_or_none()
    if not banner:
        now = datetime.now(timezone.utc)
        banner = Banner(
            business_id=bid,
            badge_text="Cosecha de Origen",
            title="Café de Origen Huila",
            description="Notas tostadas a chocolate negro y caramelo.",
            icon="coffee",
            status="active",
            created_at=now,
            updated_at=now
        )
        db.add(banner)
        await db.commit()
        await db.refresh(banner)

    return banner


@router.put("/banner", response_model=BannerResponseSchema, summary="Actualizar banner de novedades con validación")
async def update_admin_banner(
    payload: BannerUpdateSchema,
    current_user = Depends(get_current_cashier_or_admin),
    db: AsyncSession = Depends(get_db)
):
    bid = await get_default_business_id(db)
    stmt = select(Banner).where(Banner.business_id == bid).order_by(Banner.sort_order.asc()).limit(1)
    res = await db.execute(stmt)
    banner = res.scalar_one_or_none()
    now = datetime.now(timezone.utc)

    if not banner:
        banner = Banner(
            business_id=bid,
            badge_text=payload.badge_text.strip(),
            title=payload.title.strip(),
            description=payload.description.strip(),
            icon=payload.icon.strip(),
            status=payload.status,
            target_url=payload.target_url.strip() if payload.target_url else None,
            created_at=now,
            updated_at=now
        )
        db.add(banner)
    else:
        banner.badge_text = payload.badge_text.strip()
        banner.title = payload.title.strip()
        banner.description = payload.description.strip()
        banner.icon = payload.icon.strip()
        banner.status = payload.status
        banner.target_url = payload.target_url.strip() if payload.target_url else None
        banner.updated_at = now

    await db.commit()
    await db.refresh(banner)
    return banner

