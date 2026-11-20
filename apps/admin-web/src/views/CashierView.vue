<template>
  <div class="space-y-6">
    <!-- ======================================================================= -->
    <!-- PANTALLA 1: ASIGNACIÓN DE SEDE Y APERTURA DE TURNO POS                  -->
    <!-- ======================================================================= -->
    <div v-if="!activeStore || isSelectingStore" class="max-w-4xl mx-auto space-y-5">
      <!-- Cabecera Minimalista -->
      <div class="bg-white rounded-2xl border border-crema-border fluid-pad space-y-4 shadow-sm">
        <div class="flex items-start justify-between gap-4">
          <div class="space-y-1.5">
            <div class="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-roast-700 bg-crema-surface border border-crema-border px-2.5 py-0.5 rounded-md">
              <!-- SVG: Storefront -->
              <svg class="w-3.5 h-3.5 text-roast-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
                <path d="M2 7h20" />
              </svg>
              <span>Apertura de Turno</span>
            </div>
            <h1 class="fluid-title font-extrabold tracking-tight text-roast-950">
              Selecciona la sede de operación
            </h1>
            <p class="text-xs text-roast-600 max-w-xl leading-relaxed">
              Elige el establecimiento físico donde operas esta terminal para vincular las facturas, sellos y cortesías de tu turno.
            </p>
          </div>

          <button 
            v-if="activeStore"
            type="button"
            @click="isSelectingStore = false"
            class="text-xs font-semibold text-roast-700 bg-crema-surface hover:bg-crema-border/70 border border-crema-border px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
            <span>Volver</span>
          </button>
        </div>
      </div>

      <!-- Grid de Sedes Disponibles -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          v-for="store in stores" 
          :key="store.id"
          @click="selectAndOpenStore(store)"
          class="bg-white rounded-2xl p-5 border transition-all duration-150 cursor-pointer flex flex-col justify-between space-y-5"
          :class="pendingStoreSelection?.id === store.id 
            ? 'border-2 border-stone-900 shadow-md ring-2 ring-amber-400/20' 
            : 'border-stone-200 hover:border-stone-400 hover:shadow-sm'"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-200">
                {{ store.code }}
              </span>
              <span class="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                Activa
              </span>
            </div>

            <div>
              <h2 class="font-bold text-stone-900 text-base">{{ store.name }}</h2>
              <p class="text-xs text-stone-500 mt-0.5">{{ store.address || 'Sede comercial principal' }}</p>
            </div>

            <div class="flex items-center gap-1.5 text-[11px] text-stone-600 font-medium pt-1">
              <svg class="w-3.5 h-3.5 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
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
              ? 'bg-stone-900 text-white border-stone-900 shadow-xs' 
              : 'bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-900 border-stone-200'"
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
    <!-- PANTALLA 2: TERMINAL POS INTELIGENTE (ESTILO STARBUCKS REWARDS)         -->
    <!-- ======================================================================= -->
    <template v-else>
      <!-- Barra Superior de Contexto de Sede y Estado de Caja (2 Columnas x 2 Filas en Mobile) -->
      <div class="bg-white border border-stone-300 rounded-2xl p-3 sm:px-5 shadow-sm space-y-2.5 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <!-- Fila 1 (Mobile) / Bloque Izquierdo (Desktop): Sede y Botón Cambiar -->
        <div class="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-4 items-center justify-between">
          <!-- Columna 1 (Fila 1): Icono y Nombre de la Sede -->
          <div class="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-stone-100 border border-stone-200 text-stone-800 flex items-center justify-center shrink-0 shadow-2xs">
              <svg class="w-4 h-4 text-stone-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
                <path d="M2 7h20" />
              </svg>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="font-bold text-xs sm:text-sm text-stone-950 truncate">{{ activeStore.name }}</span>
                <span class="text-[10px] font-mono font-bold text-stone-700 bg-stone-100 border border-stone-200 px-1.5 py-0.2 rounded shrink-0">
                  {{ activeStore.code }}
                </span>
              </div>
            </div>
          </div>

          <!-- Columna 2 (Fila 1): Botón Recortado para Cambiar Sede -->
          <div class="flex justify-end sm:justify-start">
            <button 
              type="button"
              @click="openStoreSelector"
              class="text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 px-2.5 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 shrink-0"
              title="Cambiar de sede física"
            >
              <svg class="w-3.5 h-3.5 text-stone-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/>
              </svg>
              <span>Cambiar</span>
            </button>
          </div>
        </div>

        <!-- Fila 2 (Mobile) / Bloque Derecho (Desktop): Dirección y Estado de Caja -->
        <div class="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-4 items-center justify-between pt-2 sm:pt-0 border-t border-stone-100 sm:border-0">
          <!-- Columna 1 (Fila 2): Dirección Recortada -->
          <p class="text-[11px] text-stone-500 truncate flex items-center gap-1 min-w-0">
            <svg class="w-3 h-3 text-stone-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span class="truncate">{{ activeStore.address || activeStore.city }}</span>
          </p>

          <!-- Columna 2 (Fila 2): Estado de Caja Recortado -->
          <div class="flex justify-end">
            <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-full shrink-0">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Caja Activa</span>
            </span>
          </div>
        </div>
      </div>

      <!-- ===================================================================== -->
      <!-- CASO 1: NINGÚN SOCIO IDENTIFICADO AÚN (ESCANEAR O INGRESAR TOKEN)      -->
      <!-- ===================================================================== -->
      <div v-if="!memberData" class="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <!-- Panel de Lector Óptico QR (5 Cols) -->
        <div class="lg:col-span-6 bg-white rounded-2xl border border-crema-border shadow-sm fluid-pad space-y-4">
          <div class="flex items-center justify-between border-b border-crema-surface pb-3">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-roast-900 text-white text-xs font-mono font-bold flex items-center justify-center">1</span>
              <div>
                <h2 class="font-bold text-sm text-roast-950">Escanear Carnet del Socio</h2>
                <p class="text-[11px] text-roast-500">Un solo QR permanente para acumular o canjear</p>
              </div>
            </div>

            <span 
              class="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full border flex items-center gap-1.5" 
              :class="isCameraActive ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-crema-surface text-roast-600 border-crema-border'"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="isCameraActive ? 'bg-emerald-600 animate-pulse' : 'bg-stone-400'"></span>
              {{ isCameraActive ? 'Cámara activa' : 'En espera' }}
            </span>
          </div>

          <!-- Visor de Video de Cámara -->
          <div class="aspect-4/3 bg-stone-950 rounded-xl relative overflow-hidden flex flex-col items-center justify-center text-center border border-stone-800">
            <video 
              ref="videoRef" 
              class="w-full h-full object-cover" 
              :class="{ 'hidden': !isCameraActive }"
              autoplay 
              muted 
              playsinline
            ></video>

            <!-- Retícula de Escaneo Activo -->
            <div v-if="isCameraActive" class="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
              <div class="w-44 h-44 border-2 border-emerald-400 rounded-2xl relative shadow-lg">
                <div class="absolute inset-x-0 h-0.5 bg-emerald-400 animate-pulse top-1/2"></div>
              </div>
              <span class="text-[11px] text-white font-medium bg-roast-900/90 px-3 py-1 rounded-md mt-3 border border-stone-700">
                Apunta al carnet QR del cliente
              </span>
            </div>

            <!-- Estado Inicial con Cámara Apagada -->
            <div v-if="!isCameraActive" class="p-6 space-y-3 flex flex-col items-center justify-center text-center">
              <div class="w-12 h-12 rounded-2xl bg-roast-900 border border-stone-700 text-golden-300 flex items-center justify-center">
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
                  <rect width="7" height="7" x="7" y="7" rx="1"/><path d="M7 17h.01"/><path d="M17 7h.01"/><path d="M17 17h.01"/>
                </svg>
              </div>
              <div class="space-y-0.5">
                <p class="text-xs font-bold text-white">Lector de Carnet Digital</p>
                <p class="text-[11px] text-roast-400">Activa la cámara del POS o ingresa el código del socio</p>
              </div>

              <button 
                type="button"
                @click="startCamera" 
                class="bg-white hover:bg-crema-surface text-roast-950 font-bold text-xs px-4 py-2.5 rounded-xl border border-crema-border transition flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                <svg class="w-4 h-4 text-roast-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>
                </svg>
                <span>Activar escáner de cámara</span>
              </button>
            </div>
          </div>

          <!-- Barra de Control de Cámara -->
          <div v-if="isCameraActive" class="flex items-center justify-between text-xs bg-crema-surface p-2.5 rounded-xl border border-crema-border">
            <span class="text-roast-700 font-semibold text-[11px] truncate">{{ activeCameraLabel }}</span>
            <div class="flex items-center gap-1.5 shrink-0">
              <button 
                v-if="availableCameras.length > 1"
                type="button"
                @click="toggleCamera"
                class="text-xs font-semibold text-roast-800 bg-white hover:bg-crema-surface border border-crema-border px-2 py-1 rounded-lg transition cursor-pointer"
              >
                Girar
              </button>
              <button 
                type="button"
                @click="stopCamera"
                class="text-xs font-semibold text-red-700 bg-white hover:bg-red-50 border border-red-300 px-2.5 py-1 rounded-lg transition cursor-pointer"
              >
                Detener
              </button>
            </div>
          </div>

          <div v-if="cameraError" class="p-3 bg-red-50 border border-red-300 rounded-xl text-red-900 text-xs">
            {{ cameraError }}
          </div>

          <!-- Entrada Manual del Carnet del Socio -->
          <div class="space-y-2 pt-2 border-t border-crema-surface">
            <label for="pos-member-token" class="block text-xs font-semibold text-roast-800">
              Código de carnet del socio (escaneo de cámara o pegado manual):
            </label>

            <div class="flex gap-2">
              <input 
                id="pos-member-token"
                v-model="tokenInput"
                type="text"
                placeholder="cfy_member_..."
                @keyup.enter="lookupMember()"
                class="flex-1 text-xs font-mono bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-stone-900 focus:outline-none transition"
              />
              <button
                type="button"
                @click="lookupMember()"
                :disabled="isLookingUp || !tokenInput.trim()"
                class="bg-stone-900 hover:bg-stone-800 disabled:bg-stone-200 disabled:text-stone-400 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer shadow-sm"
              >
                {{ isLookingUp ? 'Buscando...' : 'Consultar' }}
              </button>
            </div>

            <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-300 rounded-xl text-red-900 text-xs mt-2">
              {{ errorMessage }}
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Explicación y Flujo de Atención (6 Cols) -->
        <div class="lg:col-span-6 bg-white rounded-2xl border border-stone-300 shadow-sm fluid-pad space-y-4 flex flex-col justify-between">
          <div class="space-y-4">
            <div class="border-b border-stone-200 pb-3">
              <span class="text-[10px] uppercase font-bold tracking-widest text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded">
                Flujo Estilo Starbucks Rewards
              </span>
              <h3 class="font-extrabold text-base text-stone-950 mt-1">Atención rápida y unificada en barra</h3>
              <p class="text-xs text-stone-600 mt-0.5">El cliente solo necesita presentar un único código para todo:</p>
            </div>

            <div class="space-y-3">
              <div class="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div class="w-7 h-7 rounded-lg bg-stone-900 text-amber-300 flex items-center justify-center shrink-0 font-bold text-xs">
                  1
                </div>
                <div class="space-y-0.5">
                  <h4 class="text-xs font-bold text-stone-900">Escaneo Instantáneo</h4>
                  <p class="text-[11px] text-stone-600">Al escanear el carnet digital, la pantalla mostrará su expediente, tarjeta de sellos y si tiene cortesías acumuladas.</p>
                </div>
              </div>

              <div class="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div class="w-7 h-7 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center shrink-0 font-bold text-xs">
                  2
                </div>
                <div class="space-y-0.5">
                  <h4 class="text-xs font-bold text-stone-900">Entrega de Cortesía Flexible</h4>
                  <p class="text-[11px] text-stone-600">Si completó su ciclo de 8 sellos, pregúntale qué bebida o producto del menú prefiere hoy y confírmalo con un clic.</p>
                </div>
              </div>

              <div class="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div class="w-7 h-7 rounded-lg bg-stone-900 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                  3
                </div>
                <div class="space-y-0.5">
                  <h4 class="text-xs font-bold text-stone-900">Acreditación Automática de Factura</h4>
                  <p class="text-[11px] text-stone-600">Ingresa el valor de la factura para sumar sellos (1 sello por cada $10.000 COP). El celular del cliente vibrará y sonará al instante.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
            <span class="text-xs font-semibold text-stone-700">Listo para escanear al cliente que esté frente a caja</span>
          </div>
        </div>
      </div>

      <!-- ===================================================================== -->
      <!-- CASO 2: SOCIO IDENTIFICADO (DOSSIER DEL CLIENTE EN CAJA)              -->
      <!-- ===================================================================== -->
      <div v-else class="space-y-5 animate-in fade-in duration-200">
        <!-- Expediente del Socio (Header Bar) -->
        <div class="bg-stone-900 text-white rounded-2xl p-4 sm:p-5 border border-stone-800 shadow-md flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 font-black text-lg flex items-center justify-center shrink-0 shadow-sm">
              {{ memberData.full_name.charAt(0) }}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="font-black text-lg text-white">{{ memberData.full_name }}</h2>
                <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-stone-800 text-amber-300 border border-amber-400/40">
                  {{ memberData.member_code }}
                </span>
              </div>
              <p class="text-xs text-stone-300">{{ memberData.email }} {{ memberData.phone ? '• ' + memberData.phone : '' }}</p>
            </div>
          </div>

          <button 
            type="button"
            @click="clearMember"
            class="w-full sm:w-auto bg-stone-800 hover:bg-stone-700 text-white border border-stone-700 text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
          >
            <svg class="w-4 h-4 text-stone-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
            <span>Escanear siguiente socio</span>
          </button>
        </div>

        <!-- Grid 2 Columnas: Recompensas / Sellos + Factura -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          <!-- COLUMNA 1: CORTESÍA DE BARRA Y TARJETA ACTIVA (6 Cols) -->
          <div class="lg:col-span-6 space-y-5">
            
            <!-- TARJETA MINI DE SELLOS ACTUALES -->
            <div class="bg-white rounded-2xl border border-stone-300 p-4 sm:p-5 shadow-sm space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-[10px] uppercase font-bold tracking-widest text-stone-500">Tarjeta Activa</span>
                  <h3 class="font-extrabold text-sm text-stone-900">Ciclo #{{ memberData.active_card.cycle_number }}</h3>
                </div>
                <div class="text-right">
                  <span class="text-lg font-black font-mono text-stone-900">{{ memberData.active_card.stamps_count }} / {{ memberData.active_card.stamps_required }}</span>
                  <span class="text-[10px] text-stone-500 block uppercase">Sellos</span>
                </div>
              </div>

              <!-- Cuadrícula de Sellos (8 casillas) -->
              <div class="grid grid-cols-4 gap-2">
                <div
                  v-for="i in memberData.active_card.stamps_required"
                  :key="i"
                  class="aspect-square rounded-xl flex flex-col items-center justify-center border text-[10px] font-bold transition-all"
                  :class="i <= memberData.active_card.stamps_count
                    ? 'bg-amber-400 border-2 border-amber-500 text-amber-950 shadow-xs'
                    : i === memberData.active_card.stamps_required
                      ? 'bg-amber-50/80 border-2 border-dashed border-amber-400 text-amber-800'
                      : 'bg-stone-50 border border-stone-200 text-stone-400'"
                >
                  <template v-if="i <= memberData.active_card.stamps_count">
                    <svg class="w-4 h-4 text-amber-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
                    </svg>
                    <span class="text-[9px] font-black font-mono text-amber-950 mt-0.5">Sello {{ i }}</span>
                  </template>
                  <span v-else>{{ i === 8 ? 'Premio' : i }}</span>
                </div>
              </div>

              <div class="text-xs text-stone-500 text-center pt-1">
                {{ memberData.active_card.stamps_count >= 8 
                  ? '¡Tarjeta completa! El premio ya fue emitido.' 
                  : `Faltan ${8 - memberData.active_card.stamps_count} sellos para la siguiente cortesía.` }}
              </div>
            </div>

            <!-- SECCIÓN DE CANJE DE PREMIO / CORTESÍA (SI TIENE DISPONIBLE) -->
            <div 
              class="rounded-2xl border p-5 shadow-sm space-y-4"
              :class="memberData.has_available_reward 
                ? 'bg-amber-50 border-amber-300' 
                : 'bg-stone-50 border-stone-200 text-stone-500'"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <div 
                    class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    :class="memberData.has_available_reward ? 'bg-amber-400 text-stone-950 font-bold shadow-sm' : 'bg-stone-200 text-stone-400'"
                  >
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-extrabold text-sm text-stone-950">
                      {{ memberData.has_available_reward ? '¡Cortesía Lista para Canje!' : 'Sin Cortesías Pendientes' }}
                    </h3>
                    <p class="text-[11px] text-stone-600">
                      {{ memberData.has_available_reward 
                        ? `${memberData.available_rewards_count} cortesía(s) disponible(s) acumulada(s)`
                        : 'El cliente no tiene premios listos en este momento' }}
                    </p>
                  </div>
                </div>

                <span 
                  v-if="memberData.has_available_reward"
                  class="text-xs font-black font-mono px-2.5 py-1 rounded-lg bg-amber-400 text-stone-950 border border-amber-500"
                >
                  {{ memberData.available_rewards_count }} disponible(s)
                </span>
              </div>

              <!-- Selector Dinámico de Producto de Cortesía si tiene premio -->
              <div v-if="memberData.has_available_reward" class="space-y-3 pt-2 border-t border-amber-200">
                <label class="text-xs font-bold text-stone-900 block">
                  Elige la cortesía que desea el cliente hoy:
                </label>

                <div class="space-y-2">
                  <div 
                    v-for="opt in memberData.catalog_options"
                    :key="opt.id"
                    @click="selectedRewardProduct = opt.name"
                    class="p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between"
                    :class="selectedRewardProduct === opt.name 
                      ? 'bg-amber-100/90 border-2 border-amber-500 font-bold text-stone-950 shadow-xs' 
                      : 'bg-white border-stone-200 hover:border-amber-300 text-stone-800'"
                  >
                    <div class="space-y-0.5">
                      <span class="block">{{ opt.name }}</span>
                      <span class="text-[10px] text-stone-500 font-normal">{{ opt.description }}</span>
                    </div>
                    <span class="w-4 h-4 rounded-full border flex items-center justify-center shrink-0" :class="selectedRewardProduct === opt.name ? 'border-amber-600 bg-amber-600 text-white' : 'border-stone-300'">
                      <span v-if="selectedRewardProduct === opt.name" class="w-1.5 h-1.5 rounded-full bg-white"></span>
                    </span>
                  </div>

                  <!-- Opción Personalizada -->
                  <div 
                    @click="selectedRewardProduct = 'custom'"
                    class="p-2.5 rounded-xl border text-xs cursor-pointer transition"
                    :class="selectedRewardProduct === 'custom' 
                      ? 'bg-amber-100/90 border-2 border-amber-500 font-bold text-stone-950 shadow-xs' 
                      : 'bg-white border-stone-200 hover:border-amber-300 text-stone-800'"
                  >
                    <div class="flex items-center justify-between">
                      <span>Otra cortesía acordada en barra</span>
                      <span class="w-4 h-4 rounded-full border flex items-center justify-center shrink-0" :class="selectedRewardProduct === 'custom' ? 'border-amber-600 bg-amber-600 text-white' : 'border-stone-300'">
                        <span v-if="selectedRewardProduct === 'custom'" class="w-1.5 h-1.5 rounded-full bg-white"></span>
                      </span>
                    </div>
                    <input 
                      v-if="selectedRewardProduct === 'custom'"
                      v-model="customProductNote"
                      type="text"
                      placeholder="Ej: Latte descafeinado en leche de avena"
                      class="mt-2 w-full text-xs font-normal bg-white border border-stone-300 rounded-lg p-2 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <!-- Botón de Entregar Cortesía -->
                <button
                  type="button"
                  @click="submitMemberRedemption"
                  :disabled="isSubmittingRedemption"
                  class="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs py-3 rounded-xl border border-stone-900 transition flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                >
                  <svg class="w-4 h-4 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
                  </svg>
                  <span>{{ isSubmittingRedemption ? 'Confirmando entrega...' : 'Entregar Cortesía Seleccionada' }}</span>
                </button>

                <!-- Toast de éxito de redención -->
                <div v-if="successRedemption" class="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-950 text-xs font-medium space-y-1">
                  <div class="font-bold flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                    <span>¡Cortesía entregada con éxito!</span>
                  </div>
                  <p>Producto: <strong>{{ successRedemption.reward_name }}</strong></p>
                </div>
              </div>
            </div>
          </div>

          <!-- COLUMNA 2: REGISTRO DE COMPRA Y ACREDITACIÓN DE SELLOS (6 Cols) -->
          <div class="lg:col-span-6 bg-white rounded-2xl border border-crema-border shadow-sm p-4 sm:p-5 space-y-4 flex flex-col justify-between">
            <div class="space-y-4">
              <div class="flex items-center justify-between border-b border-crema-surface pb-3">
                <div class="flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-roast-900 text-white text-xs font-mono font-bold flex items-center justify-center">2</span>
                  <div>
                    <h3 class="font-bold text-sm text-roast-950">Acreditar Sellos por Compra</h3>
                    <p class="text-[11px] text-roast-500">1 sello por cada $10.000 COP en la factura</p>
                  </div>
                </div>
              </div>

              <!-- Formulario de Factura -->
              <div class="space-y-3">
                <div class="space-y-1">
                  <label for="pos-invoice-input" class="text-xs font-semibold text-roast-800">
                    Número de factura / Comprobante *
                  </label>
                  <input 
                    id="pos-invoice-input"
                    v-model="invoiceRef"
                    type="text" 
                    placeholder="FAC-2026-00125"
                    class="w-full text-xs font-mono bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-stone-900 focus:outline-none transition"
                  />
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-1">
                    <label for="pos-gross-input" class="text-xs font-semibold text-stone-800">
                      Importe bruto (COP) *
                    </label>
                    <input 
                      id="pos-gross-input"
                      v-model.number="grossAmount"
                      type="number" 
                      placeholder="25000"
                      class="w-full text-xs font-mono bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-stone-900 focus:outline-none transition"
                    />
                  </div>

                  <div class="space-y-1">
                    <label for="pos-discount-input" class="text-xs font-semibold text-stone-800">
                      Descuento (COP)
                    </label>
                    <input 
                      id="pos-discount-input"
                      v-model.number="discountAmount"
                      type="number" 
                      placeholder="0"
                      class="w-full text-xs font-mono bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-stone-900 focus:outline-none transition"
                    />
                  </div>
                </div>

                <!-- Medio de Pago y Documento DIAN del Adquirente -->
                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-1">
                    <label class="text-xs font-semibold text-stone-800">Medio de Pago DIAN</label>
                    <select
                      v-model="paymentMethod"
                      class="w-full text-xs font-semibold bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900 focus:outline-none"
                    >
                      <option value="Efectivo">Efectivo</option>
                      <option value="Tarjeta Débito / Crédito">Tarjeta Débito / Crédito</option>
                      <option value="Nequi / Daviplata / Bre-B">Nequi / Daviplata / Bre-B</option>
                      <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                    </select>
                  </div>

                  <div class="space-y-1">
                    <label class="text-xs font-semibold text-stone-800">Cédula / NIT Cliente (DIAN)</label>
                    <input
                      v-model="customerDocNumber"
                      type="text"
                      placeholder="222222222222 (Opcional)"
                      class="w-full text-xs font-mono bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900 placeholder:text-stone-400 focus:outline-none"
                    />
                  </div>
                </div>

                <!-- Resumen de Sellos Calculados -->
                <div class="bg-stone-50 rounded-xl p-3.5 border border-stone-200 flex items-center justify-between">
                  <div>
                    <span class="text-xs font-bold text-stone-900 block">
                      Sellos a acreditar: +{{ calculatedStamps }}
                    </span>
                    <span class="text-[10px] text-stone-500">
                      Base neta: ${{ (eligibleAmount || 0).toLocaleString('es-CO') }} COP
                    </span>
                  </div>

                  <span class="text-lg font-black font-mono px-3 py-0.5 rounded-lg border" :class="calculatedStamps > 0 ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-stone-100 text-stone-400 border-stone-200'">
                    +{{ calculatedStamps }}
                  </span>
                </div>
              </div>
            </div>

            <div class="space-y-3 pt-2 border-t border-crema-surface">
              <button 
                type="button"
                @click="submitPurchase"
                :disabled="isSubmittingPurchase || !invoiceRef.trim() || eligibleAmount <= 0"
                class="w-full font-bold text-xs py-3.5 px-5 rounded-xl border transition flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                :class="(!invoiceRef.trim() || eligibleAmount <= 0)
                  ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed' 
                  : 'bg-stone-900 hover:bg-stone-800 text-white border-stone-900'"
              >
                <span v-if="isSubmittingPurchase">Acreditando sellos...</span>
                <span v-else-if="!invoiceRef.trim() || eligibleAmount <= 0">Ingresa factura e importe para registrar</span>
                <template v-else>
                  <span>Confirmar venta y acreditar +{{ calculatedStamps }} {{ calculatedStamps === 1 ? 'sello' : 'sellos' }}</span>
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </template>
              </button>

              <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-300 rounded-xl text-red-900 text-xs">
                {{ errorMessage }}
              </div>

              <!-- Éxito de Compra -->
              <div v-if="successPurchase" class="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 text-xs space-y-1">
                <div class="flex items-center justify-between font-bold">
                  <span class="flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                    <span>Venta registrada exitosamente</span>
                  </span>
                  <span class="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-emerald-300">
                    {{ successPurchase.receipt_reference }}
                  </span>
                </div>
                <p>Sellos acreditados: <strong>+{{ successPurchase.stamps_awarded }}</strong></p>
                <div v-if="successPurchase.rewards_issued.length > 0" class="p-2.5 bg-amber-100 rounded-xl text-stone-950 font-bold border border-amber-300 mt-1">
                  ¡El cliente completó los 8 sellos! Se activó una nueva cortesía.
                </div>
                <div class="pt-2 flex gap-2">
                  <button
                    type="button"
                    @click="openPosInvoice(successPurchase.purchase_id)"
                    class="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>🖨️ Imprimir Factura Electrónica DIAN / XML UBL 2.1</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <DianInvoiceModal
      :invoice="posActiveInvoice"
      @close="posActiveInvoice = null"
      @download-xml="downloadPosXml"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { BrowserQRCodeReader } from '@zxing/library';
