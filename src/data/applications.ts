export type DocKind = 'resume' | 'letter';

export type Job = {
  company: string;
  dates: string;
  title: string;
  summary?: string;
  bullets: string[];
};

export type ResumeContent = {
  role: string;
  location: string;
  profileLede: string;
  profile: string;
  skills: string[];
  education: {
    degree: string;
    school: string;
    year: string;
  };
  jobs: Job[];
};

export type CoverLetterContent = {
  role: string;
  location: string;
  date: string;
  recipient: string;
  position: string;
  paragraphs: string[];
  signoff: string;
};

export type Application = {
  id: string;
  label: string;
  resume: ResumeContent;
  coverLetter?: CoverLetterContent;
};

export const contact = {
  name: 'Cody Duke',
  phoneDisplay: '(501) 339-5093',
  phoneHref: 'tel:+15013395093',
};

const generalResume: ResumeContent = {
  role: 'Product Designer',
  location: 'Pleasant Grove, Utah, open to remote',
  profileLede: 'How I think about product design:',
  profile:
    'I design products people come back to. I work from field research, production data, and call research. Visual craft is part of the product. I frame the problem and partner with engineering, as the only designer or through a team.',
  skills: [
    'Retention and habit loops',
    'Field and call research',
    'Production data',
    'Systems UX',
    'Visual craft',
    'AI-assisted prototyping',
    'Figma',
    'Cursor',
    'SQL',
    'Expo',
    'SwiftUI',
    'FigJam',
  ],
  education: {
    degree: 'BFA, Graphic Design',
    school: 'Brigham Young University–Idaho',
    year: '2017',
  },
  jobs: [
    {
      company: 'Entrata',
      dates: 'July 2019 – 2026',
      title: 'Senior Product Designer · Product Lead (~1 year)',
      bullets: [
        'Dedicated designer for Greystar, one of the largest U.S. multifamily operators.',
        'Product Lead with an owned engineering team.',
        'Led a team that designed and built an AI flow to read income documents and autofill affordable-housing certification, so a long, high-pressure application became an upload. Hundreds of teams entered. We won Most Likely to Land a New Logo.',
        'Simplified core workflows for Homebody, a resident-facing self-serve mobile app. After launch, 4.4/5 on iOS from 600+ reviews in the first 6 months.',
        'Redesigned a complex enterprise setup system to add flexibility without adding complexity. After launch, 8,290 specials used the new targeting rules.',
        'Designed a mobile workflow that turned a two-part data-entry process into a real-time check-in, cutting the work of moving someone in by more than half. Handed to the iOS team as SwiftUI.',
        'Designed a field mobile experience that put daily on-site information on the phone, so staff could answer in the moment instead of taking a note and finishing it at a desk.',
      ],
    },
    {
      company: 'FamilySearch',
      dates: '2017 – 2019',
      title: 'UX Designer',
      bullets: [
        'Led product design of 26 personalized discovery experiences that served as an entry point and a reason to come back.',
        'Those campaigns retained 95% more members and 107% more other users than the previous year, reached 1.1 million people outside the US, and earned 90% positive feedback from 86,000 comments.',
        'Oversaw third-party design so each campaign used the same tried-and-true loop.',
        'Refined how the product team worked so we moved faster, did more thorough work, and ran into fewer surprises.',
      ],
    },
  ],
};

