<template>
  <div class="min-h-dvh-safe flex flex-col max-w-md mx-auto bg-stone-50 border-x border-stone-200 relative pb-20 text-stone-900">
    <!-- Barra Superior Compacta (< 12% viewport height) -->
    <header class="bg-white/95 backdrop-blur-md text-stone-900 px-4 h-14 flex items-center justify-between sticky top-0 z-30 border-b border-stone-200">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center shrink-0">
          <!-- SVG: Local Cafe -->
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
            <line x1="6" y1="2" x2="6" y2="4" />
            <line x1="10" y1="2" x2="10" y2="4" />
            <line x1="14" y1="2" x2="14" y2="4" />
          </svg>
        </div>
        <div>
          <span class="font-extrabold text-xs sm:text-sm leading-tight tracking-tight block text-stone-950">TicketsDemo</span>
          <span class="text-[9px] text-stone-500 font-medium block">Tarjeta de Fidelidad</span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- Acceso a Mi Cuenta (Sin riesgo de logout accidental) -->
        <router-link 
          v-if="currentUser" 
          to="/cuenta"
          class="bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-stone-300 transition flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
          title="Ver mi perfil y cuenta"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
          <span class="max-w-[100px] truncate">{{ currentUser.full_name.split(' ')[0] }}</span>
          <svg class="w-3.5 h-3.5 text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>
          </svg>
        </router-link>

        <button 
          v-else
          type="button"
          @click="showAuthModal = true"
          class="bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-xl border border-stone-900 transition cursor-pointer shadow-2xs active:scale-95"
        >
          Iniciar Sesión
        </button>
      </div>
    </header>

    <!-- Contenido Principal Líquido -->
    <main class="flex-1 p-5 fluid-container">
      <router-view />
    </main>

    <!-- Barra de Navegación Inferior Compacta (4 pestañas) -->
    <nav class="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 h-14 flex items-center justify-around z-30" aria-label="Navegación inferior">
      <router-link 
        to="/" 
        class="flex flex-col items-center gap-1 text-[11px] font-semibold transition py-1 px-2 rounded-lg" 
        :class="$route.name === 'home' ? 'text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-600'"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span>Inicio</span>
      </router-link>

      <router-link 
        to="/mi-tarjeta" 
        class="flex flex-col items-center gap-1 text-[11px] font-semibold transition py-1 px-2 rounded-lg" 
        :class="$route.name === 'card' ? 'text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-600'"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
        </svg>
        <span>Tarjeta</span>
      </router-link>

      <router-link 
        to="/recompensas" 
        class="flex flex-col items-center gap-1 text-[11px] font-semibold transition py-1 px-2 rounded-lg" 
        :class="$route.name === 'rewards' ? 'text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-600'"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
          <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>
        </svg>
        <span>Premios</span>
      </router-link>

      <router-link 
        to="/cuenta" 
        class="flex flex-col items-center gap-1 text-[11px] font-semibold transition py-1 px-2 rounded-lg" 
        :class="$route.name === 'profile' ? 'text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-600'"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>
        </svg>
        <span>Cuenta</span>
      </router-link>
    </nav>

    <!-- Modal de Autenticación / Registro -->
    <AuthModal 
      :is-open="showAuthModal" 
      @close="showAuthModal = false" 
      @authenticated="checkAuth"
    />

    <!-- Modal de Código QR Minimalista -->
    <div v-if="showQrModal" class="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="qr-dialog-title">
      <div class="bg-white rounded-2xl border border-stone-300 p-6 w-full max-w-sm text-center shadow-xl space-y-4">
        
        <!-- ESTADO 1: CELEBRACIÓN EN TIEMPO REAL AL ESCANEAR EL CAJERO -->
        <div v-if="consumedSuccess" class="py-4 space-y-3.5 animate-in fade-in zoom-in-95 duration-300">
          <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-2 border-emerald-300 shadow-sm animate-bounce">
            <!-- Google Material Icon: Check Circle -->
            <svg class="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          </div>

          <div class="space-y-1">
            <span class="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              ¡Operación Confirmada en Caja!
            </span>
            <h3 class="font-extrabold text-stone-950 text-lg leading-tight">
              +{{ consumedSuccess.stamps_awarded }} {{ consumedSuccess.stamps_awarded === 1 ? 'Sello Sumado' : 'Sellos Sumados' }}
            </h3>
            <p class="text-xs text-stone-600 font-medium">
              Registrado en <strong>{{ consumedSuccess.store_name }}</strong>
            </p>
          </div>

          <div class="bg-stone-50 rounded-xl p-3 border border-stone-200 text-xs text-stone-600 space-y-0.5 font-mono">
            <div>Factura: <strong>{{ consumedSuccess.receipt_reference }}</strong></div>
            <div v-if="consumedSuccess.gross_amount">Valor: ${{ consumedSuccess.gross_amount.toLocaleString('es-CO') }} COP</div>
          </div>

          <p class="text-[11px] text-stone-400 font-medium">
            Tu tarjeta digital se actualizó automáticamente.
          </p>
        </div>

        <!-- ESTADO 2: CÓDIGO QR ACTIVO Y EN ESPERA -->
        <template v-else>
          <!-- Encabezado del Modal -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              <span class="text-xs font-bold uppercase tracking-wider text-stone-600">Esperando escaneo en caja...</span>
            </div>
            <button 
              type="button"
              @click="closeQrModal" 
              class="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer transition"
              aria-label="Cerrar modal"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>

          <div class="space-y-1">
            <h3 id="qr-dialog-title" class="font-extrabold text-stone-900 text-base">Presenta este código en caja</h3>
            <p class="text-xs text-stone-500">El cajero escaneará tu código para sumar sellos automáticamente.</p>
          </div>

          <!-- Visor QR con Aspect Ratio Fijo (Prevención de CLS) -->
          <div class="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex flex-col items-center justify-center aspect-square w-full max-w-[220px] mx-auto shadow-inner relative">
            <div v-if="loadingQr" class="flex flex-col items-center gap-2 text-xs font-semibold text-stone-400">
              <div class="w-6 h-6 border-2 border-stone-900 border-t-transparent rounded-full animate-spin"></div>
              <span>Generando QR...</span>
            </div>

            <div v-else-if="qrExpired" class="space-y-3 text-center">
              <div class="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <p class="text-xs font-bold text-red-700">El código expiró</p>
              <button 
                type="button"
                @click="fetchQr" 
                class="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer transition"
              >
                Actualizar código
              </button>
            </div>

            <div v-else class="bg-white p-3 rounded-xl border border-stone-200 shadow-sm">
              <qrcode-vue 
                :value="qrToken" 
                :size="176" 
                level="M" 
                render-as="svg"
              />
            </div>
          </div>

          <!-- Acción para Copiar Token Manual -->
          <div class="space-y-2">
            <button 
              v-if="!qrExpired && qrToken"
              type="button"
              @click="copyToken"
              class="w-full text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-300 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path v-if="copied" d="M20 6 9 17l-5-5"/>
                <template v-else>
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </template>
              </svg>
              <span>{{ copied ? 'Token copiado al portapapeles' : 'Copiar token manual' }}</span>
            </button>

            <div class="flex items-center justify-center gap-2 text-xs font-medium text-stone-500 pt-1">
              <span class="w-2 h-2 rounded-full" :class="timeLeft > 15 ? 'bg-emerald-600' : 'bg-red-600 animate-ping'"></span>
              <span>Expira en <strong class="text-stone-900 font-mono">{{ timeLeft }}s</strong></span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import QrcodeVue from 'qrcode.vue';
