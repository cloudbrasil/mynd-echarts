#!/usr/bin/env node
/*
  Simple smoke script using Puppeteer.
  Prereqs:
    - npm i -D puppeteer
    - Run the examples app (e.g., `npm run dev` or preview)
    - BASE_URL env var points to the running examples (default http://localhost:4173)

  Usage:
    BASE_URL=http://localhost:4173 node scripts/smoke/smoke.js
*/

const puppeteer = require('puppeteer');

async function run() {
  const baseUrl = process.env.BASE_URL || 'http://localhost:4173';
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const errors = [];
  page.on('pageerror', (err) => errors.push({ type: 'pageerror', message: String(err) }));
  page.on('error', (err) => errors.push({ type: 'error', message: String(err) }));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push({ type: 'console', message: msg.text() });
  });

  // Helper to navigate and wait for chart container
  async function visit(path, waitMs = 2000) {
    const url = `${baseUrl}${path}`;
    console.log(`[smoke] Visiting ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    // Wait a bit for ECharts to initialize
    await page.waitForTimeout(waitMs);
  }

  // 1) AI chat-like page
  await visit('/ai-chat-like', 2500);
  // Take a screenshot
  await page.screenshot({ path: 'smoke_ai-chat-like.png', fullPage: true });

  // 2) Stress page (let it run ~4s)
  await visit('/stress', 1500);
  // Click Start Stress
  try {
    await page.click('text=Start Stress');
  } catch {}
  await page.waitForTimeout(4000);
  await page.screenshot({ path: 'smoke_stress.png', fullPage: true });

  // Summarize
  if (errors.length) {
    console.error('[smoke] Detected errors:');
    for (const e of errors) console.error(e);
    await browser.close();
    process.exit(1);
  } else {
    console.log('[smoke] Completed with no page/console errors.');
    await browser.close();
  }
}

run().catch((err) => {
  console.error('[smoke] Fatal error:', err);
  process.exit(1);
});
