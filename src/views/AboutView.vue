<template>
  <div class="about-container">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <div class="about-header text-center mb-5">
          <div class="about-icon-wrapper mb-3">
            <div class="about-icon">
              <i class="fas fa-graduation-cap"></i>
            </div>
          </div>
          <h1 class="about-title">Tentang SibukPatuh</h1>
          <p class="about-subtitle">Platform Navigasi & Eksplorasi Framework Keamanan Siber</p>
        </div>

        <div class="about-card mb-4">
          <div class="card-body p-4 p-md-5">
            <h3 class="mb-4"><i class="fas fa-book-reader text-primary me-2"></i> Rangkuman Edukatif</h3>

            <p><strong>SibukPatuh</strong> adalah aplikasi web edukatif untuk mempelajari struktur, istilah, dan konteks berbagai framework serta regulasi teknologi informasi, baik nasional maupun internasional.</p>

            <p>Aplikasi ini dibuat untuk membantu tim IT, auditor, dan compliance officer dalam:</p>
            <div class="feature-grid mb-5">
              <div class="feature-item">
                <div class="feature-icon"><i class="fas fa-check-circle"></i></div>
                <div class="feature-content">
                  <h5 class="fw-bold mb-1">Memahami struktur materi</h5>
                  <p class="mb-0 text-muted small">Dari berbagai framework kepatuhan (SEOJK, PBI, ISO, NIST, COBIT)</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon"><i class="fas fa-check-circle"></i></div>
                <div class="feature-content">
                  <h5 class="fw-bold mb-1">Membaca ringkasan edukatif</h5>
                  <p class="mb-0 text-muted small">Tanpa harus membuka dokumen satu per satu di tahap awal pencarian referensi</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon"><i class="fas fa-check-circle"></i></div>
                <div class="feature-content">
                  <h5 class="fw-bold mb-1">Menelusuri istilah utama</h5>
                  <p class="mb-0 text-muted small">Per domain, kategori, atau topik untuk mempermudah pemahaman tim</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon"><i class="fas fa-check-circle"></i></div>
                <div class="feature-content">
                  <h5 class="fw-bold mb-1">Membandingkan acuan</h5>
                  <p class="mb-0 text-muted small">Sebagai bahan belajar kros-mapping dan diskusi internal manajemen risiko</p>
                </div>
              </div>
            </div>

            <div class="alert alert-warning d-flex align-items-start shadow-sm border-0 rounded-4" role="alert">
              <i class="fas fa-exclamation-triangle fs-3 me-3 mt-1 text-warning"></i>
              <div>
                <h5 class="alert-heading fw-bold">Catatan Penting</h5>
                <p class="mb-0 text-dark">Konten di dalam SibukPatuh disusun murni sebagai <strong>referensi pembelajaran dan edukasi</strong> untuk memperdalam pemahaman, bukan sebagai panduan resmi yang absolut. Khusus untuk <strong>ISO 27001</strong> dan <strong>COBIT 2019</strong>, materi yang tersedia merupakan rangkuman dan interpretasi edukatif, bukan reproduksi dokumen resmi. Untuk keperluan audit, sertifikasi, atau pengambilan keputusan hukum, pengguna diwajibkan untuk selalu merujuk pada dokumen standar resmi yang berlaku yang diterbitkan oleh masing-masing institusi (BSN, OJK, BI, ISO, ISACA).</p>
              </div>
            </div>
          </div>
        </div>

        <div class="about-card bg-light-gradient mt-5">
          <div class="card-body p-4 p-md-5">
            <h3 class="mb-4 header-with-line"><i class="fas fa-user-shield text-info me-2"></i> Siapa di Balik SibukPatuh?</h3>
            <div class="creator-profile d-flex flex-column flex-md-row align-items-center align-items-md-start gap-4">
              <div class="creator-avatar flex-shrink-0">
                <div class="avatar-circle">
                  <i class="fas fa-user-tie"></i>
                </div>
              </div>
              <div>
                <h4 class="fw-bold mb-1">Lintang</h4>
                <p class="text-primary fw-medium mb-3">Risk Management Professional</p>
                <p class="text-muted lh-lg">
                  Berangkat dari pengalaman sehari-hari dalam menavigasi berbagai persyaratan kepatuhan (<em>compliance</em>) dan manajemen risiko, saya menyadari perlunya sebuah ruang interaktif yang bisa menjembatani antara teori dokumen PDF yang tebal dengan pemahaman praktis di lapangan. SibukPatuh dibangun sebagai wujud dedikasi untuk terus berbagi wawasan seputar <em>cybersecurity</em> dan mempermudah tim untuk menyelaraskan operasi dan kebijakan dengan best practice internasional.
                </p>

                <div class="contact-links mt-4 d-flex flex-wrap gap-3">
                  <a href="mailto:lintanggraha@gmail.com" class="btn btn-outline-primary rounded-pill px-4 btn-contact">
                    <i class="fas fa-envelope me-2"></i> lintanggraha@gmail.com
                  </a>
                  <a href="https://www.linkedin.com/in/lintanggraha/" target="_blank" rel="noopener noreferrer" class="btn btn-primary rounded-pill px-4 btn-contact">
                    <i class="fab fa-linkedin me-2"></i> Terhubung di LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutView",
};
</script>

