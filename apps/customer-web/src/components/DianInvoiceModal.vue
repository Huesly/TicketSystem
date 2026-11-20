<template>
  <div v-if="invoice" class="fixed inset-0 bg-stone-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div class="bg-white rounded-2xl border border-[#E3DAD2] shadow-2xl w-full max-w-md overflow-hidden my-auto">
      <!-- Barra Superior -->
      <div class="bg-[#3E2B1E] text-white px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-amber-400"></span>
          <span class="text-xs font-bold tracking-wide uppercase">Factura Electrónica DIAN · Copia Cliente</span>
        </div>
        <button @click="$emit('close')" class="text-stone-300 hover:text-white text-sm font-bold px-2 py-0.5 cursor-pointer">✕</button>
      </div>

      <!-- Tirilla / Representación Gráfica DIAN -->
      <div id="customer-dian-printable" class="p-5 space-y-3.5 text-[#3E2B1E] font-sans text-xs max-h-[72vh] overflow-y-auto">
        <div v-if="invoice.status === 'cancelled'" class="p-2.5 bg-red-50 border-2 border-red-600 rounded-xl text-center space-y-0.5">
          <div class="text-xs font-extrabold text-red-700 uppercase">FACTURA ANULADA CON NOTA CRÉDITO DIAN</div>
          <div class="text-[10px] font-mono text-red-800">Nota Crédito: {{ invoice.credit_note_number }}</div>
        </div>

        <div class="text-center space-y-1 border-b border-dashed border-[#D8C8B8] pb-3">
          <div class="font-extrabold text-sm uppercase tracking-tight">{{ invoice.emitter.razon_social }}</div>
          <div class="text-[11px] font-semibold text-[#786558]">{{ invoice.emitter.nombre_comercial }} — {{ invoice.emitter.store_name }}</div>
          <div class="font-mono text-[11px] font-bold">NIT: {{ invoice.emitter.nit }}-{{ invoice.emitter.dv }} · CIIU {{ invoice.emitter.actividad_ciiu }}</div>
          <div class="text-[10px] text-[#786558]">{{ invoice.emitter.regimen_fiscal }}</div>
          <div class="text-[10px] text-[#786558]">{{ invoice.emitter.direccion }} · {{ invoice.emitter.municipio }}</div>
          <div class="pt-1 text-[10px] text-[#5D4432] bg-[#F9F7F5] rounded-lg px-2 py-1 font-mono border border-[#E3DAD2]">
            Res. DIAN No. {{ invoice.emitter.resolucion_numero }} del {{ invoice.emitter.resolucion_fecha }}<br/>
            Prefijo {{ invoice.emitter.prefijo }} del {{ invoice.emitter.rango_desde }} al {{ invoice.emitter.rango_hasta }}
          </div>
        </div>

        <div class="flex items-center justify-between border-b border-dashed border-[#D8C8B8] pb-2.5 text-[11px]">
          <div>
            <div class="font-extrabold text-xs">FACTURA ELECTRÓNICA DE VENTA</div>
            <div class="font-mono font-bold text-[#8C4B13] text-sm">{{ invoice.invoice_number }}</div>
            <div class="text-[10px] text-[#786558]">Ref. Caja: #{{ invoice.receipt_reference }}</div>
          </div>
          <div class="text-right">
            <span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
              {{ invoice.reprint_count > 1 ? `Copia #${invoice.reprint_count - 1}` : 'Original' }}
            </span>
            <div class="text-[10px] font-mono text-[#786558] mt-1">
              {{ new Date(invoice.issue_date).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }) }}
            </div>
            <div class="text-[10px] text-[#786558]">Medio: <strong>{{ invoice.payment_method }}</strong></div>
          </div>
        </div>

        <div class="bg-[#F9F7F5] p-2.5 rounded-xl border border-[#E3DAD2] space-y-0.5 text-[11px]">
          <div class="text-[10px] font-bold uppercase text-[#8C4B13]">Cliente / Adquirente</div>
          <div class="font-bold">{{ invoice.customer.full_name }}</div>
          <div class="font-mono">{{ invoice.customer.document_type }}: {{ invoice.customer.document_number }}</div>
          <div class="text-[#786558] text-[10px]">{{ invoice.customer.email }}</div>
        </div>

        <div class="space-y-1 text-xs border-b border-dashed border-[#D8C8B8] pb-3">
          <div class="flex justify-between text-[#786558]">
            <span>Subtotal Base Gravable:</span>
            <span class="font-mono">${{ invoice.totals.subtotal_base_cop.toLocaleString('es-CO') }} COP</span>
          </div>
          <div class="flex justify-between text-[#786558]">
            <span>Impoconsumo ({{ invoice.totals.tax_rate_pct }}%):</span>
            <span class="font-mono">${{ invoice.totals.tax_amount_cop.toLocaleString('es-CO') }} COP</span>
          </div>
          <div class="flex justify-between text-sm font-extrabold pt-1 border-t border-[#E3DAD2]">
            <span>TOTAL PAGADO:</span>
            <span class="font-mono">${{ invoice.totals.total_payable_cop.toLocaleString('es-CO') }} COP</span>
          </div>
          <div class="flex justify-between text-[11px] font-bold text-[#8C4B13] bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1 mt-1">
            <span>☕ Sellos ganados en esta compra:</span>
            <span class="font-mono">+{{ invoice.totals.stamps_awarded }} sellos</span>
          </div>
        </div>

        <div class="flex items-center gap-3 pt-1">
          <div class="bg-white p-1.5 border border-[#E3DAD2] rounded-xl shrink-0">
            <qrcode-vue :value="invoice.qr_url" :size="80" level="M" render-as="svg" />
          </div>
          <div class="space-y-1 min-w-0">
            <div class="text-[10px] font-bold uppercase">Código Único de Factura Electrónica</div>
            <div class="text-[9px] font-mono text-[#786558] break-all leading-tight">
              <strong>CUFE:</strong> {{ invoice.cufe }}
            </div>
          </div>
        </div>
      </div>

      <!-- Botones -->
      <div class="bg-[#F9F7F5] border-t border-[#E3DAD2] p-3.5 flex items-center gap-2">
        <button
          type="button"
          @click="printTicket"
          class="flex-1 bg-[#5D4432] hover:bg-[#473325] text-white font-bold text-xs py-2.5 px-3 rounded-xl transition cursor-pointer"
        >
          🖨️ Reimprimir / Guardar PDF
        </button>
        <button
          type="button"
          @click="$emit('download-xml', invoice.purchase_id, invoice.invoice_number)"
          class="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition cursor-pointer"
        >
          📥 Descargar XML DIAN
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import QrcodeVue from 'qrcode.vue';

const props = defineProps<{
  invoice: any | null;
}>();

defineEmits<{
  (e: 'close'): void;
  (e: 'download-xml', purchaseId: string, invoiceNumber: string): void;
}>();

const printTicket = () => {
  const el = document.getElementById('customer-dian-printable');
  if (!el || !props.invoice) return;
  const w = window.open('', '_blank', 'width=420,height=740');
  if (!w) {
    window.print();
    return;
  }
  w.document.write(`
    <html>
      <head>
        <title>Factura DIAN ${props.invoice.invoice_number}</title>
        <style>
          body { font-family: 'Courier New', monospace; width: 300px; margin: 0 auto; padding: 12px; color: #111; font-size: 12px; }
          svg { display: block; margin: 6px auto; }
        </style>
      </head>
      <body>
        ${el.innerHTML}
        <script>window.onload = function() { window.print(); };<\/script>
      </body>
    </html>
  `);
  w.document.close();
};
</script>
