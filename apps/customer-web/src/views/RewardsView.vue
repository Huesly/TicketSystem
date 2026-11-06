<template>
  <div class="space-y-6">
    <div class="space-y-1">
      <h2 class="text-xl font-extrabold text-coffee-900 tracking-tight">Mis Recompensas</h2>
      <p class="text-xs text-stone-500 font-medium">Premios obtenidos al completar tus tarjetas de 8 sellos.</p>
    </div>

    <!-- Lista de Recompensas Disponibles -->
    <div class="space-y-3">
      <h3 class="font-bold text-xs uppercase tracking-wider text-stone-400">Listas para Canjear</h3>

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
          <span class="text-stone-400 font-medium">Vence en: <strong class="text-stone-700">{{ reward.expiresIn }}</strong></span>
          <button 
            @click="openRedemptionQr(reward)"
            class="bg-coffee-900 hover:bg-black text-amber-50 font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition active:scale-95"
          >
            Redimir en Caja
          </button>
        </div>
      </div>
    </div>

    <!-- Historial de Premios Canjeados -->
    <div class="space-y-3">
      <h3 class="font-bold text-xs uppercase tracking-wider text-stone-400">Canjeadas Anteriormente</h3>

      <div class="bg-white rounded-3xl p-4 border border-stone-200/50 shadow-xs divide-y divide-stone-100">
        <div v-for="item in redeemedHistory" :key="item.id" class="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
          <div class="space-y-0.5">
            <h5 class="font-bold text-xs text-stone-900">{{ item.name }}</h5>
            <p class="text-[11px] text-stone-400 font-medium">Canjeado en {{ item.store }} • {{ item.date }}</p>
          </div>
          <span class="text-[10px] font-bold text-stone-400 uppercase bg-stone-100 px-2.5 py-1 rounded-full">
            Canjeado
          </span>
        </div>
      </div>
    </div>

    <!-- Modal QR de Redención -->
    <div v-if="selectedReward" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            QR de Canje
          </span>
          <button @click="selectedReward = null" class="text-stone-400 hover:text-stone-600 p-1">✕</button>
        </div>

        <h3 class="font-extrabold text-stone-900 text-lg">{{ selectedReward.name }}</h3>
        <p class="text-xs text-stone-500">Muestra este código al cajero para recibir tu premio.</p>

        <div class="bg-white p-4 rounded-2xl border-2 border-stone-100 inline-block shadow-inner">
          <div class="w-44 h-44 bg-stone-50 flex items-center justify-center rounded-xl font-mono text-xs text-stone-400 flex-col gap-2">
            <div class="grid grid-cols-6 gap-1 p-2">
              <div v-for="i in 36" :key="i" class="w-5 h-5 rounded-xs" :class="(i * 5) % 3 === 0 ? 'bg-emerald-900' : 'bg-transparent'"></div>
            </div>
            <span>RDM-{{ selectedReward.id }}</span>
          </div>
        </div>

        <p class="text-xs text-amber-700 font-semibold bg-amber-50 p-2 rounded-xl">
          ⏱️ Este código es de un solo uso y vence en 60 segundos.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedReward = ref<any>(null);

const availableRewards = ref([
  {
    id: 101,
    name: 'Café Americano 12oz de Cortesía',
    description: 'Válido por una bebida caliente en cualquiera de nuestras sedes.',
    expiresIn: '24 días'
  }
]);

const redeemedHistory = ref([
  {
    id: 99,
    name: 'Cappuccino de Cortesía (Ciclo #1)',
    store: 'Sede Centro',
    date: '31 Octubre 2026'
  }
]);

const openRedemptionQr = (reward: any) => {
  selectedReward.value = reward;
};
</script>
