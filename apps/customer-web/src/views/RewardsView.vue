<template>
  <div class="space-y-5 fluid-container">
    <div class="space-y-0.5">
      <h2 class="fluid-title font-extrabold text-stone-900">Mis Recompensas</h2>
      <p class="text-xs text-stone-500">Premios obtenidos al completar tus tarjetas de 8 sellos.</p>
    </div>

    <div v-if="loading" class="p-8 text-center text-xs text-stone-400 font-semibold">
      Cargando recompensas...
    </div>

    <template v-else>
      <!-- Lista de Recompensas Disponibles -->
      <div class="space-y-2.5">
        <h3 class="font-bold text-xs uppercase tracking-wider text-stone-500">Listas para Canjear</h3>

        <div v-if="availableRewards.length === 0" class="p-6 bg-white rounded-2xl border border-stone-300 text-center space-y-2">
          <div class="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto text-stone-500">
            <!-- Google Material Icon: local_cafe -->
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
            </svg>
          </div>
          <p class="text-xs font-bold text-stone-800">No tienes recompensas pendientes</p>
          <p class="text-[11px] text-stone-500">Acumula 8 sellos en tu tarjeta digital para desbloquear tu próxima bebida de cortesía.</p>
        </div>

        <div
          v-for="reward in availableRewards"
          :key="reward.id"
          class="bg-white rounded-2xl fluid-pad border border-stone-300 shadow-sm space-y-4"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-1">
              <span class="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Disponible
              </span>
              <h4 class="font-extrabold text-sm text-stone-900">{{ reward.name }}</h4>
              <p class="text-xs text-stone-500 leading-snug">{{ reward.description }}</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 shrink-0">
              <!-- Google Material Icon: redeem -->
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="8" width="18" height="4" rx="1"/>
                <path d="M12 8v13"/>
                <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
              </svg>
            </div>
          </div>

          <div class="flex items-center justify-between pt-3 border-t border-stone-200 text-xs">
            <span class="text-stone-500">Vence: <strong class="text-stone-800">{{ new Date(reward.expires_at).toLocaleDateString('es-CO') }}</strong></span>
            <button
              @click="openRedemptionQr(reward)"
              class="bg-coffee-900 hover:bg-stone-800 text-white font-bold px-3.5 py-2 rounded-lg text-xs transition cursor-pointer inline-flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <path d="M14 14h3v3h-3z"/>
              </svg>
              Redimir en Caja
            </button>
          </div>
        </div>
      </div>

      <!-- Historial de Premios Canjeados -->
      <div v-if="redeemedRewards.length > 0" class="space-y-2.5">
        <h3 class="font-bold text-xs uppercase tracking-wider text-stone-500">Canjeadas Anteriormente</h3>

        <div class="bg-white rounded-2xl p-4 border border-stone-300 divide-y divide-stone-200">
          <div v-for="item in redeemedRewards" :key="item.id" class="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
            <div class="space-y-0.5">
              <h5 class="font-bold text-xs text-stone-900">{{ item.name }}</h5>
              <p class="text-[11px] text-stone-500">Emitida: {{ new Date(item.issued_at).toLocaleDateString('es-CO') }}</p>
            </div>
            <span class="text-[10px] font-bold text-stone-600 uppercase bg-stone-100 border border-stone-200 px-2 py-0.5 rounded">
              Canjeado
            </span>
          </div>
        </div>
      </div>
    </template>

    <!-- Modal QR de Redención -->
    <div v-if="selectedReward" class="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl border border-stone-300 p-5 w-full max-w-xs text-center shadow-xl space-y-4">
        
        <!-- ESTADO: REDENCIÓN CONFIRMADA EN CAJA -->
        <div v-if="redeemedSuccess" class="py-4 space-y-3 animate-in fade-in zoom-in-95 duration-300">
          <div class="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-2 border-emerald-300 shadow-sm animate-bounce">
            <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          </div>
          <div class="space-y-1">
            <span class="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              ¡Premio Redimido!
            </span>
            <h3 class="font-extrabold text-stone-950 text-base leading-tight">
              {{ selectedReward.name }}
            </h3>
            <p class="text-xs text-stone-600 font-medium">
              ¡Que disfrutes tu café de cortesía!
            </p>
          </div>
        </div>

        <!-- ESTADO: QR ACTIVO -->
        <template v-else>
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
              QR de Redención
            </span>
            <button @click="closeRedemptionModal" class="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer" aria-label="Cerrar">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>

          <div class="space-y-0.5">
            <h3 class="font-extrabold text-stone-900 text-sm">{{ selectedReward.name }}</h3>
            <p class="text-xs text-stone-500">Presenta este código al cajero para recibir tu cortesía.</p>
          </div>

          <!-- Contenedor QR con aspect-square para evitar CLS -->
          <div class="bg-stone-50 p-4 rounded-xl border border-stone-200 aspect-square w-full max-w-[210px] mx-auto flex items-center justify-center">
            <div v-if="!redemptionToken" class="text-xs text-stone-400 flex flex-col items-center gap-2">
              <div class="w-6 h-6 border-2 border-stone-800 border-t-transparent rounded-full animate-spin"></div>
              Generando QR...
            </div>
            <div v-else class="bg-white p-2.5 rounded-lg border border-stone-200">
              <qrcode-vue
                :value="redemptionToken"
                :size="165"
                level="M"
                render-as="svg"
              />
            </div>
          </div>

          <button
            v-if="redemptionToken"
            @click="copyRedeemToken"
            class="w-full text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 py-2 px-3 rounded-lg border border-stone-300 transition cursor-pointer inline-flex items-center justify-center gap-1.5"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
            </svg>
            {{ copied ? 'Token copiado' : 'Copiar token para prueba' }}
          </button>

          <p class="text-[11px] text-stone-500">
            Código de un solo uso válido por 60 segundos.
          </p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import QrcodeVue from 'qrcode.vue';
