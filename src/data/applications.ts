export type DocKind = 'resume' | 'single' | 'letter' | 'ats';

export type Job = {
  company: string;
  dates: string;
  title: string;
  summary?: string;
  bullets: string[];
  /**
   * Splits one employer into ranks. `lead` prints the company once.
   * `rank` is a later title at that same company.
   */
  progression?: 'lead' | 'rank';
};

export type ResumeContent = {
  role: string;
  /** Sits to the right of the role in the header. */
  tenure?: string;
  location: string;
  /** Replaces the default "Profile" heading when set. An empty string omits the heading. */
  profileHeading?: string;
  /** Bold line above the profile paragraph. Sentence case, not a section label. */
  profileTitle?: string;
  profileLede?: string;
  profile: string;
  skills: string[];
  /** Extra skills on the two-column resume only. Shown after the first skill. */
  railSkills?: string[];
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

const general2Resume: ResumeContent = {
  role: 'Product Designer',
  location: 'Utah-based, open to remote',
  profileHeading: 'Senior Product Designer',
  profile:
    'I design from production data, customer feedback, and the outcome the business has to hit. I research and refine until that outcome is measurable and the work is good enough to ship. I partner with engineering while the problem is still being framed.',
  skills: [
    'Team player',
    'Retention and habit loops',
    'UX research and testing',
    'Field and call research',
    'Production data',
    'Systems UX',
    'Visual craft',
    'AI-assisted prototyping',
    'Figma',
    'Cursor',
    'Expo',
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
      title: 'Senior Product Designer · Product Manager hybrid',
      bullets: [
        'I was the sole designer for projects related to the company’s largest client.',
        'I was the product manager and designer who led a remote team of six engineers.',
        'I led the team and created the designs for a hackathon-winning AI workflow that reads income documents and autofills affordable-housing certifications.',
        'I simplified core workflows for Homebody, a resident-facing self-serve mobile app. After launch, it reached 4.4 out of 5 stars on iOS from 600+ reviews in the first 6 months.',
        'I redesigned a complex enterprise setup system to add flexibility without adding complexity. Within the first couple of months, more than 8,000 offers used my new targeting rules.',
        'I cut the work in half by designing a zero-to-one mobile experience for move-in workflows, so staff could move a resident in, in real time, instead of re-entering the record later.',
      ],
    },
    {
      company: 'FamilySearch',
      dates: '2017 – 2019',
      title: 'UX Designer',
      bullets: [
        'I led product design of 26 personalized discovery experiences that served as an entry point and a reason to come back.',
        'Those campaigns retained 95% more members and 107% more other users than the previous year, reached 1.1 million people outside the US, and earned 90% positive feedback from 86,000 comments.',
        'I oversaw third-party design so each campaign used the same tried-and-true loop.',
        'I refined how the product team worked so we moved faster, did more thorough work, and ran into fewer surprises.',
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

const poplResume: ResumeContent = {
  role: 'Senior Product Designer',
  location: 'Pleasant Grove, Utah, remote',
  profileLede: 'How I work on a product team:',
  profile:
    'I design the moment someone captures work in the field, and the desk product that has to trust it later. A phone gets a search and a next step. A web dashboard keeps the rules, the setup, and the catch-up. I extend the design system people already know, and I can say why to engineering.',
  skills: [
    'Web and mobile product design',
    'Complex B2B workflows',
    'Design systems',
    'Figma',
    'Customer interviews and call review',
    'Usability testing',
    'Design process and QA',
    'Information architecture',
    'Visual craft',
    'Engineering partnership',
    'SwiftUI handoff',
    'End-to-end ownership',
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
        'B2B property-management software for staff and residents, on the desktop and in the field. Dedicated designer for Greystar. Product Lead for about a year with an owned engineering team: I framed the work, wrote the spec, and shipped.',
      bullets: [
        'Designed field mobile and the desktop system of record as two products. On the phone, staff look up a person and take the next action. On the desktop, they set up rules and catch up later. Customer interviews and a review of Gong calls set that split.',
        'Designed a table-side move-in flow after three site visits and interviews with about 20 operators: search first, offline in the first release, leftover items as a follow-up task. Handed to the iOS team as SwiftUI. They walked the module and found five defects in about 30 minutes.',
        'Redesigned a mature desktop setup flow so one rental offer could carry multiple targeted incentives, inside the Pricing pattern staff already used. Usability testing kept the work on that system. After launch, 8,290 specials used the new lease-term rules, and 162 specials on 38 clients used multi-select that did not exist before.',
        'Designed an upload flow that matches a spreadsheet to leases, shows three buckets, and waits for a person before anything is written, so an automated catch-up stays something staff can trust.',
        'Simplified Homebody, a resident-facing mobile app. After launch, 4.4/5 on iOS from 600+ reviews in the first six months.',
      ],
    },
    {
      company: 'FamilySearch',
      dates: '2017 – 2019',
      title: 'UX Designer',
      bullets: [
        'Led product design of 26 personalized discovery campaigns on one loop: a named person, the relationship in a sentence, one next action. Retention rose 95% for members and 107% for other users versus the prior year, with 90% positive feedback from 86,000 comments.',
        'Oversaw third-party design so each campaign used that loop and the same visual system.',
        'Refined how the product team worked so we moved faster, did more thorough work, and ran into fewer surprises.',
      ],
    },
  ],
};

const engineResume: ResumeContent = {
  role: 'Senior Product Designer',
  location: 'Pleasant Grove, Utah, remote',
  profileLede: 'How I work on a product team:',
  profile:
    'I embed with product and engineering to turn complex professional workflows into a clear next step. I research with customers, prototype to test the interaction, and stay through handoff. Figma when the canvas is faster, code when the behavior is the question. AI in my process, and AI in the product, so people can direct it, trust it, and stay in control.',
  skills: [
    'Search, compare, and choose',
    'Patterns that scale past design',
    'End-to-end product design',
    'Prototypes in code',
    'AI as a daily tool',
    'Cursor',
    'Design systems',
    'Stakeholder partnership',
    'Design reviews',
    'Figma',
    'Production data',
    'SwiftUI handoff',
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
      title: 'Senior Product Designer (7 years) · Product Lead (~1 year)',
      summary:
        'B2B property-management software for staff and residents. Dedicated designer for Greystar. Product Lead for about a year with an owned engineering team: I framed the work with product and engineering, wrote the spec, and shipped.',
      bullets: [
        'Designed a table-side move-in flow as search, readiness, and confirm, after three site visits and interviews with about 20 operators. The old job was a spreadsheet marked in the line and re-entered the next day. Handed to the iOS team as SwiftUI. They walked the module and found five defects in about 30 minutes.',
        'Set the information architecture for Entrata’s first property-manager app around looking up a person and taking the next action, from customer interviews and sales-call recordings.',
        'Redesigned a mature setup flow so one rental offer could carry multiple targeted incentives, inside the Pricing pattern staff already used. Usability testing kept the work on that system, so other teams inherited the contract. After launch, 8,290 specials used the new lease-term rules, and 162 specials on 38 clients used multi-select that did not exist before.',
        'Led a team that designed an AI flow to read income documents and autofill affordable-housing certification, so a long application became an upload. Hundreds of teams entered. We won Most Likely to Land a New Logo.',
      ],
    },
    {
      company: 'FamilySearch',
      dates: '2017 – 2019',
      title: 'UX Designer',
      bullets: [
        'Led product design of 26 discovery campaigns on one loop: a specific person already on the tree, the relationship in a sentence, one next action. Retention rose 95% for members and 107% for other users versus the prior year, with 90% positive feedback from 86,000 comments, and 1.1 million people outside the US engaged.',
        'Set that loop as the standard and oversaw third-party design so later campaigns shipped on the pattern.',
        'Refined how the product team gathered feedback and made decisions, so we moved faster and ran into fewer surprises.',
      ],
    },
  ],
};

const rulaResume: ResumeContent = {
  role: 'Senior Product Designer',
  location: 'Pleasant Grove, Utah, remote',
  profileLede: 'How I work on a product team:',
  profile:
    'I design the tools a practice uses between the moments that matter. I take a multi-step operations workflow, find where people leave the system, and put a reviewed next step back in the day. I research with the people who run the work, prototype in Figma or in code, and stay with product and engineering through delivery. When AI belongs in the product, the person can see the result, correct it, and stay accountable.',
  skills: [
    'Multi-step workflow design',
    'Operations and practice software',
    'AI experiences with human review',
    'End-to-end ownership',
    'Figma (flows, prototype, systems)',
    'Research with operators',
    'Written workflow alignment',
    'Design systems',
    'Product and engineering partnership',
    'Production data',
    'Prototypes in code',
    'Cursor · SwiftUI',
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
      title: 'Senior Product Designer (7 years) · Product Lead (~1 year)',
      summary:
        'B2B property-management software for staff who run a property. Dedicated designer for Greystar. Product Lead for about a year with an owned engineering team: I framed the work, wrote the spec, and shipped.',
      bullets: [
        'Designed a table-side move-in flow as search, readiness, and confirm, after three site visits, interviews with about 20 operators, and a production audit that found about 36% of move-ins at a large student operator had no product activity that day. Handed to the iOS team as SwiftUI. They walked the module and found five defects in about 30 minutes.',
        'Designed an upload that matches a spreadsheet to leases, sorts rows into three buckets, and waits for a person before anything is written, so an automated catch-up stays something staff can trust.',
        'Led a team that designed an AI flow to read income documents and autofill affordable-housing certification, so a long, regulated application became an upload a person could still review. Hundreds of teams entered. We won Most Likely to Land a New Logo.',
        'Redesigned a mature setup flow so one offer could carry multiple targeted incentives, inside the Pricing pattern staff already used. Usability testing kept the work on that system. After launch, 8,290 specials used the new lease-term rules, and 162 specials on 38 clients used multi-select that did not exist before.',
        'Set the information architecture for Entrata’s first property-manager app around looking up a person and taking the next action, from customer interviews and sales-call recordings.',
      ],
    },
    {
      company: 'FamilySearch',
      dates: '2017 – 2019',
      title: 'UX Designer',
      bullets: [
        'Led product design of 26 discovery campaigns on one documented loop: a named person, the relationship in a sentence, one next action. I oversaw third-party design so later campaigns shipped on that pattern.',
        'Retention rose 95% for members and 107% for other users versus the prior year, with 90% positive feedback from 86,000 comments, and 1.1 million people outside the US engaged.',
      ],
    },
  ],
};

const slateResume: ResumeContent = {
  role: 'Senior Product Designer',
  location: 'Pleasant Grove, Utah, remote',
  profileLede: 'How I work on a product team:',
  profile:
    'I design the path from first interest to a product someone keeps. A phone gets the everyday job. A web flow holds the choices, and those choices stay one system as they multiply. I set the pattern other people can ship on, and I prototype in code when the behavior is the question.',
  skills: [
    'Multi-surface product design',
    'Mobile patterns and SwiftUI handoff',
    'Web configuration flows',
    'Design systems and standards',
    'Onboarding, activation, and retention',
    'AI features with a human check',
    'AI-assisted prototyping',
    'Figma (components, prototype, handoff)',
    'Critique and team standards',
    'Field research and production data',
    'Engineering partnership',
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
      title: 'Senior Product Designer (7 years) · Product Lead (~1 year)',
      summary:
        'Property-management software for staff and residents, on the desktop and on the phone. Dedicated designer for Greystar. Product Lead for about a year with an owned engineering team: I framed the work, wrote the spec, and shipped.',
      bullets: [
        'Designed a table-side move-in flow as search, readiness, and confirm, after three site visits and interviews with about 20 operators. The first release worked when the Wi-Fi was down. Handed to the iOS team as SwiftUI. They walked the module and found five defects in about 30 minutes.',
        'Set the information architecture for Entrata’s first property-manager app around looking up a person and taking the next action, from customer interviews and sales-call recordings. Desktop work that needed a desk stayed off the phone.',
        'Simplified Homebody, a resident-facing mobile app. After launch, 4.4/5 on iOS from 600+ reviews in the first 6 months.',
        'Redesigned a mature setup flow so one rental offer could carry multiple targeted incentives, inside the Pricing pattern staff already used. Usability testing kept the work on that system, and other teams inherited the contract. After launch, 8,290 specials used the new lease-term rules, and 162 specials on 38 clients used multi-select that did not exist before.',
        'Designed an upload that matches a spreadsheet to leases, sorts rows into three confidence buckets, and waits for a person before anything is written.',
      ],
    },
    {
      company: 'FamilySearch',
      dates: '2017 – 2019',
      title: 'UX Designer',
      bullets: [
        'Led product design of 26 discovery campaigns on one loop: a named person, the relationship in a sentence, one next action. Each campaign was an entry point and a reason to come back.',
        'Retention rose 95% for members and 107% for other users versus the prior year, with 90% positive feedback from 86,000 comments, and 1.1 million people outside the US engaged.',
        'Oversaw third-party design so later campaigns shipped on that loop and the same visual system, and tightened how the team reviewed work so we moved faster with fewer surprises.',
      ],
    },
  ],
};