const tinyHealthResume: ResumeContent = {
  role: 'Product Designer',
  location: 'Pleasant Grove, Utah, open to remote',
  profileLede: 'How I think about product design:',
  profile:
    'I design products people come back to. I turn complex, high-stakes information into a clear next step, working from research and production data through interaction design, visual craft, and engineering delivery. Web and mobile. As the only designer or through a team.',
  skills: [
    'End-to-end product design',
    'Simplifying complex information',
    'Field and user research',
    'Interaction design',
    'Visual craft',
    'Design systems',
    'Web and mobile',
    'Retention and habit loops',
    'Figma (prototype, handoff)',
    'Production data',
    'AI-assisted delivery',
    'Cursor · Expo · SwiftUI',
  ],
  education: {
    degree: 'BFA, Graphic Design',
    school: 'Brigham Young University–Idaho',
    year: '2017',
  },
  jobs: [
    {
      company: 'Entrata',
      dates: 'July 2019 – 2026',
      title: 'Senior Product Designer · Product Lead (~1 year)',
      bullets: [
        'Dedicated designer for Greystar, one of the largest U.S. multifamily operators.',
        'Product Lead for about 1 year with an owned engineering team, from research through ship.',
        'Simplified core workflows for Homebody, a resident-facing self-serve mobile app. After launch, 4.4/5 on iOS from 600+ reviews in the first 6 months.',
        'Led a team that designed and built an AI flow to read income documents and autofill affordable-housing certification, so a long, high-pressure application became an upload. Hundreds of teams entered. We won Most Likely to Land a New Logo.',
        'Redesigned a complex enterprise setup system so one offer could carry multiple targeted incentives, adding flexibility without adding complexity. After launch, 8,290 specials used the new targeting rules.',
        'Designed a field mobile experience that put daily on-site information on the phone, so people could act in the moment instead of finishing later at a desk.',
        'Designed a mobile workflow that turned a two-part data-entry process into a real-time check-in, cutting the work of moving someone in by more than half. Handed to the iOS team as SwiftUI.',
      ],
    },
    {
      company: 'FamilySearch',
      dates: '2017 – 2019',
      title: 'UX Designer',
      bullets: [
        'Led product design of 26 personalized discovery experiences that made a named ancestor real before asking anyone to search. Each one was an entry point and a reason to come back.',
        'Those campaigns retained 95% more members and 107% more other users than the previous year, reached 1.1 million people outside the US, and earned 90% positive feedback from 86,000 comments.',
        'Oversaw third-party design so each campaign used the same tried-and-true loop: a true hook from data we already had, relationship in a sentence, one next action.',
        'Refined how the product team worked so we moved faster, did more thorough work, and ran into fewer surprises.',
      ],
    },
  ],
};

const caliberResume: ResumeContent = {
  role: 'Product Designer',
  location: 'Pleasant Grove, Utah, open to remote',
  profileLede: 'How I think about product design:',
  profile:
    'I design products people come back to, not screens that merely ship. I work from evidence: field research, production data, and call research. Visuals matter when they serve a job. I can own look and feel as the only designer, and I can lead through a team, framing the problem and partnering with engineering either way.',
  skills: [
    'Retention and habit loops',
    'Field and call research',
    'Production data',
    'Systems UX',
    'Visual craft',
    'AI-assisted prototyping',
    'End-to-end product design',
    'Figma (prototype, handoff)',
    'Engineering partnership',
    'Web and mobile',
    'Cursor · Expo · SwiftUI',
    'FigJam',
  ],
  education: {
    degree: 'BFA, Graphic Design',
    school: 'Brigham Young University–Idaho',
    year: '2017',
  },
  jobs: [
    {
      company: 'Entrata',
      dates: 'July 2019 – 2026',
      title: 'Senior Product Designer · Product Lead (~1 year)',
      summary:
        'Property-management software used by apartment staff and residents.',
      bullets: [
        'Dedicated designer for Greystar, one of the largest U.S. multifamily operators.',
        'Product Lead with an owned engineering team.',
        'Translated core Resident Portal workflows into the Homebody resident app and simplified them for a mobile-first, self-serve experience. After launch, Homebody sat at 4.4/5 on iOS from 600+ resident reviews.',
        'Redesigned how staff create rental promotions so one offer can include multiple gifts or credits. Usability testing kept the flow inside the setup staff already knew. After launch, that choice, which did not exist before, was in use across dozens of clients, and 8,290 specials used the new targeting rules.',
        'Designed a mobile move-in flow so staff can check residents in at the table even without reliable Wi-Fi, instead of marking a spreadsheet and re-entering everyone the next day. Site visits and production data set the scope. Handed to the iOS team as SwiftUI.',
        'Designed a field mobile experience around looking up a resident and taking the next action, based on customer interviews and sales-call recordings. The bet: people keep an app they use every day, not one leadership mandates they download.',
      ],
    },
    {
      company: 'FamilySearch',
      dates: '2017 – 2019',
      title: 'UX Designer',
      bullets: [
        'Led product design for personalized discovery experiences (Pioneer, Ancestor Calendar, WWI Draft, and 26 campaigns in total) that showed beginners a specific ancestor and one next step, instead of sending them to a search box.',
        'Those campaigns retained 95% more members and 107% more other users than the previous year, reached 1.1 million people outside the US, and earned 90% positive feedback from 86,000 comments. Calendar used birthdays already in the tree as a reason to come back the next month.',
        'Set campaign goals with product managers, and oversaw third-party design so each campaign reused the same product loop instead of becoming a one-off marketing site.',
      ],
    },
  ],
};

