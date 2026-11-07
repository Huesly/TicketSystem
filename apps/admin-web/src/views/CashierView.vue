<template>
  <div class="space-y-6">
    <!-- ======================================================================= -->
    <!-- PANTALLA 1: ASIGNACIÓN DE SEDE Y APERTURA DE TURNO POS                  -->
    <!-- ======================================================================= -->
    <div v-if="!activeStore || isSelectingStore" class="max-w-5xl mx-auto space-y-6">
      
      <!-- Banner Superior de Alto Contraste -->
      <div class="bg-stone-900 text-white p-6 sm:p-8 rounded-2xl border-2 border-stone-950 shadow-lg space-y-4">
        <div class="flex items-start justify-between gap-4">
          <div class="space-y-2">
            <span class="inline-flex items-center gap-1.5 bg-amber-500 text-stone-950 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border border-amber-400">
              📍 Paso 1 de 2: Punto de Venta
            </span>
            <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Apertura de Terminal y Asignación de Sede
            </h2>
            <p class="text-sm text-stone-300 font-medium max-w-2xl">
              Selecciona el establecimiento físico en el que estás operando esta caja registradora para habilitar la facturación y lectura de códigos QR.
            </p>
          </div>
          <div class="w-14 h-14 rounded-2xl bg-stone-800 border-2 border-stone-700 flex items-center justify-center text-3xl shrink-0 hidden sm:flex">
            🏪
          </div>
        </div>

        <!-- Nota de Ayuda Claramente Delimitada -->
        <div class="bg-stone-800 p-4 rounded-xl border-2 border-stone-600 flex items-start gap-3 text-xs text-stone-100">
          <span class="text-lg shrink-0">💡</span>
          <p class="leading-relaxed">
            <strong class="text-amber-400">¿Por qué es necesario este paso?</strong> Todas las ventas, sellos emitidos y canjes de recompensas quedan auditados y vinculados a la sede física seleccionada. Puedes cambiar de sede en cualquier momento desde la barra superior.
          </p>
        </div>
      </div>

      <!-- Fila Informativa: Cajero en Turno y Nota de Arquitectura Futura -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Tarjeta Operador -->
        <div class="bg-white p-4 rounded-2xl border-2 border-stone-400 shadow-sm flex items-center gap-3.5">
          <div class="w-12 h-12 rounded-xl bg-stone-900 text-amber-400 font-black text-base flex items-center justify-center shrink-0 border-2 border-stone-950">
            JP
          </div>
          <div>
            <span class="text-[11px] uppercase font-extrabold text-stone-500 tracking-wider block">Cajero en Turno</span>
            <h4 class="font-black text-sm text-stone-900">Juan Pérez</h4>
            <span class="text-[11px] text-emerald-900 font-extrabold bg-emerald-100 border border-emerald-400 px-2.5 py-0.5 rounded-md inline-block mt-1">
              ● Sesión Activa
            </span>
          </div>
        </div>

        <!-- Tarjeta Próxima Fase Turnos -->
        <div class="md:col-span-2 bg-amber-50 p-4 rounded-2xl border-2 border-amber-400 shadow-sm flex items-start gap-3 text-xs text-stone-900">
          <span class="text-xl shrink-0">🕒</span>
          <div class="space-y-1">
            <span class="font-black text-xs uppercase tracking-wide text-amber-950 block">
              Próxima Fase: Asignación Automática por Horario de Turnos
            </span>
            <p class="text-xs text-stone-700 font-medium leading-relaxed">
              En la siguiente integración, el sistema detectará y asignará automáticamente tu sede al iniciar sesión según el cuadrante laboral programado en la aplicación de turnos del personal.
            </p>
          </div>
        </div>
      </div>

      <!-- Contenedor Principal de Sedes Físicas -->
      <div class="bg-white p-6 rounded-2xl border-2 border-stone-400 shadow-md space-y-4">
        <div class="flex items-center justify-between border-b-2 border-stone-200 pb-3">
          <div>
            <h3 class="font-black text-sm uppercase tracking-wider text-stone-900">
              Selecciona tu Sede de Atención para Entrar a la Caja:
            </h3>
            <p class="text-xs text-stone-600 font-medium mt-0.5">
              Haz clic en cualquiera de las tarjetas inferiores para abrir inmediatamente la terminal POS.
            </p>
          </div>
          <span class="text-xs font-extrabold text-stone-800 bg-stone-200 border border-stone-400 px-3 py-1 rounded-lg">
            {{ stores.length }} sedes activas
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div 
            v-for="store in stores" 
            :key="store.id"
            @click="selectAndOpenStore(store)"
            class="group rounded-2xl p-5 border-2 transition-all duration-150 cursor-pointer flex flex-col justify-between space-y-5 shadow-sm hover:shadow-lg"
            :class="pendingStoreSelection?.id === store.id 
              ? 'bg-emerald-50/70 border-emerald-700 ring-2 ring-emerald-500/30' 
              : 'bg-stone-50 border-stone-400 hover:bg-white hover:border-stone-900'"
          >
            <!-- Datos de la Sede -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-mono font-black px-2.5 py-1 rounded-md bg-stone-900 text-white border border-stone-950">
                  {{ store.code }}
                </span>
                <span class="inline-flex items-center gap-1.5 text-xs font-extrabold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-400">
                  <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
                  Operativa
                </span>
              </div>

              <div class="pt-1">
                <h4 class="font-black text-stone-950 text-lg">{{ store.name }}</h4>
                <p class="text-xs text-stone-700 font-semibold mt-1">{{ store.address || 'Sede comercial principal' }}</p>
                <p class="text-xs font-extrabold text-amber-900 bg-amber-100 border border-amber-300 inline-block px-2.5 py-0.5 rounded-md mt-2">
                  📍 {{ store.city }}, Santander
                </p>
              </div>
            </div>

            <!-- Botón de Acción Claramente Visible -->
            <button 
              type="button"
              @click.stop="selectAndOpenStore(store)"
              class="w-full font-black text-xs py-3.5 px-4 rounded-xl border-2 shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
              :class="pendingStoreSelection?.id === store.id 
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-900' 
                : 'bg-stone-900 hover:bg-black text-white border-stone-950'"
            >
              <span>Abrir Caja en {{ store.name }}</span>
              <span class="text-base leading-none">→</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Botón Volver (solo si ya había una sede abierta antes) -->
      <div v-if="activeStore" class="flex justify-center">
        <button 
          type="button"
          @click="isSelectingStore = false"
          class="px-6 py-3 rounded-xl bg-white border-2 border-stone-500 text-stone-900 font-black text-xs hover:bg-stone-100 shadow-sm transition cursor-pointer flex items-center gap-2"
        >
          <span>✕</span>
          <span>Cancelar y mantener turno actual en {{ activeStore.name }}</span>
        </button>
      </div>
    </div>

    <!-- ======================================================================= -->
    <!-- PANTALLA 2: TERMINAL POS PRINCIPAL (Turno Abierto)                     -->
    <!-- ======================================================================= -->
    <template v-else>
      <!-- Barra Superior de Estado de Sede Activa -->
      <div class="bg-white border-2 border-stone-400 rounded-2xl p-4 sm:p-5 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-stone-900 border-2 border-stone-950 text-amber-400 flex items-center justify-center text-2xl shrink-0 shadow-sm">
            🏪
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 border border-emerald-400 px-2.5 py-0.5 rounded-md">
                <span class="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                Turno de Caja Activo
              </span>
              <span class="text-xs font-mono font-bold text-stone-700 bg-stone-200 border border-stone-400 px-2.5 py-0.5 rounded-md">
                {{ activeStore.code }} • {{ activeStore.city }}
              </span>
            </div>
            <h3 class="font-black text-lg text-stone-950 mt-1">
              {{ activeStore.name }} — <span class="text-sm font-bold text-stone-600">{{ activeStore.address }}</span>
            </h3>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button 
            type="button"
            @click="openStoreSelector"
            class="text-xs font-black bg-amber-100 hover:bg-amber-200 text-stone-950 border-2 border-amber-500 px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
          >
            <span>🔄</span>
            <span>Cambiar de Sede</span>
          </button>
        </div>
      </div>

      <!-- Barra de Selección de Operación (Pestañas con Bordes Fuertes) -->
      <div class="bg-white p-4 rounded-2xl border-2 border-stone-400 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-base font-black text-stone-950">Modo de Operación en Mostrador</h2>
          <p class="text-xs text-stone-600 font-medium">Elige si vas a registrar una venta para dar sellos o a entregar un premio gratuito:</p>
        </div>

        <div class="flex items-center gap-3">
          <button 
            type="button"
            @click="switchMode('purchase')" 
            class="flex-1 sm:flex-none px-5 py-3 text-xs font-black rounded-xl border-2 transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            :class="mode === 'purchase' 
              ? 'bg-stone-900 text-white border-stone-950 ring-2 ring-amber-500/40' 
              : 'bg-stone-100 text-stone-800 border-stone-400 hover:bg-stone-200'"
          >
            <span>💳</span>
            <span>1. Registrar Compra (Dar Sellos)</span>
          </button>

          <button 
            type="button"
            @click="switchMode('redemption')" 
            class="flex-1 sm:flex-none px-5 py-3 text-xs font-black rounded-xl border-2 transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            :class="mode === 'redemption' 
              ? 'bg-amber-600 text-white border-amber-800 ring-2 ring-amber-400/40' 
              : 'bg-stone-100 text-stone-800 border-stone-400 hover:bg-stone-200'"
          >
            <span>🎁</span>
            <span>2. Canjear Premio (Cortesía)</span>
          </button>
        </div>
      </div>

      <!-- =================================================================== -->
      <!-- MODO 1: REGISTRAR COMPRA Y ACUMULAR SELLOS                          -->
      <!-- =================================================================== -->
      <div v-if="mode === 'purchase'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- COLUMNA IZQUIERDA: PASO 1 - ESCÁNER QR (5 Columnas) -->
        <div class="lg:col-span-5 bg-white rounded-2xl border-2 border-stone-400 shadow-md overflow-hidden flex flex-col">
          <!-- Cabecera de Tarjeta -->
          <div class="bg-stone-100 border-b-2 border-stone-300 px-6 py-4 flex items-center justify-between">
            <div>
              <span class="text-[11px] uppercase font-black text-stone-900 bg-amber-300 border border-amber-500 px-2.5 py-0.5 rounded-md">
                Paso 1
              </span>
              <h3 class="font-black text-base text-stone-950 mt-1">Identificar Cliente (Código QR)</h3>
            </div>
            
            <span 
              class="text-xs font-mono font-extrabold px-3 py-1 rounded-lg border-2 flex items-center gap-1.5" 
              :class="isCameraActive 
                ? 'bg-emerald-100 text-emerald-900 border-emerald-500' 
                : 'bg-stone-200 text-stone-700 border-stone-400'"
            >
              <span class="w-2.5 h-2.5 rounded-full" :class="isCameraActive ? 'bg-emerald-600 animate-pulse' : 'bg-stone-500'"></span>
              {{ isCameraActive ? 'Cámara Activa' : 'Cámara Apagada' }}
            </span>
          </div>

          <!-- Cuerpo de la Tarjeta -->
          <div class="p-6 space-y-5 flex-1 flex flex-col justify-between">
            <!-- Visor de Video / Escáner Óptico -->
            <div class="aspect-4/3 bg-stone-900 rounded-xl relative overflow-hidden flex flex-col items-center justify-center text-center border-2 border-stone-800 shadow-inner">
              <video 
                ref="videoRef" 
                class="w-full h-full object-cover" 
                :class="{ 'hidden': !isCameraActive }"
                autoplay 
                muted 
                playsinline
              ></video>

              <!-- Mira Láser cuando la cámara está activa -->
              <div v-if="isCameraActive" class="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                <div class="w-48 h-48 border-2 border-emerald-400 rounded-xl relative">
                  <div class="absolute inset-x-0 h-1 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-bounce"></div>
                </div>
                <span class="text-xs text-white font-bold bg-black/80 px-3 py-1 rounded-lg mt-3 border border-stone-600">
                  Muestra el QR del cliente frente a la cámara
                </span>
              </div>

              <!-- Estado de Cámara Inactiva -->
              <div v-if="!isCameraActive" class="p-6 space-y-4 flex flex-col items-center justify-center text-center">
                <div class="w-16 h-16 rounded-2xl bg-stone-800 border-2 border-stone-600 text-white flex items-center justify-center text-3xl shadow-md">
                  📷
                </div>
                <div class="space-y-1 max-w-[260px]">
                  <p class="text-sm font-black text-white">Lector Óptico de Cámara Web</p>
                  <p class="text-xs text-stone-300 leading-relaxed">
                    Presiona el botón inferior para activar la cámara y escanear el QR del móvil del cliente.
                  </p>
                </div>

                <button 
                  type="button"
                  @click="startCamera" 
                  class="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-6 py-3 rounded-xl border-2 border-emerald-400 shadow-lg transition flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>🎥</span>
                  <span>Encender Cámara Web</span>
                </button>
              </div>
            </div>

            <!-- Controles de Cámara Activa -->
            <div v-if="isCameraActive" class="flex items-center justify-between text-xs bg-stone-100 p-3 rounded-xl border-2 border-stone-300">
              <span class="text-stone-800 font-bold flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping"></span>
                Escaneando video en vivo...
              </span>
              <button 
                type="button"
                @click="stopCamera"
                class="text-xs font-black text-white bg-red-600 hover:bg-red-700 border border-red-800 px-3.5 py-1.5 rounded-lg transition cursor-pointer"
              >
                🛑 Apagar Cámara
              </button>
            </div>

            <!-- Alerta de Error de Cámara -->
            <div v-if="cameraError" class="p-3.5 bg-red-50 border-2 border-red-400 rounded-xl text-red-950 text-xs font-bold space-y-1">
              <p>⚠️ {{ cameraError }}</p>
              <p class="text-[11px] text-red-800 font-medium">Usa el botón "Simular Escaneo Demo" o pega el token manualmente abajo.</p>
            </div>

            <!-- Alerta de Éxito de Lectura -->
            <div v-if="lastScannedSuccess" class="p-3.5 bg-emerald-100 border-2 border-emerald-600 rounded-xl text-emerald-950 text-xs font-black flex items-center gap-2.5">
              <span class="text-lg">✅</span>
              <div>
                <p>¡Código QR del cliente detectado!</p>
                <p class="text-[11px] text-emerald-800 font-semibold">Ahora completa los datos de factura en el Paso 2.</p>
              </div>
            </div>

            <!-- Entrada Manual o Simulación -->
            <div class="space-y-2 pt-3 border-t-2 border-stone-200">
              <div class="flex items-center justify-between gap-2">
                <label class="text-xs font-black text-stone-900">
                  Token QR Escaneado o Manual:
                </label>
                <button 
                  type="button"
                  @click="simulateScan"
                  :disabled="simulating"
                  class="text-xs font-black text-stone-950 bg-amber-300 hover:bg-amber-400 border-2 border-amber-600 px-3 py-1.5 rounded-lg transition cursor-pointer shadow-sm active:scale-95 flex items-center gap-1"
                >
                  <span>⚡ Simular Escaneo Demo</span>
                </button>
              </div>

              <textarea 
                v-model="tokenInput"
                rows="2"
                placeholder="Aquí aparecerá el código al escanear con cámara, o presiona 'Simular Escaneo Demo'..."
                class="w-full text-xs font-mono font-bold bg-stone-50 border-2 border-stone-400 rounded-xl p-3 text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-stone-900 focus:outline-none"
              ></textarea>

              <p class="text-[11px] text-stone-600 font-medium">
                💡 <strong>Ayuda:</strong> Si estás probando sin cámara, haz clic en <strong>"⚡ Simular Escaneo Demo"</strong> para generar un QR real del cliente Camila.
              </p>
            </div>
          </div>
        </div>

        <!-- COLUMNA DERECHA: PASO 2 - FACTURA POS (7 Columnas) -->
        <div class="lg:col-span-7 bg-white rounded-2xl border-2 border-stone-400 shadow-md overflow-hidden flex flex-col justify-between">
          <!-- Cabecera de Tarjeta -->
          <div class="bg-stone-100 border-b-2 border-stone-300 px-6 py-4 flex items-center justify-between">
            <div>
              <span class="text-[11px] uppercase font-black text-stone-900 bg-amber-300 border border-amber-500 px-2.5 py-0.5 rounded-md">
                Paso 2
              </span>
              <h3 class="font-black text-base text-stone-950 mt-1">Registrar Datos de Factura POS</h3>
            </div>
            <span class="text-xs text-stone-700 font-extrabold bg-stone-200 border border-stone-400 px-2.5 py-1 rounded-md">
              Campos obligatorios (*)
            </span>
          </div>

          <!-- Cuerpo del Formulario -->
          <div class="p-6 space-y-5 flex-1">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <!-- Campo 1: N° Factura -->
              <div class="space-y-1.5">
                <label class="text-xs font-black text-stone-900 flex items-center justify-between">
                  <span>Número de Factura / Ticket *</span>
                  <span class="text-[11px] text-stone-600 font-bold">Único por sede</span>
                </label>
                <input 
                  v-model="invoiceRef"
                  type="text" 
                  placeholder="Ej: FAC-2026-00124"
                  class="w-full text-sm font-mono font-bold bg-stone-50 border-2 border-stone-400 rounded-xl px-4 py-3 text-stone-950 placeholder:text-stone-400 focus:bg-white focus:border-stone-900 focus:outline-none"
                />
                <p class="text-[11px] text-stone-600 font-medium">
                  Consecutivo impreso en el recibo entregado al cliente.
                </p>
              </div>

              <!-- Campo 2: Importe Total -->
              <div class="space-y-1.5">
                <label class="text-xs font-black text-stone-900 flex items-center justify-between">
                  <span>Importe Total Facturado (COP) *</span>
                  <span class="text-[11px] text-amber-900 font-extrabold bg-amber-100 border border-amber-400 px-1.5 rounded">$10.000 = 1 sello</span>
                </label>
                <input 
                  v-model.number="grossAmount"
                  type="number" 
                  placeholder="Ej: 30000"
                  class="w-full text-sm font-mono font-bold bg-stone-50 border-2 border-stone-400 rounded-xl px-4 py-3 text-stone-950 placeholder:text-stone-400 focus:bg-white focus:border-stone-900 focus:outline-none"
                />
                <p class="text-[11px] text-stone-600 font-medium">
                  Valor bruto en pesos antes de descuentos.
                </p>
              </div>

              <!-- Campo 3: Descuentos -->
              <div class="space-y-1.5">
                <label class="text-xs font-black text-stone-900 flex items-center justify-between">
                  <span>Descuentos Comerciales (COP)</span>
                  <span class="text-[11px] text-stone-500 font-bold">Opcional</span>
                </label>
                <input 
                  v-model.number="discountAmount"
                  type="number" 
                  placeholder="0"
                  class="w-full text-sm font-mono font-bold bg-stone-50 border-2 border-stone-400 rounded-xl px-4 py-3 text-stone-950 placeholder:text-stone-400 focus:bg-white focus:border-stone-900 focus:outline-none"
                />
                <p class="text-[11px] text-stone-600 font-medium">
                  Dejar en blanco o en 0 si no hubo descuento.
                </p>
              </div>

              <!-- Campo 4: Valor Neto Calculado -->
              <div class="space-y-1.5">
                <label class="text-xs font-black text-stone-900">
                  Valor Neto Elegible (Automático)
                </label>
                <div class="w-full text-sm font-mono font-black bg-stone-200 text-stone-950 rounded-xl px-4 py-3 border-2 border-stone-400 flex items-center justify-between">
                  <span>${{ (eligibleAmount || 0).toLocaleString('es-CO') }} COP</span>
                  <span class="text-[11px] text-stone-700 font-bold">Base sellos</span>
                </div>
                <p class="text-[11px] text-stone-600 font-medium">
                  Calculado restando descuentos del total facturado.
                </p>
              </div>
            </div>

            <!-- Recuadro de Previsualización de Sellos -->
            <div class="bg-amber-50 rounded-xl p-4 border-2 border-amber-400 flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center text-2xl font-black border border-stone-950">
                  ☕
                </div>
                <div>
                  <span class="text-base font-black font-mono text-stone-950 block">
                    +{{ calculatedStamps }} SELLOS A OTORGAR
                  </span>
                  <p class="text-xs text-stone-700 font-semibold">
                    Regla vigente: 1 sello por cada $10.000 COP (Máximo 3 sellos por compra)
                  </p>
                </div>
              </div>

              <div>
                <span v-if="eligibleAmount < 10000" class="text-xs font-extrabold text-amber-950 bg-amber-200 border border-amber-500 px-3 py-1 rounded-lg inline-block">
                  ⚠️ Mínimo $10.000 COP para sumar sellos
                </span>
                <span v-else class="text-xs font-extrabold text-emerald-950 bg-emerald-200 border border-emerald-500 px-3 py-1 rounded-lg inline-block">
                  ✓ Monto válido para acumular
                </span>
              </div>
            </div>

            <!-- Lista de Verificación de Requisitos (Checklist) -->
            <div class="bg-stone-100 rounded-xl p-4 border-2 border-stone-300 space-y-2">
              <span class="font-black text-xs text-stone-800 uppercase tracking-wider block">
                Estado de requisitos para registrar la compra:
              </span>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div 
                  class="p-2 rounded-lg border flex items-center gap-2 font-bold"
                  :class="tokenInput ? 'bg-emerald-100 border-emerald-500 text-emerald-950' : 'bg-white border-stone-300 text-stone-600'"
                >
                  <span>{{ tokenInput ? '✅' : '1️⃣' }}</span>
                  <span>QR Escaneado</span>
                </div>

                <div 
                  class="p-2 rounded-lg border flex items-center gap-2 font-bold"
                  :class="invoiceRef ? 'bg-emerald-100 border-emerald-500 text-emerald-950' : 'bg-white border-stone-300 text-stone-600'"
                >
                  <span>{{ invoiceRef ? '✅' : '2️⃣' }}</span>
                  <span>N° de Factura</span>
                </div>

                <div 
                  class="p-2 rounded-lg border flex items-center gap-2 font-bold"
                  :class="eligibleAmount > 0 ? 'bg-emerald-100 border-emerald-500 text-emerald-950' : 'bg-white border-stone-300 text-stone-600'"
                >
                  <span>{{ eligibleAmount > 0 ? '✅' : '3️⃣' }}</span>
                  <span>Importe &gt; $0</span>
                </div>
              </div>
            </div>

            <!-- Botón Principal de Confirmación con Alto Contraste -->
            <button 
              type="button"
              @click="submitPurchase"
              :disabled="isSubmitting || !tokenInput || !invoiceRef || eligibleAmount <= 0"
              class="w-full font-black text-sm py-4 px-6 rounded-xl border-2 shadow-md transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
              :class="(!tokenInput || !invoiceRef || eligibleAmount <= 0)
                ? 'bg-stone-300 text-stone-700 border-stone-400 cursor-not-allowed' 
                : 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-950 shadow-lg ring-4 ring-emerald-500/20'"
            >
              <span v-if="isSubmitting">⏳ Procesando Transacción en Base de Datos...</span>
              <span v-else-if="!tokenInput || !invoiceRef || eligibleAmount <= 0">
                🔒 Completa los 3 pasos superiores para habilitar el registro
              </span>
              <span v-else>
                ✅ Confirmar y Registrar Venta en Caja (+{{ calculatedStamps }} Sellos) →
              </span>
            </button>

            <!-- Alertas de Resultado -->
            <div v-if="errorMessage" class="p-4 bg-red-100 border-2 border-red-600 rounded-xl text-red-950 text-xs font-black flex items-center gap-2">
              <span class="text-base">❌</span>
              <span>{{ errorMessage }}</span>
            </div>

            <div v-if="successPurchase" class="p-5 bg-emerald-100 border-2 border-emerald-700 rounded-xl text-emerald-950 text-xs space-y-2 shadow-md">
              <div class="flex items-center justify-between font-black text-sm">
                <span>🎉 ¡Venta Registrada Exitosamente!</span>
                <span class="font-mono text-xs bg-white px-2 py-0.5 rounded border border-emerald-500">
                  Factura: {{ successPurchase.receipt_reference }}
                </span>
              </div>
              <p class="font-semibold">Cliente: <strong>{{ successPurchase.customer_name }}</strong></p>
              <p class="font-semibold">Sellos acreditados en esta compra: <strong>+{{ successPurchase.stamps_awarded }} sellos</strong></p>
              <div v-if="successPurchase.rewards_issued.length > 0" class="p-3 bg-amber-200 rounded-lg text-stone-950 font-black border-2 border-amber-600 mt-2">
                🎁 ¡TARJETA COMPLETADA (8/8)! Se emitió el premio: {{ successPurchase.rewards_issued[0].name }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- =================================================================== -->
      <!-- MODO 2: CANJEAR RECOMPENSA DE CORTESÍA                              -->
      <!-- =================================================================== -->
      <div v-else class="max-w-2xl mx-auto bg-white rounded-2xl border-2 border-stone-400 shadow-md overflow-hidden">
        <div class="bg-stone-100 border-b-2 border-stone-300 px-6 py-4 flex items-center justify-between">
          <div>
            <span class="text-[11px] uppercase font-black text-stone-950 bg-amber-300 border border-amber-500 px-2.5 py-0.5 rounded-md">
              Canje de Cortesía
            </span>
            <h3 class="font-black text-base text-stone-950 mt-1">Validar y Entregar Premio al Cliente</h3>
          </div>
          <span class="text-xs font-black text-stone-900 bg-amber-100 border-2 border-amber-400 px-3 py-1 rounded-lg">
            {{ activeStore.name }}
          </span>
        </div>

        <div class="p-6 space-y-5">
          <div class="bg-amber-50 p-4 rounded-xl border-2 border-amber-400 text-xs text-stone-900 space-y-1">
            <p class="font-black text-amber-950">💡 Instrucción para el Cajero:</p>
            <p class="font-medium text-stone-700">
              Pide al cliente abrir la sección <strong>"Premios"</strong> en su aplicación y pulsar <strong>"Redimir en Caja"</strong>. Escanea ese QR con la cámara o pega el token abajo.
            </p>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-xs font-black text-stone-900">Token QR de Redención del Premio:</label>
              <button 
                v-if="!isCameraActive"
                type="button"
                @click="startCamera" 
                class="text-xs font-black text-white bg-emerald-700 hover:bg-emerald-800 border-2 border-emerald-900 px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5"
              >
                <span>🎥</span> Encender Cámara
              </button>
              <button 
                v-else
                type="button"
                @click="stopCamera" 
                class="text-xs font-black text-white bg-red-600 hover:bg-red-700 border-2 border-red-800 px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5"
              >
                <span>🛑</span> Apagar Cámara
              </button>
            </div>

            <!-- Visor Cámara en Redención -->
            <div v-if="isCameraActive" class="aspect-video bg-stone-950 rounded-xl overflow-hidden relative border-2 border-stone-800">
              <video ref="videoRef" class="w-full h-full object-cover" autoplay muted playsinline></video>
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div class="w-40 h-40 border-2 border-amber-400 rounded-xl animate-pulse"></div>
              </div>
            </div>

            <textarea 
              v-model="tokenInput"
              rows="3"
              placeholder="Escanea el QR de redención con la cámara o pega aquí el token (ej: cfy_redemption_...)"
              class="w-full text-xs font-mono font-bold bg-stone-50 border-2 border-stone-400 rounded-xl p-3.5 text-stone-950 placeholder:text-stone-400 focus:bg-white focus:border-stone-900 focus:outline-none"
            ></textarea>
          </div>

          <button 
            type="button"
            @click="submitRedemption"
            :disabled="isSubmitting || !tokenInput"
            class="w-full font-black text-sm py-4 px-6 rounded-xl border-2 shadow-md transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
            :class="!tokenInput 
              ? 'bg-stone-300 text-stone-700 border-stone-400 cursor-not-allowed' 
              : 'bg-amber-600 hover:bg-amber-700 text-white border-amber-900 shadow-lg'"
          >
            <span v-if="isSubmitting">⏳ Validando Canje en Base de Datos...</span>
            <span v-else-if="!tokenInput">🔒 Escanea o ingresa el token de redención para continuar</span>
            <span v-else>🎁 Confirmar Entrega de Recompensa al Cliente →</span>
          </button>

          <div v-if="errorMessage" class="p-4 bg-red-100 border-2 border-red-600 rounded-xl text-red-950 text-xs font-black flex items-center gap-2">
            <span>❌</span> {{ errorMessage }}
          </div>

          <div v-if="successRedemption" class="p-5 bg-emerald-100 border-2 border-emerald-700 rounded-xl text-emerald-950 text-xs space-y-2">
            <span class="font-black text-sm block">🎉 ¡Premio Validado y Entregado con Éxito!</span>
            <p class="font-semibold">Bebida / Producto: <strong>{{ successRedemption.reward_name }}</strong></p>
            <p class="font-semibold">Cliente: <strong>{{ successRedemption.customer_name }}</strong></p>
            <p class="text-[11px] text-stone-700 font-mono">ID Auditoría: {{ successRedemption.redemption_id }}</p>
          </div>
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
    // Ignore audio restriction if any
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
          // Ignore normal non-QR frames
        }
      }
    );
  } catch (err: any) {
    console.error('Error al iniciar cámara:', err);
    cameraError.value = 'No se pudo acceder a la cámara. Concede permisos de video en tu navegador.';
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
