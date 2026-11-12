<template>
  <div class="min-h-dvh-safe flex flex-col bg-stone-100 text-stone-900 selection:bg-stone-900 selection:text-white">
    <!-- PANTALLA DE ACCESO AL SISTEMA POS SI NO HAY SESIÓN -->
    <div v-if="!currentUser" class="flex-1 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl border border-stone-300 p-6 sm:p-8 w-full max-w-sm shadow-xl space-y-5">
        <div class="text-center space-y-1.5">
          <div class="w-11 h-11 rounded-2xl bg-stone-900 text-amber-300 flex items-center justify-center mx-auto mb-2 border border-stone-800 shadow-md">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
              <line x1="6" y1="2" x2="6" y2="4" />
              <line x1="10" y1="2" x2="10" y2="4" />
              <line x1="14" y1="2" x2="14" y2="4" />
            </svg>
          </div>
          <h2 class="text-lg font-extrabold text-stone-950">PosDemo Terminal</h2>
          <p class="text-xs text-stone-500 font-medium">Acceso para Cajeros y Administradores</p>
        </div>

        <!-- Selector de Modo: Iniciar Turno vs Registrar Personal -->
        <div class="flex p-1 bg-stone-100 rounded-xl border border-stone-200">
          <button 
            type="button" 
            @click="authMode = 'login'; authError = ''"
            class="flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer"
            :class="authMode === 'login' ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-500 hover:text-stone-900'"
          >
            Iniciar Turno
          </button>
          <button 
            type="button" 
            @click="authMode = 'register'; authError = ''"
            class="flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer"
            :class="authMode === 'register' ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-500 hover:text-stone-900'"
          >
            Registrar Personal
          </button>
        </div>

        <!-- Alerta de error -->
        <div v-if="authError" class="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
          {{ authError }}
        </div>

        <!-- Formulario Iniciar Turno (Login) -->
        <form v-if="authMode === 'login'" @submit.prevent="handleLogin" class="space-y-3">
          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Correo Electrónico</label>
            <input 
              v-model="loginEmail" 
              type="email" 
              required 
              autocomplete="username"
              autocapitalize="none"
              spellcheck="false"
              placeholder="tu.correo@confy.com.co"
              class="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-stone-50 text-stone-900"
            />
          </div>
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-bold text-stone-700">Contraseña</label>
              <button 
                type="button" 
                @click="openForgotPassword"
                class="text-[11px] text-stone-500 hover:text-stone-900 font-semibold underline cursor-pointer"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <input 
              v-model="loginPassword" 
              type="password" 
              required 
              autocomplete="current-password"
              placeholder="••••••••"
              class="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-stone-50 text-stone-900"
            />
          </div>

          <div v-if="loginSuccessMessage" class="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
            {{ loginSuccessMessage }}
          </div>

          <button 
            type="submit" 
            :disabled="authLoading"
            class="w-full bg-stone-900 hover:bg-stone-800 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl border border-stone-900 transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            <span v-if="authLoading" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{{ authLoading ? 'Validando...' : 'Iniciar Turno' }}</span>
          </button>
        </form>

        <!-- Formulario Recuperar Contraseña (OTP por Correo) -->
        <div v-else-if="authMode === 'forgot'" class="space-y-4">
          <!-- Paso 1: Solicitar Código OTP -->
          <form v-if="recoveryStep === 1" @submit.prevent="handleRequestOtp" class="space-y-3">
            <div class="text-center space-y-1 pb-1">
              <h3 class="text-sm font-extrabold text-stone-900">Recuperar Contraseña</h3>
              <p class="text-xs text-stone-500">Ingresa tu correo registrado para recibir un código de seguridad de 6 dígitos.</p>
            </div>

            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Correo Registrado</label>
              <input 
                v-model="recoveryEmail" 
                type="email" 
                required 
                autocomplete="email"
                placeholder="tu.correo@confy.com.co"
                class="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-stone-50 text-stone-900"
              />
            </div>

            <button 
              type="submit" 
              :disabled="authLoading"
              class="w-full bg-stone-900 hover:bg-stone-800 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl border border-stone-900 transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <span v-if="authLoading" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{{ authLoading ? 'Enviando código...' : 'Enviar Código al Correo' }}</span>
            </button>

            <div class="text-center pt-1">
              <button 
                type="button" 
                @click="authMode = 'login'; authError = ''" 
                class="text-xs font-semibold text-stone-500 hover:text-stone-900 cursor-pointer"
              >
                Volver a Iniciar Turno
              </button>
            </div>
          </form>

          <!-- Paso 2: Verificar Código OTP y Definir Nueva Contraseña -->
          <form v-else @submit.prevent="handleResetPassword" class="space-y-3">
            <div class="text-center space-y-1 pb-1">
              <h3 class="text-sm font-extrabold text-stone-900">Verificar Identidad</h3>
              <p class="text-xs text-stone-500">
                Código enviado a <strong class="text-stone-800 font-mono">{{ recoveryEmail }}</strong>
              </p>
            </div>

            <!-- Banner Dev Code si aplica para pruebas rápidas -->
            <div v-if="recoveryDevCode" class="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center justify-between">
              <span>Código generado: <strong class="font-mono text-sm tracking-widest">{{ recoveryDevCode }}</strong></span>
              <button 
                type="button" 
                @click="recoveryCode = recoveryDevCode" 
                class="text-[10px] font-bold underline cursor-pointer text-amber-800"
              >
                Autocompletar
              </button>
            </div>

            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Código de Seguridad (6 dígitos)</label>
              <input 
                v-model="recoveryCode" 
                type="text" 
                required 
                maxlength="6"
                placeholder="123456"
                class="w-full text-center text-lg font-black tracking-widest font-mono py-2 rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-stone-50 text-stone-900"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Nueva Contraseña (mínimo 6 caracteres)</label>
              <input 
                v-model="newPassword" 
                type="password" 
                required 
                minlength="6"
                placeholder="••••••••"
                class="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-stone-50 text-stone-900"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Confirmar Nueva Contraseña</label>
              <input 
                v-model="confirmPassword" 
                type="password" 
                required 
                minlength="6"
                placeholder="••••••••"
                class="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-stone-50 text-stone-900"
              />
            </div>

            <button 
              type="submit" 
              :disabled="authLoading"
              class="w-full bg-stone-900 hover:bg-stone-800 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl border border-stone-900 transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <span v-if="authLoading" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{{ authLoading ? 'Actualizando...' : 'Restablecer Contraseña' }}</span>
            </button>

            <div class="flex items-center justify-between text-xs pt-1">
              <button 
                type="button" 
                @click="recoveryStep = 1; authError = ''" 
                class="text-stone-500 hover:text-stone-900 font-semibold cursor-pointer"
              >
                ← Cambiar correo
              </button>
              <button 
                type="button" 
                @click="handleRequestOtp" 
                class="text-stone-700 hover:text-stone-950 font-bold underline cursor-pointer"
              >
                Reenviar código
              </button>
            </div>
          </form>
        </div>

        <!-- Formulario Registrar Personal (Staff Register) -->
        <form v-else @submit.prevent="handleRegisterStaff" class="space-y-3">
          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Nombre Completo</label>
            <input 
              v-model="regName" 
              type="text" 
              required 
              autocomplete="name"
              placeholder="Ej: Laura Martínez"
              class="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-stone-50 text-stone-900"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Correo Corporativo</label>
            <input 
              v-model="regEmail" 
              type="email" 
              required 
              autocomplete="email"
              autocapitalize="none"
              spellcheck="false"
              placeholder="laura.admin@confy.com.co"
              class="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-stone-50 text-stone-900"
            />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Rol</label>
              <select
                v-model="regRole"
                class="w-full text-xs px-2.5 py-2 rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-stone-50 text-stone-900 font-semibold"
              >
                <option value="GENERAL_ADMIN">Admin General</option>
                <option value="CASHIER">Cajero POS</option>
                <option value="STORE_ADMIN">Admin Sede</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Sede</label>
              <select
                v-model="regStoreId"
                class="w-full text-xs px-2.5 py-2 rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-stone-50 text-stone-900 font-semibold"
              >
                <option value="87c69994-6e69-425b-8cb0-b08be5f97371">Cabecera</option>
                <option value="bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb">Centro</option>
                <option value="cccccccc-cccc-cccc-cccc-cccccccccccc">Cañaveral</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Contraseña (mínimo 6 caracteres)</label>
            <input 
              v-model="regPassword" 
              type="password" 
              required 
              minlength="6"
              autocomplete="new-password"
              placeholder="••••••••"
              class="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-stone-50 text-stone-900"
            />
          </div>

          <button 
            type="submit" 
            :disabled="authLoading"
            class="w-full bg-stone-900 hover:bg-stone-800 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl border border-stone-900 transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            <span v-if="authLoading" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{{ authLoading ? 'Creando...' : 'Crear Cuenta y Acceder' }}</span>
          </button>
        </form>
      </div>
    </div>

    <!-- SISTEMA POS AUTENTICADO -->
    <template v-else>
      <!-- Barra Superior Compacta y Adaptada a Mobile (< 12% viewport height) -->
      <header class="bg-white text-stone-900 px-3 sm:px-6 h-14 flex items-center justify-between border-b border-stone-200 sticky top-0 z-40">
        <!-- Logo y Marca -->
        <div class="flex items-center gap-2 sm:gap-3 shrink-0">
          <div class="w-8 h-8 rounded-lg bg-stone-900 text-amber-300 flex items-center justify-center shrink-0 shadow-xs">
            <!-- Icono SVG: Local Cafe -->
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
              <line x1="6" y1="2" x2="6" y2="4" />
              <line x1="10" y1="2" x2="10" y2="4" />
              <line x1="14" y1="2" x2="14" y2="4" />
            </svg>
          </div>
          <div class="flex items-baseline gap-1.5 sm:gap-2">
            <span class="font-extrabold text-sm tracking-tight text-stone-950">PosDemo</span>
            <span class="text-[11px] font-mono font-medium text-stone-500 hidden md:inline">Terminal POS &amp; Admin</span>
          </div>
        </div>

        <!-- Navegación y Acciones Adaptadas a Mobile -->
        <nav class="flex items-center gap-1 sm:gap-1.5" aria-label="Navegación principal">
          <!-- Botón Terminal -->
          <router-link 
            to="/" 
            class="text-[11px] sm:text-xs font-semibold px-2 sm:px-3 py-1.5 rounded-lg transition flex items-center gap-1 sm:gap-1.5 border"
            :class="$route.name === 'cashier' 
              ? 'bg-stone-900 text-white border-stone-900 shadow-xs' 
              : 'bg-transparent text-stone-600 border-transparent hover:bg-stone-100 hover:border-stone-300 hover:text-stone-900'"
          >
            <!-- SVG: Point of Sale / Terminal -->
            <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect width="20" height="14" x="2" y="3" rx="2" />
              <line x1="8" x2="16" y1="21" y2="21" />
              <line x1="12" x2="12" y1="17" y2="21" />
            </svg>
            <span class="hidden xs:inline">Terminal</span>
          </router-link>

          <!-- Botón Analítica -->
          <router-link 
            to="/dashboard" 
            class="text-[11px] sm:text-xs font-semibold px-2 sm:px-3 py-1.5 rounded-lg transition flex items-center gap-1 sm:gap-1.5 border"
            :class="$route.name === 'dashboard' 
              ? 'bg-stone-900 text-white border-stone-900 shadow-xs' 
              : 'bg-transparent text-stone-600 border-transparent hover:bg-stone-100 hover:border-stone-300 hover:text-stone-900'"
          >
            <!-- SVG: Bar Chart / Analytics -->
            <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" x2="18" y1="20" y2="10" />
              <line x1="12" x2="12" y1="20" y2="4" />
              <line x1="6" x2="6" y1="20" y2="14" />
            </svg>
            <span class="hidden xs:inline">Analítica</span>
          </router-link>

          <!-- Botón Banner de Novedades -->
          <router-link 
            to="/banners" 
            class="text-[11px] sm:text-xs font-semibold px-2 sm:px-3 py-1.5 rounded-lg transition flex items-center gap-1 sm:gap-1.5 border"
            :class="$route.name === 'banners' 
              ? 'bg-stone-900 text-white border-stone-900 shadow-xs' 
              : 'bg-transparent text-stone-600 border-transparent hover:bg-stone-100 hover:border-stone-300 hover:text-stone-900'"
          >
            <!-- SVG: Megaphone / Banner -->
            <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m3 11 18-5v12L3 14v-3z"/>
              <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
            </svg>
            <span class="hidden xs:inline">Banner</span>
          </router-link>

          <div class="h-4 w-px bg-stone-200 mx-0.5 sm:mx-1.5 hidden sm:block"></div>

          <!-- Perfil del Cajero / Admin Adaptado a Mobile -->
          <div class="flex items-center gap-1.5 bg-stone-50 border border-stone-300 px-2 py-1 rounded-lg">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
            <span class="text-[11px] text-stone-800 font-semibold hidden sm:inline max-w-[120px] truncate">{{ currentUser.full_name }}</span>
            <span class="text-[11px] text-stone-800 font-semibold sm:hidden max-w-[65px] truncate">{{ currentUser.full_name ? currentUser.full_name.split(' ')[0] : 'POS' }}</span>
            <span class="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-stone-200 text-stone-700 hidden md:inline">
              {{ currentRoles.includes('GENERAL_ADMIN') ? 'Admin' : 'Cajero' }}
            </span>
          </div>

          <!-- Botón Cambiar Contraseña -->
          <button 
            type="button"
            @click="openChangePasswordModal"
            title="Cambiar contraseña de mi cuenta"
            class="text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 p-1.5 rounded-lg border border-transparent hover:border-stone-300 transition cursor-pointer shrink-0"
          >
            <!-- SVG: Key / Password -->
            <svg class="w-4 h-4 text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="7.5" cy="15.5" r="5.5"/>
              <path d="m21 2-9.6 9.6"/>
              <path d="m15.5 7.5 3 3L22 7l-3-3"/>
            </svg>
          </button>

          <!-- Botón de Cerrar Turno -->
          <button 
            type="button"
            @click="logout"
            title="Cerrar turno y salir"
            class="text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 p-1.5 rounded-lg border border-transparent hover:border-stone-300 transition cursor-pointer shrink-0"
          >
            <svg class="w-4 h-4 text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </nav>
      </header>

      <!-- Contenedor Principal Líquido -->
      <main class="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 fluid-container">
        <router-view />
      </main>

      <!-- Modal Cambiar Contraseña desde el Perfil Autenticado -->
      <div v-if="showChangePasswordModal" class="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl border border-stone-300 p-6 w-full max-w-sm shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div class="flex items-center justify-between pb-1 border-b border-stone-100">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-800">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-extrabold text-stone-900">Seguridad de la Cuenta</h3>
                <p class="text-[11px] text-stone-500">Cambiar mi contraseña</p>
              </div>
            </div>
            <button 
              type="button" 
              @click="showChangePasswordModal = false" 
              class="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>

          <!-- Alertas de error o éxito -->
          <div v-if="changePasswordError" class="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
            {{ changePasswordError }}
          </div>
          <div v-if="changePasswordSuccess" class="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
            {{ changePasswordSuccess }}
          </div>

          <form @submit.prevent="handleChangePassword" class="space-y-3">
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Contraseña Actual</label>
              <input 
                v-model="currentPassword" 
                type="password" 
                required 
                placeholder="••••••••"
                class="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-stone-50 text-stone-900"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Nueva Contraseña (mínimo 6 caracteres)</label>
              <input 
                v-model="changeNewPassword" 
                type="password" 
                required 
                minlength="6"
                placeholder="••••••••"
                class="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-stone-50 text-stone-900"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Confirmar Nueva Contraseña</label>
              <input 
                v-model="changeConfirmPassword" 
                type="password" 
                required 
                minlength="6"
                placeholder="••••••••"
                class="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-stone-50 text-stone-900"
              />
            </div>

            <div class="grid grid-cols-2 gap-2 pt-2">
              <button 
                type="button" 
                @click="showChangePasswordModal = false" 
                class="w-full text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 py-2.5 rounded-xl border border-stone-300 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                :disabled="changePasswordLoading"
                class="w-full bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl border border-stone-900 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span v-if="changePasswordLoading" class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>{{ changePasswordLoading ? 'Guardando...' : 'Actualizar' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { adminApi, type AdminUser } from './api';

