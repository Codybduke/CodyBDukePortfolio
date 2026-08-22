/**
 * Shared Playwright helpers for capturing OXP Expo-web screens into the
 * portfolio. Demo settings match the case-study capture spec:
 * Full, Eli+ Enabled, Daily Briefing 2.0, iOS, Mobile, Phone Sim On,
 * Brand preview 3.0. Network defaults to Online.
 */
import sharp from 'sharp';
import path from 'node:path';

export const EXPO_URL = process.env.EXPO_URL || 'http://127.0.0.1:8081';

/** iPhone 15 outer shell in DeviceFrame (screen 390×844 + 14pt bezel). */
const FRAME_W = 418;
const FRAME_H = 872;

/** iPhone 15 shell in OXP DeviceFrame: outerRadius 58 on frame width 418. */
const OUTER_RADIUS_RATIO = 58 / 418;

export async function waitForApp(page) {
  await page.waitForSelector('text=Quick Actions', { timeout: 120_000 });
}

export async function frameBox(page) {
  const box = await page.evaluate(
    ({ frameW, frameH }) => {
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
      const phones = candidates.filter(
        (c) =>
          c.width > 280 &&
          c.width < 520 &&
          c.height > 580 &&
          c.height < 1100 &&
          c.radius >= 30,
      );
      phones.sort((a, b) => {
        const da = Math.abs(a.width - frameW) + Math.abs(a.height - frameH);
        const db = Math.abs(b.width - frameW) + Math.abs(b.height - frameH);
        return da - db || b.width * b.height - a.width * a.height;
      });
      return phones[0] || null;
    },
    { frameW: FRAME_W, frameH: FRAME_H },
  );
  if (!box) throw new Error('Could not locate device frame');
  return {
    x: Math.max(0, box.x),
    y: Math.max(0, box.y),
    width: box.width,
    height: box.height,
    radius: box.radius,
  };
}

async function maskRoundedDevice(filePath, cssWidth) {
  const img = sharp(filePath).ensureAlpha();
  const { width, height } = await img.metadata();
  if (!width || !height) throw new Error(`No dimensions for ${filePath}`);
  const radius = Math.round(cssWidth * OUTER_RADIUS_RATIO * (width / cssWidth));
  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <rect width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="#fff"/>
    </svg>`,
  );
  const masked = await img.composite([{ input: svg, blend: 'dest-in' }]).png().toBuffer();
  await sharp(masked).png().toFile(filePath);
}

export async function shot(page, outDir, name, { animations = 'disabled' } = {}) {
  const clip = await frameBox(page);
  const file = path.join(outDir, `${name}.png`);
  await page.screenshot({ path: file, clip, animations });
  if (clip.radius >= 30) {
    await maskRoundedDevice(file, clip.width);
  }
  console.log('saved', name, `${Math.round(clip.width)}x${Math.round(clip.height)}`);
  return file;
}

async function setSwitcher(page, heading, option) {
  const clicked = await page.evaluate(
    ({ heading, option }) => {
      const labels = [...document.querySelectorAll('*')].filter(
        (el) => el.childNodes.length === 1 && el.textContent?.trim() === heading,
      );
      for (const label of labels) {
        let root = label.parentElement;
        for (let i = 0; i < 8 && root; i++) {
          const opt = [...root.querySelectorAll('*')].find(
            (el) => el.childNodes.length === 1 && el.textContent?.trim() === option,
          );
          if (opt) {
            opt.click();
            return true;
          }
          root = root.parentElement;
        }
      }
      return false;
    },
    { heading, option },
  );
  if (!clicked) console.warn(`Could not set ${heading} → ${option}`);
  await page.waitForTimeout(400);
}

export async function applyDemoSettings(page, network = 'Online') {
  await setSwitcher(page, 'Version', 'Full');
  await setSwitcher(page, 'Eli+', 'Enabled');
  await setSwitcher(page, 'Daily Briefing', '2.0');
  await setSwitcher(page, 'Device', 'iOS');
  await setSwitcher(page, 'Size', 'Mobile');
  await setSwitcher(page, 'Phone Sim', 'On');
  await setSwitcher(page, 'Network', network);
  await setSwitcher(page, 'Brand preview', '3.0');
}

export async function goHome(page) {
  await page.goto(`${EXPO_URL}/`, { waitUntil: 'networkidle', timeout: 120_000 });
  await waitForApp(page);
}

export async function composeHero(outDir, files) {
  const abs = files.map((f) => path.join(outDir, f));
  const images = await Promise.all(abs.map((f) => sharp(f).resize({ height: 1600 }).toBuffer()));
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
    .toFile(path.join(outDir, '00-hero-three-up.png'));
  console.log('saved 00-hero-three-up.png (flush, transparent field)');
}
