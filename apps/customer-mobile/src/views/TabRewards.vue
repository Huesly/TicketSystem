<template>
  <ion-page>
    <ion-content :fullscreen="true" class="bg-crema">
      <div class="p-4 space-y-5 max-w-md mx-auto fluid-container">
        <div class="space-y-0.5 pt-2">
          <h2 class="fluid-title font-extrabold text-stone-900">Mis Premios</h2>
          <p class="text-xs text-stone-500">Beneficios disponibles para canje en sede.</p>
        </div>

        <div class="bg-white rounded-2xl fluid-pad border border-stone-300 shadow-sm space-y-3">
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-1">
              <span class="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Disponible
              </span>
              <h4 class="font-extrabold text-sm text-stone-900">Café Americano 12oz de Cortesía</h4>
              <p class="text-xs text-stone-500">Premio obtenido al completar tu tarjeta de 8 sellos.</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 shrink-0">
              <!-- Google Material Icon: redeem -->
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="8" width="18" height="4" rx="1"/>
                <path d="M12 8v13"/>
                <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
              </svg>
            </div>
          </div>

          <button class="w-full bg-coffee-900 text-white font-bold text-xs py-2.5 rounded-lg inline-flex items-center justify-center gap-1.5">
            <!-- Google Material Icon: qr_code_2 -->
            <svg class="w-4 h-4 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <path d="M14 14h3v3h-3z"/>
            </svg>
            Mostrar QR de Canje
          </button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
</script>
