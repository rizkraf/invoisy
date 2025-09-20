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
        <UiVeeInput :name="`serviceItems[${i}].description`" label="Deskripsi Pekerjaan" />
        <UiVeeSelect :name="`serviceItems[${i}].unit`" label="Satuan">
          <option value="">Pilih Satuan</option>
          <option v-for="u in units" :key="u" :value="u">{{ u }}</option>
        </UiVeeSelect>

        <UiVeeCurrencyInput
          :name="`serviceItems[${i}].rate`"
          label="Rate"
          :options="currencyOptions"
        />
        <UiVeeInput
          :name="`serviceItems[${i}].quantity`"
          label="Jumlah (Jam/Qty)"
          type="number"
          min="1"
          step="1"
          inputmode="numeric"
        />
      </div>

      <div class="text-muted-foreground text-sm">
        Amount: <span class="font-medium">{{ formatAmount(item) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  interface ServiceItem {
    description: string;
    rate: number;
    quantity: number;
    unit?: string;
  }

  const props = defineProps<{ serviceItems: ServiceItem[]; currency?: string }>();
  defineEmits<{ (e: "add"): void; (e: "remove", index: number): void }>();

  const { currency } = toRefs(props);

  const currencyOptions = computed(() => {
    const cur = currency.value || "USD";
    const locale = currencyToLocale[cur] || "en-US";
    return { currency: cur, locale };
  });

  const formatter = computed(
    () =>
      new Intl.NumberFormat(currencyOptions.value.locale, {
        style: "currency",
        currency: currencyOptions.value.currency,
      })
  );

  const formatAmount = (item: ServiceItem) => {
    const amount = (Number(item.rate) || 0) * (Number(item.quantity) || 0);
    return formatter.value.format(amount);
  };

  const units = ["Hours", "Qty", "Project"];
</script>