const canopyResume: ResumeContent = {
  role: 'Senior Product Designer',
  location: 'Pleasant Grove, Utah',
  profileLede: 'How I work on a product team:',
  profile:
    'I embed with product and engineering to turn complex professional workflows into a clear next step. I research with customers, prototype to test the interaction, and stay through handoff. Figma when the canvas is faster, code when the behavior is the question. AI in my process, and AI in the product, so people can direct it, trust it, and stay in control.',
  skills: [
    'End-to-end product / UX design',
    'Customer research and usability testing',
    'Complex B2B workflows',
    'AI product experiences',
    'AI-assisted research and prototyping',
    'Figma (flows, prototype, handoff)',
    'Code and canvas',
    'Design systems',
    'Web, mobile, accessibility',
    'Engineering partnership',
    'Coaching and critique',
    'Cursor · Expo · SwiftUI',
  ],
  education: {
    degree: 'BFA, Graphic Design',
    school: 'Brigham Young University–Idaho',
    year: '2017',
  },
  jobs: [
    {
      company: 'Entrata',
      dates: 'July 2019 – 2026',
      title: 'Senior Product Designer · Product Lead (~1 year)',
      summary:
        'B2B property-management software used by apartment staff and residents.',
      bullets: [
        'Dedicated designer for Greystar, one of the largest U.S. multifamily operators.',
        'Product Lead for about 1 year with an owned engineering team, from research through ship.',
        'Led a team that designed an AI flow to read income documents and autofill affordable-housing certification, so a long application became an upload. Hundreds of teams entered. We won Most Likely to Land a New Logo.',
        'Designed a bulk-upload AI workflow with visible mapping confidence, match buckets, and exception review so staff could direct, trust, and correct the model before anything executed.',
        'Redesigned a complex enterprise setup system so one offer could carry multiple targeted incentives, inside the existing design system, after usability testing showed staff already used that pattern as the map. After launch, 8,290 specials used the new targeting rules.',
        'Simplified Homebody, a resident-facing mobile app. After launch, 4.4/5 on iOS from 600+ reviews in the first 6 months.',
        'Designed a field mobile workflow that turned a two-part data-entry process into a real-time check-in, cutting the work of moving someone in by more than half. Prototyped in code; handed to iOS as SwiftUI.',
      ],
    },
    {
      company: 'FamilySearch',
      dates: '2017 – 2019',
      title: 'UX Designer',
      bullets: [
        'Led product design of 26 personalized discovery experiences that made a named ancestor real before asking anyone to search. Retention rose 95% for members and 107% for other users versus the prior year, with 90% positive feedback from 86,000 comments.',
        'Used beginner retention research and campaign feedback with PMs so each campaign started from a person the tree could already name: relationship in a sentence, one next action.',
        'Guided third-party designers on that same loop so the product stayed cohesive as volume scaled, and tightened how the team worked so we moved faster with fewer surprises.',
      ],
    },
  ],
};

