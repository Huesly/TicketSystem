<template>
  <div class="space-y-6">
    <!-- PANTALLA PREVIA: ASIGNACIÓN DE SEDE Y APERTURA DE TURNO POS -->
    <div v-if="!activeStore || isSelectingStore" class="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div class="text-center space-y-2">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-100 text-3xl mb-1 shadow-inner">
          🏪
        </div>
        <h2 class="text-2xl font-black text-stone-900 tracking-tight">Apertura de Terminal y Asignación de Sede</h2>
        <p class="text-xs text-stone-500 max-w-md mx-auto">
          Selecciona el establecimiento físico en el que estás operando la caja registradora.
        </p>
      </div>

      <!-- Alerta de Arquitectura Futura (Turnos y Horarios) -->
      <div class="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
        <span class="text-lg shrink-0">🕒</span>
        <div class="space-y-1">
          <p class="font-bold">Módulo de Planificación de Turnos (Próxima Fase):</p>
          <p class="text-[11px] text-amber-800/90 leading-relaxed">
            Esta sede se asignará de manera automática según el horario y cuadrante laboral del cajero conectado desde la aplicación de gestión de turnos del personal.
          </p>
        </div>
      </div>

      <!-- Tarjeta de Operador Identificado -->
      <div class="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-coffee-900 text-white font-bold text-sm flex items-center justify-center">
            JP
          </div>
          <div>
            <h4 class="font-extrabold text-xs text-stone-900">Juan Pérez</h4>
            <p class="text-[11px] text-stone-400">Rol: Cajero Operativo POS (Demo)</p>
          </div>
        </div>
        <span class="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
          Sesión Autenticada
        </span>
      </div>

      <!-- Lista de Sedes Físicas Disponibles -->
      <div class="space-y-3">
        <h3 class="font-bold text-xs uppercase tracking-wider text-stone-400">Selecciona tu Sede de Atención:</h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            v-for="store in stores" 
            :key="store.id"
            @click="pendingStoreSelection = store"
            class="bg-white rounded-3xl p-5 border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md"
            :class="pendingStoreSelection?.id === store.id ? 'border-coffee-900 bg-amber-50/30 ring-2 ring-coffee-900/10' : 'border-stone-200 hover:border-stone-300'"
          >
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                  {{ store.code }}
                </span>
                <span class="w-2.5 h-2.5 rounded-full" :class="store.status === 'active' ? 'bg-emerald-500' : 'bg-stone-300'"></span>
              </div>
              <h4 class="font-extrabold text-stone-900 text-sm">{{ store.name }}</h4>
              <p class="text-[11px] text-stone-500 line-clamp-2">{{ store.address || 'Sede oficial' }}</p>
            </div>

            <div class="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
              <span>{{ store.city }}</span>
              <span class="font-bold text-coffee-900" :class="pendingStoreSelection?.id === store.id ? 'underline' : ''">
                {{ pendingStoreSelection?.id === store.id ? 'Seleccionada' : 'Elegir' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Botón de Confirmación de Apertura de Turno -->
      <div class="flex items-center justify-end gap-3 pt-2">
        <button 
          v-if="activeStore" 
          @click="isSelectingStore = false"
          class="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 transition cursor-pointer"
        >
          Cancelar y Volver
        </button>

        <button 
          @click="confirmStoreOpening"
          :disabled="!pendingStoreSelection"
          class="bg-coffee-900 hover:bg-black disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition duration-150 flex items-center gap-2 cursor-pointer"
        >
          <span>Abrir Terminal en {{ pendingStoreSelection?.name || 'Sede Seleccionada' }}</span>
          <span>→</span>
        </button>
      </div>
    </div>

    <!-- TERMINAL POS PRINCIPAL (Solo se muestra una vez asignada la sede) -->
    <template v-else>
      <!-- Barra Superior de Estado de Sede y Turno -->
      <div class="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl shrink-0">
            ☕
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Turno de Caja Abierto</span>
            </div>
            <h3 class="font-extrabold text-sm text-stone-900 flex items-center gap-2">
              <span>{{ activeStore.name }}</span>
              <span class="text-xs font-mono font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                {{ activeStore.code }} • {{ activeStore.city }}
              </span>
            </h3>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-[11px] font-mono text-stone-500 hidden sm:inline">
            Cajero: <strong>Juan Pérez</strong>
          </span>
          <button 
            @click="isSelectingStore = true"
            class="text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>🔄</span> Cambiar de Sede
          </button>
        </div>
      </div>

      <!-- Selector de Modo de Operación: Compra vs Redención -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-extrabold text-stone-900 tracking-tight">Operación de Caja POS</h2>
          <p class="text-xs text-stone-500">Escanea con la cámara o ingresa la factura para registrar compras o entregar premios.</p>
        </div>

        <div class="flex items-center gap-2">
          <button 
            @click="switchMode('purchase')" 
            class="px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer"
            :class="mode === 'purchase' ? 'bg-coffee-900 text-white shadow-sm' : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'"
          >
            Acumular Sellos (Compra)
          </button>
          <button 
            @click="switchMode('redemption')" 
            class="px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer"
            :class="mode === 'redemption' ? 'bg-coffee-900 text-white shadow-sm' : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'"
          >
            Canjear Premio (Cortesía)
          </button>
        </div>
      </div>

      <!-- MODO 1: COMPRA Y ACUMULACIÓN DE SELLOS -->
      <div v-if="mode === 'purchase'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Columna 1: Escáner Óptico con Cámara Web (5 columnas) -->
        <div class="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-sm text-stone-900 flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full" :class="isCameraActive ? 'bg-emerald-500 animate-pulse' : 'bg-stone-300'"></span>
              1. Lector de Código QR
            </h3>
            <span class="text-[11px] font-mono font-bold px-2 py-0.5 rounded" :class="isCameraActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-400'">
              {{ isCameraActive ? 'Cámara Activa' : 'Cámara Inactiva' }}
            </span>
          </div>

          <!-- Visor de Video / Cámara Web -->
          <div class="aspect-4/3 bg-stone-900 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center text-center shadow-inner">
            <!-- Elemento Video Nativo para ZXing -->
            <video 
              ref="videoRef" 
              class="w-full h-full object-cover" 
              :class="{ 'hidden': !isCameraActive }"
              autoplay 
              muted 
              playsinline
            ></video>

            <!-- Overlay de Guía de Escaneo cuando la cámara está activa -->
            <div v-if="isCameraActive" class="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
              <div class="w-48 h-48 border-2 border-emerald-400/80 rounded-2xl relative shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                <!-- Línea de Escaneo Láser Animada -->
                <div class="absolute inset-x-0 h-0.5 bg-emerald-400 shadow-[0_0_10px_#34d399] animate-bounce"></div>
                <!-- Esquinas de mira -->
                <div class="absolute -top-1 -left-1 w-4 h-4 border-t-3 border-l-3 border-emerald-400"></div>
                <div class="absolute -top-1 -right-1 w-4 h-4 border-t-3 border-r-3 border-emerald-400"></div>
                <div class="absolute -bottom-1 -left-1 w-4 h-4 border-b-3 border-l-3 border-emerald-400"></div>
                <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b-3 border-r-3 border-emerald-400"></div>
              </div>
              <span class="text-[10px] text-white/90 bg-black/60 px-3 py-1 rounded-full mt-3 font-semibold backdrop-blur-xs">
                Apunta la cámara al QR del cliente
              </span>
            </div>

            <!-- Estado Inicial: Cámara Apagada -->
            <div v-if="!isCameraActive" class="p-6 space-y-3 flex flex-col items-center justify-center">
              <div class="w-14 h-14 rounded-full bg-stone-800 text-white flex items-center justify-center text-2xl shadow-inner">
                📷
              </div>
              <div class="space-y-1">
                <p class="text-xs font-bold text-stone-200">Lector Óptico de Cámara</p>
                <p class="text-[11px] text-stone-400 max-w-[220px]">
                  Activa la cámara para escanear en vivo el QR de 60 segundos del cliente.
                </p>
              </div>
              <button 
                @click="startCamera" 
                class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>🎥</span> Encender Cámara
              </button>
            </div>
          </div>

          <!-- Botón para Detener Cámara si está activa -->
          <div v-if="isCameraActive" class="flex items-center justify-between text-xs">
            <span class="text-stone-500 font-medium text-[11px]">Escaneando continuamente...</span>
            <button 
              @click="stopCamera"
              class="text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer"
            >
              <span>🛑</span> Detener Cámara
            </button>
          </div>

          <!-- Mensaje de Error de Cámara (si no hay permisos o dispositivo) -->
          <div v-if="cameraError" class="p-3 bg-red-50 border border-red-200 rounded-xl text-red-900 text-xs font-semibold">
            ⚠️ {{ cameraError }}
          </div>

          <!-- Alerta de QR Detectado Recientemente -->
          <div v-if="lastScannedSuccess" class="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <span>✅</span> ¡Código QR leído exitosamente!
          </div>

          <!-- Campo de Token y Simulación (Contingencia manual o sin cámara) -->
          <div class="space-y-1.5 pt-1">
            <div class="flex items-center justify-between">
              <label class="text-xs font-semibold text-stone-600">Token QR Escaneado:</label>
              <button 
                type="button"
                @click="simulateScan"
                :disabled="simulating"
                class="text-[11px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-lg transition cursor-pointer flex items-center gap-1"
              >
                <span>⚡ Simular Escaneo</span>
              </button>
            </div>
            <textarea 
              v-model="tokenInput"
              rows="2"
              placeholder="Esperando escaneo con cámara o pega el token efímero aquí..."
              class="w-full text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            ></textarea>
          </div>
        </div>

        <!-- Columna 2: Formulario de Factura POS (En Blanco con Placeholders) -->
        <div class="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-5">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-sm text-stone-900">2. Datos de Factura / Ticket de Caja</h3>
            <span class="text-[11px] text-stone-400 font-medium">Campos obligatorios (*)</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Consecutivo de Factura (En blanco por defecto) -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-stone-700">Número de Factura POS *</label>
              <input 
                v-model="invoiceRef"
                type="text" 
                placeholder="Ej: FAC-2026-00124"
                class="w-full text-xs font-mono font-semibold bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            <!-- Importe Bruto Facturado (En blanco por defecto) -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-stone-700">Importe Total Facturado (COP) *</label>
              <input 
                v-model.number="grossAmount"
                type="number" 
                placeholder="0 (Total de la factura)"
                class="w-full text-xs font-mono font-bold bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            <!-- Descuentos Comerciales (En blanco por defecto) -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-stone-700">Descuentos Comerciales (COP)</label>
              <input 
                v-model.number="discountAmount"
                type="number" 
                placeholder="0 (Si aplica descuento)"
                class="w-full text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            <!-- Valor Neto Elegible -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-stone-700">Valor Elegible para Sellos</label>
              <div class="w-full text-xs font-mono font-black bg-stone-100 text-stone-800 rounded-xl px-3.5 py-2.5 border border-stone-200">
                ${{ (eligibleAmount || 0).toLocaleString('es-CO') }} COP
              </div>
            </div>
          </div>

          <!-- Cálculo en Tiempo Real según Reglas de Negocio -->
          <div class="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-2xl">☕</span>
              <div>
                <span class="text-lg font-black font-mono text-emerald-700">+{{ calculatedStamps }} SELLOS</span>
                <p class="text-[11px] text-stone-400">Regla activa: 1 sello por cada $10.000 COP (Máx. 3)</p>
              </div>
            </div>
            <span v-if="eligibleAmount < 10000" class="text-[11px] text-stone-400 font-medium">
              Monto mínimo: $10.000 COP
            </span>
          </div>

          <!-- Botón de Envío -->
          <button 
            @click="submitPurchase"
            :disabled="isSubmitting || !tokenInput || !invoiceRef || eligibleAmount <= 0"
            class="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-md transition duration-150 flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
          >
            <span v-if="isSubmitting">Procesando Transacción en Servidor...</span>
            <span v-else>Confirmar y Registrar Compra en Caja</span>
          </button>

          <!-- Notificaciones de Error y Éxito -->
          <div v-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-900 text-xs font-bold flex items-center gap-2">
            <span>❌</span> {{ errorMessage }}
          </div>

          <div v-if="successPurchase" class="p-5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 text-xs space-y-2 animate-in fade-in">
            <div class="flex items-center justify-between font-bold">
              <span class="text-emerald-800">✅ ¡Compra Registrada con Éxito!</span>
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

      <!-- MODO 2: REDENCIÓN DE RECOMPENSA -->
      <div v-else class="max-w-xl mx-auto bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-5">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-sm text-stone-900 flex items-center gap-2">
            <span class="text-2xl">🎁</span>
            Canje de Recompensa de Cortesía
          </h3>
          <span class="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            {{ activeStore.name }}
          </span>
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="text-xs font-semibold text-stone-600">Token QR de Redención del Cliente:</label>
            <button 
              v-if="!isCameraActive"
              @click="startCamera" 
              class="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg cursor-pointer"
            >
              📷 Activar Cámara
            </button>
            <button 
              v-else
              @click="stopCamera" 
              class="text-[11px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded-lg cursor-pointer"
            >
              🛑 Detener Cámara
            </button>
          </div>

          <!-- Visor Cámara en modo redención si está activa -->
          <div v-if="isCameraActive" class="aspect-video bg-black rounded-2xl overflow-hidden relative mb-2">
            <video ref="videoRef" class="w-full h-full object-cover" autoplay muted playsinline></video>
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="w-36 h-36 border-2 border-emerald-400 rounded-xl animate-pulse"></div>
            </div>
          </div>

          <textarea 
            v-model="tokenInput"
            rows="3"
            placeholder="Esperando escaneo de QR de premio o pega el token de redención (cfy_redemption_...)"
            class="w-full text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          ></textarea>
        </div>

        <button 
          @click="submitRedemption"
          :disabled="isSubmitting || !tokenInput"
          class="w-full bg-amber-700 hover:bg-amber-800 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-md transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span v-if="isSubmitting">Validando Canje en Servidor...</span>
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
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { BrowserQRCodeReader } from '@zxing/library';
import { adminApi, type StoreItem, type PurchaseResponse, type RedemptionResponse } from '../api';

const LOCAL_STORAGE_STORE_KEY = 'confy_pos_active_store_id';

// Estados de Modo y Sede
const mode = ref<'purchase' | 'redemption'>('purchase');
const stores = ref<StoreItem[]>([]);
const activeStore = ref<StoreItem | null>(null);
const pendingStoreSelection = ref<StoreItem | null>(null);
const isSelectingStore = ref(false);

// Formulario de Factura (Comienza en Blanco)
const tokenInput = ref('');
const invoiceRef = ref('');
const grossAmount = ref<number | null>(null);
const discountAmount = ref<number | null>(null);

// Estados de Operación y Notificaciones
const isSubmitting = ref(false);
const simulating = ref(false);
const errorMessage = ref('');
const successPurchase = ref<PurchaseResponse | null>(null);
const successRedemption = ref<RedemptionResponse | null>(null);

// Estados de Cámara y ZXing
const isCameraActive = ref(false);
const cameraError = ref('');
const lastScannedSuccess = ref(false);
const videoRef = ref<HTMLVideoElement | null>(null);
let codeReader: BrowserQRCodeReader | null = null;

// Sonido Beep Sintetizado con Web Audio API
const playBeep = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      const audioCtx = new AudioContextClass();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // 880Hz nota A5
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    }
  } catch {
    // Si el navegador bloquea audio por falta de interacción, se ignora silenciosamente
  }
};

