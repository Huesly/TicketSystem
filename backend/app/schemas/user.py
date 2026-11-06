# =============================================================================
# SCHEMAS PYDANTIC: PERFIL DE USUARIO Y CONSENTIMIENTOS
# =============================================================================

from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict

class UserProfileSchema(BaseModel):
    id: UUID
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserUpdateSchema(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None


class NotificationPreferenceUpdate(BaseModel):
    category: str
    enabled: bool
