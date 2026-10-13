import {
  AlignmentType,
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
  type ParagraphChild,
} from 'docx';

import {
  atsDownloadName,
  atsResume,
  type AtsResumeContent,
} from '../data/ats-resume';

const HEAD = 'Open Sans';
const BODY_FONT = 'Calibri';
const BODY = 22;
const NAME = 30;
const HEADING = 24;
/** Job title is two points above the 11pt company name. */
const TITLE = 26;
const PAGE_WIDTH = 12240;
const MARGIN = 1080;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const LINE = { line: 276, lineRule: LineRuleType.AUTO };

function run(
  value: string,
  options?: { bold?: boolean; italics?: boolean; size?: number; font?: string; link?: boolean },
) {
  return new TextRun({
    text: value,
    font: options?.font ?? HEAD,
    size: options?.size ?? BODY,
    bold: options?.bold,
    italics: options?.italics,
    color: options?.link ? '0563C1' : '000000',
    underline: options?.link ? { type: UnderlineType.SINGLE } : undefined,
  });
}

function body(value: string) {
  return run(value, { font: BODY_FONT, size: BODY });
}

function block(children: ParagraphChild[], options?: { before?: number; after?: number }) {
  return new Paragraph({
    spacing: { before: options?.before ?? 0, after: options?.after ?? 0, ...LINE },
    children,
  });
}

function sectionHeading(label: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 80, ...LINE },
    children: [run(label, { size: HEADING })],
  });
}

function datedLine(
  left: string,
  right: string,
  options?: { before?: number; bold?: boolean; size?: number },
) {
  return new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_WIDTH }],
    spacing: { before: options?.before ?? 200, after: 0, ...LINE },
    children: [
      run(left, { bold: options?.bold !== false, size: options?.size }),
      run('\t'),
      run(right),
    ],
  });
}

function contactLine(children: ParagraphChild[]) {
  return new Paragraph({
    style: 'Contact',
    spacing: { before: 0, after: 0, ...LINE },
    children,
  });
}

function bullet(value: string) {
  return new Paragraph({
    numbering: { reference: 'accomplishments', level: 0 },
    spacing: { before: 40, after: 40, ...LINE },
    children: [body(value)],
  });
}

export function buildAtsDocument(resume: AtsResumeContent = atsResume) {
  const children: Paragraph[] = [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 0, after: 0, ...LINE },
      children: [run(resume.name, { bold: true, size: NAME })],
    }),
    block([run(resume.headline, { size: HEADING })]),
    contactLine([
      new ExternalHyperlink({
        link: `mailto:${resume.email}`,
        children: [run(resume.email, { italics: true, link: true })],
      }),
    ]),
    contactLine([run(resume.phoneDisplay, { italics: true })]),
    contactLine([run(resume.city, { italics: true })]),
    contactLine([
      new ExternalHyperlink({
        link: resume.portfolio,
        children: [run(resume.portfolioLabel, { italics: true, link: true })],
      }),
    ]),
    contactLine([
      new ExternalHyperlink({
        link: resume.linkedin,
        children: [run(resume.linkedinLabel, { italics: true, link: true })],
      }),
    ]),
    sectionHeading('Summary'),
    ...resume.summary.map((paragraphText) => block([body(paragraphText)], { after: 120 })),
    sectionHeading('Work Experience'),
  ];

  for (const role of resume.roles) {
    children.push(datedLine(role.title, role.dates, { size: TITLE }));
    children.push(block([run(role.company), run(` | ${role.location}`)]));
    children.push(block([body(role.overview)], { after: 120 }));
    for (const item of role.bullets) children.push(bullet(item));
  }

  children.push(sectionHeading('Education'));
  children.push(
    datedLine(resume.education.school, resume.education.year, { before: 80, bold: false }),
  );
  children.push(block([run(`${resume.education.degree} ${resume.education.field}`)]));

  children.push(sectionHeading('Skills'));
  children.push(block([body(resume.skills)], { after: 80 }));
  children.push(block([run('Systems')]));
  children.push(block([run(resume.systems)]));

  return new Document({
    title: `${resume.name} ATS Resume`,
    styles: {
      default: {
        document: {
          run: { font: BODY_FONT, size: BODY },
          paragraph: { spacing: { line: 276, lineRule: LineRuleType.AUTO } },
        },
      },
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: { font: HEAD, size: NAME, bold: true, color: '000000' },
          paragraph: { spacing: { before: 0, after: 0 } },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: { font: HEAD, size: HEADING, bold: false, color: '000000' },
          paragraph: { spacing: { before: 280, after: 80 } },
        },
        {
          id: 'Contact',
          name: 'Contact',
          basedOn: 'Normal',
          quickFormat: true,
          run: { font: HEAD, size: BODY, italics: true, color: '000000' },
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
              text: '●',
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
