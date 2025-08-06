#!/usr/bin/env node

import { build } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Build configuration for Vitest UI
const buildConfig = {
  root: resolve(__dirname, 'node_modules/@vitest/ui'),
  base: '/',
  build: {
    outDir: resolve(__dirname, 'dist-vitest-ui'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'node_modules/@vitest/ui/dist/index.html')
      }
    }
  }
};

async function buildVitestUI() {
  try {
    console.log('Building Vitest UI for deployment...');
    
    // Check if @vitest/ui exists
    const vitestUiPath = resolve(__dirname, 'node_modules/@vitest/ui/dist');
    if (!fs.existsSync(vitestUiPath)) {
      console.error('@vitest/ui is not installed or built. Installing...');
      process.exit(1);
    }

    // Copy the entire @vitest/ui dist folder
    const targetDir = resolve(__dirname, 'dist-vitest-ui');
    
    // Create target directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Copy all files from @vitest/ui dist
    copyRecursiveSync(vitestUiPath, targetDir);

    // Create a vitest config file in dist for runtime
    const vitestConfig = `
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});
`;

    fs.writeFileSync(resolve(targetDir, 'vitest.config.js'), vitestConfig);

    console.log('Vitest UI built successfully in dist-vitest-ui/');
  } catch (error) {
    console.error('Error building Vitest UI:', error);
    process.exit(1);
  }
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        resolve(src, childItemName),
        resolve(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

buildVitestUI();