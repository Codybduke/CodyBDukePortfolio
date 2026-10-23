import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  ImageRun,
  LevelFormat,
  LineRuleType,
  Packer,
  Paragraph,
  Table,
  TableBorders,
  TableCell,
  TableLayoutType,
  TableRow,
  Tab,
  TabStopType,
  TextRun,
  UnderlineType,
  VerticalAlignTable,
  WidthType,
  type ParagraphChild,
} from 'docx';

import {
  contact,
  type CoverLetterContent,
  type Job,
  type ResumeContent,
} from '../data/applications';

const FONT = 'Calibri';
const CLASH = 'Clash Grotesk Semibold';
const FIG = 'Figtree';
const FIG_MED = 'Figtree Medium';
const FIG_SEMI = 'Figtree SemiBold';
const FIG_BOLD = 'Figtree Bold';
const SERIF_FACE = 'Source Serif 4';
const SERIF_SEMI = 'Source Serif 4 Semibold';
const BODY = 22;
const NAME = 36;
const PAGE_WIDTH = 12240;
const MARGIN = 1080;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const INK = '1C1C1A';
const MUTED = '5C5C56';
const LINE = { line: 276, lineRule: LineRuleType.AUTO };

export type DesignedKind = 'resume' | 'single' | 'letter';

type EmbeddedFont = {
  name: string;
  data: Uint8Array;
};

type ResumeLogo = {
  svg: Uint8Array;
  png: Uint8Array;
};

type DownloadInput = {
  kind: DesignedKind;
  resume: ResumeContent;
  letter?: CoverLetterContent;
  email: string;
  linkedin: string;
  portfolioHref: string;
  assets?: {
    fonts: EmbeddedFont[];
    logo?: ResumeLogo;
  };
};

/** Word character spacing is in twips. One em of tracking is the font size in points times 20. */
function tracking(em: number, halfPoints: number) {
  return Math.round(em * (halfPoints / 2) * 20);
}

export function designedDocxDownloadName(kind: DesignedKind): string {
  if (kind === 'letter') return 'Cody Duke Product Design Cover Letter.docx';
  if (kind === 'single') return 'Cody Duke Product Design Resume Single Column.docx';
  return 'Cody Duke Product Design Resume.docx';
}

function run(
  value: string,
  options?: {
    bold?: boolean;
    italics?: boolean;
    size?: number;
    color?: string;
    link?: boolean;
    font?: string;
    spacing?: number;
  },
) {
  return new TextRun({
    text: value,
    font: options?.font ?? FONT,
    size: options?.size ?? BODY,
    bold: options?.bold,
    italics: options?.italics,
    characterSpacing: options?.spacing,
    color: options?.color ?? (options?.link ? '0563C1' : INK),
    underline: options?.link ? { type: UnderlineType.SINGLE } : undefined,
  });
}

function paragraph(
  children: ParagraphChild[],
  options?: { before?: number; after?: number; border?: boolean },
) {
  return new Paragraph({
    spacing: { before: options?.before ?? 0, after: options?.after ?? 0, ...LINE },
    border: options?.border
      ? {
          bottom: {
            color: 'D9D9D2',
            space: 8,
            style: BorderStyle.SINGLE,
            size: 8,
          },
        }
      : undefined,
    children,
  });
}

function sectionHeading(label: string) {
  return new Paragraph({
    spacing: { before: 320, after: 80, ...LINE },
    border: {
      bottom: {
        color: 'E4E4DC',
        space: 1,
        style: BorderStyle.SINGLE,
        size: 6,
      },
    },
    children: [run(label.toUpperCase(), { bold: true, size: 20, color: INK })],
  });
}

function datedLine(left: string, right: string, options?: { before?: number; bold?: boolean }) {
  return new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_WIDTH }],
    spacing: { before: options?.before ?? 200, after: 0, ...LINE },
    children: [
      run(left, { bold: options?.bold !== false }),
      run('\t'),
      run(right, { color: MUTED }),
    ],
  });
}

