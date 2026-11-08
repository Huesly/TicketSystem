<template>
  <div v-if="isOpen" class="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
    <div class="bg-white rounded-2xl border border-stone-300 p-6 w-full max-w-sm shadow-xl space-y-4">
      <!-- Encabezado con pestañas -->
      <div class="flex items-center justify-between border-b border-stone-200 pb-3">
        <div class="flex gap-2">
          <button 
            type="button"
            @click="tab = 'login'; errorMsg = ''"
            class="text-xs font-bold px-3 py-1.5 rounded-lg transition border cursor-pointer"
            :class="tab === 'login' ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-100 text-stone-600 border-stone-200'"
          >
            Iniciar Sesión
          </button>
          <button 
            type="button"
            @click="tab = 'register'; errorMsg = ''"
            class="text-xs font-bold px-3 py-1.5 rounded-lg transition border cursor-pointer"
            :class="tab === 'register' ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-100 text-stone-600 border-stone-200'"
          >
            Crear Cuenta
          </button>
        </div>
        <button @click="$emit('close')" class="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer" aria-label="Cerrar">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>

      <!-- Mensaje de Error -->
      <div v-if="errorMsg" class="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
        {{ errorMsg }}
      </div>

      <!-- Formulario Login -->
      <form v-if="tab === 'login'" @submit.prevent="handleLogin" class="space-y-3">
        <div>
          <label class="block text-xs font-bold text-stone-700 mb-1">Correo Electrónico</label>
          <input 
            v-model="loginEmail" 
            type="email" 
            required 
            placeholder="ejemplo@correo.com"
            class="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-stone-50"
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-stone-700 mb-1">Contraseña</label>
          <input 
            v-model="loginPassword" 
            type="password" 
            required 
            placeholder="••••••••"
            class="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-stone-50"
          />
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>{{ loading ? 'Iniciando...' : 'Entrar' }}</span>
        </button>

        <!-- Acceso rápido Demo -->
        <div class="pt-2 border-t border-stone-200 text-center">
          <p class="text-[10px] text-stone-400 mb-2 font-medium">O prueba con la cuenta existente:</p>
          <button 
            type="button" 
            @click="quickLogin('camila.rodriguez@email.com', 'Cliente2026*')"
            class="text-[11px] font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 px-3 py-1.5 rounded-lg w-full transition cursor-pointer"
          >
            Entrar como Camila Rodríguez
          </button>
        </div>
      </form>

      <!-- Formulario Registro -->
      <form v-else @submit.prevent="handleRegister" class="space-y-3">
        <div>
          <label class="block text-xs font-bold text-stone-700 mb-1">Nombre Completo</label>
          <input 
            v-model="regName" 
            type="text" 
            required 
            placeholder="Juan Valdés"
            class="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-stone-50"
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-stone-700 mb-1">Correo Electrónico</label>
          <input 
            v-model="regEmail" 
            type="email" 
            required 
            placeholder="juan@cafe.com"
            class="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-stone-50"
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-stone-700 mb-1">Teléfono (WhatsApp)</label>
          <input 
            v-model="regPhone" 
            type="tel" 
            placeholder="+57 300 000 0000"
            class="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-stone-50"
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-stone-700 mb-1">Contraseña (mínimo 6 caracteres)</label>
          <input 
            v-model="regPassword" 
            type="password" 
            required 
            minlength="6"
            placeholder="••••••••"
            class="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-stone-50"
          />
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>{{ loading ? 'Registrando...' : 'Registrarme y Obtener Tarjeta' }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { api } from '../api';

defineProps<{ isOpen: boolean }>();
const emit = defineEmits<{ (e: 'close'): void; (e: 'authenticated'): void }>();

const tab = ref<'login' | 'register'>('login');
const loading = ref(false);
const errorMsg = ref('');

const loginEmail = ref('');
const loginPassword = ref('');

const regName = ref('');
const regEmail = ref('');
const regPhone = ref('');
const regPassword = ref('');

const handleLogin = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    await api.login(loginEmail.value, loginPassword.value);
    window.dispatchEvent(new CustomEvent('confy-user-changed'));
    emit('authenticated');
    emit('close');
  } catch (err: any) {
    errorMsg.value = err.message || 'Error al iniciar sesión';
  } finally {
    loading.value = false;
  }
};

const quickLogin = async (email: string, pass: string) => {
  loginEmail.value = email;
  loginPassword.value = pass;
  await handleLogin();
};

const handleRegister = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    await api.register(regName.value, regEmail.value, regPassword.value, regPhone.value);
    window.dispatchEvent(new CustomEvent('confy-user-changed'));
    emit('authenticated');
    emit('close');
  } catch (err: any) {
    errorMsg.value = err.message || 'Error en el registro';
  } finally {
    loading.value = false;
  }
};
</script>