const currentUser = ref<AdminUser | null>(adminApi.getStoredUser());
const currentRoles = ref<string[]>(adminApi.getStoredRoles());

const authMode = ref<'login' | 'register' | 'forgot'>('login');
const authLoading = ref(false);
const authError = ref('');
const loginSuccessMessage = ref('');

const loginEmail = ref('');
const loginPassword = ref('');

// Campos de Registro de Personal
const regName = ref('');
const regEmail = ref('');
const regPassword = ref('');
const regRole = ref('GENERAL_ADMIN');
const regStoreId = ref('87c69994-6e69-425b-8cb0-b08be5f97371');

// Campos de Recuperación de Contraseña (OTP)
const recoveryStep = ref<1 | 2>(1);
const recoveryEmail = ref('');
const recoveryCode = ref('');
const recoveryDevCode = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

// Modal de Cambio de Contraseña (Perfil)
const showChangePasswordModal = ref(false);
const currentPassword = ref('');
const changeNewPassword = ref('');
const changeConfirmPassword = ref('');
const changePasswordLoading = ref(false);
const changePasswordError = ref('');
const changePasswordSuccess = ref('');

const checkSession = async () => {
  const me = await adminApi.getAuthMe();
  if (me) {
    currentUser.value = me.user;
    currentRoles.value = me.roles;
  } else {
    currentUser.value = null;
    currentRoles.value = [];
  }
};

