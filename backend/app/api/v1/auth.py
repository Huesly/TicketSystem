# =============================================================================
# ENDPOINTS REST: AUTENTICACIÓN, REGISTRO Y GESTIÓN DE CUENTAS (/api/v1/auth)
# =============================================================================

import uuid
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, AuthMeResponse
from app.schemas.user import UserProfileSchema
from app.models.user import Profile, BusinessMembership
from app.models.loyalty import LoyaltyProgram, LoyaltyProgramVersion, LoyaltyCard
from app.api.deps import get_current_user, get_user_roles

router = APIRouter(prefix="/auth", tags=["Autenticación y Cuentas"])

@router.post("/login", response_model=TokenResponse, summary="Iniciar sesión con correo y contraseña")
async def login(
    payload: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Autentica clientes, cajeros o administradores mediante credenciales seguras.
    Emite un JWT con los roles autorizados.
    """
    email_clean = payload.email.lower().strip()
    stmt = select(Profile).where(Profile.email == email_clean)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()

    if not user or not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Esta cuenta está desactivada o suspendida"
        )

    roles = await get_user_roles(user.id, db)
    token = create_access_token(data={
        "sub": str(user.id),
        "email": user.email,
        "roles": roles
    })

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserProfileSchema.model_validate(user),
        roles=roles
    )


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED, summary="Registro público de nuevos clientes")
async def register(
    payload: RegisterRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Registra un nuevo cliente con tarjeta digital de 8 sellos inicializada en ciclo 1.
    """
    email_clean = payload.email.lower().strip()
    existing = await db.execute(select(Profile).where(Profile.email == email_clean))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe una cuenta registrada con este correo electrónico"
        )

    new_user_id = uuid.uuid4()
    hashed = get_password_hash(payload.password)

    new_profile = Profile(
        id=new_user_id,
        full_name=payload.full_name.strip(),
        email=email_clean,
        phone=payload.phone.strip() if payload.phone else None,
        hashed_password=hashed,
        status="active"
    )
    db.add(new_profile)

    # Inicializar Tarjeta de Fidelización si existe programa activo
    prog_stmt = (
        select(LoyaltyProgram, LoyaltyProgramVersion)
        .join(LoyaltyProgramVersion, LoyaltyProgram.id == LoyaltyProgramVersion.program_id)
        .where(LoyaltyProgram.status == "active")
        .order_by(LoyaltyProgramVersion.version_number.desc())
        .limit(1)
    )
    prog_res = (await db.execute(prog_stmt)).first()
    if prog_res:
        program, version = prog_res
        initial_card = LoyaltyCard(
            id=uuid.uuid4(),
            customer_id=new_user_id,
            program_id=program.id,
            program_version_id=version.id,
            cycle_number=1,
            stamps_required_snapshot=version.stamps_required,
            status="accumulating",
            opened_at=datetime.now(timezone.utc)
        )
        db.add(initial_card)

    await db.commit()
    await db.refresh(new_profile)

    roles: List[str] = []
    token = create_access_token(data={
        "sub": str(new_profile.id),
        "email": new_profile.email,
        "roles": roles
    })

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserProfileSchema.model_validate(new_profile),
        roles=roles
    )


@router.get("/me", response_model=AuthMeResponse, summary="Obtener usuario en sesión actual y sus roles")
async def get_auth_me(
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retorna los datos del usuario autenticado a partir del token JWT."""
    roles = await get_user_roles(current_user.id, db)
    return AuthMeResponse(
        user=UserProfileSchema.model_validate(current_user),
        roles=roles
    )
