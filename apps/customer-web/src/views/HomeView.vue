<template>
  <div class="space-y-6">
    <!-- Saludo Personalizado -->
    <div class="space-y-1">
      <h2 class="text-xl font-extrabold text-coffee-900 tracking-tight">¡Hola, {{ customerName }}! ☕</h2>
      <p class="text-xs text-stone-500 font-medium">Cada café tiene una historia. ¡Nos alegra verte de nuevo!</p>
    </div>

    <!-- Banner Promocional -->
    <div class="bg-gradient-to-r from-coffee-800 to-coffee-900 text-amber-50 rounded-2xl p-4 shadow-md relative overflow-hidden">
      <div class="relative z-10 space-y-1 max-w-[70%]">
        <span class="text-[10px] uppercase font-bold tracking-wider text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-md">Cosecha Especial</span>
        <h3 class="font-bold text-sm leading-snug">Café de Origen Huila</h3>
        <p class="text-[11px] text-amber-200/80">Notas a chocolate y caramelo artesanal.</p>
      </div>
      <div class="absolute -right-4 -bottom-4 text-6xl opacity-20">☕</div>
    </div>

    <!-- Widget de Tarjeta de 8 Sellos (Resumen) -->
    <div class="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/60 space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-caramel"></span>
          <h3 class="font-bold text-sm text-stone-900">Tarjeta Activa</h3>
        </div>
        <span class="text-xs font-bold text-coffee-900 font-mono bg-coffee-50 px-2.5 py-1 rounded-full border border-coffee-100">
          Ciclo #{{ activeCard ? activeCard.cycle_number : 1 }}
        </span>
      </div>

      <!-- Cuadrícula de 8 Sellos (2x4) -->
      <div class="grid grid-cols-4 gap-2.5">
        <div 
          v-for="slot in 8" 
          :key="slot"
          class="aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 relative border"
          :class="slot <= currentStamps 
            ? 'bg-amber-100/90 border-amber-300 text-amber-900 shadow-xs scale-100' 
            : slot === 8
              ? 'bg-amber-50/50 border-dashed border-amber-300 text-amber-600'
              : 'bg-stone-50 border-stone-200/70 text-stone-300'"
        >
          <span v-if="slot <= currentStamps" class="text-xl">☕</span>
          <span v-else-if="slot === 8" class="text-lg">🎁</span>
          <span v-else class="text-xs font-bold font-mono">{{ slot }}</span>

          <span class="text-[9px] font-bold mt-0.5" :class="slot <= currentStamps ? 'text-amber-900' : 'text-stone-400'">
            {{ slot === 8 ? 'Premio' : `${slot}` }}
          </span>
        </div>
      </div>

      <!-- Barra de Progreso y Mensaje -->
      <div class="space-y-2 pt-1">
        <div class="flex justify-between text-xs font-semibold">
          <span class="text-stone-600">{{ currentStamps }} de 8 sellos</span>
          <span class="text-caramel font-bold">{{ Math.max(0, 8 - currentStamps) }} restantes</span>
        </div>
        <div class="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
          <div 
            class="bg-gradient-to-r from-amber-500 to-caramel h-full rounded-full transition-all duration-500" 
            :style="{ width: `${Math.min(100, (currentStamps / 8) * 100)}%` }"
          ></div>
        </div>
        <p class="text-xs text-center text-stone-500 font-medium">
          ¡Ya casi! Completa 8 sellos y recibe una bebida de cortesía.
        </p>
      </div>
    </div>

    <!-- Vitrina de Productos Destacados desde API -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="font-bold text-sm text-stone-900">Nuestros 5 Destacados</h3>
        <span class="text-[11px] font-semibold text-caramel">Recomendados del barista</span>
      </div>

      <div v-if="loadingProducts" class="text-center text-xs text-stone-400 py-4 animate-pulse">
        Cargando menú de la cafetería...
      </div>

      <div v-else class="space-y-2.5">
        <div 
          v-for="prod in products" 
          :key="prod.id"
          class="bg-white rounded-2xl p-3.5 border border-stone-200/60 shadow-xs flex items-center justify-between hover:border-amber-200 transition"
        >
          <div class="space-y-0.5">
            <h4 class="font-bold text-xs text-stone-900">{{ prod.name }}</h4>
            <p class="text-[11px] text-stone-400 line-clamp-1">{{ prod.description }}</p>
          </div>
          <span class="text-xs font-black font-mono text-coffee-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 shrink-0 ml-3">
            ${{ prod.price.toLocaleString('es-CO') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { api, type CardSummary, type ProductItem } from '../api';

const customerName = ref('Camila');
const activeCard = ref<CardSummary | null>(null);
const products = ref<ProductItem[]>([]);
const loadingProducts = ref(true);

const currentStamps = computed(() => activeCard.value?.stamps_count || 0);

const loadData = async () => {
  try {
    const [cardRes, profileRes, prodRes] = await Promise.all([
      api.getLoyaltyCards().catch(() => null),
      api.getProfile().catch(() => null),
      api.getProducts().catch(() => [])
    ]);

    if (cardRes && cardRes.active_card) {
      activeCard.value = cardRes.active_card;
    }
    if (profileRes && profileRes.full_name) {
      customerName.value = profileRes.full_name.split(' ')[0];
    }
    if (prodRes && prodRes.length > 0) {
      products.value = prodRes;
    }
  } catch (err) {
    console.error('Error cargando datos de inicio:', err);
  } finally {
    loadingProducts.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>
