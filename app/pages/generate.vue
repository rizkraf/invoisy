<template>
  <UiContainer>
    <div class="mb-5 space-y-8 text-center">
      <UiStepper v-model="currentStep" :default-value="1">
        <UiStepperItem
          v-for="{ step, title, description } in steps3"
          :key="step"
          :step="step"
          class="relative flex-1 flex-col"
        >
          <UiStepperTrigger class="flex-col gap-3 rounded">
            <UiStepperIndicator />
            <div class="space-y-0.5">
              <UiStepperTitle>{{ title }}</UiStepperTitle>
              <UiStepperDescription class="max-sm:hidden">
                {{ description }}
              </UiStepperDescription>
            </div>
          </UiStepperTrigger>
          <UiStepperSeparator
            v-if="step < steps3.length"
            class="absolute inset-x-0 top-3 left-[calc(50%+0.75rem+0.125rem)] -order-1 m-0 -translate-y-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none"
          />
        </UiStepperItem>
      </UiStepper>
    </div>
    <form @submit.prevent="onSubmit">
      <fieldset :disabled="isSubmitting" class="space-y-5">
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
        <div class="flex justify-end gap-3">
          <UiButton
            variant="outline"
            class="w-32"
            :disabled="currentStep === 1"
            @click="currentStep = currentStep - 1"
          >
            Sebelumnya
          </UiButton>
          <UiButton
            variant="outline"
            class="w-32"
            :disabled="currentStep > steps3.length"
            @click="currentStep = currentStep + 1"
          >
            Selanjutnya
          </UiButton>
        </div>
      </fieldset>
    </form>
  </UiContainer>
</template>

<script lang="ts" setup>
  import { CalendarDate } from "@internationalized/date";
  import { z } from "zod";

  const isDateValue = (v: any) =>
    v && typeof v === "object" && "year" in v && "month" in v && "day" in v;

  const schema = z.object({
    freelancerName: z.string().min(2, "Nama harus diisi"),
    freelancerContact: z.string().min(2, "Kontak harus diisi"),
    clientName: z.string().min(2, "Nama klien harus diisi"),
    clientContact: z.string().min(2, "Kontak klien harus diisi"),
    invoiceDate: z.any().refine(isDateValue, "Tanggal invoice tidak valid"),
    invoiceDueDate: z.any().refine(isDateValue, "Tanggal jatuh tempo tidak valid"),
    currency: z.string().min(1, "Mata uang harus dipilih"),
    serviceItems: z.array(
      z.object({
        title: z.string().min(1, "Judul harus diisi"),
        description: z.string().min(1, "Deskripsi harus diisi"),
        price: z.string().min(1, "Harga harus diisi"),
        quantity: z.string().min(1, "Kuantitas harus diisi"),
        tax: z.string().optional(),
      })
    ),
  });

  type InferSchema = z.infer<typeof schema>;
  const { handleSubmit, isSubmitting, resetForm, values } = useForm<InferSchema>({
    name: "form-builder-full",
    validationSchema: schema,
    initialValues: {
      freelancerName: "",
      freelancerContact: "",
      clientName: "",
      clientContact: "",
      invoiceDate: new CalendarDate(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        new Date().getDate()
      ),
      invoiceDueDate: new CalendarDate(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        new Date().getDate()
      ),
      currency: "",
      serviceItems: [],
    },
  });

  const currentStep = ref(1);
  const steps3 = [
    {
      step: 1,
      title: "Data Dasar",
      description: "Masukkan informasi bisnis dan klien Anda.",
    },
    {
      step: 2,
      title: "Item Layanan",
      description: "Tambahkan layanan atau produk yang Anda faktur.",
    },
    {
      step: 3,
      title: "Pratinjau & Unduh",
      description: "Tinjau dan unduh invoice profesional Anda.",
    },
  ];

  const currencies = [
    { label: "USD - Dolar Amerika Serikat", value: "USD" },
    { label: "EUR - Euro", value: "EUR" },
    { label: "IDR - Rupiah Indonesia", value: "IDR" },
    { label: "JPY - Yen Jepang", value: "JPY" },
    { label: "GBP - Pound Sterling Inggris", value: "GBP" },
    { label: "AUD - Dolar Australia", value: "AUD" },
    { label: "CAD - Dolar Kanada", value: "CAD" },
    { label: "CHF - Franc Swiss", value: "CHF" },
    { label: "CNY - Yuan Tiongkok", value: "CNY" },
    { label: "INR - Rupee India", value: "INR" },
  ];

  const onSubmit = handleSubmit(async (_) => {
    console.log("Form Submitted", values);
  });
</script>