import { api, type CustomerReward } from '../api';

const loading = ref(true);
const rewards = ref<CustomerReward[]>([]);
const selectedReward = ref<CustomerReward | null>(null);
const redemptionToken = ref('');
const copied = ref(false);
const redeemedSuccess = ref(false);

let redeemPollTimer: any = null;

const playRedeemChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      const audioCtx = new AudioContextClass();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.35);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  } catch {}
};

const availableRewards = computed(() => {
  return rewards.value.filter(r => r.status === 'AVAILABLE');
});

const redeemedRewards = computed(() => {
  return rewards.value.filter(r => r.status === 'REDEEMED');
});

const loadRewards = async () => {
  try {
    loading.value = true;
    rewards.value = await api.getRewards();
  } catch (err) {
    console.error('Error cargando recompensas:', err);
  } finally {
    loading.value = false;
  }
};

const startRedeemPolling = (token: string) => {
  clearInterval(redeemPollTimer);
  redeemPollTimer = setInterval(async () => {
    if (!selectedReward.value || !token) {
      clearInterval(redeemPollTimer);
      return;
    }
    try {
      const res = await api.checkQrStatus(token);
      if (res.status === 'CONSUMED') {
        clearInterval(redeemPollTimer);
        playRedeemChime();
        redeemedSuccess.value = true;
        await loadRewards();
        window.dispatchEvent(new CustomEvent('confy-user-changed'));

        setTimeout(() => {
          closeRedemptionModal();
        }, 2800);
      }
    } catch {
      // Ignore
    }
  }, 1200);
};

const openRedemptionQr = async (reward: CustomerReward) => {
  selectedReward.value = reward;
  redemptionToken.value = '';
  redeemedSuccess.value = false;
  clearInterval(redeemPollTimer);

  try {
    const res = await api.generateRewardQr(reward.id);
    redemptionToken.value = res.qr_token;
    startRedeemPolling(res.qr_token);
  } catch (err: any) {
    alert(err.message || 'Error al generar QR');
    selectedReward.value = null;
  }
};

const closeRedemptionModal = () => {
  selectedReward.value = null;
  redemptionToken.value = '';
  redeemedSuccess.value = false;
  clearInterval(redeemPollTimer);
};

const copyRedeemToken = async () => {
  if (!redemptionToken.value) return;
  await navigator.clipboard.writeText(redemptionToken.value);
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 2000);
};

onMounted(() => {
  loadRewards();
  window.addEventListener('confy-user-changed', loadRewards);
});

onUnmounted(() => {
  clearInterval(redeemPollTimer);
  window.removeEventListener('confy-user-changed', loadRewards);
});
</script>
