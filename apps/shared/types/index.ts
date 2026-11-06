// =============================================================================
// CONTRATOS Y TIPOS GLOBALES TYPESCRIPT (CONFYTICKETS)
// =============================================================================

export type UserRole = 'OWNER' | 'GENERAL_ADMIN' | 'STORE_ADMIN' | 'CASHIER' | 'MARKETING';

export type CardStatus = 'accumulating' | 'completed' | 'expired' | 'cancelled';

export type RewardStatus = 'AVAILABLE' | 'REDEEMED' | 'EXPIRED' | 'CANCELLED' | 'PENDING_REVIEW';

export type StampMovementType = 'EARN' | 'REVERSAL' | 'EXPIRATION' | 'ADJUSTMENT' | 'CARRY_IN' | 'CARRY_OUT';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  status: 'active' | 'blocked' | 'suspended';
  created_at: string;
}

export interface Store {
  id: string;
  code: string;
  name: string;
  address: string;
  city: string;
  department: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  geofence_radius_meters: number;
  phone?: string | null;
  status: 'active' | 'inactive';
}

export interface LoyaltyCard {
  id: string;
  cycle_number: number;
  stamps_count: number;
  stamps_required: number;
  stamps_remaining: number;
  progress_percentage: number;
  status: CardStatus;
  opened_at: string;
  completed_at?: string | null;
}

export interface StampMovement {
  id: string;
  card_id: string;
  quantity: number;
  movement_type: StampMovementType;
  source_store_name?: string;
  created_at: string;
  reason?: string | null;
}

export interface CustomerReward {
  id: string;
  name: string;
  description: string;
  reward_type: 'product' | 'percentage_discount' | 'fixed_discount' | 'special';
  status: RewardStatus;
  issued_at: string;
  expires_at?: string | null;
  eligible_stores: string[];
}

export interface QrTokenResponse {
  qr_token: string;
  purpose: 'PURCHASE' | 'REDEMPTION';
  expires_in_seconds: number;
  expires_at: string;
}

export interface FeaturedProduct {
  id: string;
  name: string;
  description: string;
  price?: number | null;
  currency: string;
  image_path?: string | null;
  featured_order: number;
  available: boolean;
}

export interface PromotionalBanner {
  id: string;
  title: string;
  description?: string | null;
  image_path: string;
  target_url?: string | null;
  sort_order: number;
  starts_at: string;
  ends_at?: string | null;
}
