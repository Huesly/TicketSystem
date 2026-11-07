<template>
  <div class="space-y-6">
    <div class="space-y-1">
      <h2 class="text-xl font-extrabold text-coffee-900 tracking-tight">Mi Tarjeta Digital</h2>
      <p class="text-xs text-stone-500 font-medium">Tus sellos son válidos en cualquiera de nuestras sedes.</p>
    </div>

    <div v-if="loading" class="p-8 text-center text-xs text-stone-400 font-semibold animate-pulse">
      Cargando tarjeta digital desde el servidor...
    </div>

    <template v-else>
      <!-- Tarjeta Principal (8 Sellos) -->
      <div class="bg-gradient-to-br from-coffee-900 to-coffee-800 text-amber-50 rounded-3xl p-6 shadow-xl border border-coffee-700/50 relative overflow-hidden space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-[10px] uppercase font-bold tracking-widest text-amber-300">Programa Multisede</span>
            <h3 class="font-extrabold text-lg text-white">Ciclo Activo #{{ activeCard ? activeCard.cycle_number : 1 }}</h3>
          </div>
          <div class="text-right">
            <span class="text-2xl font-black font-mono text-amber-300">{{ activeCard ? activeCard.stamps_count : 0 }} / {{ activeCard ? activeCard.stamps_required : 8 }}</span>
            <p class="text-[10px] text-amber-200/60 font-semibold uppercase">Sellos Acumulados</p>
          </div>
        </div>

        <!-- Cuadrícula 2x4 con 8 casillas -->
        <div class="grid grid-cols-4 gap-3">
          <div 
            v-for="i in (activeCard ? activeCard.stamps_required : 8)" 
            :key="i"
            class="aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 relative border"
            :class="i <= (activeCard ? activeCard.stamps_count : 0) 
              ? 'bg-amber-400/20 border-amber-300 text-amber-200 shadow-inner' 
              : i === (activeCard ? activeCard.stamps_required : 8)
                ? 'bg-white/10 border-dashed border-amber-300/60 text-amber-300 animate-pulse'
                : 'bg-black/20 border-white/10 text-stone-500'"
          >
            <span v-if="i <= (activeCard ? activeCard.stamps_count : 0)" class="text-2xl drop-shadow-md">☕</span>
            <span v-else-if="i === (activeCard ? activeCard.stamps_required : 8)" class="text-xl">🎁</span>
            <span v-else class="text-xs font-bold font-mono">{{ i }}</span>

            <span class="text-[9px] font-bold mt-1" :class="i <= (activeCard ? activeCard.stamps_count : 0) ? 'text-amber-200' : 'text-stone-400'">
              {{ i === (activeCard ? activeCard.stamps_required : 8) ? 'Premio' : `Sello ${i}` }}
            </span>
          </div>
        </div>

        <!-- Mensaje de Estado -->
        <div class="bg-black/30 backdrop-blur-xs rounded-xl p-3 flex items-center justify-between text-xs">
          <span class="text-amber-100/90 font-medium">Meta: {{ activeCard ? activeCard.stamps_required : 8 }} sellos para premio</span>
          <span class="font-bold text-amber-300">
            {{ activeCard && activeCard.stamps_remaining > 0 ? `Faltan ${activeCard.stamps_remaining} sellos` : '¡Tarjeta completada!' }}
          </span>
        </div>
      </div>

      <!-- Regla de Acumulación Explicada -->
      <div class="bg-amber-100/60 rounded-2xl p-4 border border-amber-200/80 space-y-1">
        <h4 class="font-bold text-xs text-amber-950 flex items-center gap-1.5">
          <span>💡</span> ¿Cómo acumulas sellos?
        </h4>
        <p class="text-[11px] text-amber-900 leading-relaxed">
          Ganas <strong>1 sello</strong> por cada <strong>$10.000 COP</strong> en tus consumos (hasta un máximo de 3 sellos por compra). Los sellos sobrantes que superen la meta pasan automáticamente a tu siguiente tarjeta.
        </p>
      </div>

      <!-- Historial de Ciclos Pasados -->
      <div v-if="pastCycles.length > 0" class="space-y-3">
        <h3 class="font-bold text-sm text-stone-900">Ciclos Anteriores Completados</h3>

        <div class="bg-white rounded-3xl p-4 border border-stone-200/60 shadow-xs divide-y divide-stone-100">
          <div v-for="item in pastCycles" :key="item.id" class="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
            <div class="space-y-0.5">
              <h5 class="font-bold text-xs text-stone-900">Ciclo #{{ item.cycle_number }}</h5>
              <p class="text-[11px] text-stone-400 font-medium">Completado: {{ new Date(item.completed_at || '').toLocaleDateString('es-CO') }}</p>
            </div>
            <span class="font-black text-xs font-mono px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              {{ item.stamps_count }}/{{ item.stamps_required }} sellos (100%)
            </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api, type CardSummary } from '../api';

const loading = ref(true);
const activeCard = ref<CardSummary | null>(null);
const pastCycles = ref<CardSummary[]>([]);

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
});
</script>
