<template>
  <div class="space-y-5">
    <!-- Encabezado Minimalista -->
    <div class="bg-white rounded-2xl border border-stone-300 shadow-sm fluid-pad flex flex-wrap items-center justify-between gap-4">
      <div class="space-y-1">
        <h1 class="fluid-title font-extrabold text-stone-950 tracking-tight">Analítica Operativa Multisede</h1>
        <p class="text-xs text-stone-500">Indicadores consolidados en tiempo real desde la base de datos central.</p>
      </div>

      <div class="flex items-center gap-2.5">
        <select 
          v-model="selectedStore" 
          @change="loadDashboard"
          aria-label="Filtrar por sede"
          class="text-xs font-semibold bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 focus:bg-white focus:border-stone-900 focus:outline-none"
        >
          <option value="">Todas las sedes</option>
          <option v-for="store in stores" :key="store.id" :value="store.id">
            {{ store.name }}
          </option>
        </select>

        <button 
          type="button"
          @click="loadDashboard" 
          class="bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs px-3.5 py-2 rounded-xl border border-stone-900 transition flex items-center gap-1.5 cursor-pointer"
        >
          <!-- SVG: Refresh -->
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/>
          </svg>
          <span>Actualizar</span>
        </button>
      </div>
    </div>

    <!-- Tarjetas Líquidas de KPIs -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-stone-300 shadow-sm space-y-2 fluid-container">
        <div class="flex items-center justify-between text-stone-500">
          <span class="text-xs font-semibold uppercase tracking-wider">Clientes</span>
          <svg class="w-4 h-4 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div class="flex items-baseline justify-between pt-1">
          <span class="fluid-kpi font-extrabold font-mono text-stone-950">{{ summary.total_customers }}</span>
          <span class="text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">Activos</span>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-stone-300 shadow-sm space-y-2 fluid-container">
        <div class="flex items-center justify-between text-stone-500">
          <span class="text-xs font-semibold uppercase tracking-wider">Ciclos Completos</span>
          <svg class="w-4 h-4 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
          </svg>
        </div>
        <div class="flex items-baseline justify-between pt-1">
          <span class="fluid-kpi font-extrabold font-mono text-stone-950">{{ summary.completed_cards }}</span>
          <span class="text-[11px] font-medium text-stone-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-full">Meta 8/8</span>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-stone-300 shadow-sm space-y-2 fluid-container">
        <div class="flex items-center justify-between text-stone-500">
          <span class="text-xs font-semibold uppercase tracking-wider">Sellos Emitidos</span>
          <svg class="w-4 h-4 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
          </svg>
        </div>
        <div class="flex items-baseline justify-between pt-1">
          <span class="fluid-kpi font-extrabold font-mono text-stone-950">{{ summary.total_stamps_awarded }}</span>
          <span class="text-[11px] font-medium text-stone-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-full">Acumulados</span>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-stone-300 shadow-sm space-y-2 fluid-container">
        <div class="flex items-center justify-between text-stone-500">
          <span class="text-xs font-semibold uppercase tracking-wider">Facturación</span>
          <svg class="w-4 h-4 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <div class="flex items-baseline justify-between pt-1">
          <span class="fluid-kpi font-extrabold font-mono text-stone-950">${{ (summary.total_sales_amount_cop || 0).toLocaleString('es-CO') }}</span>
          <span class="text-[11px] font-medium text-stone-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-full">COP</span>
        </div>
      </div>
    </div>

    <!-- Directorio de Sedes -->
    <div class="bg-white rounded-2xl border border-stone-300 shadow-sm overflow-hidden">
      <div class="border-b border-stone-200 px-6 py-4 flex items-center justify-between">
        <h2 class="font-bold text-sm text-stone-950">Establecimientos Vinculados</h2>
        <span class="text-xs text-stone-500">{{ stores.length }} puntos de venta</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider bg-stone-50">
              <th class="py-3 px-6">Código</th>
              <th class="py-3 px-6">Sede</th>
              <th class="py-3 px-6">Ciudad</th>
              <th class="py-3 px-6">Dirección</th>
              <th class="py-3 px-6 text-right">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-200 text-stone-700">
            <tr v-for="store in stores" :key="store.id" class="hover:bg-stone-50/80 transition">
              <td class="py-3.5 px-6 font-mono font-semibold text-stone-900">{{ store.code }}</td>
              <td class="py-3.5 px-6 font-bold text-stone-950">{{ store.name }}</td>
              <td class="py-3.5 px-6">{{ store.city }}</td>
              <td class="py-3.5 px-6 text-stone-500">{{ store.address || 'Sede comercial' }}</td>
              <td class="py-3.5 px-6 text-right">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  Operativa
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { adminApi, type DashboardSummary, type StoreItem } from '../api';

const selectedStore = ref('');
const summary = ref<DashboardSummary>({
  total_customers: 0,
  active_cards: 0,
  completed_cards: 0,
  total_purchases_count: 0,
  total_sales_amount_cop: 0,
  total_stamps_awarded: 0,
  total_rewards_redeemed: 0
});
const stores = ref<StoreItem[]>([]);

const loadDashboard = async () => {
  try {
    const res = await adminApi.getDashboard(selectedStore.value || undefined);
    summary.value = res.summary;
  } catch (err) {
    console.error('Error cargando KPIs:', err);
  }
};

const loadStores = async () => {
  try {
    stores.value = await adminApi.getStores();
  } catch (err) {
    console.error('Error cargando sedes:', err);
  }
};

onMounted(async () => {
  await Promise.all([loadDashboard(), loadStores()]);
});
</script>
