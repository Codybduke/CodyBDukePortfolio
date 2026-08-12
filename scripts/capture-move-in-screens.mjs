/**
 * Capture Move-In Scanner screens from OXP-Mobile-Product-Prototype (Expo web).
 * Crops to the on-page device frame for portfolio-ready assets.
 *
 * Prerequisites: Expo web running at EXPO_URL (default http://127.0.0.1:8081)
 * Usage: node scripts/capture-move-in-screens.mjs
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '../public/work/move-in-scanner');
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

/** Prefer Original briefing so Quick Actions (incl. Move-In) fit on first paint. */
async function setDailyBriefingOriginal(page) {
  try {
    await setSegment(page, 'Original');
  } catch {
    console.warn('Could not set Daily Briefing → Original; continuing');
  }
}

async function openMoveIn(page) {
  const moveIn = page.getByText('Move-In', { exact: true }).first();
  await moveIn.scrollIntoViewIfNeeded();
  await moveIn.click({ timeout: 15_000 });
  await page.waitForSelector('text=Upcoming Move-ins', { timeout: 30_000 });
}

/** Scroll inside the phone frame until Move-In is visible in Quick Actions. */
async function revealMoveInQuickAction(page) {
  await page.evaluate(() => {
    const target = [...document.querySelectorAll('*')].find(
      (el) => el.childNodes.length === 1 && el.textContent?.trim() === 'Move-In',
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
        node.scrollTop += tr.top - nr.top - nr.height * 0.35;
        return;
      }
      node = node.parentElement;
    }
    target.scrollIntoView({ block: 'center', inline: 'nearest' });
  });
  await page.waitForTimeout(400);
}

async function composeHero() {
  const files = ['01-roster.png', '02-summary.png', '03-confirm.png'].map((f) =>
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

  // 04 — home with Move-In Quick Action visible
  await revealMoveInQuickAction(page);
  await shot(page, '04-home-move-in-quick-action');

  await openMoveIn(page);
  await shot(page, '01-roster');

  // Search results — unit 204 roommates
  const search = page.getByPlaceholder(/Search name, unit, or email/i);
  await search.click();
  await search.fill('204');
  await page.waitForTimeout(400);
  // Dismiss keyboard so results aren't covered
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  await shot(page, '05-search-unit-roommates');
  await search.fill('');
  await page.waitForTimeout(250);

  // Ready happy path — Riley Foster
  await clickText(page, 'Foster, Riley');
  await page.waitForSelector('text=Move-in Checklist', { timeout: 15_000 });
  await shot(page, '02-summary');
  await page.getByText('Move in', { exact: true }).click();
  await page.waitForSelector('text=Confirm Move-in', { timeout: 15_000 });
  await shot(page, '03-confirm');

  await page.goto(`${BASE}/move-in`, { waitUntil: 'networkidle' });
  await page.waitForSelector('text=Upcoming Move-ins', { timeout: 30_000 });

  // Optional-open — Morgan Diaz
  await clickText(page, 'Diaz, Morgan');
  await page.waitForSelector('text=Optional items still open', { timeout: 15_000 });
  await shot(page, '06-summary-optional-open');
  await page.getByText('Move in and create escalation', { exact: true }).click();
  await page.waitForSelector('text=Confirm and create escalation', { timeout: 15_000 });
  await shot(page, '07-confirm-escalation');

  // Required-blocked — Jamie Baker
  await page.goto(`${BASE}/move-in`, { waitUntil: 'networkidle' });
  await page.waitForSelector('text=Upcoming Move-ins', { timeout: 30_000 });
  await clickText(page, 'Baker, Jamie');
  await page.waitForSelector('text=Required checklist items still need attention', { timeout: 15_000 });
  await shot(page, '08-summary-required-blocked');

  // Hard blocked — Taylor Anderson
  await page.goto(`${BASE}/move-in`, { waitUntil: 'networkidle' });
  await page.waitForSelector('text=Upcoming Move-ins', { timeout: 30_000 });
  await clickText(page, 'Anderson, Taylor');
  await page.waitForTimeout(800);
  await shot(page, '09-summary-hard-blocked');

  // Offline chip on roster + summary
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await waitForApp(page);
  await setDailyBriefingOriginal(page);
  await setSegment(page, 'Offline');
  await revealMoveInQuickAction(page);
  await openMoveIn(page);
  await page.waitForSelector('text=Offline', { timeout: 15_000 });
  await shot(page, '10-roster-offline');

  await clickText(page, 'Foster, Riley');
  await page.waitForSelector('text=Move-in Checklist', { timeout: 15_000 });
  await shot(page, '11-summary-offline');

  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await waitForApp(page);
  await setSegment(page, 'Online');

  await browser.close();
  await composeHero();
  console.log('done →', OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
