<template>
  <div class="about-container">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <div class="about-header text-center mb-5">
          <div class="about-icon mb-3">
            <i class="fas fa-graduation-cap"></i>
          </div>
          <h1 class="about-title">Tentang SibukPatuh</h1>
          <p class="about-subtitle text-muted">Menjadikan pembelajaran framework keamanan lebih mudah diakses</p>
        </div>

        <div class="about-card mb-4">
          <div class="card-body p-4 p-md-5">
            <h3 class="mb-4"><i class="fas fa-book-reader text-primary me-2"></i> Rangkuman Edukatif</h3>

            <p><strong>SibukPatuh</strong> adalah aplikasi web edukatif untuk mempelajari struktur, istilah, dan konteks berbagai framework serta regulasi teknologi informasi, baik nasional maupun internasional.</p>

            <p>Aplikasi ini dibuat untuk membantu tim IT, auditor, dan compliance officer dalam:</p>
            <ul class="feature-list mb-4">
              <li><i class="fas fa-check-circle text-success me-2"></i> <strong>Memahami struktur materi</strong> dari berbagai framework kepatuhan (SEOJK, PBI, ISO, NIST, COBIT)</li>
              <li><i class="fas fa-check-circle text-success me-2"></i> <strong>Membaca ringkasan edukatif</strong> tanpa harus membuka dokumen satu per satu di tahap awal</li>
              <li><i class="fas fa-check-circle text-success me-2"></i> <strong>Menelusuri istilah dan tema utama</strong> per domain, kategori, atau topik</li>
              <li><i class="fas fa-check-circle text-success me-2"></i> <strong>Membandingkan acuan</strong> sebagai bahan belajar dan diskusi internal</li>
            </ul>

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
.about-container {
  padding: 1rem 0 3rem;
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.about-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 20px;
  background: linear-gradient(135deg, #16324b 0%, #1f6f78 100%);
  color: white;
  font-size: 2rem;
  box-shadow: 0 10px 25px rgba(22, 50, 75, 0.2);
}

.about-title {
  color: var(--ink);
  font-weight: 800;
  letter-spacing: -0.5px;
}

.about-card {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.04);
  backdrop-filter: blur(12px);
  overflow: hidden;
}

.bg-light-gradient {
  background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.95), rgba(245, 248, 250, 0.9));
}

.feature-list {
  list-style: none;
  padding-left: 0;
}

.feature-list li {
  margin-bottom: 0.8rem;
  font-size: 1.05rem;
  color: #3b424d;
}

.header-with-line {
  position: relative;
  padding-bottom: 0.5rem;
}

.header-with-line::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: var(--active);
  border-radius: 3px;
}

.avatar-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--active-soft);
  color: var(--active);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  box-shadow: inset 0 0 0 2px rgba(20, 78, 114, 0.1);
}

.btn-contact {
  font-weight: 600;
  padding-top: 0.6rem;
  padding-bottom: 0.6rem;
  transition: all 0.2s;
}

.btn-contact:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(20, 78, 114, 0.15);
}

.btn-primary {
  background-color: var(--active);
  border-color: var(--active);
}

.btn-outline-primary {
  color: var(--active);
  border-color: var(--active);
}

.btn-outline-primary:hover {
  background-color: var(--active);
  border-color: var(--active);
  color: white;
}

.alert-warning {
  background-color: rgba(255, 193, 7, 0.1) !important;
  border-left: 4px solid #ffc107 !important;
}

.alert-heading {
  color: #b38600;
}
</style>