import { 
  adminApi, 
  type StoreItem, 
  type PurchaseResponse, 
  type RedemptionResponse,
  type MemberLookupResponse
} from '../api';
import DianInvoiceModal from '../components/DianInvoiceModal.vue';

const LOCAL_STORAGE_STORE_KEY = 'confy_pos_active_store_id';

const stores = ref<StoreItem[]>([]);
const activeStore = ref<StoreItem | null>(null);
const pendingStoreSelection = ref<StoreItem | null>(null);
const isSelectingStore = ref(false);

// Identificación del socio
const tokenInput = ref('');
const isLookingUp = ref(false);
const memberData = ref<MemberLookupResponse | null>(null);
const selectedRewardProduct = ref('');
const customProductNote = ref('');

// Formulario de compra
const invoiceRef = ref('');
const grossAmount = ref<number | null>(null);
const discountAmount = ref<number | null>(null);
const paymentMethod = ref('Efectivo');
const customerDocNumber = ref('');
const posActiveInvoice = ref<any | null>(null);

const openPosInvoice = async (purchaseId: string) => {
  try {
    posActiveInvoice.value = await adminApi.getInvoice(purchaseId, true);
  } catch (err: any) {
    alert(err.message || 'Error al cargar Factura Electrónica DIAN');
  }
};

