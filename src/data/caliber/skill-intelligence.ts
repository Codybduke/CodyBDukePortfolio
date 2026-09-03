/**
 * Fabricated Skill Intelligence data for the manager prototype.
 *
 * Shapes follow what the packet says the product knows (OSR, scored calls,
 * lightweight CRM deal: id / name / stage / last-updated / contacts) plus the
 * fields Current State §4 lists as "aware of, doesn't use" (amount, stage
 * progression). No quota, attainment, or lead source — lead source is the field
 * the model says we would still ask them to capture.
 */

export const TODAY = new Date('2026-09-01T12:00:00Z');

export const SKILL = 'Value Based Discovery';
export const ROLE_PROFILE = 'Mid Market AEs';
export const TEAM_NAME = 'Mid Market AE Team';
export const MANAGER = 'Ellis Navarro';

/** A deal is "stalled" when nothing has touched it for this many days. */
export const STALL_DAYS = 21;

/** Below this OSR is under Proficient — the weak/strong cut for the split. */
export const PROFICIENT_MIN = 40;

/* ------------------------------------------------------------------ tiers */

export type Tier = 'Novice' | 'Developing' | 'Proficient' | 'Strong' | 'Expert';

export const TIERS: { tier: Tier; min: number; max: number }[] = [
  { tier: 'Novice', min: 0, max: 19 },
  { tier: 'Developing', min: 20, max: 39 },
  { tier: 'Proficient', min: 40, max: 69 },
  { tier: 'Strong', min: 70, max: 89 },
  { tier: 'Expert', min: 90, max: 100 },
];

export function tierFor(osr: number): Tier {
  return TIERS.find((t) => osr >= t.min && osr <= t.max)?.tier ?? 'Novice';
}

export function tierTone(tier: Tier): 'red' | 'orange' | 'gold' | 'green' | 'lime' {
  switch (tier) {
    case 'Novice': return 'red';
    case 'Developing': return 'orange';
    case 'Proficient': return 'gold';
    case 'Strong': return 'green';
    case 'Expert': return 'lime';
  }
}

/* ------------------------------------------------------------------ skills */

/**
 * Ellis's real question is not "how is discovery going" — it is "which skill
 * gets the one hour I have with this rep this week". That needs more than one
 * skill in the model, so the whole person page is keyed to a selected skill.
 */
export type SkillId = 'discovery' | 'closing' | 'objections' | 'multithreading' | 'negotiation';

/** [sub-skill name, offset from the call's overall score, one-line help] */
type SubSkillSeed = [string, number, string];

const SKILL_SEEDS: {
  id: SkillId;
  name: string;
  /** Lower-case fragment for sentences: "Where closing breaks down". */
  short: string;
  subSkills: SubSkillSeed[];
}[] = [
  {
    id: 'discovery',
    name: 'Value Based Discovery',
    short: 'discovery',
    // The scorecard as named in the packet screenshots. Offsets keep every
    // rep's profile shaped like the packet's: agenda / listening / journey read
    // as strengths, consequence and root cause as growth areas.
    subSkills: [
      ['Agenda Alignment', 18, 'Sets a clear agenda up front and gets the buyer to agree to it.'],
      ["Buyer's Journey Alignment", 12, "Meets the buyer at their actual stage rather than the seller's."],
      ['Active Listening', 14, 'Follows the thread the buyer opened instead of the next scripted question.'],
      ['Question Quality', -2, 'Asks open, non-leading questions that surface something new.'],
      ['Desired Outcome Clarity & Quantification', -10, 'Gets a specific, numeric definition of what good looks like.'],
      ['Problem Clarity & Quantification', -12, 'Establishes the size of the problem, not just its existence.'],
      ['Root Cause Identification', -14, 'Gets past the stated symptom to what is actually causing it.'],
      ['Negative Consequence Development', -20, 'Develops what happens if nothing changes, in the buyer’s words.'],
    ],
  },
  {
    id: 'closing',
    name: 'Closing & Commitment',
    short: 'closing',
    subSkills: [
      ['Clear Ask', 16, 'Asks for the specific next commitment instead of hoping for one.'],
      ['Next Step Specificity', 10, 'Leaves the call with a date, an owner, and a named outcome.'],
      ['Decision Process Mapping', -4, 'Knows who signs, in what order, and by when.'],
      ['Commitment Language', -8, 'Gets the buyer to say what they will do, in their own words.'],
      ['Mutual Action Plan', -12, 'Builds a written plan to close that the buyer agrees to.'],
      ['Urgency From The Buyer', -18, 'Urgency comes from the buyer’s timeline, not the quarter.'],
    ],
  },
  {
    id: 'objections',
    name: 'Objection Handling',
    short: 'objection handling',
    subSkills: [
      ['Objection Surfacing', 14, 'Invites the objection early rather than waiting for it.'],
      ['Clarify Before Answering', 6, 'Asks what is behind the objection before responding to it.'],
      ['Proof At The Right Level', -6, 'Answers with the evidence the buyer actually asked for.'],
      ['Reframing Cost', -12, 'Puts price next to the cost of doing nothing.'],
      ['Confirming Resolution', -16, 'Checks that the objection is closed before moving on.'],
    ],
  },
  {
    id: 'multithreading',
    name: 'Multithreading',
    short: 'multithreading',
    subSkills: [
      ['Stakeholder Mapping', 14, 'Knows who else is affected and who has not been met.'],
      ['Group Call Facilitation', 6, 'Runs a multi-person call so every voice is heard.'],
      ['Champion Development', -6, 'Equips one person to sell this internally.'],
      ['Referral Asks', -12, 'Asks a contact to introduce the next person.'],
      ['Economic Buyer Access', -18, 'Gets the person who owns the budget onto a call.'],
    ],
  },
  {
    id: 'negotiation',
    name: 'Negotiation',
    short: 'negotiation',
    subSkills: [
      ['Value Reinforcement', 14, 'Restates the quantified problem before talking price.'],
      ['Silence And Patience', 8, 'Lets a proposal sit instead of filling the gap with a discount.'],
      ['Terms Trade', -4, 'Trades something for every concession given.'],
      ['Concession Planning', -10, 'Decides what can move before the call, not during it.'],
      ['Discount Discipline', -18, 'Holds price when the value is established.'],
    ],
  },
];

