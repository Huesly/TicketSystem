<template>
  <div class="space-y-6">
    <!-- Encabezado y Selector de Módulos (Tabs) -->
    <div class="bg-white rounded-2xl border border-stone-300 shadow-sm p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
      <div class="space-y-1">
        <h1 class="fluid-title font-extrabold text-stone-950 tracking-tight">Backoffice &amp; Gestión Central</h1>
        <p class="text-xs text-stone-500">Supervisa auditoría en vivo, administra sedes físicas y catálogo de productos.</p>
      </div>

      <!-- Segmented Control de Módulos -->
      <div class="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-300 text-xs font-semibold">
        <button 
          type="button"
          @click="activeTab = 'audit'"
          class="px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5"
          :class="activeTab === 'audit' ? 'bg-white text-stone-950 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'"
        >
          <!-- SVG: Assessment / KPI -->
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/>
          </svg>
          <span>Auditoría &amp; KPIs</span>
        </button>

        <button 
          type="button"
          @click="activeTab = 'products'"
          class="px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5"
          :class="activeTab === 'products' ? 'bg-white text-stone-950 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'"
        >
          <!-- SVG: Coffee / Inventory -->
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
          </svg>
          <span>Catálogo ({{ products.length }})</span>
        </button>

        <button 
          type="button"
          @click="activeTab = 'stores'"
          class="px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5"
          :class="activeTab === 'stores' ? 'bg-white text-stone-950 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'"
        >
          <!-- SVG: Storefront -->
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
          </svg>
          <span>Sedes ({{ stores.length }})</span>
        </button>
      </div>
    </div>

    <!-- ===================================================================== -->
    <!-- TAB 1: AUDITORÍA & KPIS EN VIVO -->
    <!-- ===================================================================== -->
    <div v-if="activeTab === 'audit'" class="space-y-5">
      <!-- Filtro y Botón de Recarga -->
      <div class="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-300">
        <div class="flex items-center gap-2">
          <label class="text-xs font-bold text-stone-700">Filtrar Sede:</label>
          <select 
            v-model="selectedStore" 
            @change="loadDashboardAndTransactions"
            class="text-xs font-semibold bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1 text-stone-900 focus:outline-none"
          >
            <option value="">Todas las sedes operativas</option>
            <option v-for="store in stores" :key="store.id" :value="store.id">
              {{ store.name }}
            </option>
          </select>
        </div>

        <button 
          type="button"
          @click="loadDashboardAndTransactions" 
          class="bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/>
          </svg>
          <span>Actualizar Datos</span>
        </button>
      </div>

      <!-- Tarjetas Líquidas de KPIs -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-5 rounded-2xl border border-stone-300 shadow-sm space-y-2 fluid-container">
          <div class="flex items-center justify-between text-stone-500">
            <span class="text-xs font-semibold uppercase tracking-wider">Clientes Totales</span>
            <svg class="w-4 h-4 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            </svg>
          </div>
          <div class="flex items-baseline justify-between pt-1">
            <span class="fluid-kpi font-extrabold font-mono text-stone-950">{{ summary.total_customers }}</span>
            <span class="text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">En plataforma</span>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-stone-300 shadow-sm space-y-2 fluid-container">
          <div class="flex items-center justify-between text-stone-500">
            <span class="text-xs font-semibold uppercase tracking-wider">Tarjetas Activas</span>
            <svg class="w-4 h-4 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
            </svg>
          </div>
          <div class="flex items-baseline justify-between pt-1">
            <span class="fluid-kpi font-extrabold font-mono text-stone-950">{{ summary.active_cards }}</span>
            <span class="text-[11px] font-medium text-stone-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-full">Acumulando</span>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-stone-300 shadow-sm space-y-2 fluid-container">
          <div class="flex items-center justify-between text-stone-500">
            <span class="text-xs font-semibold uppercase tracking-wider">Sellos Acreditados</span>
            <svg class="w-4 h-4 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
            </svg>
          </div>
          <div class="flex items-baseline justify-between pt-1">
            <span class="fluid-kpi font-extrabold font-mono text-stone-950">{{ summary.total_stamps_awarded }}</span>
            <span class="text-[11px] font-medium text-stone-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-full">Sellos</span>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-stone-300 shadow-sm space-y-2 fluid-container">
          <div class="flex items-center justify-between text-stone-500">
            <span class="text-xs font-semibold uppercase tracking-wider">Facturación Auditada</span>
            <svg class="w-4 h-4 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div class="flex items-baseline justify-between pt-1">
            <span class="fluid-kpi font-extrabold font-mono text-stone-950">${{ (summary.total_sales_amount_cop || 0).toLocaleString('es-CO') }}</span>
            <span class="text-[11px] font-medium text-stone-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-full">COP</span>
          </div>
        </div>
      </div>

      <!-- Bitácora de Transacciones en Vivo -->
      <div class="bg-white rounded-2xl border border-stone-300 shadow-sm overflow-hidden space-y-3 p-5">
        <div class="flex items-center justify-between border-b border-stone-200 pb-3">
          <div>
            <h2 class="font-extrabold text-sm text-stone-950">Bitácora en Vivo de Operaciones POS</h2>
            <p class="text-[11px] text-stone-500">Historial auditable de facturas registradas y canjes de premios en caja.</p>
          </div>
          <span class="text-xs font-mono font-bold text-stone-600 bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-md">
            {{ transactions.length }} eventos
          </span>
        </div>

        <div v-if="loadingTransactions" class="py-8 text-center text-xs text-stone-400 font-semibold animate-pulse">
          Cargando flujo de auditoría...
        </div>

        <div v-else-if="transactions.length === 0" class="py-8 text-center text-xs text-stone-500">
          No se registran transacciones recientes con el filtro aplicado.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider bg-stone-50">
                <th class="py-2.5 px-3">Fecha y Hora</th>
                <th class="py-2.5 px-3">Tipo</th>
                <th class="py-2.5 px-3">Comprobante / Detalle</th>
                <th class="py-2.5 px-3">Sede</th>
                <th class="py-2.5 px-3">Cliente</th>
                <th class="py-2.5 px-3 text-right">Monto / Beneficio</th>
                <th class="py-2.5 px-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-200 text-stone-700">
              <tr v-for="tx in transactions" :key="tx.id" class="hover:bg-stone-50/80 transition">
                <td class="py-3 px-3 font-mono text-[11px] text-stone-500">
                  {{ new Date(tx.created_at).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }) }}
                </td>
                <td class="py-3 px-3">
                  <span 
                    class="text-[10px] uppercase font-bold px-2 py-0.5 rounded border"
                    :class="tx.type === 'PURCHASE' ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-emerald-50 text-emerald-800 border-emerald-300'"
                  >
                    {{ tx.type === 'PURCHASE' ? 'Compra' : 'Canje' }}
                  </span>
                </td>
                <td class="py-3 px-3 font-semibold text-stone-900">
                  {{ tx.reference }}
                </td>
                <td class="py-3 px-3 text-stone-600">{{ tx.store_name }}</td>
                <td class="py-3 px-3">
                  <div class="font-semibold text-stone-900 leading-tight">{{ tx.customer_name }}</div>
                  <div class="text-[10px] text-stone-400 font-mono">{{ tx.customer_email }}</div>
                </td>
                <td class="py-3 px-3 text-right font-mono font-bold text-stone-900">
                  <template v-if="tx.type === 'PURCHASE'">
                    <div>${{ (tx.amount_cop || 0).toLocaleString('es-CO') }}</div>
                    <div class="text-[10px] text-emerald-700 font-normal">+{{ tx.stamps_awarded }} sellos</div>
                  </template>
                  <template v-else>
                    <span class="text-emerald-700 font-semibold">{{ tx.reward_name }}</span>
                  </template>
                </td>
                <td class="py-3 px-3 text-center">
                  <span class="text-[10px] font-bold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                    Confirmado
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ===================================================================== -->
    <!-- TAB 2: CATÁLOGO DE PRODUCTOS (CRUD) -->
    <!-- ===================================================================== -->
    <div v-else-if="activeTab === 'products'" class="space-y-4">
      <div class="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-300">
        <div>
          <h2 class="font-extrabold text-sm text-stone-950">Menú y Vitrina Destacada</h2>
          <p class="text-xs text-stone-500">Administra los cafés y productos de pastelería que ven los clientes en su app.</p>
        </div>
        <button 
          type="button"
          @click="openProductModal()"
          class="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="12" y1="12" y2="12"/>
          </svg>
          <span>Nuevo Producto</span>
        </button>
      </div>

      <!-- Lista de Productos -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="prod in products" 
          :key="prod.id"
          class="bg-white rounded-2xl p-4 border border-stone-300 shadow-sm flex flex-col justify-between space-y-3"
        >
          <div class="space-y-1.5">
            <div class="flex items-start justify-between gap-2">
              <h3 class="font-bold text-sm text-stone-950">{{ prod.name }}</h3>
              <span class="font-mono font-bold text-xs text-stone-900 bg-stone-100 px-2 py-0.5 rounded border border-stone-300 shrink-0">
                ${{ prod.price.toLocaleString('es-CO') }}
              </span>
            </div>
            <p class="text-xs text-stone-500 line-clamp-2 leading-relaxed">{{ prod.description }}</p>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-stone-200 text-xs">
            <span 
              class="text-[10px] font-bold px-2 py-0.5 rounded"
              :class="prod.available ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-stone-100 text-stone-500'"
            >
              {{ prod.available ? 'Disponible' : 'Agotado' }}
            </span>

            <div class="flex items-center gap-1.5">
              <button 
                type="button"
                @click="openProductModal(prod)"
                class="text-xs font-semibold text-stone-700 hover:text-stone-950 bg-stone-50 hover:bg-stone-100 border border-stone-300 px-2.5 py-1 rounded-lg transition cursor-pointer"
              >
                Editar
              </button>
              <button 
                type="button"
                @click="deleteProduct(prod.id)"
                class="text-xs font-semibold text-red-700 hover:text-red-900 bg-red-50 hover:bg-red-100 border border-red-200 px-2 py-1 rounded-lg transition cursor-pointer"
                title="Eliminar producto"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Crear / Editar Producto -->
      <div v-if="showProductModal" class="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl border border-stone-300 p-6 w-full max-w-sm shadow-xl space-y-4">
          <div class="flex items-center justify-between border-b border-stone-200 pb-3">
            <h3 class="font-bold text-sm text-stone-950">
              {{ editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto' }}
            </h3>
            <button @click="showProductModal = false" class="text-stone-400 hover:text-stone-700 p-1 cursor-pointer">✕</button>
          </div>

          <form @submit.prevent="saveProduct" class="space-y-3">
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Nombre</label>
              <input v-model="prodForm.name" type="text" required placeholder="Ej: Espresso Tonic" class="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 focus:outline-none" />
            </div>

            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Descripción</label>
              <textarea v-model="prodForm.description" required rows="2" placeholder="Detalles de la preparación y notas..." class="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 focus:outline-none"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-stone-700 mb-1">Precio (COP)</label>
                <input v-model.number="prodForm.price" type="number" required min="0" step="500" placeholder="12000" class="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-bold text-stone-700 mb-1">Orden Destacado</label>
                <input v-model.number="prodForm.featured_order" type="number" min="1" max="10" placeholder="Opcional" class="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 focus:outline-none" />
              </div>
            </div>

            <div class="flex items-center gap-2 pt-1">
              <input v-model="prodForm.available" type="checkbox" id="prod-avail" class="w-4 h-4 rounded text-stone-900" />
              <label for="prod-avail" class="text-xs font-semibold text-stone-800">Disponible para la venta</label>
            </div>

            <div class="pt-2 flex gap-2">
              <button type="button" @click="showProductModal = false" class="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold py-2 rounded-lg">
                Cancelar
              </button>
              <button type="submit" :disabled="savingProd" class="flex-1 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold py-2 rounded-lg">
                {{ savingProd ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- ===================================================================== -->
    <!-- TAB 3: GESTIÓN DE SEDES FÍSICAS (CRUD) -->
    <!-- ===================================================================== -->
    <div v-else-if="activeTab === 'stores'" class="space-y-4">
      <div class="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-300">
        <div>
          <h2 class="font-extrabold text-sm text-stone-950">Establecimientos y Sucursales</h2>
          <p class="text-xs text-stone-500">Puntos de venta físicos autorizados para emitir sellos y redimir premios.</p>
        </div>
        <button 
          type="button"
          @click="openStoreModal()"
          class="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="12" y1="12" y2="12"/>
          </svg>
          <span>Nueva Sede</span>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          v-for="s in stores" 
          :key="s.id"
          class="bg-white rounded-2xl p-5 border border-stone-300 shadow-sm flex flex-col justify-between space-y-4"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono font-bold text-stone-600 bg-stone-100 border border-stone-300 px-2 py-0.5 rounded">
                {{ s.code }}
              </span>
              <span class="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full">
                Operativa
              </span>
            </div>
            <h3 class="font-extrabold text-sm text-stone-950">{{ s.name }}</h3>
            <p class="text-xs text-stone-600 leading-snug">{{ s.address }}</p>
            <p class="text-[11px] text-stone-400 font-medium">{{ s.city }}</p>
          </div>

          <div class="pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
            <span class="text-stone-500 font-mono text-[11px]">{{ s.phone || 'Sin teléfono' }}</span>
            <button 
              type="button"
              @click="openStoreModal(s)"
              class="text-xs font-semibold text-stone-700 hover:text-stone-950 bg-stone-50 hover:bg-stone-100 border border-stone-300 px-3 py-1 rounded-lg transition cursor-pointer"
            >
              Editar Sede
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Crear / Editar Sede -->
      <div v-if="showStoreModal" class="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl border border-stone-300 p-6 w-full max-w-sm shadow-xl space-y-4">
          <div class="flex items-center justify-between border-b border-stone-200 pb-3">
            <h3 class="font-bold text-sm text-stone-950">
              {{ editingStore ? 'Editar Sede' : 'Registrar Nueva Sede' }}
            </h3>
            <button @click="showStoreModal = false" class="text-stone-400 hover:text-stone-700 p-1 cursor-pointer">✕</button>
          </div>

          <form @submit.prevent="saveStore" class="space-y-3">
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Código Único (Ej: SEDE-04)</label>
              <input v-model="storeForm.code" :disabled="!!editingStore" type="text" required placeholder="SEDE-04" class="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 focus:outline-none disabled:opacity-50" />
            </div>

            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Nombre Comercial</label>
              <input v-model="storeForm.name" type="text" required placeholder="Sede Provenza" class="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 focus:outline-none" />
            </div>

            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Dirección Física</label>
              <input v-model="storeForm.address" type="text" required placeholder="Calle 10 # 35-12" class="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 focus:outline-none" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-stone-700 mb-1">Ciudad</label>
                <input v-model="storeForm.city" type="text" required placeholder="Bucaramanga" class="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-bold text-stone-700 mb-1">Teléfono</label>
                <input v-model="storeForm.phone" type="text" placeholder="+57 607..." class="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 focus:outline-none" />
              </div>
            </div>

            <div class="pt-2 flex gap-2">
              <button type="button" @click="showStoreModal = false" class="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold py-2 rounded-lg">
                Cancelar
              </button>
              <button type="submit" :disabled="savingStore" class="flex-1 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold py-2 rounded-lg">
                {{ savingStore ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { 
  adminApi, 
  type DashboardSummary, 
  type StoreItem, 
  type AuditTransactionItem,
  type ProductAdminItem 
} from '../api';

const activeTab = ref<'audit' | 'products' | 'stores'>('audit');
const selectedStore = ref('');

const summary = ref<DashboardSummary>({
  total_customers: 0,
  active_cards: 0,
  completed_cards: 0,
  total_purchases_count: 0,
  total_sales_amount_cop: 0,
  total_stamps_awarded: 0,
  total_rewards_redeemed: 0
});

const stores = ref<StoreItem[]>([]);
const transactions = ref<AuditTransactionItem[]>([]);
const loadingTransactions = ref(false);

const products = ref<ProductAdminItem[]>([]);
const showProductModal = ref(false);
const editingProduct = ref<ProductAdminItem | null>(null);
const savingProd = ref(false);
const prodForm = ref({
  name: '',
  description: '',
  price: 10000,
  available: true,
  featured_order: null as number | null
});

const showStoreModal = ref(false);
const editingStore = ref<StoreItem | null>(null);
const savingStore = ref(false);
const storeForm = ref({
  code: '',
  name: '',
  address: '',
  city: 'Bucaramanga',
  phone: ''
});

const loadDashboardAndTransactions = async () => {
  try {
    loadingTransactions.value = true;
    const [dashRes, txRes] = await Promise.all([
      adminApi.getDashboard(selectedStore.value || undefined),
      adminApi.getTransactions(selectedStore.value || undefined)
    ]);
    summary.value = dashRes.summary;
    transactions.value = txRes;
  } catch (err) {
    console.error('Error cargando auditoría:', err);
  } finally {
    loadingTransactions.value = false;
  }
};

const loadStores = async () => {
  try {
    stores.value = await adminApi.getStores();
  } catch (err) {
    console.error('Error cargando sedes:', err);
  }
};

const loadProducts = async () => {
  try {
    products.value = await adminApi.getProducts();
  } catch (err) {
    console.error('Error cargando productos:', err);
  }
};

// CRUD Productos
const openProductModal = (prod?: ProductAdminItem) => {
  if (prod) {
    editingProduct.value = prod;
    prodForm.value = {
      name: prod.name,
      description: prod.description,
      price: prod.price,
      available: prod.available,
      featured_order: prod.featured_order ?? null
    };
  } else {
    editingProduct.value = null;
    prodForm.value = {
      name: '',
      description: '',
      price: 12000,
      available: true,
      featured_order: null
    };
  }
  showProductModal.value = true;
};

const saveProduct = async () => {
  savingProd.value = true;
  try {
    if (editingProduct.value) {
      await adminApi.updateProduct(editingProduct.value.id, prodForm.value);
    } else {
      await adminApi.createProduct(prodForm.value);
    }
    showProductModal.value = false;
    await loadProducts();
  } catch (err: any) {
    alert(err.message || 'Error al guardar producto');
  } finally {
    savingProd.value = false;
  }
};

const deleteProduct = async (id: string) => {
  if (!confirm('¿Estás seguro de eliminar este producto del catálogo?')) return;
  try {
    await adminApi.deleteProduct(id);
    await loadProducts();
  } catch (err: any) {
    alert(err.message || 'Error al eliminar producto');
  }
};

// CRUD Sedes
const openStoreModal = (st?: StoreItem) => {
  if (st) {
    editingStore.value = st;
    storeForm.value = {
      code: st.code,
      name: st.name,
      address: st.address || '',
      city: st.city,
      phone: st.phone || ''
    };
  } else {
    editingStore.value = null;
    storeForm.value = {
      code: `SEDE-0${stores.value.length + 1}`,
      name: '',
      address: '',
      city: 'Bucaramanga',
      phone: ''
    };
  }
  showStoreModal.value = true;
};

const saveStore = async () => {
  savingStore.value = true;
  try {
    if (editingStore.value) {
      await adminApi.updateStore(editingStore.value.id, {
        name: storeForm.value.name,
        address: storeForm.value.address,
        city: storeForm.value.city,
        phone: storeForm.value.phone
      });
    } else {
      await adminApi.createStore(storeForm.value);
    }
    showStoreModal.value = false;
    await loadStores();
  } catch (err: any) {
    alert(err.message || 'Error al guardar sede');
  } finally {
    savingStore.value = false;
  }
};

onMounted(async () => {
  await Promise.all([
    loadDashboardAndTransactions(),
    loadStores(),
    loadProducts()
  ]);
});
</script>
