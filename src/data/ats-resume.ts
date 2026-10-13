import { contact } from './applications';
import { site } from './site';

export type AtsRole = {
  title: string;
  /** Abbreviated month and year, as in the Jobscan file. */
  dates: string;
  company: string;
  location: string;
  overview: string;
  bullets: string[];
};

export type AtsResumeContent = {
  name: string;
  headline: string;
  email: string;
  phoneDisplay: string;
  city: string;
  linkedin: string;
  linkedinLabel: string;
  portfolio: string;
  portfolioLabel: string;
  /** Short paragraphs. Jobscan flags any paragraph over 40 words. */
  summary: string[];
  roles: AtsRole[];
  education: {
    school: string;
    year: string;
    /** Bold lead, as in “Bachelor of Fine Arts”. */
    degree: string;
    /** Rest of the line, as in “Graphic Design”. */
    field: string;
  };
  /** One comma-separated line. Hard skills and soft skills together. */
  skills: string;
  systems: string;
};

/**
 * One ATS resume for every company. Layout follows the Jobscan Word file:
 * name, title, contact on separate lines, then Summary, Work Experience,
 * Education, and Skills. Each role carries its own dates so a parser can
 * attach them. Those month splits come from the Jobscan file Cody supplied.
 */
export const atsResume: AtsResumeContent = {
  name: contact.name,
  headline: 'Lead UX Designer',
  email: site.email,
  phoneDisplay: contact.phoneDisplay,
  city: 'Pleasant Grove, UT',
  linkedin: site.linkedin,
  linkedinLabel: 'linkedin.com/in/cody-duke-aa8114127',
  portfolio: 'https://codybduke.com/',
  portfolioLabel: 'codybduke.com',
  summary: [
    'Lead UX Designer with seven years at Entrata and two years at FamilySearch designing web and mobile applications.',
    'The work uses user research, production data, and interactive prototypes on desktop and mobile platforms, including iOS, until the result can be measured.',
  ],
  roles: [
    {
      title: 'Product Lead',
      dates: 'Jul 2025 - Aug 2026',
      company: 'Entrata',
      location: 'Lehi, UT',
      overview:
        'Led a remote team of six engineers as product manager and designer, managed multiple projects, and owned scope, requirements, and prototypes from discovery through launch.',
      bullets: [
        'Designed Entrata’s first property-manager mobile app, from the information architecture through the workflows staff use on site. The daily job was to look up a resident and take the next action, instead of a desktop product shrunk onto a phone.',
        'Designed move-in on that app so staff could move a resident in, in real time, including when the Wi-Fi was down, instead of re-entering the record later, which cut the work in half. Handed it to the iOS team as SwiftUI.',
      ],
    },
    {
      title: 'Senior Product Designer',
      dates: 'Sep 2020 - Jul 2025',
      company: 'Entrata',
      location: 'Lehi, UT',
      overview:
        'Designed operator and resident workflows in property-management software, including projects for the company’s largest client.',
      bullets: [
        'Led a hackathon team that designed an AI workflow to read income documents and autofill affordable-housing certifications, so a long application became an upload. Hundreds of teams entered. We won Most Likely to Land a New Logo.',
        'Served as sole designer for projects tied to the company’s largest client. Translated that client’s operational needs into workflows engineering could build.',
        'Redesigned a complex enterprise setup system and extended its design language without adding complexity. More than 8,000 offers used the new targeting rules within the first couple of months.',
        'Simplified core workflows for Homebody, a resident-facing self-serve mobile app. It reached 4.4 out of 5 stars on iOS from 600+ reviews in the first 6 months.',
      ],
    },
    {
      title: 'Product Designer',
      dates: 'Jul 2019 - Sep 2020',
      company: 'Entrata',
      location: 'Lehi, UT',
      overview: 'Designed the facilities experience for desktop and mobile applications.',
      bullets: [
        'Redesigned the unit inspection process and workflow.',
        'Redesigned several experiences in the facilities app to make them more efficient and to introduce new features.',
      ],
    },
    {
      title: 'UX Designer',
      dates: 'Jan 2017 - May 2019',
      company: 'FamilySearch',
      location: 'Lehi, UT',
      overview:
        'Led product design for member discovery and kept outside designers on one campaign pattern.',
      bullets: [
        'Led product design of 26 personalized discovery experiences that gave members an entry point and a reason to come back.',
        'Retained 95% more members and 107% more other users than the previous year. Reached 1.1 million people outside the US and earned 90% positive feedback from 86,000 comments.',
        'Oversaw third-party design so every campaign followed the same tried-and-true loop.',
        'Refined how the product team worked, so the team moved faster, did more thorough work, and ran into fewer surprises.',
      ],
    },
  ],
  education: {
    school: 'Brigham Young University–Idaho',
    year: '2017',
    degree: 'Bachelor of Fine Arts',
    field: 'Graphic Design',
  },
  skills:
    'User research, Strong Visual Design Skills, Interaction design, Visual design, UX design, Web and mobile applications, Mobile applications, Desktop and mobile platforms, Mobile Platforms, Operating Systems, iOS, Interactive prototypes, Design language, Systems Thinking, Requirements and user stories, Quantitative data, Information science, Industrial design, Computer Science, HCI, Design rationale, Material design, Presentation, A/B Testing, Flow charts, Data-driven, Ui/ux, Attention to Detail, Consistent, Mentoring, Committed, Written communication skills, Manage multiple projects, Ability to collaborate, Provide mentorship, Decision making, Leadership, Articulate, Ambitious',
  systems: 'Figma, FigJam, Cursor, Claude Code, Codex',
};

