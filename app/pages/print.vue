<script setup lang="ts">
  const route = useRoute();

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
</script>

<template>
  <div class="min-h-screen bg-zinc-100 p-4 print:bg-white">
    <InvoicePreview :values="values" :line-items="lineItems" :subtotal="subtotal" :total="total" />
  </div>
  <ClientOnly>
    <Teleport to="body">
      <div class="hidden print:block"></div>
    </Teleport>
  </ClientOnly>
</template>

<style>
  /* Ensure body background white when printing */
  @media print {
    html,
    body {
      background: #fff !important;
    }
  }
</style>
