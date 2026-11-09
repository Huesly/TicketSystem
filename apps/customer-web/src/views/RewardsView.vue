<template>
  <div class="space-y-5 fluid-container">
    <div class="space-y-0.5">
      <h2 class="fluid-title font-extrabold text-stone-900">Mis Recompensas</h2>
      <p class="text-xs text-stone-500">Premios obtenidos al completar tus tarjetas de 8 sellos.</p>
    </div>

    <!-- SKELETON LOADER SUAVE CON SHIMMER & DIFUMINADO -->
    <div v-if="loading" class="space-y-4" aria-hidden="true">
      <div class="space-y-2.5">
        <div class="h-3.5 w-32 rounded skeleton-shimmer"></div>
        <div v-for="n in 2" :key="n" class="bg-white rounded-2xl fluid-pad border border-stone-200 shadow-sm space-y-4">
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-2 flex-1">
              <div class="h-3 w-20 rounded skeleton-shimmer"></div>
              <div class="h-4 w-44 rounded skeleton-shimmer"></div>
              <div class="h-3 w-56 rounded skeleton-shimmer"></div>
            </div>
            <div class="w-10 h-10 rounded-xl skeleton-shimmer shrink-0"></div>
          </div>
          <div class="flex items-center justify-between pt-3 border-t border-stone-100">
            <div class="h-3 w-24 rounded skeleton-shimmer"></div>
            <div class="h-8 w-28 rounded-lg skeleton-shimmer"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="space-y-5 fade-enter-soft">
      <!-- Lista de Recompensas Disponibles -->
      <div class="space-y-2.5">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-xs uppercase tracking-wider text-stone-500">Listas para Canjear</h3>
          <span v-if="availableRewards.length > 0" class="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            {{ availableRewards.length }} disponible{{ availableRewards.length > 1 ? 's' : '' }}
          </span>
        </div>

        <div v-if="availableRewards.length === 0" class="p-6 bg-white rounded-2xl border border-stone-300 text-center space-y-2">
          <div class="w-11 h-11 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto text-stone-500">
            <!-- Google Material Icon: local_cafe -->
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
            </svg>
          </div>
          <p class="text-xs font-bold text-stone-800">No tienes recompensas pendientes</p>
          <p class="text-[11px] text-stone-500 max-w-xs mx-auto">Acumula 8 sellos en tu tarjeta digital para desbloquear tu próxima bebida de especialidad.</p>
        </div>

        <div
          v-for="reward in availableRewards"
          :key="reward.id"
          class="bg-white rounded-2xl fluid-pad border border-stone-300 shadow-sm space-y-4 hover:border-stone-400 transition-colors"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-1">
              <span class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                Disponible en caja
              </span>
              <h4 class="font-extrabold text-sm text-stone-900">{{ reward.name }}</h4>
              <p class="text-xs text-stone-500 leading-snug">{{ reward.description }}</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
              <!-- Google Material Icon: redeem -->
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="8" width="18" height="4" rx="1"/>
                <path d="M12 8v13"/>
                <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
              </svg>
            </div>
          </div>

          <div class="flex items-center justify-between pt-3 border-t border-stone-200 text-xs">
            <span class="text-stone-500">Válido hasta: <strong class="text-stone-800">{{ new Date(reward.expires_at).toLocaleDateString('es-CO') }}</strong></span>
            <button
              @click="openRedemptionQr(reward)"
              class="bg-stone-900 hover:bg-stone-800 text-white font-bold px-3.5 py-2 rounded-lg text-xs transition cursor-pointer inline-flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <svg class="w-3.5 h-3.5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <path d="M14 14h3v3h-3z"/>
              </svg>
              <span>Mostrar en Caja</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Guía Rápida de Canje Tipo Starbucks -->
      <div class="bg-amber-50/80 rounded-2xl p-4 border border-amber-200 space-y-2">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center shrink-0 font-bold text-xs">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
            </svg>
          </div>
          <h4 class="font-bold text-xs text-stone-900">¿Cómo reclamar tu recompensa?</h4>
        </div>
        <p class="text-[11px] text-stone-700 leading-relaxed">
          Solo presenta tu código QR de socio en caja. El barista verá de inmediato tus recompensas disponibles y podrás acordar tu café o cortesía preferida.
        </p>
      </div>

      <!-- Historial de Premios Canjeados -->
      <div v-if="redeemedRewards.length > 0" class="space-y-2.5">
        <h3 class="font-bold text-xs uppercase tracking-wider text-stone-500">Canjeadas Anteriormente</h3>

        <div class="bg-white rounded-2xl p-4 border border-stone-300 divide-y divide-stone-200">
          <div v-for="item in redeemedRewards" :key="item.id" class="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
            <div class="space-y-0.5">
              <h5 class="font-bold text-xs text-stone-900">{{ item.name }}</h5>
              <p class="text-[11px] text-stone-500">Canjeada el {{ new Date(item.issued_at).toLocaleDateString('es-CO') }}</p>
            </div>
            <span class="text-[10px] font-bold text-stone-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded">
              Canjeado
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal QR de Socio / Redención -->
    <div v-if="selectedReward" class="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl border border-stone-300 p-5 w-full max-w-xs text-center shadow-2xl space-y-4">
        
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
              Canjear en Caja
            </span>
            <button @click="closeRedemptionModal" class="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer transition" aria-label="Cerrar">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>

          <div class="space-y-0.5">
            <h3 class="font-extrabold text-stone-900 text-sm">{{ selectedReward.name }}</h3>
            <p class="text-xs text-stone-500">Presenta este código al cajero para validar tu recompensa.</p>
          </div>

          <!-- Contenedor QR con aspect-square para evitar CLS -->
          <div class="bg-stone-50 p-4 rounded-xl border border-stone-200 aspect-square w-full max-w-[210px] mx-auto flex items-center justify-center">
            <div v-if="!effectiveQrValue" class="text-xs text-stone-400 flex flex-col items-center gap-2">
              <div class="w-6 h-6 border-2 border-stone-800 border-t-transparent rounded-full animate-spin"></div>
              Generando código...
            </div>
            <div v-else class="bg-white p-2.5 rounded-lg border border-stone-200 shadow-xs">
              <qrcode-vue
                :value="effectiveQrValue"
                :size="165"
                level="M"
                render-as="svg"
              />
            </div>
          </div>

          <div class="space-y-2">
            <button
              @click="goToCard"
              class="w-full text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white py-2.5 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Ver mi Tarjeta Digital Completa</span>
            </button>
            <p class="text-[11px] text-stone-500">
              Tu código de socio es personal y sirve tanto para sellos como para premios.
            </p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import QrcodeVue from 'qrcode.vue';
import { api, type CustomerReward } from '../api';

const router = useRouter();
const loading = ref(true);
const rewards = ref<CustomerReward[]>([]);
const selectedReward = ref<CustomerReward | null>(null);
const memberId = ref('');
const redemptionToken = ref('');
const redeemedSuccess = ref(false);

let redeemPollTimer: any = null;

const effectiveQrValue = computed(() => {
  return redemptionToken.value || memberId.value || '';
});

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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const loadRewards = async () => {
  try {
    loading.value = true;
    const minDelay = delay(850);
    const [res, profileRes] = await Promise.all([
      api.getRewards().catch(() => []),
      api.getProfile().catch(() => null),
      minDelay
    ]);
    rewards.value = res;
    if (profileRes && profileRes.id) {
      memberId.value = profileRes.id;
    }
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
  } catch {
    // Si falla la generación del token de un solo uso, usamos el ID de socio permanente como fallback
    redemptionToken.value = memberId.value;
  }
};

const closeRedemptionModal = () => {
  selectedReward.value = null;
  redemptionToken.value = '';
  redeemedSuccess.value = false;
  clearInterval(redeemPollTimer);
};

const goToCard = () => {
  closeRedemptionModal();
  router.push('/mi-tarjeta');
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