const handleLogin = async () => {
  authLoading.value = true;
  authError.value = '';
  loginSuccessMessage.value = '';
  try {
    const res = await adminApi.login(loginEmail.value, loginPassword.value);
    currentUser.value = res.user;
    currentRoles.value = res.roles;
  } catch (err: any) {
    authError.value = err.message || 'Error al iniciar sesión';
  } finally {
    authLoading.value = false;
  }
};

const handleRegisterStaff = async () => {
  authLoading.value = true;
  authError.value = '';
  try {
    const res = await adminApi.registerStaff({
      full_name: regName.value.trim(),
      email: regEmail.value.trim(),
      password: regPassword.value,
      role: regRole.value,
      store_id: regStoreId.value
    });
    currentUser.value = res.user;
    currentRoles.value = res.roles;
  } catch (err: any) {
    authError.value = err.message || 'Error al registrar personal';
  } finally {
    authLoading.value = false;
  }
};

const openForgotPassword = () => {
  authMode.value = 'forgot';
  recoveryStep.value = 1;
  recoveryEmail.value = loginEmail.value.trim();
  recoveryCode.value = '';
  recoveryDevCode.value = '';
  newPassword.value = '';
  confirmPassword.value = '';
  authError.value = '';
  loginSuccessMessage.value = '';
};

