<template>
  <div class="space-y-5 fluid-container">
    <div class="space-y-0.5">
      <h2 class="fluid-title font-extrabold text-stone-900">Mi Tarjeta Digital</h2>
      <p class="text-xs text-stone-500">Tus sellos son válidos en cualquiera de nuestras sedes.</p>
    </div>

    <!-- ======================================================================= -->
    <!-- SKELETON LOADER CON SHIMMER SUAVE & DIFUMINADO (PRECARGA ELEGANTE)      -->
    <!-- ======================================================================= -->
    <div v-if="loading" class="space-y-5" aria-hidden="true">
      <!-- Skeleton Tarjeta Principal de 8 Sellos -->
      <div class="bg-coffee-900/90 rounded-2xl fluid-pad border border-stone-900/50 space-y-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div class="space-y-2">
            <div class="h-3 w-28 rounded skeleton-shimmer-dark"></div>
            <div class="h-5 w-36 rounded skeleton-shimmer-dark"></div>
          </div>
          <div class="h-8 w-16 rounded-xl skeleton-shimmer-dark"></div>
        </div>

        <!-- 8 Sellos Cuadrícula Skeleton -->
        <div class="grid grid-cols-4 gap-2.5">
          <div v-for="n in 8" :key="n" class="aspect-square rounded-xl skeleton-shimmer-dark border border-white/5"></div>
        </div>

        <div class="h-9 rounded-xl skeleton-shimmer-dark border border-white/5"></div>
      </div>

      <!-- Skeleton Código QR para Caja -->
      <div class="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl skeleton-shimmer"></div>
          <div class="space-y-2">
            <div class="h-4 w-32 rounded skeleton-shimmer"></div>
            <div class="h-3 w-48 rounded skeleton-shimmer"></div>
          </div>
        </div>

        <div class="flex flex-col items-center justify-center py-2">
          <div class="w-48 h-48 rounded-2xl skeleton-shimmer border border-stone-200"></div>
        </div>
      </div>

      <!-- Skeleton Acordeón de Información -->
      <div class="h-12 bg-white rounded-xl border border-stone-200 skeleton-shimmer"></div>
    </div>

    <!-- ======================================================================= -->
    <!-- CONTENIDO REAL CON ANIMACIÓN DIFUMINADA (FADE-ENTER-SOFT)               -->
    <!-- ======================================================================= -->
    <div v-else class="space-y-5 fade-enter-soft">
      <!-- Tarjeta Principal de Fidelidad (8 Sellos) -->
      <div class="bg-coffee-900 text-amber-50 rounded-2xl fluid-pad border border-stone-900 shadow-sm space-y-5">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-[10px] uppercase font-bold tracking-widest text-amber-300">Programa Multisede</span>
            <h3 class="font-extrabold text-base text-white">Ciclo Activo #{{ activeCard ? activeCard.cycle_number : 1 }}</h3>
          </div>
          <div class="text-right">
            <span class="text-xl font-black font-mono text-amber-300">{{ activeCard ? activeCard.stamps_count : 0 }} / {{ activeCard ? activeCard.stamps_required : 8 }}</span>
            <p class="text-[10px] text-stone-300 uppercase">Sellos</p>
          </div>
        </div>

        <!-- Cuadrícula 2x4 con aspect-square -->
        <div class="grid grid-cols-4 gap-2.5">
          <div
            v-for="i in (activeCard ? activeCard.stamps_required : 8)"
            :key="i"
            class="aspect-square rounded-xl flex flex-col items-center justify-center border transition-all duration-300"
            :class="i <= (activeCard ? activeCard.stamps_count : 0)
              ? 'bg-amber-400/20 border-amber-300 text-amber-200 scale-100 shadow-xs'
              : i === (activeCard ? activeCard.stamps_required : 8)
                ? 'bg-white/10 border-dashed border-amber-300/60 text-amber-300'
                : 'bg-black/25 border-white/15 text-stone-400'"
          >
            <!-- Google Material Icon: local_cafe -->
            <svg v-if="i <= (activeCard ? activeCard.stamps_count : 0)" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
            </svg>
            <!-- Google Material Icon: redeem -->
            <svg v-else-if="i === (activeCard ? activeCard.stamps_required : 8)" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="8" width="18" height="4" rx="1"/>
              <path d="M12 8v13"/>
              <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
            </svg>
            <span v-else class="text-xs font-bold font-mono">{{ i }}</span>

            <span class="text-[9px] font-bold mt-1" :class="i <= (activeCard ? activeCard.stamps_count : 0) ? 'text-amber-200' : 'text-stone-400'">
              {{ i === (activeCard ? activeCard.stamps_required : 8) ? 'Premio' : `Sello ${i}` }}
            </span>
          </div>
        </div>

        <div class="bg-black/30 rounded-xl p-3 flex items-center justify-between text-xs border border-white/10">
          <span class="text-stone-200">Meta: {{ activeCard ? activeCard.stamps_required : 8 }} sellos</span>
          <span class="font-bold text-amber-300">
            {{ activeCard && activeCard.stamps_remaining > 0 ? `Faltan ${activeCard.stamps_remaining} sellos` : '¡Meta alcanzada!' }}
          </span>
        </div>

        <!-- Banner de Cortesías Disponibles si el cliente tiene premios acumulados -->
        <div v-if="availableRewardsCount > 0" class="bg-amber-300 text-stone-950 rounded-xl p-3.5 flex items-center justify-between gap-2 border border-amber-400 shadow-sm">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-stone-950 text-amber-300 flex items-center justify-center shrink-0">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
              </svg>
            </div>
            <div>
              <p class="text-xs font-bold text-stone-950">¡Tienes {{ availableRewardsCount }} cortesía(s) disponible(s)!</p>
              <p class="text-[10px] text-stone-800">El barista puede canjearla al escanear tu carnet.</p>
            </div>
          </div>
          <router-link to="/recompensas" class="bg-stone-950 hover:bg-stone-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0">
            Ver Detalles →
          </router-link>
        </div>
      </div>

      <!-- ===================================================================== -->
      <!-- ALERTA DE CELEBRACIÓN EN TIEMPO REAL (REACTIVA AL POS)                -->
      <!-- ===================================================================== -->
      <div v-if="activeAlert" class="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-400 text-center space-y-2.5 animate-in fade-in zoom-in-95 duration-300 shadow-md">
        <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-2 border-emerald-300 shadow-sm animate-bounce">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
        </div>

        <div class="space-y-0.5">
          <span class="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            ¡Operación Registrada en Caja!
          </span>
          <h4 class="font-extrabold text-stone-950 text-base">
            {{ activeAlert.title }}
          </h4>
          <p class="text-xs text-stone-700 font-medium">
            {{ activeAlert.message }}
          </p>
        </div>

        <div v-if="activeAlert.receipt_reference" class="bg-white rounded-lg p-2.5 border border-emerald-200 text-xs text-stone-600 font-mono inline-block">
          Factura: <strong>{{ activeAlert.receipt_reference }}</strong>
          <span v-if="activeAlert.gross_amount"> • ${{ activeAlert.gross_amount.toLocaleString('es-CO') }} COP</span>
        </div>

        <div>
          <button
            type="button"
            @click="activeAlert = null"
            class="text-[11px] font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1 rounded-lg border border-stone-300 transition cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>

      <!-- ===================================================================== -->
      <!-- CÓDIGO QR PARA CAJA                                                   -->
      <!-- ===================================================================== -->
      <div class="bg-white rounded-2xl p-5 border border-stone-300 shadow-sm space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center shrink-0">
            <!-- SVG: QR Code -->
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/>
              <path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/>
              <path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/>
            </svg>
          </div>
          <div class="min-w-0">
            <h3 class="font-extrabold text-sm text-stone-950">Mi Código QR</h3>
            <p class="text-[11px] text-stone-500">Muestra este código al barista para sumar sellos o canjear</p>
          </div>
        </div>

        <!-- VISOR DEL CÓDIGO QR -->
        <div class="flex flex-col items-center justify-center pt-1 pb-1">
          <!-- QR Renderizado de Alto Contraste -->
          <div v-if="memberQrToken" class="p-4 bg-white rounded-2xl border-2 border-stone-900 shadow-sm relative">
            <qrcode-vue :value="memberQrToken" :size="180" level="M" render-as="svg" />
          </div>
        </div>
      </div>

      <!-- Guía de Uso del Código QR (Sin Costos ni Precios) -->
      <details class="group bg-white rounded-xl border border-stone-300 px-4 py-3 text-xs text-stone-600">
        <summary class="font-bold text-stone-900 cursor-pointer flex items-center justify-between list-none">
          <span class="inline-flex items-center gap-2">
            <!-- Google Material Icon: info -->
            <svg class="w-4 h-4 text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
            </svg>
            ¿Cómo usar tu código QR?
          </span>
          <svg class="w-4 h-4 text-stone-400 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </summary>
        <div class="mt-2 pt-2 border-t border-stone-100 leading-relaxed space-y-1.5 text-xs text-stone-600">
          <p>• <strong>Para acumular sellos:</strong> Muestra tu código QR en caja al pedir tus bebidas o productos en cualquiera de nuestras sedes.</p>
          <p>• <strong>Para reclamar premios:</strong> Al completar tu tarjeta de 8 sellos, presenta este mismo código QR al barista para recibir tu cortesía.</p>
          <p>• <strong>Código personal:</strong> Tu código QR siempre está disponible en tu aplicación para tus visitas.</p>
        </div>
      </details>

      <!-- Historial de Ciclos Pasados -->
      <div v-if="pastCycles.length > 0" class="space-y-2.5">
        <h3 class="font-bold text-xs uppercase tracking-wider text-stone-500">Ciclos Completados</h3>

        <div class="bg-white rounded-2xl p-4 border border-stone-300 divide-y divide-stone-200">
          <div v-for="item in pastCycles" :key="item.id" class="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
            <div class="space-y-0.5">
              <h5 class="font-bold text-xs text-stone-900">Ciclo #{{ item.cycle_number }}</h5>
              <p class="text-[11px] text-stone-500">Completado: {{ new Date(item.completed_at || '').toLocaleDateString('es-CO') }}</p>
            </div>
            <span class="font-bold text-xs font-mono px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 border border-stone-300">
              {{ item.stamps_count }}/{{ item.stamps_required }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import QrcodeVue from 'qrcode.vue';
import { api, type CardSummary } from '../api';

const loading = ref(true);
const activeCard = ref<CardSummary | null>(null);
const pastCycles = ref<CardSummary[]>([]);
const availableRewardsCount = ref(0);

// Identificación del socio permanente
const currentUserId = ref('00000000-0000-0000-0000-000000000001');

const memberQrToken = computed(() => {
  return `cfy_member_${currentUserId.value}`;
});

// Alertas en tiempo real
const activeAlert = ref<{
  id: string;
  type: 'PURCHASE' | 'REDEMPTION';
  title: string;
  message: string;
  receipt_reference?: string;
  gross_amount?: number;
  stamps_awarded?: number;
  store_name?: string;
  product_name?: string;
  created_at: string;
} | null>(null);

let lastHandledAlertId = '';
let livePollingInterval: any = null;

// Audio Chime de Celebración Web Audio
const playCelebrationChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + idx * 0.1 + 0.36);
    });
  } catch (e) {
    console.debug('AudioContext no disponible:', e);
  }
};

