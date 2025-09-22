<template>
  <UiContainer
    as="footer"
    class="flex flex-col items-center justify-between gap-7 py-12 lg:flex-row"
  >
    <ul class="flex flex-wrap gap-5">
      <li v-for="k in links" :key="k.name">
        <NuxtLink
          class="hover:text-primary"
          :to="k.href"
          :external="k.external || undefined"
          :target="k.external ? '_blank' : undefined"
          :rel="k.external ? 'noopener noreferrer' : undefined"
          >{{ k.name }}</NuxtLink
        >
      </li>
    </ul>

    <p class="text-muted-foreground">&copy; {{ new Date().getFullYear() }} {{ websiteName }}</p>
  </UiContainer>
</template>

<script setup lang="ts">
  const websiteName = "Invoisy";
  const links = [
    { name: "Beranda", href: "/" },
    { name: "Privasi", href: "/privacy" },
    { name: "Ketentuan", href: "/terms" },
    { name: "Kode Sumber", href: "https://github.com/rizkraf/invoisy", external: true },
  ];
</script>
