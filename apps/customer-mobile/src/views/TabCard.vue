<template>
  <ion-page>
    <ion-content :fullscreen="true" class="bg-crema">
      <div class="p-4 space-y-5 max-w-md mx-auto fluid-container">
        <div class="space-y-0.5 pt-2">
          <h2 class="fluid-title font-extrabold text-stone-900">Mi Tarjeta Digital</h2>
          <p class="text-xs text-stone-500">Acumula 8 sellos en cualquiera de nuestras sedes.</p>
        </div>

        <!-- Tarjeta de 8 Sellos Mobile -->
        <div class="bg-white text-stone-900 rounded-2xl fluid-pad border border-stone-300 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-[10px] uppercase font-bold tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
              Confy Club
            </span>
            <span class="text-lg font-black font-mono text-stone-950">5 / 8</span>
          </div>

          <div class="grid grid-cols-4 gap-2.5">
            <div
              v-for="i in 8"
              :key="i"
              class="aspect-square rounded-xl flex flex-col items-center justify-center border transition-all"
              :class="i <= 5
                ? 'bg-amber-400 border-2 border-amber-500 text-amber-950 shadow-xs'
                : i === 8
                  ? 'bg-amber-50/80 border-2 border-dashed border-amber-400 text-amber-800'
                  : 'bg-stone-50 border border-stone-200 text-stone-400'"
            >
              <!-- Google Material Icon: local_cafe -->
              <template v-if="i <= 5">
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

          <div class="bg-stone-50 rounded-xl p-3 text-xs flex justify-between border border-stone-200">
            <span class="text-stone-700">Meta: 8 sellos</span>
            <span class="font-bold text-amber-900">Faltan 3</span>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-4 border border-stone-300 shadow-xs space-y-2">
          <h4 class="font-bold text-xs text-stone-900">Historial Reciente</h4>
          <div class="text-xs text-stone-600 flex justify-between py-1.5 border-b border-stone-100">
            <span>Sede Cabecera</span>
            <strong class="text-emerald-700 font-mono">+3 sellos</strong>
          </div>
          <div class="text-xs text-stone-600 flex justify-between py-1.5">
            <span>Sede Centro</span>
            <strong class="text-emerald-700 font-mono">+2 sellos</strong>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
</script>