const downloadPosXml = async (purchaseId: string, invoiceNumber: string) => {
  try {
    await adminApi.downloadInvoiceXml(purchaseId, invoiceNumber);
  } catch (err: any) {
    alert(err.message || 'Error al descargar XML DIAN');
  }
};

const isSubmittingPurchase = ref(false);
const isSubmittingRedemption = ref(false);
const errorMessage = ref('');
const successPurchase = ref<PurchaseResponse | null>(null);
const successRedemption = ref<RedemptionResponse | null>(null);

// Control de cámara
const isCameraActive = ref(false);
const cameraError = ref('');
const videoRef = ref<HTMLVideoElement | null>(null);
let codeReader: BrowserQRCodeReader | null = null;
const availableCameras = ref<MediaDeviceInfo[]>([]);
const currentCameraIndex = ref(0);

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

const activeCameraLabel = computed(() => {
  if (availableCameras.value.length === 0) return 'Cámara';
  const dev = availableCameras.value[currentCameraIndex.value];
  if (!dev) return 'Cámara';
  const lbl = dev.label.toLowerCase();
  if (lbl.includes('back') || lbl.includes('rear') || lbl.includes('trasera') || lbl.includes('environment')) {
    return 'Cámara Trasera';
  }
  if (lbl.includes('front') || lbl.includes('delantera') || lbl.includes('user')) {
    return 'Cámara Frontal';
  }
  return dev.label || `Cámara ${currentCameraIndex.value + 1}`;
});