const handleRequestOtp = async () => {
  if (!recoveryEmail.value) {
    authError.value = 'Ingresa tu correo electrónico registrado.';
    return;
  }
  authLoading.value = true;
  authError.value = '';
  try {
    const res = await adminApi.forgotPassword(recoveryEmail.value.trim());
    recoveryStep.value = 2;
    recoveryDevCode.value = res.dev_code || '';
    recoveryCode.value = res.dev_code || '';
  } catch (err: any) {
    authError.value = err.message || 'Error al solicitar el código';
  } finally {
    authLoading.value = false;
  }
};

const handleResetPassword = async () => {
  authError.value = '';
  if (!recoveryCode.value || recoveryCode.value.trim().length !== 6) {
    authError.value = 'Ingresa el código de 6 dígitos enviado a tu correo.';
    return;
  }
  if (!newPassword.value || newPassword.value.length < 6) {
    authError.value = 'La nueva contraseña debe tener al menos 6 caracteres.';
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    authError.value = 'Las contraseñas no coinciden.';
    return;
  }

  authLoading.value = true;
  try {
    const res = await adminApi.resetPassword({
      email: recoveryEmail.value.trim(),
      code: recoveryCode.value.trim(),
      new_password: newPassword.value
    });
    authMode.value = 'login';
    loginEmail.value = recoveryEmail.value.trim();
    loginPassword.value = '';
    loginSuccessMessage.value = res.message || 'Contraseña restablecida con éxito. Inicia turno con tu nueva clave.';
  } catch (err: any) {
    authError.value = err.message || 'Error al restablecer la contraseña';
  } finally {
    authLoading.value = false;
  }
};

