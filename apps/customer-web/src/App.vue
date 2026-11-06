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
        class="bg-caramel hover:bg-amber-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition active:scale-95"
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
      <router-link to="/" class="flex flex-col items-center gap-1 text-xs font-semibold" :class="$route.name === 'home' ? 'text-coffee-900' : 'text-stone-400'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Inicio
      </router-link>

      <router-link to="/mi-tarjeta" class="flex flex-col items-center gap-1 text-xs font-semibold" :class="$route.name === 'card' ? 'text-coffee-900' : 'text-stone-400'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
        Mi Tarjeta
      </router-link>

      <router-link to="/recompensas" class="flex flex-col items-center gap-1 text-xs font-semibold" :class="$route.name === 'rewards' ? 'text-coffee-900' : 'text-stone-400'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
        Premios
      </router-link>
    </nav>

    <!-- Modal de Código QR Dinámico (60 segundos) -->
    <div v-if="showQrModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">QR de Compra</span>
          <button @click="showQrModal = false" class="text-stone-400 hover:text-stone-600 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <h3 class="font-extrabold text-stone-900 text-lg mb-1">Muestra este código al pagar</h3>
        <p class="text-xs text-stone-500 mb-5">El cajero lo escaneará para acreditar tus sellos.</p>

        <!-- Contenedor QR -->
        <div class="bg-white p-4 rounded-2xl border-2 border-stone-100 inline-block shadow-inner mb-4">
          <div class="w-48 h-48 bg-stone-50 flex items-center justify-center rounded-xl overflow-hidden relative">
            <div v-if="qrExpired" class="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center p-4">
              <p class="text-xs font-bold text-red-600 mb-2">Código Expirado</p>
              <button @click="refreshQr" class="bg-coffee-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                Generar Nuevo
              </button>
            </div>
            <!-- Simulación visual de QR en desarrollo -->
            <div class="flex flex-col items-center">
              <div class="grid grid-cols-6 gap-1 p-2">
                <div v-for="i in 36" :key="i" class="w-6 h-6 rounded-xs" :class="(i * 7) % 3 === 0 ? 'bg-coffee-900' : 'bg-transparent'"></div>
              </div>
              <span class="font-mono text-[10px] text-stone-400 mt-1">CFY-DEMO-{{ tokenSuffix }}</span>
            </div>
          </div>
        </div>

        <!-- Temporizador Regresivo (60 segundos) -->
        <div class="flex items-center justify-center gap-2 text-xs font-semibold text-stone-600">
          <div class="w-2 h-2 rounded-full" :class="timeLeft > 15 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500 animate-ping'"></div>
          <span>Expira en <strong class="text-stone-900 font-mono">{{ timeLeft }}s</strong></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';

const showQrModal = ref(false);
const timeLeft = ref(60);
const qrExpired = ref(false);
const tokenSuffix = ref('842');
let timer: any = null;

const startCountdown = () => {
  timeLeft.value = 60;
  qrExpired.value = false;
  tokenSuffix.value = Math.floor(100 + Math.random() * 900).toString();
  clearInterval(timer);
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      qrExpired.value = true;
      clearInterval(timer);
    }
  }, 1000);
};

const openQrModal = () => {
  showQrModal.value = true;
  startCountdown();
};

const refreshQr = () => {
  startCountdown();
};

onUnmounted(() => {
  clearInterval(timer);
});
</script>
