import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@lib': resolve(__dirname, './lib')
    }
  },
  build: {
    outDir: 'dist-demo',
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          'echarts-core': ['echarts/core'],
          'echarts-charts': ['echarts/charts'],
          'echarts-components': ['echarts/components'],
          'echarts-renderers': ['echarts/renderers'],
          'vendor': ['vue', 'vue-router']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})