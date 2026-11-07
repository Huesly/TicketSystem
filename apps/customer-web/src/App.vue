<template>
  <div class="min-h-dvh-safe flex flex-col max-w-md mx-auto bg-stone-50 border-x border-stone-200 relative pb-20 text-stone-900">
    <!-- Barra Superior Compacta (< 12% viewport height) -->
    <header class="bg-white/95 backdrop-blur-md text-stone-900 px-5 h-14 flex items-center justify-between sticky top-0 z-30 border-b border-stone-200">
      <div class="flex items-center gap-2.5">
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
          <span class="font-extrabold text-sm leading-tight tracking-tight block text-stone-950">ConfyTickets</span>
          <span class="text-[10px] text-stone-500 font-medium block">Programa de Fidelidad</span>
        </div>
      </div>

      <button 
        type="button"
        @click="openQrModal"
        class="bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 border border-stone-900 transition active:scale-95 cursor-pointer"
      >
        <!-- SVG: QR Code -->
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/>
          <path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/>
        </svg>
        <span>Mi QR</span>
      </button>
    </header>

    <!-- Contenido Principal Líquido -->
    <main class="flex-1 p-5 fluid-container">
      <router-view />
    </main>

    <!-- Barra de Navegación Inferior Compacta -->
    <nav class="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-stone-200 px-6 h-14 flex items-center justify-around z-30" aria-label="Navegación inferior">
      <router-link 
        to="/" 
        class="flex flex-col items-center gap-1 text-[11px] font-semibold transition" 
        :class="$route.name === 'home' ? 'text-stone-950' : 'text-stone-400 hover:text-stone-600'"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span>Inicio</span>
      </router-link>

      <router-link 
        to="/mi-tarjeta" 
        class="flex flex-col items-center gap-1 text-[11px] font-semibold transition" 
        :class="$route.name === 'card' ? 'text-stone-950' : 'text-stone-400 hover:text-stone-600'"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
        </svg>
        <span>Tarjeta</span>
      </router-link>

      <router-link 
        to="/recompensas" 
        class="flex flex-col items-center gap-1 text-[11px] font-semibold transition" 
        :class="$route.name === 'rewards' ? 'text-stone-950' : 'text-stone-400 hover:text-stone-600'"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
          <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>
        </svg>
        <span>Premios</span>
      </router-link>
    </nav>

    <!-- Modal de Código QR Minimalista -->
    <div v-if="showQrModal" class="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="qr-dialog-title">
      <div class="bg-white rounded-2xl border border-stone-300 p-6 w-full max-w-sm text-center shadow-xl space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-mono font-semibold uppercase tracking-wider text-stone-700 bg-stone-100 border border-stone-300 px-2.5 py-0.5 rounded-md">
            Token Efímero 60s
          </span>
          <button 
            type="button"
            @click="showQrModal = false" 
            class="text-stone-400 hover:text-stone-700 p-1 rounded-lg transition cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        <div class="space-y-1">
          <h3 id="qr-dialog-title" class="font-extrabold text-stone-950 text-base">Código de Identificación</h3>
          <p class="text-xs text-stone-500">Presenta este código en caja para acreditar tus sellos.</p>
        </div>

        <!-- Contenedor QR con Aspect Ratio fijo (Previene CLS) -->
        <div class="bg-stone-50 p-5 rounded-2xl border border-stone-200 aspect-square max-w-[230px] mx-auto flex items-center justify-center relative">
          <div v-if="loadingQr" class="text-xs text-stone-500 font-medium flex flex-col items-center gap-2">
            <div class="w-6 h-6 border-2 border-stone-900 border-t-transparent rounded-full animate-spin"></div>
            <span>Generando código...</span>
          </div>

          <div v-else-if="qrExpired" class="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center p-4 z-10 space-y-3">
            <svg class="w-7 h-7 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <div>
              <p class="text-xs font-bold text-stone-900">Código expirado</p>
              <p class="text-[11px] text-stone-500">La vigencia de 60 segundos finalizó</p>
            </div>
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import QrcodeVue from 'qrcode.vue';
import { api } from './api';

const showQrModal = ref(false);
const qrToken = ref('');
const timeLeft = ref(60);
const qrExpired = ref(false);
const loadingQr = ref(false);
const copied = ref(false);
let timer: any = null;

const fetchQr = async () => {
  loadingQr.value = true;
  qrExpired.value = false;
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
      }
    }, 1000);
  } catch (err) {
    console.error('Error al generar QR:', err);
    qrToken.value = 'ERROR-TOKEN';
  } finally {
    loadingQr.value = false;
  }
};

const openQrModal = () => {
  showQrModal.value = true;
  fetchQr();
};

const copyToken = async () => {
  if (!qrToken.value) return;
  await navigator.clipboard.writeText(qrToken.value);
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 2000);
};

onUnmounted(() => {
  clearInterval(timer);
});
</script>
