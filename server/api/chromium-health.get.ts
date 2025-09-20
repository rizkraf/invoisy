import { defineEventHandler } from 'h3'
import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'

export default defineEventHandler(async () => {
  try {
    const executablePath = await chromium.executablePath()
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: chromium.headless,
      defaultViewport: { width: 800, height: 600 },
    })
    const version = await browser.version()
    await browser.close()
    return { ok: true, version, executablePath }
  } catch (e: any) {
    return { ok: false, error: String(e?.message || e) }
  }
})
