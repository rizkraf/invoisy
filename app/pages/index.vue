<template>
  <UiContainer class="relative flex flex-col items-center py-10 text-center lg:py-20">
    <div>
      <UiBadge variant="outline" class="px-3 py-1.5 text-sm font-normal lg:py-2">
        <Icon name="lucide:shield-check" class="mr-1 inline size-4" />
        Aman, Data Tetap di Perangkat Anda</UiBadge
      >
    </div>

    <h1 class="mt-7 mb-4 text-4xl font-bold lg:mt-5 lg:mb-6 lg:text-center lg:text-5xl xl:text-6xl">
      Buat Invoice Instan, Tanpa Ribet Login
    </h1>
    <p class="text-muted-foreground mx-auto max-w-[760px] text-lg lg:text-center lg:text-xl">
      Invoisy membantu freelancer dan profesional membuat invoice profesional dalam hitungan menit.
      Tidak perlu akun, cukup isi detailnya dan dapatkan invoice siap kirim.
    </p>

    <div class="mt-8 grid w-full grid-cols-1 items-center gap-3 sm:flex sm:justify-center lg:mt-10">
      <UiButton size="lg" to="/generate">
        Buat Invoice Sekarang
        <Icon name="lucide:plus-circle" />
      </UiButton>
    </div>

    <div
      class="mx-auto mt-10 w-full rounded-md shadow lg:mt-10 lg:w-[900px] lg:rounded-lg lg:shadow-lg"
    >
      <NuxtImg
        src="/invoice-form-mockup.png"
        alt="Screenshot of the invoice form"
        sizes="100vw sm:50vw md:900px"
        class="block h-auto w-full"
        priority
      />
    </div>
  </UiContainer>
</template>

<script setup lang="ts">
  useHead({
    title: "Invoisy - Buat Invoice Profesional Tanpa Ribet Login",
    meta: [
      {
        name: "description",
        content:
          "Invoisy membantu freelancer dan profesional membuat invoice profesional dalam hitungan menit. Tidak perlu akun, cukup isi detailnya dan dapatkan invoice siap kirim.",
      },
      {
        name: "keywords",
        content:
          "invoice, buat invoice, invoice profesional, invoice freelancer, invoice online, template invoice, generator invoice, tanpa login, gratis",
      },
    ],
  });
</script>