const ashbyResume: ResumeContent = {
  role: 'Product Designer',
  location: 'Pleasant Grove, Utah, remote',
  profileLede: 'How I work on a product team:',
  profile:
    'I take ambiguous product work and turn it into a spec engineering can ship. Some problems I own end to end: framing, IA, interaction, and delivery with an engineering team and no separate PM. Some need a consult, a reused pattern, and a written standard. I use research and production data when they change the bet, and craft when the usability problem is already obvious.',
  skills: [
    'End-to-end product ownership',
    'Specs and written alignment',
    'Information architecture',
    'Layout and interaction design',
    'Desktop SaaS / complex B2B',
    'Design systems and patterns',
    'Engineering partnership',
    'Heuristics and craft',
    'Field research and production data',
    'Customer and GTM collaboration',
    'Figma',
    'Cursor · Expo · SwiftUI',
  ],
  education: {
    degree: 'BFA, Graphic Design',
    school: 'Brigham Young University–Idaho',
    year: '2017',
  },
  jobs: [
    {
      company: 'Entrata',
      dates: 'July 2019 – 2026',
      title: 'Senior Product Designer · Product Lead (~1 year)',
      summary:
        'Desktop property-management SaaS used by staff coordinating thousands of daily tasks. Dedicated designer for Greystar. Product Lead for about a year with an owned engineering team: I framed the work, wrote the specs, and shipped.',
      bullets: [
        'Owned larger features as Product Lead: Jobs-To-Be-Done, navigation, IA, layout, and interaction. Then I wrote the spec and stayed through engineering delivery instead of handing off mocks.',
        'Redesigned a complex desktop setup system so one offer could carry multiple targeted incentives. Usability testing showed staff already used the existing Pricing pattern as the map, so we extended that system instead of shipping a sleek one-off. After launch, 8,290 specials used the new targeting rules.',
        'Embedded with Greystar as their dedicated designer. Worked from site visits, customer interviews, and sales-call recordings, then consulted engineering on layout, flows, and what could reuse existing components.',
        'Designed a field workflow that turned a two-part data-entry process into a real-time check-in, cutting the work of moving someone in by more than half. Site visits and SQL set the scope. Handed to iOS as SwiftUI.',
        'Designed the information architecture for Entrata\'s first property-manager mobile app around the daily job: look up a resident and take the next action, instead of shrinking the desktop product onto a phone.',
      ],
    },
    {
      company: 'FamilySearch',
      dates: '2017 – 2019',
      title: 'UX Designer',
      bullets: [
        'Led product design of 26 personalized discovery experiences. Each one started from a named ancestor and one next action instead of a search lesson. Retention rose 95% for members and 107% for other users versus the prior year.',
        'Set that loop as a standard: hook from data we already had, relationship in a sentence, one next action. Then I oversaw third-party design so volume did not become 26 one-offs.',
        'Tightened how the product team worked so we moved faster, did more thorough work, and ran into fewer surprises.',
      ],
    },
  ],
};

const generalLetter: CoverLetterContent = {
  role: 'Product Designer',
  location: 'Pleasant Grove, Utah, open to remote',
  date: 'August 28, 2026',
  recipient: 'Hiring team',
  position: 'Product Designer',
  paragraphs: [
    'I am applying for a Product Designer role. I design products people come back to. I work from field research, production data, and call research, and I stay with engineering through ship.',
    'At FamilySearch, beginners arrived hoping to feel a connection to their family and met a toolbox built for hobbyists. I led product design for 26 personalized discovery experiences. Each one started from a person already in the tree and offered one next action instead of a search lesson. Retention rose 95% for members and 107% for other users versus the prior year.',
    'At Entrata I spent seven years on that same problem with production data, field research, and engineering partners. That included Homebody, a resident-facing mobile app that reached 4.4 out of 5 on iOS from more than 600 reviews in its first six months; setup systems that had to stay accurate without getting harder to use; and AI flows that turned long paperwork into an upload. For about a year I was Product Lead with an owned engineering team, taking work from research through ship.',
    'I live in Pleasant Grove, Utah, and I am open to remote. I can own look and feel as the only designer, and I can lead through a team. I would welcome the chance to walk you through the work.',
  ],
  signoff: 'Sincerely,',
};

