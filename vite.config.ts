import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig(({ mode, command }) => {
  const isLibBuild = mode === 'lib' || (command === 'build' && !process.env.DEMO_BUILD)
  
  return {
    plugins: [
      vue(),
      false
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@lib': resolve(__dirname, './lib')
      }
    },
    build: isLibBuild ? {
      lib: {
        entry: resolve(__dirname, 'lib/index.ts'),
        name: 'MyndEcharts',
        fileName: (format) => {
          if (format === 'es') return 'mynd-echarts.js'
          if (format === 'cjs') return 'mynd-echarts.cjs'
          return `mynd-echarts.${format}.js`
        },
        formats: ['es', 'cjs', 'umd']
      },
      rollupOptions: {
        external: ['vue', 'echarts', 'echarts/core', 'echarts/charts', 'echarts/components', 'echarts/renderers'],
        output: [
          {
            format: 'es',
            preserveModules: false,
            exports: 'named',
            entryFileNames: 'mynd-echarts.js'
          },
          {
            format: 'cjs',
            preserveModules: false,
            exports: 'named',
            entryFileNames: 'mynd-echarts.cjs'
          },
          {
            format: 'umd',
            name: 'MyndEcharts',
            exports: 'named',
            globals: {
              vue: 'Vue',
              echarts: 'echarts',
              'echarts/core': 'echarts',
              'echarts/charts': 'echarts',
              'echarts/components': 'echarts',
              'echarts/renderers': 'echarts'
            },
            entryFileNames: 'mynd-echarts.umd.js'
          }
        ]
      },
      sourcemap: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: false,
          drop_debugger: true
        }
      }
    } : {
      // Demo build configuration
      outDir: 'dist-demo',
      sourcemap: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html')
        }
      }
    },
    server: {
      port: 3000,
      open: true
    },
    test: {
      environment: 'jsdom',
      globals: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        include: ['lib/**/*.{ts,vue}'],
        exclude: [
          'node_modules/',
          'tests/',
          '**/*.d.ts',
          '**/*.spec.ts',
          '**/*.test.ts',
          'vite.config.ts',
          'vitest.config.ts',
          'examples/**',
          'lib/index.ts',
          'lib/locales/index.ts',
          'lib/types/index.ts'
        ],
        thresholds: {
          lines: 90,
          functions: 90,
          branches: 85,
          statements: 90
        }
      }
    }
  }
})