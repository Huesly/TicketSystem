<template>
  <div class="min-h-screen flex flex-col bg-stone-100">
    <!-- Barra Superior de Navegación -->
    <header class="bg-stone-900 text-white px-6 py-3 flex items-center justify-between border-b border-stone-800 shadow-md">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="text-2xl">☕</span>
          <span class="font-extrabold text-base tracking-tight">ConfyTickets POS</span>
        </div>
        <span class="text-xs bg-stone-800 text-stone-300 px-2.5 py-1 rounded-md font-mono">
          Sede: Cabecera (Bucaramanga)
        </span>
      </div>

      <nav class="flex items-center gap-3">
        <router-link 
          to="/" 
          class="text-xs font-bold px-3 py-1.5 rounded-lg transition"
          :class="$route.name === 'cashier' ? 'bg-amber-600 text-white' : 'text-stone-300 hover:bg-stone-800'"
        >
          Terminal de Caja
        </router-link>
        <router-link 
          to="/dashboard" 
          class="text-xs font-bold px-3 py-1.5 rounded-lg transition"
          :class="$route.name === 'dashboard' ? 'bg-amber-600 text-white' : 'text-stone-300 hover:bg-stone-800'"
        >
          Dashboard & Reportes
        </router-link>
        <div class="h-4 w-px bg-stone-700 mx-1"></div>
        <span class="text-xs text-stone-400 font-medium">Cajero: Juan P.</span>
      </nav>
    </header>

    <!-- Contenedor Principal -->
    <main class="flex-1 p-6 max-w-7xl w-full mx-auto">
      <router-view />
    </main>
  </div>
</template>
