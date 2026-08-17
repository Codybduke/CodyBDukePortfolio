/**
 * Export OXP-Mobile-Product-Prototype as a static SPA and copy it into
 * public/prototypes/oxp-mobile for the portfolio embed.
 *
 * Prerequisites: sibling repo at ../OXP-Mobile-Product-Prototype with
 * node_modules installed.
 *
 * Usage: node scripts/export-oxp-prototype.mjs
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROTO = path.resolve(__dirname, '../../OXP-Mobile-Product-Prototype');
const APP_JSON = path.join(PROTO, 'app.json');
const DIST = path.join(PROTO, 'dist');
const OUT = path.resolve(__dirname, '../public/prototypes/oxp-mobile');
const BASE_URL = '/CodyBDukePortfolio/prototypes/oxp-mobile';

if (!fs.existsSync(APP_JSON)) {
  throw new Error(`Prototype not found at ${PROTO}`);
}

const original = fs.readFileSync(APP_JSON, 'utf8');
const config = JSON.parse(original);
config.expo.web = { ...config.expo.web, output: 'single' };
config.expo.experiments = { ...config.expo.experiments, baseUrl: BASE_URL };

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: PROTO,
    stdio: 'inherit',
    env: process.env,
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed`);
  }
}

const expoBin = path.join(PROTO, 'node_modules/.bin/expo');

try {
  fs.writeFileSync(APP_JSON, `${JSON.stringify(config, null, 2)}\n`);
  run(expoBin, ['export', '--platform', 'web']);

  if (!fs.existsSync(path.join(DIST, 'index.html'))) {
    throw new Error('expo export did not produce dist/index.html');
  }

  fs.rmSync(OUT, { recursive: true, force: true });
  fs.cpSync(DIST, OUT, { recursive: true });

  // Same HTML at 404.html is a local fallback; GitHub Pages uses the site 404.
  fs.copyFileSync(path.join(OUT, 'index.html'), path.join(OUT, '404.html'));

  console.log('copied →', OUT);
} finally {
  fs.writeFileSync(APP_JSON, original);
}
