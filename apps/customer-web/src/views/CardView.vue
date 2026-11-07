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
            {{ activeCard && activeCard.stamps_remaining > 0 ? `Faltan ${activeCard.stamps_remaining} sellos` : 'Tarjeta completada' }}
          </span>
        </div>
      </div>

      <!-- Regla de Acumulación con <details> nativo para reducir ruido -->
      <details class="group bg-white rounded-xl border border-stone-300 px-4 py-3 text-xs text-stone-600">
        <summary class="font-bold text-stone-900 cursor-pointer flex items-center justify-between list-none">
          <span class="inline-flex items-center gap-2">
            <!-- Google Material Icon: info -->
            <svg class="w-4 h-4 text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
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
