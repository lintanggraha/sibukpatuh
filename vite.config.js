import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

// ... (copyDataFiles remains same)

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      vue(),
      copyDataFiles()
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
      '@': resolve(__dirname, 'src')
    }
  },
  base: '/'
});
