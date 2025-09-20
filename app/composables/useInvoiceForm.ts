import { CalendarDate } from "@internationalized/date";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

const isDateValue = (v: any) => v && typeof v === "object" && "year" in v && "month" in v && "day" in v;

export const invoiceSchema = z.object({
  brandName: z.string().optional(),
  invoiceNumber: z.string().min(1, "Nomor invoice harus diisi"),
  freelancerName: z.string().min(2, "Nama harus diisi"),
  freelancerRole: z.string().min(2, "Role/Profesi harus diisi"),
  freelancerEmail: z.string().optional(),
  freelancerPhone: z.string().optional(),
  clientName: z.string().min(2, "Nama klien harus diisi"),
  clientCompany: z.string().optional(),
  clientEmail: z.string().optional(),
  clientPhone: z.string().optional(),
  clientAddress: z.string().optional(),
  invoiceDate: z.any().refine(isDateValue, "Tanggal invoice tidak valid"),
  invoiceDueDate: z.any().refine(isDateValue, "Tanggal jatuh tempo tidak valid"),
  currency: z.string().min(1, "Mata uang harus dipilih"),
  paymentMethod: z.enum(["bank", "ewallet", "paypal", "wise"], {
    required_error: "Pilih metode pembayaran",
  }),
  paymentBankName: z.string().optional(),
  paymentBankAccountNumber: z.string().optional(),
  paymentBankAccountHolder: z.string().optional(),
  paymentEwalletGopay: z.string().optional(),
  paymentEwalletOvo: z.string().optional(),
  paymentEwalletDana: z.string().optional(),
  paymentPaypalEmail: z.string().email("Email PayPal tidak valid").optional(),
  paymentWiseEmail: z.string().email("Email Wise tidak valid").optional(),
  serviceItems: z.array(
    z.object({
      description: z.string().min(1, "Deskripsi harus diisi"),
      rate: z.coerce.number().min(0, "Rate tidak boleh negatif"),
      quantity: z.coerce.number().min(1, "Jumlah minimal 1"),
      unit: z.string().optional(), // e.g., "Hours" | "Qty" | "Project"
    })
  ).min(1, "Tambahkan minimal 1 item layanan"),
  discount: z.coerce.number().min(0, "Diskon tidak boleh negatif").optional(),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
  thankYou: z.string().optional(),
}).superRefine((data, ctx) => {
  if (!data.freelancerEmail && !data.freelancerPhone) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["freelancerEmail"], message: "Email atau telepon freelancer wajib diisi" });
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["freelancerPhone"], message: "Email atau telepon freelancer wajib diisi" });
  }

  if (!data.clientEmail && !data.clientPhone) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["clientEmail"], message: "Email atau telepon klien wajib diisi" });
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["clientPhone"], message: "Email atau telepon klien wajib diisi" });
  }

  const bankFields = [data.paymentBankName, data.paymentBankAccountNumber, data.paymentBankAccountHolder];
  const bankComplete = bankFields.every(v => typeof v === "string" && v.trim().length > 0);
  const ewalletAny = [data.paymentEwalletGopay, data.paymentEwalletOvo, data.paymentEwalletDana].some(v => (v ?? "").toString().trim().length > 0);

  switch (data.paymentMethod) {
    case "bank":
      if (!bankComplete) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["paymentBankName"],
          message: "Data bank harus lengkap (nama bank, no. rekening, nama pemilik)",
        });
      }
      break;
    case "ewallet":
      if (!ewalletAny) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["paymentEwalletGopay"],
          message: "Isi salah satu nomor e-wallet (GoPay/OVO/Dana)",
        });
      }
      break;
    case "paypal":
      if (!data.paymentPaypalEmail?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["paymentPaypalEmail"],
          message: "Email PayPal wajib diisi",
        });
      }
      break;
    case "wise":
      if (!data.paymentWiseEmail?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["paymentWiseEmail"],
          message: "Email Wise wajib diisi",
        });
      }
      break;
  }

  if (isDateValue(data.invoiceDate) && isDateValue(data.invoiceDueDate)) {
    const a = data.invoiceDate;
    const b = data.invoiceDueDate;
    const dueBeforeInvoice =
      b.year < a.year ||
      (b.year === a.year && (b.month < a.month || (b.month === a.month && b.day < a.day)));
    if (dueBeforeInvoice) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["invoiceDueDate"], message: "Tanggal jatuh tempo harus >= tanggal invoice" });
    }
  }
});

export type InvoiceSchema = z.infer<typeof invoiceSchema>;