// Iniciar Escáner con Cámara
const startCamera = async () => {
  cameraError.value = '';
  isCameraActive.value = true;
  lastScannedSuccess.value = false;

  await nextTick();

  try {
    if (!codeReader) {
      codeReader = new BrowserQRCodeReader();
    }

    if (!videoRef.value) {
      cameraError.value = 'Elemento de video no encontrado.';
      isCameraActive.value = false;
      return;
    }

    // Listar dispositivos y seleccionar la cámara trasera o por defecto
    const videoInputDevices = await codeReader.listVideoInputDevices();
    if (!videoInputDevices || videoInputDevices.length === 0) {
      cameraError.value = 'No se detectó ninguna cámara web conectada al equipo.';
      isCameraActive.value = false;
      return;
    }

    const selectedDeviceId = videoInputDevices[0].deviceId;

    codeReader.decodeFromVideoDevice(
      selectedDeviceId,
      videoRef.value,
      (result, err) => {
        if (result) {
          const scannedText = result.getText();
          if (scannedText && scannedText !== tokenInput.value) {
            tokenInput.value = scannedText;
            playBeep();
            lastScannedSuccess.value = true;
            setTimeout(() => { lastScannedSuccess.value = false; }, 3000);
          }
        }
        if (err && !(err.name === 'NotFoundException')) {
          // Errores normales de cuadros sin QR se ignoran
        }
      }
    );
  } catch (err: any) {
    console.error('Error al iniciar cámara:', err);
    cameraError.value = 'No se pudo acceder a la cámara. Verifica los permisos de video en tu navegador.';
    isCameraActive.value = false;
  }
};

