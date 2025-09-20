import { buildInvoiceDocDefinition } from "~/utils/invoicePdfDoc"

export const useInvoicePdf = () => {
  // Client-side: build selectable-text PDFs using pdfMake (no print dialog)
  const download = async (payload: {
    values: any
    lineItems: any[]
    subtotal: number
    total: number
    fileName?: string
  }) => {
    if (typeof window === 'undefined') return

    const { $pdfMake } = useNuxtApp() as any
    if (!$pdfMake) {
      console.warn('pdfMake is not available. Ensure nuxt-pdfmake is installed and enabled.')
      return
    }

    const docDefinition = buildInvoiceDocDefinition(
      payload.values,
      payload.lineItems,
      payload.subtotal,
      payload.total
    )

    const file = (payload.fileName || 'invoice.pdf').replace(/\s+/g, '_')
    $pdfMake.createPdf(docDefinition).download(file)
  }

  // Open full-screen preview page with embedded PDF (no app chrome)
  const preview = (payload: {
    values: any
    lineItems: any[]
    subtotal: number
    total: number
  }) => {
    if (typeof window === 'undefined') return
    const json = JSON.stringify(payload)
    const b64 = btoa(unescape(encodeURIComponent(json)))
    const href = `/pdf?data=${encodeURIComponent(b64)}`
    window.open(href, '_blank', 'noopener')
  }

  return { download, preview }
}