const openChangePasswordModal = () => {
  currentPassword.value = '';
  changeNewPassword.value = '';
  changeConfirmPassword.value = '';
  changePasswordError.value = '';
  changePasswordSuccess.value = '';
  showChangePasswordModal.value = true;
};

const handleChangePassword = async () => {
  changePasswordError.value = '';
  changePasswordSuccess.value = '';

  if (!currentPassword.value) {
    changePasswordError.value = 'Ingresa tu contraseña actual.';
    return;
  }
  if (!changeNewPassword.value || changeNewPassword.value.length < 6) {
    changePasswordError.value = 'La nueva contraseña debe tener mínimo 6 caracteres.';
    return;
  }
  if (changeNewPassword.value !== changeConfirmPassword.value) {
    changePasswordError.value = 'Las nuevas contraseñas no coinciden.';
    return;
  }

  changePasswordLoading.value = true;
  try {
    const res = await adminApi.changePassword({
      current_password: currentPassword.value,
      new_password: changeNewPassword.value
    });
    changePasswordSuccess.value = res.message || 'Contraseña actualizada exitosamente.';
    currentPassword.value = '';
    changeNewPassword.value = '';
    changeConfirmPassword.value = '';
    setTimeout(() => {
      showChangePasswordModal.value = false;
    }, 1800);
  } catch (err: any) {
    changePasswordError.value = err.message || 'Error al actualizar contraseña';
  } finally {
    changePasswordLoading.value = false;
  }
};

const logout = () => {
  adminApi.logout();
  currentUser.value = null;
  currentRoles.value = [];
};

onMounted(() => {
  if (currentUser.value) {
    checkSession();
  }
});
</script>
