import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/FrameworkIndex.vue'),
        meta: {
            title: 'SibukPatuh - Referensi Edukatif Kepatuhan Siber dan Tata Kelola TI',
            description: 'Ruang belajar framework, regulasi, dan praktik kepatuhan keamanan siber untuk praktisi Indonesia.'
        }
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('../views/AboutView.vue'),
        meta: {
            title: 'Tentang SibukPatuh - Metodologi dan Pengelola',
            description: 'Profil, tujuan, metodologi editorial, dan disclaimer edukatif SibukPatuh.'
        }
    },
    {
        path: '/privacy-policy',
        name: 'privacy_policy',
        component: () => import('../views/PrivacyPolicy.vue'),
        meta: {
            title: 'Kebijakan Privasi SibukPatuh',
            description: 'Kebijakan privasi, cookie, analytics, iklan, dan layanan pihak ketiga di SibukPatuh.'
        }
    },
    {
        path: '/contact',
        name: 'contact',
        component: () => import('../views/ContactView.vue'),
        meta: {
            title: 'Kontak SibukPatuh',
            description: 'Hubungi pengelola SibukPatuh untuk koreksi konten, pertanyaan privasi, dan laporan bug.'
        }
    },
    {
        path: '/frameworks/iso27001',
        name: 'iso27001',
        component: () => import('../views/Iso27001.vue')
    },
    {
        path: '/frameworks/nist-csf-2',
        name: 'nist',
        component: () => import('../views/Nist.vue')
    },
    {
        path: '/frameworks/cobit-2019',
        name: 'cobit',
        component: () => import('../views/Cobit.vue')
    },
    {
        path: '/frameworks/seojk',
        name: 'seojk',
        component: () => import('../views/Seojk.vue')
    },
    {
        path: '/frameworks/padk-1-2026',
        name: 'padk',
        component: () => import('../views/Padk.vue'),
        meta: {
            title: 'PADK 1 Tahun 2026 - Penyelenggaraan TI oleh Bank Umum',
            description: 'Peta kewajiban, pelaporan, perizinan, dan format PADK 1 Tahun 2026 tentang penyelenggaraan teknologi informasi oleh bank umum.'
        }
    },
    {
        path: '/frameworks/padg-32-2025',
        name: 'padg',
        component: () => import('../views/Padg.vue')
    },
    {
        path: '/frameworks/panduan-resiliensi-ojk',
        name: 'resilience',
        component: () => import('../views/Resilience.vue')
    },
    {
        path: '/frameworks/pbi-02-2024',
        name: 'pbi',
        component: () => import('../views/Pbi.vue')
    },
    {
        path: '/frameworks/owasp-top-10',
        name: 'owasp_top10',
        component: () => import('../views/OwaspTop10.vue')
    },
    {
        path: '/frameworks/owasp-asvs',
        name: 'owasp_asvs',
        component: () => import('../views/OwaspAsvs.vue')
    },
    {
        path: '/intel/intelligence-center',
        name: 'intelligence_center',
        component: () => import('../views/IntelligenceCenter.vue')
    },
    {
        path: '/frameworks/uu-pdp-27-2022',
        name: 'pdp',
        component: () => import('../views/Pdp.vue')
    },
    {
        path: '/cross-mapping',
        name: 'cross_mapping',
        component: () => import('../views/CrossMapping.vue')
    },
    {
        path: '/framework-analysis',
        name: 'framework_analysis',
        component: () => import('../views/FrameworkAnalysis.vue')
    },
    {
        path: '/checklist-tools',
        name: 'checklist_tools',
        component: () => import('../views/ChecklistTools.vue')
    },
    {
        path: '/compliance-simulator',
        name: 'simulator',
        component: () => import('../views/Simulator.vue')
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
    const defaultDescription = 'SibukPatuh adalah referensi edukatif berbahasa Indonesia untuk mempelajari framework, regulasi, dan kepatuhan keamanan siber.';
    const title = to.meta.title || defaultTitle;
    const description = to.meta.description || defaultDescription;
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
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
});

export default router;
