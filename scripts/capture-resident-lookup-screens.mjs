/**
 * Capture Mobile Strategy + Resident Lookup screens from
 * OXP-Mobile-Product-Prototype (Expo web).
 *
 * Demo settings: Full, Eli+ Enabled, Daily Briefing 2.0, iOS, Mobile,
 * Phone Sim On, Online, Brand preview 3.0.
 *
 * Prerequisites: Expo web running at EXPO_URL (default http://127.0.0.1:8081)
 * Usage: node scripts/capture-resident-lookup-screens.mjs
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  EXPO_URL,
  applyDemoSettings,
  composeHero,
  goHome,
  shot as shotTo,
} from './oxp-capture-shared.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '../public/work/mobile-strategy-resident-lookup');

fs.mkdirSync(OUT, { recursive: true });

const shot = (page, name, opts) => shotTo(page, OUT, name, opts);

async function clickText(page, text, exact = false) {
  await page.getByText(text, { exact }).first().click({ timeout: 15_000 });
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
  await page.goto(`${EXPO_URL}/leads`, { waitUntil: 'networkidle', timeout: 60_000 });
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

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1100 },
    deviceScaleFactor: 2,
  });

  await goHome(page);
  await applyDemoSettings(page, 'Online');

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

  await page.goto(`${EXPO_URL}/resident/financials/res-marcus`, {
    waitUntil: 'networkidle',
    timeout: 60_000,
  });
  await page.waitForSelector('text=Financials', { timeout: 15_000 });
  await page.waitForTimeout(400);
  await shot(page, '07-financials');

  await page.goto(`${EXPO_URL}/resident/vehicles-pets/res-marcus`, {
    waitUntil: 'networkidle',
    timeout: 60_000,
  });
  await page.waitForSelector('text=Vehicles & Pets', { timeout: 15_000 });
  await page.waitForTimeout(400);
  await shot(page, '08-vehicles-pets');

  await browser.close();
  await composeHero(OUT, ['01-command-center.png', '05-search-marcus.png', '06-profile-hub.png']);
  console.log('done →', OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
