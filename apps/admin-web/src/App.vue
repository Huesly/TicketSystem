<template>
  <div class="min-h-dvh-safe flex flex-col bg-stone-100 text-stone-900 selection:bg-stone-900 selection:text-white">
    <!-- PANTALLA DE ACCESO AL SISTEMA POS SI NO HAY SESIÓN -->
    <div v-if="!currentUser" class="flex-1 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl border border-stone-300 p-6 sm:p-8 w-full max-w-sm shadow-xl space-y-5">
        <div class="text-center space-y-1.5">
          <div class="w-11 h-11 rounded-2xl bg-stone-900 text-amber-300 flex items-center justify-center mx-auto mb-2 border border-stone-800 shadow-md">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
              <line x1="6" y1="2" x2="6" y2="4" />
              <line x1="10" y1="2" x2="10" y2="4" />
              <line x1="14" y1="2" x2="14" y2="4" />
            </svg>
          </div>
          <h2 class="text-lg font-extrabold text-stone-950">PosDemo Terminal</h2>
          <p class="text-xs text-stone-500 font-medium">Ingreso para Cajeros y Administradores</p>
        </div>

        <!-- Alerta de error -->
        <div v-if="loginError" class="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
          {{ loginError }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-3">
          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Correo Electrónico</label>
            <input 
              v-model="loginEmail" 
              type="email" 
              required 
              autocomplete="username"
              autocapitalize="none"
              spellcheck="false"
              placeholder="cajero@confy.com.co"
              class="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-stone-50 text-stone-900"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Contraseña</label>
            <input 
              v-model="loginPassword" 
              type="password" 
              required 
              autocomplete="current-password"
              placeholder="••••••••"
              class="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-stone-50 text-stone-900"
            />
          </div>

          <button 
            type="submit" 
            :disabled="loadingLogin"
            class="w-full bg-stone-900 hover:bg-stone-800 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl border border-stone-900 transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            <span v-if="loadingLogin" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{{ loadingLogin ? 'Validando...' : 'Iniciar Turno' }}</span>
          </button>
        </form>

        <!-- Accesos rápidos pre-cargados para demostración -->
        <div class="pt-3 border-t border-stone-200 space-y-2">
          <p class="text-[10px] text-stone-500 font-semibold uppercase tracking-wider text-center">Acceso Rápido de Demostración</p>
          <div class="grid grid-cols-2 gap-2">
            <button 
              type="button"
              @click="quickLogin('cajero.cabecera@confy.com.co', 'Cajero2026*')"
              class="text-[11px] font-semibold text-stone-800 bg-stone-50 hover:bg-stone-100 border border-stone-200 hover:border-amber-400 p-2.5 rounded-xl transition text-left cursor-pointer active:scale-95 shadow-2xs"
            >
              <span class="block font-bold text-stone-950">Juan Pérez</span>
              <span class="text-[10px] text-stone-500 font-medium">Rol: Cajero POS</span>
            </button>
            <button 
              type="button"
              @click="quickLogin('admin@confy.com.co', 'Admin2026*')"
              class="text-[11px] font-semibold text-stone-800 bg-stone-50 hover:bg-stone-100 border border-stone-200 hover:border-amber-400 p-2.5 rounded-xl transition text-left cursor-pointer active:scale-95 shadow-2xs"
            >
              <span class="block font-bold text-stone-950">Admin General</span>
              <span class="text-[10px] text-stone-500 font-medium">Rol: Administrador</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- SISTEMA POS AUTENTICADO -->
    <template v-else>
      <!-- Barra Superior Compacta (< 12% viewport height) -->
      <header class="bg-white text-stone-900 px-4 sm:px-6 h-14 flex items-center justify-between border-b border-stone-200 sticky top-0 z-40">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-stone-900 text-amber-300 flex items-center justify-center shrink-0 shadow-xs">
            <!-- Icono SVG: Local Cafe -->
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
              <line x1="6" y1="2" x2="6" y2="4" />
              <line x1="10" y1="2" x2="10" y2="4" />
              <line x1="14" y1="2" x2="14" y2="4" />
            </svg>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="font-extrabold text-sm tracking-tight text-stone-950">PosDemo</span>
            <span class="text-[11px] font-mono font-medium text-stone-500 hidden sm:inline">Terminal POS &amp; Admin</span>
          </div>
        </div>

        <nav class="flex items-center gap-1.5" aria-label="Navegación principal">
          <router-link 
            to="/" 
            class="text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 border"
            :class="$route.name === 'cashier' 
              ? 'bg-stone-900 text-white border-stone-900 shadow-xs' 
              : 'bg-transparent text-stone-600 border-transparent hover:bg-stone-100 hover:border-stone-300 hover:text-stone-900'"
          >
            <!-- SVG: Point of Sale / Terminal -->
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect width="20" height="14" x="2" y="3" rx="2" />
              <line x1="8" x2="16" y1="21" y2="21" />
              <line x1="12" x2="12" y1="17" y2="21" />
            </svg>
            <span>Terminal</span>
          </router-link>

          <router-link 
            to="/dashboard" 
            class="text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 border"
            :class="$route.name === 'dashboard' 
              ? 'bg-stone-900 text-white border-stone-900 shadow-xs' 
              : 'bg-transparent text-stone-600 border-transparent hover:bg-stone-100 hover:border-stone-300 hover:text-stone-900'"
          >
            <!-- SVG: Bar Chart / Analytics -->
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" x2="18" y1="20" y2="10" />
              <line x1="12" x2="12" y1="20" y2="4" />
              <line x1="6" x2="6" y1="20" y2="14" />
            </svg>
            <span>Analítica</span>
          </router-link>

          <div class="h-4 w-px bg-crema-border mx-1.5 hidden sm:block"></div>

          <!-- Perfil del Cajero / Admin -->
          <div class="flex items-center gap-2 bg-stone-50 border border-stone-300 px-2.5 py-1 rounded-lg">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span class="text-[11px] text-stone-800 font-semibold">{{ currentUser.full_name }}</span>
            <span class="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-stone-200 text-stone-700">
              {{ currentRoles.includes('GENERAL_ADMIN') ? 'Admin' : 'Cajero' }}
            </span>
          </div>

          <!-- Botón de Cerrar Turno -->
          <button 
            type="button"
            @click="logout"
            title="Cerrar turno y salir"
            class="text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 p-1.5 rounded-lg border border-transparent hover:border-stone-300 transition cursor-pointer"
          >
            <svg class="w-4 h-4 text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </nav>
      </header>

      <!-- Contenedor Principal Líquido -->
      <main class="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 fluid-container">
        <router-view />
      </main>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { adminApi, type AdminUser } from './api';

const currentUser = ref<AdminUser | null>(adminApi.getStoredUser());
const currentRoles = ref<string[]>(adminApi.getStoredRoles());

const loginEmail = ref('');
const loginPassword = ref('');
const loadingLogin = ref(false);
const loginError = ref('');

const checkSession = async () => {
  const me = await adminApi.getAuthMe();
  if (me) {
    currentUser.value = me.user;
    currentRoles.value = me.roles;
  } else {
    currentUser.value = null;
    currentRoles.value = [];
  }
};

const handleLogin = async () => {
  loadingLogin.value = true;
  loginError.value = '';
  try {
    const res = await adminApi.login(loginEmail.value, loginPassword.value);
    currentUser.value = res.user;
    currentRoles.value = res.roles;
  } catch (err: any) {
    loginError.value = err.message || 'Error al iniciar sesión';
  } finally {
    loadingLogin.value = false;
  }
};

const quickLogin = async (email: string, pass: string) => {
  loginEmail.value = email;
  loginPassword.value = pass;
  await handleLogin();
};

const logout = () => {
  adminApi.logout();
  currentUser.value = null;
  currentRoles.value = [];
};

onMounted(() => {
  if (currentUser.value) {
    checkSession();
  }
});
</script>
