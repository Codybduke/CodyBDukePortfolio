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
const BASE_URL = '/prototypes/oxp-mobile';

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

const MARKER = '/prototypes/oxp-mobile';

// The prototype bundle is ~4 MB, so there is a visible gap between the document
// loading and React mounting. Without this the frame is pure white during that
// gap, which reads as a broken/blank screen. We tint the pre-mount document to
// the simulator panel colour and show a "Loading…" line that React replaces
// when it renders into #root. This covers the standalone page, the deck iframe,
// and the case-study embed (the embed turns the tint transparent on load).
const PROTO_FALLBACK_STYLE =
  '<style id="oxp-proto-fallback">html,body{background:#e7ecef}' +
  '.oxp-proto-loading{display:flex;flex:1;align-items:center;justify-content:center;width:100%;' +
  'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
  'color:#8a8a82;font-size:0.9rem;letter-spacing:0.04em}</style>';
const PROTO_ROOT_WITH_LOADING =
  '<div id="root"><div class="oxp-proto-loading">Loading the prototype…</div></div>';

function addPrototypeFallback(html) {
  let next = html;
  if (!next.includes('oxp-proto-fallback')) {
    next = next.replace('</head>', `${PROTO_FALLBACK_STYLE}</head>`);
  }
  if (next.includes('<div id="root"></div>')) {
    next = next.replace('<div id="root"></div>', PROTO_ROOT_WITH_LOADING);
  }
  return next;
}

/**
 * Expo bakes root-absolute URLs (`/prototypes/oxp-mobile/...`). Those 404 when
 * Astro serves the site from a base path such as `/CodyBDukePortfolio`.
 * Asset URLs become relative to the prototype document, and the router base is
 * taken from the live pathname so either site root works.
 */
export function rewritePrototypePaths(outDir) {
  for (const name of ['index.html', '404.html']) {
    const file = path.join(outDir, name);
    if (!fs.existsSync(file)) continue;
    const html = addPrototypeFallback(
      fs
        .readFileSync(file, 'utf8')
        .replaceAll(`href="${MARKER}/`, 'href="')
        .replaceAll(`src="${MARKER}/`, 'src="'),
    );
    fs.writeFileSync(file, html);
  }

  const jsDir = path.join(outDir, '_expo/static/js/web');
  if (!fs.existsSync(jsDir)) return;
  for (const name of fs.readdirSync(jsDir)) {
    if (!name.endsWith('.js')) continue;
    const file = path.join(jsDir, name);
    let js = fs.readFileSync(file, 'utf8');
    const stripFrom = `function o(t,a="${MARKER}"){return a?t.replace(/^\\/+/g,'/').replace(new RegExp(\`^\\\\/?\${(0,n.default)(a)}\`,'g'),''):t}`;
    const stripTo = `function o(t,a="${MARKER}"){const e=String(t).replace(/^\\/+/g,"/");const m="${MARKER}";const i=e.indexOf(m);return i<0?e:(e.slice(i+m.length)||"/")}`;
    const appendFrom = `e.appendBaseUrl=function(t,n="${MARKER}"){if(n)return\`/\${n.replace(/^\\/+/,'').replace(/\\/$/,'')}\${t}\`;return t}`;
    const appendTo = `e.appendBaseUrl=function(t,n="${MARKER}"){const p=typeof location<"u"?location.pathname:"";const m="${MARKER}";const i=p.indexOf(m);let b=i<0?String(n):p.slice(0,i+m.length);while(b.startsWith("/"))b=b.slice(1);while(b.endsWith("/"))b=b.slice(0,-1);return"/"+b+t}`;
    if (!js.includes(stripFrom) || !js.includes(appendFrom)) {
      throw new Error(`Prototype bundle ${name} no longer matches the base-path rewrite. Re-export and update rewritePrototypePaths.`);
    }
    js = js.replaceAll(`"${MARKER}/`, '"').replaceAll(stripFrom, stripTo).replaceAll(appendFrom, appendTo);
    fs.writeFileSync(file, js);
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  if (!fs.existsSync(APP_JSON)) {
    throw new Error(`Prototype not found at ${PROTO}`);
  }

  const original = fs.readFileSync(APP_JSON, 'utf8');
  const config = JSON.parse(original);
  config.expo.web = { ...config.expo.web, output: 'single' };
  config.expo.experiments = { ...config.expo.experiments, baseUrl: BASE_URL };
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
  rewritePrototypePaths(OUT);

  console.log('copied →', OUT);
  } finally {
    fs.writeFileSync(APP_JSON, original);
  }
}