const triggerHaptic = () => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate([80, 40, 120]);
  }
};

const pollLiveStatus = async () => {
  try {
    const res = await api.getLiveStatus();
    
    // Si la tarjeta cambió
    if (res.card) {
      if (!activeCard.value || activeCard.value.stamps_count !== res.card.stamps_count) {
        if (activeCard.value) {
          activeCard.value.stamps_count = res.card.stamps_count;
          activeCard.value.stamps_remaining = res.card.stamps_remaining;
          activeCard.value.progress_percentage = res.card.progress_percentage;
        }
      }
    }
    availableRewardsCount.value = res.available_rewards_count;

    // Verificar si hay alerta reciente no procesada
    if (res.recent_alert && res.recent_alert.id !== lastHandledAlertId) {
      lastHandledAlertId = res.recent_alert.id;
      activeAlert.value = res.recent_alert;
      playCelebrationChime();
      triggerHaptic();

      // Recargar histórico de tarjetas completo
      loadCards();
    }
  } catch {
    // Silencioso para polling
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const loadInitialData = async () => {
  try {
    loading.value = true;
    // Precarga con tiempo mínimo de 850ms para garantizar una transición suave y difuminada
    const minDelay = delay(850);
    const [userMe] = await Promise.all([
      api.getAuthMe().catch(() => null),
      loadCards().catch(() => null),
      minDelay
    ]);
    if (userMe && userMe.user) {
      currentUserId.value = userMe.user.id;
    }
    await pollLiveStatus();
  } catch (err) {
    console.error('Error cargando carnet de socio:', err);
  } finally {
    loading.value = false;
  }
};

const loadCards = async () => {
  try {
    const res = await api.getLoyaltyCards();
    activeCard.value = res.active_card;
    pastCycles.value = res.past_cycles;
  } catch (err) {
    console.error('Error cargando tarjetas:', err);
  }
};

onMounted(() => {
  loadInitialData();
  // Polling cada 1.5s para detectar transacciones de caja en vivo
  livePollingInterval = setInterval(pollLiveStatus, 1500);

  window.addEventListener('confy-user-changed', () => {
    loadInitialData();
  });
});

onUnmounted(() => {
  if (livePollingInterval) clearInterval(livePollingInterval);
  window.removeEventListener('confy-user-changed', loadInitialData);
});
</script>
