<template>
  <div class="space-y-6">
    <!-- Encabezado y Controles -->
    <div class="bg-white p-5 rounded-2xl border-2 border-stone-400 shadow-md flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-black text-stone-950 tracking-tight">Panel de Control y Analítica Multisede</h2>
        <p class="text-xs text-stone-600 font-medium">Métricas agregadas en tiempo real respaldadas por FastAPI y PostgreSQL.</p>
      </div>

      <div class="flex items-center gap-3">
        <select 
          v-model="selectedStore" 
          @change="loadDashboard"
          class="text-xs font-extrabold bg-stone-50 border-2 border-stone-400 rounded-xl px-4 py-2.5 text-stone-900 focus:bg-white focus:border-stone-900"
        >
          <option value="">Todas las Sedes</option>
          <option v-for="store in stores" :key="store.id" :value="store.id">
            {{ store.name }}
          </option>
        </select>

        <button 
          type="button"
          @click="loadDashboard" 
          class="bg-stone-900 hover:bg-black text-white font-black text-xs px-4 py-2.5 rounded-xl border-2 border-stone-950 shadow-sm transition cursor-pointer"
        >
          🔄 Actualizar Datos
        </button>
      </div>
    </div>

    <!-- Tarjetas de KPIs con Bordes Fuertes -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-2xl border-2 border-stone-400 shadow-md space-y-2">
        <span class="text-xs font-black text-stone-600 uppercase tracking-wider block">Clientes Registrados</span>
        <div class="flex items-baseline justify-between">
          <span class="text-3xl font-black font-mono text-stone-950">{{ summary.total_customers }}</span>
          <span class="text-xs font-extrabold text-emerald-900 bg-emerald-100 border border-emerald-400 px-2.5 py-0.5 rounded-md">En vivo</span>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border-2 border-stone-400 shadow-md space-y-2">
        <span class="text-xs font-black text-stone-600 uppercase tracking-wider block">Tarjetas Completadas</span>
        <div class="flex items-baseline justify-between">
          <span class="text-3xl font-black font-mono text-amber-800">{{ summary.completed_cards }}</span>
          <span class="text-xs font-bold text-stone-700 bg-stone-100 border border-stone-300 px-2 py-0.5 rounded-md">Ciclos de 8</span>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border-2 border-stone-400 shadow-md space-y-2">
        <span class="text-xs font-black text-stone-600 uppercase tracking-wider block">Sellos Acreditados</span>
        <div class="flex items-baseline justify-between">
          <span class="text-3xl font-black font-mono text-emerald-800">{{ summary.total_stamps_awarded }}</span>
          <span class="text-xs font-bold text-stone-700 bg-stone-100 border border-stone-300 px-2 py-0.5 rounded-md">Acumulados</span>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border-2 border-stone-400 shadow-md space-y-2">
        <span class="text-xs font-black text-stone-600 uppercase tracking-wider block">Ventas Facturadas</span>
        <div class="flex items-baseline justify-between">
          <span class="text-2xl font-black font-mono text-stone-950">${{ (summary.total_sales_amount_cop || 0).toLocaleString('es-CO') }}</span>
          <span class="text-xs font-bold text-stone-700 bg-stone-100 border border-stone-300 px-2 py-0.5 rounded-md">COP</span>
        </div>
      </div>
    </div>

    <!-- Tabla de Sedes con Cabecera y Bordes Claros -->
    <div class="bg-white rounded-2xl border-2 border-stone-400 shadow-md overflow-hidden">
      <div class="bg-stone-100 border-b-2 border-stone-300 px-6 py-4">
        <h3 class="font-black text-sm text-stone-950 uppercase tracking-wider">Sedes Físicas Registradas en la Plataforma</h3>
      </div>

      <div class="overflow-x-auto p-4">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="border-b-2 border-stone-300 text-stone-700 font-black uppercase tracking-wider bg-stone-50">
              <th class="py-3.5 px-4">Código</th>
              <th class="py-3.5 px-4">Nombre de Sede</th>
              <th class="py-3.5 px-4">Ciudad</th>
              <th class="py-3.5 px-4">Dirección</th>
              <th class="py-3.5 px-4 text-center">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-300 font-semibold text-stone-800">
            <tr v-for="store in stores" :key="store.id" class="hover:bg-stone-50">
              <td class="py-3.5 px-4 font-mono font-black text-stone-950">{{ store.code }}</td>
              <td class="py-3.5 px-4 font-black text-stone-950">{{ store.name }}</td>
              <td class="py-3.5 px-4">{{ store.city }}</td>
              <td class="py-3.5 px-4 text-stone-700">{{ store.address || 'Sede principal' }}</td>
              <td class="py-3.5 px-4 text-center">
                <span class="px-2.5 py-1 rounded-md text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-400">
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
