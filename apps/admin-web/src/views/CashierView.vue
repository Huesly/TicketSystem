<template>
  <div class="space-y-6">
    <!-- ======================================================================= -->
    <!-- PANTALLA 1: ASIGNACIÓN DE SEDE Y APERTURA DE TURNO POS                  -->
    <!-- ======================================================================= -->
    <div v-if="!activeStore || isSelectingStore" class="max-w-4xl mx-auto space-y-5">
      
      <!-- Cabecera Minimalista con Disclosure para Info Secundaria -->
      <div class="bg-white rounded-2xl border border-stone-300 fluid-pad space-y-4 shadow-sm">
        <div class="flex items-start justify-between gap-4">
          <div class="space-y-1.5">
            <div class="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-stone-600 bg-stone-100 border border-stone-300 px-2.5 py-0.5 rounded-md">
              <!-- SVG: Storefront -->
              <svg class="w-3.5 h-3.5 text-stone-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
                <path d="M2 7h20" />
              </svg>
              <span>Apertura de Turno</span>
            </div>
            <h1 class="fluid-title font-extrabold tracking-tight text-stone-950">
              Selecciona la sede de operación
            </h1>
            <p class="text-xs text-stone-600 max-w-xl leading-relaxed">
              Elige el establecimiento físico donde operas esta caja para vincular las facturas, sellos y redenciones de tu turno.
            </p>
          </div>

          <button 
            v-if="activeStore"
            type="button"
            @click="isSelectingStore = false"
            class="text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
            <span>Volver</span>
          </button>
        </div>

        <!-- Disclosure Nativo (<details>) para reducir ruido visual -->
        <details class="group bg-stone-50 rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs text-stone-600">
          <summary class="font-semibold text-stone-800 cursor-pointer flex items-center justify-between select-none">
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4 text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
              </svg>
              <span>Información sobre auditoría de sede y turnos automáticos</span>
            </span>
            <svg class="w-4 h-4 text-stone-500 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </summary>
          <div class="pt-2.5 mt-2.5 border-t border-stone-200 space-y-1.5 text-[11px] leading-relaxed text-stone-600">
            <p><strong>Trazabilidad por punto de venta:</strong> Cada registro de compra o canje se audita bajo la sede activa del cajero.</p>
            <p><strong>Sincronización futura de turnos:</strong> En la siguiente fase, la sede se asignará automáticamente al iniciar sesión según el cuadrante horario del operador.</p>
          </div>
        </details>
      </div>

      <!-- Grid Líquido de Sedes Disponibles -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          v-for="store in stores" 
          :key="store.id"
          @click="selectAndOpenStore(store)"
          class="group bg-white rounded-2xl p-5 border transition-all duration-150 cursor-pointer flex flex-col justify-between space-y-5"
          :class="pendingStoreSelection?.id === store.id 
            ? 'border-2 border-stone-900 shadow-md' 
            : 'border-stone-300 hover:border-stone-500 shadow-sm'"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-300">
                {{ store.code }}
              </span>
              <span class="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                Activa
              </span>
            </div>

            <div>
              <h2 class="font-bold text-stone-950 text-base">{{ store.name }}</h2>
              <p class="text-xs text-stone-500 mt-0.5">{{ store.address || 'Sede comercial principal' }}</p>
            </div>

            <div class="flex items-center gap-1.5 text-[11px] text-stone-600 font-medium pt-1">
              <!-- SVG: Map Pin -->
              <svg class="w-3.5 h-3.5 text-stone-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>{{ store.city }}, Santander</span>
            </div>
          </div>

          <button 
            type="button"
            @click.stop="selectAndOpenStore(store)"
            class="w-full font-semibold text-xs py-2.5 px-4 rounded-xl border transition flex items-center justify-between cursor-pointer"
            :class="pendingStoreSelection?.id === store.id 
              ? 'bg-stone-900 text-white border-stone-900 hover:bg-stone-800' 
              : 'bg-stone-50 text-stone-900 border-stone-300 group-hover:bg-stone-900 group-hover:text-white group-hover:border-stone-900'"
          >
            <span>Iniciar turno aquí</span>
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- ======================================================================= -->
    <!-- PANTALLA 2: TERMINAL POS PRINCIPAL (Turno Abierto)                     -->
    <!-- ======================================================================= -->
    <template v-else>
      <!-- Barra Compacta de Contexto de Sede y Selector de Modo -->
      <div class="bg-white border border-stone-300 rounded-2xl p-3.5 sm:px-5 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <!-- Info de Sede Activa -->
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-stone-100 border border-stone-300 text-stone-800 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
              <path d="M2 7h20" />
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-sm text-stone-950">{{ activeStore.name }}</span>
              <span class="text-[11px] font-mono text-stone-600 bg-stone-100 border border-stone-300 px-1.5 py-0.2 rounded">
                {{ activeStore.code }}
              </span>
            </div>
            <p class="text-[11px] text-stone-500">{{ activeStore.address }} • {{ activeStore.city }}</p>
          </div>
          <button 
            type="button"
            @click="openStoreSelector"
            class="ml-1 text-xs font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-300 px-2.5 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
            title="Cambiar de sede"
          >
            <!-- SVG: Swap Horiz -->
            <svg class="w-3.5 h-3.5 text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/>
            </svg>
            <span>Cambiar</span>
          </button>
        </div>

        <!-- Conmutador de Modo (Segmented Control Minimalista) -->
        <div class="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-300 w-full sm:w-auto">
          <button 
            type="button"
            @click="switchMode('purchase')" 
            class="flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
            :class="mode === 'purchase' 
              ? 'bg-stone-900 text-white shadow-sm' 
              : 'text-stone-600 hover:text-stone-900'"
          >
            <!-- SVG: Receipt -->
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/>
              <path d="M14 8H8"/><path d="M16 12H8"/><path d="M13 16H8"/>
            </svg>
            <span>Registrar Compra</span>
          </button>

          <button 
            type="button"
            @click="switchMode('redemption')" 
            class="flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
            :class="mode === 'redemption' 
              ? 'bg-stone-900 text-white shadow-sm' 
              : 'text-stone-600 hover:text-stone-900'"
          >
            <!-- SVG: Gift / Redeem -->
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
              <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>
            </svg>
            <span>Canjear Premio</span>
          </button>
        </div>
      </div>

      <!-- =================================================================== -->
      <!-- MODO 1: REGISTRAR COMPRA Y ACUMULAR SELLOS                          -->
      <!-- =================================================================== -->
      <div v-if="mode === 'purchase'" class="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        <!-- COLUMNA IZQUIERDA: PASO 1 - ESCÁNER QR (5 Columnas) -->
        <div class="lg:col-span-5 bg-white rounded-2xl border border-stone-300 shadow-sm flex flex-col justify-between fluid-pad space-y-4">
          <div class="space-y-4">
            <div class="flex items-center justify-between border-b border-stone-200 pb-3">
              <div class="flex items-center gap-2">
                <span class="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] font-mono font-bold flex items-center justify-center">1</span>
                <h2 class="font-bold text-sm text-stone-950">Identificación QR</h2>
              </div>
              
              <span 
                class="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full border flex items-center gap-1.5" 
                :class="isCameraActive 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                  : 'bg-stone-100 text-stone-600 border-stone-300'"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="isCameraActive ? 'bg-emerald-600 animate-pulse' : 'bg-stone-400'"></span>
                {{ isCameraActive ? 'Escáner activo' : 'En espera' }}
              </span>
            </div>

            <!-- Visor de Video con Aspect Ratio fijo (Previene CLS) -->
            <div class="aspect-4/3 bg-stone-950 rounded-xl relative overflow-hidden flex flex-col items-center justify-center text-center border border-stone-800">
              <video 
                ref="videoRef" 
                class="w-full h-full object-cover" 
                :class="{ 'hidden': !isCameraActive }"
                autoplay 
                muted 
                playsinline
              ></video>

              <!-- Retícula Minimalista cuando la cámara está activa -->
              <div v-if="isCameraActive" class="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                <div class="w-44 h-44 border border-emerald-400/90 rounded-xl relative">
                  <div class="absolute inset-x-0 h-0.5 bg-emerald-400 animate-pulse top-1/2"></div>
                </div>
                <span class="text-[11px] text-white font-medium bg-stone-900/80 px-2.5 py-1 rounded-md mt-3 border border-stone-700">
                  Alinea el código QR en el recuadro
                </span>
              </div>

              <!-- Estado de Cámara Inactiva -->
              <div v-if="!isCameraActive" class="p-6 space-y-3.5 flex flex-col items-center justify-center text-center">
                <div class="w-12 h-12 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 flex items-center justify-center">
                  <!-- SVG: QR Code Scanner -->
                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
                    <rect width="7" height="7" x="7" y="7" rx="1"/><path d="M7 17h.01"/><path d="M17 7h.01"/><path d="M17 17h.01"/>
                  </svg>
                </div>
                <div class="space-y-1 max-w-[230px]">
                  <p class="text-xs font-semibold text-white">Lector Óptico Web</p>
                  <p class="text-[11px] text-stone-400 leading-relaxed">
                    Activa la cámara para leer el token QR temporal del cliente.
                  </p>
                </div>

                <button 
                  type="button"
                  @click="startCamera" 
                  class="bg-white hover:bg-stone-100 text-stone-950 font-semibold text-xs px-4 py-2 rounded-lg border border-stone-300 transition flex items-center gap-2 cursor-pointer"
                >
                  <!-- SVG: Videocam -->
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>
                  </svg>
                  <span>Activar cámara</span>
                </button>
              </div>
            </div>

            <!-- Barra de Control cuando la cámara está activa -->
            <div v-if="isCameraActive" class="flex items-center justify-between text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-300">
              <span class="text-stone-700 font-medium text-[11px]">Capturando señal de video...</span>
              <button 
                type="button"
                @click="stopCamera"
                class="text-xs font-semibold text-red-700 bg-white hover:bg-red-50 border border-red-300 px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect width="18" height="18" x="3" y="3" rx="2"/>
                </svg>
                <span>Detener</span>
              </button>
            </div>

            <!-- Mensajes de Estado de Cámara -->
            <div v-if="cameraError" class="p-3 bg-red-50 border border-red-300 rounded-xl text-red-900 text-xs flex items-start gap-2">
              <svg class="w-4 h-4 text-red-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
              </svg>
              <span>{{ cameraError }}</span>
            </div>

            <div v-if="lastScannedSuccess" class="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-medium flex items-center gap-2">
              <svg class="w-4 h-4 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
              <span>Código QR capturado correctamente.</span>
            </div>
          </div>

          <!-- Entrada Manual o Simulación -->
          <div class="space-y-2 pt-3 border-t border-stone-200">
            <div class="flex items-center justify-between gap-2">
              <label for="pos-qr-token" class="text-xs font-semibold text-stone-800">
                Token de cliente
              </label>
              <button 
                type="button"
                @click="simulateScan"
                :disabled="simulating"
                class="text-[11px] font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
              >
                <!-- SVG: Bolt -->
                <svg class="w-3 h-3 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
                </svg>
                <span>Cargar QR Demo</span>
              </button>
            </div>

            <input 
              id="pos-qr-token"
              v-model="tokenInput"
              type="text"
              placeholder="cfy_purchase_..."
              class="w-full text-xs font-mono bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-stone-900 focus:outline-none transition"
            />
          </div>
        </div>

        <!-- COLUMNA DERECHA: PASO 2 - FACTURA POS (7 Columnas) -->
        <div class="lg:col-span-7 bg-white rounded-2xl border border-stone-300 shadow-sm flex flex-col justify-between fluid-pad space-y-5">
          <div class="space-y-5">
            <div class="flex items-center justify-between border-b border-stone-200 pb-3">
              <div class="flex items-center gap-2">
                <span class="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] font-mono font-bold flex items-center justify-center">2</span>
                <h2 class="font-bold text-sm text-stone-950">Detalle de Factura POS</h2>
              </div>
              <span class="text-[11px] text-stone-500 font-medium">
                Regla: $10.000 COP = 1 sello (máx. 3)
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Campo 1: N° Factura -->
              <div class="space-y-1.5">
                <label for="pos-invoice-ref" class="text-xs font-semibold text-stone-800 block">
                  Consecutivo de factura *
                </label>
                <input 
                  id="pos-invoice-ref"
                  v-model="invoiceRef"
                  type="text" 
                  placeholder="FAC-2026-00124"
                  class="w-full text-sm font-mono bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-950 placeholder:text-stone-400 focus:bg-white focus:border-stone-900 focus:outline-none transition"
                />
              </div>

              <!-- Campo 2: Importe Total -->
              <div class="space-y-1.5">
                <label for="pos-gross-amount" class="text-xs font-semibold text-stone-800 block">
                  Importe bruto (COP) *
                </label>
                <input 
                  id="pos-gross-amount"
                  v-model.number="grossAmount"
                  type="number" 
                  placeholder="30000"
                  class="w-full text-sm font-mono bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-950 placeholder:text-stone-400 focus:bg-white focus:border-stone-900 focus:outline-none transition"
                />
              </div>

              <!-- Campo 3: Descuentos -->
              <div class="space-y-1.5">
                <label for="pos-discount-amount" class="text-xs font-semibold text-stone-800 block">
                  Descuentos (COP)
                </label>
                <input 
                  id="pos-discount-amount"
                  v-model.number="discountAmount"
                  type="number" 
                  placeholder="0"
                  class="w-full text-sm font-mono bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-950 placeholder:text-stone-400 focus:bg-white focus:border-stone-900 focus:outline-none transition"
                />
              </div>

              <!-- Campo 4: Valor Neto Calculado -->
              <div class="space-y-1.5">
                <span class="text-xs font-semibold text-stone-800 block">
                  Base neta elegible
                </span>
                <div class="w-full text-sm font-mono font-bold bg-stone-100 text-stone-900 rounded-xl px-3.5 py-2.5 border border-stone-300 flex items-center justify-between">
                  <span>${{ (eligibleAmount || 0).toLocaleString('es-CO') }}</span>
                  <span class="text-[11px] font-sans font-medium text-stone-500">COP</span>
                </div>
              </div>
            </div>

            <!-- Resumen Minimalista de Sellos a Otorgar -->
            <div class="bg-stone-50 rounded-xl p-4 border border-stone-300 flex items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-white border border-stone-300 text-stone-900 flex items-center justify-center shrink-0">
                  <!-- SVG: Loyalty / Award -->
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
                  </svg>
                </div>
                <div>
                  <span class="text-sm font-bold text-stone-950 block">
                    Acreditación: +{{ calculatedStamps }} {{ calculatedStamps === 1 ? 'sello' : 'sellos' }}
                  </span>
                  <p class="text-[11px] text-stone-500">
                    {{ eligibleAmount < 10000 ? 'Importe mínimo requerido: $10.000 COP' : 'Cumple el monto mínimo para acumular' }}
                  </p>
                </div>
              </div>

              <span class="text-xl font-black font-mono px-3 py-1 rounded-lg border" :class="calculatedStamps > 0 ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-stone-100 text-stone-500 border-stone-300'">
                +{{ calculatedStamps }}
              </span>
            </div>
          </div>

          <!-- Pie de Formulario: Checklist + Botón de Envío -->
          <div class="space-y-4 pt-2 border-t border-stone-200">
            <!-- Indicadores de Estado Compactos -->
            <div class="flex flex-wrap items-center gap-2 text-[11px]">
              <span 
                class="px-2.5 py-1 rounded-md border font-medium flex items-center gap-1.5"
                :class="tokenInput ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-stone-50 border-stone-300 text-stone-500'"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path v-if="tokenInput" d="M20 6 9 17l-5-5"/>
                  <circle v-else cx="12" cy="12" r="9"/>
                </svg>
                <span>Token QR</span>
              </span>

              <span 
                class="px-2.5 py-1 rounded-md border font-medium flex items-center gap-1.5"
                :class="invoiceRef ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-stone-50 border-stone-300 text-stone-500'"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path v-if="invoiceRef" d="M20 6 9 17l-5-5"/>
                  <circle v-else cx="12" cy="12" r="9"/>
                </svg>
                <span>Consecutivo</span>
              </span>

              <span 
                class="px-2.5 py-1 rounded-md border font-medium flex items-center gap-1.5"
                :class="eligibleAmount > 0 ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-stone-50 border-stone-300 text-stone-500'"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path v-if="eligibleAmount > 0" d="M20 6 9 17l-5-5"/>
                  <circle v-else cx="12" cy="12" r="9"/>
                </svg>
                <span>Importe válido</span>
              </span>
            </div>

            <!-- Botón de Envío -->
            <button 
              type="button"
              @click="submitPurchase"
              :disabled="isSubmitting || !tokenInput || !invoiceRef || eligibleAmount <= 0"
              class="w-full font-bold text-xs sm:text-sm py-3.5 px-5 rounded-xl border transition flex items-center justify-center gap-2 cursor-pointer"
              :class="(!tokenInput || !invoiceRef || eligibleAmount <= 0)
                ? 'bg-stone-100 text-stone-500 border-stone-300 cursor-not-allowed' 
                : 'bg-stone-900 hover:bg-stone-800 text-white border-stone-900 shadow-sm'"
            >
              <span v-if="isSubmitting">Procesando transacción...</span>
              <span v-else-if="!tokenInput || !invoiceRef || eligibleAmount <= 0">
                Completa los campos requeridos para registrar
              </span>
              <template v-else>
                <span>Confirmar venta y acreditar +{{ calculatedStamps }} {{ calculatedStamps === 1 ? 'sello' : 'sellos' }}</span>
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </template>
            </button>

            <!-- Alertas de Resultado -->
            <div v-if="errorMessage" class="p-3.5 bg-red-50 border border-red-300 rounded-xl text-red-900 text-xs font-medium flex items-center gap-2">
              <svg class="w-4 h-4 text-red-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/>
              </svg>
              <span>{{ errorMessage }}</span>
            </div>

            <div v-if="successPurchase" class="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 text-xs space-y-1.5">
              <div class="flex items-center justify-between font-bold">
                <span class="flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                  <span>Transacción confirmada</span>
                </span>
                <span class="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-emerald-300">
                  {{ successPurchase.receipt_reference }}
                </span>
              </div>
              <p class="text-stone-700">Cliente: <strong>{{ successPurchase.customer_name }}</strong> • Sellos: <strong>+{{ successPurchase.stamps_awarded }}</strong></p>
              <div v-if="successPurchase.rewards_issued.length > 0" class="p-2.5 bg-amber-100/80 rounded-lg text-amber-950 font-semibold border border-amber-300 mt-1">
                Ciclo completado (8/8). Recompensa emitida: {{ successPurchase.rewards_issued[0].name }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- =================================================================== -->
      <!-- MODO 2: CANJEAR RECOMPENSA DE CORTESÍA                              -->
      <!-- =================================================================== -->
      <div v-else class="max-w-xl mx-auto bg-white rounded-2xl border border-stone-300 shadow-sm fluid-pad space-y-5">
        <div class="flex items-center justify-between border-b border-stone-200 pb-3">
          <div class="space-y-0.5">
            <h2 class="font-bold text-base text-stone-950">Redención de Recompensa</h2>
            <p class="text-xs text-stone-500">Escanea o ingresa el token de canje generado por el cliente.</p>
          </div>
          <span class="text-xs font-mono font-semibold text-stone-700 bg-stone-100 border border-stone-300 px-2.5 py-1 rounded-lg">
            {{ activeStore.code }}
          </span>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <label for="pos-redeem-token" class="text-xs font-semibold text-stone-800">Token QR de redención</label>
            <button 
              v-if="!isCameraActive"
              type="button"
              @click="startCamera" 
              class="text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>
              </svg>
              <span>Usar cámara</span>
            </button>
            <button 
              v-else
              type="button"
              @click="stopCamera" 
              class="text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-300 px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect width="18" height="18" x="3" y="3" rx="2"/>
              </svg>
              <span>Detener cámara</span>
            </button>
          </div>

          <div v-if="isCameraActive" class="aspect-video bg-stone-950 rounded-xl overflow-hidden relative border border-stone-800">
            <video ref="videoRef" class="w-full h-full object-cover" autoplay muted playsinline></video>
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="w-36 h-36 border border-amber-400 rounded-xl"></div>
            </div>
          </div>

          <input 
            id="pos-redeem-token"
            v-model="tokenInput"
            type="text"
            placeholder="cfy_redemption_..."
            class="w-full text-xs font-mono bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-3 text-stone-950 placeholder:text-stone-400 focus:bg-white focus:border-stone-900 focus:outline-none transition"
          />
        </div>

        <button 
          type="button"
          @click="submitRedemption"
          :disabled="isSubmitting || !tokenInput"
          class="w-full font-bold text-xs sm:text-sm py-3.5 px-5 rounded-xl border transition flex items-center justify-center gap-2 cursor-pointer"
          :class="!tokenInput 
            ? 'bg-stone-100 text-stone-500 border-stone-300 cursor-not-allowed' 
            : 'bg-stone-900 hover:bg-stone-800 text-white border-stone-900 shadow-sm'"
        >
          <span v-if="isSubmitting">Validando canje...</span>
          <span v-else>Confirmar entrega de recompensa</span>
        </button>

        <div v-if="errorMessage" class="p-3.5 bg-red-50 border border-red-300 rounded-xl text-red-900 text-xs font-medium flex items-center gap-2">
          <svg class="w-4 h-4 text-red-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/>
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <div v-if="successRedemption" class="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 text-xs space-y-1">
          <span class="font-bold block">Recompensa canjeada correctamente</span>
          <p class="text-stone-700">Producto: <strong>{{ successRedemption.reward_name }}</strong> • Cliente: <strong>{{ successRedemption.customer_name }}</strong></p>
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

const mode = ref<'purchase' | 'redemption'>('purchase');
const stores = ref<StoreItem[]>([]);
const activeStore = ref<StoreItem | null>(null);
const pendingStoreSelection = ref<StoreItem | null>(null);
const isSelectingStore = ref(false);

const tokenInput = ref('');
const invoiceRef = ref('');
const grossAmount = ref<number | null>(null);
const discountAmount = ref<number | null>(null);

const isSubmitting = ref(false);
const simulating = ref(false);
const errorMessage = ref('');
const successPurchase = ref<PurchaseResponse | null>(null);
const successRedemption = ref<RedemptionResponse | null>(null);

const isCameraActive = ref(false);
const cameraError = ref('');
const lastScannedSuccess = ref(false);
const videoRef = ref<HTMLVideoElement | null>(null);
let codeReader: BrowserQRCodeReader | null = null;

const playBeep = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      const audioCtx = new AudioContextClass();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    }
  } catch {
    // Ignore audio restriction
  }
};

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
      cameraError.value = 'Elemento de video no disponible.';
      isCameraActive.value = false;
      return;
    }

    const videoInputDevices = await codeReader.listVideoInputDevices();
    if (!videoInputDevices || videoInputDevices.length === 0) {
      cameraError.value = 'No se detectó cámara conectada en este dispositivo.';
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
            setTimeout(() => { lastScannedSuccess.value = false; }, 3500);
          }
        }
        if (err && !(err.name === 'NotFoundException')) {
          // Ignore non-QR frames
        }
      }
    );
  } catch (err: any) {
    console.error('Error al iniciar cámara:', err);
    cameraError.value = 'Permiso de cámara denegado o dispositivo ocupado.';
    isCameraActive.value = false;
  }
};

