// Cliente API para Customer Mobile (ConfyTickets)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8088/api/v1';

export interface QrTokenResponse {
  qr_token: string;
  purpose: 'PURCHASE' | 'REDEMPTION';
  expires_in_seconds: number;
  expires_at: string;
}

export const api = {
  async generatePurchaseQr(): Promise<QrTokenResponse> {
    const res = await fetch(`${API_BASE}/me/qr/purchase`, { method: 'POST' });
    if (!res.ok) throw new Error(`Error ${res.status}: Fallo al generar QR`);
    return res.json();
  },

  async getLoyaltyCards() {
    const res = await fetch(`${API_BASE}/me/loyalty/cards`);
    if (!res.ok) throw new Error(`Error ${res.status}: Fallo al consultar tarjetas`);
    return res.json();
  },

  async getProducts() {
    const res = await fetch(`${API_BASE}/admin/products`);
    if (!res.ok) throw new Error(`Error ${res.status}: Fallo al consultar productos`);
    return res.json();
  }
};
