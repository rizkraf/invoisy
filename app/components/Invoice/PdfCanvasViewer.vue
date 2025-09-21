<template>
  <div ref="root" class="relative h-full w-full overflow-auto bg-white"></div>
</template>

<script setup lang="ts">
  import { renderPdfTo } from "~/utils/pdfjs";

  const props = defineProps<{ blob: Blob | null }>();
  const root = ref<HTMLElement | null>(null);
  let renderToken = 0;

  const draw = async () => {
    const host = root.value;
    const blob = props.blob;
    if (!host || !blob) return;

    const token = ++renderToken;
    const ab = await blob.arrayBuffer();

    // Prepare an off-DOM buffer container to render into
    const buffer = document.createElement("div");
    buffer.style.position = "absolute";
    buffer.style.visibility = "hidden";
    buffer.style.pointerEvents = "none";
    buffer.style.top = "0";
    buffer.style.left = "0";
    buffer.style.width = `${host.clientWidth}px`;

    // Attach buffer first so measured width is accurate but content stays invisible
    host.appendChild(buffer);

    try {
      await renderPdfTo(buffer, ab, { fitWidth: host.clientWidth });
    } catch (e) {
      // On error, remove the buffer and exit
      if (buffer.parentElement === host) host.removeChild(buffer);
      return;
    }

    // If another render started while we were working, abort swap
    if (token !== renderToken) {
      if (buffer.parentElement === host) host.removeChild(buffer);
      return;
    }

    // Swap: make buffer visible and remove previous siblings, leaving no empty state
    buffer.style.position = "static";
    buffer.style.visibility = "visible";
    buffer.style.pointerEvents = "auto";
    buffer.style.width = "100%";

    // Remove everything except the buffer we just rendered
    Array.from(host.childNodes).forEach((node) => {
      if (node !== buffer) host.removeChild(node);
    });
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
