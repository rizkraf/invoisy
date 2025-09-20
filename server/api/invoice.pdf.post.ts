import { defineEventHandler, readBody, setHeader, getRequestURL, createError } from 'h3'
import chromium from '@sparticuz/chromium'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import type { LaunchOptions } from 'puppeteer-core'
import puppeteerCore from 'puppeteer-core'

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

  // Helper: resolve a local Chrome/Chromium/Edge executable for non-serverless dev
  const resolveLocalChrome = (): string | undefined => {
    if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH
    if (process.env.CHROME_PATH) return process.env.CHROME_PATH

    const platform = os.platform()
    const candidates: string[] = []

    if (platform === 'win32') {
      const pf = process.env['PROGRAMFILES'] || 'C:/Program Files'
      const pfx86 = process.env['PROGRAMFILES(X86)'] || 'C:/Program Files (x86)'
      const localApp = process.env['LOCALAPPDATA'] || path.join(os.homedir(), 'AppData', 'Local')
      candidates.push(
        path.join(pf, 'Google', 'Chrome', 'Application', 'chrome.exe'),
        path.join(pfx86, 'Google', 'Chrome', 'Application', 'chrome.exe'),
        path.join(pf, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
        path.join(pfx86, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
        path.join(localApp, 'Chromium', 'Application', 'chrome.exe'),
      )
    } else if (platform === 'darwin') {
      candidates.push(
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
        '/Applications/Chromium.app/Contents/MacOS/Chromium',
      )
    } else {
      candidates.push(
        '/usr/bin/google-chrome-stable',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium',
        '/snap/bin/chromium',
      )
    }

    for (const p of candidates) {
      try { if (fs.existsSync(p)) return p } catch { }
    }
    return undefined
  }

  // Decide runtime: serverless (Vercel/AWS) vs local dev
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_REGION || process.env.AWS_LAMBDA_FUNCTION_NAME)

  let browser: Awaited<ReturnType<typeof puppeteerCore.launch>>

  if (isServerless) {
    // Serverless: use puppeteer-core with @sparticuz/chromium
    const executablePath = (await chromium.executablePath()) || process.env.PUPPETEER_EXECUTABLE_PATH
    if (!executablePath) {
      throw createError({ statusCode: 500, statusMessage: 'Chromium executable not found in serverless environment' })
    }
    browser = await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: { width: 794, height: 1123 },
      executablePath,
      headless: chromium.headless,
    })
  } else {
    // Local dev: prefer full puppeteer (bundled Chromium). Fallback to core + local Chrome path.
    let puppeteerLocal: any = null
    try {
      // Dynamic import via non-literal to avoid TS resolution when not installed
      const pkg = 'puppeteer'
      const mod = await import(pkg as any)
      puppeteerLocal = (mod as any).default || (mod as any)
    } catch {
      puppeteerLocal = null
    }

    if (puppeteerLocal) {
      browser = await puppeteerLocal.launch({
        headless: true,
        defaultViewport: { width: 794, height: 1123 },
      } as LaunchOptions)
    } else {
      const localExec = resolveLocalChrome()
      if (!localExec) {
        throw createError({
          statusCode: 500,
          statusMessage:
            'Tidak dapat menemukan Chrome/Chromium lokal. Instal paket "puppeteer" atau set env PUPPETEER_EXECUTABLE_PATH/CHROME_PATH ke lokasi Chrome.',
        })
      }
      browser = await puppeteerCore.launch({
        headless: true,
        executablePath: localExec,
        defaultViewport: { width: 794, height: 1123 },
      })
    }
  }

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