export const atsResumeDownloadName = 'Cody Duke ATS Resume.docx';

/** Tailored for the Enzo Health Senior Designer scan. The shared resume stays as-is. */
export const enzoAtsResume: AtsResumeContent = {
  ...atsResume,
  headline: 'Senior Designer',
  summary: [
    'Senior Designer with seven years at Entrata and two years at FamilySearch designing web and mobile applications.',
    'I use field research, interaction design, and visual design on data-dense B2B workflows, and I prototype until the result can be measured.',
    'That includes artificial intelligence a person reviews for accuracy before it writes.',
  ],
  roles: [
    {
      ...atsResume.roles[0],
      bullets: [
        'Designed Entrata’s first property-manager mobile app, from the information architecture through the workflows staff use on site. The daily job was to look up a resident and take the next action, instead of a desktop product shrunk onto a phone.',
        'Designed move-in on that app and handed it to the iOS team as SwiftUI. Staff now move a resident in on an iPad in the field, including when the Wi-Fi is down, instead of re-entering the record later, which cut the work in half.',
      ],
    },
    {
      ...atsResume.roles[1],
      overview:
        'Designed operator and resident workflows in B2B property-management software, including projects for the company’s largest client.',
      bullets: [
        'Led a hackathon team that designed an artificial intelligence workflow to read income documents and autofill affordable-housing certifications. A person reviews the result before it replaces manual entry, so accuracy holds in that compliance-driven process. Hundreds of teams entered. We won Most Likely to Land a New Logo.',
        ...atsResume.roles[1].bullets.slice(1),
      ],
    },
    atsResume.roles[2],
    atsResume.roles[3],
  ],
  skills:
    'Interaction design, Visual design, Systems Thinking, Prototyping, Workflow, B2B, Artificial intelligence, User research, UX design, Mobile applications, iOS, Communication, Accuracy, Requirements and user stories, Design language',
};

/**
 * BambooHR Product Designer scan. Enzo is the base. Missing Jobscan skills
 * appear once, in a sentence, and every paragraph stays under 40 words.
 */
export const bambooAtsResume: AtsResumeContent = {
  ...enzoAtsResume,
  headline: 'Product Designer',
  summary: [
    'Product Designer with seven years at Entrata and two years at FamilySearch, designing SaaS products for desktop and mobile.',
    'The work runs from user research and interaction design through prototyping, until the result can be measured.',
    'I am confident walking a hiring team through the decisions, including where AI should act and where a person still reviews the result.',
  ],
  roles: [
    {
      ...enzoAtsResume.roles[0],
      overview:
        'Led a remote team of six engineers as product manager and designer, and owned scope from discovery through launch.',
      bullets: [
        'Set the information architecture and user flows for Entrata’s first property-manager mobile app, after contextual inquiry on site and a competitive analysis of five field apps.',
        'Designed move-in so staff could check a resident in at the table, even offline, which cut the work in half. Handed the SwiftUI module to the iOS team.',
      ],
    },
    {
      ...enzoAtsResume.roles[1],
      bullets: [
        'Led a hackathon team that designed an AI flow to read income documents and fill an affordable-housing certification. Hundreds of teams entered. We won Most Likely to Land a New Logo.',
        'Served as sole designer for the company’s largest client and turned their customer needs into workflows engineering could build.',
        'Redesigned Pricing setup inside the design system after usability testing showed staff already used that pattern. More than 8,000 offers used the new rules in the first couple of months.',
        'Simplified core workflows for Homebody, a resident mobile app. It reached 4.4 out of 5 stars on iOS from 600+ reviews in the first 6 months.',
      ],
    },
    {
      ...enzoAtsResume.roles[2],
      bullets: [
        'Used ideation and UI design to redesign unit inspection and other facilities workflows, so staff could finish the job in fewer steps and take on new features.',
      ],
    },
    enzoAtsResume.roles[3],
  ],
  skills:
    'User research, Interaction design, UI design, Prototyping, Usability testing, Information architecture, Design systems, SaaS',
};

