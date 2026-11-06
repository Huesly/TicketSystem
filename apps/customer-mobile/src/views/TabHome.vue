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
            @click="showModal = true"
            class="bg-caramel text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            Mi QR
          </button>
        </div>

        <!-- Tarjeta de 8 Sellos (Widget Mobile) -->
        <div class="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/60 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-sm text-stone-900">Tarjeta Activa</h3>
            <span class="text-xs font-bold text-coffee-900 font-mono bg-coffee-50 px-2.5 py-1 rounded-full border border-coffee-100">
              Ciclo #2
            </span>
          </div>

          <!-- Cuadrícula 2x4 (8 sellos) -->
          <div class="grid grid-cols-4 gap-2.5">
            <div 
              v-for="i in 8" 
              :key="i"
              class="aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 relative border"
              :class="i <= 5 
                ? 'bg-amber-100/90 border-amber-300 text-amber-900 shadow-xs' 
                : i === 8
                  ? 'bg-amber-50/50 border-dashed border-amber-300 text-amber-600'
                  : 'bg-stone-50 border-stone-200/70 text-stone-300'"
            >
              <span v-if="i <= 5" class="text-xl">☕</span>
              <span v-else-if="i === 8" class="text-lg">🎁</span>
              <span v-else class="text-xs font-bold font-mono">{{ i }}</span>

              <span class="text-[9px] font-bold mt-0.5" :class="i <= 5 ? 'text-amber-900' : 'text-stone-400'">
                {{ i === 8 ? 'Premio' : `${i}` }}
              </span>
            </div>
          </div>

          <div class="space-y-1.5 pt-1">
            <div class="flex justify-between text-xs font-semibold">
              <span class="text-stone-600">5 de 8 sellos</span>
              <span class="text-caramel font-bold">Faltan 3</span>
            </div>
            <div class="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
              <div class="bg-gradient-to-r from-amber-500 to-caramel h-full rounded-full" style="width: 62.5%"></div>
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
                {{ p.icon }}
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-xs text-stone-900 truncate">{{ p.name }}</h4>
                <p class="text-[11px] text-stone-500 line-clamp-1">{{ p.desc }}</p>
              </div>
              <span class="text-xs font-extrabold text-coffee-900 font-mono shrink-0">
                ${{ p.price.toLocaleString('es-CO') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal QR Simple -->
      <div v-if="showModal" class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl p-6 w-full max-w-xs text-center space-y-4">
          <h3 class="font-bold text-sm text-stone-900">Tu Código QR de Compra</h3>
          <div class="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col items-center">
            <div class="grid grid-cols-6 gap-1 p-2">
              <div v-for="i in 36" :key="i" class="w-4 h-4 rounded-xs" :class="(i * 7) % 3 === 0 ? 'bg-stone-900' : 'bg-transparent'"></div>
            </div>
            <span class="font-mono text-xs text-stone-500 mt-2">Expira en 60s</span>
          </div>
          <button @click="showModal = false" class="w-full bg-stone-900 text-white font-bold text-xs py-2.5 rounded-xl">
            Cerrar
          </button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonPage, IonContent } from '@ionic/vue';

const showModal = ref(false);

const products = ref([
  { id: 1, name: 'Cappuccino Vainilla', desc: 'Espresso doble con leche texturizada.', price: 12500, icon: '☕' },
  { id: 2, name: 'Cold Brew Caramelo', desc: 'Extracción en frío 18h.', price: 14000, icon: '🧊' },
  { id: 3, name: 'Mocha Chocolate', desc: 'Café con cacao al 70%.', price: 13500, icon: '🍫' },
  { id: 4, name: 'Croissant Almendras', desc: 'Hojaldre relleno de frangipane.', price: 9500, icon: '🥐' },
  { id: 5, name: 'Cheesecake Frutos Rojos', desc: 'Base crocante con coulis de mora.', price: 11000, icon: '🍰' },
]);
</script>
