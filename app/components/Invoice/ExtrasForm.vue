<template>
  <div class="space-y-6">
    <div class="space-y-4">
      <UiDivider label="Ringkasan & Diskon" />
      <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
        <UiVeeCurrencyInput
          name="discount"
          label="Diskon"
          :options="currencyOptions"
          placeholder="0"
        />
      </div>
    </div>

    <div class="space-y-4">
      <UiDivider label="Catatan & Ketentuan" />
      <div class="grid grid-cols-1 gap-3">
        <UiVeeInput
          name="paymentTerms"
          label="Ketentuan Pembayaran"
          placeholder="Harap dibayar dalam 7 hari"
        />
        <UiVeeInput name="notes" label="Catatan" placeholder="Harga termasuk 2x revisi" />
        <UiVeeInput name="thankYou" label="Ucapan Terima Kasih" placeholder="Terima kasih" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const currency = useFieldValue<string>("currency");
  const currencyOptions = computed(() => {
    const cur = currency.value || "USD";
    const locale = currencyToLocale[cur] || "en-US";
    return { currency: cur, locale };
  });
</script>
