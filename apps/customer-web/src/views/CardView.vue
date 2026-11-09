<template>
  <div class="space-y-5 fluid-container">
    <div class="space-y-0.5">
      <h2 class="fluid-title font-extrabold text-stone-900">Mi Tarjeta Digital</h2>
      <p class="text-xs text-stone-500">Tus sellos son válidos en cualquiera de nuestras sedes.</p>
    </div>

    <div v-if="loading" class="p-8 text-center text-xs text-stone-400 font-semibold">
      Cargando tarjeta digital...
    </div>

    <template v-else>
      <!-- Tarjeta Principal Minimalista (8 Sellos) -->
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
            class="aspect-square rounded-xl flex flex-col items-center justify-center border"
            :class="i <= (activeCard ? activeCard.stamps_count : 0)
              ? 'bg-amber-400/20 border-amber-300 text-amber-200'
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

        <!-- Banner de Premio Listo si la tarjeta está completada -->
        <div v-if="activeCard && activeCard.stamps_remaining === 0" class="bg-amber-300 text-stone-950 rounded-xl p-3.5 flex items-center justify-between gap-2 border border-amber-400 shadow-sm">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-stone-950 text-amber-300 flex items-center justify-center shrink-0">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
              </svg>
            </div>
            <div>
              <p class="text-xs font-bold text-stone-950">¡Tarjeta completada!</p>
              <p class="text-[10px] text-stone-700">Tu cortesía está lista para ser canjeada.</p>
            </div>
          </div>
          <router-link to="/recompensas" class="bg-stone-950 hover:bg-stone-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0">
            Reclamar →
          </router-link>
        </div>
      </div>

      <!-- ===================================================================== -->
      <!-- GENERACIÓN DEL CÓDIGO QR DIRECTO EN LA VISTA DE TARJETA               -->
      <!-- ===================================================================== -->
      <div class="bg-white rounded-2xl p-5 border border-stone-300 shadow-sm space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center shrink-0">
              <!-- SVG: QR Code -->
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/>
                <path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/>
                <path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/>
              </svg>
            </div>
            <div>
              <h3 class="font-extrabold text-sm text-stone-950">Mi Código QR para Caja</h3>
              <p class="text-[11px] text-stone-500">Muestra este código al pagar para sumar sellos</p>
            </div>
          </div>

          <!-- Botón Generar Otro QR -->
          <button
            type="button"
            @click="fetchQr"
            :disabled="loadingQr"
            title="Generar otro código"
            class="text-[11px] font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer active:scale-95"
          >
            <svg class="w-3.5 h-3.5 text-stone-600" :class="{ 'animate-spin': loadingQr }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/>
            </svg>
            <span>Nuevo QR</span>
          </button>
        </div>

        <!-- ESTADO 1: CELEBRACIÓN DE OPERACIÓN CONFIRMADA -->
        <div v-if="consumedSuccess" class="p-4 bg-emerald-50 rounded-xl border border-emerald-300 text-center space-y-2.5 animate-in fade-in zoom-in-95 duration-300">
          <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-2 border-emerald-300 shadow-sm animate-bounce">
            <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          </div>

          <div class="space-y-0.5">
            <span class="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-2 py-0.5 rounded-full">
              ¡Operación Confirmada en Caja!
            </span>
            <h4 class="font-extrabold text-stone-950 text-base">
              +{{ consumedSuccess.stamps_awarded }} {{ consumedSuccess.stamps_awarded === 1 ? 'Sello Sumado' : 'Sellos Sumados' }}
            </h4>
            <p class="text-xs text-stone-600 font-medium">
              Registrado en <strong>{{ consumedSuccess.store_name }}</strong>
            </p>
          </div>

          <div class="bg-white rounded-lg p-2.5 border border-emerald-200 text-xs text-stone-600 font-mono">
            <div>Factura: <strong>{{ consumedSuccess.receipt_reference }}</strong></div>
            <div v-if="consumedSuccess.gross_amount">Valor: ${{ consumedSuccess.gross_amount.toLocaleString('es-CO') }} COP</div>
          </div>

          <button
            type="button"
            @click="fetchQr"
            class="mt-1 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer active:scale-95"
          >
            Generar siguiente QR
          </button>
        </div>

        <!-- ESTADO 2: VISOR DEL CÓDIGO QR ACTIVO -->
        <div v-else class="flex flex-col items-center justify-center space-y-3 pt-1">
          <div v-if="loadingQr" class="aspect-square w-52 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col items-center justify-center text-xs text-stone-400 gap-2">
            <div class="w-6 h-6 border-2 border-stone-900 border-t-transparent rounded-full animate-spin"></div>
            <span>Generando código QR seguro...</span>
          </div>

          <div v-else-if="qrExpired" class="aspect-square w-52 rounded-2xl bg-red-50 border border-red-200 flex flex-col items-center justify-center text-center p-4 gap-2">
            <div class="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <span class="text-xs font-bold text-red-700">El código expiró por seguridad</span>
            <button
              type="button"
              @click="fetchQr"
              class="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer active:scale-95"
            >
              Generar nuevo código
            </button>
          </div>

          <template v-else-if="qrToken">
            <!-- QR Renderizado con Marco de Alto Contraste -->
            <div class="p-3.5 bg-white rounded-2xl border-2 border-stone-900 shadow-sm relative">
              <qrcode-vue :value="qrToken" :size="180" level="M" render-as="svg" />
            </div>

            <!-- Estado de Espera en Vivo y Temporizador -->
            <div class="flex items-center gap-2 text-xs font-medium text-stone-600">
              <span class="w-2 h-2 rounded-full" :class="timeLeft > 15 ? 'bg-emerald-600 animate-pulse' : 'bg-red-600 animate-ping'"></span>
              <span>Esperando escaneo en caja • Expira en <strong class="font-mono text-stone-950">{{ timeLeft }}s</strong></span>
            </div>

            <!-- Botón de Copiar Token Manual (Para Pruebas) -->
            <button
              type="button"
              @click="copyToken"
              class="text-[11px] font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path v-if="copied" d="M20 6 9 17l-5-5"/>
                <template v-else>
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </template>
              </svg>
              <span>{{ copied ? '¡Token copiado al portapapeles!' : 'Copiar token para prueba manual' }}</span>
            </button>
          </template>

          <div v-else class="py-4 text-center">
            <button
              type="button"
              @click="fetchQr"
              class="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs py-3 px-5 rounded-xl border border-stone-900 transition active:scale-95 shadow-sm"
            >
              Generar Mi QR de Compra
            </button>
          </div>
        </div>
      </div>

      <!-- Regla de Acumulación con <details> nativo para reducir ruido -->
      <details class="group bg-white rounded-xl border border-stone-300 px-4 py-3 text-xs text-stone-600">
        <summary class="font-bold text-stone-900 cursor-pointer flex items-center justify-between list-none">
          <span class="inline-flex items-center gap-2">
            <!-- Google Material Icon: info -->
            <svg class="w-4 h-4 text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
            </svg>
            ¿Cómo acumulas sellos?
          </span>
          <svg class="w-4 h-4 text-stone-400 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </summary>
        <p class="mt-2 pt-2 border-t border-stone-100 leading-relaxed">
          Ganas <strong>1 sello</strong> por cada <strong>$10.000 COP</strong> en tus consumos (máximo 3 sellos por compra). Los sellos sobrantes que superen la meta pasan automáticamente a tu siguiente tarjeta.
        </p>
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
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import QrcodeVue from 'qrcode.vue';
import { api, type CardSummary } from '../api';

