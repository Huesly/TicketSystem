<template>
  <ion-page>
    <ion-content :fullscreen="true" class="bg-crema">
      <div class="p-5 space-y-5 max-w-md mx-auto">
        <h2 class="text-xl font-extrabold text-coffee-900 tracking-tight pt-2">Mis Premios</h2>

        <div class="bg-white rounded-3xl p-5 border-2 border-amber-200/90 shadow-sm space-y-3">
          <span class="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            Disponible
          </span>
          <h4 class="font-extrabold text-sm text-stone-900">Café Americano 12oz de Cortesía</h4>
          <p class="text-xs text-stone-500">Premio obtenido al completar tu tarjeta de 8 sellos.</p>
          <button class="w-full bg-coffee-900 text-white font-bold text-xs py-2.5 rounded-xl">
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
