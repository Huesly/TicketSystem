# =============================================================================
# SCHEMAS PYDANTIC: COMPRAS Y CAJA
# =============================================================================

from uuid import UUID
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict

class PurchaseCreateRequest(BaseModel):
    qr_token: str = Field(..., description="Token escaneado del QR del cliente")
    store_id: UUID = Field(..., description="Sede donde se realiza la compra")
    receipt_reference: str = Field(..., min_length=1, max_length=100, description="Número de factura o ticket")
    gross_amount: int = Field(..., ge=0, description="Importe total pagado en COP")
    discount_amount: int = Field(default=0, ge=0, description="Descuentos aplicados")
    currency: str = Field(default="COP", min_length=3, max_length=3)

    model_config = ConfigDict(extra="forbid")


class PurchaseAllocation(BaseModel):
    card_cycle: int
    stamps_added: int
    total_in_card: int
    cycle_status: str


class IssuedRewardInfo(BaseModel):
    reward_id: UUID
    name: str


class PurchaseResponse(BaseModel):
    purchase_id: UUID
    status: str
    receipt_reference: str
    eligible_amount: int
    stamps_awarded: int
    allocation: List[PurchaseAllocation]
    rewards_issued: List[IssuedRewardInfo]
    customer_name: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PurchaseCancelRequest(BaseModel):
    reason: str = Field(..., min_length=5, max_length=500, description="Justificación obligatoria de anulación")
