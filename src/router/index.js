import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/FrameworkIndex.vue')
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('../views/AboutView.vue')
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

export default router;