/**
 * Stealth Startup Product Designer scan (Jobscan “Company”). BambooHR is the
 * base. Missing skills Cody is willing to claim appear in a sentence.
 * Front-end development, motion design, and animation stay off.
 * Every paragraph stays under 40 words.
 */
export const stealthAtsResume: AtsResumeContent = {
  ...bambooAtsResume,
  headline: 'Product Designer',
  summary: [
    'Product Designer with seven years at Entrata and two years at FamilySearch, shipping web and mobile products from early user flows through a measured launch.',
    'I use research to understand user needs, then interaction design, visual design, and typography so the interface stays clear.',
    'Prototyping in Figma carries an idea into the design system, and I stay with engineering through shipping, including AI a person still reviews.',
    'I solve problems before a pattern exists, and I keep the creative work inside the product instead of treating it as decoration.',
  ],
  roles: [
    {
      ...bambooAtsResume.roles[0],
      overview:
        'Led a remote team of six engineers as product manager and designer, and owned scope and prototyping from discovery through launch.',
      bullets: [
        'Set the information architecture and user flows for Entrata’s first property-manager mobile app, after contextual inquiry on site and a competitive analysis of five field apps.',
        'Used prototyping to design move-in so staff could check a resident in at the table, even offline, which cut the work in half. Handed the SwiftUI module to the iOS team.',
      ],
    },
    {
      ...bambooAtsResume.roles[1],
      bullets: [
        'Led a hackathon team and used prototyping to design an AI flow that reads income documents and fills an affordable-housing certification. Hundreds of teams entered. We won Most Likely to Land a New Logo.',
        'Served as sole designer for the company’s largest client and turned their operational needs into workflows that reused the design system.',
        'Redesigned Pricing setup inside the design system after usability testing showed staff already used that pattern. More than 8,000 offers used the new rules in the first couple of months.',
        'Simplified core workflows for Homebody, a resident mobile app. It reached 4.4 out of 5 stars on iOS from 600+ reviews in the first 6 months.',
      ],
    },
    {
      ...bambooAtsResume.roles[2],
      bullets: [
        'Used interaction design to redesign unit inspection and other facilities workflows, so staff could finish the job in fewer steps and take on new features.',
      ],
    },
    {
      ...bambooAtsResume.roles[3],
      bullets: [
        'Led a creative set of 26 personalized discovery experiences that gave members an entry point and a reason to come back.',
        ...bambooAtsResume.roles[3].bullets.slice(1),
      ],
    },
  ],
  skills:
    'Visual design, Typography, Interaction design, UI design, Prototyping, Design systems, User flows, User research, Usability testing, Figma, AI',
};

export function getAtsResume(companyId?: string | null): AtsResumeContent {
  if (companyId === 'enzo-health') return enzoAtsResume;
  if (companyId === 'bamboo-hr') return bambooAtsResume;
  if (companyId === 'stealth-startup') return stealthAtsResume;
  return atsResume;
}

export function atsResumeIsTailored(companyId?: string | null): boolean {
  return getAtsResume(companyId) !== atsResume;
}

export function atsDownloadName(resume: AtsResumeContent): string {
  if (resume === enzoAtsResume) return 'Cody Duke Enzo Health ATS Resume.docx';
  if (resume === bambooAtsResume) return 'Cody Duke BambooHR ATS Resume.docx';
  if (resume === stealthAtsResume) return 'Cody Duke Stealth Startup ATS Resume.docx';
  return atsResumeDownloadName;
}
