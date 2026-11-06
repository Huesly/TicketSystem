<template>
  <div class="space-y-6">
    <div class="space-y-1">
      <h2 class="text-xl font-extrabold text-coffee-900 tracking-tight">Mi Tarjeta Digital</h2>
      <p class="text-xs text-stone-500 font-medium">Tus sellos son válidos en cualquiera de nuestras sedes.</p>
    </div>

    <!-- Tarjeta Principal (8 Sellos) -->
    <div class="bg-gradient-to-br from-coffee-900 to-coffee-800 text-amber-50 rounded-3xl p-6 shadow-xl border border-coffee-700/50 relative overflow-hidden space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-[10px] uppercase font-bold tracking-widest text-amber-300">Programa Multisede</span>
          <h3 class="font-extrabold text-lg text-white">Ciclo Activo #2</h3>
        </div>
        <div class="text-right">
          <span class="text-2xl font-black font-mono text-amber-300">5 / 8</span>
          <p class="text-[10px] text-amber-200/60 font-semibold uppercase">Sellos Acumulados</p>
        </div>
      </div>

      <!-- Cuadrícula 2x4 con 8 casillas -->
      <div class="grid grid-cols-4 gap-3">
        <div 
          v-for="i in 8" 
          :key="i"
          class="aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 relative border"
          :class="i <= 5 
            ? 'bg-amber-400/20 border-amber-300 text-amber-200 shadow-inner' 
            : i === 8
              ? 'bg-white/10 border-dashed border-amber-300/60 text-amber-300 animate-pulse'
              : 'bg-black/20 border-white/10 text-stone-500'"
        >
          <span v-if="i <= 5" class="text-2xl drop-shadow-md">☕</span>
          <span v-else-if="i === 8" class="text-xl">🎁</span>
          <span v-else class="text-xs font-bold font-mono">{{ i }}</span>

          <span class="text-[9px] font-bold mt-1" :class="i <= 5 ? 'text-amber-200' : 'text-stone-400'">
            {{ i === 8 ? 'Premio' : `Sello ${i}` }}
          </span>
        </div>
      </div>

      <!-- Mensaje de Estado -->
      <div class="bg-black/30 backdrop-blur-xs rounded-xl p-3 flex items-center justify-between text-xs">
        <span class="text-amber-100/90 font-medium">Meta: 8 sellos para premio</span>
        <span class="font-bold text-amber-300">Faltan 3 sellos</span>
      </div>
    </div>

    <!-- Regla de Acumulación Explicada -->
    <div class="bg-amber-100/60 rounded-2xl p-4 border border-amber-200/80 space-y-1">
      <h4 class="font-bold text-xs text-amber-950 flex items-center gap-1.5">
        <span>💡</span> ¿Cómo acumulas sellos?
      </h4>
      <p class="text-[11px] text-amber-900 leading-relaxed">
        Ganas <strong>1 sello</strong> por cada <strong>$10.000 COP</strong> en tus consumos (hasta un máximo de 3 sellos por compra). Los sellos sobrantes que superen la meta pasan automáticamente a tu siguiente tarjeta.
      </p>
    </div>

    <!-- Historial de Movimientos -->
    <div class="space-y-3">
      <h3 class="font-bold text-sm text-stone-900">Historial de Sellos</h3>

      <div class="bg-white rounded-3xl p-4 border border-stone-200/60 shadow-xs divide-y divide-stone-100">
        <div v-for="item in movements" :key="item.id" class="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
          <div class="space-y-0.5">
            <h5 class="font-bold text-xs text-stone-900">{{ item.description }}</h5>
            <p class="text-[11px] text-stone-400 font-medium">{{ item.store }} • {{ item.date }}</p>
          </div>
          <span class="font-black text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            +{{ item.stamps }} sellos
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const movements = ref([
  { id: 1, description: 'Compra de Café y Repostería', store: 'Sede Cabecera', date: 'Hoy, 3:15 PM', stamps: 3 },
  { id: 2, description: 'Desayuno Americano Especial', store: 'Sede Centro', date: 'Ayer, 9:20 AM', stamps: 2 },
  { id: 3, description: 'Arrastre desde Ciclo #1 (Carry-In)', store: 'Sistema', date: '31 Octubre 2026', stamps: 0 },
]);
</script>