function bullet(value: string) {
  return new Paragraph({
    numbering: { reference: 'resume-bullets', level: 0 },
    spacing: { before: 40, after: 40, ...LINE },
    children: [run(value)],
  });
}

function link(href: string, label: string) {
  return new ExternalHyperlink({
    link: href,
    children: [run(label, { link: true })],
  });
}

function absolutePortfolio(href: string) {
  if (/^https?:\/\//i.test(href)) return href;
  return new URL(href, 'https://codybduke.com/').href;
}

function header({
  role,
  tenure,
  location,
  email,
  linkedin,
  portfolioHref,
}: {
  role: string;
  tenure?: string;
  location: string;
  email: string;
  linkedin: string;
  portfolioHref: string;
}) {
  const roleLine = tenure ? `${role}  ${tenure}` : role;
  return [
    paragraph([run(contact.name.toUpperCase(), { bold: true, size: NAME })], { after: 40 }),
    paragraph([run(roleLine, { size: 20, color: MUTED })], { after: 20 }),
    paragraph([run(location, { size: 20, color: MUTED })], { after: 80 }),
    paragraph(
      [
        link(contact.phoneHref, contact.phoneDisplay),
        run('   ·   ', { color: MUTED }),
        link(`mailto:${email}`, email),
        run('   ·   ', { color: MUTED }),
        link(absolutePortfolio(portfolioHref), 'Portfolio'),
        run('   ·   ', { color: MUTED }),
        link(linkedin, 'LinkedIn'),
      ],
      { after: 40, border: true },
    ),
  ];
}

function profileBlocks(resume: ResumeContent) {
  const blocks: Paragraph[] = [];
  const heading = resume.profileHeading === '' ? null : (resume.profileHeading ?? 'Profile');
  if (heading) blocks.push(sectionHeading(heading));
  if (resume.profileTitle) {
    blocks.push(paragraph([run(resume.profileTitle, { bold: true })], { before: heading ? 80 : 280, after: 60 }));
  }
  if (resume.profileLede) {
    blocks.push(paragraph([run(resume.profileLede, { italics: true })], { before: 40, after: 60 }));
  }
  blocks.push(paragraph([run(resume.profile)], { before: 40, after: 40 }));
  return blocks;
}

function skillList(resume: ResumeContent, kind: DesignedKind) {
  if (kind === 'resume' && resume.railSkills?.length) {
    return [resume.skills[0], ...resume.railSkills, ...resume.skills.slice(1)];
  }
  return resume.skills;
}

/** Two-column Skills section. Renders grouped skills when the resume defines them. */
function skillBlocks(resume: ResumeContent, kind: DesignedKind) {
  if (kind === 'resume' && resume.skillGroups?.length) {
    const blocks: Paragraph[] = [];
    resume.skillGroups.forEach((group, index) => {
      blocks.push(
        paragraph([run(group.label.toUpperCase(), { bold: true, size: 18, color: MUTED })], {
          before: index === 0 ? 80 : 120,
          after: 20,
        }),
      );
      for (const item of group.items) blocks.push(bullet(item));
    });
    return blocks;
  }
  return skillList(resume, kind).map((skill) => bullet(skill));
}

function jobBlocks(job: Job) {
  const blocks: Paragraph[] = [];
  if (job.progression === 'lead') {
    blocks.push(paragraph([run(job.company, { bold: true })], { before: 220, after: 20 }));
    blocks.push(datedLine(job.title, job.dates, { before: 40 }));
  } else if (job.progression === 'rank') {
    blocks.push(datedLine(job.title, job.dates, { before: 160 }));
  } else {
    blocks.push(datedLine(job.company, job.dates, { before: 220 }));
    blocks.push(paragraph([run(job.title, { bold: true })], { before: 20, after: 20 }));
  }
  if (job.summary) blocks.push(paragraph([run(job.summary)], { before: 40, after: 40 }));
  for (const item of job.bullets) blocks.push(bullet(item));
  return blocks;
}

const SINGLE_SIDE = 1440;
const SINGLE_WIDTH = 12240 - SINGLE_SIDE * 2;
const LOGO_WIDTH = 55;
const LOGO_HEIGHT = 23;
const SEPARATOR = '   ·   ';

const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const flushMargins = { top: 0, bottom: 0, left: 0, right: 0 };

function singleParagraph(
  children: ParagraphChild[],
  options?: {
    before?: number;
    after?: number;
    line?: number;
    align?: (typeof AlignmentType)[keyof typeof AlignmentType];
  },
) {
  return new Paragraph({
    alignment: options?.align,
    spacing: {
      before: options?.before ?? 0,
      after: options?.after ?? 0,
      line: options?.line ?? 276,
      lineRule: LineRuleType.AUTO,
    },
    children,
  });
}

function singleHeading(label: string) {
  return singleParagraph(
    [run(label.toUpperCase(), { font: FIG_BOLD, size: 17, spacing: tracking(0.16, 17) })],
    { before: 317, after: 96, line: 240 },
  );
}

function singleBullet(value: string, spacing: { before: number; after: number }) {
  return singleParagraph([run(`• ${value}`, { font: SERIF_FACE, size: 20 })], {
    before: spacing.before,
    after: spacing.after,
    line: 341,
  });
}

function dottedLine(parts: { text: string; font?: string; color?: string }[], size = 20) {
  const children: ParagraphChild[] = [];
  parts.forEach((part, index) => {
    if (index > 0) children.push(run(SEPARATOR, { font: FIG, size, color: MUTED }));
    children.push(run(part.text, { font: part.font ?? FIG, size, color: part.color }));
  });
  return singleParagraph(children, { before: 0, after: 0, line: 348 });
}

function skillLine(skills: string[]) {
  const children: ParagraphChild[] = [];
  skills.forEach((skill, index) => {
    if (index > 0) children.push(run(SEPARATOR, { font: FIG, size: 19, color: MUTED }));
    children.push(run(skill, { font: FIG_MED, size: 19 }));
  });
  return singleParagraph(children, { before: 0, after: 0, line: 324 });
}

function titleAndDates(
  title: string,
  dates: string,
  options?: { before?: number; titleFont?: string; titleSize?: number },
) {
  const titleSize = options?.titleSize ?? 19;
  return singleParagraph(
    [
      run(title, { font: options?.titleFont ?? FIG_SEMI, size: titleSize }),
      run('    ', { font: FIG, size: titleSize }),
      run(dates, { font: FIG_MED, size: 18, color: MUTED }),
    ],
    { before: options?.before ?? 0, after: 0, line: 276 },
  );
}

function singleHeader(input: DownloadInput, resume: ResumeContent) {
  const tenureMark = resume.tenure?.match(/^([•·])\s*([\s\S]*)$/);
  const tenureLabel = tenureMark ? tenureMark[2] : resume.tenure;
  const roleChildren: ParagraphChild[] = [
    run(resume.role.toUpperCase(), {
      font: FIG_SEMI,
      size: 17,
      color: MUTED,
      spacing: tracking(0.22, 17),
    }),
  ];
  if (tenureMark) roleChildren.push(run(` ${tenureMark[1]}  `, { font: FIG, size: 17, color: MUTED }));
  if (tenureLabel) roleChildren.push(run(tenureLabel, { font: FIG, size: 17, color: MUTED }));

  const nameChildren: ParagraphChild[] = [];
  const logo = input.assets?.logo;
  if (logo) {
    nameChildren.push(
      new ImageRun({
        type: 'svg',
        data: logo.svg,
        fallback: { type: 'png', data: logo.png },
        transformation: { width: LOGO_WIDTH, height: LOGO_HEIGHT },
        altText: { name: 'Stone logo', description: 'Cody Duke mark' },
      }),
      run(' ', { font: CLASH, size: 52, spacing: 68 }),
    );
  }
  nameChildren.push(
    run(contact.name.toUpperCase(), { font: CLASH, size: 52, spacing: tracking(0.04, 52) }),
  );

  const contactLine = (href: string, label: string) =>
    singleParagraph([linkMuted(href, label)], { after: 0, line: 276, align: AlignmentType.RIGHT });

  const left = Math.round(SINGLE_WIDTH * 0.68);
  const right = SINGLE_WIDTH - left;

  return new Table({
    width: { size: SINGLE_WIDTH, type: WidthType.DXA },
    columnWidths: [left, right],
    layout: TableLayoutType.FIXED,
    indent: { size: 0, type: WidthType.DXA },
    borders: TableBorders.NONE,
    cellMargin: flushMargins,
    rows: [
      new TableRow({
        cantSplit: true,
        children: [
          new TableCell({
            width: { size: left, type: WidthType.DXA },
            verticalAlign: VerticalAlignTable.TOP,
            borders: noBorders,
            margins: flushMargins,
            children: [
              singleParagraph(nameChildren, { after: 0, line: 240 }),
              singleParagraph(roleChildren, { before: 67, after: 0, line: 276 }),
              singleParagraph([run(resume.location, { font: FIG, size: 16, color: MUTED })], {
                before: 53,
                after: 0,
                line: 276,
              }),
            ],
          }),
          new TableCell({
            width: { size: right, type: WidthType.DXA },
            verticalAlign: VerticalAlignTable.TOP,
            borders: noBorders,
            margins: flushMargins,
            children: [
              contactLine(contact.phoneHref, contact.phoneDisplay),
              contactLine(`mailto:${input.email}`, input.email),
              contactLine(absolutePortfolio(input.portfolioHref), 'Portfolio'),
              contactLine(input.linkedin, 'LinkedIn'),
            ],
          }),
        ],
      }),
    ],
  });
}

function linkMuted(href: string, label: string) {
  return new ExternalHyperlink({
    link: href,
    children: [run(label, { font: FIG, size: 16, color: MUTED, link: true })],
  });
}

function singleJobs(resume: ResumeContent) {
  const ranked = resume.jobs.some((job) => job.progression);
  const blocks: Paragraph[] = [];
  resume.jobs.forEach((job, index) => {
    const before = index === 0 ? 0 : ranked ? 230 : 461;
    if (job.progression === 'lead') {
      blocks.push(
        singleParagraph([run(job.company, { font: FIG_BOLD, size: 22 })], {
          before,
          after: 67,
          line: 276,
        }),
      );
      blocks.push(titleAndDates(job.title, job.dates));
    } else if (job.progression === 'rank') {
      blocks.push(titleAndDates(job.title, job.dates, { before }));
    } else {
      blocks.push(titleAndDates(job.company, job.dates, { before, titleFont: FIG_BOLD, titleSize: 22 }));
      blocks.push(
        singleParagraph([run(job.title, { font: FIG, size: 17, color: MUTED })], {
          before: 29,
          after: 0,
          line: 276,
        }),
      );
    }
    if (job.summary) {
      blocks.push(singleParagraph([run(job.summary, { font: SERIF_FACE, size: 20 })], { before: 38, after: 0, line: 341 }));
    }
    job.bullets.forEach((item, bulletIndex) => {
      const last = bulletIndex === job.bullets.length - 1;
      blocks.push(
        singleBullet(item, {
          before: bulletIndex === 0 ? 38 : 0,
          after: last ? 0 : ranked ? 43 : 149,
        }),
      );
    });
  });
  return blocks;
}

function singleColumnDocument(input: DownloadInput) {
  const resume = input.resume;
  const heading = resume.profileHeading === '' ? null : (resume.profileHeading ?? 'Profile');
  const children: (Paragraph | Table)[] = [singleHeader(input, resume)];

  if (heading) children.push(singleHeading(heading));
  if (resume.profileTitle) {
    children.push(
      singleParagraph([run(resume.profileTitle, { font: FIG_BOLD, size: 20 })], {
        before: heading ? 0 : 230,
        after: 84,
        line: 324,
      }),
    );
  }
  if (resume.profileLede) {
    children.push(
      singleParagraph([run(resume.profileLede, { font: SERIF_SEMI, size: 20 })], {
        before: 0,
        after: 84,
        line: 341,
      }),
    );
  }
  children.push(
    singleParagraph([run(resume.profile, { font: SERIF_FACE, size: 22 })], {
      before: 0,
      after: 0,
      line: 355,
    }),
  );

  children.push(singleHeading('Skills'));
  children.push(skillLine(skillList(resume, 'single')));
  children.push(singleHeading('Education'));
  children.push(
    dottedLine([
      { text: resume.education.degree, font: FIG_SEMI },
      { text: resume.education.school },
      { text: resume.education.year, color: MUTED },
    ]),
  );
  children.push(singleHeading('Work Experience'));
  children.push(...singleJobs(resume));
  return children;
}

function resumeDocument(input: DownloadInput) {
  const { resume, kind } = input;
  if (kind === 'single') return singleColumnDocument(input);
  const children: Paragraph[] = [
    ...header({
      role: resume.role,
      tenure: resume.tenure,
      location: resume.location,
      email: input.email,
      linkedin: input.linkedin,
      portfolioHref: input.portfolioHref,
    }),
    ...profileBlocks(resume),
    sectionHeading('Skills'),
    ...skillBlocks(resume, kind),
    sectionHeading('Education'),
    paragraph([run(resume.education.degree, { bold: true })], { before: 80 }),
    paragraph([run(resume.education.school)]),
    paragraph([run(resume.education.year, { color: MUTED })], { after: 40 }),
    sectionHeading('Work Experience'),
  ];

  for (const job of resume.jobs) children.push(...jobBlocks(job));

  return children;
}

function letterDocument(input: DownloadInput) {
  const letter = input.letter;
  if (!letter) throw new Error('No cover letter');

  return [
    ...header({
      role: letter.role,
      location: letter.location,
      email: input.email,
      linkedin: input.linkedin,
      portfolioHref: input.portfolioHref,
    }),
    paragraph([run(letter.date)], { before: 280, after: 40 }),
    paragraph([run(letter.recipient)], { after: 40 }),
    paragraph([run(letter.position)], { after: 200 }),
    ...letter.paragraphs.map((text) => paragraph([run(text)], { before: 80, after: 80 })),
    paragraph([run(letter.signoff)], { before: 200, after: 40 }),
    paragraph([run(contact.name)]),
  ];
}

export function buildDesignedDocument(input: DownloadInput) {
  const title = designedDocxDownloadName(input.kind).replace(/\.docx$/, '');
  const children = input.kind === 'letter' ? letterDocument(input) : resumeDocument(input);

  return new Document({
    title,
    fonts: input.assets?.fonts.map((font) => ({
      name: font.name,
      data: font.data as unknown as Buffer,
    })),
    styles: {
      default: {
        document: {
          run: { font: input.kind === 'single' ? SERIF_FACE : FONT, size: BODY, color: INK },
          paragraph: { spacing: { before: 0, after: 0, line: 276, lineRule: LineRuleType.AUTO } },
        },
      },
    },
    numbering: {
      config: [
        {
          reference: 'resume-bullets',
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: '•',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: 720, hanging: 360 },
                },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: PAGE_WIDTH, height: 15840 },
            margin:
              input.kind === 'single'
                ? { top: 690, right: SINGLE_SIDE, bottom: 600, left: SINGLE_SIDE }
                : { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
          },
        },
        children,
      },
    ],
  });
}

async function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export async function downloadDesignedDoc(input: DownloadInput) {
  const assets = input.kind === 'single' ? await loadSingleColumnAssets() : undefined;
  const blob = await Packer.toBlob(buildDesignedDocument({ ...input, assets }));
  if (!blob.size) throw new Error('Empty Word document');
  await saveBlob(blob, designedDocxDownloadName(input.kind));
}

async function loadSingleColumnAssets() {
  const { loadResumeDocAssets } = await import('./resume-docx-assets');
  return loadResumeDocAssets();
}
