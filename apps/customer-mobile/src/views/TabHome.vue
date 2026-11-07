<template>
  <ion-page>
    <ion-content :fullscreen="true" class="bg-crema">
      <div class="p-5 space-y-6 max-w-md mx-auto">
        <!-- Saludo Personalizado Mobile -->
        <div class="flex items-center justify-between pt-2">
          <div>
            <h2 class="text-xl font-extrabold text-coffee-900 tracking-tight">¡Hola, Camila! ☕</h2>
            <p class="text-xs text-stone-500 font-medium">¿Listo para tu café del día?</p>
          </div>
          <button 
            @click="openQr"
            class="bg-caramel text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            Mi QR
          </button>
        </div>

        <!-- Tarjeta de 8 Sellos (Widget Mobile) -->
        <div class="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/60 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-sm text-stone-900">Tarjeta Activa</h3>
            <span class="text-xs font-bold text-coffee-900 font-mono bg-coffee-50 px-2.5 py-1 rounded-full border border-coffee-100">
              Ciclo #{{ cardInfo ? cardInfo.cycle_number : 1 }}
            </span>
          </div>

          <!-- Cuadrícula 2x4 (8 sellos) -->
          <div class="grid grid-cols-4 gap-2.5">
            <div 
              v-for="i in 8" 
              :key="i"
              class="aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 relative border"
              :class="i <= currentStamps 
                ? 'bg-amber-100/90 border-amber-300 text-amber-900 shadow-xs' 
                : i === 8
                  ? 'bg-amber-50/50 border-dashed border-amber-300 text-amber-600'
                  : 'bg-stone-50 border-stone-200/70 text-stone-300'"
            >
              <span v-if="i <= currentStamps" class="text-xl">☕</span>
              <span v-else-if="i === 8" class="text-lg">🎁</span>
              <span v-else class="text-xs font-bold font-mono">{{ i }}</span>

              <span class="text-[9px] font-bold mt-0.5" :class="i <= currentStamps ? 'text-amber-900' : 'text-stone-400'">
                {{ i === 8 ? 'Premio' : `${i}` }}
              </span>
            </div>
          </div>

          <div class="space-y-1.5 pt-1">
            <div class="flex justify-between text-xs font-semibold">
              <span class="text-stone-600">{{ currentStamps }} de 8 sellos</span>
              <span class="text-caramel font-bold">{{ Math.max(0, 8 - currentStamps) }} restantes</span>
            </div>
            <div class="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
              <div 
                class="bg-gradient-to-r from-amber-500 to-caramel h-full rounded-full transition-all duration-500" 
                :style="{ width: `${(currentStamps / 8) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Vitrina de 5 Productos Destacados -->
        <div class="space-y-3 pb-8">
          <h3 class="font-bold text-sm text-stone-900">Vitrina de Especialidad</h3>
          <div class="space-y-2.5">
            <div 
              v-for="p in products" 
              :key="p.id"
              class="bg-white rounded-2xl p-3 flex items-center gap-3.5 border border-stone-200/50 shadow-xs"
            >
              <div class="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl shrink-0">
                ☕
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-xs text-stone-900 truncate">{{ p.name }}</h4>
                <p class="text-[11px] text-stone-500 line-clamp-1">{{ p.description }}</p>
              </div>
              <span class="text-xs font-extrabold text-coffee-900 font-mono shrink-0">
                ${{ (p.price || 0).toLocaleString('es-CO') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal QR Real Mobile -->
      <div v-if="showModal" class="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl p-6 w-full max-w-xs text-center space-y-4 shadow-2xl">
          <div class="flex items-center justify-between">
            <span class="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">QR Dinámico</span>
            <button @click="showModal = false" class="text-stone-400 font-bold p-1">✕</button>
          </div>

          <h3 class="font-bold text-sm text-stone-900">Muestra este código al pagar</h3>

          <div class="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col items-center justify-center min-h-[190px]">
            <div v-if="loadingQr" class="text-xs text-stone-400 animate-pulse">
              Generando QR...
            </div>
            <div v-else-if="qrExpired" class="space-y-2">
              <p class="text-xs font-bold text-red-600">Código Expirado</p>
              <button @click="fetchQr" class="bg-stone-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                Generar Nuevo
              </button>
            </div>
            <div v-else class="bg-white p-2.5 rounded-xl border border-stone-100 shadow-xs">
              <qrcode-vue 
                :value="qrToken" 
                :size="160" 
                level="M" 
                render-as="svg" 
              />
            </div>
          </div>

          <div class="text-[11px] font-semibold text-stone-500">
            ⏱️ Expira en <strong class="text-stone-900 font-mono">{{ timeLeft }}s</strong>
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