export type SubSkill = string;

export type SkillDef = {
  id: SkillId;
  name: string;
  short: string;
  subSkills: SubSkill[];
};

export const SKILLS: SkillDef[] = SKILL_SEEDS.map((s) => ({
  id: s.id,
  name: s.name,
  short: s.short,
  subSkills: s.subSkills.map(([name]) => name),
}));

/** The skill the team-level filter is set to, and the packet's subject. */
export const DEFAULT_SKILL: SkillId = 'discovery';

export const SKILL_IDS: SkillId[] = SKILLS.map((s) => s.id);

export function skillById(id: SkillId): SkillDef {
  return SKILLS.find((s) => s.id === id) ?? SKILLS[0];
}

export function skillName(id: SkillId): string {
  return skillById(id).name;
}

const SUB_SKILL_OFFSET: Record<SubSkill, number> = {};
export const SUB_SKILL_HELP: Record<SubSkill, string> = {};
export const SUB_SKILL_OF: Record<SubSkill, SkillId> = {};

for (const s of SKILL_SEEDS) {
  for (const [name, offset, help] of s.subSkills) {
    SUB_SKILL_OFFSET[name] = offset;
    SUB_SKILL_HELP[name] = help;
    SUB_SKILL_OF[name] = s.id;
  }
}

/** Discovery's scorecard, kept for the packet-faithful views. */
export const SUB_SKILLS = SKILLS[0].subSkills;

/* ------------------------------------------------------------------ stages */

export type Stage =
  | 'Discovery'
  | 'Qualified'
  | 'Solution'
  | 'Proposal'
  | 'Negotiation';

export const STAGES: Stage[] = ['Discovery', 'Qualified', 'Solution', 'Proposal', 'Negotiation'];

/* -------------------------------------------------------------------- reps */

export type Rep = {
  id: string;
  name: string;
  initials: string;
  /** Live-call OSR on the default skill. Kept for the packet's skill views. */
  osr: number;
  /** Live-call OSR on every skill in the role profile. */
  osrBySkill: Record<SkillId, number>;
  /** Change vs the previous window, on the default skill. */
  delta: number;
  /** Live scored calls in the window. Practice is counted separately. */
  liveCalls: number;
  practiceReps: number;
  tenureMonths: number;
};

/**
 * [discovery, closing, objections, multithreading, negotiation]
 *
 * Hand-authored rather than derived, so each rep's weakest skill stays the one
 * their walkthrough story is about. Tara, Nate and Simone are weakest on
 * discovery. Priya is weakest on discovery too — and still Proficient there,
 * which is the point of her page: no skill on her book has much money behind
 * it, so the stalls are about fit.
 */
type OsrRow = [number, number, number, number, number];

