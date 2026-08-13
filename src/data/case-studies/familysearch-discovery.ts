import type { RichCaseStudy } from './types';

export const familysearchDiscoveryCase: RichCaseStudy = {
  slug: 'familysearch-discovery',
  openingClaim:
    'FamilySearch could fill a stadium with new accounts every week. Almost none of those people came back. Beginners hired the product to feel a connection to someone who came before them, then landed in a toolbox built for hobbyists. I led product design for personalized discovery campaigns from 2017 to 2019: Pioneer, Ancestor Calendar, and WWI Draft. Each one started from a fact already in the tree — a name, a birthday, a draft card — and dropped the person into a product surface that made that ancestor real. The discovery program was part of the 2018 retention work. Returning-user retention lifted 101% year over year. International reach rose 12.4%, 24% over goal. We steered the next campaign from on the order of 86,000 discovery comments, not from a brand calendar.',
  collaborators:
    'FamilySearch product and campaign managers, discovery and research partners, content and records teams (including Cris Rees, Sr. Product Manager)',
  surface:
    'Email plus in-product discovery on FamilySearch.org — home cards, ancestor story surfaces, relationship, and notifications',
  sections: [
    {
      id: 'problem',
      stage: 'Rough',
      title: 'They signed up. They did not stay.',
      body: [
        'FamilySearch is a shared wiki tree. The pitch is that you can find your people and add what you know. Acquisition was not the constraint. People who thought they might find a missing name created an account in droves. FamilySearch research on beginners put the leak in plain numbers: on the order of 15% returned the following month, and fewer than 3% were still coming back at twelve months. Messaging work around the same period sized new signups at tens of thousands a week, with about 3% returning inside three months.',
        'The product those people met was built for someone who already knew how to research. Records, sourcing, and tree tools are powerful once you have a method. They are a wall if you showed up hoping to feel something about a grandparent and instead got a search box.',
        'The job people hired FamilySearch to do was not “become a genealogist.” It was “give me a more accurate picture of my family.” Peace and belonging when a name turns into a person. Campaigns that said “come back and search” were asking beginners to do the hard part first.',
      ],
      metrics: [
        {
          value: '~15%',
          label: 'Beginners returning the month after signup (FamilySearch research)',
        },
        {
          value: '<3%',
          label: 'Still returning at 12 months',
        },
        {
          value: '~86k',
          label: 'Discovery comments used to steer what to personalize next',
        },
      ],
      callout:
        'Acquisition was a stadium. Retention was a leak. The campaigns had to deliver a person, not a prompt to go use the toolbox.',
    },
    {
      id: 'evidence',
      stage: 'Evidence',
      title: 'The hook was already in the tree',
      body: [
        'Discovery comments and beginner research kept repeating the same shape. People did not need another generic “explore your family history” email. They needed a reason that was theirs: a birthday, a pioneer who walked west, a draft card with a signature. Those facts were often already sitting on the tree or in historical records. The product was not using them as a door.',
        'Experience planning with product and campaign managers made the constraint explicit. Marketing could not invent a story the tree did not support. Engineering could not personalize at campaign volume if every send was a one-off landing page. The design job was a repeatable loop: pick a true hook from data we already had, show the relationship so it feels like family, then give one next action that is a story or a record — not a search lesson.',
      ],
      table: {
        headers: ['Input', 'What it changed'],
        rows: [
          [
            'Beginner retention research',
            'Stopped treating signup volume as success. The campaign had to create a second session, then a third.',
          ],
          [
            'JTBD: “I want a more accurate picture of my family”',
            'Designed for connection to a person, not for teaching research skills in the first session.',
          ],
          [
            '~86k discovery comments',
            'Which hooks people answered (photos, dates, military records, pioneer stories) drove the next campaign, not a seasonal theme list.',
          ],
          [
            'Tree and records already on file',
            'Personalization had to be true. If we could not name the ancestor and the relationship, we did not send the campaign.',
          ],
        ],
      },
    },
    {
      id: 'strategy',
      stage: 'Decisions',
      title: 'One loop, three campaigns',
      body: [
        'I treated Pioneer, Calendar, and WWI as instances of the same product, not as three marketing sites. Each campaign swapped the hook. The loop stayed still.',
        'Email or a home card named a specific ancestor and why they mattered this week. The product surface showed relationship in plain language — “your 2nd great grandfather,” not a pedigree chart — then one path into photos, stories, or the record. Coming back was supposed to feel like checking on a person, not logging into software.',
        'The trade-off was real. A single evergreen onboarding flow would have been cleaner to ship. It would also have stayed generic. Campaigns let us ride moments people already understand — a birthday, a pioneer story, a war record — without pretending every beginner wanted the same first session.',
      ],
      table: {
        headers: ['Campaign', 'The hook already in the data'],
        rows: [
          [
            'Pioneer',
            'An ancestor on the westward trail. Story, photos, and relationship on a dedicated pioneer surface.',
          ],
          [
            'Ancestor Calendar',
            'A birthday or anniversary already on the tree. Recurring, not a one-season event.',
          ],
          [
            'WWI Draft',
            'A historical draft card that made a name into a signed, dated person.',
          ],
        ],
      },
      callout:
        'If we could not say who they were to you, it was not a discovery campaign. It was another newsletter.',
    },
    {
      id: 'pioneer',
      stage: 'Making',
      title: 'Pioneer: one ancestor, fully in view',
      body: [
        'Pioneer was the fullest version of the loop. The email did not ask people to go research pioneers. It named a person on their line and invited them to see how they were connected.',
        'The in-product surface was an ancestor card, not a search results page. Name, dates, a photograph when we had one, relationship, and two verbs that matched the job: view photos and stories, or view relationship. I sketched the email, the pioneer page, and an info-card carousel on paper with campaign and product partners before we committed UI, so the argument was the sequence, not the chrome.',
        'That sequence is the one I would still defend. Get the person on screen. Make the relationship obvious. Then, and only then, offer the archive.',
      ],
    },
    {
      id: 'calendar',
      stage: 'Making',
      title: 'Calendar: a reason to come back next month',
      body: [
        'Pioneer could win a session. Calendar was built to win a habit. Birthdays and anniversaries are already how families remember people. The tree had those dates. We were not using them.',
        'The home card was a celebration prompt, not a feature announcement: celebrate the lives of your ancestors, then a list of people with dates and a view-relationship path. Notifications spoke like a relative, not like a product. “February 18th is the birthday of Henry Thomas Duke, your 2nd great grandfather. He would have been 157 years old.” The next tap was more about Henry, not more about FamilySearch.',
        'That copy is the product. If the message could have been sent to anyone, we had failed personalization.',
      ],
    },
    {
      id: 'wwi',
      stage: 'Making',
      title: 'WWI Draft: proof it was a system',
      body: [
        'WWI Draft used the same loop on a different record type. A draft card is a stubborn object: a signature, a date, a place. For a beginner, that is often the first time an ancestor stops being a row in a tree.',
        'We did not invent a new IA for military records. We swapped the hook and reused relationship, story, and a single next action. That was the point of leading campaigns as a product system. The third campaign had to be cheaper than the first, or we were running a studio, not a retention surface.',
      ],
    },
    {
      id: 'decisions',
      stage: 'Decisions',
      title: 'What we chose instead',
      table: {
        headers: ['Choice', 'Why / what we dropped'],
        rows: [
          [
            'Start from a named ancestor, not from search',
            'Search is the hobbyist tool. Beginners needed a person on screen first.',
          ],
          [
            'Relationship in a sentence',
            '“Your 2nd great grandfather” beats a pedigree chart in an email or a home card.',
          ],
          [
            'One next action: story, photos, or the record',
            'A toolbox of research tasks would have recreated the bounce we were trying to stop.',
          ],
          [
            'Only send when the tree or record can support the claim',
            'False personalization would have burned trust faster than a generic newsletter.',
          ],
          [
            'Three campaign instances, one loop',
            'A single onboarding flow would have been simpler and stayed generic.',
          ],
          [
            'Calendar as the repeating motion',
            'Pioneer and WWI win a moment. Dates already on the tree win the next month.',
          ],
        ],
      },
    },
    {
      id: 'outcome',
      stage: 'Polished',
      title: 'What moved',
      body: [
        'I led product design for these campaign surfaces. I did not own retention as a solo metric. The 2018 program those campaigns sat inside is where the numbers live, and that is how I would talk about them in an interview.',
        'Returning-user retention lifted 101% year over year in 2018. International reach increased 12.4%, which was 24% over goal. Discovery comments on the order of 86,000 were the qualitative engine for what to personalize next — which is why Calendar and WWI could follow Pioneer without becoming three unrelated microsites.',
        'Cris Rees, the senior product manager I worked with, put the bar in collaborator language: experiences people actually used, engagement that showed up in the numbers, and strong patron feedback scores. That is the outcome I would still want this work judged on.',
      ],
      metrics: [
        {
          value: '101%',
          label: 'Year-over-year returning-user retention lift, 2018 (program)',
        },
        {
          value: '12.4%',
          label: 'Increase in international reach (24% over goal)',
        },
        {
          value: '~86k',
          label: 'Discovery comments that steered later campaigns',
        },
      ],
      callout:
        'These are program outcomes I helped drive as the product designer on the campaign loop, not a claim that a single email caused a 101% lift.',
    },
    {
      id: 'reflection',
      title: 'What I’d change',
      bullets: [
        'Put Calendar’s repeating hook in the first campaign, not the second. Pioneer proved the card. Calendar proved the habit. Habit was the actual retention job.',
        'Instrument the loop as product analytics from day one: send → open the ancestor → view relationship → return in 30 days. Campaign reporting and product reporting were too easy to keep in separate rooms.',
        'Crop this work for a product audience, not a Behance audience. The loop is the case. The three campaign brands are examples. I would not show them as three separate projects again.',
      ],
    },
  ],
  nextCaptures: [
    'Pioneer three-up: email hook, ancestor card, relationship — no contact block on the board',
    'Calendar three-up: home card, ancestor list with dates, birthday notification copy',
    'WWI Draft card as the third hook (record → person, not a new IA)',
    'Sketchbook-to-phone crop of Pioneer (email / pioneer page / carousel) with phone number and old email removed',
  ],
};
