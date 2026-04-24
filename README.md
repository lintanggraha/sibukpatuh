# 🛡️ SibukPatuh - Intelligence & Compliance Dashboard

[![Vercel Deployment](https://img.shields.io/badge/Deployment-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4fc08d?style=for-the-badge&logo=vuedotjs)](https://vuejs.org)
[![Vite](https://img.shields.io/badge/Vite-Latest-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-blue?style=for-the-badge&logo=google-gemini)](https://ai.google.dev)

**SibukPatuh** adalah platform *Unified Compliance & Threat Intelligence* yang dirancang untuk membedah kompleksitas regulasi IT dan memantau lanskap ancaman siber secara *real-time*. Dikembangkan dengan estetika *high-density dashboard* untuk para praktisi GRC (*Governance, Risk, and Compliance*) dan *Security Analyst*.

---

## ⚠️ Disclaimer Penting

**Konten edukatif — bukan pengganti standar resmi:**

- Data untuk **ISO 27001:2022**, **COBIT 2019**, **PBI**, dan **SEOJK** adalah **ringkasan edukatif** berdasarkan interpretasi teknis, **bukan** teks hukum resmi.
- Untuk keperluan audit resmi, silakan merujuk pada dokumen yang diterbitkan oleh institusi terkait (BSN, OJK, BI, ISO, ISACA).

---

## 🚀 Fitur Unggulan

### 1. 🧠 Intelligence Center (OSINT Hub)
Pusat komando intelijen ancaman yang mengintegrasikan berbagai sumber data global:
- **Threat Feed (OTX AlienVault):** Monitoring *pulse* dan indikator ancaman (IOC) terbaru secara *real-time*.
- **Vulnerability Intel (CISA KEV):** Daftar kerentanan yang telah dieksploitasi secara aktif (*Known Exploited Vulnerabilities*).
- **Breach Checker (Smart Fallback):** Integrasi API BreachDirectory dengan mekanisme **Smart Fallback** otomatis (menggunakan data *mock* jika limit API tercapai) untuk simulasi kebocoran data email.

### 🤖 AI Analyst Integration
Ditenagai oleh **Google Gemini 3 Flash**, aplikasi ini menyediakan asisten AI untuk menganalisis CVE secara mendalam, memberikan rekomendasi mitigasi, dan memetakan dampak risiko terhadap regulasi di Indonesia.

### 📊 Professional Framework Explorer
Navigasi interaktif untuk berbagai standar kepatuhan dengan layout 3-kolom yang efisien:
- **Nasional:** SEOJK 29/2022, Panduan Resiliensi OJK, PBI 02/2024 (PADG 32).
- **Internasional:** COBIT 2019, NIST CSF 2.0, ISO 27001:2022.
- **Analogi "Street Smart":** Setiap kontrol dilengkapi dengan analogi bahasa santai namun profesional.

### 🔗 Compliance Synergy (Cross-Mapping)
- **Visual Cross-Mapping:** Visualisasi keterkaitan antar framework (ISO, NIST, PBI, dll) menggunakan **D3.js Force-Directed Graph**.
- **Comparison Engine:** Perbandingan *side-by-side* antar regulasi untuk menemukan *overlapping controls* secara otomatis.
- **Gap Analysis Tool:** Identifikasi celah kepatuhan dengan memetakan status implementasi terhadap standar target.

---

## 📈 Change Log
Lacak pembaruan fitur dan perbaikan bug secara real-time di [CHANGELOG.md](./CHANGELOG.md).

---

## 🛠️ Tech Stack & Arsitektur

### Frontend
- **Vue 3 (Composition API):** Framework reaktif untuk performa tinggi.
- **ApexCharts:** Visualisasi distribusi ancaman dan pilar regulasi.
- **Custom CSS:** Estetika *Glassmorphism* dan *High-Density Layout*.

### Backend (Serverless)
- **Vercel Serverless Functions:** Proxy API untuk bypass CORS dan perlindungan API Key.
- **Smart Rate Limiting:** Mekanisme perlindungan *client-side* untuk mencegah *spamming* API.
- **Vercel Routing:** Konfigurasi `vercel.json` untuk mendukung *Single Page Application (SPA) refresh stability*.

---

## 📂 Struktur Project

```bash
sibukpatuh-vue/
├── api/                # Serverless Functions (Breach, CISA, Gemini, OTX)
├── public/data/        # Framework JSON Datasets (COBIT, PBI, ISO, dll)
├── src/
│   ├── components/     # UI Components
│   ├── views/          # Framework & Intelligence Pages
│   ├── services/       # API Services Logic
│   └── assets/css/     # Core Design System
├── vercel.json         # Deployment & Routing Config
└── README.md           # Documentation
```

---

## 🔧 Pengembangan Lokal

1. Clone repositori:
   ```bash
   git clone https://github.com/lintanggraha/sibukpatuh.git
   ```
2. Install dependensi:
   ```bash
   npm install
   ```
3. Setup Environment Variables (`.env`):
   ```env
   VITE_GEMINI_API_KEY=your_key_here
   RAPIDAPI_KEY=your_key_here
   ```
4. Jalankan server dev:
   ```bash
   npm run dev
   ```

---

## 🌐 Deployment

Aplikasi ini dioptimalkan untuk deployment di **Vercel** dengan dukungan otomatis untuk *rewrite rules* agar fitur *refresh* (F5) pada rute aplikasi tetap berjalan mulus (mencegah Error 404).

---
**SibukPatuh** — *Biar update kepatuhan gak ribet.*
