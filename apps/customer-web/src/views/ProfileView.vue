<template>
  <div class="space-y-5 fluid-container">
    <div class="space-y-0.5">
      <h2 class="fluid-title font-extrabold text-stone-900">Mi Cuenta</h2>
      <p class="text-xs text-stone-500">Gestión de tu perfil y preferencias de fidelidad.</p>
    </div>

    <!-- ======================================================================= -->
    <!-- SKELETON LOADER SUAVE CON SHIMMER & DIFUMINADO                         -->
    <!-- ======================================================================= -->
    <div v-if="loading" class="space-y-4" aria-hidden="true">
      <!-- Skeleton Tarjeta Principal de Perfil -->
      <div class="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4">
        <div class="flex items-center gap-3.5">
          <div class="w-14 h-14 rounded-2xl skeleton-shimmer shrink-0"></div>
          <div class="space-y-2 flex-1">
            <div class="h-4 w-36 rounded skeleton-shimmer"></div>
            <div class="h-3 w-48 rounded skeleton-shimmer"></div>
            <div class="h-3 w-28 rounded skeleton-shimmer"></div>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2.5 pt-3 border-t border-stone-100">
          <div v-for="s in 3" :key="s" class="h-16 rounded-xl skeleton-shimmer"></div>
        </div>
      </div>

      <!-- Skeleton Info Cards -->
      <div class="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-3">
        <div class="h-3.5 w-36 rounded skeleton-shimmer"></div>
        <div class="space-y-2">
          <div class="h-10 rounded-xl skeleton-shimmer"></div>
          <div class="h-10 rounded-xl skeleton-shimmer"></div>
        </div>
      </div>

      <div class="h-12 bg-white rounded-2xl border border-stone-200 skeleton-shimmer"></div>
    </div>

    <!-- ======================================================================= -->
    <!-- CONTENIDO REAL CON ANIMACIÓN DIFUMINADA (FADE-ENTER-SOFT)               -->
    <!-- ======================================================================= -->
    <template v-else>
      <!-- ESTADO: USUARIO AUTENTICADO -->
      <div v-if="currentUser" class="space-y-4 fade-enter-soft">
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
                <span class="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  Socio Activo
                </span>
              </div>
              <p class="text-xs text-stone-600 font-mono truncate">{{ currentUser.email }}</p>
              <p v-if="currentUser.phone" class="text-xs text-stone-500 font-mono">{{ currentUser.phone }}</p>
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
              <span class="text-[10px] text-stone-500 font-medium">Ciclos Llenos</span>
            </div>
            <div class="bg-stone-50 rounded-xl p-2.5 border border-stone-200">
              <span class="block text-lg font-black font-mono text-stone-900">{{ loyaltyStats.rewardsClaimed }}</span>
              <span class="text-[10px] text-stone-500 font-medium">Premios</span>
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
                  <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
                </svg>
                <span class="font-medium text-stone-800">Versión de Plataforma</span>
              </div>
              <span class="text-[11px] font-mono text-stone-600 font-semibold">
                TicketsDemo v1.0
              </span>
            </div>
          </div>
        </div>

        <!-- Botón de Cerrar Sesión Seguro -->
        <div class="bg-white rounded-2xl p-4 border border-stone-300 shadow-sm space-y-2">
          <button
            type="button"
            @click="showLogoutConfirm = true"
            class="w-full text-xs font-bold text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 px-4 py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Cerrar Sesión</span>
          </button>
          <p class="text-[10px] text-stone-400 text-center">
            Tu cuenta está protegida. Al cerrar sesión, requerirás tu correo y contraseña para volver a ver tus sellos.
          </p>
        </div>
      </div>

      <!-- ESTADO: NO AUTENTICADO -->
      <div v-else class="bg-white rounded-2xl p-6 border border-stone-300 shadow-sm text-center space-y-4 fade-enter-soft">
        <div class="w-14 h-14 rounded-2xl bg-stone-100 text-stone-600 flex items-center justify-center mx-auto border border-stone-200">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div class="space-y-1">
          <h3 class="font-extrabold text-base text-stone-900">Inicia sesión en tu cuenta</h3>
          <p class="text-xs text-stone-500 max-w-xs mx-auto">
            Inicia sesión para vincular tus sellos acumulados y tener acceso a tus premios desde cualquier dispositivo.
          </p>
        </div>
        <button
          type="button"
          @click="openLoginModal"
          class="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition cursor-pointer shadow-sm active:scale-95"
        >
          Iniciar Sesión
        </button>
      </div>
    </template>

    <!-- Modal de Confirmación de Cierre de Sesión -->
    <div v-if="showLogoutConfirm" class="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl border border-stone-300 p-5 w-full max-w-sm text-center shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div class="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto border border-red-200">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </div>

        <div class="space-y-1">
          <h3 class="font-extrabold text-base text-stone-950">¿Cerrar sesión en TicketsDemo?</h3>
          <p class="text-xs text-stone-600">
            Podrás volver a ingresar en cualquier momento con tu correo para ver tu tarjeta y sellos.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            @click="showLogoutConfirm = false"
            class="w-full text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 py-2.5 rounded-xl transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            @click="handleLogout"
            class="w-full text-xs font-bold text-white bg-red-600 hover:bg-red-700 py-2.5 rounded-xl transition cursor-pointer shadow-sm active:scale-95"
          >
            Sí, salir
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
const loading = ref(true);
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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const loadUserData = async () => {
  try {
    loading.value = true;
    const minDelay = delay(850);
    const [profile] = await Promise.all([
      api.getProfile().catch(() => null),
      minDelay
    ]);
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
  } finally {
    loading.value = false;
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