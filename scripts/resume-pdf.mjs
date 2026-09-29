/**
 * Render the resume page to a letter PDF with the print stylesheet.
 * Dev serves these on click. `export-resume-pdfs.mjs` writes them at build time.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('..', import.meta.url));
const playwrightCli = path.join(root, 'node_modules/playwright/cli.js');

const watchFiles = [
  'src/data/applications.ts',
  'src/components/resume/ResumeKit.tsx',
  'src/styles/documents.css',
  'src/layouts/PrintDocument.astro',
];

const pdfPathPattern = /^\/documents\/cody-duke-([a-z0-9-]+)-(resume|letter)\.pdf$/;

let browserPromise;
const pdfCache = new Map();
let cacheStamp = '';

export function resumePdfFileName(id, doc) {
  return `cody-duke-${id}-${doc}.pdf`;
}

export function matchResumePdfPath(pathname) {
  const match = pathname.match(pdfPathPattern);
  if (!match) return null;
  return { id: match[1], doc: match[2] };
}

function sourceStamp() {
  return watchFiles
    .map((file) => {
      const full = path.join(root, file);
      return `${file}:${fs.statSync(full).mtimeMs}`;
    })
    .join('|');
}

function installPlaywright(command) {
  execFileSync(process.execPath, [playwrightCli, command, 'chromium'], {
    stdio: 'inherit',
    cwd: root,
  });
}

async function launchBrowser() {
  try {
    return await chromium.launch({ headless: true });
  } catch {
    console.warn('Playwright Chromium is missing. Installing it…');
    installPlaywright('install');
  }

  try {
    return await chromium.launch({ headless: true });
  } catch (error) {
    if (process.platform !== 'linux') throw error;
    console.warn('Installing Playwright system libraries…');
    installPlaywright('install-deps');
    return chromium.launch({ headless: true });
  }
}

export function getBrowser() {
  if (!browserPromise) browserPromise = launchBrowser();
  return browserPromise;
}

export async function closeBrowser() {
  if (!browserPromise) return;
  const pending = browserPromise;
  browserPromise = null;
  try {
    const browser = await pending;
    await browser.close();
  } catch {
    // Launch failed. Nothing to close.
  }
}

export async function renderResumePdf({ origin, base, id, doc }) {
  const browser = await getBrowser();
  const page = await browser.newPage({ viewport: { width: 1200, height: 1600 } });
  const prefix = base.endsWith('/') ? base.slice(0, -1) : base;
  const url = `${origin.replace(/\/$/, '')}${prefix}/resume/?c=${encodeURIComponent(id)}&d=${encodeURIComponent(doc)}`;

  try {
    await page.goto(url, { waitUntil: 'load', timeout: 60_000 });
    await page.waitForSelector('.doc-chrome[data-ready="true"]', {
      timeout: 30_000,
      state: 'attached',
    });
    await page.evaluate(async () => {
      await document.fonts.ready;
      document.querySelector('astro-dev-toolbar')?.remove();
    });

    const articleClass = doc === 'letter' ? 'article.letter' : 'article.resume';
    const article = page.locator(articleClass);
    if ((await article.count()) === 0) {
      throw new Error(`No ${doc} rendered for ${id}.`);
    }

    const pdf = await page.pdf({
      format: 'Letter',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });

    if (pdf.length < 1000) throw new Error('PDF render was empty.');
    return pdf;
  } finally {
    await page.close();
  }
}

export async function cachedResumePdf(args) {
  const stamp = sourceStamp();
  if (stamp !== cacheStamp) {
    cacheStamp = stamp;
    pdfCache.clear();
  }
  const key = `${args.id}:${args.doc}`;
  const hit = pdfCache.get(key);
  if (hit) return hit;

  const pdf = await renderResumePdf(args);
  if (cacheStamp === stamp) pdfCache.set(key, pdf);
  return pdf;
}

function requestPath(reqUrl, base) {
  const url = new URL(reqUrl ?? '/', 'http://localhost');
  let pathname = decodeURIComponent(url.pathname);
  const prefix = base.endsWith('/') ? base.slice(0, -1) : base;
  if (prefix && pathname.startsWith(prefix)) {
    pathname = pathname.slice(prefix.length) || '/';
  }
  return pathname;
}

export function resumePdfDevPlugin(base) {
  return {
    name: 'resume-pdf-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'GET') return next();
        const parsed = matchResumePdfPath(requestPath(req.url, base));
        if (!parsed) return next();

        const host = req.headers.host;
        if (!host) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.end('Could not create the PDF.');
          return;
        }

        const proto = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
        cachedResumePdf({ origin: `${proto}://${host}`, base, ...parsed })
          .then((pdf) => {
            const filename = resumePdfFileName(parsed.id, parsed.doc);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Length', String(pdf.length));
            res.setHeader('Cache-Control', 'no-store');
            res.end(pdf);
          })
          .catch((error) => {
            console.error(error);
            if (res.headersSent) return;
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end('Could not create the PDF.');
          });
      });

      const close = () => {
        void closeBrowser();
      };
      if (server.httpServer) server.httpServer.on('close', close);
      return () => {
        server.httpServer?.on('close', close);
      };
    },
  };
}