const slateLetter: CoverLetterContent = {
  role: 'Senior Product Designer',
  location: 'Pleasant Grove, Utah, remote',
  date: 'September 29, 2026',
  recipient: 'Slate hiring team',
  position: 'Staff Designer',
  paragraphs: [
    'I am applying for the Staff Designer role at Slate. I have loved cars since I was a kid, and the vehicle I still want is the one you are building: something a person can afford, then make their own. The digital job is that same promise. Someone discovers a Slate, configures the truck or SUV they actually need, and keeps living with it after the keys are in their hand.',
    'At Entrata I spent seven years on a phone and a desktop system of record. Staff stood in a move-in line while the product lived on a computer they could not use there. Three site visits and interviews with about twenty operators changed the design to search, readiness, and confirm, including when the Wi-Fi was down. I handed it to the iOS team as SwiftUI, and they found five defects in about thirty minutes before it was in the build. Homebody, the resident app, reached 4.4 out of 5 on iOS from more than 600 reviews in its first six months.',
    'The closer match to a configurator is how staff build a rental offer. A special used to hold one incentive, and two offers meant two specials. Usability testing showed people already used the Pricing pattern as the map, so we extended that system. Other teams inherited the contract. After launch, 8,290 specials used the new lease-term rules, and 162 specials on 38 clients used a multi-select path that had not existed before.',
    'At FamilySearch I led 26 discovery campaigns on one loop: a named person, the relationship in a sentence, one next action. I oversaw outside design so the volume stayed one product. Retention rose 95% for members and 107% for other users versus the prior year. I also design AI so a person can see the result and stay in charge. An upload matches a spreadsheet to leases, sorts the rows into three confidence buckets, and writes nothing until someone confirms.',
    'For about a year I was Product Lead with an owned engineering team. I framed the work, wrote the spec, and stayed through delivery. Vehicle configuration is a new domain for me. The workflow is familiar: a person choosing what they need, and a system that stays coherent as the options multiply. I live in Pleasant Grove, Utah, and I work remotely in the United States. I would welcome the chance to walk you through the work.',
  ],
  signoff: 'Sincerely,',
};

