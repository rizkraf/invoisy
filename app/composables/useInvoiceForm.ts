import { CalendarDate } from "@internationalized/date";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

const isDateValue = (v: any) => v && typeof v === "object" && "year" in v && "month" in v && "day" in v;

export const invoiceSchema = z.object({
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
      price: z.number().min(1, "Harga harus diisi"),
      quantity: z.string().min(1, "Kuantitas harus diisi"),
      tax: z.string().optional(),
    })
  ),
});

export type InvoiceSchema = z.infer<typeof invoiceSchema>;

export const useInvoiceForm = () => {
  const { handleSubmit, isSubmitting, resetForm, values, validate, validateField, setFieldValue } =
    useForm<InvoiceSchema>({
      name: "invoice-form",
      validationSchema: toTypedSchema(invoiceSchema),
      keepValuesOnUnmount: true,
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
  const steps = [
    { step: 1, title: "Data Dasar", description: "Masukkan informasi bisnis dan klien Anda." },
    { step: 2, title: "Item Layanan", description: "Tambahkan layanan atau produk yang Anda faktur." },
    { step: 3, title: "Pratinjau & Unduh", description: "Tinjau dan unduh invoice profesional Anda." },
  ];

  const onSubmit = handleSubmit(async (_) => {
    console.log("Form Submitted", values);
  });

  const nextStep = async () => {
    const fieldsStep1 = [
      "freelancerName",
      "freelancerContact",
      "clientName",
      "clientContact",
      "invoiceDate",
      "invoiceDueDate",
      "currency",
    ];
    const results = await Promise.all(fieldsStep1.map((f) => validateField(f as any)));
    const valid = results.every((r: { valid: boolean }) => r.valid);
    if (valid) currentStep.value = Math.min(currentStep.value + 1, 2);
  };

  const prevStep = () => {
    currentStep.value = Math.max(currentStep.value - 1, 1);
  };

  const addServiceItem = () => {
    const next = [
      ...values.serviceItems,
      { title: "", description: "", price: 0, quantity: "1", tax: "" },
    ];
    setFieldValue("serviceItems", next);
  };

  const removeServiceItem = (index: number) => {
    const next = values.serviceItems.filter((_, i) => i !== index);
    setFieldValue("serviceItems", next);
  };

  return {
    // state
    currentStep,
    steps,
    values,
    isSubmitting,

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
  };
}