const startCamera = async () => {
  cameraError.value = '';
  isCameraActive.value = true;

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

    availableCameras.value = videoInputDevices;

    const rearIdx = videoInputDevices.findIndex(d => {
      const l = d.label.toLowerCase();
      return l.includes('back') || l.includes('rear') || l.includes('trasera') || l.includes('environment');
    });
    if (rearIdx !== -1) {
      currentCameraIndex.value = rearIdx;
    } else if (currentCameraIndex.value >= videoInputDevices.length) {
      currentCameraIndex.value = 0;
    }

    decodeCurrentDevice();
  } catch (err: any) {
    console.error('Error al iniciar cámara:', err);
    cameraError.value = 'Permiso de cámara denegado o dispositivo ocupado.';
    isCameraActive.value = false;
  }
};

const decodeCurrentDevice = () => {
  if (!codeReader || !videoRef.value || availableCameras.value.length === 0) return;
  const device = availableCameras.value[currentCameraIndex.value];
  if (!device) return;

  codeReader.reset();
  codeReader.decodeFromVideoDevice(
    device.deviceId,
    videoRef.value,
    (result, _err) => {
      if (result) {
        const scannedText = result.getText()?.trim();
        if (scannedText) {
          playBeep();
          lookupMember(scannedText);
        }
      }
    }
  );
};