const rulaLetter: CoverLetterContent = {
  role: 'Senior Product Designer',
  location: 'Pleasant Grove, Utah, remote',
  date: 'September 28, 2026',
  recipient: 'Rula hiring team',
  position: 'Senior Product Designer, Provider Team',
  paragraphs: [
    'I am applying for the Senior Product Designer role on Rula’s Provider Team. A therapist’s hour belongs with the patient, and the tools around that hour decide how much of it survives. I design the administrative workflow so the professional can finish it, trust it, and get back to the person in front of them.',
    'At Entrata I spent seven years on property-management software for the people who run a building. Staff stood in a move-in line while that system lived on a desktop they could not use there. Three site visits and interviews with about twenty operators changed the design to search, readiness, and confirm, including when the Wi-Fi was down. I handed it to the iOS team as SwiftUI, and they found five defects in about thirty minutes before it was in the build.',
    'I have also designed AI where the record has to be right. An upload agent matches a spreadsheet to leases, sorts the rows into three buckets, and writes nothing until a person confirms. A separate flow reads income documents and fills an affordable-housing certification, so a long regulated application becomes an upload a person can still review. Hundreds of teams entered that work, and we won Most Likely to Land a New Logo.',
    'When I redesigned how staff create rental promotions, usability testing showed they already used the existing Pricing pattern as the map. We extended that system, and other teams inherited the contract. After launch, 8,290 specials used the new lease-term rules, and 162 specials on 38 clients used a multi-select path that had not existed before.',
    'For about a year I was Product Lead with an owned engineering team. I framed ambiguous work with product and engineering, wrote the workflow down, and stayed through delivery. I live in Pleasant Grove, Utah, and I work remotely in the United States. I would welcome the chance to walk you through the work.',
  ],
  signoff: 'Sincerely,',
};

const engineLetter: CoverLetterContent = {
  role: 'Senior Product Designer',
  location: 'Pleasant Grove, Utah, remote',
  date: 'September 26, 2026',
  recipient: 'Engine hiring team',
  position: 'Senior Product Designer, Flights',
  paragraphs: [
    'I am applying for the Senior Product Designer, Flights role at Engine. A traveler has a city, a day, and a budget, and then a wall of fares. The design job is the moment they compare and commit, and the pattern that lets product and engineering ship the next change without waiting on a new design. I have not designed flight search. I have spent seven years on that turn.',
    'At Entrata, staff stood in a move-in line while the real product lived on a desktop they could not use there. Three site visits and interviews with about twenty operators changed the design to search, readiness, and confirm. I handed it to the iOS team as SwiftUI. They walked the module and found five defects in about thirty minutes, before it was in the build. I also set the information architecture for Entrata’s first property-manager app around looking up a person and taking the next action, after customer interviews and a review of sales-call recordings. For about a year I was Product Lead with an owned engineering team. I framed the work with product and engineering, wrote the spec, and stayed through ship.',
    'When I redesigned how staff create rental promotions, usability testing showed they already used the existing Pricing pattern as the map. We extended that system, and other teams inherited the contract. After launch, 8,290 specials used the new lease-term rules, and multi-select incentives shipped as a behavior that had not existed before. At FamilySearch I led 26 discovery campaigns on one loop and oversaw outside design so the volume stayed one product. Retention rose 95% for members and 107% for other users versus the prior year. I also tightened how that team reviewed work, so we moved faster and ran into fewer surprises.',
    'Cursor is how I prototype, write the spec, and show a behavior. I have also put AI inside the product: an income-document flow that turned a long certification into an upload. Hundreds of teams entered that work, and we won Most Likely to Land a New Logo. I live in Pleasant Grove, Utah, and I work remotely in the US.',
    'I would welcome the chance to walk you through the work.',
  ],
  signoff: 'Sincerely,',
};

const poplLetter: CoverLetterContent = {
  role: 'Senior Product Designer',
  location: 'Pleasant Grove, Utah, remote',
  date: 'September 26, 2026',
  recipient: 'Ryan Alvarez-Cohen, Chief Product Officer',
  position: 'Senior Product Designer',
  paragraphs: [
    'I am applying for the Senior Product Designer role at Popl. A rep on a show floor has a few seconds between conversations. The badge scan has to be fast on a phone, and it has to land in the dashboard as a lead the revenue team can actually work. I have spent seven years on that split: capture in the moment, and a system of record that stays powerful without getting harder to use.',
    'At Entrata, apartment staff stood in a move-in line while the real product lived on a desktop they could not use there. Three site visits and interviews with about twenty operators changed the design. Search came first, offline shipped in the first release, and leftover checklist items became a follow-up instead of a second data-entry shift. I handed it to the iOS team as SwiftUI. They walked the module and found five defects in about thirty minutes, before it was in the build. I also set the information architecture for Entrata’s first property-manager app around looking up a person and taking the next action, after customer interviews and a review of Gong calls. Homebody, the resident app, reached 4.4 out of 5 on iOS from more than 600 reviews in its first six months.',
    'You will inherit a feature-rich product, and the work is to unify it. When I redesigned how staff create rental promotions, usability testing showed they already used the existing Pricing pattern as the map. We extended that system. After launch, 8,290 specials used the new lease-term rules, and multi-select incentives shipped as a behavior that had not existed before. At FamilySearch I led 26 discovery campaigns on one loop and oversaw outside design so the volume stayed one product. Retention rose 95% for members and 107% for other users versus the prior year. I also tightened how that team worked so we moved faster and ran into fewer surprises.',
    'For about a year I was Product Lead with an owned engineering team. I framed the work, wrote the spec, and made the tradeoff in the room. Event lead capture and a Salesforce sync are new domains for me. The workflow is familiar: a person in the field records something that has to land correctly later, and the desk product has to show its work. I have a BFA in graphic design, so a marketing surface gets the same care as the product. I live in Pleasant Grove, Utah, and I work remotely.',
    'I would welcome the chance to walk you through the work.',
  ],
  signoff: 'Sincerely,',
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

const bambooHrResume: ResumeContent = {
  role: 'Product Designer',
  location: 'Pleasant Grove, Utah',
  profileLede: 'How I work on a product team:',
  profile:
    'I design inside the system people already use. I research with the people doing the work, test the interaction, and finish a visual UI that follows the design system. I use AI in my own process, and I design AI so a person can direct it, trust it, and stay in control.',
  skills: [
    'Interaction design and visual UI',
    'Design systems',
    'User research and usability testing',
    'Information architecture',
    'Prototyping',
    'Desktop SaaS / complex B2B',
    'AI product experiences',
    'AI-assisted research and prototyping',
    'Figma (flows, prototype, handoff)',
    'Engineering partnership',
    'Web and mobile',
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
        'Redesigned a complex setup system so one offer could carry multiple targeted incentives, inside the existing design system, after usability testing showed staff already used that pattern as the map. After launch, 8,290 specials used the new targeting rules.',
        'Led a team that designed an AI flow to read income documents and autofill affordable-housing certification, so a long application became an upload a person could still review. Hundreds of teams entered. We won Most Likely to Land a New Logo.',
        'Designed a bulk-upload workflow with visible mapping confidence, match buckets, and exception review so staff could direct, trust, and correct the model before anything executed.',
        'Dedicated designer for Greystar. Worked from site visits, customer interviews, and sales-call recordings, then sat with engineering on layout, flows, and what could reuse existing components.',
        'Product Lead for about 1 year with an owned engineering team, from research through ship.',
        'Simplified Homebody, a resident-facing mobile app. After launch, 4.4/5 on iOS from 600+ reviews in the first 6 months.',
      ],
    },
    {
      company: 'FamilySearch',
      dates: '2017 – 2019',
      title: 'UX Designer',
      bullets: [
        'Led product design of 26 personalized discovery experiences on one loop: a named person, the relationship in a sentence, one next action. Retention rose 95% for members and 107% for other users versus the prior year.',
        'Set that loop as a standard and guided third-party design so the volume stayed one product, with the same visual system.',
      ],
    },
  ],
};

