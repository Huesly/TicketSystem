<template>
  <div v-if="invoice" class="fixed inset-0 bg-stone-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div class="bg-white rounded-2xl border border-stone-300 shadow-2xl w-full max-w-md overflow-hidden my-auto">
      <!-- Barra Superior de Acciones -->
      <div class="bg-stone-900 text-white px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span class="text-xs font-bold tracking-wide uppercase">Factura Electrónica DIAN · UBL 2.1</span>
        </div>
        <button @click="$emit('close')" class="text-stone-400 hover:text-white text-sm font-bold px-2 py-0.5 cursor-pointer">✕</button>
      </div>

      <!-- Tirilla / Representación Gráfica DIAN -->
      <div id="dian-printable-ticket" class="p-5 space-y-3.5 text-stone-900 font-sans text-xs max-h-[75vh] overflow-y-auto">
        <!-- Sello si fue Anulada con Nota Crédito -->
        <div v-if="invoice.status === 'cancelled'" class="p-2.5 bg-red-50 border-2 border-red-600 rounded-xl text-center space-y-0.5">
          <div class="text-xs font-extrabold text-red-700 uppercase tracking-wider">FACTURA ANULADA CON NOTA CRÉDITO DIAN</div>
          <div class="text-[10px] font-mono text-red-800">Nota Crédito: {{ invoice.credit_note_number }}</div>
          <div v-if="invoice.cancellation_reason" class="text-[10px] text-red-600">Motivo: {{ invoice.cancellation_reason }}</div>
        </div>

        <!-- Encabezado Emisor (Cafetería) -->
        <div class="text-center space-y-1 border-b border-dashed border-stone-300 pb-3">
          <div class="font-extrabold text-sm uppercase tracking-tight text-stone-950">{{ invoice.emitter.razon_social }}</div>
          <div class="text-[11px] font-semibold text-stone-600">{{ invoice.emitter.nombre_comercial }} — {{ invoice.emitter.store_name }}</div>
          <div class="font-mono text-[11px] font-bold text-stone-800">NIT: {{ invoice.emitter.nit }}-{{ invoice.emitter.dv }} · CIIU {{ invoice.emitter.actividad_ciiu }}</div>
          <div class="text-[10px] text-stone-500">{{ invoice.emitter.regimen_fiscal }}</div>
          <div class="text-[10px] text-stone-500">{{ invoice.emitter.direccion }} · {{ invoice.emitter.municipio }}, {{ invoice.emitter.departamento }}</div>
          <div class="text-[10px] text-stone-500">Tel: {{ invoice.emitter.telefono }} · {{ invoice.emitter.correo }}</div>
          <div class="pt-1 text-[10px] text-stone-600 bg-stone-100 rounded-lg px-2 py-1 font-mono">
            Res. DIAN No. {{ invoice.emitter.resolucion_numero }} del {{ invoice.emitter.resolucion_fecha }}<br/>
            Prefijo {{ invoice.emitter.prefijo }} del {{ invoice.emitter.rango_desde }} al {{ invoice.emitter.rango_hasta }} ({{ invoice.emitter.ambiente }})
          </div>
        </div>

        <!-- Datos de la Factura y Estado de Reimpresión -->
        <div class="flex items-center justify-between border-b border-dashed border-stone-300 pb-2.5 text-[11px]">
          <div>
            <div class="font-extrabold text-stone-950 text-xs">FACTURA ELECTRÓNICA DE VENTA</div>
            <div class="font-mono font-bold text-amber-800 text-sm">{{ invoice.invoice_number }}</div>
            <div class="text-[10px] text-stone-500">Ref. Caja POS: #{{ invoice.receipt_reference }}</div>
          </div>
          <div class="text-right">
            <span 
              class="inline-block text-[10px] font-bold px-2 py-0.5 rounded border uppercase"
              :class="invoice.reprint_count > 1 ? 'bg-amber-50 text-amber-900 border-amber-300' : 'bg-emerald-50 text-emerald-800 border-emerald-300'"
            >
              {{ invoice.reprint_count > 1 ? `Reimpresión #${invoice.reprint_count - 1}` : 'Original' }}
            </span>
            <div class="text-[10px] font-mono text-stone-500 mt-1">
              {{ new Date(invoice.issue_date).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'medium' }) }}
            </div>
            <div class="text-[10px] text-stone-500">Pago: <strong>{{ invoice.payment_method }}</strong></div>
          </div>
        </div>

        <!-- Datos del Adquirente (Cliente) -->
        <div class="bg-stone-50 p-2.5 rounded-xl border border-stone-200 space-y-0.5 text-[11px]">
          <div class="text-[10px] font-bold uppercase text-stone-400">Datos del Adquirente / Comprador</div>
          <div class="font-bold text-stone-900">{{ invoice.customer.full_name }}</div>
          <div class="font-mono text-stone-700">{{ invoice.customer.document_type }}: {{ invoice.customer.document_number }}</div>
          <div class="text-stone-500 text-[10px]">{{ invoice.customer.email }}</div>
        </div>

        <!-- Detalle de Ítems -->
        <div class="border-b border-dashed border-stone-300 pb-2.5">
          <table class="w-full text-[11px]">
            <thead>
              <tr class="border-b border-stone-200 text-stone-500 uppercase text-[10px]">
                <th class="py-1 text-left">Cant. / Concepto</th>
                <th class="py-1 text-right">Base</th>
                <th class="py-1 text-right">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100">
              <tr v-for="(it, idx) in invoice.items" :key="idx">
                <td class="py-1.5 pr-2">
                  <div class="font-semibold text-stone-900">{{ it.quantity }}x {{ it.description }}</div>
                  <div class="text-[10px] font-mono text-stone-400">Cód: {{ it.code }} · INC {{ it.tax_rate_pct }}%</div>
                </td>
                <td class="py-1.5 text-right font-mono text-stone-700">${{ (it.unit_price_cop || 0).toLocaleString('es-CO') }}</td>
                <td class="py-1.5 text-right font-mono font-bold text-stone-950">${{ (it.line_total_cop || 0).toLocaleString('es-CO') }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Totales y Desglose de Impuestos -->
        <div class="space-y-1 text-xs border-b border-dashed border-stone-300 pb-3">
          <div class="flex justify-between text-stone-600">
            <span>Subtotal Base Gravable:</span>
            <span class="font-mono">${{ invoice.totals.subtotal_base_cop.toLocaleString('es-CO') }} COP</span>
          </div>
          <div v-if="invoice.totals.discount_cop > 0" class="flex justify-between text-emerald-700">
            <span>Descuento Aplicado:</span>
            <span class="font-mono">-${{ invoice.totals.discount_cop.toLocaleString('es-CO') }} COP</span>
          </div>
          <div class="flex justify-between text-stone-600">
            <span>Impoconsumo ({{ invoice.totals.tax_type }} {{ invoice.totals.tax_rate_pct }}%):</span>
            <span class="font-mono">${{ invoice.totals.tax_amount_cop.toLocaleString('es-CO') }} COP</span>
          </div>
          <div class="flex justify-between text-sm font-extrabold text-stone-950 pt-1 border-t border-stone-200">
            <span>TOTAL FACTURA:</span>
            <span class="font-mono">${{ invoice.totals.total_payable_cop.toLocaleString('es-CO') }} COP</span>
          </div>
          <div class="flex justify-between text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1 mt-1">
            <span>☕ Sellos de Fidelización Acreditados:</span>
            <span class="font-mono">+{{ invoice.totals.stamps_awarded }} sellos</span>
          </div>
        </div>

        <!-- QR de Validación DIAN y CUFE SHA-384 -->
        <div class="flex items-center gap-3 pt-1">
          <div class="bg-white p-1.5 border border-stone-300 rounded-xl shrink-0">
            <qrcode-vue :value="invoice.qr_url" :size="84" level="M" render-as="svg" />
          </div>
          <div class="space-y-1 min-w-0">
            <div class="text-[10px] font-bold uppercase text-stone-700">Representación Gráfica DIAN</div>
            <div class="text-[9px] font-mono text-stone-500 break-all leading-tight">
              <strong>CUFE (SHA-384):</strong> {{ invoice.cufe }}
            </div>
            <div v-if="invoice.credit_note_cude" class="text-[9px] font-mono text-red-700 break-all leading-tight">
              <strong>CUDE Nota Crédito:</strong> {{ invoice.credit_note_cude }}
            </div>
          </div>
        </div>
      </div>

      <!-- Botonera de Impresión y Descarga DIAN -->
      <div class="bg-stone-50 border-t border-stone-200 p-3.5 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          @click="printThermalTicket"
          class="flex-1 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>🖨️ Imprimir / PDF</span>
        </button>

        <button
          type="button"
          @click="$emit('download-xml', invoice.purchase_id, invoice.invoice_number)"
          class="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>📥 XML UBL 2.1 DIAN</span>
        </button>

        <button
          type="button"
          @click="downloadJsonDian"
          class="bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs py-2.5 px-3 rounded-xl transition cursor-pointer"
          title="Descargar estructura JSON para proveedor tecnológico"
        >
          JSON
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

const printThermalTicket = () => {
  const el = document.getElementById('dian-printable-ticket');
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
          table { width: 100%; border-collapse: collapse; margin: 6px 0; }
          th, td { padding: 4px 0; font-size: 11px; }
          .border-b { border-bottom: 1px dashed #666; padding-bottom: 8px; margin-bottom: 8px; }
          svg { display: block; margin: 6px auto; }
        </style>
      </head>
      <body>
        ${el.innerHTML}
        <script>
          window.onload = function() { window.print(); };
        <\/script>
      </body>
    </html>
  `);
  w.document.close();
};

const downloadJsonDian = () => {
  if (!props.invoice) return;
  const blob = new Blob([JSON.stringify(props.invoice, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `DIAN_${props.invoice.invoice_number}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
</script>
