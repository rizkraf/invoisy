<template>
  <div
    class="a4-sheet relative mx-auto min-h-[1123px] w-full max-w-[794px] overflow-hidden rounded-lg border bg-white text-zinc-900 shadow-sm"
  >
    <ClientOnly>
      <div class="h-[1123px] w-full">
        <InvoicePdfCanvasViewer v-if="pdfBlob" :blob="pdfBlob" />
        <div v-else class="p-8 text-sm text-zinc-500">Membuat pratinjau PDF…</div>
      </div>
    </ClientOnly>
    <noscript>
      <div class="p-8 text-sm text-zinc-500">Aktifkan JavaScript untuk melihat pratinjau PDF.</div>
    </noscript>
  </div>
</template>

<script lang="ts" setup>
  import { buildInvoiceDocDefinition } from "~/utils/invoicePdfDoc";

  const props = defineProps<{
    values: any;
    lineItems: any[];
    subtotal: number;
    total: number;
  }>();

  const { values, lineItems, subtotal, total } = toRefs(props);

  const pdfBlob = ref<Blob | null>(null);
  const { $pdfMake } = useNuxtApp() as any;

  const regenerate = async () => {
    if (typeof window === "undefined" || !$pdfMake) return;
    const doc = buildInvoiceDocDefinition(
      values.value,
      lineItems.value,
      subtotal.value,
      total.value
    );
    await new Promise<void>((resolve) => {
      $pdfMake.createPdf(doc).getBlob((blob: Blob) => {
        pdfBlob.value = blob;
        resolve();
      });
    });
  };
  // Debounce regeneration to avoid flicker during rapid edits
  let regenTimer: ReturnType<typeof setTimeout> | null = null;
  const scheduleRegen = () => {
    if (regenTimer) clearTimeout(regenTimer);
    regenTimer = setTimeout(() => {
      regenTimer = null;
      regenerate();
    }, 250);
  };

  onMounted(regenerate);
  watch([values, lineItems, subtotal, total], scheduleRegen, { deep: true });
  // No revoke needed; blob is released when component GC's
</script>

<style scoped>
  .a4-sheet {
    width: 100%;
    max-width: 794px;
    min-height: 1123px;
    overflow: hidden;
  }
</style>
