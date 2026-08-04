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
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        // Proxy for local development to match Vercel serverless functions
        '/api/otx': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
        '/api/breach': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
        '/api/cisa': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
        '/api/gemini': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        }
      }
    },
    base: '/',
    build: {
      chunkSizeWarningLimit: 1600,
    }
  };
});