const REP_SEEDS: [string, string, string, OsrRow, number, number, number, number][] = [
  ['tara',   'Tara Whitfield', 'TW', [34, 41, 52, 38, 47], 3,  22, 1, 7],
  ['marcus', 'Marcus Bell',    'MB', [71, 64, 78, 59, 68], 4,  16, 6, 19],
  ['ryan',   'Ryan Tibbetts',  'RT', [66, 58, 71, 62, 55], 5,  18, 4, 26],
  ['chris',  'Chris Orlob',    'CO', [63, 69, 57, 66, 61], -2, 15, 2, 31],
  ['priya',  'Priya Raman',    'PR', [58, 64, 67, 72, 61], 7,  12, 9, 9],
  ['devon',  'Devon Clarke',   'DC', [44, 49, 41, 53, 46], 0,  9,  0, 14],
  ['nate',   'Nate Kowalski',  'NK', [42, 55, 61, 44, 58], -1, 14, 0, 51],
  ['simone', 'Simone Alvarez', 'SA', [28, 36, 33, 31, 39], 2,  5,  3, 5],
];

export const REPS: Rep[] = REP_SEEDS.map(
  ([id, name, initials, row, delta, liveCalls, practiceReps, tenureMonths]) => ({
    id,
    name,
    initials,
    osr: row[SKILL_IDS.indexOf(DEFAULT_SKILL)],
    osrBySkill: SKILL_IDS.reduce((acc, sid, i) => {
      acc[sid] = row[i];
      return acc;
    }, {} as Record<SkillId, number>),
    delta,
    liveCalls,
    practiceReps,
    tenureMonths,
  }),
);

export function repById(id: string): Rep | undefined {
  return REPS.find((r) => r.id === id);
}

export function repOsr(repId: string, skillId: SkillId): number {
  return repById(repId)?.osrBySkill[skillId] ?? 0;
}

/** The default skill on a person page: the one they score lowest on. */
export function weakestSkillFor(repId: string): SkillId {
  const rep = repById(repId);
  if (!rep) return DEFAULT_SKILL;
  return SKILL_IDS.reduce((lowest, sid) =>
    rep.osrBySkill[sid] < rep.osrBySkill[lowest] ? sid : lowest,
  );
}

/* ------------------------------------------------------------------- deals */

/**
 * [name, amount, stage, daysIdle, daysInStage, closeDatePushes, latestLiveScore, liveCalls]
 * `amount: null` exercises the fallback rule — fall back to stage + last
 * activity on that row rather than dropping the deal or inventing a number.
 * `latestLiveScore: null` means no scored call: the deal is not classifiable.
 */
type DealSeed = [string, number | null, Stage, number, number, number, number | null, number];