<style scoped>
.about-container{padding:2rem 0 4rem;animation:fadeInUp .6s cubic-bezier(0.16,1,0.3,1) forwards}
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.about-icon-wrapper{display:flex;justify-content:center}
.about-icon{width:4.5rem;height:4.5rem;display:inline-flex;align-items:center;justify-content:center;border-radius:22px;background:linear-gradient(135deg,#0f172a 0%,#334155 100%);color:#fff;font-size:2rem;box-shadow:0 15px 35px rgba(15,23,42,0.15)}
.about-title{color:#0f172a;font-weight:900;font-size:clamp(1.8rem, 5vw, 2.5rem);letter-spacing:-1px;margin-bottom:.5rem}
.about-subtitle{color:#64748b;font-size:clamp(0.95rem, 2vw, 1.1rem);font-weight:500}
.about-card{background:rgba(255,255,255,0.7);border-radius:32px;border:1px solid rgba(255,255,255,0.4);box-shadow:0 25px 50px -12px rgba(0,0,0,0.05);backdrop-filter:blur(20px);overflow:hidden;transition:transform .3s ease}
.about-card:hover{transform:translateY(-4px)}
.feature-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem}
.feature-item{background:rgba(255,255,255,0.4);padding:1rem 1.25rem;border-radius:20px;border:1px solid rgba(0,0,0,0.02);display:flex;align-items:flex-start;gap:1rem;transition:all .3s ease}
.feature-item:hover{background:#fff;transform:translateY(-2px);box-shadow:0 10px 25px rgba(0,0,0,0.03)}
.feature-icon{color:#10b981;font-size:1.15rem;margin-top:2px}
.feature-content h5{font-size:.9rem;color:#0f172a}
.feature-content p{font-size:.78rem;line-height:1.5}
.header-with-line{position:relative;padding-bottom:1rem;margin-bottom:1.5rem}
.header-with-line::after{content:'';position:absolute;bottom:0;left:0;width:50px;height:4px;background:#0f172a;border-radius:2px}
.avatar-circle{width:80px;height:80px;border-radius:24px;background:linear-gradient(135deg,#f1f5f9 0%,#e2e8f0 100%);color:#0f172a;display:flex;align-items:center;justify-content:center;font-size:2.2rem;box-shadow:0 10px 25px rgba(0,0,0,0.05)}
.btn-contact{font-weight:700;padding:.7rem 1.4rem;font-size:0.9rem;letter-spacing:-0.2px;transition:all .3s cubic-bezier(0.4,0,0.2,1)}
.btn-contact:hover{transform:translateY(-3px);box-shadow:0 12px 20px rgba(15,23,42,0.1)}
.btn-primary{background:#0f172a;border-color:#0f172a}
.btn-outline-primary{color:#0f172a;border-color:#0f172a}
.alert-warning{background:rgba(251,191,36,0.1) !important;border:1px solid rgba(251,191,36,0.2) !important;border-radius:20px !important}
.alert-heading{color:#92400e;font-size:1rem}

@media (max-width: 1440px) {
  .about-header { margin-bottom: 2rem !important; }
  .about-icon { width: 3.8rem; height: 3.8rem; font-size: 1.6rem; border-radius: 18px; }
  .card-body { padding: 2rem !important; }
  .feature-grid { gap: 0.75rem; }
}

@media (max-width: 767.98px) {
  .about-title { font-size: 1.8rem; }
  .card-body { padding: 1.5rem !important; }
  .creator-profile { text-align: center; }
  .header-with-line::after { left: 50%; transform: translateX(-50%); }
}
</style>
