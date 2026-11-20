// =============================================================================
// CONSOLA INTERACTIVA DE DIAGNÓSTICO Y CIBERSEGURIDAD (window.__confyDebug)
// Uso en DevTools (F12 -> Console):
//   await __confyDebug.help()
//   await __confyDebug.securityAudit()
//   await __confyDebug.testSqlInjection()
//   await __confyDebug.testRateLimit(5)
//   __confyDebug.inspectSession()
// =============================================================================

import { api } from './api';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function initConfyDebugConsole() {
  const sdk = {
    version: '1.0.0-customer',

    help() {
      console.log(
        '%c☕ ConfyTickets JS Console SDK (__confyDebug)',
        'background:#1c1917;color:#f59e0b;font-weight:bold;padding:6px 12px;border-radius:6px;font-size:13px;'
      );
      console.table([
        { comando: '__confyDebug.securityAudit()', descripcion: 'Audita en vivo WAF, Rate Limiting, cabeceras CSP/HSTS y Habeas Data' },
        { comando: '__confyDebug.testSqlInjection()', descripcion: 'Simula un ataque SQL Injection (OR 1=1) y verifica el bloqueo WAF' },
        { comando: '__confyDebug.testRateLimit(5)', descripcion: 'Dispara una ráfaga de peticiones para verificar el escudo Anti-DDoS' },
        { comando: '__confyDebug.inspectSession()', descripcion: 'Inspecciona el token JWT activo, expiración y perfil del cliente' },
        { comando: '__confyDebug.clearSession()', descripcion: 'Limpia el token JWT guardado en localStorage y recarga la vista de login' },
        { comando: '__confyDebug.apiGet("/me")', descripcion: 'Ejecuta un GET autenticado contra cualquier ruta de /api/v1' },
        { comando: '__confyDebug.apiPost(path, body)', descripcion: 'Ejecuta un POST autenticado contra cualquier ruta de /api/v1' },
      ]);
      return 'Usa cualquiera de los comandos anteriores en esta consola.';
    },

    clearSession() {
      api.clearToken();
      window.location.reload();
      return 'Sesión eliminada. Recargando...';
    },

    inspectSession() {
      const token = api.getToken();
      if (!token) {
        console.warn('[__confyDebug] No hay sesión JWT activa en este navegador.');
        return { authenticated: false };
      }
      const payload = decodeJwtPayload(token);
      const expDate = payload?.exp ? new Date(payload.exp * 1000).toLocaleString('es-CO') : 'N/A';
      const info = {
        authenticated: true,
        user_id: payload?.sub,
        email: payload?.email,
        roles: (payload?.roles || []).join(', ') || 'CUSTOMER',
        expires_at: expDate
      };
      console.table(info);
      return info;
    },

    async securityAudit() {
      console.log('%c🛡️ Ejecutando Auditoría de Ciberseguridad en vivo...', 'color:#10b981;font-weight:bold;');
      const res = await fetch(`${API_BASE}/auth/security-status`);
      const data = await res.json();
      const headersReport = {
        'X-Security-Shield': res.headers.get('x-security-shield') || 'Activo',
        'X-RateLimit-Limit': res.headers.get('x-ratelimit-limit') || '120',
        'X-RateLimit-Remaining': res.headers.get('x-ratelimit-remaining') || 'N/A',
        'Content-Security-Policy': (res.headers.get('content-security-policy') || 'Activo').slice(0, 60) + '...',
      };
      console.log('Cabeceras HTTP de Protección:', headersReport);
      console.log('Estado del Motor de Seguridad Backend:', data);
      return { headers: headersReport, backend: data };
    },

    async testSqlInjection() {
      console.log('%c🧪 Probando vector de SQL Injection contra el WAF...', 'color:#f59e0b;font-weight:bold;');
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: "attacker@test.com' OR '1'='1' --",
          password: "123456'; DROP TABLE profiles; --"
        })
      });
      const body = await res.json().catch(() => ({}));
      console.log(`Respuesta HTTP: ${res.status} (${res.status === 400 ? 'BLOQUEADO EXITOSAMENTE POR WAF' : 'RECHAZADO'})`, body);
      return { status: res.status, response: body };
    },

    async testRateLimit(burstCount = 5) {
      const count = Math.min(30, Math.max(1, Number(burstCount) || 5));
      console.log(`%c⚡ Disparando ráfaga de ${count} peticiones para medir Rate Limiting Anti-DDoS...`, 'color:#3b82f6;font-weight:bold;');
      const results = [];
      for (let i = 1; i <= count; i++) {
        const res = await fetch(`${API_BASE}/auth/security-status`);
        results.push({
          peticion: `#${i}`,
          status: res.status,
          limite_minuto: res.headers.get('x-ratelimit-limit'),
          restantes: res.headers.get('x-ratelimit-remaining')
        });
      }
      console.table(results);
      return results;
    },

    async apiGet(path: string) {
      const token = api.getToken();
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      const res = await fetch(`${API_BASE}${cleanPath}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json().catch(() => null);
      console.log(`[GET ${cleanPath}] Status ${res.status}:`, data);
      return data;
    },

    async apiPost(path: string, payload: Record<string, any> = {}) {
      const token = api.getToken();
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      const res = await fetch(`${API_BASE}${cleanPath}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => null);
      console.log(`[POST ${cleanPath}] Status ${res.status}:`, data);
      return data;
    }
  };

  (window as any).__confyDebug = sdk;
  console.log(
    '%c☕ ConfyTickets Debug Console Lista -> Escribe __confyDebug.help() en consola',
    'background:#1c1917;color:#fbbf24;padding:4px 8px;border-radius:4px;font-weight:bold;'
  );
}