const DEAL_SEEDS: Record<string, DealSeed[]> = {
  tara: [
    ['Northwind Logistics', 68000, 'Discovery', 34, 41, 2, 28, 2],
    ['Cedarline Health', 52000, 'Discovery', 41, 47, 3, 22, 2],
    ['Brightpath Manufacturing', 45000, 'Qualified', 27, 30, 2, 31, 3],
    ['Vantage Freight', 38000, 'Discovery', 52, 58, 1, 19, 1],
    ['Kestrel Systems', 61000, 'Discovery', 24, 26, 2, 35, 2],
    ['Orchard Financial', 29000, 'Qualified', 33, 36, 1, 26, 2],
    ['Ironwood Foods', 34000, 'Discovery', 46, 49, 2, 24, 1],
    ['Trellis HR', 22000, 'Discovery', 29, 33, 1, 33, 2],
    ['Bluestem Grocers', 41000, 'Solution', 6, 9, 0, 37, 2],
    ['Palisade Energy', 84000, 'Proposal', 38, 44, 2, 58, 3],
    ['Harborview Medical', 47000, 'Solution', 25, 28, 1, 52, 2],
    ['Lumen Retail Group', 56000, 'Negotiation', 4, 12, 0, 61, 3],
    ['Meridian Dental Partners', 18000, 'Solution', 9, 14, 0, 47, 2],
    ['Fairmount Insurance', 31000, 'Proposal', 11, 16, 1, 44, 2],
    ['Solstice Apparel', 26000, 'Discovery', 19, 21, 0, null, 0],
    ['Copper Ridge Utilities', null, 'Discovery', 31, 35, 1, null, 0],
    ['Alder & Co', 15000, 'Discovery', 12, 15, 0, null, 0],
    ['Vertex Plastics', 37000, 'Qualified', 22, 25, 1, null, 0],
    ['Waypoint Transit', 8000, 'Discovery', 44, 47, 0, null, 0],
  ],
  ryan: [
    ['Silverleaf Senior Living', 72000, 'Negotiation', 5, 11, 0, 71, 3],
    ['Granite Peak Outfitters', 44000, 'Proposal', 8, 14, 1, 68, 2],
    ['Terra Nova Agritech', 91000, 'Solution', 12, 18, 0, 74, 3],
    ['Halcyon Labs', 38000, 'Proposal', 6, 10, 0, 62, 2],
    ['Pinnacle Auto Group', 55000, 'Solution', 14, 20, 1, 59, 2],
    ['Wexford Legal', 27000, 'Qualified', 9, 13, 0, 66, 2],
    ['Sable Media', 63000, 'Proposal', 33, 39, 2, 64, 3],
    ['Junction Rail', 48000, 'Solution', 27, 31, 1, 57, 2],
    ['Foxglove Pharma', 31000, 'Discovery', 24, 28, 1, 36, 1],
    ['Ardent Roofing', 19000, 'Discovery', 7, 9, 0, 34, 1],
    ['Blue Harbor Marine', 42000, 'Qualified', 16, 19, 0, null, 0],
    ['Cortland Devices', 25000, 'Discovery', 29, 33, 1, null, 0],
  ],
  chris: [
    ['Everline Telecom', 58000, 'Negotiation', 3, 8, 0, 69, 3],
    ['Marrow & Finch', 33000, 'Proposal', 10, 15, 0, 61, 2],
    ['Quarry Hill Cement', 47000, 'Solution', 13, 17, 1, 64, 2],
    ['Redwood Dental Labs', 21000, 'Qualified', 6, 11, 0, 55, 2],
    ['Stonebridge Title', 39000, 'Solution', 15, 19, 0, 58, 2],
    ['Tamarack Outdoor', 66000, 'Proposal', 31, 36, 2, 63, 3],
    ['Ulster Packaging', 29000, 'Solution', 24, 27, 1, 51, 2],
    ['Vireo Analytics', 17000, 'Discovery', 11, 14, 0, 38, 1],
    ['Wildrose Dairy', 36000, 'Qualified', 18, 22, 0, null, 0],
  ],
  marcus: [
    ['Ashford Robotics', 118000, 'Negotiation', 4, 9, 0, 79, 4],
    ['Basalt Mining', 64000, 'Proposal', 7, 12, 0, 73, 3],
    ['Crescent Payments', 52000, 'Solution', 11, 16, 0, 76, 3],
    ['Dunmore Textiles', 28000, 'Qualified', 9, 13, 0, 68, 2],
    ['Elkhorn Beverage', 45000, 'Proposal', 13, 18, 1, 71, 2],
    ['Fenwick Optics', 37000, 'Solution', 6, 10, 0, 66, 2],
    ['Gladstone Rail', 83000, 'Proposal', 29, 34, 2, 74, 3],
    ['Hollis Chemical', 41000, 'Solution', 23, 26, 1, 62, 2],
    ['Inverness Foods', 22000, 'Discovery', 26, 30, 1, 34, 1],
    ['Jasper Networks', 30000, 'Qualified', 14, 17, 0, null, 0],
  ],
  priya: [
    ['Kingsley Aerospace', 76000, 'Proposal', 35, 41, 2, 64, 3],
    ['Larkspur Wellness', 43000, 'Solution', 28, 32, 1, 59, 2],
    ['Monarch Freight', 51000, 'Qualified', 24, 29, 1, 61, 2],
    ['Norwood Bank', 38000, 'Solution', 32, 37, 2, 57, 2],
    ['Oakhurst Schools', 29000, 'Proposal', 9, 14, 0, 66, 2],
    ['Pemberton Tools', 34000, 'Solution', 12, 16, 0, 62, 2],
    ['Quilter Home', 18000, 'Discovery', 27, 31, 1, 37, 1],
    ['Rockvale Cement', 26000, 'Qualified', 19, 23, 0, null, 0],
    ['Stanton Imaging', 45000, 'Discovery', 15, 18, 0, null, 0],
  ],
  nate: [
    ['Thornbury Media', 54000, 'Negotiation', 5, 10, 0, 36, 2],
    ['Underhill Sports', 32000, 'Proposal', 8, 13, 0, 31, 1],
    ['Valemount Hotels', 47000, 'Solution', 11, 15, 1, 34, 2],
    ['Westgate Auto', 61000, 'Proposal', 6, 12, 0, 38, 2],
    ['Xanthe Cosmetics', 25000, 'Qualified', 13, 17, 0, 29, 1],
    ['Yardley Print', 19000, 'Discovery', 26, 30, 1, 33, 1],
    ['Zephyr HVAC', 43000, 'Solution', 9, 14, 0, 48, 2],
    ['Amberline Rail', 58000, 'Proposal', 7, 11, 0, 52, 2],
    ['Brookvale Clinics', 36000, 'Qualified', 12, 16, 0, null, 0],
    ['Calder Steel', 28000, 'Discovery', 17, 20, 0, null, 0],
    ['Dexley Logistics', 22000, 'Discovery', 20, 24, 1, null, 0],
  ],
  simone: [
    ['Eastmoor Realty', 31000, 'Discovery', 38, 42, 2, 24, 1],
    ['Fallbrook Vineyards', 24000, 'Discovery', 29, 33, 1, 27, 1],
    ['Glenmore Plastics', 18000, 'Qualified', 8, 12, 0, 31, 1],
    ['Havenwood Care', 27000, 'Discovery', 23, 27, 1, null, 0],
    ['Ledger & Vine', 15000, 'Discovery', 34, 38, 1, null, 0],
    ['Milbank Security', 39000, 'Discovery', 16, 19, 0, null, 0],
    ['Nightingale Labs', 21000, 'Qualified', 27, 31, 1, null, 0],
    ['Ovid Publishing', 12000, 'Discovery', 41, 45, 2, null, 0],
  ],
  devon: [
    ['Parkhurst Dental', 34000, 'Solution', 12, 17, 0, null, 0],
    ['Quintrell Marine', 48000, 'Proposal', 9, 14, 1, null, 0],
    ['Ravenna Foods', 26000, 'Qualified', 15, 19, 0, null, 0],
    ['Selby Instruments', 41000, 'Solution', 22, 26, 1, null, 0],
    ['Torrance Grid', 57000, 'Proposal', 7, 12, 0, null, 0],
    ['Ulmer Fasteners', 19000, 'Discovery', 28, 32, 1, null, 0],
    ['Vandermeer Glass', 33000, 'Qualified', 18, 21, 0, null, 0],
  ],
};

