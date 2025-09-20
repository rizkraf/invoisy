<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-medium">Item Layanan</h3>
      <UiButton type="button" size="sm" @click="$emit('add')">Tambah Item</UiButton>
    </div>

    <div
      v-if="serviceItems.length === 0"
      class="text-muted-foreground rounded-md border p-4 text-sm"
    >
      Belum ada item. Klik "Tambah Item" untuk menambahkan.
    </div>

    <div v-for="(item, i) in serviceItems" :key="i" class="space-y-3 rounded-md border p-4">
      <div class="flex items-center justify-between">
        <h4 class="text-sm font-medium">Item #{{ i + 1 }}</h4>
        <UiButton type="button" variant="ghost" size="sm" @click="$emit('remove', i)"
          >Hapus</UiButton
        >
      </div>
      <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
        <UiVeeInput :name="`serviceItems[${i}].title`" label="Judul" />
        <UiVeeInput :name="`serviceItems[${i}].description`" label="Deskripsi" />
        <UiVeeInput :name="`serviceItems[${i}].quantity`" label="Kuantitas" />
        <UiVeeCurrencyInput
          :name="`serviceItems[${i}].price`"
          label="Harga"
          :options="currencyOptions"
        />
        <UiVeeInput :name="`serviceItems[${i}].tax`" label="Pajak (%)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  interface ServiceItem {
    title: string;
    description: string;
    price: number;
    quantity: string;
    tax?: string;
  }

  const props = defineProps<{ serviceItems: ServiceItem[]; currency?: string }>();
  defineEmits<{ (e: "add"): void; (e: "remove", index: number): void }>();

  const { currency } = toRefs(props);

  const currencyOptions = computed(() => {
    const cur = currency.value || "USD";
    const locale = currencyToLocale[cur] || "en-US";
    return { currency: cur, locale };
  });
</script>
