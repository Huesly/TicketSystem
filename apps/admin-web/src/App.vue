<template>
  <div class="min-h-dvh-safe flex flex-col bg-stone-100 text-stone-900 selection:bg-stone-900 selection:text-white">
    <!-- Barra Superior Compacta (< 12% viewport height) -->
    <header class="bg-white text-stone-900 px-4 sm:px-6 h-14 flex items-center justify-between border-b border-stone-300 sticky top-0 z-40">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center shrink-0">
          <!-- Icono SVG: Local Cafe (Google Material Style) -->
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
            <line x1="6" y1="2" x2="6" y2="4" />
            <line x1="10" y1="2" x2="10" y2="4" />
            <line x1="14" y1="2" x2="14" y2="4" />
          </svg>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="font-extrabold text-sm tracking-tight text-stone-950">ConfyTickets</span>
          <span class="text-[11px] font-mono font-medium text-stone-500 hidden sm:inline">POS &amp; Admin</span>
        </div>
      </div>

      <nav class="flex items-center gap-1.5" aria-label="Navegación principal">
        <router-link 
          to="/" 
          class="text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 border"
          :class="$route.name === 'cashier' 
            ? 'bg-stone-900 text-white border-stone-900' 
            : 'bg-transparent text-stone-600 border-transparent hover:bg-stone-100 hover:border-stone-300 hover:text-stone-900'"
        >
          <!-- SVG: Point of Sale / Terminal -->
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect width="20" height="14" x="2" y="3" rx="2" />
            <line x1="8" x2="16" y1="21" y2="21" />
            <line x1="12" x2="12" y1="17" y2="21" />
          </svg>
          <span>Terminal</span>
        </router-link>

        <router-link 
          to="/dashboard" 
          class="text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 border"
          :class="$route.name === 'dashboard' 
            ? 'bg-stone-900 text-white border-stone-900' 
            : 'bg-transparent text-stone-600 border-transparent hover:bg-stone-100 hover:border-stone-300 hover:text-stone-900'"
        >
          <!-- SVG: Bar Chart / Analytics -->
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" x2="18" y1="20" y2="10" />
            <line x1="12" x2="12" y1="20" y2="4" />
            <line x1="6" x2="6" y1="20" y2="14" />
          </svg>
          <span>Analítica</span>
        </router-link>

        <div class="h-4 w-px bg-stone-300 mx-1.5 hidden sm:block"></div>

        <div class="hidden sm:flex items-center gap-2 bg-stone-50 border border-stone-300 px-2.5 py-1 rounded-lg">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          <span class="text-[11px] text-stone-700 font-medium">Juan Pérez</span>
        </div>
      </nav>
    </header>

    <!-- Contenedor Principal Líquido -->
    <main class="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 fluid-container">
      <router-view />
    </main>
  </div>
</template>
