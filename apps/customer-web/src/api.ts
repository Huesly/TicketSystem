// =============================================================================
// CLIENTE API PARA CUSTOMER WEB (CONFYTICKETS) CON AUTENTICACIÓN JWT
// =============================================================================

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';
const TOKEN_KEY = 'confy_customer_token';

export interface CustomerProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  document_type?: string | null;
  document_number?: string | null;
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

export interface FeaturedBanner {
  id?: string;
  badge_text?: string;
  title?: string;
  description?: string;
  icon?: string;
  status: 'active' | 'inactive';
  target_url?: string | null;
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

export interface QrStatusResponse {
  status: 'PENDING' | 'CONSUMED' | 'EXPIRED';
  purpose: 'PURCHASE' | 'REDEMPTION';
  expires_in_seconds?: number;
  consumed_at?: string;
  purchase?: {
    store_name: string;
    receipt_reference: string;
    gross_amount: number;
    stamps_awarded: number;
  };
  redemption?: {
    store_name: string;
    reward_name: string;
  };
}

export interface LiveStatusResponse {
  user_id: string;
  card: {
    id: string | null;
    cycle_number: number;
    stamps_count: number;
    stamps_required: number;
    stamps_remaining: number;
    progress_percentage: number;
    is_completed: boolean;
  };
  available_rewards_count: number;
  recent_alert?: {
    id: string;
    type: 'PURCHASE' | 'REDEMPTION';
    title: string;
    message: string;
    receipt_reference?: string;
    gross_amount?: number;
    stamps_awarded?: number;
    store_name?: string;
    product_name?: string;
    created_at: string;
  } | null;
}

export interface CustomerReward {
  id: string;
  name: string;
  description: string;
  reward_type: string;
  status: 'AVAILABLE' | 'REDEEMED' | 'EXPIRED' | 'CANCELLED';
  issued_at: string;
  expires_at: string;
  redeemed_at?: string;
  selected_product?: string;
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

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: CustomerProfile;
  roles: string[];
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

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Credenciales inválidas');
    }
    const data: AuthResponse = await res.json();
    this.setToken(data.access_token);
    return data;
  },

  async register(
    full_name: string,
    email: string,
    password: string,
    phone?: string,
    accept_terms = true,
    accept_marketing = false
  ): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name, email, password, phone, accept_terms, accept_marketing })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Fallo en el registro de usuario');
    }
    const data: AuthResponse = await res.json();
    this.setToken(data.access_token);
    return data;
  },

  async getAuthMe(): Promise<{ user: CustomerProfile; roles: string[] } | null> {
    const token = this.getToken();
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        this.clearToken();
        return null;
      }
      return res.json();
    } catch {
      return null;
    }
  },

  async getProfile(): Promise<CustomerProfile> {
    const res = await fetch(`${API_BASE}/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(`Error ${res.status}: Fallo al obtener perfil`);
    return res.json();
  },

  async getLoyaltyCards(): Promise<CustomerCardsResponse> {
    const res = await fetch(`${API_BASE}/me/loyalty/cards`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(`Error ${res.status}: Fallo al obtener tarjetas`);
    return res.json();
  },

  async getLiveStatus(): Promise<LiveStatusResponse> {
    const res = await fetch(`${API_BASE}/me/live-status`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(`Error ${res.status}: Fallo al consultar estado en vivo`);
    return res.json();
  },

  async generatePurchaseQr(): Promise<QrTokenResponse> {
    const res = await fetch(`${API_BASE}/me/qr/purchase`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(`Error ${res.status}: Fallo al generar QR de compra`);
    return res.json();
  },

  async checkQrStatus(qrToken: string): Promise<QrStatusResponse> {
    const res = await fetch(`${API_BASE}/me/qr/status?qr_token=${encodeURIComponent(qrToken)}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(`Error ${res.status}: Fallo al verificar estado de QR`);
    return res.json();
  },

  async getRewards(): Promise<CustomerReward[]> {
    const res = await fetch(`${API_BASE}/me/rewards`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(`Error ${res.status}: Fallo al obtener recompensas`);
    return res.json();
  },

  async generateRewardQr(rewardId: string): Promise<QrTokenResponse> {
    const res = await fetch(`${API_BASE}/me/rewards/${rewardId}/qr`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
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
  },

  async getFeaturedBanner(): Promise<FeaturedBanner | null> {
    try {
      const res = await fetch(`${API_BASE}/me/banner`);
      if (!res.ok) return null;
      const data: FeaturedBanner = await res.json();
      if (!data || data.status !== 'active') return null;
      return data;
    } catch {
      return null;
    }
  },

  async forgotPassword(email: string): Promise<{ message: string; expires_in_minutes?: number; dev_code?: string }> {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Error al solicitar código de recuperación');
    }
    return res.json();
  },

  async resetPassword(payload: { email: string; code: string; new_password: string }): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Error al restablecer la contraseña');
    }
    return res.json();
  },

  async changePassword(payload: { current_password: string; new_password: string }): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Error al actualizar la contraseña');
    }
    return res.json();
  },

  async updateProfile(payload: {
    full_name?: string;
    phone?: string;
    document_type?: string;
    document_number?: string;
  }): Promise<CustomerProfile> {
    const res = await fetch(`${API_BASE}/me`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Error al actualizar perfil');
    }
    return res.json();
  },

  async getMyPurchases(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/me/purchases`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Error al consultar historial de facturas');
    return res.json();
  },

  async getMyPurchaseInvoice(purchaseId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/me/purchases/${purchaseId}/invoice?reprint=true`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Error al generar representación de factura DIAN');
    }
    return res.json();
  },

  async downloadMyPurchaseInvoiceXml(purchaseId: string, invoiceNumber: string): Promise<void> {
    const res = await fetch(`${API_BASE}/me/purchases/${purchaseId}/invoice-xml`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Error al descargar XML DIAN');
    const xmlText = await res.text();
    const blob = new Blob([xmlText], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DIAN_${invoiceNumber}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  }
};
