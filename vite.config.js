import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      vue(),
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
        }
      }
    },
    base: '/',
    build: {
      chunkSizeWarningLimit: 1600,
    }
  };
});
