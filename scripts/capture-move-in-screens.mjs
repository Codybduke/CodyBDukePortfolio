/**
 * Capture Move-In Scanner screens from OXP-Mobile-Product-Prototype (Expo web).
 *
 * Demo settings: Full, Eli+ Enabled, Daily Briefing 2.0, iOS, Mobile,
 * Phone Sim On, Brand preview 3.0. Network is Online unless noted.
 *
 * Prerequisites: Expo web running at EXPO_URL (default http://127.0.0.1:8081)
 * Usage: node scripts/capture-move-in-screens.mjs
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  applyDemoSettings,
  composeHero,
  goHome,
  shot as shotTo,
} from './oxp-capture-shared.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '../public/work/move-in-scanner');

fs.mkdirSync(OUT, { recursive: true });

const shot = (page, name, opts) => shotTo(page, OUT, name, opts);

async function clickText(page, text, exact = false) {
  await page.getByText(text, { exact }).first().click({ timeout: 15_000 });
}

async function openMoveIn(page) {
  const moveIn = page.getByText('Move-In', { exact: true }).first();
  await moveIn.scrollIntoViewIfNeeded();
  await moveIn.click({ timeout: 15_000 });
  await page.waitForSelector('text=Upcoming Move-ins', { timeout: 30_000 });
}

/** Full-page goto /move-in 404s after confirm on the static export; reset via home. */
async function returnToRoster(page, network = 'Online') {
  await goHome(page);
  await applyDemoSettings(page, network);
  await revealMoveInQuickAction(page);
  await openMoveIn(page);
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

async function dismissKeyboard(page) {
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  try {
    await page.getByText('Upcoming Move-ins', { exact: true }).first().click({ timeout: 2_000 });
  } catch {
    // already dismissed
  }
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

  await revealMoveInQuickAction(page);
  await shot(page, '04-home-move-in-quick-action');

  await openMoveIn(page);
  await shot(page, '01-roster');

  const search = page.getByPlaceholder(/Search name, unit, or email/i);

  await search.click();
  await search.fill('Foster');
  await page.waitForTimeout(400);
  await dismissKeyboard(page);
  await shot(page, '05-search-name');
  await search.fill('');
  await page.waitForTimeout(200);

  await search.click();
  await search.fill('204');
  await page.waitForTimeout(400);
  await dismissKeyboard(page);
  await shot(page, '05-search-unit-roommates');
  await search.fill('');
  await page.waitForTimeout(250);

  await clickText(page, 'Foster, Riley');
  await page.waitForSelector('text=Move-in Checklist', { timeout: 15_000 });
  await shot(page, '02-summary');
  await page.getByText('Move in', { exact: true }).click();
  await page.waitForSelector('text=Confirm Move-in', { timeout: 15_000 });
  await shot(page, '03-confirm');
  await page.getByText('Confirm Move-in', { exact: true }).last().click();
  await page.waitForSelector('text=Move-in confirmed', { timeout: 15_000 });
  await shot(page, '12-success-toast', { animations: 'allow' });

  await returnToRoster(page, 'Online');

  await clickText(page, 'Diaz, Morgan');
  await page.waitForSelector('text=Optional items still open', { timeout: 15_000 });
  await shot(page, '06-summary-optional-open');
  await page.getByText('Move in and create escalation', { exact: true }).click();
  await page.waitForSelector('text=Confirm and create escalation', { timeout: 15_000 });
  await shot(page, '07-confirm-escalation');

  await returnToRoster(page, 'Online');
  await clickText(page, 'Baker, Jamie');
  await page.waitForSelector('text=Required checklist items still need attention', { timeout: 15_000 });
  await shot(page, '08-summary-required-blocked');

  await returnToRoster(page, 'Online');
  await clickText(page, 'Anderson, Taylor');
  await page.waitForTimeout(800);
  await shot(page, '09-summary-hard-blocked');

  await goHome(page);
  await applyDemoSettings(page, 'Offline');
  await page.waitForTimeout(500);
  await shot(page, '13-home-offline');

  await revealMoveInQuickAction(page);
  await openMoveIn(page);
  await page.waitForSelector('text=Offline', { timeout: 15_000 });
  await shot(page, '10-roster-offline');

  await clickText(page, 'Foster, Riley');
  await page.waitForSelector('text=Move-in Checklist', { timeout: 15_000 });
  await shot(page, '11-summary-offline');

  await goHome(page);
  await applyDemoSettings(page, 'Online');

  await browser.close();
  await composeHero(OUT, ['01-roster.png', '02-summary.png', '03-confirm.png']);
  console.log('done →', OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
