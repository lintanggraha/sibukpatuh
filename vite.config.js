import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { vitePrerenderPlugin } from 'vite-prerender-plugin';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      vue(),
      vitePrerenderPlugin({
        renderTarget: '#app',
        prerenderScript: fileURLToPath(new URL('./src/prerender.js', import.meta.url)),
        additionalPrerenderRoutes: new Set([
          '/about',
          '/privacy-policy',
          '/contact',
          '/frameworks/iso27001',
          '/frameworks/iso37001',
          '/frameworks/nist-csf-2',
          '/frameworks/cobit-2019',
          '/frameworks/seojk',
          '/frameworks/padk-1-2026',
          '/frameworks/padg-32-2025',
          '/frameworks/panduan-resiliensi-ojk',
          '/frameworks/pbi-02-2024',
          '/frameworks/owasp-top-10',
          '/frameworks/owasp-asvs',
          '/intel/intelligence-center',
          '/frameworks/uu-pdp-27-2022',
          '/cross-mapping',
          '/framework-analysis',
          '/checklist-tools',
          '/compliance-simulator',
        ]),
      }),
    ],
    resolve: {
      alias: {
        'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js',
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        '/api/otx': { target: 'http://localhost:3000', changeOrigin: true },
        '/api/breach': { target: 'http://localhost:3000', changeOrigin: true },
        '/api/cisa': { target: 'http://localhost:3000', changeOrigin: true },
        '/api/gemini': { target: 'http://localhost:3000', changeOrigin: true }
      }
    },
    base: '/',
    build: {
      // Target browser modern — menghilangkan polyfill legacy yang tidak perlu
      target: 'es2020',
      // Aktifkan minifikasi CSS
      cssMinify: true,
      // Naikkan limit warning agar tidak noise, tapi kita sudah split manual
      chunkSizeWarningLimit: 800,
      // Nonaktifkan modulepreload otomatis untuk vendor berat
      // agar tidak di-inject ke semua halaman prerendered
      modulePreload: {
        // Hanya preload chunk yang benar-benar dibutuhkan halaman tersebut
        // Vendor berat (charts, excel, pdf) akan dimuat on-demand
        resolveDependencies: (filename, deps) => {
          // Jangan preload vendor berat di semua halaman
          const heavyVendors = ['vendor-charts', 'vendor-excel', 'vendor-pdf', 'vendor-html2canvas'];
          if (heavyVendors.some(v => filename.includes(v))) return [];
          return deps.filter(dep => !heavyVendors.some(v => dep.includes(v)));
        }
      },
      rollupOptions: {
        output: {
          // Manual chunk splitting: pisahkan vendor berat ke chunk terpisah
          // agar halaman yang tidak butuh library tersebut tidak memuatnya
          manualChunks(id) {
            // jsPDF + autotable + ExcelJS — hanya dibutuhkan saat export
            if (id.includes('jspdf') || id.includes('jsPDF') || id.includes('autotable')) {
              return 'vendor-pdf';
            }
            if (id.includes('exceljs')) {
              return 'vendor-excel';
            }
            // ApexCharts — hanya dibutuhkan di IntelligenceCenter
            if (id.includes('apexcharts') || id.includes('vue3-apexcharts')) {
              return 'vendor-charts';
            }
            // html2canvas — hanya dibutuhkan saat screenshot/export
            if (id.includes('html2canvas')) {
              return 'vendor-html2canvas';
            }
            // DOMPurify — kecil tapi bisa dipisah
            if (id.includes('dompurify') || id.includes('purify')) {
              return 'vendor-dompurify';
            }
            // Vue core + router + pinia — selalu dibutuhkan, gabung jadi satu vendor
            if (id.includes('node_modules/vue/') ||
                id.includes('node_modules/@vue/') ||
                id.includes('node_modules/vue-router') ||
                id.includes('node_modules/pinia')) {
              return 'vendor-vue';
            }
            // Bootstrap CSS sudah di-inline, skip
            if (id.includes('bootstrap')) {
              return 'vendor-bootstrap';
            }
          }
        }
      }
    }
  };
});
