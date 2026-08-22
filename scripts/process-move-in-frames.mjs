/**
 * Mask Move-In Scanner device screenshots to the phone outline (transparent corners)
 * and rebuild the hero three-up on a transparent field.
 *
 * Usage: node scripts/process-move-in-frames.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '../public/work/move-in-scanner');

/** iPhone 15 shell in OXP DeviceFrame: outerRadius 58 on frame width 418 (390 + 14*2). */
const OUTER_RADIUS_RATIO = 58 / 418;

const DEVICE_FILES = [
  '01-roster.png',
  '02-summary.png',
  '03-confirm.png',
  '04-home-move-in-quick-action.png',
  '05-search-name.png',
  '05-search-unit-roommates.png',
  '06-summary-optional-open.png',
  '07-confirm-escalation.png',
  '08-summary-required-blocked.png',
  '09-summary-hard-blocked.png',
  '10-roster-offline.png',
  '11-summary-offline.png',
  '12-success-toast.png',
  '13-home-offline.png',
];

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

  const masked = await img
    .composite([{ input: svg, blend: 'dest-in' }])
    .png()
    .toBuffer();

  await sharp(masked).png().toFile(filePath);
  console.log('masked', path.basename(filePath), `${width}x${height} r=${radius}`);
}

async function composeHero() {
  const files = ['01-roster.png', '02-summary.png', '03-confirm.png'].map((f) =>
    path.join(OUT, f),
  );
  const images = await Promise.all(files.map((f) => sharp(f).resize({ height: 1600 }).toBuffer()));
  const metas = await Promise.all(images.map((buf) => sharp(buf).metadata()));
  const gap = 48;
  const pad = 0;
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
  for (const name of DEVICE_FILES) {
    const file = path.join(OUT, name);
    if (!fs.existsSync(file)) {
      console.warn('skip missing', name);
      continue;
    }
    await maskRoundedDevice(file);
  }
  await composeHero();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
