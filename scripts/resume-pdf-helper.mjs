/**
 * Prints resume PDFs for dev servers that cannot launch Chromium themselves.
 * Cursor's sandbox crashes the browser on startup, so those servers post here.
 */
import http from 'node:http';

import { RESUME_PDF_HELPER_PORT, closeBrowser, renderResumePdf } from './resume-pdf.mjs';

const port = Number(process.env.RESUME_PDF_HELPER_PORT ?? RESUME_PDF_HELPER_PORT);

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function localOrigin(value) {
  const url = new URL(value);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
  if (!['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) return null;
  return url.origin;
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    res.statusCode = 200;
    res.end('ok');
    return;
  }

  if (req.method !== 'POST' || req.url !== '/render') {
    res.statusCode = 404;
    res.end();
    return;
  }

  try {
    const args = JSON.parse(await readBody(req));
    const origin = localOrigin(args?.origin);
    if (!origin) throw new Error('Refusing to render that origin.');
    if (typeof args.base !== 'string' || !args.base.startsWith('/')) {
      throw new Error('Refusing that base path.');
    }
    if (typeof args.id !== 'string' || !/^[a-z0-9-]+$/.test(args.id)) {
      throw new Error('Unknown resume.');
    }
    if (!['resume', 'single', 'letter'].includes(args.doc)) {
      throw new Error('Unknown document.');
    }

    const pdf = await renderResumePdf({ origin, base: args.base, id: args.id, doc: args.doc });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', String(pdf.length));
    res.end(pdf);
  } catch (error) {
    console.error(error);
    if (res.headersSent) return;
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(error instanceof Error ? error.message : 'Could not create the PDF.');
  }
});

server.on('error', (error) => {
  if (error?.code === 'EADDRINUSE') process.exit(0);
  throw error;
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Resume PDF helper listening on ${port}`);
});

const shutdown = () => {
  server.close();
  void closeBrowser().finally(() => process.exit(0));
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
