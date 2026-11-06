<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom" class="border-t border-stone-200/60 py-1">
        <ion-tab-button tab="home" href="/tabs/home">
          <span class="text-xl">🏠</span>
          <ion-label class="text-[11px] font-bold">Inicio</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="card" href="/tabs/card">
          <span class="text-xl">☕</span>
          <ion-label class="text-[11px] font-bold">Mi Tarjeta</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="rewards" href="/tabs/rewards">
          <span class="text-xl">🎁</span>
          <ion-label class="text-[11px] font-bold">Premios</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonPage, IonRouterOutlet } from '@ionic/vue';
</script>
