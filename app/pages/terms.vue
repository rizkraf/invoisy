<template>
  <UiContainer class="py-10 lg:py-16">
    <h1 class="mb-6 text-3xl font-semibold tracking-tight">Syarat & Ketentuan</h1>
    <p class="mb-4 text-sm text-zinc-600">Terakhir diperbarui: {{ effectiveDate }}</p>

    <p class="mb-4">
      Dengan mengakses atau menggunakan Invoisy, Anda setuju untuk terikat oleh Syarat & Ketentuan
      ini. Jika Anda tidak menyetujui, mohon untuk tidak menggunakan aplikasi ini.
    </p>

    <h2 class="mt-8 mb-2 text-xl font-medium">Lingkup Layanan</h2>
    <p class="mb-4">
      Invoisy adalah aplikasi pembuatan faktur yang berjalan di sisi klien (client‑side). Aplikasi
      ini membantu Anda membuat, meninjau, dan mengunduh faktur dalam format PDF langsung dari
      perangkat Anda.
    </p>

    <h2 class="mt-8 mb-2 text-xl font-medium">Penggunaan yang Diizinkan</h2>
    <ul class="mb-4 list-disc pl-6">
      <li>Menggunakan aplikasi untuk membuat dan mengelola faktur usaha Anda.</li>
      <li>Menyimpan atau mengekspor faktur untuk keperluan bisnis yang sah.</li>
    </ul>
    <p class="mb-4">
      Anda setuju untuk tidak menyalahgunakan aplikasi, termasuk namun tidak terbatas pada: merusak
      keamanan, merekayasa balik, menyebar malware, atau menggunakan aplikasi untuk kegiatan ilegal.
    </p>

    <h2 class="mt-8 mb-2 text-xl font-medium">Perubahan dan Ketersediaan</h2>
    <p class="mb-4">
      Kami dapat memperbarui fitur atau Syarat & Ketentuan sewaktu‑waktu. Kami juga dapat
      menghentikan atau membatasi akses ke sebagian atau seluruh layanan tanpa pemberitahuan
      terlebih dahulu.
    </p>

    <h2 class="mt-8 mb-2 text-xl font-medium">Hak Kekayaan Intelektual</h2>
    <p class="mb-4">
      Seluruh hak atas merek, logo, antarmuka, dan kode sumber (kecuali konten yang Anda
      unggah/masukkan) merupakan milik pemilik aplikasi atau pemberi lisensinya. Anda tidak
      memperoleh hak kepemilikan atas komponen tersebut.
    </p>

    <h2 class="mt-8 mb-2 text-xl font-medium">Penafian</h2>
    <p class="mb-4">
      Aplikasi disediakan "sebagaimana adanya" tanpa jaminan apa pun, tersurat maupun tersirat. Kami
      tidak menjamin bahwa aplikasi bebas kesalahan, aman sepenuhnya, atau akan selalu tersedia.
    </p>

    <h2 class="mt-8 mb-2 text-xl font-medium">Batasan Tanggung Jawab</h2>
    <p class="mb-4">
      Sejauh diizinkan oleh hukum yang berlaku, kami tidak bertanggung jawab atas kehilangan
      keuntungan, data, atau kerugian tidak langsung lainnya yang timbul dari penggunaan atau
      ketidakmampuan menggunakan aplikasi.
    </p>

    <h2 class="mt-8 mb-2 text-xl font-medium">Pengakhiran</h2>
    <p class="mb-4">
      Kami dapat menangguhkan atau menghentikan akses Anda ke aplikasi jika Anda melanggar ketentuan
      ini atau terlibat dalam aktivitas yang membahayakan layanan atau pengguna lain.
    </p>

    <h2 class="mt-8 mb-2 text-xl font-medium">Privasi</h2>
    <p class="mb-4">
      Penggunaan Anda terhadap aplikasi juga diatur oleh
      <NuxtLink class="underline" to="/privacy">Kebijakan Privasi</NuxtLink>. Harap meninjau
      kebijakan tersebut untuk memahami bagaimana data Anda diproses.
    </p>

    <h2 class="mt-8 mb-2 text-xl font-medium">Kontak</h2>
    <p class="mb-1">Jika Anda memiliki pertanyaan terkait ketentuan ini, hubungi:</p>
    <ul class="mb-6 list-disc pl-6">
      <li>
        Email: <a class="underline" :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
      </li>
    </ul>

    <div class="mt-10 text-sm text-zinc-600 *:pt-6">
      <p>
        Dokumen ini adalah ringkasan informasi dan bukan nasihat hukum. Sesuaikan berdasarkan
        kebutuhan dan yurisdiksi Anda.
      </p>
    </div>
    mcla
  </UiContainer>
</template>

<script setup lang="ts">
  const effectiveDate = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const contactEmail = "support@invoisy.app"; // ganti bila diperlukan

  useHead({
    title: "Syarat & Ketentuan • Invoisy",
    meta: [
      {
        name: "description",
        content:
          "Syarat & Ketentuan penggunaan Invoisy—aplikasi pembuatan faktur yang berjalan di sisi klien.",
      },
    ],
  });
</script>

<style scoped>
  .prose h2 + p,
  h2 + p {
    margin-top: 0.25rem;
  }
</style>
