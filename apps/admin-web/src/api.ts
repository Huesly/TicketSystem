// =============================================================================
// CLIENTE API PARA TERMINAL POS Y BACKOFFICE CON AUTENTICACIÓN JWT Y CRUD
// =============================================================================

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';
const TOKEN_KEY = 'confy_pos_token';
const USER_KEY = 'confy_pos_user';
const ROLES_KEY = 'confy_pos_roles';

export interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  status: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: AdminUser;
  roles: string[];
}

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
  department?: string;
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

export interface AuditTransactionItem {
  id: string;
  type: 'PURCHASE' | 'REDEMPTION';
  reference: string;
  created_at: string;
  store_name: string;
  customer_name: string;
  customer_email: string;
  cashier_name: string;
  amount_cop?: number | null;
  stamps_awarded?: number | null;
  reward_name?: string | null;
  status: string;
}

export interface ProductAdminItem {
  id: string;
  business_id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  available: boolean;
  featured_order?: number | null;
  published_at?: string;
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

export const adminApi = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getStoredUser(): AdminUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  getStoredRoles(): string[] {
    const raw = localStorage.getItem(ROLES_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ROLES_KEY);
    localStorage.removeItem('confy_pos_active_store_id');
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
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    localStorage.setItem(ROLES_KEY, JSON.stringify(data.roles));
    return data;
  },

  async getAuthMe(): Promise<{ user: AdminUser; roles: string[] } | null> {
    const token = this.getToken();
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        this.logout();
        return null;
      }
      const data = await res.json();
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      localStorage.setItem(ROLES_KEY, JSON.stringify(data.roles));
      return data;
    } catch {
      return null;
    }
  },

  async getDashboard(storeId?: string): Promise<{ summary: DashboardSummary }> {
    const url = storeId 
      ? `${API_BASE}/admin/dashboard?store_id=${storeId}` 
      : `${API_BASE}/admin/dashboard`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`Error ${res.status}: Fallo al consultar dashboard`);
    return res.json();
  },

  async getTransactions(storeId?: string, limit = 50): Promise<AuditTransactionItem[]> {
    const url = storeId
      ? `${API_BASE}/admin/transactions?store_id=${storeId}&limit=${limit}`
      : `${API_BASE}/admin/transactions?limit=${limit}`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`Error ${res.status}: Fallo al consultar auditoría`);
    return res.json();
  },

  async getStores(): Promise<StoreItem[]> {
    const res = await fetch(`${API_BASE}/admin/stores`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`Error ${res.status}: Fallo al listar sedes`);
    return res.json();
  },

  async createStore(payload: { code: string; name: string; address: string; city: string; phone?: string }): Promise<StoreItem> {
    const res = await fetch(`${API_BASE}/admin/stores`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Fallo al registrar sede');
    }
    return res.json();
  },

  async updateStore(storeId: string, payload: { name?: string; address?: string; city?: string; phone?: string; status?: string }): Promise<StoreItem> {
    const res = await fetch(`${API_BASE}/admin/stores/${storeId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Fallo al actualizar sede');
    }
    return res.json();
  },

  async getProducts(): Promise<ProductAdminItem[]> {
    const res = await fetch(`${API_BASE}/admin/products`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`Error ${res.status}: Fallo al listar productos`);
    return res.json();
  },

  async createProduct(payload: { name: string; description: string; price: number; available?: boolean; featured_order?: number | null }): Promise<ProductAdminItem> {
    const res = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ...payload, currency: 'COP' })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Fallo al crear producto');
    }
    return res.json();
  },

  async updateProduct(productId: string, payload: { name?: string; description?: string; price?: number; available?: boolean; featured_order?: number | null }): Promise<ProductAdminItem> {
    const res = await fetch(`${API_BASE}/admin/products/${productId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Fallo al actualizar producto');
    }
    return res.json();
  },

  async deleteProduct(productId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/products/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Fallo al eliminar producto');
    }
  },

  async createPurchase(payload: PurchasePayload): Promise<PurchaseResponse> {
    const res = await fetch(`${API_BASE}/cashier/purchases`, {
      method: 'POST',
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err.detail?.message || err.detail || 'Fallo al redimir premio';
      throw new Error(msg);
    }
    return res.json();
  },

  async generateDemoPurchaseQr(): Promise<{ qr_token: string }> {
    const res = await fetch(`${API_BASE}/me/qr/purchase`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Fallo al generar QR demo');
    return res.json();
  }
};