const bambooHrLetter: CoverLetterContent = {
  role: 'Product Designer',
  location: 'Pleasant Grove, Utah',
  date: 'September 29, 2026',
  recipient: 'BambooHR hiring team',
  position: 'Product Designer',
  paragraphs: [
    'I am applying for the Product Designer role at BambooHR. HR software has to get out of the way of people doing the actual work. The design job is a flow they can finish inside a system they already know, a visual UI that follows that system, and a clear line for where AI should act and where a person still decides.',
    'At Entrata I spent seven years on that kind of software, for the people who run a building. When we redesigned how staff create rental promotions, usability testing showed they already used the existing Pricing pattern as the map. We extended that system instead of shipping a one-off. After launch, 8,290 specials used the new targeting rules.',
    'I have also designed AI where the record has to be right. An income-document flow turned a long affordable-housing certification into an upload a person could still review. Hundreds of teams entered that work, and we won Most Likely to Land a New Logo. A separate upload shows mapping confidence and waits for a person before anything is written. I use AI in my own process for synthesis, prototyping, and the spec.',
    'I have not designed HR software. I have designed for professionals who are underwater in coordination work, and I am used to working inside a design system with product and engineering. I live in Pleasant Grove, so a Utah hybrid week is a drive I can make. I would welcome the chance to walk you through the work.',
  ],
  signoff: 'Sincerely,',
};

const outsmartResume: ResumeContent = {
  role: 'Principal Product Designer',
  location: 'Pleasant Grove, Utah',
  profileLede: 'How I think about product design:',
  profile:
    'I design products people come back to. I lead the work from the problem through a polished interface. I raise the quality of the people around me. Visual craft is part of the product. I use AI to prototype. I have put AI in the product where a person still decides.',
  skills: [
    'Consumer product design',
    'Retention and habit loops',
    'Visual craft',
    'Interaction design',
    'Design systems',
    'End-to-end product ownership',
    'Coaching and critique',
    'Team player',
    'AI-assisted prototyping',
    'Figma (prototype, handoff)',
    'Engineering partnership',
    'Web and mobile',
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
        'Product Lead for about 1 year with an owned engineering team, from the problem through ship.',
        'Simplified Homebody, a resident-facing mobile app. After launch, 4.4/5 on iOS from 600+ reviews in the first 6 months.',
        'Redesigned a complex setup system so one offer could carry multiple targeted incentives, inside the existing design system, after usability testing showed staff already used that pattern as the map. After launch, 8,290 specials used the new targeting rules.',
        'Led a team that designed an AI flow to read income documents and autofill a long certification, so the application became an upload a person could still review. Hundreds of teams entered. We won Most Likely to Land a New Logo.',
        'Designed a field mobile experience around looking up a person and taking the next action, so the app earned daily use instead of a mandate to download it.',
      ],
    },
    {
      company: 'FamilySearch',
      dates: '2017 – 2019',
      title: 'UX Designer',
      bullets: [
        'Led product design of 26 personalized discovery experiences. Each one started from a named person and one next action, so a beginner had a reason to come back. Retention rose 95% for members and 107% for other users versus the prior year, with 90% positive feedback from 86,000 comments.',
        'Set that loop as the standard and guided outside designers so the volume stayed one product, with the same visual system.',
        'Tightened how the product team worked so we moved faster, did more thorough work, and ran into fewer surprises.',
      ],
    },
  ],
};

const generalResume: ResumeContent = {
  role: 'Senior Product Designer',
  tenure: '10 years',
  location: 'Utah-based, open to remote',
  profile:
    'I partner with engineering, product managers, and users to frame problems, then I design from production data, customer feedback, and the outcome the business has to hit. I research and refine until that outcome is measurable and the work is good enough to ship.',
  skills: [
    'Complex B2B workflows',
    'AI-assisted workflows',
    'Systems UX',
    'UX research and testing',
    'Production data',
    'Visual craft',
    'AI-assisted prototyping',
    'Team player',
    'Figma',
    'Cursor',
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
      title: 'Senior Product Designer · Product Manager hybrid',
      bullets: [
        'I was the sole designer for projects related to the company’s largest client.',
        'I was the product manager and designer who led a remote team of six engineers.',
        'I led the team and created the designs for a hackathon-winning AI workflow that reads income documents and autofills affordable-housing certifications.',
        'I simplified core workflows for Homebody, a resident-facing self-serve mobile app. After launch, it reached 4.4 out of 5 stars on iOS from 600+ reviews in the first 6 months.',
        'I redesigned a complex enterprise setup system to add flexibility without adding complexity. Within the first couple of months, more than 8,000 offers used my new targeting rules.',
        'I cut the work in half by designing a zero-to-one mobile experience for move-in workflows, so staff could move a resident in, in real time, instead of re-entering the record later.',
      ],
    },
    {
      company: 'FamilySearch',
      dates: '2017 – 2019',
      title: 'UX Designer',
      bullets: [
        'I led product design of 26 personalized discovery experiences that served as an entry point and a reason to come back.',
        'Those campaigns retained 95% more members and 107% more other users than the previous year, reached 1.1 million people outside the US, and earned 90% positive feedback from 86,000 comments.',
        'I oversaw third-party design so each campaign used the same tried-and-true loop.',
        'I refined how the product team worked so we moved faster, did more thorough work, and ran into fewer surprises.',
      ],
    },
  ],
};

