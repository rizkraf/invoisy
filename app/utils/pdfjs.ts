import * as pdfjsLib from 'pdfjs-dist'
// Use Vite's ?url to get a URL for the worker file
// @ts-ignore - bundler handles ?url
import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

export type RenderOptions = {
  scale?: number
  fitWidth?: number // if provided, scale will be computed to fit this width
}

export async function renderPdfTo(element: HTMLElement, data: Uint8Array | ArrayBuffer, opts: RenderOptions = {}) {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data)
  const loadingTask = pdfjsLib.getDocument({ data: bytes })
  const pdf = await loadingTask.promise

  for (let i = 1; i <= pdf.numPages; i++) {
    // eslint-disable-next-line no-await-in-loop
    const page = await pdf.getPage(i)
    const viewport1x = page.getViewport({ scale: 1 })
    let scale = opts.scale ?? 1.25
    if (opts.fitWidth && viewport1x.width > 0) {
      scale = opts.fitWidth / viewport1x.width
    }
    const viewport = page.getViewport({ scale })

    const canvas = document.createElement('canvas')
    canvas.width = Math.ceil(viewport.width)
    canvas.height = Math.ceil(viewport.height)
    canvas.style.display = 'block'
    canvas.style.width = `${Math.ceil(viewport.width)}px`
    canvas.style.height = `${Math.ceil(viewport.height)}px`
    canvas.style.background = '#ffffff' // ensure white page background

    const ctx = canvas.getContext('2d')!
    // Render with white background
    // @ts-ignore pdf.js render supports background param
    await page.render({ canvasContext: ctx, viewport, background: 'white' }).promise

    element.appendChild(canvas)
  }

  try { pdf.cleanup() } catch { /* noop */ }
}

export async function renderPdfInto(container: HTMLElement, data: Uint8Array | ArrayBuffer, opts: RenderOptions = {}) {
  // Clear container, then render into it
  while (container.firstChild) container.removeChild(container.firstChild)
  container.style.background = 'transparent'
  await renderPdfTo(container, data, opts)
}
