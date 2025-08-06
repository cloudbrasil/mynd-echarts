#!/usr/bin/env node

import { build } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = process.cwd(); // Use current working directory

console.log('Starting demo build...');
console.log('Root directory:', rootDir);
console.log('Working directory:', process.cwd());
console.log('VERCEL:', process.env.VERCEL ? 'true' : 'false');
console.log('VERCEL_URL:', process.env.VERCEL_URL || 'not set');

async function buildDemo() {
  try {
    const startTime = Date.now();
    
    await build({
      configFile: resolve(rootDir, 'vite.demo.config.ts'),
      root: rootDir,
      logLevel: 'info'
    });
    
    const buildTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✓ Demo build completed in ${buildTime}s`);
    
    // Verify output directory exists
    const outputDir = resolve(rootDir, 'dist-demo');
    if (fs.existsSync(outputDir)) {
      console.log('Output directory exists:', outputDir);
      const files = fs.readdirSync(outputDir);
      console.log(`Files in dist-demo: ${files.length} files`);
      console.log('Main files:', files.filter(f => !f.startsWith('.')).join(', '));
      
      // List root directory contents on Vercel
      if (process.env.VERCEL) {
        console.log('\nRoot directory contents:');
        const rootFiles = fs.readdirSync(rootDir);
        rootFiles.forEach(file => {
          const stat = fs.statSync(resolve(rootDir, file));
          console.log(`  ${file}${stat.isDirectory() ? '/' : ''}`);
        });
      }
    } else {
      console.error('ERROR: dist-demo directory not found at:', outputDir);
      process.exit(1);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildDemo();