import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  base: '/manage/',
  build: {
    assetsDir: '',
    emptyOutDir: false,
    outDir: resolve(root, '../../dist/manage'),
    rollupOptions: {
      input: resolve(root, 'index.html'),
      output: {
        assetFileNames: 'style.css',
        entryFileNames: 'app.js',
      },
    },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@manage': resolve(root, 'src'),
    },
  },
  root,
});
