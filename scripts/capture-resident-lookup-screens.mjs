/**
 * Capture Mobile Strategy + Resident Lookup screens from
 * OXP-Mobile-Product-Prototype (Expo web). Crops to the on-page device frame.
 *
 * Prerequisites: Expo web running at EXPO_URL (default http://127.0.0.1:8081)
 * Usage: node scripts/capture-resident-lookup-screens.mjs
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '../public/work/mobile-strategy-resident-lookup');
const BASE = process.env.EXPO_URL || 'http://127.0.0.1:8081';

fs.mkdirSync(OUT, { recursive: true });

async function waitForApp(page) {
  await page.waitForSelector('text=Quick Actions', { timeout: 120_000 });
}

async function frameBox(page) {
  const box = await page.evaluate(() => {
    const candidates = [...document.querySelectorAll('div')].map((el) => {
      const r = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return {
        x: r.x,
        y: r.y,
        width: r.width,
        height: r.height,
        radius: parseFloat(style.borderRadius) || 0,
      };
    });
    const frames = candidates
      .filter(
        (c) =>
          c.width > 280 &&
          c.width < 520 &&
          c.height > 580 &&
          c.height < 1100 &&
          c.radius >= 30,
      )
      .sort((a, b) => b.height * b.width - a.height * a.width);
    return frames[0] || null;
  });
  if (!box) throw new Error('Could not locate device frame');
  return {
    x: Math.max(0, box.x),
    y: Math.max(0, box.y),
    width: box.width,
    height: box.height,
  };
}

/** iPhone 15 shell in OXP DeviceFrame: outerRadius 58 on frame width 418. */
const OUTER_RADIUS_RATIO = 58 / 418;

async function maskRoundedDevice(filePath) {
  const img = sharp(filePath).ensureAlpha();
  const { width, height } = await img.metadata();
  if (!width || !height) throw new Error(`No dimensions for ${filePath}`);
  const radius = Math.round(width * OUTER_RADIUS_RATIO);
  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <rect width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="#fff"/>
    </svg>`,
  );
  const masked = await img.composite([{ input: svg, blend: 'dest-in' }]).png().toBuffer();
  await sharp(masked).png().toFile(filePath);
}

async function shot(page, name) {
  const clip = await frameBox(page);
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, clip, animations: 'disabled' });
  await maskRoundedDevice(file);
  console.log('saved', name, `${Math.round(clip.width)}x${Math.round(clip.height)}`);
  return file;
}

async function clickText(page, text, exact = false) {
  await page.getByText(text, { exact }).first().click({ timeout: 15_000 });
}

async function goHome(page) {
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 120_000 });
  await waitForApp(page);
}

async function setSegment(page, label) {
  const control = page.getByText(label, { exact: true });
  const count = await control.count();
  if (count === 0) throw new Error(`Segment "${label}" not found`);
  await control.last().click();
  await page.waitForTimeout(350);
}

async function setDailyBriefingOriginal(page) {
  try {
    await setSegment(page, 'Original');
  } catch {
    console.warn('Could not set Daily Briefing → Original; continuing');
  }
}

/** Scroll inside the phone frame until Quick Actions is in view. */
async function revealQuickActions(page) {
  await page.evaluate(() => {
    const target = [...document.querySelectorAll('*')].find(
      (el) => el.childNodes.length === 1 && el.textContent?.trim() === 'Quick Actions',
    );
    if (!target) return;
    let node = target;
    while (node && node !== document.body) {
      const style = getComputedStyle(node);
      const oy = style.overflowY;
      if (
        (oy === 'auto' || oy === 'scroll' || oy === 'overlay') &&
        node.scrollHeight > node.clientHeight + 20
      ) {
        const tr = target.getBoundingClientRect();
        const nr = node.getBoundingClientRect();
        node.scrollTop += tr.top - nr.top - 16;
        return;
      }
      node = node.parentElement;
    }
    target.scrollIntoView({ block: 'start', inline: 'nearest' });
  });
  await page.waitForTimeout(400);
}

async function openResidents(page) {
  await page.goto(`${BASE}/leads`, { waitUntil: 'networkidle', timeout: 60_000 });
  await page.waitForSelector('text=Recent searches', { timeout: 30_000 });
  try {
    await page.getByText('Residents', { exact: true }).first().click({ timeout: 5_000 });
  } catch {
    // already on Residents
  }
  await page.waitForTimeout(300);
}

async function dismissKeyboard(page) {
  await page.getByText('Residents', { exact: true }).first().click();
  await page
    .locator('[data-testid="system-keyboard-preview"]')
    .waitFor({ state: 'hidden', timeout: 5_000 })
    .catch(() => {});
  await page.waitForTimeout(200);
}

async function composeHero() {
  const files = ['01-command-center.png', '05-search-marcus.png', '06-profile-hub.png'].map((f) =>
    path.join(OUT, f),
  );
  const images = await Promise.all(files.map((f) => sharp(f).resize({ height: 1600 }).toBuffer()));
  const metas = await Promise.all(images.map((buf) => sharp(buf).metadata()));
  const gap = 48;
  const widths = metas.map((m) => m.width || 0);
  const height = Math.max(...metas.map((m) => m.height || 0));
  const width = widths.reduce((a, b) => a + b, 0) + gap * (widths.length - 1);

  let left = 0;
  const composites = images.map((input, i) => {
    const item = {
      input,
      left,
      top: Math.round((height - (metas[i].height || 0)) / 2),
    };
    left += widths[i] + gap;
    return item;
  });

  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composites)
    .png()
    .toFile(path.join(OUT, '00-hero-three-up.png'));
  console.log('saved 00-hero-three-up.png (flush, transparent field)');
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1100 },
    deviceScaleFactor: 2,
  });

  await goHome(page);
  await setDailyBriefingOriginal(page);
  try {
    await setSegment(page, 'Online');
  } catch {
    // already online
  }
  try {
    await setSegment(page, 'iOS');
  } catch {
    // already iOS
  }
  try {
    await setSegment(page, 'Mobile');
  } catch {
    // already mobile
  }

  await shot(page, '01-command-center');

  await revealQuickActions(page);
  await shot(page, '02-quick-actions');

  await openResidents(page);
  await shot(page, '03-residents-idle');

  const search = page.getByPlaceholder(/Search residents/i);
  await search.click();
  await search.fill('EWX-4429');
  await page.waitForSelector('text=No residents found', { timeout: 10_000 });
  await dismissKeyboard(page);
  await shot(page, '04-search-plate-miss');

  await search.fill('Marcus');
  await page.waitForTimeout(400);
  await dismissKeyboard(page);
  await shot(page, '05-search-marcus');

  await clickText(page, 'Marcus Johnson');
  await page.waitForSelector('text=Financials', { timeout: 15_000 });
  await shot(page, '06-profile-hub');

  await page.goto(`${BASE}/resident/financials/res-marcus`, {
    waitUntil: 'networkidle',
    timeout: 60_000,
  });
  await page.waitForSelector('text=Financials', { timeout: 15_000 });
  await page.waitForTimeout(400);
  await shot(page, '07-financials');

  await page.goto(`${BASE}/resident/vehicles-pets/res-marcus`, {
    waitUntil: 'networkidle',
    timeout: 60_000,
  });
  await page.waitForSelector('text=Vehicles & Pets', { timeout: 15_000 });
  await page.waitForTimeout(400);
  await shot(page, '08-vehicles-pets');

  await browser.close();
  await composeHero();
  console.log('done →', OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
