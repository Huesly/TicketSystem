<template>
  <div class="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
    <!-- Encabezado de la Sección -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-200 pb-4">
      <div>
        <div class="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-200 mb-1.5">
          <svg class="w-3.5 h-3.5 text-amber-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/>
            <path d="M7 7h.01"/>
          </svg>
          Marketing &amp; Novedades
        </div>
        <h1 class="text-xl sm:text-2xl font-black text-stone-950 tracking-tight">Banner de Cosecha &amp; Destacados</h1>
        <p class="text-xs sm:text-sm text-stone-600">
          Personaliza en tiempo real el saludo y anuncio destacado que ven los clientes en su tarjeta digital.
        </p>
      </div>

      <!-- Acciones de Cabecera -->
      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="loadBanner"
          :disabled="loading"
          class="px-3 py-2 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
        >
          <svg class="w-3.5 h-3.5" :class="{ 'animate-spin': loading }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
            <path d="M16 16h5v5"/>
          </svg>
          Refrescar
        </button>
      </div>
    </div>

    <!-- Alerta de Notificación (Éxito o Error) -->
    <div 
      v-if="feedbackMessage" 
      class="p-3.5 rounded-xl border text-xs font-medium flex items-center justify-between gap-3 transition-all duration-300"
      :class="feedbackType === 'success' 
        ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
        : 'bg-rose-50 border-rose-200 text-rose-900'"
    >
      <div class="flex items-center gap-2">
        <svg v-if="feedbackType === 'success'" class="w-4 h-4 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <svg v-else class="w-4 h-4 text-rose-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>{{ feedbackMessage }}</span>
      </div>
      <button type="button" @click="feedbackMessage = ''" class="text-stone-400 hover:text-stone-600 text-sm font-bold">×</button>
    </div>

    <!-- Cuadrícula Principal: Vista Previa en Vivo + Formulario de Control -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Columna Izquierda: Vista Previa en Vivo (45%) -->
      <div class="lg:col-span-5 space-y-4">
        <div class="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3.5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-stone-700 uppercase tracking-wider">Vista Previa Cliente</span>
            <span 
              class="text-[10px] font-bold px-2 py-0.5 rounded-full border font-mono"
              :class="form.status === 'active' 
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                : 'bg-stone-200 text-stone-600 border-stone-300'"
            >
              {{ form.status === 'active' ? '● En Vivo' : '○ Oculto' }}
            </span>
          </div>

          <!-- Tarjeta Móvil Real con Degradado Espresso -->
          <div class="bg-[#F9F7F5] p-3.5 rounded-2xl border border-[#E3DAD2] shadow-inner space-y-3">
            <div class="text-[11px] text-[#786558] font-medium flex items-center justify-between">
              <span>App Cliente Web / Móvil</span>
              <span>Pantalla Principal</span>
            </div>

            <div 
              class="bg-gradient-to-br from-[#2B1D14] via-[#3E2B1E] to-[#1B120C] text-white rounded-2xl p-4 border border-[#5D4432]/60 shadow-md flex items-center justify-between gap-4 transition-all duration-300"
              :class="{ 'opacity-40 grayscale': form.status === 'inactive' }"
            >
              <div class="space-y-1 min-w-0">
                <div class="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  <span class="truncate">{{ form.badge_text || 'Cosecha de Origen' }}</span>
                </div>
                <h3 class="font-extrabold text-sm text-white tracking-tight break-words">
                  {{ form.title || 'Café de Origen Huila' }}
                </h3>
                <p class="text-xs text-[#E9E3DD]/90 leading-snug break-words">
                  {{ form.description || 'Notas tostadas a chocolate negro y caramelo.' }}
                </p>
              </div>

              <!-- Contenedor del Icono -->
              <div class="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300 shrink-0 shadow-inner">
                <!-- Iconos SVG según la selección -->
                <svg v-if="form.icon === 'sparkles'" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                </svg>
                <svg v-else-if="form.icon === 'flame'" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
                </svg>
                <svg v-else-if="form.icon === 'award'" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="12" cy="8" r="6"/>
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
                </svg>
                <svg v-else-if="form.icon === 'tag'" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/>
                  <path d="M7 7h.01"/>
                </svg>
                <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
                  <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
                </svg>
              </div>
            </div>

            <p v-if="form.status === 'inactive'" class="text-[11px] text-stone-500 text-center italic">
              Este banner se encuentra oculto temporalmente para los clientes.
            </p>
          </div>
        </div>
      </div>

      <!-- Columna Derecha: Formulario de Configuración y Límites (55%) -->
      <div class="lg:col-span-7">
        <form @submit.prevent="saveBanner" class="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-5">
          <!-- Campo 1: Etiqueta / Badge Superior -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-bold text-stone-900">
                Etiqueta / Badge Superior
                <span class="text-rose-500">*</span>
              </label>
              <span 
                class="text-[11px] font-mono font-semibold"
                :class="form.badge_text.length >= 26 ? 'text-amber-600 font-bold' : 'text-stone-400'"
              >
                {{ form.badge_text.length }} / 30 caracteres
              </span>
            </div>
            <input
              v-model="form.badge_text"
              type="text"
              maxlength="30"
              required
              placeholder="Ej: Cosecha de Origen, Novedad, Café del Mes"
              class="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-stone-900 bg-stone-50/50 text-stone-900 transition"
            />
            <p class="text-[11px] text-stone-500 mt-1">Píldora destacada arriba del título (máximo 30 caracteres).</p>
          </div>

          <!-- Campo 2: Título Principal -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-bold text-stone-900">
                Título Principal
                <span class="text-rose-500">*</span>
              </label>
              <span 
                class="text-[11px] font-mono font-semibold"
                :class="form.title.length >= 52 ? 'text-amber-600 font-bold' : 'text-stone-400'"
              >
                {{ form.title.length }} / 60 caracteres
              </span>
            </div>
            <input
              v-model="form.title"
              type="text"
              maxlength="60"
              required
              placeholder="Ej: Café de Origen Huila, Cold Brew Nitro"
              class="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-stone-900 bg-stone-50/50 text-stone-900 transition font-bold"
            />
            <p class="text-[11px] text-stone-500 mt-1">Encabezado principal en negrita (máximo 60 caracteres).</p>
          </div>

          <!-- Campo 3: Descripción o Notas de Cata -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-bold text-stone-900">
                Descripción / Notas de Cata
                <span class="text-rose-500">*</span>
              </label>
              <span 
                class="text-[11px] font-mono font-semibold"
                :class="form.description.length >= 120 ? 'text-amber-600 font-bold' : 'text-stone-400'"
              >
                {{ form.description.length }} / 140 caracteres
              </span>
            </div>
            <textarea
              v-model="form.description"
              maxlength="140"
              rows="3"
              required
              placeholder="Ej: Notas tostadas a chocolate negro, nuez moscada y caramelo artesanal."
              class="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-stone-900 bg-stone-50/50 text-stone-900 transition resize-none"
            ></textarea>
            <p class="text-[11px] text-stone-500 mt-1">Breve texto explicativo para el cliente (máximo 140 caracteres).</p>
          </div>

          <!-- Campo 4: Selector de Ícono Visual -->
          <div>
            <label class="block text-xs font-bold text-stone-900 mb-2">Ícono Temático</label>
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                type="button"
                v-for="item in iconOptions"
                :key="item.id"
                @click="form.icon = item.id"
                class="p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer"
                :class="form.icon === item.id 
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs' 
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'"
              >
                <component :is="item.icon" class="w-4 h-4" />
                <span class="text-[10px] font-bold">{{ item.label }}</span>
              </button>
            </div>
          </div>

          <!-- Campo 5: Estado de Publicación (Activo / Oculto) -->
          <div class="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <div>
              <span class="block text-xs font-bold text-stone-900">Visibilidad en la App de Clientes</span>
              <span class="text-[11px] text-stone-500">
                {{ form.status === 'active' ? 'El banner se muestra activamente en la pantalla principal.' : 'El banner está oculto para todos los clientes.' }}
              </span>
            </div>
            <button
              type="button"
              @click="toggleStatus"
              class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
              :class="form.status === 'active' ? 'bg-amber-600' : 'bg-stone-300'"
              role="switch"
              :aria-checked="form.status === 'active'"
            >
              <span
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out"
                :class="form.status === 'active' ? 'translate-x-5' : 'translate-x-0'"
              />
            </button>
          </div>

          <!-- Botones de Acción -->
          <div class="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              @click="resetToTemplate('huila')"
              class="text-xs font-semibold text-stone-600 hover:text-stone-900 px-3 py-2 rounded-xl transition cursor-pointer"
            >
              Restablecer Predeterminado
            </button>

            <button
              type="submit"
              :disabled="saving || loading"
              class="bg-stone-900 hover:bg-stone-800 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl border border-stone-900 transition cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <span v-if="saving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{{ saving ? 'Guardando Cambios...' : 'Guardar y Publicar' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue';
import { adminApi, type BannerConfig } from '../api';

const loading = ref(false);
const saving = ref(false);
const feedbackMessage = ref('');
const feedbackType = ref<'success' | 'error'>('success');

const form = ref({
  badge_text: 'Cosecha de Origen',
  title: 'Café de Origen Huila',
  description: 'Notas tostadas a chocolate negro y caramelo.',
  icon: 'coffee',
  status: 'active' as 'active' | 'inactive',
  target_url: ''
});

// Componentes de Íconos para el selector
const IconCoffee = () => h('svg', {
  viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2',
  strokeLinecap: 'round', strokeLinejoin: 'round'
}, [
  h('path', { d: 'M17 8h1a4 4 0 1 1 0 8h-1' }),
  h('path', { d: 'M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z' })
]);

const IconSparkles = () => h('svg', {
  viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2',
  strokeLinecap: 'round', strokeLinejoin: 'round'
}, [
  h('path', { d: 'm12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z' })
]);

const IconFlame = () => h('svg', {
  viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2',
  strokeLinecap: 'round', strokeLinejoin: 'round'
}, [
  h('path', { d: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z' })
]);

const IconAward = () => h('svg', {
  viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2',
  strokeLinecap: 'round', strokeLinejoin: 'round'
}, [
  h('circle', { cx: '12', cy: '8', r: '6' }),
  h('path', { d: 'M15.477 12.89 17 22l-5-3-5 3 1.523-9.11' })
]);

const IconTag = () => h('svg', {
  viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2',
  strokeLinecap: 'round', strokeLinejoin: 'round'
}, [
  h('path', { d: 'M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z' }),
  h('path', { d: 'M7 7h.01' })
]);

const iconOptions = [
  { id: 'coffee', label: 'Especialidad', icon: IconCoffee },
  { id: 'sparkles', label: 'Novedad', icon: IconSparkles },
  { id: 'flame', label: 'Tostión', icon: IconFlame },
  { id: 'award', label: 'Recomendado', icon: IconAward },
  { id: 'tag', label: 'Promoción', icon: IconTag }
];

const toggleStatus = () => {
  form.value.status = form.value.status === 'active' ? 'inactive' : 'active';
};

const resetToTemplate = (kind: 'huila' | 'coldbrew') => {
  if (kind === 'huila') {
    form.value.badge_text = 'Cosecha de Origen';
    form.value.title = 'Café de Origen Huila';
    form.value.description = 'Notas tostadas a chocolate negro y caramelo.';
    form.value.icon = 'coffee';
    form.value.status = 'active';
  }
};

const loadBanner = async () => {
  try {
    loading.value = true;
    const config: BannerConfig = await adminApi.getBannerConfig();
    if (config) {
      form.value.badge_text = config.badge_text || 'Cosecha de Origen';
      form.value.title = config.title || 'Café de Origen Huila';
      form.value.description = config.description || '';
      form.value.icon = config.icon || 'coffee';
      form.value.status = config.status || 'active';
      form.value.target_url = config.target_url || '';
    }
  } catch (err: any) {
    feedbackType.value = 'error';
    feedbackMessage.value = err.message || 'Error al cargar banner';
  } finally {
    loading.value = false;
  }
};

const saveBanner = async () => {
  try {
    saving.value = true;
    feedbackMessage.value = '';

    await adminApi.updateBannerConfig({
      badge_text: form.value.badge_text.trim(),
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      icon: form.value.icon,
      status: form.value.status,
      target_url: form.value.target_url ? form.value.target_url.trim() : null
    });

    feedbackType.value = 'success';
    feedbackMessage.value = '¡Banner de novedades actualizado y publicado para los clientes con éxito!';

    // Auto-ocultar notificación tras 5 segundos
    setTimeout(() => {
      if (feedbackMessage.value.includes('éxito')) {
        feedbackMessage.value = '';
      }
    }, 5000);
  } catch (err: any) {
    feedbackType.value = 'error';
    feedbackMessage.value = err.message || 'Error al guardar los cambios';
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  loadBanner();
});
</script>
