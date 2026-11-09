<template>
  <div class="space-y-5 fluid-container">
    <div class="space-y-0.5">
      <h2 class="fluid-title font-extrabold text-stone-900">Mi Cuenta</h2>
      <p class="text-xs text-stone-500">Gestión de tu perfil y preferencias de fidelidad.</p>
    </div>

    <!-- ESTADO: USUARIO AUTENTICADO -->
    <div v-if="currentUser" class="space-y-4">
      <!-- Tarjeta Principal de Perfil -->
      <div class="bg-white rounded-2xl p-5 border border-stone-300 shadow-sm space-y-4">
        <div class="flex items-center gap-3.5">
          <!-- Avatar con Iniciales -->
          <div class="w-14 h-14 rounded-2xl bg-stone-900 text-white font-extrabold text-lg flex items-center justify-center border-2 border-stone-800 shadow-sm shrink-0">
            {{ userInitials }}
          </div>
          <div class="min-w-0 space-y-1">
            <div class="flex items-center gap-2">
              <h3 class="font-extrabold text-base text-stone-950 truncate">{{ currentUser.full_name }}</h3>
              <span class="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                Cliente Activo
              </span>
            </div>
            <p class="text-xs text-stone-500 font-mono truncate">{{ currentUser.email }}</p>
            <p v-if="currentUser.phone" class="text-xs text-stone-600 font-mono">{{ currentUser.phone }}</p>
          </div>
        </div>

        <!-- Métricas Rápidas del Cliente -->
        <div class="grid grid-cols-3 gap-2.5 pt-3 border-t border-stone-200 text-center">
          <div class="bg-stone-50 rounded-xl p-2.5 border border-stone-200">
            <span class="block text-lg font-black font-mono text-stone-900">{{ loyaltyStats.activeStamps }} / 8</span>
            <span class="text-[10px] text-stone-500 font-medium">Sellos Actuales</span>
          </div>
          <div class="bg-stone-50 rounded-xl p-2.5 border border-stone-200">
            <span class="block text-lg font-black font-mono text-stone-900">{{ loyaltyStats.completedCycles }}</span>
            <span class="text-[10px] text-stone-500 font-medium">Tarjetas Llenas</span>
          </div>
          <div class="bg-stone-50 rounded-xl p-2.5 border border-stone-200">
            <span class="block text-lg font-black font-mono text-stone-900">{{ loyaltyStats.rewardsClaimed }}</span>
            <span class="text-[10px] text-stone-500 font-medium">Premios Canjeados</span>
          </div>
        </div>
      </div>

      <!-- Opciones y Políticas del Programa -->
      <div class="bg-white rounded-2xl p-4 border border-stone-300 shadow-sm space-y-3">
        <h4 class="text-xs font-bold uppercase tracking-wider text-stone-500">Información del Programa</h4>
        
        <div class="space-y-2 text-xs">
          <div class="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-stone-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
              </svg>
              <span class="font-medium text-stone-800">Tratamiento de Datos Personales</span>
            </div>
            <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Aceptado
            </span>
          </div>

          <div class="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-stone-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              </svg>
              <span class="font-medium text-stone-800">Cobertura de Sedes</span>
            </div>
            <span class="text-[10px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-300">
              Multisede Activa
            </span>
          </div>
        </div>
      </div>

      <!-- Zona Segura de Cierre de Sesión -->
      <div class="bg-white rounded-2xl p-4 border border-stone-300 shadow-sm space-y-3">
        <h4 class="text-xs font-bold uppercase tracking-wider text-stone-500">Sesión y Dispositivo</h4>
        <p class="text-xs text-stone-600">
          Tu cuenta está protegida. Al cerrar sesión, requerirás tu correo y contraseña para volver a ver tus sellos.
        </p>
        <button
          type="button"
          @click="showLogoutConfirm = true"
          class="w-full bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs py-3 px-4 rounded-xl border border-red-300 transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
        >
          <svg class="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>

    <!-- ESTADO: NO AUTENTICADO -->
    <div v-else class="bg-white rounded-2xl p-6 border border-stone-300 shadow-sm text-center space-y-4">
      <div class="w-12 h-12 rounded-2xl bg-stone-100 text-stone-600 border border-stone-200 flex items-center justify-center mx-auto">
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>
        </svg>
      </div>
      <div class="space-y-1">
        <h3 class="font-extrabold text-base text-stone-950">Aún no has iniciado sesión</h3>
        <p class="text-xs text-stone-500 max-w-xs mx-auto">
          Inicia sesión para vincular tus sellos acumulados y tener acceso a tus premios desde cualquier dispositivo.
        </p>
      </div>
      <button
        type="button"
        @click="openLoginModal"
        class="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs py-3 px-6 rounded-xl border border-stone-900 transition cursor-pointer active:scale-[0.98] shadow-sm"
      >
        Iniciar Sesión o Crear Cuenta
      </button>
    </div>

    <!-- MODAL DE CONFIRMACIÓN DE CIERRE DE SESIÓN -->
    <div v-if="showLogoutConfirm" class="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div class="bg-white rounded-2xl border border-stone-300 p-6 w-full max-w-sm shadow-xl space-y-4 text-center">
        <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto border border-red-200">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </div>

        <div class="space-y-1">
          <h3 class="font-extrabold text-stone-950 text-base">¿Cerrar sesión en TicketsDemo?</h3>
          <p class="text-xs text-stone-600">
            Podrás volver a ingresar en cualquier momento con tu correo para ver tu tarjeta y sellos.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            @click="showLogoutConfirm = false"
            class="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs py-2.5 rounded-xl border border-stone-300 transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            @click="handleLogout"
            class="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs py-2.5 rounded-xl border border-stone-900 transition cursor-pointer"
          >
            Sí, Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { api, type CustomerProfile } from '../api';

const router = useRouter();
const currentUser = ref<CustomerProfile | null>(null);
const showLogoutConfirm = ref(false);
const loyaltyStats = ref({
  activeStamps: 0,
  completedCycles: 0,
  rewardsClaimed: 0
});

const userInitials = computed(() => {
  if (!currentUser.value?.full_name) return 'TD';
  const parts = currentUser.value.full_name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
});

const loadUserData = async () => {
  try {
    const profile = await api.getProfile().catch(() => null);
    currentUser.value = profile;

    if (profile) {
      const [cards, rewards] = await Promise.all([
        api.getLoyaltyCards().catch(() => null),
        api.getRewards().catch(() => null)
      ]);

      loyaltyStats.value = {
        activeStamps: cards?.active_card?.stamps_count || 0,
        completedCycles: cards?.past_cycles?.length || 0,
        rewardsClaimed: rewards?.length || 0
      };
    }
  } catch (err) {
    console.error('Error cargando perfil:', err);
  }
};

const openLoginModal = () => {
  window.dispatchEvent(new CustomEvent('open-auth-modal'));
};

const handleLogout = () => {
  api.clearToken();
  showLogoutConfirm.value = false;
  currentUser.value = null;
  window.dispatchEvent(new CustomEvent('confy-user-changed'));
  router.push('/');
};

onMounted(() => {
  loadUserData();
  window.addEventListener('confy-user-changed', loadUserData);
});

onUnmounted(() => {
  window.removeEventListener('confy-user-changed', loadUserData);
});
</script>
