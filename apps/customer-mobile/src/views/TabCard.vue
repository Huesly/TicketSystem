<template>
  <ion-page>
    <ion-content :fullscreen="true" class="bg-crema">
      <div class="p-5 space-y-6 max-w-md mx-auto">
        <h2 class="text-xl font-extrabold text-coffee-900 tracking-tight pt-2">Mi Tarjeta Digital</h2>

        <!-- Tarjeta de 8 Sellos Mobile -->
        <div class="bg-gradient-to-br from-coffee-900 to-coffee-800 text-amber-50 rounded-3xl p-6 shadow-xl space-y-5">
          <div class="flex items-center justify-between">
            <span class="text-[10px] uppercase font-bold text-amber-300">Confy Club</span>
            <span class="text-xl font-black font-mono text-amber-300">5 / 8</span>
          </div>

          <div class="grid grid-cols-4 gap-2.5">
            <div 
              v-for="i in 8" 
              :key="i"
              class="aspect-square rounded-2xl flex flex-col items-center justify-center border"
              :class="i <= 5 
                ? 'bg-amber-400/20 border-amber-300 text-amber-200' 
                : i === 8
                  ? 'bg-white/10 border-dashed border-amber-300/60 text-amber-300'
                  : 'bg-black/20 border-white/10 text-stone-500'"
            >
              <span v-if="i <= 5" class="text-xl">☕</span>
              <span v-else-if="i === 8" class="text-lg">🎁</span>
              <span v-else class="text-xs font-bold font-mono">{{ i }}</span>
            </div>
          </div>

          <div class="bg-black/30 rounded-xl p-3 text-xs flex justify-between">
            <span class="text-amber-100">Meta: 8 sellos</span>
            <span class="font-bold text-amber-300">Faltan 3</span>
          </div>
        </div>

        <div class="bg-white rounded-3xl p-4 border border-stone-200/60 shadow-xs space-y-2">
          <h4 class="font-bold text-xs text-stone-900">Historial Reciente</h4>
          <div class="text-xs text-stone-500 flex justify-between py-1 border-b border-stone-100">
            <span>Sede Cabecera</span>
            <strong class="text-emerald-700">+3 sellos</strong>
          </div>
          <div class="text-xs text-stone-500 flex justify-between py-1">
            <span>Sede Centro</span>
            <strong class="text-emerald-700">+2 sellos</strong>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
</script>
