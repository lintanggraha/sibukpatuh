/**
 * SibukPatuh Prerender Script
 *
 * Generates static HTML for each route so Google AdSense and search crawlers
 * can read real content without executing JavaScript.
 *
 * This runs in Node.js at build time — NO window/DOM APIs allowed here.
 */

// Static rich content per route — injected into prerendered HTML
const ROUTE_CONTENT = {
  '/': {
    title: 'SibukPatuh - Referensi Edukatif Kepatuhan Siber dan Tata Kelola TI',
    description: 'Platform referensi edukatif berbahasa Indonesia untuk ISO 27001, NIST CSF, COBIT 2019, SEOJK, POJK, PBI, UU PDP, dan OWASP.',
    h1: 'Ruang Belajar Framework & Regulasi Siber',
    body: `
      <main>
        <h1>Ruang Belajar Framework &amp; Regulasi Siber</h1>
        <p>SibukPatuh adalah platform referensi edukatif berbahasa Indonesia yang dirancang untuk membantu praktisi IT, auditor, compliance officer, dan pelajar dalam memahami berbagai framework keamanan siber dan regulasi teknologi informasi.</p>
        <p>Platform ini menyajikan ringkasan terstruktur dari standar internasional seperti ISO 27001:2022, NIST Cybersecurity Framework 2.0, COBIT 2019, serta regulasi nasional Indonesia seperti SEOJK 29/2022, POJK 11/2022, PBI 02/2024, PADG 32/2025, PADK 1/2026, dan UU PDP No. 27/2022.</p>
        <p>Tersedia pula alat interaktif seperti Gap Analysis, Compliance Simulator, Cross-Mapping Framework, dan Intelligence Center untuk mendukung pemahaman praktis kepatuhan siber.</p>
        <h2>Framework Internasional</h2>
        <ul>
          <li><a href="/frameworks/iso27001">ISO 27001:2022 — 93 kontrol keamanan informasi</a></li>
          <li><a href="/frameworks/iso37001">ISO 37001:2016 — Sistem manajemen anti-penyuapan</a></li>
          <li><a href="/frameworks/nist-csf-2">NIST CSF 2.0 — 106 subkategori keamanan siber</a></li>
          <li><a href="/frameworks/cobit-2019">COBIT 2019 — 40 tujuan tata kelola TI</a></li>
          <li><a href="/frameworks/owasp-top-10">OWASP Top 10 — Kerentanan aplikasi web</a></li>
          <li><a href="/frameworks/owasp-asvs">OWASP ASVS — Standar verifikasi keamanan aplikasi</a></li>
        </ul>
        <h2>Regulasi Nasional Indonesia</h2>
        <ul>
          <li><a href="/frameworks/seojk">SEOJK 29/2022 — Ketahanan siber perbankan OJK</a></li>
          <li><a href="/frameworks/pojk-11-2022">POJK 11/2022 — Penyelenggaraan TI Bank Umum</a></li>
          <li><a href="/frameworks/pbi-02-2024">PBI 02/2024 — Keamanan siber Bank Indonesia</a></li>
          <li><a href="/frameworks/padk-1-2026">PADK 1/2026 — Penyelenggaraan TI bank umum</a></li>
          <li><a href="/frameworks/padg-32-2025">PADG 32/2025 — Sistem pembayaran Bank Indonesia</a></li>
          <li><a href="/frameworks/panduan-resiliensi-ojk">Panduan Resiliensi Digital OJK</a></li>
          <li><a href="/frameworks/uu-pdp-27-2022">UU PDP 27/2022 — Perlindungan data pribadi</a></li>
        </ul>
        <h2>Alat Interaktif</h2>
        <ul>
          <li><a href="/checklist-tools">Checklist Tools — Gap Analysis kepatuhan siber</a></li>
          <li><a href="/compliance-simulator">Compliance Simulator — What-if analysis kepatuhan</a></li>
          <li><a href="/cross-mapping">Cross-Mapping — Pemetaan keterkaitan regulasi</a></li>
          <li><a href="/framework-analysis">Framework Analysis — Perbandingan side-by-side</a></li>
          <li><a href="/intel/intelligence-center">Intelligence Center — Intelijen ancaman siber</a></li>
        </ul>
      </main>
    `,
  },
  '/about': {
    title: 'Tentang SibukPatuh - Platform Edukasi Kepatuhan Siber Indonesia',
    description: 'Pelajari lebih lanjut tentang SibukPatuh, platform edukasi kepatuhan siber dan tata kelola TI berbahasa Indonesia.',
    h1: 'Tentang SibukPatuh',
    body: `
      <main>
        <h1>Tentang SibukPatuh</h1>
        <p>SibukPatuh adalah platform referensi edukatif berbahasa Indonesia yang menyediakan ringkasan terstruktur tentang framework keamanan siber dan regulasi teknologi informasi.</p>
        <p>Platform ini didirikan oleh Lintang, seorang profesional di bidang Risk Management dan IT Governance yang berpengalaman di industri perbankan dan keuangan Indonesia.</p>
        <p>Tujuan platform ini adalah menyediakan referensi edukatif yang mudah dipahami tentang framework keamanan siber dan regulasi TI, khususnya untuk praktisi Indonesia yang membutuhkan pemahaman cepat dan terstruktur.</p>
        <h2>Disclaimer Penting</h2>
        <p>Seluruh konten di SibukPatuh disusun sebagai ringkasan edukatif dan interpretasi, bukan pengganti dokumen standar resmi dari ISO, BSN, atau ISACA. Harap merujuk pada dokumen standar resmi yang berlaku untuk keperluan formal.</p>
        <h2>Kontak</h2>
        <p>Email: lintanggraha@gmail.com | LinkedIn: linkedin.com/in/lintanggraha</p>
      </main>
    `,
  },
  '/privacy-policy': {
    title: 'Kebijakan Privasi - SibukPatuh',
    description: 'Kebijakan privasi SibukPatuh menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pengguna.',
    h1: 'Kebijakan Privasi',
    body: `
      <main>
        <h1>Kebijakan Privasi SibukPatuh</h1>
        <p>SibukPatuh berkomitmen untuk melindungi privasi pengguna. Halaman ini menjelaskan kebijakan kami terkait pengumpulan dan penggunaan data.</p>
        <h2>Data yang Dikumpulkan</h2>
        <p>Kami menggunakan Google Analytics untuk memahami bagaimana pengguna berinteraksi dengan platform ini. Data yang dikumpulkan bersifat anonim dan digunakan semata-mata untuk meningkatkan kualitas layanan.</p>
        <h2>Iklan</h2>
        <p>SibukPatuh menggunakan Google AdSense untuk menampilkan iklan yang relevan. Google dapat menggunakan cookie untuk menampilkan iklan berdasarkan kunjungan Anda ke situs ini dan situs lain.</p>
        <h2>Perlindungan Data</h2>
        <p>SibukPatuh tidak menjual, menyewakan, atau membagikan data pribadi pengguna kepada pihak ketiga tanpa persetujuan eksplisit. Kami mematuhi UU PDP No. 27/2022 tentang Pelindungan Data Pribadi.</p>
        <h2>Kontak</h2>
        <p>Untuk pertanyaan terkait privasi, hubungi kami di lintanggraha@gmail.com.</p>
      </main>
    `,
  },
  '/contact': {
    title: 'Kontak - SibukPatuh',
    description: 'Hubungi tim SibukPatuh untuk pertanyaan, saran, atau kolaborasi seputar kepatuhan siber dan tata kelola TI.',
    h1: 'Hubungi Kami',
    body: `
      <main>
        <h1>Hubungi SibukPatuh</h1>
        <p>Kami terbuka untuk pertanyaan, masukan, dan kolaborasi seputar kepatuhan siber, tata kelola TI, dan pengembangan platform SibukPatuh.</p>
        <h2>Cara Menghubungi</h2>
        <p>Email: lintanggraha@gmail.com</p>
        <p>LinkedIn: <a href="https://www.linkedin.com/in/lintanggraha/">linkedin.com/in/lintanggraha</a></p>
        <p>GitHub: <a href="https://github.com/lintanggraha/sibukpatuh">github.com/lintanggraha/sibukpatuh</a></p>
      </main>
    `,
  },
  '/frameworks/iso27001': {
    title: 'ISO 27001:2022 - Ringkasan Edukatif Sistem Manajemen Keamanan Informasi | SibukPatuh',
    description: 'Pelajari ISO 27001:2022 secara terstruktur: 93 kontrol Annex A, 4 klausul utama, dan panduan implementasi SMKI untuk organisasi Indonesia.',
    h1: 'ISO 27001:2022 — Sistem Manajemen Keamanan Informasi',
    body: `
      <main>
        <h1>ISO 27001:2022 — Sistem Manajemen Keamanan Informasi (SMKI)</h1>
        <p>ISO 27001:2022 adalah standar internasional untuk Sistem Manajemen Keamanan Informasi (SMKI) yang diterbitkan oleh International Organization for Standardization (ISO). Versi terbaru ini menggantikan ISO 27001:2013 dengan pembaruan signifikan pada Annex A yang kini memuat 93 kontrol keamanan.</p>
        <p>Standar ini memberikan kerangka kerja sistematis untuk mengelola risiko keamanan informasi, mencakup aspek kerahasiaan (confidentiality), integritas (integrity), dan ketersediaan (availability) informasi.</p>
        <h2>Struktur ISO 27001:2022</h2>
        <p>ISO 27001:2022 terdiri dari 11 klausul utama (Klausul 4–10) dan Annex A yang berisi 93 kontrol yang dikelompokkan dalam 4 tema:</p>
        <ul>
          <li>Organizational Controls — 37 kontrol tata kelola dan kebijakan</li>
          <li>People Controls — 8 kontrol sumber daya manusia</li>
          <li>Physical Controls — 14 kontrol keamanan fisik</li>
          <li>Technological Controls — 34 kontrol teknologi</li>
        </ul>
        <h2>Relevansi di Indonesia</h2>
        <p>Di Indonesia, standar ini diadopsi sebagai SNI ISO/IEC 27001:2022 oleh Badan Standardisasi Nasional (BSN) dan menjadi referensi utama dalam regulasi OJK (SEOJK 29/2022) dan Bank Indonesia (PBI 02/2024) terkait keamanan siber perbankan.</p>
      </main>
    `,
  },
  '/frameworks/iso37001': {
    title: 'ISO 37001:2016 - Sistem Manajemen Anti-Penyuapan | SibukPatuh',
    description: 'Ringkasan edukatif ISO 37001:2016: sistem manajemen anti-penyuapan, due diligence, kontrol operasional, dan audit kepatuhan.',
    h1: 'ISO 37001:2016 — Sistem Manajemen Anti-Penyuapan',
    body: `
      <main>
        <h1>ISO 37001:2016 — Sistem Manajemen Anti-Penyuapan (ABMS)</h1>
        <p>ISO 37001:2016 adalah standar internasional untuk Sistem Manajemen Anti-Penyuapan (Anti-Bribery Management System/ABMS) yang membantu organisasi mencegah, mendeteksi, dan merespons penyuapan.</p>
        <p>Standar ini mencakup due diligence terhadap mitra bisnis, kontrol keuangan dan non-keuangan, pelatihan anti-penyuapan, pelaporan insiden, dan audit internal secara berkala.</p>
        <h2>Relevansi di Indonesia</h2>
        <p>ISO 37001 relevan bagi perusahaan yang beroperasi di Indonesia mengingat regulasi anti-korupsi yang ketat dari KPK dan peraturan terkait Good Corporate Governance (GCG).</p>
      </main>
    `,
  },
  '/frameworks/nist-csf-2': {
    title: 'NIST CSF 2.0 - Cybersecurity Framework | SibukPatuh',
    description: 'Panduan NIST Cybersecurity Framework 2.0: 6 fungsi (Govern, Identify, Protect, Detect, Respond, Recover) dan 106 subkategori keamanan siber.',
    h1: 'NIST Cybersecurity Framework 2.0',
    body: `
      <main>
        <h1>NIST Cybersecurity Framework 2.0 (NIST CSF 2.0)</h1>
        <p>NIST Cybersecurity Framework (CSF) 2.0 adalah kerangka kerja keamanan siber yang dikembangkan oleh National Institute of Standards and Technology (NIST) Amerika Serikat. Versi 2.0 yang dirilis pada Februari 2024 menambahkan fungsi keenam yaitu "Govern" untuk memperkuat tata kelola keamanan siber.</p>
        <h2>6 Fungsi Utama NIST CSF 2.0</h2>
        <ul>
          <li><strong>Govern (GV)</strong> — Tata kelola dan kebijakan keamanan siber organisasi</li>
          <li><strong>Identify (ID)</strong> — Identifikasi aset, risiko, dan konteks bisnis</li>
          <li><strong>Protect (PR)</strong> — Perlindungan aset dan infrastruktur kritis</li>
          <li><strong>Detect (DE)</strong> — Deteksi insiden dan anomali keamanan</li>
          <li><strong>Respond (RS)</strong> — Respons terhadap insiden keamanan siber</li>
          <li><strong>Recover (RC)</strong> — Pemulihan sistem pasca insiden</li>
        </ul>
        <p>NIST CSF 2.0 banyak digunakan sebagai referensi oleh regulator Indonesia, termasuk OJK dalam penyusunan SEOJK 29/2022 tentang Ketahanan dan Keamanan Siber.</p>
      </main>
    `,
  },
  '/frameworks/cobit-2019': {
    title: 'COBIT 2019 - Framework Tata Kelola TI | SibukPatuh',
    description: 'Ringkasan COBIT 2019: 40 tujuan tata kelola, 5 domain (EDM, APO, BAI, DSS, MEA), dan penerapan IT Governance di organisasi Indonesia.',
    h1: 'COBIT 2019 — Framework Tata Kelola dan Manajemen TI',
    body: `
      <main>
        <h1>COBIT 2019 — Framework Tata Kelola dan Manajemen TI</h1>
        <p>COBIT 2019 (Control Objectives for Information and Related Technologies) adalah framework tata kelola dan manajemen TI yang dikembangkan oleh ISACA. Framework ini membantu organisasi mencapai tujuan bisnis melalui pengelolaan TI yang efektif dan efisien.</p>
        <h2>5 Domain COBIT 2019</h2>
        <ul>
          <li><strong>EDM</strong> (Evaluate, Direct, Monitor) — 6 tujuan tata kelola</li>
          <li><strong>APO</strong> (Align, Plan, Organize) — 14 tujuan perencanaan</li>
          <li><strong>BAI</strong> (Build, Acquire, Implement) — 10 tujuan implementasi</li>
          <li><strong>DSS</strong> (Deliver, Service, Support) — 6 tujuan layanan</li>
          <li><strong>MEA</strong> (Monitor, Evaluate, Assess) — 4 tujuan monitoring</li>
        </ul>
        <p>Di Indonesia, COBIT 2019 digunakan sebagai referensi dalam audit TI perbankan dan menjadi salah satu standar yang dirujuk dalam regulasi OJK terkait tata kelola teknologi informasi.</p>
      </main>
    `,
  },
  '/frameworks/seojk': {
    title: 'SEOJK 29/2022 - Ketahanan dan Keamanan Siber Perbankan | SibukPatuh',
    description: 'Panduan SEOJK No. 29/SEOJK.03/2022: kewajiban bank umum dalam implementasi ketahanan dan keamanan siber, self-assessment, dan pelaporan OJK.',
    h1: 'SEOJK 29/2022 — Ketahanan dan Keamanan Siber Bank Umum',
    body: `
      <main>
        <h1>SEOJK 29/2022 — Ketahanan dan Keamanan Siber Bank Umum</h1>
        <p>Surat Edaran OJK Nomor 29/SEOJK.03/2022 tentang Ketahanan dan Keamanan Siber bagi Bank Umum merupakan regulasi utama yang mengatur standar keamanan siber perbankan di Indonesia.</p>
        <h2>Kewajiban Utama Bank</h2>
        <ul>
          <li>Implementasi kerangka kerja keamanan siber yang komprehensif</li>
          <li>Identifikasi dan perlindungan aset informasi kritis</li>
          <li>Deteksi ancaman siber secara real-time</li>
          <li>Respons insiden siber yang terstruktur</li>
          <li>Pemulihan sistem pasca insiden siber</li>
          <li>Self-assessment tingkat kematangan keamanan siber secara berkala</li>
          <li>Pelaporan insiden siber kepada OJK</li>
        </ul>
        <p>Regulasi ini berlaku efektif sejak 2022 dan menjadi acuan utama audit keamanan siber perbankan Indonesia.</p>
      </main>
    `,
  },
  '/frameworks/pojk-11-2022': {
    title: 'POJK 11/2022 - Penyelenggaraan Teknologi Informasi Bank Umum | SibukPatuh',
    description: 'Panduan POJK 11/POJK.03/2022 untuk tata kelola TI, ketahanan siber, pihak ketiga, data, audit, perizinan, dan pelaporan Bank Umum kepada OJK.',
    h1: 'POJK 11/2022 — Penyelenggaraan Teknologi Informasi oleh Bank Umum',
    body: `
      <main>
        <h1>POJK 11/2022 — Penyelenggaraan Teknologi Informasi oleh Bank Umum</h1>
        <p>POJK Nomor 11/POJK.03/2022 mengatur penyelenggaraan teknologi informasi oleh Bank Umum secara menyeluruh. Cakupannya meliputi tata kelola TI, arsitektur dan rencana strategis, manajemen risiko, pengamanan informasi, ketahanan siber, penggunaan pihak penyedia jasa TI, lokasi Sistem Elektronik, pengelolaan data, audit, serta pelaporan kepada OJK.</p>
        <h2>Area Kewajiban Utama</h2>
        <ul>
          <li>Tata kelola TI, peran Direksi dan Dewan Komisaris, Komite Pengarah TI, serta satuan kerja penyelenggara TI.</li>
          <li>Arsitektur TI dan rencana strategis TI yang mendukung rencana korporasi Bank.</li>
          <li>Manajemen risiko TI, pengamanan informasi, jaringan, dan Rencana Pemulihan Bencana.</li>
          <li>Ketahanan dan keamanan siber, termasuk self-assessment maturitas dan pengujian keamanan siber.</li>
          <li>Pengawasan penyedia jasa TI, perizinan lokasi/pemrosesan luar negeri, data pribadi, pengendalian intern, audit, dan pelaporan.</li>
        </ul>
        <h2>Batas Waktu Kritis</h2>
        <p>POJK ini memuat antara lain notifikasi awal insiden TI signifikan paling lama 24 jam setelah diketahui, laporan insiden paling lama 5 hari kerja, laporan hasil pengujian berbasis skenario paling lama 10 hari kerja, serta laporan kondisi terkini penyelenggaraan TI paling lama 15 hari kerja setelah akhir tahun pelaporan.</p>
        <p>Konten SibukPatuh bersifat edukatif. Gunakan naskah peraturan dan ketentuan pelaksanaan OJK yang berlaku sebagai acuan formal.</p>
      </main>
    `,
  },
  '/frameworks/pbi-02-2024': {
    title: 'PBI 02/2024 - Keamanan Siber Bank Indonesia | SibukPatuh',
    description: 'Ringkasan PBI 02/2024: kewajiban keamanan siber dan ketahanan operasional bagi lembaga keuangan di bawah pengawasan Bank Indonesia.',
    h1: 'PBI 02/2024 — Keamanan Siber Bank Indonesia',
    body: `
      <main>
        <h1>PBI 02/2024 — Peraturan Bank Indonesia tentang Keamanan Siber</h1>
        <p>Peraturan Bank Indonesia Nomor 02/2024 tentang Keamanan Siber merupakan regulasi terbaru Bank Indonesia yang mengatur standar keamanan siber bagi lembaga keuangan yang berada di bawah pengawasan BI.</p>
        <h2>Ruang Lingkup</h2>
        <p>PBI ini mewajibkan penerapan kontrol keamanan siber yang komprehensif, mencakup manajemen risiko siber, perlindungan infrastruktur kritis, manajemen insiden siber, dan pelaporan kepada Bank Indonesia.</p>
        <p>Regulasi ini berlaku bagi bank umum, bank syariah, penyelenggara sistem pembayaran, dan lembaga keuangan lain yang diawasi Bank Indonesia.</p>
      </main>
    `,
  },
  '/frameworks/padk-1-2026': {
    title: 'PADK 1/2026 - Penyelenggaraan TI Bank Umum | SibukPatuh',
    description: 'Ringkasan PADK 1/2026: regulasi OJK terbaru tentang penyelenggaraan teknologi informasi bank umum, perizinan, dan pelaporan.',
    h1: 'PADK 1/2026 — Penyelenggaraan Teknologi Informasi Bank Umum',
    body: `
      <main>
        <h1>PADK 1 Tahun 2026 — Penyelenggaraan TI Bank Umum</h1>
        <p>PADK 1/2026 adalah Peraturan OJK terbaru yang mengatur penyelenggaraan teknologi informasi oleh bank umum di Indonesia, mencakup perizinan, standar teknis, dan kewajiban pelaporan kepada OJK.</p>
        <p>Regulasi ini merupakan pembaruan dari ketentuan sebelumnya dan menyesuaikan dengan perkembangan teknologi digital di sektor perbankan Indonesia.</p>
      </main>
    `,
  },
  '/frameworks/padg-32-2025': {
    title: 'PADG 32/2025 - Sistem Pembayaran Bank Indonesia | SibukPatuh',
    description: 'Ringkasan PADG 32/2025: pengaturan industri sistem pembayaran, produk, inovasi digital, dan pengawasan Bank Indonesia.',
    h1: 'PADG 32/2025 — Pengaturan Industri Sistem Pembayaran',
    body: `
      <main>
        <h1>PADG 32/2025 — Peraturan Anggota Dewan Gubernur BI tentang Sistem Pembayaran</h1>
        <p>PADG 32/2025 adalah Peraturan Anggota Dewan Gubernur Bank Indonesia yang mengatur industri sistem pembayaran, mencakup penyelenggaraan sistem pembayaran, produk pembayaran, inovasi digital, pricing, dan pengawasan.</p>
        <p>Regulasi ini berlaku bagi seluruh penyelenggara sistem pembayaran yang diawasi Bank Indonesia, termasuk perusahaan fintech, e-wallet, dan payment gateway.</p>
      </main>
    `,
  },
  '/frameworks/panduan-resiliensi-ojk': {
    title: 'Panduan Resiliensi Digital OJK - Ketahanan Operasional | SibukPatuh',
    description: 'Ringkasan Panduan Resiliensi Digital OJK: standar ketahanan operasional, BCP, DRP, dan manajemen insiden untuk lembaga jasa keuangan.',
    h1: 'Panduan Resiliensi Digital OJK',
    body: `
      <main>
        <h1>Panduan Resiliensi Digital OJK — Ketahanan Operasional Perbankan</h1>
        <p>Panduan Resiliensi Digital OJK memberikan standar ketahanan operasional bagi lembaga jasa keuangan, mencakup Business Continuity Planning (BCP), Disaster Recovery Plan (DRP), dan manajemen insiden siber.</p>
        <p>Panduan ini membantu bank dan lembaga keuangan dalam membangun ketahanan operasional yang memadai untuk menghadapi gangguan sistem, bencana, dan serangan siber.</p>
      </main>
    `,
  },
  '/frameworks/uu-pdp-27-2022': {
    title: 'UU PDP No. 27/2022 - Pelindungan Data Pribadi Indonesia | SibukPatuh',
    description: 'Ringkasan UU PDP No. 27/2022: hak subjek data, kewajiban pengendali data, transfer data lintas negara, dan sanksi pelanggaran.',
    h1: 'UU PDP No. 27/2022 — Undang-Undang Pelindungan Data Pribadi',
    body: `
      <main>
        <h1>UU PDP No. 27/2022 — Undang-Undang Pelindungan Data Pribadi Indonesia</h1>
        <p>Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP) adalah regulasi perlindungan data pribadi pertama Indonesia yang komprehensif. UU ini mulai berlaku penuh pada Oktober 2024.</p>
        <h2>Hak Subjek Data</h2>
        <ul>
          <li>Hak untuk mendapatkan informasi tentang pemrosesan data</li>
          <li>Hak untuk mengakses data pribadi miliknya</li>
          <li>Hak untuk memperbarui atau memperbaiki data</li>
          <li>Hak untuk menghapus data (right to be forgotten)</li>
          <li>Hak untuk menolak pemrosesan data</li>
          <li>Hak portabilitas data</li>
        </ul>
        <h2>Kewajiban Pengendali Data</h2>
        <p>Setiap organisasi yang memproses data pribadi warga Indonesia wajib: mendapatkan persetujuan eksplisit, menerapkan keamanan data yang memadai, melaporkan pelanggaran data dalam 14 hari, dan menunjuk Data Protection Officer (DPO) jika memproses data dalam skala besar.</p>
        <h2>Sanksi</h2>
        <p>Pelanggaran UU PDP dapat dikenakan sanksi administratif hingga 2% dari pendapatan tahunan dan sanksi pidana hingga 6 tahun penjara.</p>
      </main>
    `,
  },
  '/frameworks/owasp-top-10': {
    title: 'OWASP Top 10 - Kerentanan Keamanan Aplikasi Web | SibukPatuh',
    description: 'Panduan OWASP Top 10 2021: 10 risiko keamanan aplikasi web paling kritis beserta mitigasi dan panduan secure coding.',
    h1: 'OWASP Top 10 — Risiko Keamanan Aplikasi Web Teratas',
    body: `
      <main>
        <h1>OWASP Top 10 — 10 Risiko Keamanan Aplikasi Web Paling Kritis</h1>
        <p>OWASP Top 10 adalah daftar 10 risiko keamanan aplikasi web paling kritis yang diterbitkan oleh Open Web Application Security Project (OWASP). Versi 2021 mencakup:</p>
        <ol>
          <li><strong>A01 Broken Access Control</strong> — Kontrol akses yang tidak memadai</li>
          <li><strong>A02 Cryptographic Failures</strong> — Kegagalan enkripsi dan perlindungan data</li>
          <li><strong>A03 Injection</strong> — SQL injection, command injection, dan sejenisnya</li>
          <li><strong>A04 Insecure Design</strong> — Desain aplikasi yang tidak aman secara fundamental</li>
          <li><strong>A05 Security Misconfiguration</strong> — Konfigurasi keamanan yang salah</li>
          <li><strong>A06 Vulnerable and Outdated Components</strong> — Komponen yang rentan atau kadaluarsa</li>
          <li><strong>A07 Identification and Authentication Failures</strong> — Kegagalan autentikasi</li>
          <li><strong>A08 Software and Data Integrity Failures</strong> — Kegagalan integritas perangkat lunak</li>
          <li><strong>A09 Security Logging and Monitoring Failures</strong> — Kegagalan logging dan monitoring</li>
          <li><strong>A10 Server-Side Request Forgery (SSRF)</strong> — Pemalsuan permintaan sisi server</li>
        </ol>
        <p>OWASP Top 10 menjadi referensi standar dalam pengembangan aplikasi yang aman dan digunakan sebagai dasar audit keamanan aplikasi oleh regulator Indonesia.</p>
      </main>
    `,
  },
  '/frameworks/owasp-asvs': {
    title: 'OWASP ASVS 5.0.0 - Application Security Verification Standard | SibukPatuh',
    description: 'Panduan OWASP ASVS 5.0.0: standar verifikasi keamanan aplikasi dengan 3 level dan lebih dari 300 persyaratan keamanan terstruktur.',
    h1: 'OWASP ASVS — Application Security Verification Standard',
    body: `
      <main>
        <h1>OWASP ASVS 5.0.0 — Application Security Verification Standard</h1>
        <p>OWASP Application Security Verification Standard (ASVS) adalah kerangka kerja untuk menguji keamanan aplikasi web yang menyediakan lebih dari 300 persyaratan keamanan terstruktur dalam 3 level:</p>
        <ul>
          <li><strong>Level 1 (L1)</strong> — Keamanan dasar untuk semua aplikasi</li>
          <li><strong>Level 2 (L2)</strong> — Keamanan standar untuk aplikasi yang memproses data sensitif</li>
          <li><strong>Level 3 (L3)</strong> — Keamanan tingkat lanjut untuk aplikasi kritis</li>
        </ul>
        <p>ASVS mencakup area verifikasi seperti autentikasi, manajemen sesi, kontrol akses, validasi input, kriptografi, penanganan error, keamanan API, dan keamanan konfigurasi.</p>
      </main>
    `,
  },
  '/intel/intelligence-center': {
    title: 'Intelligence Center - Pusat Intelijen Ancaman Siber | SibukPatuh',
    description: 'Pantau ancaman siber terkini: CISA KEV, OTX threat feeds, breach database, dan analisis ancaman berbasis AI untuk keamanan organisasi.',
    h1: 'Intelligence Center — Pusat Intelijen Ancaman Siber',
    body: `
      <main>
        <h1>Intelligence Center — Pusat Intelijen Ancaman Siber Real-Time</h1>
        <p>Intelligence Center SibukPatuh menyajikan data intelijen ancaman siber terkini dari berbagai sumber terpercaya untuk membantu praktisi keamanan siber Indonesia.</p>
        <h2>Sumber Data Intelijen</h2>
        <ul>
          <li><strong>CISA KEV</strong> — Known Exploited Vulnerabilities dari Cybersecurity and Infrastructure Security Agency AS</li>
          <li><strong>AlienVault OTX</strong> — Open Threat Exchange threat intelligence feeds</li>
          <li><strong>Breach Database</strong> — Data pelanggaran keamanan dan kebocoran data</li>
          <li><strong>CVE Analysis</strong> — Analisis Common Vulnerabilities and Exposures berbasis AI</li>
        </ul>
        <p>Fitur ini membantu praktisi keamanan siber untuk memantau ancaman aktif, memahami tren serangan terbaru, dan mengambil tindakan mitigasi yang tepat.</p>
      </main>
    `,
  },
  '/cross-mapping': {
    title: 'Cross-Mapping Framework - Pemetaan Keterkaitan Regulasi | SibukPatuh',
    description: 'Visualisasi interaktif keterkaitan antar framework kepatuhan: ISO 27001, NIST CSF, PBI, SEOJK. Temukan overlapping controls antar regulasi.',
    h1: 'Cross-Mapping Framework — Pemetaan Keterkaitan Regulasi',
    body: `
      <main>
        <h1>Cross-Mapping Framework — Visualisasi Keterkaitan Regulasi Siber</h1>
        <p>Fitur Cross-Mapping SibukPatuh memvisualisasikan keterkaitan antar framework dan regulasi keamanan siber menggunakan diagram interaktif berbasis D3.js.</p>
        <p>Anda dapat melihat bagaimana kontrol dalam ISO 27001 berkorelasi dengan persyaratan NIST CSF, SEOJK, dan PBI, sehingga memudahkan pemetaan gap dan efisiensi implementasi kontrol lintas regulasi.</p>
        <h2>Manfaat Cross-Mapping</h2>
        <ul>
          <li>Identifikasi kontrol yang overlap antar regulasi untuk efisiensi implementasi</li>
          <li>Temukan gap kontrol yang belum terpenuhi</li>
          <li>Prioritaskan implementasi kontrol berdasarkan cakupan regulasi</li>
          <li>Buat roadmap kepatuhan yang komprehensif</li>
        </ul>
      </main>
    `,
  },
  '/framework-analysis': {
    title: 'Framework Analysis - Perbandingan Side-by-Side Regulasi Siber | SibukPatuh',
    description: 'Bandingkan framework keamanan siber secara side-by-side: ISO 27001 vs NIST CSF vs COBIT vs SEOJK. Temukan persamaan dan perbedaan kontrol.',
    h1: 'Framework Analysis — Perbandingan Regulasi Keamanan Siber',
    body: `
      <main>
        <h1>Framework Analysis — Perbandingan Side-by-Side Regulasi Keamanan Siber</h1>
        <p>Fitur Framework Analysis memungkinkan perbandingan side-by-side antara berbagai framework dan regulasi keamanan siber, membantu Anda memahami persamaan, perbedaan, dan overlapping kontrol antar standar.</p>
        <p>Bandingkan ISO 27001:2022 dengan NIST CSF 2.0, COBIT 2019, SEOJK 29/2022, PBI 02/2024, dan regulasi lainnya dalam satu tampilan yang terstruktur.</p>
      </main>
    `,
  },
  '/checklist-tools': {
    title: 'Checklist Tools - Gap Analysis Kepatuhan Siber | SibukPatuh',
    description: 'Evaluasi tingkat kepatuhan siber organisasi dengan checklist interaktif untuk ISO 27001, NIST CSF, SEOJK, PBI, dan UU PDP. Export PDF/Excel.',
    h1: 'Checklist Tools — Evaluasi Gap Analysis Kepatuhan',
    body: `
      <main>
        <h1>Checklist Tools — Alat Evaluasi Gap Analysis Kepatuhan Siber</h1>
        <p>Checklist Tools SibukPatuh menyediakan alat evaluasi gap analysis mandiri untuk mengukur tingkat kepatuhan siber organisasi Anda terhadap berbagai framework dan regulasi.</p>
        <h2>Framework yang Tersedia</h2>
        <ul>
          <li>ISO 27001:2022 — 93 kontrol keamanan informasi</li>
          <li>NIST CSF 2.0 — 106 subkategori keamanan siber</li>
          <li>SEOJK 29/2022 — Ketahanan siber perbankan OJK</li>
          <li>PBI 02/2024 — Keamanan siber Bank Indonesia</li>
          <li>UU PDP 27/2022 — Pelindungan data pribadi</li>
        </ul>
        <p>Hasil evaluasi dapat diekspor dalam format PDF dan Excel untuk keperluan pelaporan kepada manajemen atau regulator.</p>
      </main>
    `,
  },
  '/compliance-simulator': {
    title: 'Compliance Simulator - What-If Analysis Kepatuhan | SibukPatuh',
    description: 'Simulasikan skenario infrastruktur untuk melihat gap kepatuhan secara instan berdasarkan industri, lokasi data, tipe data, dan regulasi target.',
    h1: 'Compliance Simulator — Simulasi Skenario Kepatuhan',
    body: `
      <main>
        <h1>Compliance Simulator — What-If Analysis Kepatuhan Siber</h1>
        <p>Compliance Simulator SibukPatuh memungkinkan Anda mensimulasikan berbagai skenario infrastruktur dan operasional untuk melihat potensi gap kepatuhan secara instan.</p>
        <h2>Parameter Simulasi</h2>
        <ul>
          <li><strong>Industri</strong> — Perbankan, fintech, kesehatan, e-commerce, pemerintahan</li>
          <li><strong>Lokasi Data</strong> — On-premise, cloud Indonesia, cloud Singapura, cloud AS, cloud Eropa</li>
          <li><strong>Tipe Data</strong> — Data keuangan, data pribadi umum, data pribadi spesifik</li>
          <li><strong>Pengelola Sistem</strong> — Internal, vendor cloud, pihak ketiga, tim remote</li>
          <li><strong>Regulasi Target</strong> — SEOJK, PBI, PADG, PADK, OWASP, UU PDP</li>
        </ul>
        <p>Simulator akan menganalisis gap kepatuhan dan memberikan rekomendasi tindakan yang spesifik berdasarkan kombinasi parameter yang Anda pilih.</p>
      </main>
    `,
  },
};

export async function prerender(data) {
  const url = data.url || '/';
  const content = ROUTE_CONTENT[url] || ROUTE_CONTENT['/'];

  return {
    html: content.body,
    head: {
      title: content.title,
      elements: new Set([
        { type: 'meta', props: { name: 'description', content: content.description } },
        { type: 'meta', props: { property: 'og:title', content: content.title } },
        { type: 'meta', props: { property: 'og:description', content: content.description } },
        { type: 'meta', props: { property: 'og:url', content: `https://sibukpatuh.net${url}` } },
        { type: 'link', props: { rel: 'canonical', href: `https://sibukpatuh.net${url}` } },
      ]),
    },
    links: url === '/'
      ? new Set(Object.keys(ROUTE_CONTENT).filter(r => r !== '/'))
      : new Set(),
  };
}
