// Cliente API para Customer Mobile (ConfyTickets)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8088/api/v1';
const TOKEN_KEY = 'confy_customer_token';

export interface QrTokenResponse {
  qr_token: string;
  purpose: 'PURCHASE' | 'REDEMPTION';
  expires_in_seconds: number;
  expires_at: string;
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Credenciales inválidas');
    }
    const data = await res.json();
    this.setToken(data.access_token);
    return data;
  },

  async generatePurchaseQr(): Promise<QrTokenResponse> {
    const res = await fetch(`${API_BASE}/me/qr/purchase`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(`Error ${res.status}: Fallo al generar QR`);
    return res.json();
  },

  async getLoyaltyCards() {
    const res = await fetch(`${API_BASE}/me/loyalty/cards`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(`Error ${res.status}: Fallo al consultar tarjetas`);
    return res.json();
  },

  async getProducts() {
    const res = await fetch(`${API_BASE}/admin/products`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(`Error ${res.status}: Fallo al consultar productos`);
    return res.json();
  }
};
