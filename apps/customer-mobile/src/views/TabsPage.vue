<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <!-- Barra inferior compacta (< 12% dvh) con iconos SVG estilo Google Fonts -->
      <ion-tab-bar slot="bottom" class="border-t border-crema-border h-14">
        <ion-tab-button tab="home" href="/tabs/home">
          <!-- Google Material Icon: home -->
          <svg class="w-5 h-5 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <ion-label class="text-[11px] font-bold">Inicio</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="card" href="/tabs/card">
          <!-- Google Material Icon: credit_card -->
          <svg class="w-5 h-5 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect width="20" height="14" x="2" y="5" rx="2"/>
            <line x1="2" x2="22" y1="10" y2="10"/>
          </svg>
          <ion-label class="text-[11px] font-bold">Tarjeta</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="rewards" href="/tabs/rewards">
          <!-- Google Material Icon: redeem -->
          <svg class="w-5 h-5 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="8" width="18" height="4" rx="1"/>
            <path d="M12 8v13"/>
            <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
          </svg>
          <ion-label class="text-[11px] font-bold">Premios</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonPage, IonRouterOutlet } from '@ionic/vue';
</script>
