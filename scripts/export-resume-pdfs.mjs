/**
 * Write one PDF per resume and cover letter into dist/documents/.
 * Runs after `astro build` so the live site can download a file directly.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { preview } from 'astro';
import { applications } from '../src/data/applications.ts';
import { closeBrowser, renderResumePdf, resumePdfFileName } from './resume-pdf.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const port = 4488;
const host = '127.0.0.1';

process.env.CI ??= '1';

const server = await preview({
  root,
  server: { port, host, open: false },
});

const origin = `http://${host}:${server.port}`;
const outDir = path.join(root, 'dist/documents');
fs.mkdirSync(outDir, { recursive: true });

try {
  for (const application of applications) {
    const docs = application.coverLetter ? ['resume', 'letter'] : ['resume'];
    for (const doc of docs) {
      const pdf = await renderResumePdf({
        origin,
        base: '/CodyBDukePortfolio',
        id: application.id,
        doc,
      });
      const file = path.join(outDir, resumePdfFileName(application.id, doc));
      fs.writeFileSync(file, pdf);
      console.log(`Wrote ${path.relative(root, file)} (${pdf.length} bytes)`);
    }
  }
} finally {
  await closeBrowser();
  await server.stop();
}
