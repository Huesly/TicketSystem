// Cliente API para Customer Web (ConfyTickets)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8088/api/v1';

export interface CustomerProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
}

export interface CardSummary {
  id: string;
  cycle_number: number;
  stamps_count: number;
  stamps_required: number;
  stamps_remaining: number;
  progress_percentage: number;
  status: string;
  opened_at: string;
  completed_at?: string | null;
}

export interface CustomerCardsResponse {
  active_card: CardSummary | null;
  past_cycles: CardSummary[];
}

export interface QrTokenResponse {
  qr_token: string;
  purpose: 'PURCHASE' | 'REDEMPTION';
  expires_in_seconds: number;
  expires_at: string;
}

export interface CustomerReward {
  id: string;
  name: string;
  description: string;
  reward_type: string;
  status: 'AVAILABLE' | 'REDEEMED' | 'EXPIRED' | 'CANCELLED';
  issued_at: string;
  expires_at: string;
  eligible_stores: string[];
}

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image_path?: string;
  available: boolean;
  featured_order?: number;
}

export const api = {
  async getProfile(): Promise<CustomerProfile> {
    const res = await fetch(`${API_BASE}/me`);
    if (!res.ok) throw new Error(`Error ${res.status}: Fallo al obtener perfil`);
    return res.json();
  },

  async getLoyaltyCards(): Promise<CustomerCardsResponse> {
    const res = await fetch(`${API_BASE}/me/loyalty/cards`);
    if (!res.ok) throw new Error(`Error ${res.status}: Fallo al obtener tarjetas`);
    return res.json();
  },

  async generatePurchaseQr(): Promise<QrTokenResponse> {
    const res = await fetch(`${API_BASE}/me/qr/purchase`, { method: 'POST' });
    if (!res.ok) throw new Error(`Error ${res.status}: Fallo al generar QR de compra`);
    return res.json();
  },

  async getRewards(): Promise<CustomerReward[]> {
    const res = await fetch(`${API_BASE}/me/rewards`);
    if (!res.ok) throw new Error(`Error ${res.status}: Fallo al obtener recompensas`);
    return res.json();
  },

  async generateRewardQr(rewardId: string): Promise<QrTokenResponse> {
    const res = await fetch(`${API_BASE}/me/rewards/${rewardId}/qr`, { method: 'POST' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail?.message || err.detail || 'Fallo al generar QR de premio');
    }
    return res.json();
  },

  async getProducts(): Promise<ProductItem[]> {
    const res = await fetch(`${API_BASE}/admin/products`);
    if (!res.ok) throw new Error(`Error ${res.status}: Fallo al listar productos`);
    return res.json();
  }
};