// Detener Cámara
const stopCamera = () => {
  if (codeReader) {
    codeReader.reset();
  }
  isCameraActive.value = false;
};

// Cambiar entre Compra y Redención
const switchMode = (newMode: 'purchase' | 'redemption') => {
  mode.value = newMode;
  errorMessage.value = '';
  successPurchase.value = null;
  successRedemption.value = null;
  tokenInput.value = '';
  stopCamera();
};

// Cálculo de Importes y Sellos
const eligibleAmount = computed(() => {
  const gross = grossAmount.value || 0;
  const discount = discountAmount.value || 0;
  return Math.max(0, gross - discount);
});

const calculatedStamps = computed(() => {
  if (eligibleAmount.value < 10000) return 0;
  return Math.min(3, Math.max(1, Math.floor(eligibleAmount.value / 10000)));
});

// Cargar Sedes desde Backend
const loadStores = async () => {
  try {
    const list = await adminApi.getStores();
    if (list && list.length > 0) {
      stores.value = list;

      // Verificar si hay una sede guardada previamente en este navegador
      const savedStoreId = localStorage.getItem(LOCAL_STORAGE_STORE_KEY);
      if (savedStoreId) {
        const found = list.find(s => s.id === savedStoreId);
        if (found) {
          activeStore.value = found;
          pendingStoreSelection.value = found;
          return;
        }
      }
      // Si no hay sede guardada, forzar la pantalla de selección inicial
      pendingStoreSelection.value = list[0];
      isSelectingStore.value = true;
    }
  } catch (err) {
    console.error('Error cargando sedes:', err);
  }
};

