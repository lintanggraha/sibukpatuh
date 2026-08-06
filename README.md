<div align="center">
  <img src="./public/pwa-512x512.png" alt="SibukPatuh Logo" width="120" height="120" />
  <h1>SibukPatuh</h1>
  <p><strong>Platform Edukatif Kepatuhan Siber & Tata Kelola TI</strong></p>
  <p>
    <a href="https://sibukpatuh.net"><strong>sibukpatuh.net</strong></a>
  </p>
</div>

---

**SibukPatuh** adalah platform referensi edukatif dan perangkat analisis kepatuhan (*compliance*) yang dirancang untuk membedah kompleksitas regulasi IT dan memantau lanskap ancaman siber secara *real-time*. Dikembangkan dengan estetika *high-density dashboard* untuk para praktisi GRC (*Governance, Risk, and Compliance*), *Security Analyst*, dan akademisi.

## ⚠️ Disclaimer Penting

**Konten edukatif — bukan pengganti standar resmi:**
- Data untuk **ISO 27001:2022**, **ISO 37001:2016**, **COBIT 2019**, **NIST CSF 2.0**, regulasi Indonesia (seperti **SEOJK**, **PBI**, **PADG**, **PADK**, **UU PDP**), serta panduan **OWASP** adalah **ringkasan edukatif** berdasarkan interpretasi teknis, **bukan** teks hukum resmi.
- Untuk keperluan audit resmi, silakan merujuk pada dokumen yang diterbitkan oleh institusi terkait (BSN, OJK, BI, ISO, ISACA, OWASP).

---

## 🚀 Fitur Unggulan

### 1. 📊 Professional Framework Explorer
Navigasi interaktif untuk 14 standar kepatuhan dengan layout responsif:
- **Regulasi Nasional:** PADG 32/2025, PADK 1 Tahun 2026, SEOJK 29/2022, Panduan Resiliensi OJK, PBI 02/2024, UU PDP 27/2022.
- **Standar Internasional:** COBIT 2019, NIST CSF 2.0, ISO 27001:2022, ISO 37001:2016.
- **Application Security (AppSec):** OWASP Top 10 2025, OWASP ASVS 5.0.0.
- **Analogi "Street Smart":** Setiap kontrol dilengkapi dengan penjelasan bahasa santai dan metafora yang mudah dipahami (terutama untuk *non-regulatory people*), namun tetap akurat secara teknis.

### 2. 🔍 Global Command Palette (Ctrl+K)
Pencarian terpadu yang menjangkau **1.170 kontrol, pasal, dan requirement** lintas 14 kerangka kerja.
- **Fuzzy Matching:** Pencarian multi-field (judul, ringkasan, kata kunci) dengan dukungan *deep-link*.
- **Smart Alias:** Mendukung pencarian notasi resmi seperti `A.8.24` untuk ISO 27001, langsung melompat ke halaman, tab, dan paginasi yang tepat, lengkap dengan sorotan visual.

### 3. 🔗 Compliance Synergy (Cross-Mapping & Analysis Tools)
Toolkit lengkap untuk membantu memetakan kepatuhan organisasi:
- **Compliance Simulator & Roadmap Generator:** Fitur analisis "What-If" untuk menyimulasikan tingkat kepatuhan dan menghasilkan **Roadmap Kepatuhan 12 Bulan** secara otomatis berdasarkan prioritas temuan kritis.
- **Cross-Mapping Visualization:** Visualisasi keterkaitan antar framework (ISO, NIST, PBI, dll) menggunakan **D3.js Force-Directed Graph**.
- **Checklist & Gap Analysis:** Alat evaluasi mandiri untuk mengukur tingkat kepatuhan saat ini.
- **Export Reporting:** Ekspor laporan komprehensif ke format **PDF** dan **Excel**.

### 4. 🧠 Intelligence Center (OSINT Hub)
Pusat komando intelijen ancaman yang mengintegrasikan berbagai sumber data global:
- **Threat Feed (OTX AlienVault):** Monitoring *pulse* dan indikator ancaman (IOC) terbaru secara *real-time*.
- **Vulnerability Intel (CISA KEV):** Daftar kerentanan yang telah dieksploitasi secara aktif.
- **Breach Checker (Smart Fallback):** Integrasi API BreachDirectory dengan mekanisme *Smart Fallback* otomatis untuk simulasi kebocoran data.
- **AI Analyst Integration:** Ditenagai oleh **Google Gemini**, memberikan analisis mendalam, rekomendasi mitigasi, dan memetakan dampak risiko terhadap regulasi di Indonesia.

---

## 🛠️ Tech Stack & Arsitektur

### Frontend
- **Vue 3 (Composition API):** Framework reaktif untuk performa tinggi.
- **Vite:** Build tool modern dengan dukungan PWA dan *prerendering* (SSG) untuk performa Core Web Vitals (SEO) yang optimal.
- **Pinia & Vue Router:** State management dan navigasi *client-side* (SPA).
- **ApexCharts & D3.js:** Visualisasi distribusi data dan pemetaan graf.
- **Custom CSS:** Estetika *Glassmorphism* dan dukungan responsif *Dark Mode* penuh.

### Backend (Serverless)
- **Vercel Serverless Functions:** Proxy API terintegrasi untuk menangani permintaan eksternal (CISA, Gemini, OTX, BreachDirectory) tanpa masalah CORS dan menyembunyikan API Key.
- **Smart Rate Limiting:** Mekanisme pencegahan *client-side* terhadap indikasi *spamming* permintaan.

---

## 📂 Struktur Project

```bash
sibukpatuh/
├── api/                # Serverless Functions (Breach, CISA, Gemini, OTX)
├── public/data/        # Framework JSON Datasets (COBIT, PBI, ISO, PADG, dll)
├── src/
│   ├── components/     # UI Components (GlobalSearch, ReportExporter, dll)
│   ├── views/          # Framework & Intelligence Pages
│   ├── services/       # API Services & Search Index Logic
│   ├── router/         # Vue Router Configuration
│   ├── mixins/         # Vue Mixins (searchDeepLink)
│   └── assets/css/     # Core Design System & Styling
├── vercel.json         # Deployment, API Proxy, & Routing Config
└── README.md           # Documentation
```

---

## 🔧 Pengembangan Lokal

1. Clone repositori:
   ```bash
   git clone https://github.com/lintanggraha/sibukpatuh.git
   cd sibukpatuh
   ```
2. Install dependensi:
   ```bash
   npm install
   ```
3. Setup Environment Variables (`.env`):
   ```env
   GEMINI_KEY=your_gemini_api_key
   RAPIDAPI_KEY=your_rapidapi_key
   ```
4. Jalankan server dev:
   ```bash
   npm run dev
   ```

---

## 🌐 Deployment

Aplikasi ini dioptimalkan untuk deployment di **Vercel** dengan konfigurasi khusus pada `vercel.json` untuk menangani SPA *rewrite rules* dan *serverless functions*. Proyek ini juga telah mengimplementasikan *prerendering* untuk meningkatkan skor SEO dan *Core Web Vitals*.

---

**SibukPatuh** — *Sistem Informasi Biar Update Kepatuhan.*