const fieldguideLetter: CoverLetterContent = {
  role: 'Senior Product Designer',
  location: 'Pleasant Grove, Utah, remote',
  date: 'September 29, 2026',
  recipient: 'Fieldguide hiring team',
  position: 'Senior Product Designer',
  paragraphs: [
    'I am applying for the Senior Product Designer role on Fieldguide’s Audit team. Auditors spend their days proving a business can be trusted. A lot of that day is evidence, review, and the same checks again. The software should take that repetition off their plate and leave the judgment with them.',
    'I have not designed audit software. I have spent seven years on work that has to be right, with an AI step a person can see and correct. At Entrata I led the design for a flow that reads income documents and fills an affordable-housing certification. A long application became an upload. Hundreds of teams entered, and we won Most Likely to Land a New Logo. A separate upload matches a spreadsheet to leases, sorts the rows into three buckets, and writes nothing until someone confirms.',
    'When one promotion needed to hold more than one offer, staff already knew the Pricing screen, so we extended that screen. Within the first couple of months, more than 8,000 offers used the new rules. I was also the product manager and designer for a remote team of six engineers. I framed the problem with them and stayed through ship.',
    'At FamilySearch I led 26 discovery experiences on one loop, and I worked with outside designers so it stayed one product. The next year we kept 95% more members and 107% more other people. I tightened how that team worked so we moved faster and ran into fewer surprises.',
    'I use AI when I prototype. I live in Pleasant Grove, Utah, and I work remotely in the United States. I would like to walk you through the work.',
  ],
  signoff: 'Sincerely,',
};

const netsmartResume: ResumeContent = {
  role: 'Solution Strategist',
  location: 'Pleasant Grove, Utah, remote',
  profileLede: 'How I work on a product team:',
  profile:
    'I learn the workflow from the people who run it, design the path they can follow, and write the requirements engineering ships. For about a year I was Product Lead with an owned engineering team. The design makes the scope concrete, so a client or an engineer can react before the wrong thing gets built.',
  skills: [
    'Requirements and acceptance criteria',
    'Workflow and interaction design',
    'Roadmap and scope with engineering',
    'Figma prototypes',
    'Research with operators',
    'Stakeholder communication',
    'Complex B2B workflows',
    'Production data',
    'Client partnership',
    'AI a person can review',
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
      title: 'Senior Product Designer (7 years) · Product Lead (~1 year)',
      summary:
        'Property-management software for staff who run a property. Dedicated designer for Greystar. Product Lead for about a year with an owned engineering team: I designed the workflow, wrote the spec, and shipped.',
      bullets: [
        'Designed a table-side move-in flow as search, readiness, and confirm, after three site visits and interviews with about 20 operators. The old job was a spreadsheet marked in the line and re-entered the next day. Handed to the iOS team as SwiftUI. They walked the module and found five defects in about 30 minutes.',
        'Designed an AI flow that reads income documents and fills an affordable-housing certification, so a long regulated application became an upload a person can still review. I led the team. Hundreds of teams entered. We won Most Likely to Land a New Logo.',
        'Redesigned the Pricing flow staff already used so one rental offer could carry multiple targeted incentives. Usability testing kept the work on that screen, and other teams inherited the design. After launch, 8,290 specials used the new lease-term rules, and 162 specials on 38 clients used multi-select that did not exist before.',
        'Designed simpler core workflows for Homebody, a resident mobile app. After launch, 4.4/5 on iOS from 600+ reviews in the first 6 months.',
      ],
    },
    {
      company: 'FamilySearch',
      dates: '2017 – 2019',
      title: 'UX Designer',
      bullets: [
        'Led the design of 26 discovery campaigns on one loop: a named person, the relationship in a sentence, one next action. I worked with outside designers so later campaigns shipped on that pattern.',
        'Retention rose 95% for members and 107% for other users versus the prior year, with 90% positive feedback from 86,000 comments, and 1.1 million people outside the US engaged. I also tightened how the team made decisions, so we moved faster and ran into fewer surprises.',
      ],
    },
  ],
};

const netsmartLetter: CoverLetterContent = {
  role: 'Solution Strategist',
  location: 'Pleasant Grove, Utah, remote',
  date: 'October 2, 2026',
  recipient: 'Netsmart hiring team',
  position: 'Solution Strategist',
  paragraphs: [
    'I am applying for the Solution Strategist role at Netsmart. Clinics that provide medication-assisted treatment have to dose, document, and bill inside rules that change, often across more than one care record. The product has to carry that day so the clinician can stay with the patient. I have done that job as a designer: learn the work, design the path, and hold the scope until it ships.',
    'I have not worked in an opioid treatment program or an electronic health record. I have spent seven years at Entrata designing property-management software for the people who run a building. Staff stood in a move-in line while that system lived on a desktop they could not use there. Three site visits and interviews with about twenty operators changed the design to search, readiness, and confirm. I designed that flow and handed it to the iOS team as SwiftUI. They walked the module and found five defects in about thirty minutes, before it was in the build.',
    'That move-in work was the Product Lead year. I designed the property-manager mobile app with an owned engineering team and stayed through delivery. Before that, as a Senior Product Designer, I led a hackathon team that designed a flow to read income documents and fill an affordable-housing certification, so a long regulated application became an upload a person could still review. Hundreds of teams entered, and we won Most Likely to Land a New Logo. I also designed simpler workflows for Homebody, a resident app that reached 4.4 out of 5 on iOS from more than 600 reviews in its first six months. When a rental offer needed to hold more than one incentive, I redesigned the Pricing screen staff already used, and other teams inherited that design. After launch, 8,290 specials used the new rules.',
    'At FamilySearch I led the design of 26 discovery campaigns on one loop and worked with outside designers so they stayed one product. Retention rose 95% for members and 107% for other users versus the prior year. I also tightened how that team made decisions, so we moved faster and ran into fewer surprises.',
    'Opioid treatment, pharmacy, and e-prescribing are new to me. The parallel is a person in the middle of a regulated workflow, a record that has to be right, and a design that meets them where the work happens. I live in Pleasant Grove, Utah, and I work remotely in the United States. I would welcome the chance to walk you through the work.',
  ],
  signoff: 'Sincerely,',
};

const netsmartCassResume: ResumeContent = {
  role: 'Product & Solution Strategist',
  tenure: '10 years',
  location: 'Utah-based, open to remote',
  profile:
    'I partner with stakeholders, engineers, product managers, and customers to turn complex workflows into clear requirements and roadmaps. I research to find and validate problems, document what the product must do, design coded interactive prototypes and work with engineering until the solution ships and the results are measurable.',
  skills: [
    'Requirements and user stories',
    'Roadmaps and scope management',
    'Client discovery and workshops',
    'Complex B2B workflows',
    'Regulated, document-heavy workflows',
    'Data capture and automation',
    'AI-assisted workflows',
    'Usage data and market research',
    'UX research and testing',
    'Cross-team collaboration',
    'Stakeholder communication',
    'Prototyping',
    'Tools',
    'Figma',
    'FigJam',
    'Cursor',
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
      title: 'Senior Product Designer · Product Manager hybrid',
      bullets: [
        'Led a remote team of engineers as product manager and designer. Owned scope, requirements, and prototypes from discovery through launch.',
        'Served as sole designer for projects tied to the company’s largest client. Translated that client’s operational needs into workflows engineering could build.',
        'Led the team and designed a hackathon-winning AI workflow that reads income documents and autofills affordable-housing certifications, replacing manual entry in a compliance-driven process.',
        'Designed a zero-to-one mobile experience for move-in workflows. Staff now move a resident in, in real time, instead of re-entering the record later, which cut the work in half.',
        'Redesigned a complex enterprise setup system to add flexibility without adding complexity. More than 8,000 offers used the new targeting rules within the first couple of months.',
        'Simplified core workflows for Homebody, a resident-facing self-serve mobile app. It reached 4.4 out of 5 stars on iOS from 600+ reviews in the first 6 months.',
      ],
    },
    {
      company: 'FamilySearch',
      dates: '2017 – 2019',
      title: 'UX Designer',
      bullets: [
        'Led product design of 26 personalized discovery experiences that gave members an entry point and a reason to come back.',
        'Retained 95% more members and 107% more other users than the previous year. Reached 1.1 million people outside the US and earned 90% positive feedback from 86,000 comments.',
        'Oversaw third-party design so every campaign followed the same tried-and-true loop.',
        'Refined how the product team worked, so the team moved faster, did more thorough work, and ran into fewer surprises.',
      ],
    },
  ],
};

