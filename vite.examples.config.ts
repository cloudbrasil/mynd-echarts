import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  root: resolve(__dirname, 'examples'),
  resolve: {
    alias: {
      '@lib': resolve(__dirname, './lib'),
      '@': resolve(__dirname, './examples')
    }
  },
  build: {
    outDir: resolve(__dirname, 'dist-examples'),
    emptyOutDir: true
  },
  server: {
    port: 3001,
    open: true
  }
})