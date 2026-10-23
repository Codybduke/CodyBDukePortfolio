import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  HeadingLevel,
  LevelFormat,
  LineRuleType,
  Packer,
  Paragraph,
  TabStopType,
  TextRun,
  UnderlineType,
  type IParagraphStylePropertiesOptions,
  type ParagraphChild,
} from 'docx';

import {
  atsDownloadName,
  atsResume,
  type AtsResumeContent,
} from '../data/ats-resume';

/**
 * Visual system for the ATS Word resume.
 *
 * The goal is an art-directed, single-column document that still parses as plain
 * selectable text. Structure (name, labels, titles, dates, skills) is set in a
 * sans that renders identically in recipients' Word (Calibri); reading text
 * (summary, role overviews, bullets) is set in a widely installed serif
 * (Georgia) to echo the site's editorial body. Hierarchy comes from a deliberate
 * type scale, tracked small-caps section labels, hairline rules, and a two-tone
 * ink/muted palette pulled from the site — not from bolding everything.
 */
const SANS = 'Calibri';
const SERIF = 'Georgia';

// Sizes are half-points (so 21 = 10.5pt).
const NAME = 40; // 20pt
const ROLE = 20; // 10pt, tracked small caps
const CONTACT = 19; // 9.5pt
const LABEL = 21; // 10.5pt section label
const TITLE = 23; // 11.5pt job title
const META = 20; // 10pt company / location
const DATE = 19; // 9.5pt dates
const TEXT = 21; // 10.5pt reading text
const SKILL = 20; // 10pt skills

// Palette from the site design tokens.
const INK = '1C1C1A';
const MUTED = '5C5C56';
const RULE = 'C9C7C0';

const PAGE_WIDTH = 12240;
const PAGE_HEIGHT = 15840;
const MARGIN = 1152; // 0.8in
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const LINE = { line: 276, lineRule: LineRuleType.AUTO };

type RunOptions = {
  bold?: boolean;
  italics?: boolean;
  size?: number;
  font?: string;
  color?: string;
  caps?: boolean;
  spacing?: number;
  underline?: boolean;
};

function run(value: string, options?: RunOptions) {
  return new TextRun({
    text: value,
    font: options?.font ?? SANS,
    size: options?.size ?? TEXT,
    bold: options?.bold,
    italics: options?.italics,
    color: options?.color ?? INK,
    allCaps: options?.caps,
    characterSpacing: options?.spacing,
    underline: options?.underline ? { type: UnderlineType.SINGLE } : undefined,
  });
}

/** Reading text: serif body. */
function text(value: string, options?: RunOptions) {
  return run(value, { font: SERIF, size: TEXT, color: INK, ...options });
}

/** A hyperlink styled as monochrome ink with an underline. */
function link(label: string, href: string, size = CONTACT) {
  return new ExternalHyperlink({
    link: href,
    children: [run(label, { size, color: INK, underline: true })],
  });
}

function separator() {
  return run('    ·    ', { size: CONTACT, color: RULE });
}

function block(children: ParagraphChild[], options?: { before?: number; after?: number }) {
  return new Paragraph({
    spacing: { before: options?.before ?? 0, after: options?.after ?? 0, ...LINE },
    children,
  });
}

/** Thin horizontal rule as a bottom-bordered, near-empty paragraph. */
function rule(options?: { before?: number; after?: number; size?: number }) {
  return new Paragraph({
    spacing: { before: options?.before ?? 120, after: options?.after ?? 0, line: 20, lineRule: LineRuleType.AUTO },
    border: { bottom: { style: BorderStyle.SINGLE, size: options?.size ?? 6, color: RULE, space: 1 } },
    children: [new TextRun({ text: '', size: 2 })],
  });
}

/** Tracked small-caps section label with a hairline underneath. */
function sectionHeading(label: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    keepNext: true,
    spacing: { before: 300, after: 140, ...LINE },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: RULE, space: 4 } },
    children: [run(label, { size: LABEL, bold: true, caps: true, spacing: 50, color: MUTED })],
  });
}

function datedRow(
  left: ParagraphChild[],
  right: string,
  options?: { before?: number; after?: number; keepNext?: boolean },
) {
  return new Paragraph({
    keepNext: options?.keepNext,
    tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_WIDTH }],
    spacing: { before: options?.before ?? 0, after: options?.after ?? 0, ...LINE },
    children: [...left, run('\t'), run(right, { size: DATE, color: MUTED, caps: true, spacing: 20 })],
  });
}

