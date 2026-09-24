/**
 * Capture Bulk Move-in Smart Upload frames from the hosted prototype.
 *
 * Source: https://prototype-sandbox-sage.vercel.app/csv-to-move-in-agent
 *
 * Usage: node scripts/capture-csv-move-in-screens.mjs
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '../public/work/csv-move-in-agent');
const URL = 'https://prototype-sandbox-sage.vercel.app/csv-to-move-in-agent';

fs.mkdirSync(OUT, { recursive: true });
const samplePath = '/tmp/move-in-sample.csv';
fs.writeFileSync(samplePath, 'Name,Unit\nJ. Smith,A-102\n');

async function overlayClip(page) {
  return page.evaluate(() => {
    const header = [...document.querySelectorAll('*')].find(
      (el) => el.childNodes.length === 1 && el.textContent?.trim() === 'Bulk Move-In',
    );
    let node = header;
    let best = null;
    while (node && node !== document.body) {
      const r = node.getBoundingClientRect();
      if (r.width > 900 && r.height > 500) best = r;
      node = node.parentElement;
    }
    if (!best) return null;
    return { x: best.x, y: best.y, width: best.width, height: best.height };
  });
}

async function shotClip(page, name, clip) {
  const dest = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: dest, clip });
  const meta = await sharp(dest).metadata();
  console.log('wrote', name, `${meta.width}x${meta.height}`);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
await page.locator('input[type="password"]').fill('Entrata 123');
await page.getByRole('button', { name: 'Enter' }).click();
await page.getByRole('button', { name: /Enter Prototype/ }).click();
await page.getByRole('button', { name: 'Tools: Bulk Move-In' }).click();
await page.getByRole('button', { name: 'Upload Spreadsheet' }).click();
await page.locator('input[type="file"]').first().setInputFiles(samplePath);
await page.getByRole('button', { name: 'Analyze with ELI' }).click();
await page.getByRole('button', { name: 'Resolve J. Smith' }).waitFor({ timeout: 20000 });
await page.waitForTimeout(400);

const clip = await overlayClip(page);
if (!clip) throw new Error('Could not find Bulk Move-In overlay');
await shotClip(page, '01-preflight', clip);

await page.getByLabel('30 Have Follow-Up Tasks').click();
await page.waitForTimeout(500);
await shotClip(page, '02-follow-up', await overlayClip(page));

await page.getByLabel('23 Unresolved — will be skipped').click();
await page.waitForTimeout(400);
await page.getByRole('button', { name: 'Resolve J. Smith' }).click();
await page.waitForTimeout(400);

const modal = await page.evaluate(() => {
  const title = [...document.querySelectorAll('*')].find(
    (el) => el.childNodes.length && /^Resolve:\s*J\.\s*Smith/i.test(el.textContent || ''),
  );
  let node = title;
  let best = title;
  while (node && node !== document.body) {
    const r = node.getBoundingClientRect();
    if (r.width > 380 && r.height > 220 && r.width < 760) best = node;
    node = node.parentElement;
  }
  const r = best.getBoundingClientRect();
  const pad = 8;
  return {
    x: Math.max(0, r.x - pad),
    y: Math.max(0, r.y - pad),
    width: r.width + pad * 2,
    height: r.height + pad * 2,
  };
});
await shotClip(page, '03-resolve', modal);

for (const leftover of ['03-resolve-full.png']) {
  const p = path.join(OUT, leftover);
  if (fs.existsSync(p)) fs.unlinkSync(p);
}

await browser.close();
