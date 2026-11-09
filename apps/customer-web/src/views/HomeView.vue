<template>
  <div class="space-y-5 fluid-container">
    <!-- ======================================================================= -->
    <!-- SKELETON LOADER CON SHIMMER SUAVE & DIFUMINADO (PRECARGA ELEGANTE)      -->
    <!-- ======================================================================= -->
    <div v-if="loading" class="space-y-5" aria-hidden="true">
      <!-- Header Skeleton -->
      <div class="space-y-2">
        <div class="h-6 w-36 rounded-lg skeleton-shimmer"></div>
        <div class="h-3.5 w-56 rounded-md skeleton-shimmer"></div>
      </div>

      <!-- Banner Especialidad Skeleton -->
      <div class="bg-roast-900 rounded-2xl fluid-pad border border-roast-800 flex items-center justify-between gap-4">
        <div class="space-y-2 flex-1">
          <div class="h-3 w-24 rounded skeleton-shimmer-dark"></div>
          <div class="h-5 w-44 rounded skeleton-shimmer-dark"></div>
          <div class="h-3 w-52 rounded skeleton-shimmer-dark"></div>
        </div>
        <div class="w-10 h-10 rounded-xl skeleton-shimmer-dark shrink-0"></div>
      </div>

      <!-- Widget Tarjeta Activa Skeleton -->
      <div class="bg-white rounded-2xl fluid-pad border border-crema-border shadow-sm space-y-4">
        <div class="flex items-center justify-between">
          <div class="h-4 w-28 rounded skeleton-shimmer"></div>
          <div class="h-5 w-16 rounded skeleton-shimmer"></div>
        </div>

        <div class="grid grid-cols-4 gap-2.5">
          <div v-for="n in 8" :key="n" class="aspect-square rounded-xl skeleton-shimmer border border-crema-surface"></div>
        </div>

        <div class="space-y-2 pt-1">
          <div class="flex justify-between">
            <div class="h-3 w-20 rounded skeleton-shimmer"></div>
            <div class="h-3 w-16 rounded skeleton-shimmer"></div>
          </div>
          <div class="h-2 rounded-full skeleton-shimmer"></div>
        </div>
      </div>

      <!-- Menú Destacado Skeleton -->
      <div class="space-y-2.5">
        <div class="flex justify-between">
          <div class="h-3 w-28 rounded skeleton-shimmer"></div>
          <div class="h-3 w-20 rounded skeleton-shimmer"></div>
        </div>
        <div class="space-y-2">
          <div v-for="m in 3" :key="m" class="bg-white rounded-xl p-3.5 border border-crema-border flex items-center justify-between gap-3">
            <div class="space-y-1.5 flex-1">
              <div class="h-3.5 w-36 rounded skeleton-shimmer"></div>
              <div class="h-2.5 w-52 rounded skeleton-shimmer"></div>
            </div>
            <div class="h-6 w-16 rounded-lg skeleton-shimmer shrink-0"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ======================================================================= -->
    <!-- CONTENIDO REAL CON ANIMACIÓN DIFUMINADA (FADE-ENTER-SOFT)               -->
    <!-- ======================================================================= -->
    <div v-else class="space-y-5 fade-enter-soft">
      <!-- Saludo Minimalista -->
      <div class="space-y-0.5">
        <h2 class="fluid-title font-extrabold text-roast-900">Hola, {{ customerName }}</h2>
        <p class="text-xs text-roast-600">Cada visita suma a tu próxima bebida de especialidad.</p>
      </div>

      <!-- Banner Artesanal de Especialidad (Golden Hour Roast) -->
      <div class="relative overflow-hidden bg-gradient-to-br from-roast-900 via-roast-950 to-roast-900 text-golden-50 rounded-2xl fluid-pad border border-roast-800 shadow-md flex items-center justify-between gap-4">
        <div class="space-y-1 relative z-10">
          <div class="inline-flex items-center gap-1.5 text-[10px] font-bold text-golden-300 bg-white/10 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-golden-400/20">
            <span class="w-1.5 h-1.5 rounded-full bg-golden-400 animate-pulse"></span>
            Cosecha artesanal
          </div>
          <h3 class="font-extrabold text-sm text-white tracking-tight">Café de Origen Huila</h3>
          <p class="text-xs text-roast-200 leading-snug">Notas tostadas a chocolate negro y panela.</p>
        </div>
        <div class="w-11 h-11 rounded-xl bg-golden-500/15 border border-golden-400/30 flex items-center justify-center text-golden-400 shrink-0 shadow-inner relative z-10">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
          </svg>
        </div>
      </div>

      <!-- Widget de Tarjeta de 8 Sellos -->
      <div class="bg-white rounded-2xl fluid-pad border border-crema-border shadow-sm space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-golden-500"></span>
            <h3 class="font-bold text-sm text-roast-900">Tarjeta Activa</h3>
          </div>
          <span class="text-[11px] font-bold text-roast-700 font-mono bg-crema-surface px-2.5 py-0.5 rounded-md border border-crema-border">
            Ciclo #{{ activeCard ? activeCard.cycle_number : 1 }}
          </span>
        </div>

        <!-- Cuadrícula 2x4 con aspect-square -->
        <div class="grid grid-cols-4 gap-2.5">
          <div
            v-for="slot in 8"
            :key="slot"
            class="aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-200 border"
            :class="slot <= currentStamps
              ? 'bg-roast-900 border-roast-900 text-golden-300 shadow-xs'
              : slot === 8
                ? 'bg-golden-50/70 border-dashed border-golden-400 text-golden-800'
                : 'bg-crema-surface/60 border-crema-border text-roast-400'"
          >
            <!-- Sellos Llenos: Icono de Café Dorado -->
            <svg v-if="slot <= currentStamps" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
            </svg>
            <!-- Slot 8 Premio: Icono de Regalo -->
            <svg v-else-if="slot === 8" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="8" width="18" height="4" rx="1"/>
              <path d="M12 8v13"/>
              <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
            </svg>
            <span v-else class="text-xs font-bold font-mono">{{ slot }}</span>

            <span class="text-[9px] font-bold mt-1" :class="slot <= currentStamps ? 'text-golden-200' : 'text-roast-400'">
              {{ slot === 8 ? 'Premio' : `${slot}` }}
            </span>
          </div>
        </div>

        <!-- Barra de Progreso -->
        <div class="space-y-1.5 pt-1">
          <div class="flex justify-between text-xs font-semibold">
            <span class="text-roast-800">{{ currentStamps }} de 8 sellos</span>
            <span class="text-roast-500">{{ Math.max(0, 8 - currentStamps) }} restantes</span>
          </div>
          <div class="w-full bg-crema-surface rounded-full h-2 overflow-hidden border border-crema-border">
            <div
              class="bg-gradient-to-r from-roast-900 to-golden-600 h-full rounded-full transition-all duration-500"
              :style="{ width: `${Math.min(100, (currentStamps / 8) * 100)}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Vitrina de Productos Destacados -->
      <div class="space-y-2.5">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-xs text-roast-700">Selección de barra</h3>
          <span class="text-[11px] font-medium text-roast-500">{{ products.length }} opciones</span>
        </div>

        <div class="space-y-2">
          <div
            v-for="prod in products"
            :key="prod.id"
            class="bg-white rounded-xl p-3.5 border border-crema-border hover:border-golden-300 transition-colors flex items-center justify-between gap-3 shadow-2xs"
          >
            <div class="min-w-0 space-y-0.5">
              <h4 class="font-bold text-xs text-roast-900 truncate">{{ prod.name }}</h4>
              <p class="text-[11px] text-roast-600 line-clamp-1">{{ prod.description }}</p>
            </div>
            <span class="text-xs font-extrabold font-mono text-roast-900 bg-crema-surface px-2.5 py-1 rounded-lg border border-crema-border shrink-0">
              ${{ prod.price.toLocaleString('es-CO') }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { api, type CardSummary, type ProductItem } from '../api';

const loading = ref(true);
const customerName = ref('Camila');
const activeCard = ref<CardSummary | null>(null);
const products = ref<ProductItem[]>([]);

const currentStamps = computed(() => activeCard.value?.stamps_count || 0);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const loadData = async () => {
  try {
    loading.value = true;
    const minDelay = delay(850);
    const [cardRes, profileRes, prodRes] = await Promise.all([
      api.getLoyaltyCards().catch(() => null),
      api.getProfile().catch(() => null),
      api.getProducts().catch(() => []),
      minDelay
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
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
  window.addEventListener('confy-user-changed', loadData);
});

onUnmounted(() => {
  window.removeEventListener('confy-user-changed', loadData);
});
</script>