const stopCamera = () => {
  if (codeReader) {
    codeReader.reset();
  }
  isCameraActive.value = false;
};

const switchMode = (newMode: 'purchase' | 'redemption') => {
  mode.value = newMode;
  errorMessage.value = '';
  successPurchase.value = null;
  successRedemption.value = null;
  tokenInput.value = '';
  stopCamera();
};

const eligibleAmount = computed(() => {
  const gross = grossAmount.value || 0;
  const discount = discountAmount.value || 0;
  return Math.max(0, gross - discount);
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

      const savedStoreId = localStorage.getItem(LOCAL_STORAGE_STORE_KEY);
      if (savedStoreId) {
        const found = list.find(s => s.id === savedStoreId);
        if (found) {
          activeStore.value = found;
          pendingStoreSelection.value = found;
          return;
        }
      }
      pendingStoreSelection.value = list[0];
      isSelectingStore.value = true;
    }
  } catch (err) {
    console.error('Error cargando sedes:', err);
  }
};

const selectAndOpenStore = (store: StoreItem) => {
  pendingStoreSelection.value = store;
  activeStore.value = store;
  localStorage.setItem(LOCAL_STORAGE_STORE_KEY, store.id);
  isSelectingStore.value = false;
};

const openStoreSelector = () => {
  pendingStoreSelection.value = activeStore.value;
  isSelectingStore.value = true;
  stopCamera();
};

const simulateScan = async () => {
  simulating.value = true;
  errorMessage.value = '';
  try {
    const res = await adminApi.generateDemoPurchaseQr();
    tokenInput.value = res.qr_token;
    playBeep();
    lastScannedSuccess.value = true;
    setTimeout(() => { lastScannedSuccess.value = false; }, 3500);
  } catch {
    errorMessage.value = 'Error al generar token de prueba';
  } finally {
    simulating.value = false;
  }
};

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
    stopCamera();
  } catch (err: any) {
    errorMessage.value = err.message || 'Error procesando compra';
  } finally {
    isSubmitting.value = false;
  }
};

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
    stopCamera();
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
