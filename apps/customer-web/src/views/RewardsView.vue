<template>
  <div class="space-y-5 fluid-container">
    <div class="space-y-0.5">
      <h2 class="fluid-title font-extrabold text-stone-900">Mis Recompensas</h2>
      <p class="text-xs text-stone-500">Premios obtenidos al completar tus tarjetas de 8 sellos.</p>
    </div>

    <!-- BANNER DE CELEBRACIÓN DE CANJE EN TIEMPO REAL (REACTIVO A CAJA) -->
    <div v-if="activeRedemptionAlert" class="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-400 text-center space-y-2 animate-in fade-in zoom-in-95 duration-300 shadow-md">
      <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-2 border-emerald-300 shadow-sm animate-bounce">
        <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 6 9 17l-5-5"/>
        </svg>
      </div>

      <div class="space-y-0.5">
        <span class="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full">
          ¡Cortesía Entregada con Éxito!
        </span>
        <h4 class="font-extrabold text-stone-950 text-base">
          {{ activeRedemptionAlert.title }}
        </h4>
        <p class="text-xs text-stone-700 font-medium">
          {{ activeRedemptionAlert.message }} {{ activeRedemptionAlert.store_name ? '• ' + activeRedemptionAlert.store_name : '' }}
        </p>
        <p class="text-[11px] text-stone-500 pt-1">
          Tu beneficio ha sido marcado como utilizado y ya no está disponible para nuevos canjes.
        </p>
      </div>

      <div>
        <button
          type="button"
          @click="activeRedemptionAlert = null"
          class="text-[11px] font-bold text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-white px-3 py-1 rounded-lg border border-stone-300 transition cursor-pointer"
        >
          Entendido
        </button>
      </div>
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
          class="bg-white rounded-2xl fluid-pad border border-stone-300 shadow-sm space-y-3.5 hover:border-stone-400 transition-colors"
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

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 border-t border-stone-200 text-xs">
            <div class="space-y-0.5">
              <span class="text-stone-500 block">Válido hasta: <strong class="text-stone-800">{{ new Date(reward.expires_at).toLocaleDateString('es-CO') }}</strong></span>
              <p class="text-[11px] text-stone-500">Presenta tu carnet QR permanente en caja al ordenar.</p>
            </div>
            <router-link
              to="/mi-tarjeta"
              class="bg-stone-900 hover:bg-stone-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-sm active:scale-95 shrink-0"
            >
              <!-- Google Material Icon: qr_code_2 -->
              <svg class="w-3.5 h-3.5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/>
                <path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/>
                <path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/>
              </svg>
              <span>Ver mi Carnet QR</span>
            </router-link>
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
          Solo presenta tu <strong>código QR permanente de socio</strong> en caja. El barista verá de inmediato tus recompensas disponibles y podrás acordar tu café o cortesía preferida sin códigos temporales.
        </p>
      </div>

      <!-- Historial de Premios Canjeados -->
      <div v-if="redeemedRewards.length > 0" class="space-y-2.5">
        <h3 class="font-bold text-xs uppercase tracking-wider text-stone-500">Canjeadas Anteriormente</h3>

        <div class="bg-white rounded-2xl p-4 border border-stone-300 divide-y divide-stone-200">
          <div v-for="item in redeemedRewards" :key="item.id" class="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <h5 class="font-bold text-xs text-stone-800">{{ item.name }}</h5>
                <span class="text-[10px] font-bold text-stone-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded">
                  Ya utilizado
                </span>
              </div>
              <p v-if="item.selected_product" class="text-xs text-stone-700 font-medium">
                Producto entregado: <strong>{{ item.selected_product }}</strong>
              </p>
              <p class="text-[11px] text-stone-500">
                Canjeada el {{ new Date(item.redeemed_at || item.issued_at).toLocaleDateString('es-CO') }} • No disponible para más usos
              </p>
            </div>
            <span class="text-[11px] font-mono text-stone-400 self-start sm:self-center">
              Completado
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { api, type CustomerReward } from '../api';

const loading = ref(true);
const rewards = ref<CustomerReward[]>([]);
const activeRedemptionAlert = ref<any | null>(null);

let lastHandledAlertId = '';
let livePollTimer: any = null;

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

const triggerHaptic = () => {
  try {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
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

const loadRewards = async (silent = false) => {
  try {
    if (!silent) loading.value = true;
    const minDelay = silent ? Promise.resolve() : delay(850);
    const [res] = await Promise.all([
      api.getRewards().catch(() => []),
      minDelay
    ]);
    rewards.value = res;
  } catch (err) {
    console.error('Error cargando recompensas:', err);
  } finally {
    if (!silent) loading.value = false;
  }
};

const pollLiveStatus = async () => {
  try {
    const live = await api.getLiveStatus();
    if (live && live.recent_alert && live.recent_alert.id !== lastHandledAlertId) {
      lastHandledAlertId = live.recent_alert.id;

      if (live.recent_alert.type === 'REDEMPTION') {
        activeRedemptionAlert.value = live.recent_alert;
        playRedeemChime();
        triggerHaptic();
        await loadRewards(true);
        window.dispatchEvent(new CustomEvent('confy-user-changed'));
      }
    }
  } catch {
    // Silencioso
  }
};

onMounted(() => {
  loadRewards();
  livePollTimer = setInterval(pollLiveStatus, 2000);
  window.addEventListener('confy-user-changed', () => loadRewards(true));
});

onUnmounted(() => {
  clearInterval(livePollTimer);
  window.removeEventListener('confy-user-changed', () => loadRewards(true));
});
</script>