function bullet(value: string) {
  return new Paragraph({
    numbering: { reference: 'accomplishments', level: 0 },
    keepLines: true,
    spacing: { before: 48, after: 48, ...LINE },
    children: [text(value)],
  });
}

function keepNextPara(children: ParagraphChild[], options?: { before?: number; after?: number }) {
  return new Paragraph({
    keepNext: true,
    spacing: { before: options?.before ?? 0, after: options?.after ?? 0, ...LINE },
    children,
  });
}

export function buildAtsDocument(resume: AtsResumeContent = atsResume) {
  const children: Paragraph[] = [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 0, after: 20, ...LINE },
      children: [run(resume.name, { size: NAME, bold: true, spacing: 20 })],
    }),
    new Paragraph({
      spacing: { before: 0, after: 150, ...LINE },
      children: [run(resume.headline, { size: ROLE, caps: true, spacing: 60, color: MUTED })],
    }),
    block([
      link(resume.email, `mailto:${resume.email}`),
      separator(),
      run(resume.phoneDisplay, { size: CONTACT, color: MUTED }),
      separator(),
      run(resume.city, { size: CONTACT, color: MUTED }),
    ]),
    block(
      [
        link(resume.portfolioLabel, resume.portfolio),
        separator(),
        link(resume.linkedinLabel, resume.linkedin),
      ],
      { before: 40 },
    ),
    rule({ before: 150, after: 0 }),
  ];

  if (resume.disclaimer) {
    children.push(
      block(
        [
          text(resume.disclaimer.before),
          link(resume.disclaimer.linkLabel, resume.disclaimer.href, TEXT),
          text(resume.disclaimer.after ?? ''),
        ],
        { before: 160, after: 40 },
      ),
    );
  }

  children.push(sectionHeading('Summary'));
  resume.summary.forEach((paragraphText, index) => {
    children.push(
      block([text(paragraphText, index === 0 ? { italics: true } : undefined)], { after: 120 }),
    );
  });

  children.push(sectionHeading('Work Experience'));
  for (const role of resume.roles) {
    children.push(
      datedRow([run(role.title, { size: TITLE, bold: true })], role.dates, {
        before: 200,
        keepNext: true,
      }),
    );
    children.push(
      keepNextPara(
        [run(`${role.company}`, { size: META, color: MUTED }), run(` | ${role.location}`, { size: META, color: MUTED })],
        { before: 30 },
      ),
    );
    children.push(keepNextPara([text(role.overview)], { before: 70, after: 70 }));
    for (const item of role.bullets) children.push(bullet(item));
  }

  children.push(sectionHeading('Education'));
  children.push(
    datedRow([run(resume.education.school, { size: TITLE, bold: true })], resume.education.year, {
      before: 40,
      keepNext: true,
    }),
  );
  children.push(block([text(`${resume.education.degree}, ${resume.education.field}`)], { before: 30 }));

  children.push(sectionHeading('Skills'));
  if (resume.skillCategories?.length) {
    resume.skillCategories.forEach((category, index) => {
      const isLast = index === resume.skillCategories!.length - 1;
      children.push(
        block([run(`${category.label}:  `, { size: SKILL, bold: true }), run(category.items.join(', '), { size: SKILL })], {
          after: isLast ? 100 : 60,
        }),
      );
    });
  } else {
    children.push(block([run(resume.skills, { size: SKILL })], { after: 100 }));
  }
  children.push(
    block([run('Systems:  ', { size: SKILL, bold: true }), run(resume.systems, { size: SKILL })]),
  );

  const headingParagraph: IParagraphStylePropertiesOptions = { spacing: { before: 0, after: 0 } };

  return new Document({
    title: `${resume.name} ATS Resume`,
    styles: {
      default: {
        document: {
          run: { font: SERIF, size: TEXT, color: INK },
          paragraph: { spacing: { ...LINE } },
        },
      },
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: { font: SANS, size: NAME, bold: true, color: INK },
          paragraph: headingParagraph,
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: { font: SANS, size: LABEL, bold: true, color: MUTED },
          paragraph: headingParagraph,
        },
      ],
    },
    numbering: {
      config: [
        {
          reference: 'accomplishments',
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: '•',
              alignment: AlignmentType.LEFT,
              style: {
                run: { font: SANS, color: MUTED },
                paragraph: { indent: { left: 420, hanging: 250 } },
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
            size: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
            margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
          },
        },
        children,
      },
    ],
  });
}

export async function downloadAtsResume(resume: AtsResumeContent = atsResume) {
  const blob = await Packer.toBlob(buildAtsDocument(resume));
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = atsDownloadName(resume);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}
