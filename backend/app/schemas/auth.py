# =============================================================================
# SCHEMAS PYDANTIC: AUTENTICACIÓN, REGISTRO Y ROLES
# =============================================================================

from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field
from app.schemas.user import UserProfileSchema

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=4)

class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=3, max_length=150)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)
    phone: Optional[str] = Field(None, max_length=30)

class RegisterStaffRequest(BaseModel):
    full_name: str = Field(..., min_length=3, max_length=150)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)
    phone: Optional[str] = Field(None, max_length=30)
    role: str = Field("GENERAL_ADMIN", pattern="^(GENERAL_ADMIN|CASHIER|STORE_ADMIN)$")
    store_id: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfileSchema
    roles: List[str] = []

class AuthMeResponse(BaseModel):
    user: UserProfileSchema
    roles: List[str] = []