import { api, type CustomerProfile } from './api';
import AuthModal from './components/AuthModal.vue';

const showAuthModal = ref(false);
const currentUser = ref<CustomerProfile | null>(null);

const showQrModal = ref(false);
const qrToken = ref('');
const timeLeft = ref(60);
const qrExpired = ref(false);
const loadingQr = ref(false);
const copied = ref(false);
const consumedSuccess = ref<{ store_name: string; receipt_reference: string; stamps_awarded: number; gross_amount: number } | null>(null);

let timer: any = null;
let pollTimer: any = null;

const playSuccessChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      const audioCtx = new AudioContextClass();
      const now = audioCtx.currentTime;

      // Nota 1 (Mi 659 Hz)
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.25);

      // Nota 2 (Sol# 830 Hz)
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(830.61, now + 0.12);
      gain2.gain.setValueAtTime(0.25, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.45);

      // Nota 3 (Si 987 Hz - acorde alegre)
      const osc3 = audioCtx.createOscillator();
      const gain3 = audioCtx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(987.77, now + 0.24);
      gain3.gain.setValueAtTime(0.3, now + 0.24);
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
      osc3.connect(gain3);
      gain3.connect(audioCtx.destination);
      osc3.start(now + 0.24);
      osc3.stop(now + 0.75);
    }
    if ('vibrate' in navigator) {
      navigator.vibrate([80, 40, 120]);
    }
  } catch {
    // Ignore audio restriction
  }
};

