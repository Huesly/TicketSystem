<template>
  <div class="space-y-6">
    <div class="space-y-1">
      <h2 class="text-xl font-extrabold text-coffee-900 tracking-tight">Mis Recompensas</h2>
      <p class="text-xs text-stone-500 font-medium">Premios obtenidos al completar tus tarjetas de 8 sellos.</p>
    </div>

    <div v-if="loading" class="p-8 text-center text-xs text-stone-400 font-semibold animate-pulse">
      Cargando recompensas...
    </div>

    <template v-else>
      <!-- Lista de Recompensas Disponibles -->
      <div class="space-y-3">
        <h3 class="font-bold text-xs uppercase tracking-wider text-stone-400">Listas para Canjear</h3>

        <div v-if="availableRewards.length === 0" class="p-6 bg-white rounded-3xl border border-stone-200/80 text-center space-y-2">
          <span class="text-3xl">☕</span>
          <p class="text-xs font-bold text-stone-700">No tienes recompensas pendientes de canje</p>
          <p class="text-[11px] text-stone-400">Acumula 8 sellos en tu tarjeta digital para desbloquear tu próxima bebida de cortesía.</p>
        </div>

        <div 
          v-for="reward in availableRewards" 
          :key="reward.id"
          class="bg-white rounded-3xl p-5 border-2 border-amber-200/90 shadow-sm relative overflow-hidden space-y-4"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-1">
              <span class="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Disponible
              </span>
              <h4 class="font-extrabold text-sm text-stone-900">{{ reward.name }}</h4>
              <p class="text-xs text-stone-500 leading-snug">{{ reward.description }}</p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl shrink-0">
              🎁
            </div>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
            <span class="text-stone-400 font-medium">Vence: <strong class="text-stone-700">{{ new Date(reward.expires_at).toLocaleDateString('es-CO') }}</strong></span>
            <button 
              @click="openRedemptionQr(reward)"
              class="bg-coffee-900 hover:bg-black text-amber-50 font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition active:scale-95 cursor-pointer"
            >
              Redimir en Caja
            </button>
          </div>
        </div>
      </div>

      <!-- Historial de Premios Canjeados -->
      <div v-if="redeemedRewards.length > 0" class="space-y-3">
        <h3 class="font-bold text-xs uppercase tracking-wider text-stone-400">Canjeadas Anteriormente</h3>

        <div class="bg-white rounded-3xl p-4 border border-stone-200/50 shadow-xs divide-y divide-stone-100">
          <div v-for="item in redeemedRewards" :key="item.id" class="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
            <div class="space-y-0.5">
              <h5 class="font-bold text-xs text-stone-900">{{ item.name }}</h5>
              <p class="text-[11px] text-stone-400 font-medium">Emitida: {{ new Date(item.issued_at).toLocaleDateString('es-CO') }}</p>
            </div>
            <span class="text-[10px] font-bold text-stone-400 uppercase bg-stone-100 px-2.5 py-1 rounded-full">
              Canjeado
            </span>
          </div>
        </div>
      </div>
    </template>

    <!-- Modal QR de Redención Dinámico -->
    <div v-if="selectedReward" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            QR de Canje
          </span>
          <button @click="selectedReward = null" class="text-stone-400 hover:text-stone-600 p-1 cursor-pointer">✕</button>
        </div>

        <h3 class="font-extrabold text-stone-900 text-lg">{{ selectedReward.name }}</h3>
        <p class="text-xs text-stone-500">Muestra este código al cajero para recibir tu premio.</p>

        <div class="bg-white p-4 rounded-2xl border-2 border-stone-100 inline-block shadow-inner w-full">
          <div class="w-full h-44 bg-stone-50 flex items-center justify-center rounded-xl font-mono text-xs text-stone-400 flex-col gap-2 p-2">
            <span class="text-4xl">🎁</span>
            <div v-if="redemptionToken" class="w-full px-2">
              <code class="text-[11px] font-mono font-bold text-emerald-900 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 break-all block">
                {{ redemptionToken }}
              </code>
            </div>
            <div v-else class="text-xs text-stone-400 animate-pulse">
              Generando código efímero...
            </div>
          </div>
        </div>

        <button 
          v-if="redemptionToken"
          @click="copyRedeemToken"
          class="w-full text-xs font-bold bg-emerald-100 hover:bg-emerald-200 text-emerald-900 py-2 rounded-xl transition cursor-pointer"
        >
          {{ copied ? '✅ Token Copiado' : '📋 Copiar Token de Redención' }}
        </button>

        <p class="text-xs text-amber-700 font-semibold bg-amber-50 p-2 rounded-xl">
          ⏱️ Este código es de un solo uso y vence en 60 segundos.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { api, type CustomerReward } from '../api';

const loading = ref(true);
const rewards = ref<CustomerReward[]>([]);
const selectedReward = ref<CustomerReward | null>(null);
const redemptionToken = ref('');
const copied = ref(false);

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

const openRedemptionQr = async (reward: CustomerReward) => {
  selectedReward.value = reward;
  redemptionToken.value = '';
  try {
    const res = await api.generateRewardQr(reward.id);
    redemptionToken.value = res.qr_token;
  } catch (err: any) {
    alert(err.message || 'Error al generar QR');
    selectedReward.value = null;
  }
};

const copyRedeemToken = async () => {
  if (!redemptionToken.value) return;
  await navigator.clipboard.writeText(redemptionToken.value);
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 2000);
};

onMounted(() => {
  loadRewards();
});
</script>