const netsmartCassLetter: CoverLetterContent = {
  role: 'Product & Solution Strategist',
  location: 'Utah-based, open to remote',
  date: 'October 2, 2026',
  recipient: 'Dear Hiring Team,',
  position: '',
  paragraphs: [
    'I’m applying for the Solution Strategist role. What caught my attention about the this role is how closely it aligns with the work I’ve spent the past seven years doing—bringing together complex client needs, operational realities, and technology to create solutions that work in practice. I’ve built my career in B2B software, partnering closely with clients, engineering, and internal teams to translate those needs into clear requirements and carry them through to delivery. Bringing that experience to behavioral health feels like a natural and meaningful next step.',
    'My BFA in graphic design opened the door to my career. It led to my first role at FamilySearch and then to Entrata, where I grew from designer into product manager and team lead. At Entrata, I led a remote team of engineers and owned scope, requirements, and prototypes from discovery through launch. I also served as sole designer on projects for the company’s largest client, so I represented Entrata directly in front of their stakeholders.',
    'My artistic design background gives me a practical strength: I catch a client’s vision, including the parts they struggle to put into words, and turn it into concrete plans that engineering and design can build from. That skill matters most when the workflow is complicated and the people who live in it are busy.',
    'Three projects show how I work. I led the team and designed a hackathon-winning AI workflow that reads income documents and autofills affordable-housing certifications, a regulated process where accuracy matters. I designed a mobile move-in experience so staff could move a resident in, in real time, instead of re-entering the record later, which cut the work in half. And I redesigned a complex enterprise setup system, where more than 8,000 offers used the new targeting rules within the first couple of months.',
    'I haven’t worked in OTP or MAT workflows, and I won’t pretend otherwise. I do know how to learn a new domain from the people who work in it: I sit with them, map their workflow, and check my understanding until they confirm it. I would approach clinical workflows, dispensing, PDMP, laboratory, and interoperability needs the same way, and I would treat regulatory changes as requirements to track from the start. I’m comfortable traveling as needed to support client needs, build strong relationships, and ensure successful outcomes.',
    'I connect easily with people, communicate clearly with clinical, technical, and business audiences, and represent my company with care. I also stay loyal to my team and my company. I’ve spent seven years at Entrata because I commit to the people and the work.',
    'Thank you for your time and consideration. I would welcome the chance to talk about how I can help your clients and your team.',
  ],
  signoff: 'Sincerely,',
};

const instacartLetter: CoverLetterContent = {
  role: 'Senior Product Designer',
  location: 'Pleasant Grove, Utah, remote',
  date: 'October 3, 2026',
  recipient: 'Instacart hiring team',
  position: 'Senior Product Designer II, Order Quality',
  paragraphs: [
    'I am applying for the Senior Product Designer II role on Order Quality at Instacart. A customer ordered the groceries they are counting on. Between the cart and the door, a missing item, a substitution, or a shopper who cannot tell what right looks like decides whether that order was worth it.',
    'I have not designed grocery or a marketplace. At Entrata I designed a zero-to-one mobile move-in experience so staff could move a resident in, in real time, instead of re-entering the record later, which cut the work in half. I led that work as product manager and designer with a remote engineering team, and I was the sole designer on projects for the company’s largest client.',
    'I have also designed the experience the person waiting sees. Homebody, a resident app, reached 4.4 out of 5 on iOS from more than 600 reviews in its first six months. At FamilySearch I led 26 personalized discovery experiences that retained 95% more members and 107% more other users than the previous year.',
    'I use AI when I prototype, and I have put it in the product. One workflow reads income documents and fills an affordable-housing certification, so a long form becomes an upload a person can still review.',
    'The parallel is a live order that has to be right for the person waiting and the person picking it. I live in Pleasant Grove, Utah, and I work remotely in the United States. I would welcome the chance to walk you through the work.',
  ],
  signoff: 'Sincerely,',
};

const cricutResume: ResumeContent = {
  role: 'Lead UX Designer',
  location: 'Pleasant Grove, Utah',
  profileHeading: 'Senior Product Designer',
  profile:
    'I partner with product managers, engineers, and customers to turn complex workflows into a clear experience on desktop and mobile. I research to find and validate problems, design the interaction and the visual system, and work with engineering until the solution ships and the results are measurable.',
  skills: [
    'Team player',
    'Visual craft',
    'Systems UX',
    'UX research and testing',
    'Desktop and mobile',
    'Prototyping',
    'Cross-team collaboration',
    'Production data',
    'Figma',
    'Cursor',
    'FigJam',
    'Expo',
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
      title: 'Senior Product Designer · Product Manager hybrid',
      bullets: [
        'Redesigned a complex enterprise setup system to add flexibility without adding complexity. More than 8,000 offers used the new targeting rules within two months.',
        'Designed a zero-to-one mobile experience for move-in workflows. Staff now move a resident in, in real time, instead of re-entering the record later, which cut the work in half.',
        'Simplified core workflows for Homebody, a resident-facing self-serve mobile app. It reached 4.4 out of 5 stars on iOS from 600+ reviews in the first 6 months.',
        'Led a remote team of engineers as product manager and designer. Owned scope, requirements, and prototypes from discovery through launch.',
        'Served as sole designer for projects tied to the company’s largest client. Translated that client’s operational needs into workflows engineering could build.',
        'Led the team and designed a hackathon-winning AI workflow that reads income documents and autofills affordable-housing certifications, replacing manual entry in a compliance-driven process.',
      ],
    },
    {
      company: 'FamilySearch',
      dates: '2017 – 2019',
      title: 'UX Designer',
      bullets: [
        'Led product design of 26 personalized discovery experiences that gave members an entry point and a reason to come back.',
        'Oversaw third-party design so every campaign followed the same tried-and-true loop.',
        'Retained 95% more members and 107% more other users than the previous year. Reached 1.1 million people outside the US and earned 90% positive feedback from 86,000 comments.',
        'Refined how the product team worked, so the team moved faster, did more thorough work, and ran into fewer surprises.',
      ],
    },
  ],
};

