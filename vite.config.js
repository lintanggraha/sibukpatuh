import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

// Plugin untuk copy data files setelah build
function copyDataFiles() {
  return {
    name: 'copy-data-files',
    closeBundle() {
      const dataDir = resolve(__dirname, 'data');
      const distDataDir = resolve(__dirname, 'dist/data');
      
      if (existsSync(dataDir)) {
        if (!existsSync(distDataDir)) {
          mkdirSync(distDataDir, { recursive: true });
        }
        
        const files = [
          'nist_csf.json',
          'cobit_2019.json',
          'seojk_requirements.json',
          'seojk_resilience_guidance.json',
          'pbi_022024_requirements.json',
          'pbi_022024_references.json'
        ];
        
        files.forEach(file => {
          const src = resolve(dataDir, file);
          const dest = resolve(distDataDir, file);
          if (existsSync(src)) {
            copyFileSync(src, dest);
            console.log(`✓ Copied ${file}`);
          }
        });
      }
    }
  };
}

export default defineConfig({
  plugins: [
    vue(),
    copyDataFiles()
  ],
  server: {
    proxy: {}
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  base: '/'
});
