<template>
  <div
    class="a4-sheet relative mx-auto min-h-[1123px] w-full max-w-[794px] overflow-hidden rounded-lg border bg-white text-zinc-900 shadow-sm"
  >
    <!-- Header -->
    <div class="p-8">
      <div class="flex items-start justify-between">
        <div class="space-y-1">
          <p class="text-sm" :class="[values.brandName ? 'text-zinc-600' : 'text-zinc-400 italic']">
            {{ values.brandName }}
          </p>
        </div>
        <div class="text-right">
          <div class="text-[34px] font-light tracking-[0.35em]">INVOICE</div>
          <div
            class="mt-2 text-xs tracking-widest"
            :class="[values.invoiceNumber ? 'text-zinc-500' : 'text-zinc-400 italic']"
          >
            {{ values.invoiceNumber || placeholder.header.invoiceNumber }}
          </div>
          <div class="mt-3 space-y-1 text-right text-[11px] text-zinc-600">
            <div>
              <span class="mr-2">Invoice Date:</span>
              <span class="font-medium text-zinc-700">{{ fmtDate(values.invoiceDate) }}</span>
            </div>
            <div>
              <span class="mr-2">Due Date:</span>
              <span class="font-medium text-zinc-700">{{ fmtDate(values.invoiceDueDate) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Billed To / Pay To -->
      <div class="mt-10 grid gap-8 md:grid-cols-2">
        <div>
          <div class="text-[11px] font-semibold tracking-[0.2em]">BILLED TO:</div>
          <div class="mt-2 space-y-1 text-sm">
            <div class="font-medium">{{ values.clientName || placeholder.client.name }}</div>
            <div :class="[values.clientCompany ? 'text-zinc-600' : 'text-zinc-400 italic']">
              {{ values.clientCompany || placeholder.client.company }}
            </div>
            <div :class="[values.clientAddress ? 'text-zinc-600' : 'text-zinc-400 italic']">
              {{ values.clientAddress }}
            </div>
            <div :class="[values.clientEmail ? 'text-zinc-600' : 'text-zinc-400 italic']">
              {{ values.clientEmail }}
            </div>
            <div :class="[values.clientPhone ? 'text-zinc-600' : 'text-zinc-400 italic']">
              {{ values.clientPhone }}
            </div>
          </div>
        </div>
        <div>
          <div class="text-[11px] font-semibold tracking-[0.2em]">PAY TO:</div>
          <div class="mt-2 space-y-1 text-sm">
            <div class="font-medium">
              {{ values.freelancerName || placeholder.freelancer.name }}
            </div>
            <div :class="[values.freelancerRole ? 'text-zinc-600' : 'text-zinc-400 italic']">
              {{ values.freelancerRole || placeholder.freelancer.role }}
            </div>
            <div :class="[values.freelancerEmail ? 'text-zinc-600' : 'text-zinc-400 italic']">
              {{ values.freelancerEmail }}
            </div>
            <div :class="[values.freelancerPhone ? 'text-zinc-600' : 'text-zinc-400 italic']">
              {{ values.freelancerPhone }}
            </div>

            <!-- Bank / Payment Details -->
            <div v-if="values.paymentMethod === 'bank'" class="mt-3 space-y-0.5 text-sm">
              <div>
                <span class="text-zinc-500">Bank</span>
                <span
                  class="ml-6"
                  :class="[bankComplete ? 'text-zinc-900' : 'text-zinc-400 italic']"
                >
                  {{ values.paymentBankName }}
                </span>
              </div>
              <div>
                <span class="text-zinc-500">Account Name</span>
                <span
                  class="ml-2"
                  :class="[bankComplete ? 'text-zinc-900' : 'text-zinc-400 italic']"
                  >{{ values.paymentBankAccountHolder }}</span
                >
              </div>
              <div>
                <span class="text-zinc-500">Account Number</span>
                <span
                  class="ml-2"
                  :class="[bankComplete ? 'text-zinc-900' : 'text-zinc-400 italic']"
                  >{{ values.paymentBankAccountNumber }}</span
                >
              </div>
            </div>
            <div v-else-if="values.paymentMethod === 'ewallet'" class="mt-3 space-y-0.5 text-sm">
              <div>
                <span class="text-zinc-500">GoPay</span>
                <span
                  class="ml-6"
                  :class="[values.paymentEwalletGopay ? 'text-zinc-900' : 'text-zinc-400 italic']"
                >
                  {{ values.paymentEwalletGopay }}
                </span>
              </div>
              <div>
                <span class="text-zinc-500">OVO</span>
                <span
                  class="ml-10"
                  :class="[values.paymentEwalletOvo ? 'text-zinc-900' : 'text-zinc-400 italic']"
                >
                  {{ values.paymentEwalletOvo }}
                </span>
              </div>
              <div>
                <span class="text-zinc-500">Dana</span>
                <span
                  class="ml-9"
                  :class="[values.paymentEwalletDana ? 'text-zinc-900' : 'text-zinc-400 italic']"
                >
                  {{ values.paymentEwalletDana }}
                </span>
              </div>
            </div>
            <div v-else-if="values.paymentMethod === 'paypal'" class="mt-3 text-sm">
              <span class="text-zinc-600">PayPal:</span>
              <span :class="[values.paymentPaypalEmail ? 'text-zinc-900' : 'text-zinc-400 italic']">
                {{ values.paymentPaypalEmail }}
              </span>
            </div>
            <div v-else-if="values.paymentMethod === 'wise'" class="mt-3 text-sm">
              <span class="text-zinc-600">Wise:</span>
              <span :class="[values.paymentWiseEmail ? 'text-zinc-900' : 'text-zinc-400 italic']">
                {{ values.paymentWiseEmail }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Table Header -->
      <div class="mt-10 text-[11px] font-semibold tracking-[0.2em]">ITEM</div>
      <div class="mt-2 h-px w-full bg-zinc-300"></div>
      <div class="grid grid-cols-12 py-2 text-[11px] font-semibold tracking-[0.2em] text-zinc-700">
        <div class="col-span-6">DESCRIPTION</div>
        <div class="col-span-3">RATE</div>
        <div class="col-span-1 text-center">{{ qtyHeader }}</div>
        <div class="col-span-2 text-right">AMOUNT</div>
      </div>
      <div class="h-px w-full bg-zinc-300"></div>

      <!-- Line Items -->
      <div v-if="lineItems.length > 0">
        <div
          v-for="(it, idx) in lineItems"
          :key="idx"
          class="line-row grid grid-cols-12 items-start gap-2 py-3"
        >
          <div class="col-span-6">
            <div class="text-sm" :class="[it.description ? '' : 'text-zinc-400 italic']">
              {{ it.description || placeholder.lineItem.description }}
            </div>
          </div>
          <div class="col-span-3 min-w-0 text-sm text-zinc-700">
            <span class="block truncate whitespace-nowrap">{{ formatRate(it.rate, it.unit) }}</span>
          </div>
          <div class="col-span-1 text-center text-sm text-zinc-700">{{ it.quantity }}</div>
          <div class="col-span-2 text-right text-sm font-medium">{{ fmt(it.amount || 0) }}</div>
          <div class="col-span-12 h-px w-full bg-zinc-200"></div>
        </div>
      </div>
      <div v-else class="py-6 text-sm text-zinc-500">Belum ada item layanan.</div>

      <!-- Totals -->
      <div class="no-break mt-6 grid grid-cols-12 gap-2">
        <div class="col-span-6"></div>
        <div class="col-span-6 space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="text-zinc-700">Sub-Total</span>
            <span class="font-medium">{{ fmt(subtotal) }}</span>
          </div>
          <div v-if="values.discount" class="flex items-center justify-between text-sm">
            <span class="text-zinc-700">Discount</span>
            <span class="font-medium">{{ fmt(values.discount || 0) }}</span>
          </div>
          <div class="h-px w-full bg-zinc-300"></div>
          <div class="flex items-center justify-between text-base font-semibold">
            <span class="tracking-[0.2em]">TOTAL</span>
            <span class="text-lg">{{ fmt(total) }}</span>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div class="no-break mt-10 space-y-4 text-sm text-zinc-700">
        <p v-if="values.paymentTerms">{{ values.paymentTerms }}</p>
        <p v-if="values.notes">{{ values.notes }}</p>
        <p v-if="values.thankYou">{{ values.thankYou }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { currencyToLocale } from "~/utils/currencies";

  interface ServiceItem {
    description: string;
    rate: number;
    quantity: number;
    unit?: string;
    amount?: number;
  }
  interface ValuesShape {
    brandName?: string;
    invoiceNumber?: string;
    freelancerName?: string;
    freelancerRole?: string;
    freelancerEmail?: string;
    freelancerPhone?: string;
    clientName?: string;
    clientCompany?: string;
    clientEmail?: string;
    clientPhone?: string;
    clientAddress?: string;
    invoiceDate?: any;
    invoiceDueDate?: any;
    currency?: string;
    discount?: number;
    paymentMethod?: "bank" | "ewallet" | "paypal" | "wise";
    paymentBankName?: string;
    paymentBankAccountNumber?: string;
    paymentBankAccountHolder?: string;
    paymentEwalletGopay?: string;
    paymentEwalletOvo?: string;
    paymentEwalletDana?: string;
    paymentPaypalEmail?: string;
    paymentWiseEmail?: string;
    paymentTerms?: string;
    notes?: string;
    thankYou?: string;
  }

  const props = defineProps<{
    values: ValuesShape;
    lineItems: ServiceItem[];
    subtotal: number;
    total: number;
  }>();

  const { values, lineItems, subtotal, total } = toRefs(props);

  const locale = computed(() => currencyToLocale[values.value.currency || "USD"] || "en-US");
  const currencyCode = computed(() => values.value.currency || "USD");

  const formatter = computed(
    () => new Intl.NumberFormat(locale.value, { style: "currency", currency: currencyCode.value })
  );
  const fmt = (n: number) => formatter.value.format(Number(n || 0));

  const fmtDate = (d: any) => {
    if (!d || typeof d !== "object" || !("year" in d)) return "";
    const dt = new Date(d.year, d.month - 1, d.day);
    return dt.toLocaleDateString(locale.value, { year: "numeric", month: "long", day: "numeric" });
  };

  const formatRate = (rate?: number, unit?: string) => {
    if (rate == null) return "—";
    const u = (unit || "").toLowerCase();
    const compact = u === "hours" ? "h" : u === "project" ? "prj" : u === "qty" ? "qty" : u;
    const suffix = compact ? `/${compact}` : "";
    return `${fmt(rate)}${suffix}`;
  };

  const qtyHeader = computed(() => {
    // Use HOURS if any item uses Hours, fallback to QTY
    const hasHours = (lineItems.value || []).some((i) => (i.unit || "").toLowerCase() === "hours");
    return hasHours ? "HOURS" : "QTY";
  });

  const bankComplete = computed(
    () =>
      !!(
        values.value.paymentBankName &&
        values.value.paymentBankAccountNumber &&
        values.value.paymentBankAccountHolder
      )
  );
  const ewalletAny = computed(
    () =>
      !!(
        values.value.paymentEwalletGopay ||
        values.value.paymentEwalletOvo ||
        values.value.paymentEwalletDana
      )
  );

  const placeholder = {
    header: {
      invoiceNumber: "#2025-0001",
    },
    client: {
      name: "Really Great Company",
      company: "Really Great Company",
    },
    freelancer: {
      name: "John Doe",
      role: "Freelancer",
    },
    lineItem: { description: "Deskripsi pekerjaan" },
  };
</script>

<style scoped>
  /* Keep styling minimal; rely on Tailwind for the layout and typography */
  /* A4 sheet sizing: ~96dpi screen 794x1123px; print uses mm */
  .a4-sheet {
    /* responsive fallback if utility classes get overridden */
    width: 100%;
    max-width: 794px;
    min-height: 1123px; /* matches min-h utility */
    overflow: hidden;
  }

  @media print {
    .a4-sheet {
      width: 210mm;
      min-height: 297mm;
      margin: 0;
      box-shadow: none;
      border: none;
    }

    /* Avoid breaking important blocks across pages */
    .line-row {
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .no-break {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }
</style>
