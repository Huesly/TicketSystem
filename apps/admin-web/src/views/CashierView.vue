<template>
  <div class="space-y-6">
    <!-- Encabezado de la Terminal -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-extrabold text-stone-900 tracking-tight">Registro de Caja y Fidelización</h2>
        <p class="text-xs text-stone-500">Escanea el código QR del cliente para acreditar sellos o canjear recompensas en vivo.</p>
      </div>
      <div class="flex items-center gap-2">
        <button 
          @click="mode = 'purchase'" 
          class="px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer"
          :class="mode === 'purchase' ? 'bg-stone-900 text-white shadow-sm' : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'"
        >
          Acumular Sellos (Compra)
        </button>
        <button 
          @click="mode = 'redemption'" 
          class="px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer"
          :class="mode === 'redemption' ? 'bg-stone-900 text-white shadow-sm' : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'"
        >
          Canjear Recompensa
        </button>
      </div>
    </div>

    <!-- Selector de Sede -->
    <div class="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
      <div class="flex items-center gap-2 text-xs">
        <span class="text-amber-900 font-bold">🏪 Sede Activa:</span>
        <select 
          v-model="selectedStoreId" 
          class="bg-white border border-amber-300 rounded-xl px-3 py-1.5 font-bold text-stone-800 text-xs focus:ring-2 focus:ring-amber-500/50"
        >
          <option v-for="store in stores" :key="store.id" :value="store.id">
            {{ store.code }} - {{ store.name }} ({{ store.city }})
          </option>
        </select>
      </div>
      <span class="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
        Cajero Autorizado: Juan Pérez (Demo)
      </span>
    </div>

    <!-- MODO COMPRA -->
    <div v-if="mode === 'purchase'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Columna 1: Lector QR y Token (5 cols) -->
      <div class="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-5">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-sm text-stone-900 flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            1. Token QR del Cliente
          </h3>
          <span class="text-[11px] font-mono font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
            60s Opaque QR
          </span>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-semibold text-stone-600">Pegar o Escanear Token QR del Cliente:</label>
          <textarea 
            v-model="tokenInput"
            rows="3"
            placeholder="Pega aquí el token generado por el cliente (ej: cfy_purchase_...)"
            class="w-full text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          ></textarea>
        </div>

        <p class="text-[11px] text-stone-400 leading-relaxed">
          💡 En producción se lee mediante pistola óptica 2D o cámara web del cajero. Para probar localmente, abre la Web de Clientes en <a href="http://localhost:3010" target="_blank" class="text-coffee-900 underline font-bold">http://localhost:3010</a>, haz clic en "Mi QR", luego "Copiar Token" y pégalo aquí.
        </p>
      </div>

      <!-- Columna 2: Factura POS y Confirmación (7 cols) -->
      <div class="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-6">
        <h3 class="font-bold text-sm text-stone-900">2. Datos de Factura / Ticket POS</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-stone-700">Número de Factura / Consecutivo POS *</label>
            <input 
              v-model="invoiceRef"
              type="text" 
              class="w-full text-xs font-mono font-semibold bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold text-stone-700">Importe Total Facturado (COP) *</label>
            <input 
              v-model.number="grossAmount"
              type="number" 
              class="w-full text-xs font-mono font-bold bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold text-stone-700">Descuentos Comerciales (COP)</label>
            <input 
              v-model.number="discountAmount"
              type="number" 
              class="w-full text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold text-stone-700">Valor Elegible para Sellos</label>
            <div class="w-full text-xs font-mono font-black bg-stone-100 text-stone-800 rounded-xl px-3.5 py-2.5 border border-stone-200">
              ${{ eligibleAmount.toLocaleString('es-CO') }} COP
            </div>
          </div>
        </div>

        <!-- Cálculo de Sellos -->
        <div class="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-2xl">☕</span>
            <div>
              <span class="text-lg font-black font-mono text-emerald-700">+{{ calculatedStamps }} SELLOS</span>
              <p class="text-[11px] text-stone-400">Regla: $10.000 COP/sello (Máx. 3 por compra)</p>
            </div>
          </div>
        </div>

        <!-- Botón de Envío a FastAPI -->
        <button 
          @click="submitPurchase"
          :disabled="isSubmitting || !tokenInput || !invoiceRef || eligibleAmount <= 0"
          class="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-md transition duration-150 flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
        >
          <span v-if="isSubmitting">Procesando Vía FastAPI en PostgreSQL...</span>
          <span v-else>Confirmar y Registrar Compra en Caja</span>
        </button>

        <!-- Mensajes de Estado / Errores -->
        <div v-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-900 text-xs font-bold flex items-center gap-2">
          <span>❌</span> {{ errorMessage }}
        </div>

        <div v-if="successPurchase" class="p-5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 text-xs space-y-2 animate-in fade-in">
          <div class="flex items-center justify-between font-bold">
            <span class="text-emerald-800">✅ ¡Compra Registrada Exitosamente!</span>
            <span class="font-mono text-[11px]">{{ successPurchase.purchase_id }}</span>
          </div>
          <p>Cliente: <strong>{{ successPurchase.customer_name }}</strong></p>
          <p>Sellos otorgados: <strong>+{{ successPurchase.stamps_awarded }}</strong></p>
          <div v-if="successPurchase.rewards_issued.length > 0" class="p-3 bg-amber-100 rounded-xl text-amber-950 font-bold border border-amber-300">
            🎉 ¡Tarjeta completada! Se emitió la recompensa: {{ successPurchase.rewards_issued[0].name }}
          </div>
        </div>
      </div>
    </div>

    <!-- MODO REDENCIÓN DE RECOMPENSA -->
    <div v-else class="max-w-xl mx-auto bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-5">
      <div class="flex items-center justify-between">
        <h3 class="font-bold text-sm text-stone-900 flex items-center gap-2">
          <span class="text-2xl">🎁</span>
          Canje de Recompensa de Cortesía
        </h3>
        <span class="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
          Terminal POS
        </span>
      </div>

      <div class="space-y-2">
        <label class="text-xs font-semibold text-stone-600">Token QR de Redención del Cliente:</label>
        <textarea 
          v-model="tokenInput"
          rows="3"
          placeholder="Pega aquí el token generado por el cliente al canjear su premio (cfy_redemption_...)"
          class="w-full text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        ></textarea>
      </div>

      <button 
        @click="submitRedemption"
        :disabled="isSubmitting || !tokenInput"
        class="w-full bg-amber-700 hover:bg-amber-800 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-md transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
      >
        <span v-if="isSubmitting">Validando Canje en Base de Datos...</span>
        <span v-else>Confirmar Entrega de Recompensa al Cliente</span>
      </button>

      <div v-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-900 text-xs font-bold flex items-center gap-2">
        <span>❌</span> {{ errorMessage }}
      </div>

      <div v-if="successRedemption" class="p-5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 text-xs space-y-2">
        <span class="font-bold text-sm">🎉 ¡Premio Entregado con Éxito!</span>
        <p>Recompensa: <strong>{{ successRedemption.reward_name }}</strong></p>
        <p>Cliente: <strong>{{ successRedemption.customer_name }}</strong></p>
        <p class="text-[11px] text-stone-500 font-mono">Redención ID: {{ successRedemption.redemption_id }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { adminApi, type StoreItem, type PurchaseResponse, type RedemptionResponse } from '../api';

const mode = ref<'purchase' | 'redemption'>('purchase');
const tokenInput = ref('');
const invoiceRef = ref('FAC-2026-' + Math.floor(10000 + Math.random() * 90000));
const grossAmount = ref(35000);
const discountAmount = ref(0);
const isSubmitting = ref(false);
const errorMessage = ref('');
const successPurchase = ref<PurchaseResponse | null>(null);
const successRedemption = ref<RedemptionResponse | null>(null);

const stores = ref<StoreItem[]>([
  { id: '87c69994-6e69-425b-8cb0-b08be5f97371', code: 'SEDE-01', name: 'Sede Cabecera', city: 'Bucaramanga', status: 'active' },
  { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', code: 'SEDE-02', name: 'Sede Centro', city: 'Bucaramanga', status: 'active' },
  { id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', code: 'SEDE-03', name: 'Sede Cañaveral', city: 'Floridablanca', status: 'active' }
]);
const selectedStoreId = ref('87c69994-6e69-425b-8cb0-b08be5f97371');

const eligibleAmount = computed(() => {
  return Math.max(0, (grossAmount.value || 0) - (discountAmount.value || 0));
});

const calculatedStamps = computed(() => {
  if (eligibleAmount.value < 10000) return 0;
  return Math.min(3, Math.max(1, Math.floor(eligibleAmount.value / 10000)));
});

const loadStores = async () => {
  try {
    const list = await adminApi.getStores();
    if (list && list.length > 0) {
      stores.value = list;
      selectedStoreId.value = list[0].id;
    }
  } catch (err) {
    console.error('Error cargando sedes:', err);
  }
};

const submitPurchase = async () => {
  isSubmitting.value = true;
  errorMessage.value = '';
  successPurchase.value = null;

  try {
    const res = await adminApi.createPurchase({
      qr_token: tokenInput.value.trim(),
      store_id: selectedStoreId.value,
      receipt_reference: invoiceRef.value.trim(),
      gross_amount: grossAmount.value,
      discount_amount: discountAmount.value,
      currency: 'COP'
    });

    successPurchase.value = res;
    tokenInput.value = '';
    invoiceRef.value = 'FAC-2026-' + Math.floor(10000 + Math.random() * 90000);
  } catch (err: any) {
    errorMessage.value = err.message || 'Error procesando compra';
  } finally {
    isSubmitting.value = false;
  }
};

const submitRedemption = async () => {
  isSubmitting.value = true;
  errorMessage.value = '';
  successRedemption.value = null;

  try {
    const res = await adminApi.redeemReward({
      qr_token: tokenInput.value.trim(),
      store_id: selectedStoreId.value
    });

    successRedemption.value = res;
    tokenInput.value = '';
  } catch (err: any) {
    errorMessage.value = err.message || 'Error al canjear recompensa';
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  loadStores();
});
</script>