const checkAuth = async () => {
  const auth = await api.getAuthMe();
  if (auth) {
    currentUser.value = auth.user;
  } else {
    currentUser.value = null;
  }
};

const startStatusPolling = (token: string) => {
  clearInterval(pollTimer);
  pollTimer = setInterval(async () => {
    if (!showQrModal.value || qrExpired.value || !token) {
      clearInterval(pollTimer);
      return;
    }
    try {
      const res = await api.checkQrStatus(token);
      if (res.status === 'CONSUMED') {
        clearInterval(pollTimer);
        clearInterval(timer);
        playSuccessChime();
        consumedSuccess.value = res.purchase || {
          store_name: 'Sede Principal',
          receipt_reference: 'Comprobante',
          stamps_awarded: 1,
          gross_amount: 0
        };
        // Notificar a las pantallas hijas para refrescar sellos inmediatamente
        window.dispatchEvent(new CustomEvent('confy-user-changed'));

        // Cerrar modal automáticamente después de celebrar
        setTimeout(() => {
          showQrModal.value = false;
          consumedSuccess.value = null;
        }, 3200);
      } else if (res.status === 'EXPIRED') {
        qrExpired.value = true;
        clearInterval(pollTimer);
      }
    } catch {
      // Ignorar reintentos de red silenciosamente
    }
  }, 1200);
};

const fetchQr = async () => {
  loadingQr.value = true;
  qrExpired.value = false;
  consumedSuccess.value = null;
  clearInterval(pollTimer);

  try {
    const data = await api.generatePurchaseQr();
    qrToken.value = data.qr_token;
    timeLeft.value = data.expires_in_seconds || 60;
    
    clearInterval(timer);
    timer = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;
      } else {
        qrExpired.value = true;
        clearInterval(timer);
        clearInterval(pollTimer);
      }
    }, 1000);

    // Iniciar sondeo reactivo
    startStatusPolling(data.qr_token);
  } catch (err) {
    console.error('Error al generar QR:', err);
    qrToken.value = 'ERROR-TOKEN';
  } finally {
    loadingQr.value = false;
  }
};

const openQrModal = () => {
  showQrModal.value = true;
  consumedSuccess.value = null;
  fetchQr();
};

const closeQrModal = () => {
  showQrModal.value = false;
  consumedSuccess.value = null;
  clearInterval(timer);
  clearInterval(pollTimer);
};

const copyToken = async () => {
  if (!qrToken.value) return;
  await navigator.clipboard.writeText(qrToken.value);
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 2000);
};

const handleOpenAuth = () => {
  showAuthModal.value = true;
};

onMounted(() => {
  checkAuth();
  window.addEventListener('confy-user-changed', checkAuth);
  window.addEventListener('open-auth-modal', handleOpenAuth);
  window.addEventListener('open-qr-modal', openQrModal);
});

onUnmounted(() => {
  clearInterval(timer);
  clearInterval(pollTimer);
  window.removeEventListener('confy-user-changed', checkAuth);
  window.removeEventListener('open-auth-modal', handleOpenAuth);
  window.removeEventListener('open-qr-modal', openQrModal);
});
</script>
