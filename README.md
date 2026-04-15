# SibukPatuh - Sistem Informasi Biar Update Kepatuhan

## ⚠️ Disclaimer Penting

**Konten edukatif — bukan pengganti standar resmi:**

- Data untuk **ISO 27001:2022** dan **COBIT 2019** yang tersedia di repositori ini adalah **ringkasan edukatif** berdasarkan interpretasi kami, **bukan** teks resmi dari ISO atau ISACA.
- Untuk standar asli dan lisensi resmi, silakan kunjungi:
  - ISO 27001: [https://www.iso.org/isoiec-27001-information-security.html](https://www.iso.org/isoiec-27001-information-security.html) atau [BSN](https://www.bsn.go.id)
  - COBIT 2019: [https://www.isaca.org/resources/cobit](https://www.isaca.org/resources/cobit)
- Repositori ini dibuat untuk tujuan **edukasi dan pembelajaran**, bukan untuk penggunaan komersial yang mengklaim sebagai pengganti standar resmi.
- Penggunaan konten ini sepenuhnya menjadi tanggung jawab pengguna.

---

## 📖 Tentang Aplikasi

**SibukPatuh** adalah platform eksplorasi edukatif untuk mempelajari dan membedah berbagai *framework* regulasi teknologi informasi — baik nasional maupun internasional.

Aplikasi ini dibuat murni sebagai sarana pembelajaran interaktif untuk membantu para praktisi IT, analis, dan mahasiswa dalam:

- **Mempelajari anatomi** dari berbagai *framework* keamanan (SEOJK, PBI, ISO, NIST, COBIT)
- **Menyimulasikan studi kasus** terhadap pemahaman kontrol dan regulasi yang berlaku
- **Menelusuri referensi edukasi** secara cepat untuk memahami hubungan antar komponen *framework*
- **Menjelajahi konsep pemetaan (*cross-mapping*)** antar *framework* sebagai bahan studi komparatif

> **Catatan Penting:**
> Konten di dalam SibukPatuh disusun murni sebagai **referensi pembelajaran dan edukasi** untuk memperdalam pemahaman, bukan sebagai panduan resmi yang absolut. Untuk keperluan audit, sertifikasi, atau pengambilan keputusan hukum, pengguna diwajibkan untuk selalu merujuk pada dokumen standar resmi yang berlaku yang diterbitkan oleh masing-masing institusi (BSN, OJK, BI, ISO, ISACA).

## 📋 Fitur

- **Dropdown Nasional**: SEOJK 29/03/2022, Panduan Resiliensi OJK, PBI 02/2024
- **Dropdown Internasional**: ISO 27001, NIST CSF 2.0, COBIT 2019
- Search & filter real-time di setiap framework
- Responsive design (mobile-friendly)
- Navigasi tanpa reload (client-side routing)

## � Build & Deploy

```bash
npm run build
```

Hasil build ada di folder `dist/`. Tinggal upload ke hosting manapun.

## 🛠️ Tech Stack

- **Vue.js 3** — UI Framework
- **Vue Router 4** — Client-side routing
- **Pinia** — State management
- **Vite** — Build tool
- **Bootstrap 5** — CSS framework
- **Font Awesome 6** — Icons (CDN)

## 📁 Struktur Project

```
sibukpatuh-vue/
├── src/
│   ├── components/
│   │   └── App.vue           # Main layout + navigation
│   ├── views/
│   │   ├── FrameworkIndex.vue
│   │   ├── Iso27001.vue
│   │   ├── Nist.vue
│   │   ├── Cobit.vue
│   │   ├── Seojk.vue
│   │   ├── Resilience.vue
│   │   └── Pbi.vue
│   ├── router/index.js       # Routes config
│   └── main.js               # Entry point
├── data/                     # JSON data files
└── dist/                     # Production build
```

## 🔧 Tambah Framework Baru

1. Buat file JSON di folder `data/`
2. Buat Vue component di `src/views/`
3. Tambah route di `src/router/index.js`
4. Tambah link di `src/components/App.vue`

## 🌐 Deployment

Upload isi folder `dist/` ke:

- **GitHub Pages**
- **Netlify** (drag & drop)
- **Vercel**
- **Nginx/Apache** (pastikan `try_files $uri $uri/ /index.html`)

## ⚡ Performance

- **Bundle size**: ~100KB JS + ~235KB CSS (gzipped)
- **Load time**: < 1 detik di 3G
- **Navigasi**: Instant (no backend latency)

---

**SibukPatuh** — Biar update kepatusan gak ribet.
