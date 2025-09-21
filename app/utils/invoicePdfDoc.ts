import { currencyToLocale } from "~/utils/currencies"

export interface ServiceItem {
  description?: string
  rate?: number
  quantity?: number
  unit?: string
}

export interface InvoiceValues {
  brandName?: string
  invoiceNumber?: string
  freelancerName?: string
  freelancerRole?: string
  freelancerEmail?: string
  freelancerPhone?: string
  clientName?: string
  clientCompany?: string
  clientEmail?: string
  clientPhone?: string
  clientAddress?: string
  invoiceDate?: any
  invoiceDueDate?: any
  currency?: string
  discount?: number
  paymentMethod?: "bank" | "ewallet" | "paypal" | "wise"
  paymentBankName?: string
  paymentBankAccountNumber?: string
  paymentBankAccountHolder?: string
  paymentEwalletGopay?: string
  paymentEwalletOvo?: string
  paymentEwalletDana?: string
  paymentPaypalEmail?: string
  paymentWiseEmail?: string
  paymentTerms?: string
  notes?: string
  thankYou?: string
}

export const buildInvoiceDocDefinition = (
  values: InvoiceValues,
  lineItems: ServiceItem[],
  subtotal: number,
  total: number
) => {
  const v = values || {}
  const items = Array.isArray(lineItems) ? lineItems : []

  const currency = v.currency || 'USD'
  const locale = currencyToLocale[currency] || 'en-US'
  const nf = new Intl.NumberFormat(locale, { style: 'currency', currency })
  const fmt = (n: number) => nf.format(Number(n || 0))
  const fmtDate = (d: any) => {
    if (!d || typeof d !== 'object' || !('year' in d)) return ''
    const dt = new Date(d.year, d.month - 1, d.day)
    return dt.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })
  }
  const qtyHeader = (() => {
    const hasHours = (items || []).some((i: any) => String(i.unit || '').toLowerCase() === 'hours')
    return hasHours ? 'HOURS' : 'QTY'
  })()

  const paymentDetailBlock = (() => {
    switch (v.paymentMethod) {
      case 'bank':
        return [
          { text: 'Bank', style: 'muted' },
          { text: v.paymentBankName || '—' },
          { text: 'Account Name', style: 'muted', margin: [0, 4, 0, 0] },
          { text: v.paymentBankAccountHolder || '—' },
          { text: 'Account Number', style: 'muted', margin: [0, 4, 0, 0] },
          { text: v.paymentBankAccountNumber || '—' },
        ]
      case 'ewallet':
        return [
          { text: 'GoPay', style: 'muted' },
          { text: v.paymentEwalletGopay || '—' },
          { text: 'OVO', style: 'muted', margin: [0, 4, 0, 0] },
          { text: v.paymentEwalletOvo || '—' },
          { text: 'Dana', style: 'muted', margin: [0, 4, 0, 0] },
          { text: v.paymentEwalletDana || '—' },
        ]
      case 'paypal':
        return [{ text: 'PayPal', style: 'muted' }, { text: v.paymentPaypalEmail || '—' }]
      case 'wise':
        return [{ text: 'Wise', style: 'muted' }, { text: v.paymentWiseEmail || '—' }]
      default:
        return []
    }
  })()

  const totalsStack = [
    { columns: [{ text: 'Sub-Total', style: 'muted' }, { text: fmt(subtotal || 0), alignment: 'right', style: 'cell' }] },
    ...(v.discount
      ? [{ columns: [{ text: 'Discount', style: 'muted' }, { text: fmt(v.discount || 0), alignment: 'right', style: 'cell' }] }]
      : []),
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 260, y2: 0, lineWidth: 0.5, lineColor: '#cccccc' }], margin: [0, 6, 0, 6] },
    { columns: [{ text: 'TOTAL', style: 'totalLabel' }, { text: fmt(total || 0), alignment: 'right', style: 'totalValue' }] },
  ]

  const docDefinition: any = {
    pageSize: 'A4',
    pageMargins: [24, 32, 24, 40],
    defaultStyle: { fontSize: 10, lineHeight: 1.25 },
    styles: {
      headerBrand: { color: '#525252' },
      invoiceTitle: { fontSize: 24, bold: false, letterSpacing: 2, alignment: 'right' },
      invoiceMeta: { fontSize: 9, color: '#6b7280', alignment: 'right' },
      sectionTitle: { fontSize: 9, bold: true, letterSpacing: 1, color: '#374151' },
      muted: { color: '#6b7280' },
      tableHeader: { bold: true, fontSize: 9, color: '#374151' },
      cell: { fontSize: 10 },
      totalLabel: { bold: true, letterSpacing: 1 },
      totalValue: { bold: true, fontSize: 12 },
    },
    content: [
      {
        columns: [
          [{ text: v.brandName || '', style: 'headerBrand' }],
          [
            { text: 'INVOICE', style: 'invoiceTitle' },
            { text: v.invoiceNumber || '', style: 'invoiceMeta', margin: [0, 2, 0, 0] },
            { text: `Invoice Date: ${fmtDate(v.invoiceDate)}`, style: 'invoiceMeta', margin: [0, 6, 0, 0] },
            { text: `Due Date: ${fmtDate(v.invoiceDueDate)}`, style: 'invoiceMeta', margin: [0, 2, 0, 0] },
          ],
        ],
        columnGap: 10,
      },

      { text: ' ', margin: [0, 10, 0, 0] },

      {
        columns: [
          [
            { text: 'BILLED TO', style: 'sectionTitle' },
            { text: v.clientName || '', margin: [0, 6, 0, 0] },
            { text: v.clientCompany || '', style: v.clientCompany ? undefined : 'muted' },
            { text: v.clientAddress || '', style: v.clientAddress ? undefined : 'muted' },
            { text: v.clientEmail || '', style: v.clientEmail ? undefined : 'muted' },
            { text: v.clientPhone || '', style: v.clientPhone ? undefined : 'muted' },
          ],
          [
            { text: 'PAY TO', style: 'sectionTitle' },
            { text: v.freelancerName || '', margin: [0, 6, 0, 0] },
            { text: v.freelancerRole || '', style: v.freelancerRole ? undefined : 'muted' },
            { text: v.freelancerEmail || '', style: v.freelancerEmail ? undefined : 'muted' },
            { text: v.freelancerPhone || '', style: v.freelancerPhone ? undefined : 'muted' },
            ...(paymentDetailBlock.length ? [{ text: ' ', margin: [0, 4, 0, 0] }, ...paymentDetailBlock] : []),
          ],
        ],
        columnGap: 20,
      },

      { text: ' ', margin: [0, 14, 0, 0] },

      { text: 'ITEM', style: 'sectionTitle' },
      { text: ' ', margin: [0, 6, 0, 0] },
      ...(items.length
        ? [
          {
            table: {
              headerRows: 1,
              widths: ['*', 100, 40, 80],
              body: [
                [
                  { text: 'DESCRIPTION', style: 'tableHeader' },
                  { text: 'RATE', style: 'tableHeader' },
                  { text: qtyHeader, style: 'tableHeader', alignment: 'center' },
                  { text: 'AMOUNT', style: 'tableHeader', alignment: 'right' },
                ],
                ...items.map((it: any) => {
                  const rateStr = (() => {
                    const u = String(it.unit || '').toLowerCase()
                    const compact = u === 'hours' ? 'h' : u === 'project' ? 'prj' : u === 'qty' ? 'qty' : u
                    const suffix = compact ? `/${compact}` : ''
                    return `${fmt(it.rate || 0)}${suffix}`
                  })()
                  const amount = (Number(it.rate) || 0) * (Number(it.quantity) || 0)
                  return [
                    { text: it.description || '—', style: 'cell' },
                    { text: rateStr, style: 'cell' },
                    { text: String(it.quantity ?? ''), style: 'cell', alignment: 'center' },
                    { text: fmt(amount), style: 'cell', alignment: 'right' },
                  ]
                }),
              ],
            },
            layout: {
              fillColor: (rowIndex: number) => (rowIndex === 0 ? null : rowIndex % 2 === 0 ? '#fafafa' : null),
              hLineWidth: (i: number, node: any) => (i === 0 || i === 1 ? 1 : i === node.table.body.length ? 1 : 0.5),
              vLineWidth: () => 0,
              hLineColor: () => '#e5e7eb',
              paddingLeft: () => 6,
              paddingRight: () => 6,
              paddingTop: () => 6,
              paddingBottom: () => 6,
            },
          },
        ]
        : [{ text: 'Belum ada item layanan.', color: '#6b7280', margin: [0, 10, 0, 10] }]),

      {
        columns: [
          { width: '*', text: ' ' },
          { width: 260, stack: totalsStack },
        ],
        margin: [0, 12, 0, 0],
      },

      ...(v.paymentTerms || v.notes || v.thankYou
        ? [
          { text: ' ', margin: [0, 12, 0, 0] },
          { text: v.paymentTerms || '', margin: [0, 2, 0, 0] },
          { text: v.notes || '', margin: [0, 2, 0, 0] },
          { text: v.thankYou || '', margin: [0, 2, 0, 0] },
        ]
        : []),
    ],
  }

  return docDefinition
}
