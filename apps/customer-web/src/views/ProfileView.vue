<template>
  <div class="space-y-5 fluid-container">
    <div class="space-y-0.5">
      <h2 class="fluid-title font-extrabold text-[#3E2B1E]">Mi Cuenta</h2>
      <p class="text-xs text-[#786558]">Gestión de tu perfil y preferencias de fidelidad.</p>
    </div>

    <!-- ======================================================================= -->
    <!-- SKELETON LOADER SUAVE CON SHIMMER & DIFUMINADO                         -->
    <!-- ======================================================================= -->
    <div v-if="loading" class="space-y-4" aria-hidden="true">
      <!-- Skeleton Tarjeta Principal de Perfil -->
      <div class="bg-white rounded-2xl p-5 border border-[#E3DAD2] shadow-sm space-y-4">
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
      <div class="bg-white rounded-2xl p-4 border border-[#E3DAD2] shadow-sm space-y-3">
        <div class="h-3.5 w-36 rounded skeleton-shimmer"></div>
        <div class="space-y-2">
          <div class="h-10 rounded-xl skeleton-shimmer"></div>
          <div class="h-10 rounded-xl skeleton-shimmer"></div>
        </div>
      </div>

      <div class="h-12 bg-white rounded-2xl border border-[#E3DAD2] skeleton-shimmer"></div>
    </div>

    <!-- ======================================================================= -->
    <!-- CONTENIDO REAL CON ANIMACIÓN DIFUMINADA (FADE-ENTER-SOFT)               -->
    <!-- ======================================================================= -->
    <template v-else>
      <!-- ESTADO: USUARIO AUTENTICADO -->
      <div v-if="currentUser" class="space-y-4 fade-enter-soft">
        <!-- Tarjeta Principal de Perfil -->
        <div class="bg-white rounded-2xl p-5 border border-[#E3DAD2] shadow-sm space-y-4">
          <div class="flex items-center gap-3.5">
            <!-- Avatar con Iniciales -->
            <div class="w-14 h-14 rounded-2xl bg-[#5D4432] text-[#E9E3DD] font-extrabold text-lg flex items-center justify-center border-2 border-[#3E2B1E] shadow-2xs shrink-0">
              {{ userInitials }}
            </div>
            <div class="min-w-0 space-y-1">
              <div class="flex items-center gap-2">
                <h3 class="font-extrabold text-base text-[#3E2B1E] truncate">{{ currentUser.full_name }}</h3>
                <span class="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  Socio Activo
                </span>
              </div>
              <p class="text-xs text-[#786558] font-mono truncate">{{ currentUser.email }}</p>
              <p v-if="currentUser.phone" class="text-xs text-[#786558] font-mono">{{ currentUser.phone }}</p>
            </div>
          </div>

          <!-- Métricas Rápidas del Cliente -->
          <div class="grid grid-cols-3 gap-2.5 pt-3 border-t border-[#E3DAD2] text-center">
            <div class="bg-[#F9F7F5] rounded-xl p-2.5 border border-[#E3DAD2]">
              <span class="block text-lg font-black font-mono text-[#3E2B1E]">{{ loyaltyStats.activeStamps }} / 8</span>
              <span class="text-[10px] text-[#786558] font-medium">Sellos Actuales</span>
            </div>
            <div class="bg-[#F9F7F5] rounded-xl p-2.5 border border-[#E3DAD2]">
              <span class="block text-lg font-black font-mono text-[#3E2B1E]">{{ loyaltyStats.completedCycles }}</span>
              <span class="text-[10px] text-[#786558] font-medium">Ciclos Llenos</span>
            </div>
            <div class="bg-[#F9F7F5] rounded-xl p-2.5 border border-[#E3DAD2]">
              <span class="block text-lg font-black font-mono text-[#3E2B1E]">{{ loyaltyStats.rewardsClaimed }}</span>
              <span class="text-[10px] text-[#786558] font-medium">Premios</span>
            </div>
          </div>
        </div>

        <!-- Opciones y Políticas del Programa -->
        <div class="bg-white rounded-2xl p-4 border border-[#E3DAD2] shadow-sm space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-[#786558]">Información del Programa</h4>
          
          <div class="space-y-2 text-xs">
            <div class="flex items-center justify-between p-2.5 bg-[#F9F7F5] rounded-xl border border-[#E3DAD2]">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-[#786558]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                </svg>
                <span class="font-medium text-[#3E2B1E]">Tratamiento de Datos Personales</span>
              </div>
              <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Aceptado
              </span>
            </div>

            <div class="flex items-center justify-between p-2.5 bg-[#F9F7F5] rounded-xl border border-[#E3DAD2]">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-[#786558]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
                </svg>
                <span class="font-medium text-[#3E2B1E]">Versión de Plataforma</span>
              </div>
              <span class="text-[11px] font-mono text-[#786558] font-semibold">
                TicketsDemo v1.0
              </span>
            </div>
          </div>
        </div>

        <!-- Opciones de Seguridad y Contraseña -->
        <div class="bg-white rounded-2xl p-4 border border-[#E3DAD2] shadow-sm space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-[#786558]">Seguridad de la Cuenta</h4>
          <button
            type="button"
            @click="openChangePasswordModal"
            class="w-full text-xs font-bold text-[#3E2B1E] bg-[#F9F7F5] hover:bg-[#E9E3DD]/60 border border-[#E3DAD2] px-4 py-2.5 rounded-xl transition flex items-center justify-between cursor-pointer"
          >
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-[#786558]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>
              </svg>
              <span>Cambiar mi contraseña</span>
            </div>
            <span class="text-xs text-[#786558]">→</span>
          </button>
        </div>

        <!-- Botón de Cerrar Sesión Seguro -->
        <div class="bg-white rounded-2xl p-4 border border-[#E3DAD2] shadow-sm space-y-2">
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
      <div v-else class="bg-white rounded-2xl p-6 border border-[#E3DAD2] shadow-sm text-center space-y-4 fade-enter-soft">
        <div class="w-14 h-14 rounded-2xl bg-[#F9F7F5] text-[#786558] flex items-center justify-center mx-auto border border-[#E3DAD2]">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div class="space-y-1">
          <h3 class="font-extrabold text-base text-[#3E2B1E]">Inicia sesión en tu cuenta</h3>
          <p class="text-xs text-[#786558] max-w-xs mx-auto">
            Inicia sesión para vincular tus sellos acumulados y tener acceso a tus premios desde cualquier dispositivo.
          </p>
        </div>
        <button
          type="button"
          @click="openLoginModal"
          class="bg-[#5D4432] hover:bg-[#473325] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition cursor-pointer shadow-sm active:scale-95"
        >
          Iniciar Sesión
        </button>
      </div>
    </template>

    <!-- Modal de Confirmación de Cierre de Sesión -->
    <div v-if="showLogoutConfirm" class="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl border border-[#E3DAD2] p-5 w-full max-w-sm text-center shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div class="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto border border-red-200">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </div>

        <div class="space-y-1">
          <h3 class="font-extrabold text-base text-[#3E2B1E]">¿Cerrar sesión en TicketsDemo?</h3>
          <p class="text-xs text-[#786558]">
            Podrás volver a ingresar en cualquier momento con tu correo para ver tu tarjeta y sellos.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            @click="showLogoutConfirm = false"
            class="w-full text-xs font-bold text-[#3E2B1E] bg-[#F9F7F5] hover:bg-stone-200 border border-[#E3DAD2] py-2.5 rounded-xl transition cursor-pointer"
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

    <!-- Modal Cambiar Contraseña del Cliente -->
    <div v-if="showChangePasswordModal" class="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl border border-[#E3DAD2] p-5 w-full max-w-sm shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between pb-1 border-b border-[#E3DAD2]">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-[#5D4432] text-[#E9E3DD] flex items-center justify-center">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-extrabold text-[#3E2B1E]">Seguridad</h3>
              <p class="text-[11px] text-[#786558]">Cambiar mi contraseña</p>
            </div>
          </div>
          <button 
            type="button" 
            @click="showChangePasswordModal = false" 
            class="text-[#786558] hover:text-[#3E2B1E] p-1 rounded-lg cursor-pointer"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        <div v-if="pwdError" class="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
          {{ pwdError }}
        </div>
        <div v-if="pwdSuccess" class="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
          {{ pwdSuccess }}
        </div>

        <form @submit.prevent="handleChangePassword" class="space-y-3">
          <div class="space-y-1">
            <label class="block text-xs font-bold text-[#3E2B1E]">Contraseña Actual</label>
            <input 
              v-model="currentPassword" 
              type="password" 
              required 
              placeholder="••••••••"
              class="w-full text-xs px-3 py-2 rounded-xl border border-[#E3DAD2] focus:border-[#5D4432] bg-[#F9F7F5] text-[#3E2B1E] outline-none"
            />
          </div>

          <div class="space-y-1">
            <label class="block text-xs font-bold text-[#3E2B1E]">Nueva Contraseña (mínimo 6 caracteres)</label>
            <input 
              v-model="newPassword" 
              type="password" 
              required 
              minlength="6"
              placeholder="••••••••"
              class="w-full text-xs px-3 py-2 rounded-xl border border-[#E3DAD2] focus:border-[#5D4432] bg-[#F9F7F5] text-[#3E2B1E] outline-none"
            />
          </div>

          <div class="space-y-1">
            <label class="block text-xs font-bold text-[#3E2B1E]">Confirmar Nueva Contraseña</label>
            <input 
              v-model="confirmPassword" 
              type="password" 
              required 
              minlength="6"
              placeholder="••••••••"
              class="w-full text-xs px-3 py-2 rounded-xl border border-[#E3DAD2] focus:border-[#5D4432] bg-[#F9F7F5] text-[#3E2B1E] outline-none"
            />
          </div>

          <div class="grid grid-cols-2 gap-2 pt-2">
            <button 
              type="button" 
              @click="showChangePasswordModal = false" 
              class="w-full text-xs font-bold text-[#3E2B1E] bg-[#F9F7F5] hover:bg-stone-200 py-2.5 rounded-xl border border-[#E3DAD2] transition cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              :disabled="pwdLoading"
              class="w-full bg-[#5D4432] hover:bg-[#473325] disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
            >
              <span v-if="pwdLoading" class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{{ pwdLoading ? 'Guardando...' : 'Actualizar' }}</span>
            </button>
          </div>
        </form>
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

// Cambio de Contraseña Modal
const showChangePasswordModal = ref(false);
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const pwdLoading = ref(false);
const pwdError = ref('');
const pwdSuccess = ref('');

const openChangePasswordModal = () => {
  currentPassword.value = '';
  newPassword.value = '';
  confirmPassword.value = '';
  pwdError.value = '';
  pwdSuccess.value = '';
  showChangePasswordModal.value = true;
};

const handleChangePassword = async () => {
  pwdError.value = '';
  pwdSuccess.value = '';

  if (!currentPassword.value) {
    pwdError.value = 'Ingresa tu contraseña actual.';
    return;
  }
  if (!newPassword.value || newPassword.value.length < 6) {
    pwdError.value = 'La nueva contraseña debe tener al menos 6 caracteres.';
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    pwdError.value = 'Las contraseñas no coinciden.';
    return;
  }

  pwdLoading.value = true;
  try {
    const res = await api.changePassword({
      current_password: currentPassword.value,
      new_password: newPassword.value
    });
    pwdSuccess.value = res.message || 'Contraseña actualizada correctamente.';
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
    setTimeout(() => {
      showChangePasswordModal.value = false;
    }, 1800);
  } catch (err: any) {
    pwdError.value = err.message || 'Error al cambiar contraseña';
  } finally {
    pwdLoading.value = false;
  }
};
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