const loading = ref(true);
const activeCard = ref<CardSummary | null>(null);
const pastCycles = ref<CardSummary[]>([]);

// Estado del QR de Compra
const qrToken = ref('');
const loadingQr = ref(false);
const qrExpired = ref(false);
const timeLeft = ref(60);
const copied = ref(false);
const consumedSuccess = ref<{ store_name: string; receipt_reference: string; stamps_awarded: number; gross_amount: number } | null>(null);

let countdownInterval: any = null;
let pollingInterval: any = null;

// Audio Chime de Celebración
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

const fetchQr = async () => {
  loadingQr.value = true;
  qrExpired.value = false;
  consumedSuccess.value = null;
  copied.value = false;
  clearInterval(countdownInterval);
  clearInterval(pollingInterval);

  try {
    const res = await api.generatePurchaseQr();
    qrToken.value = res.qr_token;
    timeLeft.value = res.expires_in_seconds || 60;

    countdownInterval = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;
      } else {
        qrExpired.value = true;
        clearInterval(countdownInterval);
        clearInterval(pollingInterval);
      }
    }, 1000);

    startPolling(res.qr_token);
  } catch (err) {
    console.error('Error generando QR de compra:', err);
  } finally {
    loadingQr.value = false;
  }
};

const startPolling = (token: string) => {
  pollingInterval = setInterval(async () => {
    if (!token || qrExpired.value || consumedSuccess.value) {
      clearInterval(pollingInterval);
      return;
    }
    try {
      const statusRes = await api.checkQrStatus(token);
      if (statusRes.status === 'CONSUMED') {
        clearInterval(pollingInterval);
        clearInterval(countdownInterval);
        consumedSuccess.value = statusRes.purchase || {
          store_name: 'Sede Principal',
          receipt_reference: 'Comprobante',
          stamps_awarded: 1,
          gross_amount: 0
        };
        playCelebrationChime();
        triggerHaptic();
        // Recargar tarjeta inmediatamente
        loadCards();
      } else if (statusRes.status === 'EXPIRED') {
        clearInterval(pollingInterval);
        clearInterval(countdownInterval);
        qrExpired.value = true;
      }
    } catch {
      // Silencioso para polling
    }
  }, 1200);
};

const copyToken = () => {
  if (!qrToken.value) return;
  navigator.clipboard.writeText(qrToken.value);
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 2500);
};

const loadCards = async () => {
  try {
    loading.value = true;
    const res = await api.getLoyaltyCards();
    activeCard.value = res.active_card;
    pastCycles.value = res.past_cycles;
  } catch (err) {
    console.error('Error cargando tarjetas:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadCards();
  fetchQr(); // Generar QR automáticamente al entrar a la tarjeta
  window.addEventListener('confy-user-changed', () => {
    loadCards();
    fetchQr();
  });
});

onUnmounted(() => {
  clearInterval(countdownInterval);
  clearInterval(pollingInterval);
  window.removeEventListener('confy-user-changed', loadCards);
});
</script>