export const useInvoiceForm = () => {
  const { handleSubmit, isSubmitting, resetForm, values, validate, validateField, setFieldValue, setFieldError } =
    useForm<InvoiceSchema>({
      name: "invoice-form",
      validationSchema: toTypedSchema(invoiceSchema),
      keepValuesOnUnmount: true,
      initialValues: {
        brandName: "",
        invoiceNumber: `#${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}`,
        freelancerName: "",
        freelancerRole: "",
        freelancerEmail: "",
        freelancerPhone: "",
        clientName: "",
        clientCompany: "",
        clientEmail: "",
        clientPhone: "",
        clientAddress: "",
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
        paymentMethod: "bank",
        paymentBankName: "",
        paymentBankAccountNumber: "",
        paymentBankAccountHolder: "",
        paymentEwalletGopay: "",
        paymentEwalletOvo: "",
        paymentEwalletDana: "",
        paymentPaypalEmail: "",
        paymentWiseEmail: "",
        serviceItems: [],
        discount: 0,
        paymentTerms: "",
        notes: "",
        thankYou: "",
      },
    });

  const currentStep = ref(1);
  const steps = [
    { step: 1, title: "Data Dasar", description: "Header, klien, freelancer, metode pembayaran." },
    { step: 2, title: "Item Layanan", description: "Tambahkan layanan atau produk yang Anda faktur." },
    { step: 3, title: "Pratinjau & Unduh", description: "Tinjau dan unduh invoice profesional Anda." },
  ];

  const onSubmit = handleSubmit(async (_) => {
    console.log("Form Submitted", values);
  });

  const nextStep = async () => {
    const baseFields = [
      "invoiceNumber",
      "freelancerName",
      "freelancerRole",
      "freelancerEmail",
      "freelancerPhone",
      "clientName",
      "clientEmail",
      "clientPhone",
      "invoiceDate",
      "invoiceDueDate",
      "currency",
      "paymentMethod",
    ];
    const results = await Promise.all(baseFields.map((f) => validateField(f as any)));
    let valid = results.every((r: { valid: boolean }) => r.valid);

    if (valid) {
      switch (values.paymentMethod) {
        case "bank": {
          const missing = [
            ["paymentBankName", values.paymentBankName],
            ["paymentBankAccountNumber", values.paymentBankAccountNumber],
            ["paymentBankAccountHolder", values.paymentBankAccountHolder],
          ].filter(([, v]) => !(v && String(v).trim().length));
          if (missing.length) {
            missing.forEach(([name]) =>
              setFieldError(name as any, "Data bank harus lengkap (nama bank, no. rekening, nama pemilik)")
            );
            valid = false;
          }
          break;
        }
        case "ewallet": {
          const hasAny = [values.paymentEwalletGopay, values.paymentEwalletOvo, values.paymentEwalletDana]
            .some((v) => v && String(v).trim().length);
          if (!hasAny) {
            setFieldError("paymentEwalletGopay" as any, "Isi salah satu nomor e-wallet (GoPay/OVO/Dana)");
            valid = false;
          }
          break;
        }
        case "paypal": {
          if (!values.paymentPaypalEmail?.trim()) {
            setFieldError("paymentPaypalEmail" as any, "Email PayPal wajib diisi");
            valid = false;
          }
          break;
        }
        case "wise": {
          if (!values.paymentWiseEmail?.trim()) {
            setFieldError("paymentWiseEmail" as any, "Email Wise wajib diisi");
            valid = false;
          }
          break;
        }
      }
    }

    if (valid) currentStep.value = Math.min(currentStep.value + 1, 4);
  };

  const prevStep = () => {
    currentStep.value = Math.max(currentStep.value - 1, 1);
  };

  const addServiceItem = () => {
    const next = [
      ...values.serviceItems,
      { description: "", rate: 0, quantity: 1, unit: "Qty" },
    ];
    setFieldValue("serviceItems", next);
  };

  const removeServiceItem = (index: number) => {
    const next = values.serviceItems.filter((_, i) => i !== index);
    setFieldValue("serviceItems", next);
  };

  const lineItems = computed(() =>
    (values.serviceItems || []).map((it) => ({
      ...it,
      amount: (Number(it.rate) || 0) * (Number(it.quantity) || 0),
    }))
  );
  const subtotal = computed(() => lineItems.value.reduce((acc, it) => acc + (it.amount || 0), 0));
  const total = computed(() => {
    const d = Number(values.discount || 0);
    return Math.max(0, subtotal.value - d);
  });

  return {
    // state
    currentStep,
    steps,
    values,
    isSubmitting,

    // derived
    lineItems,
    subtotal,
    total,

    // actions
    onSubmit,
    nextStep,
    prevStep,
    addServiceItem,
    removeServiceItem,

    // passthroughs
    resetForm,
    validate,
    validateField,
    setFieldValue,
    setFieldError,
  };
}
