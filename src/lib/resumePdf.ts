import type { Application, DocKind } from '../data/applications';

/** File name served at /documents/. Keep in sync with scripts/resume-pdf.mjs. */
export function resumePdfFileName(id: string, doc: DocKind): string {
  return `cody-duke-${id}-${doc}.pdf`;
}

export function resumePdfPath(id: string, doc: DocKind): string {
  return `/documents/${resumePdfFileName(id, doc)}`;
}

export function resumePdfDownloadName(_application: Application, doc: DocKind): string {
  if (doc === 'letter') return 'Cody Duke Product Design Cover Letter.pdf';
  if (doc === 'single') return 'Cody Duke Product Design Resume Single Column.pdf';
  return 'Cody Duke Product Design Resume.pdf';
}
