<template>
  <article class="policy-page">
    <header class="policy-hero">
      <span class="policy-kicker"><i class="fas fa-shield-alt"></i> Kebijakan Privasi</span>
      <h1>Privacy Policy SibukPatuh</h1>
      <p>
        Halaman ini menjelaskan bagaimana SibukPatuh mengelola data teknis, cookie, layanan pihak ketiga,
        dan informasi yang dikirim pengguna saat memakai alat edukatif di situs ini.
      </p>
      <small>Terakhir diperbarui: 13 Mei 2026</small>
    </header>

    <section class="policy-section">
      <h2>Ringkasan Penggunaan Data</h2>
      <p>
        SibukPatuh adalah situs edukasi dan referensi pembelajaran keamanan siber. Kami tidak menjual data
        pribadi pengguna. Data yang diproses dipakai untuk menjalankan fitur situs, memahami performa halaman,
        mencegah penyalahgunaan, dan menampilkan layanan pihak ketiga yang relevan.
      </p>
    </section>

    <section class="policy-section">
      <h2>Informasi yang Dapat Diproses</h2>
      <ul>
        <li>Data teknis seperti alamat IP, user agent, halaman yang dikunjungi, waktu akses, dan metrik performa.</li>
        <li>Data yang pengguna masukkan secara sukarela, misalnya alamat email pada fitur breach checker atau pertanyaan pada fitur AI analyst.</li>
        <li>Data penyimpanan lokal browser, misalnya preferensi tema tampilan.</li>
      </ul>
      <p>
        Jangan memasukkan password, token, API key, rahasia perusahaan, atau data pribadi sensitif ke fitur pencarian,
        simulator, maupun AI assistant.
      </p>
    </section>

    <section class="policy-section">
      <h2>Cookie, Analytics, dan Iklan</h2>
      <p>
        Situs ini dapat memakai layanan analitik, speed insights, dan Google AdSense. Layanan tersebut dapat
        menggunakan cookie, web beacon, alamat IP, atau identifier browser untuk mengukur performa, mencegah fraud,
        dan menayangkan iklan.
      </p>
      <p>
        Google dan pihak ketiga dapat menempatkan atau membaca cookie pada browser pengguna sebagai bagian dari
        penayangan iklan. Pengguna dapat mempelajari cara Google menggunakan data melalui
        <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
          How Google uses information from sites or apps that use our services
        </a>.
      </p>
    </section>

    <section class="policy-section">
      <h2>Layanan Pihak Ketiga</h2>
      <p>
        Beberapa fitur mengambil data dari sumber publik atau API pihak ketiga, seperti CISA KEV, MITRE, OTX AlienVault,
        Pulsedive, atau layanan AI. Saat fitur tersebut dipakai, permintaan dapat diteruskan ke layanan terkait agar
        hasil pencarian atau analisis dapat ditampilkan.
      </p>
    </section>

    <section class="policy-section">
      <h2>Kontrol Pengguna</h2>
      <ul>
        <li>Pengguna dapat menghapus cookie dan local storage melalui pengaturan browser.</li>
        <li>Pengguna dapat menonaktifkan personalisasi iklan melalui pengaturan akun Google atau browser.</li>
        <li>Pengguna dapat menghubungi pengelola situs untuk pertanyaan privasi atau permintaan koreksi informasi.</li>
      </ul>
    </section>

    <section class="policy-section">
      <h2>Kontak</h2>
      <p>
        Untuk pertanyaan tentang kebijakan privasi, hubungi pengelola melalui
        <a href="mailto:lintanggraha@gmail.com">lintanggraha@gmail.com</a>.
      </p>
    </section>
  </article>
</template>

<script>
export default {
  name: "PrivacyPolicy",
};
</script>

<style scoped>
.policy-page{display:grid;gap:1rem;color:#16324b}
.policy-hero{padding:1.5rem;border-radius:20px;background:#0f172a;color:#fff}
.policy-kicker{display:inline-flex;align-items:center;gap:.45rem;margin-bottom:.75rem;padding:.28rem .65rem;border-radius:999px;background:rgba(255,255,255,.08);font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.04em}
.policy-hero h1{margin:0 0 .55rem;font-size:clamp(1.5rem,4vw,2.15rem);font-weight:900}
.policy-hero p{max-width:760px;margin:0 0 .75rem;color:rgba(255,255,255,.78);line-height:1.65}
.policy-hero small{color:rgba(255,255,255,.58);font-weight:700}
.policy-section{padding:1.25rem 1.4rem;border:1px solid rgba(15,23,42,.08);border-radius:16px;background:#fff}
.policy-section h2{margin:0 0 .7rem;font-size:1.05rem;font-weight:900;color:#0f172a}
.policy-section p,.policy-section li{font-size:.95rem;line-height:1.75;color:#475569}
.policy-section p:last-child,.policy-section ul:last-child{margin-bottom:0}
.policy-section a{font-weight:800;color:#0f766e}
</style>
