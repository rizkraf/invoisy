<template>
  <div class="space-y-6">
    <div class="space-y-4">
      <UiDivider label="Header" />
      <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
        <UiVeeInput
          label="Nama/Brand (Opsional)"
          name="brandName"
          placeholder="Nama usaha atau brand"
        />
        <UiVeeInput label="Nomor Invoice" name="invoiceNumber" placeholder="Contoh: #2025-0920" />
      </div>
    </div>

    <div class="space-y-4">
      <UiDivider label="Billed To (Klien)" />
      <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
        <UiVeeInput
          label="Nama Klien/Perusahaan"
          name="clientName"
          placeholder="Nama klien atau perusahaan"
        />
        <UiVeeInput
          label="Perusahaan (opsional)"
          name="clientCompany"
          placeholder="PT Contoh Teknologi"
        />
        <UiVeeInput label="Email Klien" name="clientEmail" placeholder="klien@contoh.com" />
        <UiVeeInput label="Telepon Klien" name="clientPhone" placeholder="08xxxxxxxxxx" />
        <UiVeeInput
          class="md:col-span-2"
          label="Alamat Klien (opsional)"
          name="clientAddress"
          placeholder="Jalan, Kota, Negara"
        />
      </div>
    </div>

    <div class="space-y-4">
      <UiDivider label="Pay To (Freelancer)" />
      <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
        <UiVeeInput label="Nama Freelancer" name="freelancerName" placeholder="Nama lengkap Anda" />
        <UiVeeInput label="Role/Profesi" name="freelancerRole" placeholder="UI/UX Designer" />
        <UiVeeInput label="Email" name="freelancerEmail" placeholder="nama@contoh.com" />
        <UiVeeInput label="Telepon" name="freelancerPhone" placeholder="08xxxxxxxxxx" />
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
          <option value="cash">Cash</option>
        </UiVeeSelect>
        <div class="md:col-span-2"></div>
      </div>

      <div v-if="paymentMethod === 'bank'" class="space-y-2">
        <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
          <UiVeeInput
            label="Nama Bank"
            name="paymentBankName"
            placeholder="BCA / BNI / BRI / Mandiri"
          />
          <UiVeeInput
            label="No. Rekening"
            name="paymentBankAccountNumber"
            placeholder="1234567890"
          />
          <UiVeeInput
            label="Nama Pemilik"
            name="paymentBankAccountHolder"
            placeholder="Nama pada rekening"
          />
        </div>
      </div>

      <div v-else-if="paymentMethod === 'ewallet'" class="space-y-2">
        <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
          <UiVeeInput
            label="GoPay (No. HP)"
            name="paymentEwalletGopay"
            placeholder="08xxxxxxxxxx"
          />
          <UiVeeInput label="OVO (No. HP)" name="paymentEwalletOvo" placeholder="08xxxxxxxxxx" />
          <UiVeeInput label="Dana (No. HP)" name="paymentEwalletDana" placeholder="08xxxxxxxxxx" />
        </div>
        <p class="text-muted-foreground text-xs">Isi salah satu nomor e-wallet.</p>
      </div>

      <div v-else-if="paymentMethod === 'paypal'" class="space-y-2">
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <UiVeeInput
            label="Email PayPal"
            name="paymentPaypalEmail"
            placeholder="email@paypal.com"
          />
        </div>
      </div>

      <div v-else-if="paymentMethod === 'wise'" class="space-y-2">
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <UiVeeInput label="Email Wise" name="paymentWiseEmail" placeholder="email@wise.com" />
        </div>
      </div>

      <div v-else-if="paymentMethod === 'cash'" class="space-y-2">
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <UiVeeInput
            class="md:col-span-2"
            label="Catatan Pembayaran Tunai (opsional)"
            name="paymentCashNote"
            placeholder="Contoh: Bayar tunai saat penyerahan, lokasi: kantor klien"
          />
        </div>
        <p class="text-muted-foreground text-xs">
          Tidak ada detail tambahan yang diperlukan untuk pembayaran tunai.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  type LocalCurrencyOption = { label: string; value: string };

  const props = defineProps<{ currencies: LocalCurrencyOption[] }>();
  const paymentMethod = useFieldValue<"bank" | "ewallet" | "paypal" | "wise" | "cash">(
    "paymentMethod"
  );
</script>