const toggleCamera = () => {
  if (availableCameras.value.length <= 1) return;
  currentCameraIndex.value = (currentCameraIndex.value + 1) % availableCameras.value.length;
  decodeCurrentDevice();
};

const stopCamera = () => {
  if (codeReader) {
    codeReader.reset();
  }
  isCameraActive.value = false;
};

const lookupMember = async (token?: string) => {
  const t = (token || tokenInput.value).trim();
  if (!t || !activeStore.value) return;
  isLookingUp.value = true;
  errorMessage.value = '';
  successPurchase.value = null;
  successRedemption.value = null;

  try {
    const data = await adminApi.lookupMember(t, activeStore.value.id);
    memberData.value = data;
    tokenInput.value = t;
    if (data.catalog_options && data.catalog_options.length > 0) {
      selectedRewardProduct.value = data.catalog_options[0].name;
    }
    stopCamera();
  } catch (err: any) {
    errorMessage.value = err.message || 'No se pudo identificar el socio con este código.';
  } finally {
    isLookingUp.value = false;
  }
};

const clearMember = () => {
  memberData.value = null;
  tokenInput.value = '';
  invoiceRef.value = '';
  grossAmount.value = null;
  discountAmount.value = null;
  errorMessage.value = '';
  successPurchase.value = null;
  successRedemption.value = null;
  selectedRewardProduct.value = '';
  customProductNote.value = '';
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

const submitMemberRedemption = async () => {
  if (!activeStore.value || !memberData.value) return;
  isSubmittingRedemption.value = true;
  errorMessage.value = '';
  successRedemption.value = null;

  const productNote = selectedRewardProduct.value === 'custom' 
    ? (customProductNote.value.trim() || 'Bebida a Elección del Barista')
    : selectedRewardProduct.value;

  try {
    const res = await adminApi.redeemMemberReward({
      customer_id: memberData.value.customer_id,
      store_id: activeStore.value.id,
      reward_id: memberData.value.available_reward_id || undefined,
      product_name_note: productNote
    });

    successRedemption.value = res;
    // Disminuir contador local de recompensas
    if (memberData.value) {
      memberData.value.available_rewards_count = Math.max(0, memberData.value.available_rewards_count - 1);
      memberData.value.has_available_reward = memberData.value.available_rewards_count > 0;
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'Error al canjear cortesía';
  } finally {
    isSubmittingRedemption.value = false;
  }
};

const submitPurchase = async () => {
  if (!activeStore.value) return;
  isSubmittingPurchase.value = true;
  errorMessage.value = '';
  successPurchase.value = null;

  const token = memberData.value 
    ? `cfy_member_${memberData.value.customer_id}` 
    : tokenInput.value.trim();

  try {
    const res = await adminApi.createPurchase({
      qr_token: token,
      store_id: activeStore.value.id,
      receipt_reference: invoiceRef.value.trim(),
      gross_amount: grossAmount.value || 0,
      discount_amount: discountAmount.value || 0,
      currency: 'COP',
      payment_method: paymentMethod.value,
      customer_doc_number: customerDocNumber.value.trim() || undefined
    });

    successPurchase.value = res;
    if (memberData.value && res.allocation && res.allocation.length > 0) {
      const lastAlloc = res.allocation[res.allocation.length - 1];
      memberData.value.active_card.stamps_count = lastAlloc.total_in_card;
      memberData.value.active_card.cycle_number = lastAlloc.card_cycle;
      if (res.rewards_issued && res.rewards_issued.length > 0) {
        memberData.value.has_available_reward = true;
        memberData.value.available_rewards_count += res.rewards_issued.length;
      }
    }
    invoiceRef.value = '';
    grossAmount.value = null;
    discountAmount.value = null;
  } catch (err: any) {
    errorMessage.value = err.message || 'Error procesando compra';
  } finally {
    isSubmittingPurchase.value = false;
  }
};

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

onMounted(() => {
  loadStores();
});

onUnmounted(() => {
  stopCamera();
});
</script>