// Confirmar Selección de Sede
const confirmStoreOpening = () => {
  if (!pendingStoreSelection.value) return;
  activeStore.value = pendingStoreSelection.value;
  localStorage.setItem(LOCAL_STORAGE_STORE_KEY, pendingStoreSelection.value.id);
  isSelectingStore.value = false;
};

// Simulación de Escaneo Rápido (para pruebas)
const simulateScan = async () => {
  simulating.value = true;
  errorMessage.value = '';
  try {
    const res = await adminApi.generateDemoPurchaseQr();
    tokenInput.value = res.qr_token;
    playBeep();
    lastScannedSuccess.value = true;
    setTimeout(() => { lastScannedSuccess.value = false; }, 3000);
  } catch {
    errorMessage.value = 'Error al generar token demo';
  } finally {
    simulating.value = false;
  }
};

// Enviar Compra a FastAPI
const submitPurchase = async () => {
  if (!activeStore.value) return;
  isSubmitting.value = true;
  errorMessage.value = '';
  successPurchase.value = null;

  try {
    const res = await adminApi.createPurchase({
      qr_token: tokenInput.value.trim(),
      store_id: activeStore.value.id,
      receipt_reference: invoiceRef.value.trim(),
      gross_amount: grossAmount.value || 0,
      discount_amount: discountAmount.value || 0,
      currency: 'COP'
    });

    successPurchase.value = res;
    tokenInput.value = '';
    invoiceRef.value = '';
    grossAmount.value = null;
    discountAmount.value = null;
  } catch (err: any) {
    errorMessage.value = err.message || 'Error procesando compra';
  } finally {
    isSubmitting.value = false;
  }
};

// Enviar Redención a FastAPI
const submitRedemption = async () => {
  if (!activeStore.value) return;
  isSubmitting.value = true;
  errorMessage.value = '';
  successRedemption.value = null;

  try {
    const res = await adminApi.redeemReward({
      qr_token: tokenInput.value.trim(),
      store_id: activeStore.value.id
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

onUnmounted(() => {
  stopCamera();
});
</script>
