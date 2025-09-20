<script setup lang="ts">
  definePageMeta({ layout: false });
  const route = useRoute();
  const { $pdfMake } = useNuxtApp() as any;
  const pdfBlobUrl = ref<string | null>(null);
  const pdfViewerUrl = ref<string | null>(null);

  const decodePayload = () => {
    try {
      const raw = route.query.data as string | undefined;
      if (!raw) return null;
      const b64 = decodeURIComponent(raw);
      const jsonStr = typeof window !== "undefined" ? atob(b64) : b64;
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse pdf payload", e);
      return null;
    }
  };

  onMounted(async () => {
    const payload = decodePayload();
    if (!payload || !$pdfMake) return;
    const { buildInvoiceDocDefinition } = await import("~/utils/invoicePdfDoc");
    const doc = buildInvoiceDocDefinition(
      payload.values,
      payload.lineItems,
      payload.subtotal,
      payload.total
    );
    $pdfMake.createPdf(doc).getBlob((blob: Blob) => {
      const blobUrl = URL.createObjectURL(blob);
      pdfBlobUrl.value = blobUrl;
      const params = "#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&view=FitH";
      pdfViewerUrl.value = blobUrl + params;
    });
  });
  onBeforeUnmount(() => {
    if (pdfBlobUrl.value) URL.revokeObjectURL(pdfBlobUrl.value);
  });
</script>

<template>
  <div class="fixed inset-0 bg-black">
    <iframe v-if="pdfViewerUrl" :src="pdfViewerUrl" class="h-full w-full" style="border: 0" />
    <div v-else class="flex h-full w-full items-center justify-center text-zinc-200">
      Loading PDF…
    </div>
  </div>
</template>

<style>
  html,
  body,
  #__nuxt {
    height: 100%;
    margin: 0;
    padding: 0;
  }
</style>
