<template>
  <div class="min-h-screen flex flex-col bg-stone-200/80 text-stone-900">
    <!-- Barra Superior de Navegación Principal -->
    <header class="bg-stone-900 text-white px-6 py-3.5 flex items-center justify-between border-b-2 border-amber-600 shadow-lg sticky top-0 z-40">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center text-xl font-black shadow-sm">
            ☕
          </div>
          <div>
            <span class="font-black text-base tracking-tight block leading-none">ConfyTickets POS</span>
            <span class="text-[11px] text-amber-400 font-semibold">Sistema Central de Caja y Fidelización</span>
          </div>
        </div>
      </div>

      <nav class="flex items-center gap-3">
        <router-link 
          to="/" 
          class="text-xs font-extrabold px-4 py-2 rounded-xl transition border-2 flex items-center gap-1.5"
          :class="$route.name === 'cashier' 
            ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md' 
            : 'bg-stone-800 text-stone-200 border-stone-600 hover:bg-stone-700 hover:border-stone-500'"
        >
          <span>🖥️</span>
          <span>Terminal de Caja</span>
        </router-link>

        <router-link 
          to="/dashboard" 
          class="text-xs font-extrabold px-4 py-2 rounded-xl transition border-2 flex items-center gap-1.5"
          :class="$route.name === 'dashboard' 
            ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md' 
            : 'bg-stone-800 text-stone-200 border-stone-600 hover:bg-stone-700 hover:border-stone-500'"
        >
          <span>📊</span>
          <span>Dashboard & Reportes</span>
        </router-link>

        <div class="h-6 w-0.5 bg-stone-700 mx-1 hidden sm:block"></div>

        <div class="hidden sm:flex items-center gap-2 bg-stone-800 border border-stone-700 px-3 py-1.5 rounded-xl">
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span class="text-xs text-stone-200 font-bold">Operador: Juan Pérez</span>
        </div>
      </nav>
    </header>

    <!-- Contenedor Principal -->
    <main class="flex-1 p-6 max-w-7xl w-full mx-auto">
      <router-view />
    </main>
  </div>
</template>
