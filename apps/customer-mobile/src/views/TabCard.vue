<template>
  <ion-page>
    <ion-content :fullscreen="true" class="bg-crema">
      <div class="p-4 space-y-5 max-w-md mx-auto fluid-container">
        <div class="space-y-0.5 pt-2">
          <h2 class="fluid-title font-extrabold text-roast-900">Mi Tarjeta Digital</h2>
          <p class="text-xs text-roast-500">Acumula 8 sellos en cualquiera de nuestras sedes.</p>
        </div>

        <!-- Tarjeta de 8 Sellos Mobile -->
        <div class="bg-roast-900 text-golden-50 rounded-2xl fluid-pad border border-roast-900 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-[10px] uppercase font-bold tracking-wider text-golden-300">Confy Club</span>
            <span class="text-lg font-black font-mono text-golden-300">5 / 8</span>
          </div>

          <div class="grid grid-cols-4 gap-2.5">
            <div
              v-for="i in 8"
              :key="i"
              class="aspect-square rounded-xl flex flex-col items-center justify-center border"
              :class="i <= 5
                ? 'bg-golden-400/20 border-golden-300 text-golden-200'
                : i === 8
                  ? 'bg-white/10 border-dashed border-golden-300/60 text-golden-300'
                  : 'bg-black/25 border-white/15 text-roast-400'"
            >
              <!-- Google Material Icon: local_cafe -->
              <svg v-if="i <= 5" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
                <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
              </svg>
              <!-- Google Material Icon: redeem -->
              <svg v-else-if="i === 8" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="8" width="18" height="4" rx="1"/>
                <path d="M12 8v13"/>
                <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
              </svg>
              <span v-else class="text-xs font-bold font-mono">{{ i }}</span>
            </div>
          </div>

          <div class="bg-black/30 rounded-xl p-3 text-xs flex justify-between border border-white/10">
            <span class="text-stone-200">Meta: 8 sellos</span>
            <span class="font-bold text-golden-300">Faltan 3</span>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-4 border border-crema-border space-y-2">
          <h4 class="font-bold text-xs text-roast-900">Historial Reciente</h4>
          <div class="text-xs text-roast-600 flex justify-between py-1.5 border-b border-crema-surface">
            <span>Sede Cabecera</span>
            <strong class="text-emerald-700 font-mono">+3 sellos</strong>
          </div>
          <div class="text-xs text-roast-600 flex justify-between py-1.5">
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
