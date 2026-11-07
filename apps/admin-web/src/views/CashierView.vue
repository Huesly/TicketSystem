<template>
  <div class="space-y-6">
    <!-- ======================================================================= -->
    <!-- PANTALLA 1: ASIGNACIÓN DE SEDE Y APERTURA DE TURNO POS                  -->
    <!-- ======================================================================= -->
    <div v-if="!activeStore || isSelectingStore" class="max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-98 duration-200">
      <!-- Encabezado con Paso y Guía Clara -->
      <div class="bg-gradient-to-r from-coffee-900 to-coffee-800 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden space-y-3">
        <div class="relative z-10 flex items-center justify-between">
          <div class="space-y-1">
            <div class="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <span>📍</span> Paso 1 de 2: Punto de Venta
            </div>
            <h2 class="text-2xl sm:text-3xl font-black tracking-tight">Apertura de Terminal y Asignación de Sede</h2>
            <p class="text-xs sm:text-sm text-amber-100/80 max-w-xl">
              Selecciona el establecimiento físico en el que estás operando esta caja registradora.
            </p>
          </div>
          <div class="text-5xl opacity-20 hidden md:block">🏪</div>
        </div>

        <!-- Nota de Ayuda Dinámica -->
        <div class="relative z-10 bg-black/30 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 flex items-start gap-2.5 text-xs text-amber-200/90">
          <span class="text-base shrink-0">💡</span>
          <p class="leading-relaxed">
            <strong>¿Por qué es necesario este paso?</strong> Todas las transacciones, sellos emitidos y canjes de premios quedan auditados y vinculados a la sede seleccionada. Puedes cambiar de sede en cualquier momento con un solo clic.
          </p>
        </div>
      </div>

      <!-- Tarjeta Informativa del Operador y Turno Futuro -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-coffee-900 text-amber-100 font-bold text-sm flex items-center justify-center shrink-0 shadow-inner">
            JP
          </div>
          <div>
            <span class="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Cajero en Turno</span>
            <h4 class="font-extrabold text-xs text-stone-900">Juan Pérez</h4>
            <span class="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">Sesión Activa</span>
          </div>
        </div>

        <div class="md:col-span-2 bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
          <span class="text-lg shrink-0">🕒</span>
          <div class="space-y-0.5">
            <span class="font-extrabold text-[11px] uppercase tracking-wide text-amber-950">Próxima Fase: Turnos Automáticos</span>
            <p class="text-[11px] text-amber-800/90 leading-relaxed">
              En la siguiente integración, la terminal detectará automáticamente tu sede según el cuadrante laboral programado en la app de gestión de personal.
            </p>
          </div>
        </div>
      </div>

      <!-- Grid de Sedes Físicas con Acción Directa en Cada Tarjeta -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-xs uppercase tracking-wider text-stone-500">
            Haz clic en la sede para iniciar tu turno inmediatamente:
          </h3>
          <span class="text-xs font-semibold text-stone-400">{{ stores.length }} sedes disponibles</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            v-for="store in stores" 
            :key="store.id"
            @click="selectAndOpenStore(store)"
            class="group bg-white rounded-3xl p-5 border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 shadow-sm hover:shadow-lg relative overflow-hidden"
            :class="pendingStoreSelection?.id === store.id ? 'border-emerald-600 bg-emerald-50/20 ring-4 ring-emerald-500/20 scale-[1.01]' : 'border-stone-200 hover:border-coffee-900'"
          >
            <!-- Header de Tarjeta -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 group-hover:bg-coffee-900 group-hover:text-white transition">
                  {{ store.code }}
                </span>
                <span class="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Operativa
                </span>
              </div>

              <div>
                <h4 class="font-black text-stone-900 text-base group-hover:text-coffee-900 transition">{{ store.name }}</h4>
                <p class="text-xs text-stone-500 mt-0.5">{{ store.address || 'Sede comercial principal' }}</p>
                <p class="text-[11px] font-bold text-amber-800 mt-1">📍 {{ store.city }}, Santander</p>
              </div>
            </div>

            <!-- Botón de Entrada Inmediata dentro de la Tarjeta -->
            <button 
              type="button"
              @click.stop="selectAndOpenStore(store)"
              class="w-full font-extrabold text-xs py-3 px-4 rounded-2xl shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
              :class="pendingStoreSelection?.id === store.id 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-400' 
                : 'bg-stone-900 hover:bg-coffee-900 text-white group-hover:bg-coffee-900'"
            >
              <span>Abrir Caja en {{ store.name }}</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Botón Cancelar si ya tenía sede activa -->
      <div v-if="activeStore" class="flex justify-center pt-2">
        <button 
          @click="isSelectingStore = false"
          class="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 transition cursor-pointer flex items-center gap-2"
        >
          <span>✕</span> Cancelar y mantener turno en {{ activeStore.name }}
        </button>
      </div>
    </div>

    <!-- ======================================================================= -->
    <!-- PANTALLA 2: TERMINAL POS PRINCIPAL (Turno Abierto)                     -->
    <!-- ======================================================================= -->
    <template v-else>
      <!-- Barra Superior de Sede Activa con Botón de Cambio Rápido -->
      <div class="bg-white border border-stone-200/90 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3.5">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-coffee-900 to-coffee-800 text-amber-200 flex items-center justify-center text-2xl shrink-0 shadow-inner">
            ☕
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Turno de Caja Activo
              </span>
            </div>
            <h3 class="font-black text-base sm:text-lg text-stone-900 flex items-center gap-2 mt-0.5">
              <span>{{ activeStore.name }}</span>
              <span class="text-xs font-mono font-bold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-lg border border-stone-200">
                {{ activeStore.code }} • {{ activeStore.city }}
              </span>
            </h3>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="text-right hidden sm:block">
            <span class="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Cajero Asignado</span>
            <span class="text-xs font-extrabold text-stone-800 font-mono">Juan Pérez</span>
          </div>

          <button 
            @click="openStoreSelector"
            class="text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 px-3.5 py-2.5 rounded-2xl transition flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
            title="Cambiar a otra sede física si rotaste de puesto"
          >
            <span>🔄</span>
            <span>Cambiar Sede</span>
          </button>
        </div>
      </div>

      <!-- Selector de Modo con Pestañas Muy Claras e Iconos -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-100/80 p-2 rounded-2xl border border-stone-200/60">
        <div class="px-3 py-1">
          <h2 class="text-sm font-black text-stone-900">Operación de Mostrador</h2>
          <p class="text-[11px] text-stone-500">Selecciona el tipo de transacción que vas a realizar:</p>
        </div>

        <div class="flex items-center gap-2">
          <button 
            @click="switchMode('purchase')" 
            class="flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            :class="mode === 'purchase' 
              ? 'bg-coffee-900 text-white shadow-md' 
              : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200/80'"
          >
            <span>💳</span>
            <span>Registrar Compra (Sellos)</span>
          </button>

          <button 
            @click="switchMode('redemption')" 
            class="flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            :class="mode === 'redemption' 
              ? 'bg-amber-700 text-white shadow-md' 
              : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200/80'"
          >
            <span>🎁</span>
            <span>Canjear Premio (Cortesía)</span>
          </button>
        </div>
      </div>

      <!-- =================================================================== -->
      <!-- MODO 1: REGISTRAR COMPRA Y ACUMULAR SELLOS                          -->
      <!-- =================================================================== -->
      <div v-if="mode === 'purchase'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- COLUMNA IZQUIERDA: LECTOR QR (5 Columnas) -->
        <div class="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <span class="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">Paso 1</span>
              <h3 class="font-extrabold text-sm text-stone-900 mt-1">Identificar Cliente</h3>
            </div>
            
            <span class="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5" :class="isCameraActive ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-stone-100 text-stone-500'">
              <span class="w-2 h-2 rounded-full" :class="isCameraActive ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'"></span>
              {{ isCameraActive ? 'Cámara Activa' : 'Cámara Apagada' }}
            </span>
          </div>

          <!-- Visor de Video / Escáner Óptico -->
          <div class="aspect-4/3 bg-stone-950 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center text-center shadow-inner border border-stone-800">
            <!-- Video en vivo para ZXing -->
            <video 
              ref="videoRef" 
              class="w-full h-full object-cover" 
              :class="{ 'hidden': !isCameraActive }"
              autoplay 
              muted 
              playsinline
            ></video>

            <!-- Guía de Escaneo en Vivo -->
            <div v-if="isCameraActive" class="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
              <div class="w-48 h-48 border-2 border-emerald-400 rounded-2xl relative shadow-[0_0_20px_rgba(52,211,153,0.35)]">
                <div class="absolute inset-x-0 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-bounce"></div>
                <div class="absolute -top-1 -left-1 w-4 h-4 border-t-3 border-l-3 border-emerald-400"></div>
                <div class="absolute -top-1 -right-1 w-4 h-4 border-t-3 border-r-3 border-emerald-400"></div>
                <div class="absolute -bottom-1 -left-1 w-4 h-4 border-b-3 border-l-3 border-emerald-400"></div>
                <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b-3 border-r-3 border-emerald-400"></div>
              </div>
              <span class="text-[10px] text-white font-bold bg-black/70 px-3 py-1 rounded-full mt-3 backdrop-blur-xs">
                Apunta al QR del cliente
              </span>
            </div>

            <!-- Estado de Cámara Inactiva: Botón Muy Prominente -->
            <div v-if="!isCameraActive" class="p-6 space-y-3 flex flex-col items-center justify-center text-center">
              <div class="w-16 h-16 rounded-2xl bg-stone-900 border border-stone-800 text-white flex items-center justify-center text-3xl shadow-inner">
                📷
              </div>
              <div class="space-y-1 max-w-[240px]">
                <p class="text-xs font-black text-stone-200">Escáner Óptico de Cámara</p>
                <p class="text-[11px] text-stone-400 leading-snug">
                  Activa la cámara web para leer el código QR que el cliente tiene en su móvil.
                </p>
              </div>

              <button 
                type="button"
                @click="startCamera" 
                class="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-5 py-3 rounded-xl shadow-lg shadow-emerald-950/40 transition flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>🎥</span>
                <span>Encender Cámara Web</span>
              </button>
            </div>
          </div>

          <!-- Controles de Cámara Activa -->
          <div v-if="isCameraActive" class="flex items-center justify-between text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-200">
            <span class="text-stone-600 font-semibold text-[11px] flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Buscando código QR en pantalla...
            </span>
            <button 
              type="button"
              @click="stopCamera"
              class="text-xs font-bold text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              🛑 Apagar Cámara
            </button>
          </div>

          <!-- Alerta de Error de Cámara -->
          <div v-if="cameraError" class="p-3 bg-red-50 border border-red-200 rounded-xl text-red-900 text-xs font-semibold space-y-1">
            <p>⚠️ <strong>Fallo de Cámara:</strong> {{ cameraError }}</p>
            <p class="text-[11px] text-red-700">Puedes usar la opción alternativa de simulación rápida o pegar el token manual.</p>
          </div>

          <!-- Feedback de Éxito al Escanear -->
          <div v-if="lastScannedSuccess" class="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <span class="text-xl">✅</span>
            <div>
              <p>¡Código QR leído con éxito!</p>
              <p class="text-[10px] text-emerald-800 font-normal">Token registrado en la terminal.</p>
            </div>
          </div>

          <!-- Alternativa Rápida: Simulación o Token Manual -->
          <div class="space-y-2 pt-2 border-t border-stone-100">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-stone-700 flex items-center gap-1">
                <span>Token QR del Cliente:</span>
              </label>
              <button 
                type="button"
                @click="simulateScan"
                :disabled="simulating"
                class="text-[11px] font-extrabold text-amber-950 bg-amber-200 hover:bg-amber-300 px-2.5 py-1 rounded-lg transition cursor-pointer shadow-xs active:scale-95 flex items-center gap-1"
                title="Genera y carga un token temporal de prueba del cliente demo"
              >
                <span>⚡ Simular Escaneo Demo</span>
              </button>
            </div>

            <textarea 
              v-model="tokenInput"
              rows="2"
              placeholder="El token aparecerá automáticamente al escanear con la cámara, o haz clic en 'Simular Escaneo Demo'..."
              class="w-full text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            ></textarea>

            <p class="text-[10px] text-stone-400">
              💡 <strong>Nota de ayuda:</strong> Cada token dura solo 60 segundos por seguridad antifraude.
            </p>
          </div>
        </div>

        <!-- COLUMNA DERECHA: FORMULARIO DE FACTURA POS (7 Columnas) -->
        <div class="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-5">
          <div class="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div>
              <span class="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">Paso 2</span>
              <h3 class="font-extrabold text-sm text-stone-900 mt-1">Registrar Datos de Factura POS</h3>
            </div>
            <span class="text-[11px] text-stone-400 font-medium">Campos obligatorios (*)</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- N° Factura -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-stone-700 flex items-center justify-between">
                <span>Número de Factura POS *</span>
                <span class="text-[10px] text-stone-400 font-normal">Ticket físico</span>
              </label>
              <input 
                v-model="invoiceRef"
                type="text" 
                placeholder="Ej: FAC-2026-00124"
                class="w-full text-xs font-mono font-semibold bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <p class="text-[10px] text-stone-400">Consecutivo impreso por tu software POS.</p>
            </div>

            <!-- Importe Total -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-stone-700 flex items-center justify-between">
                <span>Total Facturado (COP) *</span>
                <span class="text-[10px] text-amber-800 font-bold">$10.000 / sello</span>
              </label>
              <input 
                v-model.number="grossAmount"
                type="number" 
                placeholder="0 (Total factura)"
                class="w-full text-xs font-mono font-bold bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-stone-900"
              />
              <p class="text-[10px] text-stone-400">Monto total pagado por el cliente.</p>
            </div>

            <!-- Descuentos -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-stone-700 flex items-center justify-between">
                <span>Descuentos Comerciales (COP)</span>
                <span class="text-[10px] text-stone-400 font-normal">Opcional</span>
              </label>
              <input 
                v-model.number="discountAmount"
                type="number" 
                placeholder="0 (Si aplica)"
                class="w-full text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <p class="text-[10px] text-stone-400">Cupones o rebajas aplicadas.</p>
            </div>

            <!-- Valor Elegible Calculado -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-stone-700">Valor Elegible para Sellos</label>
              <div class="w-full text-xs font-mono font-black bg-stone-100 text-stone-900 rounded-xl px-3.5 py-2.5 border border-stone-200 flex items-center justify-between">
                <span>${{ (eligibleAmount || 0).toLocaleString('es-CO') }} COP</span>
                <span class="text-[10px] text-stone-500 font-normal">Base neta</span>
              </div>
              <p class="text-[10px] text-stone-400">Total facturado menos descuentos.</p>
            </div>
          </div>

          <!-- Caja de Cálculo Dinámico de Sellos -->
          <div class="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/80 space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-2xl">☕</span>
                <div>
                  <span class="text-base font-black font-mono text-coffee-900">+{{ calculatedStamps }} SELLOS GANADOS</span>
                  <p class="text-[10px] text-stone-500">Regla activa: 1 sello por cada $10.000 COP netos (Máx. 3)</p>
                </div>
              </div>

              <div class="text-right">
                <span v-if="eligibleAmount < 10000" class="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                  Monto mínimo: $10.000 COP
                </span>
                <span v-else class="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Válido para acumular
                </span>
              </div>
            </div>
          </div>

          <!-- Checklist de Validación Visual del Botón Principal -->
          <div class="bg-stone-50 rounded-2xl p-3 border border-stone-200 space-y-1.5 text-xs">
            <span class="font-extrabold text-[11px] text-stone-600 block">Requisitos para confirmar venta:</span>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <span class="flex items-center gap-1.5 font-medium" :class="tokenInput ? 'text-emerald-700 font-bold' : 'text-stone-400'">
                <span>{{ tokenInput ? '✅' : '⚪' }}</span> Token QR leído
              </span>
              <span class="flex items-center gap-1.5 font-medium" :class="invoiceRef ? 'text-emerald-700 font-bold' : 'text-stone-400'">
                <span>{{ invoiceRef ? '✅' : '⚪' }}</span> N° de factura
              </span>
              <span class="flex items-center gap-1.5 font-medium" :class="eligibleAmount > 0 ? 'text-emerald-700 font-bold' : 'text-stone-400'">
                <span>{{ eligibleAmount > 0 ? '✅' : '⚪' }}</span> Importe &gt; $0
              </span>
            </div>
          </div>

          <!-- Botón de Confirmación Principal (Muy Dinámico y Visible) -->
          <button 
            type="button"
            @click="submitPurchase"
            :disabled="isSubmitting || !tokenInput || !invoiceRef || eligibleAmount <= 0"
            class="w-full font-black text-sm py-4 rounded-2xl shadow-md transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            :class="(!tokenInput || !invoiceRef || eligibleAmount <= 0)
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300' 
              : 'bg-emerald-600 hover:bg-emerald-700 text-white ring-4 ring-emerald-500/20 shadow-emerald-950/20 animate-pulse'"
          >
            <span v-if="isSubmitting">Procesando Venta en Base de Datos...</span>
            <span v-else-if="!tokenInput || !invoiceRef || eligibleAmount <= 0">
              Completa los 3 requisitos arriba para registrar venta
            </span>
            <span v-else>
              ✅ Confirmar y Registrar Venta en Caja (+{{ calculatedStamps }} Sellos) →
            </span>
          </button>

          <!-- Mensajes de Error y Éxito -->
          <div v-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <span>❌</span> {{ errorMessage }}
          </div>

          <div v-if="successPurchase" class="p-5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 text-xs space-y-2 animate-in fade-in">
            <div class="flex items-center justify-between font-bold">
              <span class="text-emerald-800 text-sm">🎉 ¡Venta Confirmada Exitosamente!</span>
              <span class="font-mono text-[11px]">{{ successPurchase.purchase_id }}</span>
            </div>
            <p>Cliente acreditado: <strong>{{ successPurchase.customer_name }}</strong></p>
            <p>Sellos sumados: <strong>+{{ successPurchase.stamps_awarded }} sellos</strong></p>
            <div v-if="successPurchase.rewards_issued.length > 0" class="p-3 bg-amber-100 rounded-xl text-amber-950 font-bold border border-amber-300">
              🎁 ¡TARJETA COMPLETADA (8/8)! Se generó el premio: {{ successPurchase.rewards_issued[0].name }}
            </div>
          </div>
        </div>
      </div>

      <!-- =================================================================== -->
      <!-- MODO 2: CANJEAR RECOMPENSA DE CORTESÍA                              -->
      <!-- =================================================================== -->
      <div v-else class="max-w-2xl mx-auto bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-5 animate-in fade-in">
        <div class="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <span class="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">Canje de Cortesía</span>
            <h3 class="font-black text-base text-stone-900 mt-1">Entrega de Premio al Cliente</h3>
          </div>
          <span class="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            {{ activeStore.name }}
          </span>
        </div>

        <div class="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
          <p class="font-bold">💡 Instrucción para el Cajero:</p>
          <p class="text-[11px] text-amber-800">
            Pide al cliente abrir su pantalla de <strong>"Premios"</strong> en la web/móvil y presionar <strong>"Redimir en Caja"</strong> para generar su código QR de entrega.
          </p>
        </div>

        <!-- Cámara para Redención -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="text-xs font-bold text-stone-700">Token QR de Redención:</label>
            <button 
              v-if="!isCameraActive"
              type="button"
              @click="startCamera" 
              class="text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1"
            >
              <span>🎥</span> Encender Cámara
            </button>
            <button 
              v-else
              type="button"
              @click="stopCamera" 
              class="text-xs font-bold text-red-800 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1"
            >
              <span>🛑</span> Apagar Cámara
            </button>
          </div>

          <!-- Visor Cámara en Redención -->
          <div v-if="isCameraActive" class="aspect-video bg-black rounded-2xl overflow-hidden relative mb-2">
            <video ref="videoRef" class="w-full h-full object-cover" autoplay muted playsinline></video>
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="w-40 h-40 border-2 border-amber-400 rounded-2xl animate-pulse"></div>
            </div>
          </div>

          <textarea 
            v-model="tokenInput"
            rows="3"
            placeholder="Apunta la cámara al QR de redención o escribe el token aquí (cfy_redemption_...)"
            class="w-full text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          ></textarea>
        </div>

        <button 
          type="button"
          @click="submitRedemption"
          :disabled="isSubmitting || !tokenInput"
          class="w-full font-black text-sm py-4 rounded-2xl shadow-md transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
          :class="!tokenInput ? 'bg-stone-200 text-stone-400 cursor-not-allowed' : 'bg-amber-700 hover:bg-amber-800 text-white'"
        >
          <span v-if="isSubmitting">Validando Canje en Servidor...</span>
          <span v-else>🎁 Confirmar Entrega de Recompensa al Cliente</span>
        </button>

        <div v-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <span>❌</span> {{ errorMessage }}
        </div>

        <div v-if="successRedemption" class="p-5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 text-xs space-y-2 animate-in fade-in">
          <span class="font-black text-sm">🎉 ¡Premio Entregado con Éxito!</span>
          <p>Producto entregado: <strong>{{ successRedemption.reward_name }}</strong></p>
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

// Formulario de Factura (Comienza en Blanco con Placeholders)
const tokenInput = ref('');
const invoiceRef = ref('');
const grossAmount = ref<number | null>(null);
const discountAmount = ref<number | null>(null);

// Estados de Operación
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

// Audio Feedback Beep
const playBeep = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      const audioCtx = new AudioContextClass();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    }
  } catch {
    // Silently ignore if blocked
  }
};

// Iniciar Cámara Web
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

    const videoInputDevices = await codeReader.listVideoInputDevices();
    if (!videoInputDevices || videoInputDevices.length === 0) {
      cameraError.value = 'No se detectó ninguna cámara web conectada a este equipo.';
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
          // cuadros intermedios sin QR se ignoran
        }
      }
    );
  } catch (err: any) {
    console.error('Error al iniciar cámara:', err);
    cameraError.value = 'No se pudo acceder a la cámara. Por favor concede permisos de video en tu navegador.';
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

// Cambiar de Modo
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

// Acción directa: Seleccionar y Abrir Caja en 1 Clic
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

// Simulación Rápida de Escaneo
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
    errorMessage.value = 'Error al generar token demo';
  } finally {
    simulating.value = false;
  }
};

// Enviar Compra
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

// Enviar Redención
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
