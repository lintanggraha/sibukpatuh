<template>
  <div class="guides-page">
    <header class="guides-hero">
      <div class="eyebrow"><i class="fas fa-compass"></i> Panduan Original SibukPatuh</div>
      <h1>Panduan Praktis Kepatuhan Siber untuk Tim Indonesia</h1>
      <p class="lead">
        Memindahkan pembacaan regulasi dan framework dari sekadar daftar kewajiban menjadi keputusan kerja yang dapat dijelaskan,
        diuji, dan dibuktikan kepada manajemen maupun auditor.
      </p>
      <div class="editorial-meta">
        <span><i class="fas fa-pen-nib"></i> Ditulis oleh Lintang, pengelola SibukPatuh</span>
        <span><i class="fas fa-calendar-check"></i> Ditinjau 15 Agustus 2026</span>
        <span><i class="fas fa-clock"></i> Waktu baca sekitar 9 menit</span>
      </div>
    </header>

    <section class="trust-panel" aria-labelledby="why-title">
      <div>
        <p class="section-kicker">Mengapa halaman ini dibuat</p>
        <h2 id="why-title">Kerangka kerja baru bernilai ketika membantu orang mengambil langkah berikutnya.</h2>
      </div>
      <p>
        Ringkasan standar sering berhenti pada definisi. Panduan ini menambahkan interpretasi praktis: pertanyaan apa yang perlu
        diajukan, bukti apa yang perlu dikumpulkan, siapa pemilik prosesnya, dan bagaimana mengukur apakah kontrol benar-benar
        bekerja. Contoh di bawah adalah kerangka berpikir edukatif, bukan pengganti nasihat hukum atau dokumen regulator.
      </p>
    </section>

    <main class="guides-content">
      <article class="guide-article">
        <div class="article-number">01</div>
        <div>
          <p class="section-kicker">Dari aturan ke bukti</p>
          <h2>Cara membaca kewajiban supaya tidak berubah menjadi checklist kosong</h2>
          <p>
            Mulailah dengan memisahkan tiga lapisan yang sering tercampur: kewajiban, tujuan pengendalian, dan bukti. Kewajiban
            menjawab apa yang diminta; tujuan pengendalian menjelaskan risiko yang hendak dikurangi; bukti menunjukkan apakah
            organisasi benar-benar menjalankan proses tersebut. Satu kalimat regulasi dapat menghasilkan lebih dari satu bukti,
            dan satu bukti dapat mendukung beberapa kewajiban yang berhubungan.
          </p>
          <div class="step-grid">
            <div class="step-card"><strong>1. Pahami konteks</strong><span>Siapa subjeknya, aktivitas apa yang diatur, dan kapan kewajiban berlaku?</span></div>
            <div class="step-card"><strong>2. Rumuskan risiko</strong><span>Apa yang dapat gagal jika kewajiban tidak dijalankan atau hanya dijalankan di atas kertas?</span></div>
            <div class="step-card"><strong>3. Tentukan bukti</strong><span>Dokumen, konfigurasi, log, notulen, atau hasil pengujian apa yang dapat diverifikasi?</span></div>
            <div class="step-card"><strong>4. Tetapkan pemilik</strong><span>Siapa yang menjalankan, menyetujui, meninjau, dan memperbaiki kontrol tersebut?</span></div>
          </div>
        </div>
      </article>

      <article class="guide-article accent-teal">
        <div class="article-number">02</div>
        <div>
          <p class="section-kicker">Baseline yang dapat dipakai</p>
          <h2>Membangun baseline kontrol berdasarkan risiko, bukan jumlah item</h2>
          <p>
            Baseline yang baik tidak harus memuat seluruh kontrol yang pernah diterbitkan. Pilih kontrol yang paling relevan terhadap
            layanan, data, ancaman, dan kewajiban organisasi. Setelah itu, dokumentasikan alasan pemilihan, status penerapan, dan
            gap yang masih terbuka. Cara ini membuat diskusi manajemen lebih jujur: gap bukan sekadar warna merah, melainkan keputusan
            yang memiliki pemilik, tenggat, dan tingkat risiko.
          </p>
          <blockquote>
            Pertanyaan yang lebih berguna daripada “berapa persen sudah patuh?” adalah “risiko apa yang sudah dikurangi, dengan bukti
            apa, dan risiko apa yang masih diterima?”
          </blockquote>
          <p>
            Gunakan <router-link to="/checklist-tools">Checklist Tools</router-link> untuk mengorganisasi baseline, lalu gunakan
            <router-link to="/cross-mapping">Cross-Mapping</router-link> ketika perlu memahami tumpang tindih antara framework.
            Hasil alat tetap perlu ditinjau oleh orang yang memahami proses bisnis dan konteks teknis organisasi.
          </p>
        </div>
      </article>

      <article class="guide-article accent-indigo">
        <div class="article-number">03</div>
        <div>
          <p class="section-kicker">Memilih acuan</p>
          <h2>ISO, NIST, OWASP, OJK, dan BI tidak harus diperlakukan sebagai lima checklist terpisah</h2>
          <p>
            Framework memiliki fungsi yang berbeda. NIST CSF membantu menyusun bahasa risiko dan siklus pengelolaan; ISO 27001
            membantu membangun sistem manajemen; OWASP membantu memperinci keamanan aplikasi; sedangkan regulasi OJK dan BI membawa
            kewajiban sektoral yang harus dibaca dalam konteks layanan. Pemetaan silang seharusnya dipakai untuk menemukan hubungan,
            bukan untuk mengklaim bahwa dua kontrol memiliki arti yang identik.
          </p>
          <div class="comparison-table" role="table" aria-label="Cara menggunakan framework">
            <div class="table-row table-head" role="row"><span role="columnheader">Acuan</span><span role="columnheader">Pertanyaan utama</span><span role="columnheader">Output praktis</span></div>
            <div class="table-row" role="row"><span>NIST CSF</span><span>Bagaimana risiko dikelola dari Govern sampai Recover?</span><span>Bahasa risiko dan prioritas</span></div>
            <div class="table-row" role="row"><span>ISO 27001</span><span>Bagaimana sistem manajemen dan perbaikannya dibuktikan?</span><span>ISMS, proses, dan evidence</span></div>
            <div class="table-row" role="row"><span>OWASP</span><span>Bagaimana aplikasi diuji terhadap risiko teknis?</span><span>Requirement dan pengujian teknis</span></div>
            <div class="table-row" role="row"><span>OJK/BI</span><span>Kewajiban sektoral apa yang berlaku bagi organisasi?</span><span>Regulatory obligations</span></div>
          </div>
        </div>
      </article>

      <article class="guide-article accent-amber">
        <div class="article-number">04</div>
        <div>
          <p class="section-kicker">Rencana 30 hari</p>
          <h2>Mulai kecil, ukur, lalu perbaiki dengan ritme yang dapat dipertahankan</h2>
          <p>
            Untuk tim yang baru memulai, empat minggu pertama dapat dipakai untuk menghasilkan baseline yang dapat ditinjau tanpa
            berpura-pura bahwa semua risiko sudah selesai. Minggu pertama memetakan aset dan proses kritis; minggu kedua memilih
            kontrol prioritas; minggu ketiga mengumpulkan evidence dan menguji satu-dua kontrol; minggu keempat menyusun keputusan
            perbaikan, residual risk, serta agenda review berikutnya.
          </p>
          <div class="timeline">
            <div><strong>Minggu 1</strong><span>Inventarisasi layanan, data penting, pihak ketiga, dan skenario gangguan.</span></div>
            <div><strong>Minggu 2</strong><span>Susun prioritas berdasarkan dampak, kemungkinan, dan kewajiban yang berlaku.</span></div>
            <div><strong>Minggu 3</strong><span>Uji evidence, wawancarai pemilik proses, dan dokumentasikan gap yang terukur.</span></div>
            <div><strong>Minggu 4</strong><span>Sepakati rencana perbaikan, risk acceptance, metrik, dan tanggal review ulang.</span></div>
          </div>
        </div>
      </article>
    </main>

    <section class="sources-panel" aria-labelledby="sources-title">
      <p class="section-kicker">Sumber untuk pendalaman</p>
      <h2 id="sources-title">Dokumen primer dan referensi yang menjadi titik mulai</h2>
      <p>
        SibukPatuh menyusun interpretasi edukatif dari sumber di bawah. Pembaca perlu membuka dokumen resmi yang berlaku sebelum
        mengambil keputusan kepatuhan, audit, sertifikasi, atau hukum.
      </p>
      <div class="source-links">
        <a href="https://www.nist.gov/cyberframework" target="_blank" rel="noopener noreferrer">NIST Cybersecurity Framework</a>
        <a href="https://owasp.org/www-project-application-security-verification-standard/" target="_blank" rel="noopener noreferrer">OWASP ASVS</a>
        <a href="https://www.cisa.gov/known-exploited-vulnerabilities-catalog" target="_blank" rel="noopener noreferrer">CISA KEV Catalog</a>
        <a href="https://www.ojk.go.id/" target="_blank" rel="noopener noreferrer">Otoritas Jasa Keuangan</a>
        <a href="https://www.bi.go.id/" target="_blank" rel="noopener noreferrer">Bank Indonesia</a>
      </div>
      <p class="source-note"><strong>Batasan editorial:</strong> halaman ini adalah analisis pembelajaran original SibukPatuh, bukan dokumen resmi dan bukan nasihat profesional individual.</p>
    </section>
  </div>
