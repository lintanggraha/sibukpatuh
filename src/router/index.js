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
    }
];

// Use import.meta.env.BASE_URL to sync with Vite's base config
// This ensures router works correctly in both root and subdirectory deployments
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
      // Scroll to top on route change
      return { top: 0, behavior: 'smooth' };
    }
});

export default router;
