<script setup lang="ts">
  // Disable default layout (no site header/footer) for clean PDF output
  definePageMeta({ layout: false });
  const route = useRoute();
  const router = useRouter();

  type Payload = {
    values: any;
    lineItems: any[];
    subtotal: number;
    total: number;
  };

  const payload = computed<Payload | null>(() => {
    try {
      const raw = route.query.data as string | undefined;
      if (!raw) return null;
      const b64 = decodeURIComponent(raw);
      // Use browser-friendly base64 decoding; fallback to Buffer on server if available
      const jsonStr =
        typeof window !== "undefined"
          ? atob(b64)
          : globalThis.Buffer
            ? Buffer.from(b64, "base64").toString()
            : b64;
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse print payload", e);
      return null;
    }
  });

  const values = computed(() => payload.value?.values ?? {});
  const lineItems = computed(() => payload.value?.lineItems ?? []);
  const subtotal = computed(() => payload.value?.subtotal ?? 0);
  const total = computed(() => payload.value?.total ?? 0);

  // Set document title from query (?title=...) for nicer default PDF filename
  onMounted(() => {
    const title = (route.query.title as string | undefined) || "invoice.pdf";
    try {
      document.title = decodeURIComponent(title);
    } catch {
      document.title = title;
    }

    // Defer print until next frame to ensure layout is ready
    requestAnimationFrame(() => {
      window.print();
      // Optional: try closing tab after print (may be blocked by browsers)
      setTimeout(() => {
        window.close();
      }, 300);
    });
  });
</script>

<template>
  <div class="min-h-screen bg-zinc-100 p-4 print:bg-white print:p-0">
    <InvoicePreview :values="values" :line-items="lineItems" :subtotal="subtotal" :total="total" />
  </div>
  <ClientOnly>
    <Teleport to="body">
      <div class="hidden print:block"></div>
    </Teleport>
  </ClientOnly>
</template>

<style>
  /* Lock page size to A4 and remove margins for print */
  @media print {
    @page {
      size: A4;
      margin: 0;
    }
    html,
    body {
      height: 297mm;
      margin: 0 !important;
      padding: 0 !important;
    }
  }
  /* Ensure body background white when printing */
  @media print {
    html,
    body {
      background: #fff !important;
    }
  }
</style>