</template>

<script>
export default {
  name: 'GuidesView',
};
</script>

<style scoped>
.guides-page{max-width:1120px;margin:0 auto;padding:2.2rem 1rem 5rem;color:#172033}
.guides-hero{padding:2.8rem clamp(1.4rem,4vw,4.2rem);border-radius:30px;background:linear-gradient(135deg,#0f172a,#243b53 62%,#0f766e);color:#fff;box-shadow:0 24px 55px rgba(15,23,42,.2)}
.eyebrow,.section-kicker{font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;font-weight:800}
.eyebrow{color:#99f6e4;margin-bottom:1rem}.guides-hero h1{max-width:820px;font-size:clamp(2rem,5vw,4rem);line-height:1.06;margin:0 0 1.2rem;letter-spacing:-.055em}.lead{max-width:800px;font-size:1.1rem;line-height:1.8;color:#dbeafe;margin:0}.editorial-meta{display:flex;gap:1rem;flex-wrap:wrap;margin-top:2rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,.2);font-size:.82rem;color:#cbd5e1}.editorial-meta i{color:#99f6e4;margin-right:.35rem}
.trust-panel{display:grid;grid-template-columns:1fr 1.2fr;gap:2rem;align-items:start;margin:2rem 0;padding:2rem;border:1px solid #dbe5e8;border-radius:24px;background:#f5fbfa}.trust-panel h2,.sources-panel h2{font-size:clamp(1.4rem,3vw,2.25rem);line-height:1.15;margin:.4rem 0 0;letter-spacing:-.035em}.trust-panel p:last-child,.sources-panel>p:not(.section-kicker){line-height:1.85;color:#475569;margin:0}.section-kicker{color:#0f766e;margin:0}
.guides-content{display:grid;gap:1.4rem}.guide-article{display:grid;grid-template-columns:72px 1fr;gap:1.3rem;padding:2rem;border-radius:24px;background:#fff;border:1px solid #e5e7eb;box-shadow:0 14px 35px rgba(15,23,42,.06)}.article-number{font-size:1.45rem;font-weight:900;color:#0f766e}.guide-article h2{font-size:clamp(1.35rem,2.6vw,2.1rem);line-height:1.18;margin:.3rem 0 1rem;letter-spacing:-.035em}.guide-article p{line-height:1.85;color:#475569}.guide-article a{color:#0f766e;font-weight:800}.accent-teal{border-top:5px solid #0f766e}.accent-indigo{border-top:5px solid #4f46e5}.accent-amber{border-top:5px solid #d97706}.accent-teal .article-number{color:#0f766e}.accent-indigo .article-number{color:#4f46e5}.accent-amber .article-number{color:#d97706}
.step-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:.8rem;margin-top:1.4rem}.step-card{display:flex;flex-direction:column;gap:.35rem;padding:1rem;border-radius:16px;background:#f8fafc;border:1px solid #e2e8f0}.step-card strong{color:#0f172a}.step-card span{font-size:.9rem;line-height:1.6;color:#64748b}blockquote{margin:1.4rem 0;padding:1.1rem 1.3rem;border-left:4px solid #0f766e;background:#f0fdfa;color:#134e4a;font-weight:700;line-height:1.7}.comparison-table{margin-top:1.4rem;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden}.table-row{display:grid;grid-template-columns:1fr 1.5fr 1fr;gap:1rem;padding:.85rem 1rem;border-top:1px solid #e2e8f0;font-size:.9rem;color:#475569}.table-row:first-child{border-top:0}.table-head{background:#f8fafc;font-weight:800;color:#0f172a}.timeline{display:grid;gap:.7rem;margin-top:1.4rem}.timeline div{display:grid;grid-template-columns:120px 1fr;gap:1rem;padding:1rem;border-radius:14px;background:#fffbeb;border:1px solid #fde68a}.timeline strong{color:#92400e}.timeline span{color:#57534e;line-height:1.6}.sources-panel{margin-top:1.5rem;padding:2rem;border-radius:24px;background:#f8fafc;border:1px solid #e2e8f0}.source-links{display:flex;gap:.7rem;flex-wrap:wrap;margin:1.4rem 0}.source-links a{padding:.7rem 1rem;border-radius:999px;background:#fff;border:1px solid #cbd5e1;color:#0f766e;font-weight:800;text-decoration:none}.source-links a:hover{background:#ecfdf5;border-color:#5eead4}.source-note{padding-top:1rem;border-top:1px solid #e2e8f0;font-size:.9rem!important}
@media(max-width:760px){.trust-panel{grid-template-columns:1fr}.guide-article{grid-template-columns:1fr;gap:.5rem}.step-grid{grid-template-columns:1fr}.table-row{grid-template-columns:1fr;gap:.25rem}.table-head{display:none}.timeline div{grid-template-columns:1fr;gap:.25rem}.editorial-meta{display:grid}}
</style>