const cricutLetter: CoverLetterContent = {
  role: 'Lead UX Designer',
  location: 'Pleasant Grove, Utah',
  date: 'October 5, 2026',
  recipient: 'Cricut hiring team',
  position: 'Lead UX Designer',
  paragraphs: [
    'I am applying for the Lead UX Designer role at Cricut. Someone wants a card that feels like it came from them, a shirt for the family, or a project more ambitious than they have tried. The software has to get them there, and it has to stay easy as the idea gets bigger. I have made with these machines, and that is the product I want to work on.',
    'In my senior exhibition at BYU–Idaho, the class was modular patterns and repeats, and the work was shown in the gallery. Most of it depended on a Cricut. I had it cut Yupo, a plastic paper, so 14-inch sheets could lock together into a large installation, and I used the same kind of cuts on playing cards. I still use Silhouette, a close cousin, for smaller projects, including modifications to my car. The software stays intuitive, and the cut reaches a level of craft a person could not have produced by hand at that scale. It lowers the barrier to making, and it can go past the usual card into work that belongs on a wall.',
    'At Entrata I spent seven years designing desktop and mobile software. Staff stood in a move-in line while the product lived on a computer they could not use there. Three site visits and interviews with about twenty operators changed the design to search, readiness, and confirm, and I handed it to the iOS team as SwiftUI. Homebody, the resident app, reached 4.4 out of 5 on iOS from more than 600 reviews in its first six months.',
    'When a rental offer needed more than one incentive, usability testing showed staff already used the Pricing pattern as the map, so we extended that design language and other teams inherited it. After launch, 8,290 specials used the new lease-term rules. At FamilySearch I led 26 discovery campaigns and guided outside designers onto one visual system. Retention rose 95% for members and 107% for other users versus the prior year. For about a year I was Product Lead with an owned engineering team, from the problem through ship.',
    'I live in Pleasant Grove, so South Jordan is a drive I can make. I am looking for a team I can stay with and do this work well. I would welcome the chance to walk you through the work.',
  ],
  signoff: 'Sincerely,',
};

const outsmartLetter: CoverLetterContent = {
  role: 'Principal Product Designer',
  location: 'Pleasant Grove, Utah',
  date: 'September 29, 2026',
  recipient: 'Outsmart hiring team',
  position: 'Principal Product Designer',
  paragraphs: [
    'People still have to come back tomorrow, even if they are tired of lectures and debt. The next step has to be obvious. The interface has to look cared for. And it has to stay one system as it grows.',
    'At FamilySearch, beginners showed up hoping to feel a connection and got a toolbox built for hobbyists. I led 26 discovery experiences. Each one started with a person already in their tree and gave them one thing to do next. The next year we kept 95% more members and 107% more other people. I made that the standard and worked with outside designers so it stayed one product.',
    'I spent seven years at Entrata on that same kind of work. For about a year I was Product Lead with an engineering team, and I stayed with it from the problem through ship. Staff already knew the Pricing screen, so when one promotion needed to hold more than one offer, we extended that screen. After launch, 8,290 specials used the new rules. Homebody, the resident app, landed at 4.4 out of 5 on iOS from more than 600 reviews in six months. I use AI when I prototype. If AI is in the product, a person still decides.',
    'I have not managed a product design team, and I have not designed a college. I have led the work, helped other designers share one system, and shipped consumer products people came back to. I live in Pleasant Grove, so Lehi is a normal drive. I would like to walk you through the work.',
  ],
  signoff: 'Sincerely,',
};

const enzoHealthResume: ResumeContent = {
  role: 'Senior Designer',
  location: 'Pleasant Grove, Utah',
  profileHeading: 'Senior Designer',
  profile:
    'I partner with engineers, product managers, and the people doing the work. I research in the field, turn a dense regulated workflow into interaction design and visual design, and prototype until engineering can build it. I stay through launch, including artificial intelligence a person reviews before it writes, until the result can be measured.',
  skills: [
    'Team player',
    'Interaction design',
    'Systems thinking',
    'Visual design',
    'Complex B2B workflows',
    'Prototyping',
    'Field research',
    'Figma',
    'Cursor',
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
      title: 'Senior Product Designer · Product Manager hybrid',
      bullets: [
        'Designed a zero-to-one mobile experience for move-in workflows and handed it to the iOS team as SwiftUI. Staff now move a resident in on an iPad in the field, including when the Wi-Fi is down, instead of re-entering the record later, which cut the work in half.',
        'Led the team and designed a hackathon-winning artificial intelligence workflow that reads income documents and autofills affordable-housing certifications. A person reviews the result before it replaces manual entry, so accuracy holds in that compliance-driven process.',
        'Redesigned a complex enterprise setup system and extended its design language without adding complexity. More than 8,000 offers used the new targeting rules within the first couple of months.',
        'Led a remote team of engineers as product manager and designer. Owned scope, requirements, and prototypes from discovery through launch.',
        'Simplified core workflows for Homebody, a resident-facing self-serve mobile app. It reached 4.4 out of 5 stars on iOS from 600+ reviews in the first 6 months.',
      ],
    },
    {
      company: 'FamilySearch',
      dates: '2017 – 2019',
      title: 'UX Designer',
      bullets: [
        'Led product design of 26 personalized discovery experiences that gave members an entry point and a reason to come back.',
        'Retained 95% more members and 107% more other users than the previous year. Reached 1.1 million people outside the US and earned 90% positive feedback from 86,000 comments.',
        'Oversaw third-party design so every campaign followed the same tried-and-true loop.',
      ],
    },
  ],
};

const enzoHealthLetter: CoverLetterContent = {
  role: 'Senior Designer',
  location: 'Pleasant Grove, Utah',
  date: 'October 8, 2026',
  recipient: 'Enzo Health hiring team',
  position: 'Senior Designer',
  paragraphs: [
    'I am applying for the Senior Designer role at Enzo Health. A nurse in the field is charting between visits, and the screen is where that documentation burden lands. When the product drafts a note or suggests a diagnosis, the interface decides whether she trusts it, rejects it, or actually reviews it.',
    'Home health and electronic health records are new to me. I have spent seven years at Entrata on the same kind of day: a person in a regulated workflow, a record that has to stay accurate, and a tool they did not ask to master. I designed a mobile move-in flow and handed it to the iOS team as SwiftUI, so staff could finish on an iPad in the field, including when the Wi-Fi was down, instead of re-entering the record later. That cut the work in half.',
    'I also led the design of an artificial intelligence workflow that reads income documents and fills an affordable-housing certification. A person reviews the result before it replaces manual entry. Hundreds of teams entered, and we won Most Likely to Land a New Logo. For about a year I was product manager and designer with a remote engineering team, and I stayed from the problem through ship.',
    'At FamilySearch I led 26 discovery experiences on one pattern and worked with outside designers so it stayed one product. The next year we kept 95% more members and 107% more other people.',
    'I live in Pleasant Grove, so Lehi is a drive I can make. I would welcome the chance to walk you through the work.',
  ],
  signoff: 'Sincerely,',
};

const stealthStartupResume: ResumeContent = {
  role: 'Product Designer',
  location: 'Pleasant Grove, Utah, open to remote',
  profileHeading: 'Product Designer',
  profile:
    'I partner with engineers and product managers to solve problems that do not have a settled pattern yet. I research user needs, then work through interaction design, visual design, and typography until the interface is clear. I prototype in Figma, extend the design system, and stay through shipping until the result can be measured.',
  skills: [
    'Team player',
    'Visual design',
    'Typography',
    'Interaction design',
    'Design systems',
    'Prototyping',
    'User research',
    'Shipping',
    'Figma',
    'Cursor',
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
      title: 'Senior Product Designer · Product Manager hybrid',
      bullets: [
        'Redesigned a complex enterprise setup system and extended its design language without adding complexity. More than 8,000 offers used the new targeting rules within the first couple of months.',
        'Designed a zero-to-one mobile experience for move-in workflows, from the user flows through prototyping. Staff now move a resident in, in real time, instead of re-entering the record later, which cut the work in half.',
        'Simplified core workflows for Homebody, a resident-facing self-serve mobile app. It reached 4.4 out of 5 stars on iOS from 600+ reviews in the first 6 months.',
        'Led the team and designed a hackathon-winning AI workflow that reads income documents and autofills affordable-housing certifications, replacing manual entry in a compliance-driven process.',
        'Led a remote team of engineers as product manager and designer. Owned scope, requirements, and prototypes from discovery through shipping.',
      ],
    },
    {
      company: 'FamilySearch',
      dates: '2017 – 2019',
      title: 'UX Designer',
      bullets: [
        'Led a creative set of 26 personalized discovery experiences that gave members an entry point and a reason to come back.',
        'Retained 95% more members and 107% more other users than the previous year. Reached 1.1 million people outside the US and earned 90% positive feedback from 86,000 comments.',
        'Oversaw third-party design so every campaign followed the same visual system.',
      ],
    },
  ],
};

