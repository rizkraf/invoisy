<template>
  <header class="bg-background/90 z-20 backdrop-blur">
    <UiContainer class="flex h-16 items-center justify-between lg:h-20">
      <div class="flex items-center gap-10">
        <NuxtLink to="/" class="flex items-center gap-3">
          <span class="font-semibold lg:text-lg">Invoisy</span>
        </NuxtLink>
      </div>
      <div class="items-center gap-3">
        <UiButton to="/generate" variant="outline" size="sm"> Buat Invoice </UiButton>
      </div>
    </UiContainer>
  </header>
</template>