const ashbyLetter: CoverLetterContent = {
  role: 'Product Designer',
  location: 'Pleasant Grove, Utah, remote',
  date: 'August 28, 2026',
  recipient: 'Chris, Head of Product Design',
  position: 'Product Designer',
  paragraphs: [
    'I am applying for the Product Designer role at Ashby. You are not hiring someone to wait for a brief, draw wireframes, and pass mocks to engineering. You want a designer who can own a problem, write the spec, consult when a pattern already exists, and raise the quality of decisions across the product team. That is the work I have been doing.',
    'At Entrata I spent seven years on desktop SaaS used by staff coordinating thousands of daily tasks. For about a year I was Product Lead with an owned engineering team. I framed the work, wrote the spec, and stayed through ship. I was also the dedicated designer for Greystar. Some of that work was owning a feature end to end. Some of it was sitting with engineers on layout, flows, and what could reuse existing components instead of waiting on a mock.',
    'When we redesigned how staff create rental promotions, usability testing showed they already used the existing Pricing pattern as the map. We extended that system instead of shipping a sleek one-off. After launch, 8,290 specials used the new targeting rules. At FamilySearch I set a discovery loop as a standard (named ancestor, relationship in a sentence, one next action) and oversaw third-party design so 26 campaigns did not become 26 one-offs. Retention rose 95% for members and 107% for other users versus the prior year.',
    'I have not designed recruiting software. I have designed for professionals who are underwater in coordination work, and I am used to having my decisions challenged by engineering and product. I live in Pleasant Grove, Utah, and I work remotely.',
    'I would welcome the chance to walk you through the work.',
  ],
  signoff: 'Sincerely,',
};

const canopyLetter: CoverLetterContent = {
  role: 'Senior Product Designer',
  location: 'Pleasant Grove, Utah',
  date: 'August 28, 2026',
  recipient: 'Canopy hiring team',
  position: 'Senior UX Designer',
  paragraphs: [
    'I am applying for the Senior UX Designer role at Canopy. You are building practice management software so accounting firms can spend time on clients instead of the work that buries them. I have not designed for accountants. I have spent seven years on the same kind of problem: complex B2B workflows for professionals who already have a system, and who will not adopt a prettier one if it asks them to relearn their day.',
    'At Canopy, designers embed with product and engineering, research with customers, and stay through handoff. That is how I already work. For about a year at Entrata I was Product Lead with an owned engineering team, from research through ship. I use Figma when the canvas is faster and code when the behavior is the question. I use AI in my own process for synthesis, prototyping, and documentation, and I have designed AI in the product so staff can direct it, trust it, and stay in control.',
    'That included an income-document flow that turned affordable-housing certification into an upload, and a bulk-upload workflow with visible mapping confidence, match buckets, and exception review before anything executed. I also redesigned a complex setup system inside the existing design system after usability testing showed staff already used that pattern as the map. After launch, 8,290 specials used the new targeting rules. At FamilySearch I guided third-party designers on a shared loop so volume did not become 26 one-offs.',
    'I live in Pleasant Grove, Utah. I would welcome the chance to walk you through the work.',
  ],
  signoff: 'Sincerely,',
};

