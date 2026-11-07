// Cliente API para Terminal POS y Backoffice (ConfyTickets)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8088/api/v1';

export interface DashboardSummary {
  total_customers: number;
  active_cards: number;
  completed_cards: number;
  total_purchases_count: number;
  total_sales_amount_cop: number;
  total_stamps_awarded: number;
  total_rewards_redeemed: number;
}

export interface StoreItem {
  id: string;
  code: string;
  name: string;
  city: string;
  status: string;
  phone?: string;
  address?: string;
}

export interface PurchasePayload {
  qr_token: string;
  store_id: string;
  receipt_reference: string;
  gross_amount: number;
  discount_amount: number;
  currency: string;
}

export interface PurchaseResponse {
  purchase_id: string;
  status: string;
  receipt_reference: string;
  eligible_amount: number;
  stamps_awarded: number;
  customer_name?: string;
  allocation: Array<{
    card_cycle: number;
    stamps_added: number;
    total_in_card: number;
    cycle_status: string;
  }>;
  rewards_issued: Array<{
    reward_id: string;
    name: string;
  }>;
  created_at: string;
}

export interface RedemptionPayload {
  qr_token: string;
  store_id: string;
}

export interface RedemptionResponse {
  redemption_id: string;
  status: string;
  reward_name: string;
  customer_name?: string;
  redeemed_at: string;
}

export const adminApi = {
  async getDashboard(storeId?: string): Promise<{ summary: DashboardSummary }> {
    const url = storeId 
      ? `${API_BASE}/admin/dashboard?store_id=${storeId}` 
      : `${API_BASE}/admin/dashboard`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error ${res.status}: Fallo al consultar dashboard`);
    return res.json();
  },

  async getStores(): Promise<StoreItem[]> {
    const res = await fetch(`${API_BASE}/admin/stores`);
    if (!res.ok) throw new Error(`Error ${res.status}: Fallo al listar sedes`);
    return res.json();
  },

  async createPurchase(payload: PurchasePayload): Promise<PurchaseResponse> {
    const res = await fetch(`${API_BASE}/cashier/purchases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err.detail?.message || err.detail || 'Fallo al procesar compra';
      throw new Error(msg);
    }
    return res.json();
  },

  async redeemReward(payload: RedemptionPayload): Promise<RedemptionResponse> {
    const res = await fetch(`${API_BASE}/cashier/redemptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err.detail?.message || err.detail || 'Fallo al redimir premio';
      throw new Error(msg);
    }
    return res.json();
  }
};
