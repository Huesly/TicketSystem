<template>
  <ion-page>
    <ion-content :fullscreen="true" class="bg-crema">
      <div class="p-4 space-y-5 max-w-md mx-auto fluid-container">
        <!-- Encabezado Minimalista Mobile -->
        <div class="flex items-center justify-between pt-2">
          <div>
            <h2 class="fluid-title font-extrabold text-roast-900">Hola, {{ customerName }}</h2>
            <p class="text-xs text-roast-500">Cada café suma a tu próxima cortesía.</p>
          </div>
          <button
            @click="openQr"
            class="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <!-- Google Material Icon: qr_code_2 -->
            <svg class="w-4 h-4 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <path d="M14 14h3v3h-3z"/>
            </svg>
            Mi QR
          </button>
        </div>

        <!-- Tarjeta de 8 Sellos (Widget Mobile) -->
        <div class="bg-white rounded-2xl fluid-pad border border-stone-300 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h3 class="font-bold text-sm text-stone-900">Tarjeta Activa</h3>
            </div>
            <span class="text-[11px] font-bold text-stone-700 font-mono bg-stone-100 px-2.5 py-0.5 rounded-md border border-stone-200">
              Ciclo #{{ cardInfo ? cardInfo.cycle_number : 1 }}
            </span>
          </div>

          <!-- Cuadrícula 2x4 (8 sellos) con aspect-square -->
          <div class="grid grid-cols-4 gap-2.5">
            <div
              v-for="i in 8"
              :key="i"
              class="aspect-square rounded-xl flex flex-col items-center justify-center border transition-all"
              :class="i <= currentStamps
                ? 'bg-amber-400 border-2 border-amber-500 text-amber-950 shadow-xs'
                : i === 8
                  ? 'bg-amber-50/80 border-2 border-dashed border-amber-400 text-amber-800'
                  : 'bg-stone-50 border border-stone-200 text-stone-400'"
            >
              <!-- Google Material Icon: local_cafe -->
              <template v-if="i <= currentStamps">
                <svg class="w-5 h-5 text-amber-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
                  <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
                </svg>
                <span class="text-[9px] font-black font-mono text-amber-950 mt-0.5">Sello {{ i }}</span>
              </template>
              <!-- Google Material Icon: redeem -->
              <template v-else-if="i === 8">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect x="3" y="8" width="18" height="4" rx="1"/>
                  <path d="M12 8v13"/>
                  <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
                </svg>
                <span class="text-[9px] font-bold text-amber-800 mt-0.5">Premio</span>
              </template>
              <template v-else>
                <span class="text-xs font-bold font-mono">{{ i }}</span>
                <span class="text-[9px] text-stone-400 mt-0.5">{{ i }}</span>
              </template>
            </div>
          </div>

          <div class="space-y-1.5 pt-1">
            <div class="flex justify-between text-xs font-semibold">
              <span class="text-stone-700">{{ currentStamps }} de 8 sellos</span>
              <span class="text-stone-500">{{ Math.max(0, 8 - currentStamps) }} restantes</span>
            </div>
            <div class="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200">
              <div
                class="bg-amber-500 h-full rounded-full transition-all duration-500"
                :style="{ width: `${(currentStamps / 8) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Vitrina de 5 Productos Destacados -->
        <div class="space-y-2.5 pb-6">
          <h3 class="font-bold text-xs uppercase tracking-wider text-roast-500">Vitrina de Especialidad</h3>
          <div class="space-y-2">
            <div
              v-for="p in products"
              :key="p.id"
              class="bg-white rounded-xl p-3 flex items-center gap-3 border border-crema-border"
            >
              <div class="w-10 h-10 rounded-lg bg-crema-surface border border-crema-surface flex items-center justify-center text-roast-700 shrink-0">
                <!-- Google Material Icon: local_cafe -->
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
                  <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-xs text-roast-900 truncate">{{ p.name }}</h4>
                <p class="text-[11px] text-roast-500 line-clamp-1">{{ p.description }}</p>
              </div>
              <span class="text-xs font-extrabold text-roast-900 font-mono bg-crema-surface px-2.5 py-1 rounded-md border border-crema-border shrink-0">
                ${{ (p.price || 0).toLocaleString('es-CO') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal QR Real Mobile con aspect-square -->
      <div v-if="showModal" class="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl border border-crema-border p-5 w-full max-w-xs text-center space-y-4 shadow-xl">
          <div class="flex items-center justify-between">
            <span class="text-[10px] uppercase font-bold text-roast-700 bg-crema-surface border border-crema-border px-2.5 py-0.5 rounded">
              QR Dinámico
            </span>
            <button @click="showModal = false" class="text-roast-400 hover:text-roast-700 p-1 rounded-lg" aria-label="Cerrar">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>

          <h3 class="font-bold text-sm text-roast-900">Muestra este código al pagar</h3>

          <div class="bg-crema-surface p-4 rounded-xl border border-crema-surface aspect-square w-full max-w-[200px] mx-auto flex flex-col items-center justify-center">
            <div v-if="loadingQr" class="text-xs text-roast-400">
              Generando QR...
            </div>
            <div v-else-if="qrExpired" class="space-y-2">
              <p class="text-xs font-bold text-red-600">Código expirado</p>
              <button @click="fetchQr" class="bg-roast-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                Generar nuevo
              </button>
            </div>
            <div v-else class="bg-white p-2 rounded-lg border border-crema-surface">
              <qrcode-vue
                :value="qrToken"
                :size="155"
                level="M"
                render-as="svg"
              />
            </div>
          </div>

          <div class="text-[11px] font-semibold text-roast-500">
            Expira en <strong class="text-roast-900 font-mono">{{ timeLeft }}s</strong>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { IonPage, IonContent } from '@ionic/vue';
import QrcodeVue from 'qrcode.vue';
import { api } from '../api';

const showModal = ref(false);
const qrToken = ref('');
const timeLeft = ref(60);
const qrExpired = ref(false);
const loadingQr = ref(false);
const customerName = ref('Socio');
const products = ref<any[]>([]);
const cardInfo = ref<any>(null);
let timer: any = null;

const currentStamps = computed(() => cardInfo.value?.stamps_count || 0);

const fetchQr = async () => {
  loadingQr.value = true;
  qrExpired.value = false;
  try {
    const res = await api.generatePurchaseQr();
    qrToken.value = res.qr_token;
    timeLeft.value = res.expires_in_seconds || 60;

    clearInterval(timer);
    timer = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;
      } else {
        qrExpired.value = true;
        clearInterval(timer);
      }
    }, 1000);
  } catch (err) {
    console.error('Error generando QR mobile:', err);
  } finally {
    loadingQr.value = false;
  }
};

const openQr = () => {
  showModal.value = true;
  fetchQr();
};

const loadData = async () => {
  try {
    const [cards, prods] = await Promise.all([
      api.getLoyaltyCards().catch(() => null),
      api.getProducts().catch(() => [])
    ]);
    if (cards && cards.active_card) {
      cardInfo.value = cards.active_card;
    }
    if (prods && prods.length > 0) {
      products.value = prods;
    }
  } catch (err) {
    console.error('Error cargando datos mobile:', err);
  }
};

onMounted(() => {
  loadData();
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>
