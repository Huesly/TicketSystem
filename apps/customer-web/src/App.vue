<template>
  <div 
    class="min-h-dvh-safe flex flex-col max-w-md mx-auto bg-[#F9F7F5] border-x border-[#E3DAD2] relative text-[#3E2B1E] font-sans"
    :class="currentUser ? 'pb-20' : ''"
  >
    <!-- ===================================================================== -->
    <!-- ESTADO 1: VERIFICANDO SESIÓN INICIAL (SKELETON / LOADING ELEGANTE)    -->
    <!-- ===================================================================== -->
    <div v-if="loadingAuth" class="min-h-dvh-safe flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div class="w-14 h-14 rounded-2xl bg-[#5D4432] text-[#E9E3DD] flex items-center justify-center border border-[#3E2B1E] shadow-sm animate-pulse">
        <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
          <line x1="6" y1="2" x2="6" y2="4" />
          <line x1="10" y1="2" x2="10" y2="4" />
          <line x1="14" y1="2" x2="14" y2="4" />
        </svg>
      </div>
      <div class="space-y-1">
        <h3 class="font-extrabold text-base text-[#3E2B1E]">TicketsDemo</h3>
        <p class="text-xs text-[#786558] font-medium">Cargando tu tarjeta de fidelidad...</p>
      </div>
    </div>

    <!-- ===================================================================== -->
    <!-- ESTADO 2: NO AUTENTICADO -> PANTALLA COMPLETA DE LOGIN / REGISTRO     -->
    <!-- ===================================================================== -->
    <div v-else-if="!currentUser" class="min-h-dvh-safe flex-1 flex flex-col justify-center p-6 space-y-6">
      <!-- Marca / Encabezado -->
      <div class="text-center space-y-2">
        <div class="w-14 h-14 rounded-2xl bg-[#5D4432] text-[#E9E3DD] flex items-center justify-center mx-auto border border-[#3E2B1E] shadow-sm">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
            <line x1="6" y1="2" x2="6" y2="4" />
            <line x1="10" y1="2" x2="10" y2="4" />
            <line x1="14" y1="2" x2="14" y2="4" />
          </svg>
        </div>
        <h1 class="text-xl font-extrabold text-[#3E2B1E] tracking-tight">TicketsDemo</h1>
        <p class="text-xs text-[#786558] max-w-xs mx-auto leading-relaxed">
          Tu tarjeta digital de fidelidad. Acumula sellos en cada compra de café de especialidad y canjea premios.
        </p>
      </div>

      <!-- Tarjeta Contenedora de Autenticación -->
      <div class="bg-white rounded-2xl p-6 border border-[#E3DAD2] shadow-sm space-y-5">
        <!-- Selector de Pestañas -->
        <div class="grid grid-cols-2 gap-1 bg-[#F9F7F5] p-1 rounded-xl border border-[#E3DAD2]">
          <button
            type="button"
            @click="authTab = 'login'; authError = ''"
            class="text-xs font-bold py-2 rounded-lg transition cursor-pointer"
            :class="authTab === 'login' ? 'bg-[#5D4432] text-white shadow-2xs' : 'text-[#786558] hover:text-[#3E2B1E]'"
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            @click="authTab = 'register'; authError = ''"
            class="text-xs font-bold py-2 rounded-lg transition cursor-pointer"
            :class="authTab === 'register' ? 'bg-[#5D4432] text-white shadow-2xs' : 'text-[#786558] hover:text-[#3E2B1E]'"
          >
            Crear Cuenta
          </button>
        </div>

        <!-- Alerta de Error -->
        <div v-if="authError" class="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <svg class="w-4 h-4 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ authError }}</span>
        </div>

        <!-- FORMULARIO 1: INICIAR SESIÓN -->
        <form v-if="authTab === 'login'" @submit.prevent="handleLogin" class="space-y-4">
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-[#3E2B1E]">Correo Electrónico</label>
            <input
              v-model="loginEmail"
              type="email"
              required
              autocomplete="email"
              placeholder="tu.correo@ejemplo.com"
              class="w-full bg-[#F9F7F5] border border-[#E3DAD2] focus:border-[#5D4432] focus:ring-1 focus:ring-[#5D4432] rounded-xl px-3.5 py-2.5 text-xs text-[#3E2B1E] placeholder-[#A6978C] outline-none transition"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-[#3E2B1E]">Contraseña</label>
            <input
              v-model="loginPassword"
              type="password"
              required
              autocomplete="current-password"
              placeholder="••••••••"
              class="w-full bg-[#F9F7F5] border border-[#E3DAD2] focus:border-[#5D4432] focus:ring-1 focus:ring-[#5D4432] rounded-xl px-3.5 py-2.5 text-xs text-[#3E2B1E] placeholder-[#A6978C] outline-none transition"
            />
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-[#5D4432] hover:bg-[#473325] disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer shadow-sm active:scale-95 flex items-center justify-center gap-2"
          >
            <svg v-if="isSubmitting" class="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
            </svg>
            <span>{{ isSubmitting ? 'Verificando...' : 'Entrar a mi Tarjeta' }}</span>
          </button>
        </form>

        <!-- FORMULARIO 2: CREAR CUENTA -->
        <form v-else @submit.prevent="handleRegister" class="space-y-3.5">
          <div class="space-y-1">
            <label class="block text-xs font-bold text-[#3E2B1E]">Nombre y Apellido</label>
            <input
              v-model="regFullName"
              type="text"
              required
              autocomplete="name"
              placeholder="Ej. Andrés Morales"
              class="w-full bg-[#F9F7F5] border border-[#E3DAD2] focus:border-[#5D4432] focus:ring-1 focus:ring-[#5D4432] rounded-xl px-3.5 py-2.5 text-xs text-[#3E2B1E] placeholder-[#A6978C] outline-none transition"
            />
          </div>

          <div class="space-y-1">
            <label class="block text-xs font-bold text-[#3E2B1E]">Correo Electrónico</label>
            <input
              v-model="regEmail"
              type="email"
              required
              autocomplete="email"
              placeholder="tu.correo@ejemplo.com"
              class="w-full bg-[#F9F7F5] border border-[#E3DAD2] focus:border-[#5D4432] focus:ring-1 focus:ring-[#5D4432] rounded-xl px-3.5 py-2.5 text-xs text-[#3E2B1E] placeholder-[#A6978C] outline-none transition"
            />
          </div>

          <div class="space-y-1">
            <label class="block text-xs font-bold text-[#3E2B1E]">Teléfono Móvil (Opcional)</label>
            <input
              v-model="regPhone"
              type="tel"
              autocomplete="tel"
              placeholder="300 123 4567"
              class="w-full bg-[#F9F7F5] border border-[#E3DAD2] focus:border-[#5D4432] focus:ring-1 focus:ring-[#5D4432] rounded-xl px-3.5 py-2.5 text-xs text-[#3E2B1E] placeholder-[#A6978C] outline-none transition"
            />
          </div>

          <div class="space-y-1">
            <label class="block text-xs font-bold text-[#3E2B1E]">Contraseña</label>
            <input
              v-model="regPassword"
              type="password"
              required
              minlength="6"
              autocomplete="new-password"
              placeholder="Mínimo 6 caracteres"
              class="w-full bg-[#F9F7F5] border border-[#E3DAD2] focus:border-[#5D4432] focus:ring-1 focus:ring-[#5D4432] rounded-xl px-3.5 py-2.5 text-xs text-[#3E2B1E] placeholder-[#A6978C] outline-none transition"
            />
          </div>

          <p class="text-[10px] text-[#786558] leading-tight">
            Al registrarte se creará automáticamente tu tarjeta digital en el Ciclo 1 con 8 sellos.
          </p>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-[#5D4432] hover:bg-[#473325] disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer shadow-sm active:scale-95 flex items-center justify-center gap-2"
          >
            <svg v-if="isSubmitting" class="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
            </svg>
            <span>{{ isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta y Obtener Tarjeta' }}</span>
          </button>
        </form>
      </div>

      <div class="text-center">
        <span class="text-[11px] text-[#786558] font-medium">Sedes disponibles en Cabecera y Cañaveral</span>
      </div>
    </div>

    <!-- ===================================================================== -->
    <!-- ESTADO 3: AUTENTICADO -> APLICACIÓN PRINCIPAL                         -->
    <!-- ===================================================================== -->
    <template v-else>
      <!-- Barra Superior Compacta (< 12% viewport height) -->
      <header class="bg-white/95 backdrop-blur-md text-[#3E2B1E] px-4 h-14 flex items-center justify-between sticky top-0 z-30 border-b border-[#E3DAD2]">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-[#5D4432] text-[#E9E3DD] flex items-center justify-center shrink-0 border border-[#3E2B1E] shadow-2xs">
            <!-- SVG: Local Cafe -->
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
              <line x1="6" y1="2" x2="6" y2="4" />
              <line x1="10" y1="2" x2="10" y2="4" />
              <line x1="14" y1="2" x2="14" y2="4" />
            </svg>
          </div>
          <div>
            <span class="font-extrabold text-xs sm:text-sm leading-tight tracking-tight block text-[#3E2B1E]">TicketsDemo</span>
            <span class="text-[9px] text-[#786558] font-medium block">Tarjeta de fidelidad</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Acceso a Mi Cuenta -->
          <router-link 
            to="/cuenta"
            class="bg-[#F9F7F5] hover:bg-white text-[#3E2B1E] text-[11px] font-bold px-3 py-1.5 rounded-full border border-[#E3DAD2] transition flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
            title="Ver mi perfil y cuenta"
          >
            <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span class="max-w-[100px] truncate">{{ currentUser.full_name.split(' ')[0] }}</span>
            <svg class="w-3.5 h-3.5 text-[#786558]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>
            </svg>
          </router-link>
        </div>
      </header>

      <!-- Contenido Principal Líquido -->
      <main class="flex-1 p-5 fluid-container">
        <router-view />
      </main>

      <!-- Barra de Navegación Inferior Compacta (4 pestañas) -->
      <nav class="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-[#E3DAD2] px-3 h-14 flex items-center justify-around z-30 shadow-lg" aria-label="Navegación inferior">
        <router-link 
          to="/" 
          class="flex flex-col items-center gap-0.5 text-[11px] font-semibold transition py-1 px-3 rounded-xl" 
          :class="$route.name === 'home' ? 'text-[#3E2B1E] font-bold bg-[#E9E3DD]/80 border border-[#D0C6BE] shadow-2xs' : 'text-[#786558] hover:text-[#3E2B1E]'"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span>Inicio</span>
        </router-link>

        <router-link 
          to="/mi-tarjeta" 
          class="flex flex-col items-center gap-0.5 text-[11px] font-semibold transition py-1 px-3 rounded-xl" 
          :class="$route.name === 'card' ? 'text-[#3E2B1E] font-bold bg-[#E9E3DD]/80 border border-[#D0C6BE] shadow-2xs' : 'text-[#786558] hover:text-[#3E2B1E]'"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
          </svg>
          <span>Tarjeta</span>
        </router-link>

        <router-link 
          to="/recompensas" 
          class="flex flex-col items-center gap-0.5 text-[11px] font-semibold transition py-1 px-3 rounded-xl" 
          :class="$route.name === 'rewards' ? 'text-[#3E2B1E] font-bold bg-[#E9E3DD]/80 border border-[#D0C6BE] shadow-2xs' : 'text-[#786558] hover:text-[#3E2B1E]'"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
            <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>
          </svg>
          <span>Premios</span>
        </router-link>

        <router-link 
          to="/cuenta" 
          class="flex flex-col items-center gap-0.5 text-[11px] font-semibold transition py-1 px-3 rounded-xl" 
          :class="$route.name === 'profile' ? 'text-[#3E2B1E] font-bold bg-[#E9E3DD]/80 border border-[#D0C6BE] shadow-2xs' : 'text-[#786558] hover:text-[#3E2B1E]'"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>
          </svg>
          <span>Cuenta</span>
        </router-link>
      </nav>

      <!-- Modal de Autenticación / Registro (Secundario) -->
      <AuthModal 
        :is-open="showAuthModal" 
        @close="showAuthModal = false" 
        @authenticated="checkAuth"
      />
    </template>

    <!-- Modal de Código QR Minimalista (Disponible cuando hay sesión activa) -->
    <div v-if="currentUser && showQrModal" class="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="qr-dialog-title">
      <div class="bg-white rounded-2xl border border-stone-300 p-6 w-full max-w-sm text-center shadow-xl space-y-4">
        
        <!-- ESTADO 1: CELEBRACIÓN EN TIEMPO REAL AL ESCANEAR EL CAJERO -->
        <div v-if="consumedSuccess" class="py-4 space-y-3.5 animate-in fade-in zoom-in-95 duration-300">
          <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-2 border-emerald-300 shadow-sm animate-bounce">
            <!-- Google Material Icon: Check Circle -->
            <svg class="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          </div>

          <div class="space-y-1">
            <span class="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              ¡Operación Confirmada en Caja!
            </span>
            <h3 class="font-extrabold text-stone-950 text-lg leading-tight">
              +{{ consumedSuccess.stamps_awarded }} {{ consumedSuccess.stamps_awarded === 1 ? 'Sello Sumado' : 'Sellos Sumados' }}
            </h3>
            <p class="text-xs text-stone-600 font-medium">
              Registrado en <strong>{{ consumedSuccess.store_name }}</strong>
            </p>
          </div>

          <div class="bg-stone-50 rounded-xl p-3 border border-stone-200 text-xs text-stone-600 space-y-0.5 font-mono">
            <div>Factura: <strong>{{ consumedSuccess.receipt_reference }}</strong></div>
            <div v-if="consumedSuccess.gross_amount">Valor: ${{ consumedSuccess.gross_amount.toLocaleString('es-CO') }} COP</div>
          </div>

          <p class="text-[11px] text-stone-400 font-medium">
            Tu tarjeta digital se actualizó automáticamente.
          </p>
        </div>

        <!-- ESTADO 2: CÓDIGO QR ACTIVO Y EN ESPERA -->
        <template v-else>
          <!-- Encabezado del Modal -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              <span class="text-xs font-bold uppercase tracking-wider text-stone-600">Esperando escaneo en caja...</span>
            </div>
            <button 
              type="button"
              @click="closeQrModal" 
              class="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer transition"
              aria-label="Cerrar modal"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>

          <div class="space-y-1">
            <h3 id="qr-dialog-title" class="font-extrabold text-stone-900 text-base">Presenta este código en caja</h3>
            <p class="text-xs text-stone-500">El cajero escaneará tu código para sumar sellos automáticamente.</p>
          </div>

          <!-- Visor QR con Aspect Ratio Fijo (Prevención de CLS) -->
          <div class="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex flex-col items-center justify-center aspect-square w-full max-w-[220px] mx-auto shadow-inner relative">
            <div v-if="loadingQr" class="flex flex-col items-center gap-2 text-xs font-semibold text-stone-400">
              <div class="w-6 h-6 border-2 border-stone-900 border-t-transparent rounded-full animate-spin"></div>
              <span>Generando QR...</span>
            </div>

            <div v-else-if="qrExpired" class="space-y-3 text-center">
              <div class="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <p class="text-xs font-bold text-red-700">El código expiró</p>
              <button 
                type="button"
                @click="fetchQr" 
                class="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer transition"
              >
                Actualizar código
              </button>
            </div>

            <div v-else class="bg-white p-3 rounded-xl border border-stone-200 shadow-sm">
              <qrcode-vue 
                :value="qrToken" 
                :size="176" 
                level="M" 
                render-as="svg"
              />
            </div>
          </div>

          <!-- Acción para Copiar Token Manual -->
          <div class="space-y-2">
            <button 
              v-if="!qrExpired && qrToken"
              type="button"
              @click="copyToken"
              class="w-full text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-300 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path v-if="copied" d="M20 6 9 17l-5-5"/>
                <template v-else>
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </template>
              </svg>
              <span>{{ copied ? 'Token copiado al portapapeles' : 'Copiar token manual' }}</span>
            </button>

            <div class="flex items-center justify-center gap-2 text-xs font-medium text-stone-500 pt-1">
              <span class="w-2 h-2 rounded-full" :class="timeLeft > 15 ? 'bg-emerald-600' : 'bg-red-600 animate-ping'"></span>
              <span>Expira en <strong class="text-stone-900 font-mono">{{ timeLeft }}s</strong></span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import QrcodeVue from 'qrcode.vue';
import { api, type CustomerProfile } from './api';
import AuthModal from './components/AuthModal.vue';

const loadingAuth = ref(true);
const showAuthModal = ref(false);
const currentUser = ref<CustomerProfile | null>(null);

const authTab = ref<'login' | 'register'>('login');
const isSubmitting = ref(false);
const authError = ref('');

const loginEmail = ref('');
const loginPassword = ref('');

const regFullName = ref('');
const regEmail = ref('');
const regPhone = ref('');
const regPassword = ref('');

const showQrModal = ref(false);
const qrToken = ref('');
const timeLeft = ref(60);
const qrExpired = ref(false);
const loadingQr = ref(false);
const copied = ref(false);
const consumedSuccess = ref<{ store_name: string; receipt_reference: string; stamps_awarded: number; gross_amount: number } | null>(null);

let timer: any = null;
let pollTimer: any = null;

const playSuccessChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      const audioCtx = new AudioContextClass();
      const now = audioCtx.currentTime;

      // Nota 1 (Mi 659 Hz)
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.25);

      // Nota 2 (Sol# 830 Hz)
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(830.61, now + 0.12);
      gain2.gain.setValueAtTime(0.25, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.45);

      // Nota 3 (Si 987 Hz - acorde alegre)
      const osc3 = audioCtx.createOscillator();
      const gain3 = audioCtx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(987.77, now + 0.24);
      gain3.gain.setValueAtTime(0.3, now + 0.24);
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
      osc3.connect(gain3);
      gain3.connect(audioCtx.destination);
      osc3.start(now + 0.24);
      osc3.stop(now + 0.75);
    }
    if ('vibrate' in navigator) {
      navigator.vibrate([80, 40, 120]);
    }
  } catch {
    // Ignore audio restriction
  }
};

const checkAuth = async () => {
  try {
    const auth = await api.getAuthMe();
    if (auth && auth.user) {
      currentUser.value = auth.user;
    } else {
      currentUser.value = null;
    }
  } catch {
    currentUser.value = null;
  } finally {
    loadingAuth.value = false;
  }
};

const handleLogin = async () => {
  authError.value = '';
  if (!loginEmail.value || !loginPassword.value) {
    authError.value = 'Por favor ingresa tu correo y contraseña.';
    return;
  }
  isSubmitting.value = true;
  try {
    const res = await api.login(loginEmail.value, loginPassword.value);
    currentUser.value = res.user;
    loginPassword.value = '';
    window.dispatchEvent(new CustomEvent('confy-user-changed'));
  } catch (err: any) {
    authError.value = err.message || 'Error al iniciar sesión';
  } finally {
    isSubmitting.value = false;
  }
};

const handleRegister = async () => {
  authError.value = '';
  if (!regFullName.value || !regEmail.value || !regPassword.value) {
    authError.value = 'Por favor completa todos los campos obligatorios.';
    return;
  }
  if (regPassword.value.length < 6) {
    authError.value = 'La contraseña debe tener mínimo 6 caracteres.';
    return;
  }
  isSubmitting.value = true;
  try {
    const res = await api.register(regFullName.value, regEmail.value, regPassword.value, regPhone.value || undefined);
    currentUser.value = res.user;
    regPassword.value = '';
    window.dispatchEvent(new CustomEvent('confy-user-changed'));
  } catch (err: any) {
    authError.value = err.message || 'Error al registrar tu cuenta';
  } finally {
    isSubmitting.value = false;
  }
};

const startStatusPolling = (token: string) => {
  clearInterval(pollTimer);
  pollTimer = setInterval(async () => {
    if (!showQrModal.value || qrExpired.value || !token) {
      clearInterval(pollTimer);
      return;
    }
    try {
      const res = await api.checkQrStatus(token);
      if (res.status === 'CONSUMED') {
        clearInterval(pollTimer);
        clearInterval(timer);
        playSuccessChime();
        consumedSuccess.value = res.purchase || {
          store_name: 'Sede Principal',
          receipt_reference: 'Comprobante',
          stamps_awarded: 1,
          gross_amount: 0
        };
        // Notificar a las pantallas hijas para refrescar sellos inmediatamente
        window.dispatchEvent(new CustomEvent('confy-user-changed'));

        // Cerrar modal automáticamente después de celebrar
        setTimeout(() => {
          showQrModal.value = false;
          consumedSuccess.value = null;
        }, 3200);
      } else if (res.status === 'EXPIRED') {
        qrExpired.value = true;
        clearInterval(pollTimer);
      }
    } catch {
      // Ignorar reintentos de red silenciosamente
    }
  }, 1200);
};

const fetchQr = async () => {
  loadingQr.value = true;
  qrExpired.value = false;
  consumedSuccess.value = null;
  clearInterval(pollTimer);

  try {
    const data = await api.generatePurchaseQr();
    qrToken.value = data.qr_token;
    timeLeft.value = data.expires_in_seconds || 60;
    
    clearInterval(timer);
    timer = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;
      } else {
        qrExpired.value = true;
        clearInterval(timer);
        clearInterval(pollTimer);
      }
    }, 1000);

    // Iniciar sondeo reactivo
    startStatusPolling(data.qr_token);
  } catch (err) {
    console.error('Error al generar QR:', err);
    qrToken.value = 'ERROR-TOKEN';
  } finally {
    loadingQr.value = false;
  }
};

const openQrModal = () => {
  showQrModal.value = true;
  consumedSuccess.value = null;
  fetchQr();
};

const closeQrModal = () => {
  showQrModal.value = false;
  consumedSuccess.value = null;
  clearInterval(timer);
  clearInterval(pollTimer);
};

const copyToken = async () => {
  if (!qrToken.value) return;
  await navigator.clipboard.writeText(qrToken.value);
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 2000);
};

const handleOpenAuth = () => {
  showAuthModal.value = true;
};

onMounted(() => {
  checkAuth();
  window.addEventListener('confy-user-changed', checkAuth);
  window.addEventListener('open-auth-modal', handleOpenAuth);
  window.addEventListener('open-qr-modal', openQrModal);
});

onUnmounted(() => {
  clearInterval(timer);
  clearInterval(pollTimer);
  window.removeEventListener('confy-user-changed', checkAuth);
  window.removeEventListener('open-auth-modal', handleOpenAuth);
  window.removeEventListener('open-qr-modal', openQrModal);
});
</script>