/* ------------------------------------------------------- deterministic rng */

function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

function clamp(n: number): number {
  return Math.max(2, Math.min(98, Math.round(n)));
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

export function fmtDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

export function fmtDateShort(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

export function fmtMoney(n: number | null): string {
  if (n === null) return '—';
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `$${m >= 10 ? Math.round(m) : m.toFixed(1)}M`;
  }
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${Math.round(n)}`;
}

/* ------------------------------------------------------------------- calls */

export type ScoredCall = {
  id: string;
  dealId: string;
  repId: string;
  date: Date;
  title: string;
  durationMin: number;
  osr: number;
  subSkills: { name: SubSkill; score: number }[];
};

function buildSubSkills(callId: string, osr: number, skillId: SkillId): { name: SubSkill; score: number }[] {
  return skillById(skillId).subSkills.map((name) => {
    const jitter = (hash(`${callId}:${name}`) - 0.5) * 10;
    return { name, score: clamp(osr + SUB_SKILL_OFFSET[name] + jitter) };
  });
}

const CALL_TITLES = ['Discovery call', 'Follow-up discovery', 'Stakeholder call', 'Deep-dive call'];

/* ------------------------------------------------------------------- deals */

export type Bucket =
  | 'weak-stalled'
  | 'weak-moving'
  | 'strong-stalled'
  | 'strong-moving'
  | 'unscored';

export type Deal = {
  id: string;
  name: string;
  repId: string;
  amount: number | null;
  stage: Stage;
  daysIdle: number;
  daysInStage: number;
  lastActivity: Date;
  created: Date;
  closeDate: Date;
  closeDatePushes: number;
  contacts: { name: string; title: string }[];
  economicBuyerOnCall: boolean;
  nextStepSet: boolean;
  calls: ScoredCall[];
  /** Latest live-call score for the selected skill. Null when nothing scored. */
  latestScore: number | null;
  stalled: boolean;
  bucket: Bucket;
};

const FIRST = ['Dana', 'Marcus', 'Priya', 'Owen', 'Renee', 'Hal', 'Ingrid', 'Curtis', 'Yara', 'Theo', 'Nadia', 'Grant'];
const LAST = ['Okafor', 'Lindqvist', 'Barrera', 'Mehta', 'Duval', 'Kowalczyk', 'Osei', 'Tran', 'Hollis', 'Reyes'];
const TITLES = ['VP Operations', 'Director of IT', 'COO', 'CFO', 'Head of Revenue Ops', 'Director of Finance', 'VP People'];

function buildDeal(repId: string, seed: DealSeed, index: number, skillId: SkillId): Deal {
  const [name, amount, stage, daysIdle, daysInStage, pushes, baseScore, callCount] = seed;
  const id = `${repId}-${index}`;
  const r = hash(id);

  // The seeds are authored against the default skill. Every other skill is the
  // same deal shifted by the gap between the rep's two scores, so a deal with
  // no call stays unscored on every skill — coverage is a property of the deal,
  // not of the skill being looked at.
  const shift = repOsr(repId, skillId) - repOsr(repId, DEFAULT_SKILL);
  const latestScore =
    baseScore === null
      ? null
      : skillId === DEFAULT_SKILL
        ? baseScore
        : clamp(baseScore + shift + (hash(`${id}:${skillId}`) - 0.5) * 10);

  const lastActivity = addDays(TODAY, -daysIdle);
  const created = addDays(TODAY, -(daysInStage + 14 + Math.round(r * 40)));
  const closeDate = addDays(TODAY, 12 + Math.round(hash(`${id}:close`) * 60));

  const calls: ScoredCall[] = [];
  for (let i = 0; i < callCount; i += 1) {
    // Earliest call first; the last one carries `latestScore`.
    const isLast = i === callCount - 1;
    const drift = (hash(`${id}:call:${i}`) - 0.5) * 12;
    const osr = isLast ? (latestScore as number) : clamp((latestScore as number) - 4 + drift);
    const callId = `${id}-c${i}`;
    calls.push({
      id: callId,
      dealId: id,
      repId,
      date: addDays(lastActivity, -((callCount - 1 - i) * (7 + Math.round(r * 9)))),
      title: i === 0 ? 'Discovery call' : CALL_TITLES[Math.min(i, CALL_TITLES.length - 1)],
      durationMin: 24 + Math.round(hash(`${callId}:dur`) * 34),
      osr,
      subSkills: buildSubSkills(callId, osr, skillId),
    });
  }

  // Weak discovery correlates with never reaching the economic buyer. That is a
  // pattern in the fabricated data, not a claim the product should make.
  const ebThreshold = latestScore === null ? 0.5 : latestScore < PROFICIENT_MIN ? 0.82 : 0.34;
  const economicBuyerOnCall = hash(`${id}:eb`) > ebThreshold;

  const contactCount = 1 + Math.round(hash(`${id}:cc`) * (economicBuyerOnCall ? 2 : 1));
  const contacts = Array.from({ length: contactCount }, (_, i) => ({
    name: `${FIRST[Math.floor(hash(`${id}:f${i}`) * FIRST.length)]} ${LAST[Math.floor(hash(`${id}:l${i}`) * LAST.length)]}`,
    title: i === 0 && economicBuyerOnCall
      ? (['CFO', 'COO', 'CEO'] as const)[Math.floor(hash(`${id}:t`) * 3)]
      : TITLES[Math.floor(hash(`${id}:t${i}`) * TITLES.length)],
  }));

  const stalled = daysIdle >= STALL_DAYS;
  const weak = latestScore !== null && latestScore < PROFICIENT_MIN;
  const bucket: Bucket =
    latestScore === null
      ? 'unscored'
      : weak
        ? (stalled ? 'weak-stalled' : 'weak-moving')
        : (stalled ? 'strong-stalled' : 'strong-moving');

  return {
    id,
    name,
    repId,
    amount,
    stage,
    daysIdle,
    daysInStage,
    lastActivity,
    created,
    closeDate,
    closeDatePushes: pushes,
    contacts,
    economicBuyerOnCall,
    nextStepSet: !stalled && hash(`${id}:ns`) > 0.25,
    calls,
    latestScore,
    stalled,
    bucket,
  };
}

export const DEALS_BY_SKILL: Record<SkillId, Deal[]> = SKILL_IDS.reduce((acc, skillId) => {
  acc[skillId] = Object.entries(DEAL_SEEDS).flatMap(([repId, seeds]) =>
    seeds.map((seed, i) => buildDeal(repId, seed, i, skillId)),
  );
  return acc;
}, {} as Record<SkillId, Deal[]>);

export const DEALS: Deal[] = DEALS_BY_SKILL[DEFAULT_SKILL];

export function dealsForRep(repId: string, skillId: SkillId = DEFAULT_SKILL): Deal[] {
  return DEALS_BY_SKILL[skillId].filter((d) => d.repId === repId);
}

export function dealById(id: string, skillId: SkillId = DEFAULT_SKILL): Deal | undefined {
  return DEALS_BY_SKILL[skillId].find((d) => d.id === id);
}

/* ------------------------------------------------------------------ splits */

export const BUCKET_ORDER: Bucket[] = [
  'weak-stalled',
  'weak-moving',
  'strong-stalled',
  'strong-moving',
  'unscored',
];

export const BUCKET_META: Record<
  Bucket,
  { label: string; short: string; read: string; color: string }
> = {
  'weak-stalled': {
    label: 'Below Proficient · stalled',
    short: 'Below Proficient, stalled',
    read: 'Consistent with a {skill} gap',
    color: 'var(--cal-bucket-weak-stalled)',
  },
  'weak-moving': {
    label: 'Below Proficient · moving',
    short: 'Below Proficient, moving',
    read: '{Skill} was not the blocker here',
    color: 'var(--cal-bucket-weak-moving)',
  },
  'strong-stalled': {
    label: 'Proficient+ · stalled',
    short: 'Proficient or better, stalled',
    read: 'Not explained by {skill}. Look at fit',
    color: 'var(--cal-bucket-strong-stalled)',
  },
  'strong-moving': {
    label: 'Proficient+ · moving',
    short: 'Proficient or better, moving',
    read: 'Healthy',
    color: 'var(--cal-bucket-strong-moving)',
  },
  unscored: {
    label: 'No scored call',
    short: 'Not scored',
    read: 'Cannot be characterised',
    color: 'var(--cal-bucket-unscored)',
  },
};

/** The four piles read differently per skill, so the copy is templated. */
export function bucketRead(bucket: Bucket, skillId: SkillId): string {
  const short = skillById(skillId).short;
  return BUCKET_META[bucket].read
    .replace('{skill}', short)
    .replace('{Skill}', short.charAt(0).toUpperCase() + short.slice(1));
}

export type Split = Record<Bucket, { count: number; amount: number; missingAmount: number }>;

export function splitOf(deals: Deal[]): Split {
  const base = BUCKET_ORDER.reduce((acc, b) => {
    acc[b] = { count: 0, amount: 0, missingAmount: 0 };
    return acc;
  }, {} as Split);

  for (const d of deals) {
    const cell = base[d.bucket];
    cell.count += 1;
    if (d.amount === null) cell.missingAmount += 1;
    else cell.amount += d.amount;
  }
  return base;
}

export type RepSummary = {
  rep: Rep;
  skillId: SkillId;
  /** The rep's OSR on the summarised skill. */
  osr: number;
  deals: Deal[];
  open: number;
  scored: number;
  coverage: number;
  openAmount: number;
  missingAmount: number;
  split: Split;
  stalledCount: number;
  /** Open value sitting on stalled deals whose last discovery call was weak. */
  weakStalledAmount: number;
  /** Too few scored deals to say anything about the shape of the book. */
  thin: boolean;
  empty: boolean;
};

/** Under this many scored open deals we refuse the characterisation sentence. */
export const THIN_MIN = 5;

export function summarise(rep: Rep, skillId: SkillId = DEFAULT_SKILL): RepSummary {
  const deals = dealsForRep(rep.id, skillId);
  const scored = deals.filter((d) => d.latestScore !== null).length;
  const split = splitOf(deals);
  return {
    rep,
    skillId,
    osr: rep.osrBySkill[skillId],
    deals,
    open: deals.length,
    scored,
    coverage: deals.length ? scored / deals.length : 0,
    openAmount: deals.reduce((s, d) => s + (d.amount ?? 0), 0),
    missingAmount: deals.filter((d) => d.amount === null).length,
    split,
    stalledCount: deals.filter((d) => d.stalled).length,
    weakStalledAmount: split['weak-stalled'].amount,
    thin: scored > 0 && scored < THIN_MIN,
    empty: scored === 0,
  };
}

export const SUMMARIES_BY_SKILL: Record<SkillId, RepSummary[]> = SKILL_IDS.reduce((acc, skillId) => {
  acc[skillId] = REPS.map((rep) => summarise(rep, skillId));
  return acc;
}, {} as Record<SkillId, RepSummary[]>);

export const SUMMARIES: RepSummary[] = SUMMARIES_BY_SKILL[DEFAULT_SKILL];

export function summaryFor(repId: string, skillId: SkillId = DEFAULT_SKILL): RepSummary {
  const list = SUMMARIES_BY_SKILL[skillId];
  return list.find((s) => s.rep.id === repId) ?? list[0];
}

/* -------------------------------------------------------------- team roll-up */

function weightedOsr(reps: Rep[]): number {
  const total = reps.reduce((s, r) => s + r.liveCalls, 0);
  if (!total) return 0;
  return Math.round(reps.reduce((s, r) => s + r.osr * r.liveCalls, 0) / total);
}

export const TEAM = {
  name: TEAM_NAME,
  manager: MANAGER,
  members: REPS.length,
  osr: weightedOsr(REPS),
  delta: 2,
  liveCalls: REPS.reduce((s, r) => s + r.liveCalls, 0),
  practiceReps: REPS.reduce((s, r) => s + r.practiceReps, 0),
  openDeals: DEALS.length,
  scoredDeals: DEALS.filter((d) => d.latestScore !== null).length,
  openAmount: DEALS.reduce((s, d) => s + (d.amount ?? 0), 0),
  missingAmount: DEALS.filter((d) => d.amount === null).length,
  split: splitOf(DEALS),
};

export const TEAM_COVERAGE = TEAM.scoredDeals / TEAM.openDeals;

/* ------------------------------------------------- team-level growth areas */

function averageSubSkills(deals: Deal[], skillId: SkillId): { name: SubSkill; score: number }[] {
  const totals = new Map<SubSkill, { sum: number; n: number }>();
  for (const deal of deals) {
    const last = deal.calls[deal.calls.length - 1];
    if (!last) continue;
    for (const s of last.subSkills) {
      const cur = totals.get(s.name) ?? { sum: 0, n: 0 };
      cur.sum += s.score;
      cur.n += 1;
      totals.set(s.name, cur);
    }
  }
  if (!totals.size) return [];
  return skillById(skillId)
    .subSkills.filter((name) => totals.has(name))
    .map((name) => {
      const t = totals.get(name)!;
      return { name, score: Math.round(t.sum / t.n) };
    })
    .sort((a, b) => a.score - b.score);
}

export function teamSubSkillAverages(skillId: SkillId = DEFAULT_SKILL) {
  return averageSubSkills(DEALS_BY_SKILL[skillId], skillId);
}

/** Empty when nothing on this rep's open deals has been scored — never zeros. */
export function repSubSkillAverages(repId: string, skillId: SkillId = DEFAULT_SKILL) {
  return averageSubSkills(dealsForRep(repId, skillId), skillId);
}

/* ------------------------------------------------------------ AI narrative */

/**
 * Stand-in for the packet's "AI-generated" skill breakdown copy. Two sentences
 * each: what is going wrong in the calls, and what to do about it. The bars
 * above it already carry the scores, so this does not repeat them.
 */
export const AI_NARRATIVE: Record<string, string> = {
  tara:
    'Tara sets an agenda and follows the buyer’s thread, then moves to the next topic before the buyer says what the problem costs them, so 8 of her scored open deals ended without a quantified problem or a named consequence. Coach Negative Consequence Development: keep her on the problem until the buyer puts a number and a deadline on it in their own words.',
  priya:
    'Priya scores above the team on nearly every discovery sub-skill, and four of her Proficient-or-better deals still have not moved in three weeks. Nothing in these call scores explains the stalls, so look at fit, timing, or another skill before spending the hour on discovery.',
  nate:
    'Nate’s deals keep moving, but the calls behind them score below Proficient on problem quantification and consequence development, because buyers arrive knowing what they want and the calls confirm rather than develop the problem. Coach those two sub-skills and watch whether the scores move on their own, since progression here is not evidence the discovery worked.',
  simone:
    'Three of Simone’s open deals have a scored call, which cannot separate a skill gap from a small sample. Get calls uploaded across the rest of her book before setting a focus on this skill.',
  devon:
    'Devon has nine scored calls in this window and none of them sit on a currently open deal. Upload calls from his live pipeline before reading anything into how discovery is landing.',
  team:
    'The team sets clear agendas and follows the buyer’s stated priorities, then moves on before the buyer articulates cost or urgency in their own words. Negative Consequence Development and Root Cause Identification are the two lowest sub-skills on seven of eight members, so run one team session on them rather than eight separate plans.',
};

/**
 * The hand-written copy above is the default skill. Every other skill gets two
 * generated sentences: what is lowest, and what to do about it.
 */
export function narrativeFor(repId: string, skillId: SkillId): string | null {
  if (skillId === DEFAULT_SKILL) return AI_NARRATIVE[repId] ?? null;
  const ranked = repSubSkillAverages(repId, skillId);
  if (ranked.length < 2) return null;
  const rep = repById(repId);
  const first = rep?.name.split(' ')[0] ?? 'This rep';
  const skill = skillById(skillId);
  const [a, b] = ranked;
  return `${first}’s ${skill.short} calls score lowest on ${a.name} (${a.score}) and ${b.name} (${b.score}), and highest on ${ranked[ranked.length - 1].name}. Take ${a.name} for the window: ${SUB_SKILL_HELP[a.name].replace(/\.$/, '').toLowerCase()} is the shorter of the two conversations to change.`;
}

/* ------------------------------------------------------------------ copy */

/**
 * The single correlation note. It lives on one info icon, next to the four
 * piles, and nowhere else — Britton read a page of always-on caveats as the
 * product hedging rather than as care.
 */
export function placementHelp(skillId: SkillId): string {
  return `Every open deal is placed by the score on its most recent live ${skillName(skillId)} call and whether the deal has moved in the last ${STALL_DAYS} days. A deal that stalled after a weak call is associated with that score; this view does not show that the score caused the stall.`;
}

export const COVERAGE_HELP =
  'Coverage is scored open deals divided by all open deals. A deal with no uploaded call is not evidence of weak skill; it is missing evidence.';
