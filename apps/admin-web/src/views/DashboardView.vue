<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-extrabold text-stone-900 tracking-tight">Panel de Control y Analítica Multisede</h2>
        <p class="text-xs text-stone-500">Métricas agregadas y comparativas de fidelización por establecimiento.</p>
      </div>

      <div class="flex items-center gap-3">
        <select class="text-xs font-semibold bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-700">
          <option>Todas las Sedes</option>
          <option>Sede Centro</option>
          <option>Sede Cabecera</option>
          <option>Sede Cañaveral</option>
        </select>
        <button class="bg-stone-900 text-white font-bold text-xs px-3.5 py-2 rounded-xl">
          Exportar Reporte
        </button>
      </div>
    </div>

    <!-- Tarjetas de KPIs -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-2">
        <span class="text-xs font-bold text-stone-400 uppercase tracking-wider">Clientes Registrados</span>
        <div class="flex items-baseline justify-between">
          <span class="text-2xl font-black font-mono text-stone-900">1,420</span>
          <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">+12% este mes</span>
        </div>
      </div>

      <div class="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-2">
        <span class="text-xs font-bold text-stone-400 uppercase tracking-wider">Tarjetas Completadas</span>
        <div class="flex items-baseline justify-between">
          <span class="text-2xl font-black font-mono text-amber-700">620</span>
          <span class="text-xs font-bold text-stone-500">Ciclos de 8 sellos</span>
        </div>
      </div>

      <div class="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-2">
        <span class="text-xs font-bold text-stone-400 uppercase tracking-wider">Sellos Acreditados</span>
        <div class="flex items-baseline justify-between">
          <span class="text-2xl font-black font-mono text-emerald-700">8,540</span>
          <span class="text-xs font-bold text-stone-500">Modo Combinado</span>
        </div>
      </div>

      <div class="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-2">
        <span class="text-xs font-bold text-stone-400 uppercase tracking-wider">Ventas Identificadas (COP)</span>
        <div class="flex items-baseline justify-between">
          <span class="text-2xl font-black font-mono text-coffee-900">$85.4M</span>
          <span class="text-xs font-bold text-stone-500">Facturado POS</span>
        </div>
      </div>
    </div>

    <!-- Desglose por Sede Física -->
    <div class="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
      <h3 class="font-bold text-sm text-stone-900">Desempeño Comparativo por Sede</h3>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-stone-200 text-stone-400 font-bold uppercase tracking-wider">
              <th class="py-3 px-4">Código</th>
              <th class="py-3 px-4">Nombre de Sede</th>
              <th class="py-3 px-4">Ciudad</th>
              <th class="py-3 px-4 text-right">Compras Registradas</th>
              <th class="py-3 px-4 text-right">Sellos Emitidos</th>
              <th class="py-3 px-4 text-right">Premios Canjeados</th>
              <th class="py-3 px-4 text-center">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 font-medium text-stone-700">
            <tr>
              <td class="py-3.5 px-4 font-mono font-bold text-stone-900">SEDE-01</td>
              <td class="py-3.5 px-4 font-bold text-stone-900">Sede Cabecera</td>
              <td class="py-3.5 px-4">Bucaramanga</td>
              <td class="py-3.5 px-4 text-right font-mono">1,840</td>
              <td class="py-3.5 px-4 text-right font-mono text-emerald-700 font-bold">3,680</td>
              <td class="py-3.5 px-4 text-right font-mono">245</td>
              <td class="py-3.5 px-4 text-center"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Activa</span></td>
            </tr>
            <tr>
              <td class="py-3.5 px-4 font-mono font-bold text-stone-900">SEDE-02</td>
              <td class="py-3.5 px-4 font-bold text-stone-900">Sede Centro</td>
              <td class="py-3.5 px-4">Bucaramanga</td>
              <td class="py-3.5 px-4 text-right font-mono">1,420</td>
              <td class="py-3.5 px-4 text-right font-mono text-emerald-700 font-bold">2,840</td>
              <td class="py-3.5 px-4 text-right font-mono">180</td>
              <td class="py-3.5 px-4 text-center"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Activa</span></td>
            </tr>
            <tr>
              <td class="py-3.5 px-4 font-mono font-bold text-stone-900">SEDE-03</td>
              <td class="py-3.5 px-4 font-bold text-stone-900">Sede Cañaveral</td>
              <td class="py-3.5 px-4">Floridablanca</td>
              <td class="py-3.5 px-4 text-right font-mono">1,020</td>
              <td class="py-3.5 px-4 text-right font-mono text-emerald-700 font-bold">2,020</td>
              <td class="py-3.5 px-4 text-right font-mono">85</td>
              <td class="py-3.5 px-4 text-center"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Activa</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
