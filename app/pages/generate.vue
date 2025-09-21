<template>
  <UiContainer>
    <div class="mb-5 space-y-8 text-center">
      <UiStepper v-model="currentStep" :default-value="1">
        <UiStepperItem
          v-for="{ step, title, description } in steps"
          :key="step"
          :step="step"
          class="relative flex-1 flex-col justify-center"
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
            v-if="step < steps.length"
            class="absolute inset-x-0 top-3 left-[calc(50%+0.75rem+0.125rem)] -order-1 m-0 -translate-y-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none"
          />
        </UiStepperItem>
      </UiStepper>
    </div>

    <!-- Two-column layout: form + live preview -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <form @submit.prevent="onSubmit">
        <fieldset :disabled="isSubmitting" class="space-y-5">
          <!-- Step 1: Data Dasar -->
          <template v-if="currentStep === 1">
            <InvoiceBasicDataForm :currencies="currencies" />
          </template>

          <!-- Step 2: Item Layanan -->
          <template v-else-if="currentStep === 2">
            <InvoiceServiceItemsEditor
              :service-items="values.serviceItems"
              :currency="values.currency"
              @add="addServiceItem"
              @remove="removeServiceItem"
            />
          </template>

          <!-- Step 3: Tambahan -->
          <template v-else-if="currentStep === 3">
            <InvoiceExtrasForm />
          </template>

          <!-- Navigation Buttons -->
          <div class="flex justify-end gap-3 pt-2">
            <UiButton
              type="button"
              variant="outline"
              class="w-32"
              :disabled="currentStep === 1"
              @click="prevStep"
            >
              Sebelumnya
            </UiButton>

            <UiButton
              v-if="currentStep === 1 || currentStep === 2"
              type="button"
              variant="default"
              class="w-32"
              @click="nextStep"
            >
              Selanjutnya
            </UiButton>

            <UiButton
              v-else-if="currentStep === 3"
              type="button"
              variant="default"
              class="w-40"
              @click="downloadPdf()"
            >
              Download PDF
            </UiButton>
          </div>
        </fieldset>
      </form>

      <!-- Preview column -->
      <div class="lg:sticky lg:top-20">
        <InvoicePreview
          :values="values"
          :line-items="lineItems"
          :subtotal="subtotal"
          :total="total"
        />
      </div>
    </div>
  </UiContainer>
</template>

<script lang="ts" setup>
  import { currencies } from "~/utils/currencies";

  useHead({
    title: "Buat Invoice Profesional - Invoisy",
    meta: [
      {
        name: "description",
        content:
          "Buat invoice profesional dalam hitungan menit. Isi detailnya, tambahkan item layanan, dan download PDF siap kirim. Gratis, tanpa perlu login.",
      },
      {
        name: "keywords",
        content:
          "buat invoice, invoice profesional, generator invoice, template invoice, download invoice, tanpa login, gratis",
      },
    ],
  });

  const InvoiceExtrasForm = resolveComponent("InvoiceExtrasForm");

  const {
    currentStep,
    steps,
    values,
    isSubmitting,
    lineItems,
    subtotal,
    total,
    onSubmit,
    nextStep,
    prevStep,
    addServiceItem,
    removeServiceItem,
  } = useInvoiceForm();

  const { download } = useInvoicePdf();
  const downloadPdf = async () => {
    try {
      await download({
        values,
        lineItems: lineItems.value,
        subtotal: subtotal.value,
        total: total.value,
        fileName: `${values.invoiceNumber || "invoice"}.pdf`,
      } as any);

      useSonner.success("Invoice berhasil didownload", {
        description: "Terima kasih telah menggunakan aplikasi ini!",
        richColors: true,
        duration: 5000,
      });
    } catch (err) {
      console.error("Failed to download PDF:", err);
    }
  };
</script>