const tinyHealthLetter: CoverLetterContent = {
  role: 'Product Designer',
  location: 'Pleasant Grove, Utah, open to remote',
  date: 'August 18, 2026',
  recipient: 'Tiny Health hiring team',
  position: 'Product Designer',
  paragraphs: [
    'I am applying for the Product Designer role at Tiny Health. Your product has to make complex science feel trustworthy enough that a family will act on it. That is the design work I want to do, and the work I have been doing.',
    'At FamilySearch, beginners arrived hoping to feel a connection to their family and met a toolbox built for hobbyists. I led product design for 26 personalized discovery experiences. Each one started from a person already in the tree (a name, a birthday, or a record) and offered one next action instead of a search lesson. Retention rose 95% for members and 107% for other users versus the prior year. A Tiny Health report has the same job. The value is not 120,000 microbes on a page. It is an expert highlight and an action plan a parent can actually follow.',
    'At Entrata I spent seven years on that same problem with production data, field research, and engineering partners. That included Homebody, a resident-facing mobile app that reached 4.4 out of 5 on iOS from more than 600 reviews in its first six months; setup systems that had to stay accurate without getting harder to use; and AI flows that turned long paperwork into an upload. For about a year I was Product Lead with an owned engineering team, taking work from research through ship. I care more about whether people come back and act than whether the interface looks finished.',
    'I live in Pleasant Grove, Utah, so the 9am to 6pm CST overlap window fits my day. I have not designed in DTC health. I have designed for families at scale, shipped consumer mobile, and sat with experts until the science, or the system, could be said in a sentence a real person would use.',
    'I would welcome the chance to walk you through the work.',
  ],
  signoff: 'Sincerely,',
};

const caliberLetter: CoverLetterContent = {
  role: 'Product Designer',
  location: 'Pleasant Grove, Utah, open to remote',
  date: 'August 28, 2026',
  recipient: 'Caliber hiring team',
  position: 'Product Designer',
  paragraphs: [
    'I am applying for the Product Designer role at Caliber. Josh Holman recommended I reach out. Your product has to change what salespeople actually do after a set of calls, not sit as another training library they ignore. That is a retention problem, and it is the design work I want to do.',
    'At FamilySearch, beginners arrived hoping to feel a connection to their family and met a toolbox built for hobbyists. I led product design for 26 personalized discovery experiences. Each one started from a person already in the tree and offered one next action instead of a search lesson. Retention rose 95% for members and 107% for other users versus the prior year. Calendar used birthdays already in the tree as a reason to come back the next month. A skill gap found in Gong recordings has the same job: one next practice, not a catalog.',
    'At Entrata I spent seven years working from evidence: field research, production data, and call recordings. I designed a field mobile experience around looking up a resident and taking the next action because people keep an app they use every day, not one leadership mandates they download. For about a year I was Product Lead with an owned engineering team. I can own look and feel as the only designer, and I can lead through a team.',
    'I have not designed sales training or AI role play. I have designed for people who will abandon a product that does not earn the next session, and I have used Gong recordings as research, not as decoration. I live in Pleasant Grove, Utah, and I am open to remote.',
    'I would welcome the chance to walk you through the work.',
  ],
  signoff: 'Sincerely,',
};

export const applications: Application[] = [
  {
    id: 'general',
    label: 'General',
    resume: generalResume,
    coverLetter: generalLetter,
  },
  {
    id: 'ashby',
    label: 'Ashby',
    resume: ashbyResume,
    coverLetter: ashbyLetter,
  },
  {
    id: 'canopy',
    label: 'Canopy',
    resume: canopyResume,
    coverLetter: canopyLetter,
  },
  {
    id: 'tiny-health',
    label: 'Tiny Health',
    resume: tinyHealthResume,
    coverLetter: tinyHealthLetter,
  },
  {
    id: 'caliber',
    label: 'Caliber',
    resume: caliberResume,
    coverLetter: caliberLetter,
  },
];

export function getApplication(id: string | null | undefined): Application {
  return applications.find((item) => item.id === id) ?? applications[0];
}

export function isDocKind(value: string | null | undefined): value is DocKind {
  return value === 'resume' || value === 'letter';
}
