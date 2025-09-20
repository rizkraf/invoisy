import { defineEventHandler, readBody, setHeader, getRequestURL } from 'h3'
import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'

type Body = {
  values: any
  lineItems: any[]
  subtotal: number
  total: number
  fileName?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<Body>(event)
  if (!body) {
    throw createError({ statusCode: 400, statusMessage: 'Missing body' })
  }

  // Build absolute URL to print page with embedded payload
  const reqUrl = getRequestURL(event)
  const origin = `${reqUrl.protocol}//${reqUrl.host}`
  const encoded = encodeURIComponent(Buffer.from(JSON.stringify(body)).toString('base64'))
  const url = `${origin}/print?data=${encoded}`

  // Configure Chromium for serverless
  const executablePath = (await chromium.executablePath()) || process.env.PUPPETEER_EXECUTABLE_PATH

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: { width: 794, height: 1123 },
    executablePath: executablePath!,
    headless: chromium.headless,
  })

  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'networkidle0' })
  await page.emulateMediaType('print')

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
  })

  await browser.close()

  const fileName = body.fileName || 'invoice.pdf'
  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Disposition', `attachment; filename="${fileName}"`)
  return pdf
})
