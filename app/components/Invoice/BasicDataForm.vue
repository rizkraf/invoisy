<template>
  <div class="space-y-4">
    <UiVeeInput label="Nama/Brand" name="freelancerName" />
    <UiVeeInput label="Kontak" name="freelancerContact" />
    <UiVeeInput label="Nama Klien" name="clientName" />
    <UiVeeInput label="Kontak Klien" name="clientContact" />
    <UiVeeDateField label="Tanggal Invoice" name="invoiceDate" />
    <UiVeeDateField label="Tanggal Jatuh Tempo" name="invoiceDueDate" />
    <UiVeeSelect label="Mata Uang" name="currency">
      <option disabled value="">Pilih Mata Uang</option>
      <option v-for="currency in currencies" :key="currency.value" :value="currency.value">
        {{ currency.label }}
      </option>
    </UiVeeSelect>
  </div>
</template>

<script lang="ts" setup>
  type LocalCurrencyOption = { label: string; value: string };

  const props = defineProps<{ currencies: LocalCurrencyOption[] }>();
</script>
