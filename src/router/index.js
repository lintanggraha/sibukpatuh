import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/FrameworkIndex.vue'),
        meta: {
            title: 'SibukPatuh - Referensi Edukatif Kepatuhan Siber dan Tata Kelola TI',
            description: 'Ruang belajar framework, regulasi, dan praktik kepatuhan keamanan siber untuk praktisi Indonesia. Mencakup ISO 27001, NIST CSF, COBIT 2019, SEOJK, PBI, UU PDP, dan OWASP.',
            keywords: 'kepatuhan siber, cybersecurity compliance, ISO 27001, NIST CSF, COBIT 2019, SEOJK, PBI, UU PDP, OWASP, GRC Indonesia'
        }
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('../views/AboutView.vue'),
        meta: {
            title: 'Tentang SibukPatuh - Metodologi dan Pengelola',
            description: 'Profil, tujuan, metodologi editorial, dan disclaimer edukatif SibukPatuh — platform referensi kepatuhan siber berbahasa Indonesia.',
            keywords: 'tentang sibukpatuh, platform kepatuhan siber, edukasi cybersecurity Indonesia'
        }
    },
    {
        path: '/privacy-policy',
        name: 'privacy_policy',
        component: () => import('../views/PrivacyPolicy.vue'),
        meta: {
            title: 'Kebijakan Privasi SibukPatuh',
            description: 'Kebijakan privasi, cookie, analytics, iklan, dan layanan pihak ketiga di SibukPatuh.',
            keywords: 'kebijakan privasi sibukpatuh, privacy policy'
        }
    },
    {
        path: '/contact',
        name: 'contact',
        component: () => import('../views/ContactView.vue'),
        meta: {
            title: 'Kontak SibukPatuh - Hubungi Pengelola',
            description: 'Hubungi pengelola SibukPatuh untuk koreksi konten, pertanyaan privasi, kolaborasi, dan laporan bug.',
            keywords: 'kontak sibukpatuh, hubungi sibukpatuh'
        }
    },
    {
        path: '/frameworks/iso27001',
        name: 'iso27001',
        component: () => import('../views/Iso27001.vue'),
        meta: {
            title: 'ISO 27001:2022 - Ringkasan Edukatif Kontrol Keamanan Informasi | SibukPatuh',
            description: 'Pelajari 93 kontrol keamanan informasi ISO 27001:2022 dalam ringkasan edukatif berbahasa Indonesia. Mencakup Annex A, domain kontrol, dan konteks implementasi.',
            keywords: 'ISO 27001, ISO 27001:2022, keamanan informasi, information security, Annex A, kontrol keamanan, sertifikasi ISO'
        }
    },
    {
        path: '/frameworks/iso37001',
        name: 'iso37001',
        component: () => import('../views/Iso37001.vue'),
        meta: {
            title: 'ISO 37001:2016 - Ringkasan Edukatif Sistem Manajemen Anti-Penyuapan | SibukPatuh',
            description: 'Pelajari ISO 37001:2016 sebagai ringkasan edukatif sistem manajemen anti-penyuapan. Mencakup konteks, kepemimpinan, due diligence, kontrol operasional, pelaporan, audit, dan peningkatan.',
            keywords: 'ISO 37001, ISO 37001:2016, anti penyuapan, anti bribery management system, ABMS, compliance, GRC, integritas perusahaan'
        }
    },
    {
        path: '/frameworks/nist-csf-2',
        name: 'nist',
        component: () => import('../views/Nist.vue'),
        meta: {
            title: 'NIST CSF 2.0 - Panduan Belajar Framework Keamanan Siber | SibukPatuh',
            description: 'Eksplorasi 106 subkategori NIST Cybersecurity Framework 2.0 dalam bahasa Indonesia. Dari fungsi GOVERN hingga RECOVER untuk praktisi keamanan siber.',
            keywords: 'NIST CSF 2.0, NIST Cybersecurity Framework, framework keamanan siber, GOVERN IDENTIFY PROTECT DETECT RESPOND RECOVER'
        }
    },
    {
        path: '/frameworks/cobit-2019',
        name: 'cobit',
        component: () => import('../views/Cobit.vue'),
        meta: {
            title: 'COBIT 2019 - Ringkasan Tata Kelola Teknologi Informasi | SibukPatuh',
            description: 'Ringkasan edukatif 40 objektif COBIT 2019 untuk tata kelola TI perusahaan. Mencakup prinsip, design factor, dan core model dalam bahasa Indonesia.',
            keywords: 'COBIT 2019, governance enterprise IT, tata kelola TI, ISACA, GRC, IT governance Indonesia'
        }
    },
    {
        path: '/frameworks/seojk',
        name: 'seojk',
        component: () => import('../views/Seojk.vue'),
        meta: {
            title: 'SEOJK 29/2022 - Ringkasan Ketahanan Siber Perbankan OJK | SibukPatuh',
            description: 'Peta kewajiban ketahanan siber perbankan berdasarkan SEOJK 29/2022. Panduan membaca lampiran penilaian dan kewajiban pelaporan OJK.',
            keywords: 'SEOJK 29 2022, ketahanan siber perbankan, OJK cybersecurity, regulasi bank Indonesia, keamanan siber perbankan'
        }
    },
    {
        path: '/frameworks/padk-1-2026',
        name: 'padk',
        component: () => import('../views/Padk.vue'),
        meta: {
            title: 'PADK 1 Tahun 2026 - Penyelenggaraan Teknologi Informasi Bank Umum | SibukPatuh',
            description: 'Peta kewajiban, pelaporan, perizinan, dan format PADK 1 Tahun 2026 tentang penyelenggaraan teknologi informasi oleh bank umum. Panduan praktis regulasi OJK terbaru.',
            keywords: 'PADK 1 2026, penyelenggaraan TI bank umum, OJK 2026, regulasi teknologi informasi bank, perizinan TI perbankan'
        }
    },
    {
        path: '/frameworks/padg-32-2025',
        name: 'padg',
        component: () => import('../views/Padg.vue'),
        meta: {
            title: 'PADG 32/2025 - Pengaturan Industri Sistem Pembayaran BI | SibukPatuh',
            description: 'Ringkasan kewajiban penyelenggaraan sistem pembayaran, produk, inovasi digital, pricing, dan pengawasan berdasarkan PADG 32/2025 Bank Indonesia.',
            keywords: 'PADG 32 2025, sistem pembayaran Bank Indonesia, regulasi fintech BI, penyelenggaraan sistem pembayaran'
        }
    },
    {
        path: '/frameworks/panduan-resiliensi-ojk',
        name: 'resilience',
        component: () => import('../views/Resilience.vue'),
        meta: {
            title: 'Panduan Resiliensi Digital OJK - Ketahanan Operasional Perbankan | SibukPatuh',
            description: 'Referensi tematik panduan resiliensi digital OJK untuk memahami ketahanan operasional dan digital tata kelola perbankan Indonesia.',
            keywords: 'resiliensi digital OJK, ketahanan operasional bank, digital resilience, OJK panduan resiliensi'
        }
    },
    {
        path: '/frameworks/pbi-02-2024',
        name: 'pbi',
        component: () => import('../views/Pbi.vue'),
        meta: {
            title: 'PBI 02/2024 - Keamanan Siber dan Ketahanan Operasional Bank Indonesia | SibukPatuh',
            description: 'Ringkasan kewajiban Keamanan dan Ketahanan Siber (KKS), pelaporan insiden, dan panduan membaca regulasi Bank Indonesia PBI 02/2024.',
            keywords: 'PBI 02 2024, keamanan siber Bank Indonesia, KKS, ketahanan siber BI, pelaporan insiden siber'
        }
    },
    {
        path: '/frameworks/owasp-top-10',
        name: 'owasp_top10',
        component: () => import('../views/OwaspTop10.vue'),
        meta: {
            title: 'OWASP Top 10 2025 - 10 Kerentanan Keamanan Web Paling Kritis | SibukPatuh',
            description: 'Eksplorasi 10 kerentanan keamanan aplikasi web paling kritis versi OWASP 2025 dalam bahasa Indonesia. Lengkap dengan analogi penyerang dan panduan mitigasi.',
            keywords: 'OWASP Top 10, kerentanan web, web application security, SQL injection, XSS, keamanan aplikasi web Indonesia'
        }
    },
    {
        path: '/frameworks/owasp-asvs',
        name: 'owasp_asvs',
        component: () => import('../views/OwaspAsvs.vue'),
        meta: {
            title: 'OWASP ASVS 5.0.0 - Standar Verifikasi Keamanan Aplikasi | SibukPatuh',
            description: 'Referensi OWASP Application Security Verification Standard (ASVS) 5.0.0 dalam bahasa Indonesia. Kriteria pengujian kontrol keamanan berdasarkan level risiko aplikasi.',
            keywords: 'OWASP ASVS, application security verification, standar keamanan aplikasi, penetration testing, security testing'
        }
    },
    {
        path: '/intel/intelligence-center',
        name: 'intelligence_center',
        component: () => import('../views/IntelligenceCenter.vue'),
        meta: {
            title: 'Intelligence Center - OSINT & Threat Intelligence Hub | SibukPatuh',
            description: 'Pusat intelijen ancaman siber real-time. Monitor threat feed OTX AlienVault, CISA KEV, breach checker, dan analisis CVE dengan AI untuk praktisi keamanan siber Indonesia.',
            keywords: 'threat intelligence, OSINT, OTX AlienVault, CISA KEV, breach checker, CVE analysis, ancaman siber'
        }
    },
    {
        path: '/frameworks/uu-pdp-27-2022',
        name: 'pdp',
        component: () => import('../views/Pdp.vue'),
        meta: {
            title: 'UU PDP 27/2022 - Undang-Undang Perlindungan Data Pribadi Indonesia | SibukPatuh',
            description: 'Ringkasan edukatif Undang-Undang Perlindungan Data Pribadi (UU PDP) No. 27 Tahun 2022. Hak subjek data, kewajiban pengendali, dan sanksi pelanggaran.',
            keywords: 'UU PDP, UU PDP 27 2022, perlindungan data pribadi, PDPA Indonesia, data privacy Indonesia, hak data pribadi'
        }
    },
    {
        path: '/cross-mapping',
        name: 'cross_mapping',
        component: () => import('../views/CrossMapping.vue'),
        meta: {
            title: 'Cross-Mapping Framework - Visualisasi Keterkaitan Regulasi Siber | SibukPatuh',
            description: 'Visualisasi interaktif keterkaitan antar framework kepatuhan (ISO 27001, NIST CSF, PBI, SEOJK) menggunakan D3.js. Temukan overlapping controls antar regulasi.',
            keywords: 'cross mapping compliance, framework comparison, overlapping controls, pemetaan regulasi, ISO NIST mapping'
        }
    },
    {
        path: '/framework-analysis',
        name: 'framework_analysis',
        component: () => import('../views/FrameworkAnalysis.vue'),
        meta: {
            title: 'Framework Analysis - Perbandingan Side-by-Side Regulasi Siber | SibukPatuh',
            description: 'Bandingkan berbagai framework dan regulasi keamanan siber secara side-by-side. Temukan persamaan dan perbedaan kontrol antara ISO, NIST, COBIT, dan regulasi OJK.',
            keywords: 'perbandingan framework kepatuhan, framework analysis, compliance comparison, ISO vs NIST, COBIT vs ISO'
        }
    },
    {
        path: '/checklist-tools',
        name: 'checklist_tools',
        component: () => import('../views/ChecklistTools.vue'),
        meta: {
            title: 'Checklist Tools - Alat Evaluasi Gap Analysis Kepatuhan Siber | SibukPatuh',
            description: 'Alat evaluasi gap analysis mandiri untuk mengukur tingkat kepatuhan siber organisasi Anda. Export laporan ke PDF/Word. Mencakup ISO, NIST, OJK, dan regulasi BI.',
            keywords: 'gap analysis kepatuhan, checklist compliance, evaluasi kepatuhan siber, audit tools, compliance checklist Indonesia'
        }
    },
    {
        path: '/compliance-simulator',
        name: 'simulator',
        component: () => import('../views/Simulator.vue'),
        meta: {
            title: 'Compliance Simulator - What-If Analysis Kepatuhan Siber | SibukPatuh',
            description: 'Simulasikan skenario infrastruktur dan operasional untuk melihat gap kepatuhan secara instan. Analisis "What-If" untuk pengambilan keputusan implementasi kontrol.',
            keywords: 'compliance simulator, what-if analysis, skenario kepatuhan, simulasi keamanan siber, GRC tools'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
];

// Use import.meta.env.BASE_URL to sync with Vite's base config
// This ensures router works correctly in both root and subdirectory deployments
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      }

      // Keep route changes instant. Smooth scrolling can feel sluggish on
      // content-heavy pages and forces extra work on Firefox/mobile browsers.
      return { top: 0 };
    }
});

router.afterEach((to) => {
    const defaultTitle = 'SibukPatuh - Referensi Edukatif Kepatuhan Siber dan Tata Kelola TI';
    const defaultDescription = 'SibukPatuh adalah referensi edukatif berbahasa Indonesia untuk mempelajari ISO 27001, NIST CSF, COBIT 2019, SEOJK, PBI, UU PDP, OWASP, dan kepatuhan keamanan siber.';
    const defaultKeywords = 'kepatuhan siber, cybersecurity Indonesia, ISO 27001, NIST CSF, COBIT 2019, regulasi OJK, regulasi BI, GRC Indonesia';

    const title = to.meta.title || defaultTitle;
    const description = to.meta.description || defaultDescription;
    const keywords = to.meta.keywords || defaultKeywords;
    const canonicalUrl = `https://sibukpatuh.net${to.path === '/' ? '/' : to.path}`;

    document.title = title;

    const upsertMeta = (selector, attributes) => {
        let element = document.head.querySelector(selector);
        if (!element) {
            element = document.createElement('meta');
            document.head.appendChild(element);
        }
        Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    };

    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="keywords"]', { name: 'keywords', content: keywords });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
});

export default router;
