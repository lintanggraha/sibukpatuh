import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/FrameworkIndex.vue')
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

const router = createRouter({
    history: createWebHistory('/'),
    routes
});

export default router;
