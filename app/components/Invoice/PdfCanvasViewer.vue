<template>
  <div ref="root" class="relative h-full w-full overflow-auto bg-white"></div>
</template>

<script setup lang="ts">
  import { renderPdfInto } from "~/utils/pdfjs";

  const props = defineProps<{ blob: Blob | null }>();
  const root = ref<HTMLElement | null>(null);

  const draw = async () => {
    if (!root.value || !props.blob) return;
    const ab = await props.blob.arrayBuffer();
    await renderPdfInto(root.value, ab, { fitWidth: root.value.clientWidth });
  };

  onMounted(draw);
  watch(() => props.blob, draw);
</script>

<style scoped>
  :host,
  div {
    background: white;
  }
</style>