const weaveResume: ResumeContent = {
  role: 'Senior Product Designer',
  tenure: '• 10 years',
  location: 'Pleasant Grove, Utah, open to remote',
  profileHeading: '',
  profileTitle: 'More capability, without more complexity',
  profile:
    'I take a setup people already have to live in and make it more capable without making it harder. I research with the people who run it and with product analytics, design the user flows through the edge and error states, and stay with engineering until the pattern ships and the result can be measured.',
  skills: [
    'Collaborative team leader',
    'Systems UX',
    'Complex B2B workflows',
    'UX research and testing',
    'Design thinking',
    'Product analytics',
    'User flows',
    'Production data',
    'Prototyping',
    'Cross-team collaboration',
    'Visual craft',
    'Figma',
    'FigJam',
    'Cursor',
  ],
  railSkills: [
    'Scoping',
    'Clear writing',
    'Stakeholder communication',
    'Remote collaboration',
  ],
  education: {
    degree: 'BFA, Graphic Design',
    school: 'Brigham Young University–Idaho',
    year: '2017',
  },
  jobs: [
    {
      company: 'Entrata',
      dates: '2025 – 2026',
      title: 'Product Lead',
      progression: 'lead',
      bullets: [
        'Led a remote team of six engineers as product manager and designer. Owned scope, requirements, and prototypes from discovery through launch.',
        'Designed a zero-to-one mobile experience for move-in workflows, from the user flows through prototyping. Staff now move a resident in, in real time, instead of re-entering the record later, which cut the work in half.',
      ],
    },
    {
      company: 'Entrata',
      dates: '2020 – 2025',
      title: 'Senior Product Designer',
      progression: 'rank',
      bullets: [
        'Redesigned a complex enterprise setup system and extended its design language without adding complexity. More than 8,000 offers used the new targeting rules within the first couple of months.',
        'Served as sole designer for projects tied to the company’s largest client. Translated that client’s operational needs into workflows engineering could build.',
        'Led the team and designed a hackathon-winning AI workflow that reads income documents and autofills affordable-housing certifications, replacing manual entry in a compliance-driven process.',
      ],
    },
    {
      company: 'Entrata',
      dates: '2019 – 2020',
      title: 'Product Designer',
      progression: 'rank',
      bullets: [
        'Redesigned unit inspection and other facilities workflows so staff could finish the job in fewer steps and take on new features.',
      ],
    },
    {
      company: 'FamilySearch',
      dates: '2017 – 2019',
      title: 'UX Designer',
      bullets: [
        'Oversaw third-party design so every campaign followed the same tried-and-true loop.',
        'Led product design of 26 personalized discovery experiences that gave members an entry point and a reason to come back.',
        'Retained 95% more members and 107% more other users than the previous year. Reached 1.1 million people outside the US and earned 90% positive feedback from 86,000 comments.',
      ],
    },
  ],
};

const weaveLetter: CoverLetterContent = {
  role: 'Senior Product Designer',
  location: 'Pleasant Grove, Utah, open to remote',
  date: 'October 20, 2026',
  recipient: 'Weave hiring team',
  position: 'Senior Product Designer, User Infrastructure',
  paragraphs: [
    'I am applying for the Senior Product Designer role on User Infrastructure at Weave. A practice opens Weave on the first morning, and someone has to get the staff signed in, decide who can see what, and keep that true when the business has two locations or a hundred. Often that someone is one person in IT. If the setup fails, they call support. If it holds, the rest of the product can start.',
    'I have not designed single sign-on, and I have not designed for a dental or veterinary office. I have spent seven years on the same kind of setup. At Entrata I redesigned a complex enterprise system so one offer could carry more than one rule, inside the pattern staff already knew. Within the first couple of months, more than 8,000 offers used the new targeting rules. I also designed a mobile move-in flow so staff could finish while the resident was still there, including when the Wi-Fi was down, instead of re-entering the record later. That cut the work in half.',
    'For about a year I was product manager and designer with a remote team of six engineers, and I stayed from the problem through ship. I was also the sole designer on projects for the company’s largest client. At FamilySearch I led 26 discovery experiences and worked with outside designers so each one used the same loop.',
    'I live in Pleasant Grove, so Lehi is a drive I can make, and I am glad to work remotely in the United States. I would welcome the chance to walk you through the work.',
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
    id: 'general-2',
    label: 'General 2',
    resume: general2Resume,
  },
  {
    id: 'stealth-startup',
    label: 'Stealth Startup',
    resume: stealthStartupResume,
  },
  {
    id: 'cricut',
    label: 'Cricut',
    resume: cricutResume,
    coverLetter: cricutLetter,
  },
  {
    id: 'netsmart',
    label: 'Netsmart',
    resume: netsmartResume,
    coverLetter: netsmartLetter,
  },
  {
    id: 'netsmart-cass',
    label: 'Netsmart Cass Version',
    resume: netsmartCassResume,
    coverLetter: netsmartCassLetter,
  },
  {
    id: 'instacart',
    label: 'Instacart',
    resume: netsmartCassResume,
    coverLetter: instacartLetter,
  },
  {
    id: 'fieldguide',
    label: 'Fieldguide',
    resume: generalResume,
    coverLetter: fieldguideLetter,
  },
  {
    id: 'bamboo-hr',
    label: 'BambooHR',
    resume: bambooHrResume,
    coverLetter: bambooHrLetter,
  },
  {
    id: 'outsmart',
    label: 'Outsmart',
    resume: outsmartResume,
    coverLetter: outsmartLetter,
  },
  {
    id: 'slate',
    label: 'Slate',
    resume: slateResume,
    coverLetter: slateLetter,
  },
  {
    id: 'rula',
    label: 'Rula',
    resume: rulaResume,
    coverLetter: rulaLetter,
  },
  {
    id: 'engine',
    label: 'Engine',
    resume: engineResume,
    coverLetter: engineLetter,
  },
  {
    id: 'enzo-health',
    label: 'Enzo Health',
    resume: enzoHealthResume,
    coverLetter: enzoHealthLetter,
  },
  {
    id: 'popl',
    label: 'Popl',
    resume: poplResume,
    coverLetter: poplLetter,
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
  {
    id: 'weave',
    label: 'Weave',
    resume: weaveResume,
    coverLetter: weaveLetter,
  },
];

export function getApplication(id: string | null | undefined): Application {
  return applications.find((item) => item.id === id) ?? applications[0];
}

export function isDocKind(value: string | null | undefined): value is DocKind {
  return value === 'resume' || value === 'single' || value === 'letter' || value === 'ats';
}
