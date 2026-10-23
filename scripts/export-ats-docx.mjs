/**
 * Export an ATS resume to .docx straight from the generator of record.
 *
 * The ATS Word file is produced by `buildAtsDocument` in `src/lib/ats-docx.ts`
 * (the same function the site calls client-side). This script bundles that
 * function and the resume data with esbuild, runs it in Node, and writes the
 * .docx. It keeps the committed snapshots in `Job Applications/...` in sync with
 * the code, and needs no dev server.
 *
 * Usage:
 *   node scripts/export-ats-docx.mjs [companyId] ["<output path>"]
 *
 * Defaults to the-one-res and the Job Applications/The One Res snapshot.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const root = fileURLToPath(new URL('..', import.meta.url));
const companyId = process.argv[2] ?? 'the-one-res';
const outArg =
  process.argv[3] ??
  path.join(root, 'Job Applications/The One Res/Cody Duke The One Res ATS Resume.docx');
const outPath = path.isAbsolute(outArg) ? outArg : path.join(root, outArg);

const posix = (p) => p.replace(/\\/g, '/');
const entry = `
export { Packer } from 'docx';
export { buildAtsDocument } from '${posix(path.join(root, 'src/lib/ats-docx.ts'))}';
export { getAtsResume, atsDownloadName } from '${posix(path.join(root, 'src/data/ats-resume.ts'))}';
`;

const result = await build({
  stdin: { contents: entry, resolveDir: root, loader: 'ts' },
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
  logLevel: 'silent',
});

const tmp = path.join(os.tmpdir(), `ats-bundle-${Date.now()}.mjs`);
fs.writeFileSync(tmp, result.outputFiles[0].text);
try {
  const mod = await import(pathToFileURL(tmp).href);
  const resume = mod.getAtsResume(companyId);
  const doc = mod.buildAtsDocument(resume);
  const buffer = await mod.Packer.toBuffer(doc);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);
  console.log(
    `Wrote ${path.relative(root, outPath)} (${buffer.length} bytes) — ${mod.atsDownloadName(resume)}`,
  );
} finally {
  fs.rmSync(tmp, { force: true });
}
