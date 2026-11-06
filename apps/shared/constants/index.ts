// =============================================================================
// CONSTANTES GLOBALES DE NEGOCIO (CONFYTICKETS)
// =============================================================================

export const DEFAULT_STAMPS_GOAL = 8;
export const QR_EXPIRATION_SECONDS = 60;
export const MAX_FEATURED_PRODUCTS = 5;
export const DEFAULT_CURRENCY = 'COP';
export const DEFAULT_TIMEZONE = 'America/Bogota';

export const API_ROUTES = {
  ME: '/me',
  ME_CARDS: '/me/loyalty/cards',
  ME_MOVEMENTS: '/me/loyalty/movements',
  ME_REWARDS: '/me/rewards',
  ME_PURCHASE_QR: '/me/qr/purchase',
  ME_REDEMPTION_QR: (rewardId: string) => `/me/rewards/${rewardId}/qr`,
  ME_NOTIFICATIONS: '/me/notifications',
  ME_PREFERENCES: '/me/notification-preferences',
  
  CASHIER_PURCHASE: '/cashier/purchases',
  CASHIER_REDEMPTION: '/cashier/redemptions',
  CASHIER_CANCEL: (purchaseId: string) => `/cashier/purchases/${purchaseId}/cancel`,

  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_STORES: '/admin/stores',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_BANNERS: '/admin/banners',
  ADMIN_CAMPAIGNS: '/admin/campaigns',
  ADMIN_AUDIT: '/admin/audit-logs',
} as const;
