<template>
  <div class="space-y-6">
    <div class="space-y-4">
      <UiDivider label="Header" />
      <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
        <UiVeeInput label="Nama/Brand" name="brandName" />
        <UiVeeInput label="Nomor Invoice" name="invoiceNumber" />
      </div>
    </div>

    <div class="space-y-4">
      <UiDivider label="Billed To (Klien)" />
      <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
        <UiVeeInput label="Nama Klien/Perusahaan" name="clientName" />
        <UiVeeInput label="Perusahaan (opsional)" name="clientCompany" />
        <UiVeeInput label="Email Klien" name="clientEmail" />
        <UiVeeInput label="Telepon Klien" name="clientPhone" />
        <UiVeeInput class="md:col-span-2" label="Alamat Klien (opsional)" name="clientAddress" />
      </div>
    </div>

    <div class="space-y-4">
      <UiDivider label="Pay To (Freelancer)" />
      <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
        <UiVeeInput label="Nama Freelancer" name="freelancerName" />
        <UiVeeInput label="Role/Profesi" name="freelancerRole" />
        <UiVeeInput label="Email" name="freelancerEmail" />
        <UiVeeInput label="Telepon" name="freelancerPhone" />
      </div>
    </div>

    <div class="space-y-4">
      <UiDivider label="Tanggal & Mata Uang" />
      <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
        <UiVeeDateField label="Tanggal Invoice" name="invoiceDate" />
        <UiVeeDateField label="Tanggal Jatuh Tempo" name="invoiceDueDate" />
        <UiVeeSelect class="md:col-span-2" label="Mata Uang" name="currency">
          <option disabled value="">Pilih Mata Uang</option>
          <option v-for="currency in currencies" :key="currency.value" :value="currency.value">
            {{ currency.label }}
          </option>
        </UiVeeSelect>
      </div>
    </div>

    <div class="space-y-4">
      <UiDivider label="Metode Pembayaran" />
      <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
        <UiVeeSelect class="md:col-span-1" label="Pilih Metode" name="paymentMethod">
          <option value="bank">Bank Transfer</option>
          <option value="ewallet">E-Wallet</option>
          <option value="paypal">PayPal</option>
          <option value="wise">Wise</option>
        </UiVeeSelect>
        <div class="md:col-span-2"></div>
      </div>

      <div v-if="paymentMethod === 'bank'" class="space-y-2">
        <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
          <UiVeeInput label="Nama Bank" name="paymentBankName" />
          <UiVeeInput label="No. Rekening" name="paymentBankAccountNumber" />
          <UiVeeInput label="Nama Pemilik" name="paymentBankAccountHolder" />
        </div>
      </div>

      <div v-else-if="paymentMethod === 'ewallet'" class="space-y-2">
        <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
          <UiVeeInput label="GoPay (No. HP)" name="paymentEwalletGopay" />
          <UiVeeInput label="OVO (No. HP)" name="paymentEwalletOvo" />
          <UiVeeInput label="Dana (No. HP)" name="paymentEwalletDana" />
        </div>
        <p class="text-muted-foreground text-xs">Isi salah satu nomor e-wallet.</p>
      </div>

      <div v-else-if="paymentMethod === 'paypal'" class="space-y-2">
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <UiVeeInput label="Email PayPal" name="paymentPaypalEmail" />
        </div>
      </div>

      <div v-else-if="paymentMethod === 'wise'" class="space-y-2">
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <UiVeeInput label="Email Wise" name="paymentWiseEmail" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  type LocalCurrencyOption = { label: string; value: string };

  const props = defineProps<{ currencies: LocalCurrencyOption[] }>();
  const paymentMethod = useFieldValue<"bank" | "ewallet" | "paypal" | "wise">("paymentMethod");
</script>
