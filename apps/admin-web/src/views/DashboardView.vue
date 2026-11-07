<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-extrabold text-stone-900 tracking-tight">Panel de Control y Analítica Multisede</h2>
        <p class="text-xs text-stone-500">Métricas agregadas en tiempo real respaldadas por FastAPI y PostgreSQL.</p>
      </div>

      <div class="flex items-center gap-3">
        <select 
          v-model="selectedStore" 
          @change="loadDashboard"
          class="text-xs font-semibold bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-700"
        >
          <option value="">Todas las Sedes</option>
          <option v-for="store in stores" :key="store.id" :value="store.id">
            {{ store.name }}
          </option>
        </select>
        <button 
          @click="loadDashboard" 
          class="bg-stone-900 hover:bg-black text-white font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer"
        >
          Actualizar Datos
        </button>
      </div>
    </div>

    <!-- Tarjetas de KPIs Reales -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-2">
        <span class="text-xs font-bold text-stone-400 uppercase tracking-wider">Clientes Registrados</span>
        <div class="flex items-baseline justify-between">
          <span class="text-2xl font-black font-mono text-stone-900">{{ summary.total_customers }}</span>
          <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">En vivo</span>
        </div>
      </div>

      <div class="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-2">
        <span class="text-xs font-bold text-stone-400 uppercase tracking-wider">Tarjetas Completadas</span>
        <div class="flex items-baseline justify-between">
          <span class="text-2xl font-black font-mono text-amber-700">{{ summary.completed_cards }}</span>
          <span class="text-xs font-bold text-stone-500">Ciclos de 8 sellos</span>
        </div>
      </div>

      <div class="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-2">
        <span class="text-xs font-bold text-stone-400 uppercase tracking-wider">Sellos Acreditados</span>
        <div class="flex items-baseline justify-between">
          <span class="text-2xl font-black font-mono text-emerald-700">{{ summary.total_stamps_awarded }}</span>
          <span class="text-xs font-bold text-stone-500">Modo Combinado</span>
        </div>
      </div>

      <div class="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-2">
        <span class="text-xs font-bold text-stone-400 uppercase tracking-wider">Ventas Facturadas</span>
        <div class="flex items-baseline justify-between">
          <span class="text-2xl font-black font-mono text-coffee-900">${{ (summary.total_sales_amount_cop || 0).toLocaleString('es-CO') }}</span>
          <span class="text-xs font-bold text-stone-500">Total COP</span>
        </div>
      </div>
    </div>

    <!-- Desglose por Sede Física -->
    <div class="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
      <h3 class="font-bold text-sm text-stone-900">Sedes Registradas en la Plataforma</h3>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-stone-200 text-stone-400 font-bold uppercase tracking-wider">
              <th class="py-3 px-4">Código</th>
              <th class="py-3 px-4">Nombre de Sede</th>
              <th class="py-3 px-4">Ciudad</th>
              <th class="py-3 px-4">Dirección</th>
              <th class="py-3 px-4 text-center">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 font-medium text-stone-700">
            <tr v-for="store in stores" :key="store.id">
              <td class="py-3.5 px-4 font-mono font-bold text-stone-900">{{ store.code }}</td>
              <td class="py-3.5 px-4 font-bold text-stone-900">{{ store.name }}</td>
              <td class="py-3.5 px-4">{{ store.city }}</td>
              <td class="py-3.5 px-4 text-stone-500">{{ store.address || 'Sede principal' }}</td>
              <td class="py-3.5 px-4 text-center">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {{ store.status }}
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
