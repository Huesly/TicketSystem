<template>
  <div class="space-y-6">
    <!-- Encabezado de la Terminal -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-extrabold text-stone-900 tracking-tight">Registro de Caja y Fidelización</h2>
        <p class="text-xs text-stone-500">Escanea el código QR del cliente para acreditar sellos o canjear recompensas.</p>
      </div>
      <div class="flex items-center gap-2">
        <button 
          @click="mode = 'purchase'" 
          class="px-4 py-2 text-xs font-bold rounded-xl transition"
          :class="mode === 'purchase' ? 'bg-stone-900 text-white shadow-sm' : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'"
        >
          Acumular Sellos (Compra)
        </button>
        <button 
          @click="mode = 'redemption'" 
          class="px-4 py-2 text-xs font-bold rounded-xl transition"
          :class="mode === 'redemption' ? 'bg-stone-900 text-white shadow-sm' : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'"
        >
          Canjear Recompensa
        </button>
      </div>
    </div>

    <!-- Panel de Operación Principal (2 Columnas) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Columna 1: Lector QR y Cliente (5 cols) -->
      <div class="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-5">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-sm text-stone-900 flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            1. Escáner de Código QR
          </h3>
          <span class="text-[11px] font-mono font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
            Auto-Scan Activo
          </span>
        </div>

        <!-- Visor de Escáner Óptico / Lector 2D -->
        <div class="aspect-4/3 bg-stone-900 rounded-2xl flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group">
          <div class="w-48 h-48 border-2 border-dashed border-emerald-400/70 rounded-2xl flex flex-col items-center justify-center p-4 relative">
            <div class="absolute inset-x-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399] animate-bounce"></div>
            <span class="text-3xl mb-2">📷</span>
            <p class="text-xs text-stone-300 font-medium">Acerca el código QR del cliente a la cámara o pistola 2D</p>
          </div>
        </div>

        <!-- Entrada Manual / Contingencia -->
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-stone-600">O ingresar token manual de contingencia:</label>
          <div class="flex gap-2">
            <input 
              v-model="tokenInput"
              type="text" 
              placeholder="Ej: cfy_purchase_x9A2..."
              class="flex-1 text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
            <button 
              @click="mockScan" 
              class="bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
            >
              Simular
            </button>
          </div>
        </div>

        <!-- Ficha del Cliente Identificado -->
        <div v-if="identifiedCustomer" class="bg-amber-50 rounded-2xl p-4 border border-amber-200 space-y-2 animate-in fade-in">
          <div class="flex items-center justify-between">
            <span class="text-[10px] uppercase font-bold text-amber-800 bg-amber-200/60 px-2.5 py-0.5 rounded-full">
              Cliente Identificado
            </span>
            <span class="text-xs font-bold text-stone-900 font-mono">{{ identifiedCustomer.phone }}</span>
          </div>
          <h4 class="font-extrabold text-stone-900 text-sm">{{ identifiedCustomer.name }}</h4>
          <div class="flex items-center justify-between text-xs text-stone-600 pt-1 border-t border-amber-200/60">
            <span>Saldo actual: <strong class="text-coffee-900 font-mono font-bold">{{ identifiedCustomer.stamps }} de 8 sellos</strong></span>
            <span class="text-amber-800 font-semibold font-mono">Ciclo #{{ identifiedCustomer.cycle }}</span>
          </div>
        </div>
      </div>

      <!-- Columna 2: Formulario de Factura y Confirmación (7 cols) -->
      <div class="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-6">
        <h3 class="font-bold text-sm text-stone-900">2. Datos de Factura / Ticket POS</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-stone-700">Número de Factura / Consecutivo POS *</label>
            <input 
              v-model="invoiceRef"
              type="text" 
              placeholder="FAC-2026-09841"
              class="w-full text-xs font-mono font-semibold bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold text-stone-700">Importe Total Facturado (COP) *</label>
            <input 
              v-model.number="grossAmount"
              type="number" 
              placeholder="35000"
              class="w-full text-xs font-mono font-bold bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold text-stone-700">Descuentos Comerciales (COP)</label>
            <input 
              v-model.number="discountAmount"
              type="number" 
              placeholder="0"
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

        <!-- Cálculo en Tiempo Real -->
        <div class="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3">
          <div class="flex items-center justify-between text-xs">
            <span class="text-stone-600 font-medium">Regla aplicada: 1 sello por cada $10.000 COP (Máx. 3)</span>
            <span class="font-bold text-stone-900 font-mono">Sellos calculados:</span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-2xl">☕</span>
              <div>
                <span class="text-lg font-black font-mono text-emerald-700">+{{ calculatedStamps }} SELLOS</span>
                <p class="text-[11px] text-stone-400">Calculado automáticamente por el servidor</p>
              </div>
            </div>

            <!-- Previsualización de Arrastre -->
            <div v-if="identifiedCustomer && (identifiedCustomer.stamps + calculatedStamps) >= 8" class="text-right">
              <span class="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                🎉 ¡Completa Ciclo y Gana Premio!
              </span>
              <p class="text-[10px] text-stone-500 mt-1">
                Sobrante al nuevo ciclo: +{{ (identifiedCustomer.stamps + calculatedStamps) - 8 }} sellos
              </p>
            </div>
          </div>
        </div>

        <!-- Botón de Acción Principal -->
        <button 
          @click="submitPurchase"
          :disabled="isSubmitting || !identifiedCustomer || !invoiceRef || grossAmount <= 0"
          class="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-md transition duration-150 flex items-center justify-center gap-2 active:scale-98"
        >
          <span v-if="isSubmitting">Procesando Transacción Segura...</span>
          <span v-else>Confirmar y Registrar Compra en Caja</span>
        </button>

        <!-- Mensaje de Éxito -->
        <div v-if="successMessage" class="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2">
          <span>✅</span> {{ successMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const mode = ref<'purchase' | 'redemption'>('purchase');
const tokenInput = ref('');
const invoiceRef = ref('FAC-2026-09841');
const grossAmount = ref(35000);
const discountAmount = ref(0);
const isSubmitting = ref(false);
const successMessage = ref('');

const identifiedCustomer = ref<any>({
  name: 'Camila Rodríguez',
  phone: '+57 300 123 4567',
  stamps: 5,
  cycle: 2
});

const eligibleAmount = computed(() => {
  return Math.max(0, (grossAmount.value || 0) - (discountAmount.value || 0));
});

const calculatedStamps = computed(() => {
  if (eligibleAmount.value < 10000) return 0;
  return Math.min(3, Math.max(1, Math.floor(eligibleAmount.value / 10000)));
});

const mockScan = () => {
  tokenInput.value = 'cfy_purchase_' + Math.random().toString(36).substring(7);
  identifiedCustomer.value = {
    name: 'Camila Rodríguez',
    phone: '+57 300 123 4567',
    stamps: 5,
    cycle: 2
  };
};

const submitPurchase = () => {
  isSubmitting.value = true;
  successMessage.value = '';

  setTimeout(() => {
    isSubmitting.value = false;
    successMessage.value = `¡Compra confirmada! Se acreditaron ${calculatedStamps.value} sellos a Camila Rodríguez. Total tarjeta: 8/8. ¡Recompensa generada!`;
    invoiceRef.value = 'FAC-2026-' + Math.floor(10000 + Math.random() * 90000);
  }, 800);
};
</script>
