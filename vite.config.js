import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      vue()
    ],
    server: {
      proxy: {
        '/api/misp': {
          target: env.VITE_MISP_URL || 'https://your-misp-instance.com',
          changeOrigin: true,
          secure: false, 
          rewrite: (path) => path.replace(/^\/api\/misp/, ''),
          headers: {
            'Authorization': env.VITE_MISP_KEY
          }
        }
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    base: '/'
  };
});
