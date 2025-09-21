# Invoisy — Pembuat Faktur Client‑side (Nuxt)

Invoisy adalah aplikasi web sederhana untuk membuat faktur (invoice) secara cepat di browser. PDF dihasilkan dengan teks dapat dipilih (selectable) menggunakan pdfMake, dan preview ditampilkan tanpa toolbar menggunakan pdf.js untuk pengalaman yang bersih dan konsisten.

## Fitur

- Pembuatan faktur langsung di browser (client‑side), tanpa pop‑up print
- PDF teks dapat dipilih (pdfMake)
- Preview PDF tanpa toolbar dengan latar putih (pdf.js)
- Templat item dalam bentuk tabel dengan subtotal, diskon, dan total
- Form validasi dengan Vee‑Validate + Zod
- Tampilan modern dengan Tailwind CSS dan komponen UI kustom
- Halaman Kebijakan Privasi dan Syarat & Ketentuan

### Fokus Privasi

- Data diproses sepenuhnya di perangkat Anda (client‑side), tidak dikirim ke server.
- Tidak ada dialog print paksa, unduhan terjadi langsung sebagai berkas PDF.
- Tidak ada analitik, pelacak, atau iklan secara default.
- Penyimpanan lokal (bila digunakan) terbatas untuk preferensi dan dapat dihapus kapan saja.
- Kode sumber dapat ditinjau untuk memastikan alur data transparan.

## Teknologi Utama

- Nuxt 4 + Vite
- Tailwind CSS
- pdfMake (melalui `nuxt-pdfmake`)
- pdf.js (`pdfjs-dist`) untuk kanvas pratinjau
- Vee‑Validate + Zod
- Reka UI + UI Thing (`app/components/Ui`)

## Arsitektur Singkat

- Pembuatan PDF: `app/utils/invoicePdfDoc.ts` membangun docDefinition pdfMake dari nilai form dan item.
- Unduh vs Pratinjau: `app/composables/useInvoicePdf.ts` menyediakan `download()` dan `preview()`.
- Pratinjau tertanam: `app/components/Invoice/Preview.vue` membuat Blob PDF dan merender via `PdfCanvasViewer`.
- Renderer pdf.js: `app/components/Invoice/PdfCanvasViewer.vue` + `app/utils/pdfjs.ts` menggambar PDF ke kanvas, dengan double‑buffer untuk mengurangi kedipan.

## Struktur Folder Ringkas

```
app/
	components/
		Invoice/
			Preview.vue          # Pratinjau PDF dalam halaman
			...
		Ui/
			Container.vue        # Kontainer layout
			...
	pages/
		index.vue              # Landing
		generate.vue           # Wizard pembuatan invoice
		privacy.vue            # Kebijakan Privasi
		terms.vue              # Syarat & Ketentuan
	composables/
		useInvoiceForm.ts      # Skema + logika form
		useInvoicePdf.ts       # Unduh/pratinjau PDF
	utils/
		invoicePdfDoc.ts       # Builder docDefinition pdfMake
		pdfjs.ts               # Utilitas pdf.js (rendering)
```

## Persiapan

Instal dependensi:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Menjalankan Secara Lokal

Jalankan server dev di `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Build Production

Build aplikasi untuk production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Preview build production di lokal:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## Cara Pakai Singkat

1. Buka halaman Generate (`/generate`).
2. Isi data dasar, item layanan/produk, dan opsi tambahan (diskon, catatan).
3. Lihat pratinjau PDF langsung di panel kanan.
4. Klik Download untuk mengunduh PDF (tanpa membuka dialog print).

## Kustomisasi PDF

- Ubah label/bahasa, kolom tabel, atau gaya di `app/utils/invoicePdfDoc.ts`.
- Penyesuaian pratinjau/kanvas di `app/components/Invoice/PdfCanvasViewer.vue` atau `app/utils/pdfjs.ts`.

### Catatan Keamanan/Privasi

- Karena pemrosesan dilakukan lokal, pastikan peramban dan perangkat Anda aman serta terbaru.
- Jika Anda menambahkan integrasi pihak ketiga (font/ikon/analitik), tinjau kebijakan privasi layanan terkait.
- Jangan menyimpan informasi sensitif melebihi kebutuhan bisnis Anda.

## Rute Penting

- `/` — Landing
- `/generate` — Wizard pembuatan faktur
- `/privacy` — Kebijakan Privasi
- `/terms` — Syarat & Ketentuan

## Troubleshooting

- Preview berkedip saat mengetik: sudah diminimalkan dengan debounce dan double‑buffer. Jika masih terasa, tingkatkan debounce di `Preview.vue`.
- Toolbar PDF muncul di beberapa peramban: pratinjau kami memakai pdf.js kanvas tanpa toolbar; penggunaan iframe viewer tidak disarankan.
- Font tidak muncul konsisten: pastikan font default sistem tersedia atau atur font embed di pdfMake (opsional).

## Lisensi

Proyek ini disediakan apa adanya. Tambahkan lisensi sesuai kebutuhan proyek Anda.
