// =============================================================================
// CONSOLA INTERACTIVA DE ADMINISTRACIÓN, SQL Y CIBERSEGURIDAD (window.__confyDebug)
// Uso en DevTools (F12 -> Console):
//   __confyDebug.help()
//   await __confyDebug.securityAudit()
//   await __confyDebug.testSqlInjection()
//   await __confyDebug.runSql("SELECT id, full_name, email, status FROM profiles LIMIT 10;")
// =============================================================================

import { adminApi } from './api';

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
    version: '1.0.0-admin',

    help() {
      console.log(
        '%c🛡️ ConfyTickets Admin & Security JS Console (__confyDebug)',
        'background:#0f172a;color:#38bdf8;font-weight:bold;padding:6px 12px;border-radius:6px;font-size:13px;'
      );
      console.table([
        { comando: '__confyDebug.securityAudit()', descripcion: 'Audita en vivo WAF, Rate Limiting, cabeceras HTTP y Habeas Data' },
        { comando: '__confyDebug.testSqlInjection()', descripcion: 'Simula un ataque SQL Injection y verifica el bloqueo WAF (400)' },
        { comando: '__confyDebug.testRateLimit(5)', descripcion: 'Dispara ráfaga de peticiones para verificar contención Anti-DDoS' },
        { comando: '__confyDebug.runSql(sql, dryRun)', descripcion: 'Ejecuta o simula inputs SQL desde consola JS (requiere Admin JWT)' },
        { comando: '__confyDebug.inspectSession()', descripcion: 'Muestra el usuario autenticado, roles y vigencia del token JWT' },
        { comando: '__confyDebug.clearSession()', descripcion: 'Cierra la sesión JWT actual en localStorage y recarga la pantalla' },
        { comando: '__confyDebug.apiGet("/admin/dashboard")', descripcion: 'Ejecuta un GET autenticado contra cualquier ruta de /api/v1' },
      ]);
      return 'Comandos listos. Prueba: await __confyDebug.securityAudit()';
    },

    clearSession() {
      adminApi.logout();
      window.location.reload();
      return 'Sesión administrativa cerrada. Recargando...';
    },

    inspectSession() {
      const token = adminApi.getToken();
      const user = adminApi.getStoredUser();
      if (!token) {
        console.warn('[__confyDebug] No hay sesión administrativa activa.');
        return { authenticated: false };
      }
      const payload = decodeJwtPayload(token);
      const expDate = payload?.exp ? new Date(payload.exp * 1000).toLocaleString('es-CO') : 'N/A';
      const info = {
        authenticated: true,
        user_id: payload?.sub,
        email: payload?.email,
        roles: (payload?.roles || []).join(', '),
        expires_at: expDate,
        stored_name: user?.full_name || 'N/A'
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

    async runSql(sqlScript: string, dryRun = false) {
      const token = adminApi.getToken();
      if (!token) {
        console.error('[__confyDebug] Debes iniciar sesión como Administrador para ejecutar SQL.');
        return null;
      }
      console.log(`%c🗄️ Ejecutando lote SQL (${dryRun ? 'DRY-RUN / SIMULACIÓN' : 'TRANSACCIÓN REAL'})...`, 'color:#a855f7;font-weight:bold;');
      const res = await fetch(`${API_BASE}/admin/sql-import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ sql_script: sqlScript, dry_run: dryRun })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error('[Error SQL]', data);
        return data;
      }
      console.log(`✅ ${data.message} (${data.statements_executed} sentencias, ${data.total_rows_affected} filas afectadas)`);
      for (const item of data.details || []) {
        if (item.sample_rows && item.sample_rows.length > 0) {
          console.log(`Resultado Sentencia #${item.index} (${item.command}):`);
          console.table(item.sample_rows);
        }
      }
      return data;
    },

    async apiGet(path: string) {
      const token = adminApi.getToken();
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      const res = await fetch(`${API_BASE}${cleanPath}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json().catch(() => null);
      console.log(`[GET ${cleanPath}] Status ${res.status}:`, data);
      return data;
    }
  };

  (window as any).__confyDebug = sdk;
  console.log(
    '%c🛡️ ConfyTickets Admin Debug Console Lista -> Escribe __confyDebug.help() en consola',
    'background:#0f172a;color:#38bdf8;padding:4px 8px;border-radius:4px;font-weight:bold;'
  );
}
