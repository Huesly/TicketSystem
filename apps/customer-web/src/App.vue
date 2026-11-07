<template>
  <div class="min-h-screen flex flex-col max-w-md mx-auto bg-crema shadow-xl relative pb-20">
    <!-- Header Superior -->
    <header class="bg-coffee-900 text-amber-50 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
      <div class="flex items-center gap-2">
        <span class="text-2xl">☕</span>
        <div>
          <h1 class="font-extrabold text-lg leading-tight tracking-tight">ConfyTickets</h1>
          <p class="text-xs text-amber-200/70 font-medium">Club de Fidelización</p>
        </div>
      </div>
      <button 
        @click="openQrModal"
        class="bg-caramel hover:bg-amber-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
        Mi QR
      </button>
    </header>

    <!-- Contenido de Vistas -->
    <main class="flex-1 p-5">
      <router-view />
    </main>

    <!-- Barra de Navegación Inferior -->
    <nav class="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-amber-900/10 px-6 py-2.5 flex items-center justify-around z-30 shadow-lg">
      <router-link to="/" class="flex flex-col items-center gap-1 text-xs font-semibold" :class="$route.name === 'home' ? 'text-coffee-900 font-bold' : 'text-stone-400'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Inicio
      </router-link>

      <router-link to="/mi-tarjeta" class="flex flex-col items-center gap-1 text-xs font-semibold" :class="$route.name === 'card' ? 'text-coffee-900 font-bold' : 'text-stone-400'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
        Mi Tarjeta
      </router-link>

      <router-link to="/recompensas" class="flex flex-col items-center gap-1 text-xs font-semibold" :class="$route.name === 'rewards' ? 'text-coffee-900 font-bold' : 'text-stone-400'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
        Premios
      </router-link>
    </nav>

    <!-- Modal de Código QR Dinámico (60 segundos) -->
    <div v-if="showQrModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">QR Dinámico (60s)</span>
          <button @click="showQrModal = false" class="text-stone-400 hover:text-stone-600 p-1 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <h3 class="font-extrabold text-stone-900 text-lg mb-1">Muestra este QR al pagar</h3>
        <p class="text-xs text-stone-500 mb-4">El cajero lo escaneará en la terminal POS para acreditar tus sellos.</p>

        <!-- Contenedor del Código QR Real -->
        <div class="bg-stone-50 p-4 rounded-3xl border-2 border-stone-200/80 inline-block shadow-inner mb-3 w-full relative min-h-[220px] flex items-center justify-center">
          <!-- Spinner de Carga -->
          <div v-if="loadingQr" class="text-xs text-stone-500 font-semibold animate-pulse flex flex-col items-center gap-2">
            <div class="w-8 h-8 border-3 border-caramel border-t-transparent rounded-full animate-spin"></div>
            Generando QR en servidor...
          </div>

          <!-- Overlay de Código Expirado -->
          <div v-else-if="qrExpired" class="absolute inset-0 bg-white/95 backdrop-blur-xs rounded-3xl flex flex-col items-center justify-center p-4 z-10 space-y-3">
            <span class="text-3xl">⏱️</span>
            <div>
              <p class="text-xs font-bold text-red-600">Código Expirado</p>
              <p class="text-[11px] text-stone-400">Por seguridad, cada QR dura 60 segundos</p>
            </div>
            <button @click="fetchQr" class="bg-coffee-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer shadow-sm">
              Generar Nuevo QR
            </button>
          </div>

          <!-- Componente QR Real Escaneable -->
          <div v-else class="flex flex-col items-center justify-center bg-white p-3 rounded-2xl shadow-xs border border-stone-100">
            <qrcode-vue 
              :value="qrToken" 
              :size="190" 
              level="M" 
              render-as="svg"
              class="rounded-lg"
            />
          </div>
        </div>

        <!-- Token de Texto y Copiar (útil para pruebas y contingencias) -->
        <div class="mb-3 space-y-1.5">
          <div class="flex items-center justify-between text-[11px] text-stone-400 font-medium px-1">
            <span>Token de Contingencia:</span>
            <span class="font-mono text-stone-500 font-bold">{{ qrToken.substring(0, 18) }}...</span>
          </div>
          <button 
            v-if="!qrExpired && qrToken"
            @click="copyToken"
            class="w-full text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{{ copied ? '✅ Token Copiado' : '📋 Copiar Token para Pegar en Caja' }}</span>
          </button>
        </div>

        <!-- Temporizador Regresivo (60 segundos) -->
        <div class="flex items-center justify-center gap-2 text-xs font-semibold text-stone-600 bg-stone-100/80 py-2 rounded-xl">
          <div class="w-2.5 h-2.5 rounded-full" :class="timeLeft > 15 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500 animate-ping'"></div>
          <span>Válido durante: <strong class="text-stone-900 font-mono text-sm">{{ timeLeft }}s</strong></span>
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
