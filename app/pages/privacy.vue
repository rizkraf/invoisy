<template>
  <UiContainer class="py-10 text-zinc-800 lg:py-16">
    <h1 class="mb-6 text-3xl font-semibold tracking-tight">Kebijakan Privasi</h1>
    <p class="mb-4 text-sm text-zinc-600">Terakhir diperbarui: {{ effectiveDate }}</p>

    <p class="mb-4">
      Aplikasi Invoisy adalah alat pembuatan faktur yang berjalan di sisi klien (client‑side). Kami
      menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi yang Anda masukkan ke
      dalam aplikasi ini.
    </p>

    <h2 class="mt-8 mb-2 text-xl font-medium">Ruang Lingkup</h2>
    <p class="mb-4">
      Kebijakan ini menjelaskan bagaimana data diproses saat Anda menggunakan aplikasi, termasuk
      data yang Anda masukkan ke dalam formulir faktur (misalnya nama, alamat, email, detail
      pembayaran, serta item layanan).
    </p>

    <h2 class="mt-8 mb-2 text-xl font-medium">Data yang Kami Proses</h2>
    <ul class="mb-4 list-disc pl-6">
      <li>Data identitas dan kontak (mis. nama, email, nomor telepon).</li>
      <li>Data klien (mis. nama perusahaan, alamat, email, nomor telepon).</li>
      <li>Rincian faktur (nomor faktur, tanggal, jatuh tempo, mata uang, item layanan, diskon).</li>
      <li>Preferensi dan pengaturan tampilan faktur.</li>
    </ul>

    <h2 class="mt-8 mb-2 text-xl font-medium">Cara Kami Memproses Data</h2>
    <p class="mb-4">
      Pemrosesan dilakukan sepenuhnya di perangkat Anda. Data yang Anda masukkan digunakan untuk
      menghasilkan pratinjau dan berkas PDF faktur secara lokal. Secara default, data tidak
      dikirimkan ke server kami.
    </p>

    <h2 class="mt-8 mb-2 text-xl font-medium">Penyimpanan Data</h2>
    <p class="mb-4">
      Aplikasi dapat menyimpan sebagian pengaturan secara lokal di peramban (localStorage atau
      mekanisme serupa) untuk kenyamanan Anda. Anda dapat menghapusnya kapan saja melalui pengaturan
      peramban atau fitur reset di aplikasi (jika tersedia).
    </p>

    <h2 class="mt-8 mb-2 text-xl font-medium">Berbagi Data dengan Pihak Ketiga</h2>
    <p class="mb-4">
      Kami tidak menjual atau memperdagangkan data pribadi Anda. Jika Anda memilih menggunakan
      integrasi pihak ketiga (misalnya, layanan font, ikon, atau analitik), layanan tersebut mungkin
      menerima data teknis seperti alamat IP atau identitas peramban sesuai kebijakan masing‑masing.
    </p>

    <h2 class="mt-8 mb-2 text-xl font-medium">Keamanan</h2>
    <p class="mb-4">
      Kami merancang aplikasi untuk memproses data secara lokal. Namun, keamanan data juga
      bergantung pada perangkat dan peramban Anda. Pastikan sistem Anda terlindungi dan gunakan kata
      sandi yang kuat bila diperlukan.
    </p>

    <h2 class="mt-8 mb-2 text-xl font-medium">Hak Anda</h2>
    <ul class="mb-4 list-disc pl-6">
      <li>
        Hak untuk mengakses, memperbarui, atau menghapus data yang tersimpan di perangkat Anda.
      </li>
      <li>Hak untuk membatasi atau menonaktifkan penyimpanan lokal melalui pengaturan peramban.</li>
      <li>Hak untuk menarik persetujuan atas integrasi pihak ketiga yang bersifat opsional.</li>
    </ul>

    <h2 class="mt-8 mb-2 text-xl font-medium">Anak di Bawah Umur</h2>
    <p class="mb-4">
      Aplikasi ini tidak ditujukan untuk anak di bawah 13 tahun. Jika Anda adalah orang tua atau
      wali dan mengetahui bahwa anak Anda memberikan data pribadi, silakan hubungi kami untuk
      tindakan yang sesuai.
    </p>

    <h2 class="mt-8 mb-2 text-xl font-medium">Perubahan Kebijakan</h2>
    <p class="mb-4">
      Kebijakan ini dapat diperbarui dari waktu ke waktu. Tanggal "Terakhir diperbarui" akan
      disesuaikan pada bagian atas halaman ini saat perubahan dilakukan.
    </p>

    <h2 class="mt-8 mb-2 text-xl font-medium">Kontak</h2>
    <p class="mb-1">Untuk pertanyaan terkait privasi, Anda dapat menghubungi:</p>
    <ul class="mb-6 list-disc pl-6">
      <li>
        Email: <a class="underline" :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
      </li>
    </ul>

    <div class="mt-10 text-sm text-zinc-600 *:pt-6">
      <p>
        Dokumen ini dimaksudkan sebagai informasi umum dan bukan nasihat hukum. Sesuaikan dengan
        kebutuhan dan peraturan setempat Anda.
      </p>
    </div>
  </UiContainer>
</template>

<script setup lang="ts">
  const route = useRoute();
  const { origin } = useRequestURL();
  const ogTitle = "Kebijakan Privasi - Invoisy";
  const ogDescription =
    "Kebijakan Privasi Invoisy: cara kami memproses dan melindungi data Anda saat membuat faktur secara lokal di perangkat.";
  const ogImage = `${origin}/website-preview.png`;
  const pageUrl = `${origin}${route.fullPath}`;
  const effectiveDate = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const contactEmail = "support@invoisy.app"; // ganti bila diperlukan

  useHead({
    title: ogTitle,
    meta: [
      { name: "description", content: ogDescription },
      { property: "og:title", content: ogTitle },
      { property: "og:description", content: ogDescription },
      { property: "og:type", content: "website" },
      { property: "og:image", content: ogImage },
      { property: "og:url", content: pageUrl },
      { property: "og:site_name", content: "Invoisy" },
      { property: "og:locale", content: "id_ID" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: ogTitle },
      { name: "twitter:description", content: ogDescription },
      { name: "twitter:image", content: ogImage },
    ],
  });
</script>

<style scoped>
  .prose h2 + p,
  h2 + p {
    margin-top: 0.25rem;
  }
</style>
