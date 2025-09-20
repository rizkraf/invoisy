export const useInvoicePdf = () => {
  const download = async (payload: {
    values: any
    lineItems: any[]
    subtotal: number
    total: number
    fileName?: string
  }) => {
    const res = await fetch('/api/invoice.pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Failed to generate PDF')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = payload.fileName || 'invoice.pdf'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return { download }
}
