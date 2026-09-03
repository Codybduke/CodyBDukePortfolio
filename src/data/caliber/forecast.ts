/**
 * "If this score moves this many points, we have seen about this much more
 * money." The one thing Britton asked us to add.
 *
 * ILLUSTRATIVE ONLY. He was explicit: "I haven't given you the mathematical
 * model and I don't want you to go figure out the mathematical model." So this
 * file does not fit one. It is a stand-in that moves in the right direction
 * when the inputs move, so the surface can be designed, reviewed and argued
 * with. Caliber owns the real numbers. Two rules the strings obey:
 *
 *   - Always "about", "we have seen", "has gone with". Never "will produce".
 *   - The exposure figure is real (it is open CRM value on scored deals below
 *     Proficient). Only the conversion from points to dollars is a placeholder.
 */
import {
  PROFICIENT_MIN,
  dealsForRep,
  fmtMoney,
  repOsr,
  repSubSkillAverages,
  skillById,
  type SkillId,
  type SubSkill,
} from './skill-intelligence';

/**
 * Placeholder: share of exposed open value that has moved per point gained on
 * this skill. Closing and negotiation sit on later-stage dollars, so a point
 * there has gone with more money than a point on discovery. That ordering is
 * the whole reason the skill switcher exists — the weakest skill is not
 * automatically the one worth the hour.
 */
const RATE_PER_POINT: Record<SkillId, number> = {
  discovery: 0.020,
  closing: 0.055,
  negotiation: 0.034,
  multithreading: 0.026,
  objections: 0.016,
};

export type Forecast = {
  skillId: SkillId;
  /** Open CRM value on scored deals whose last call on this skill was weak. */
  exposed: number;
  /** How many of those deals that value sits on. */
  exposedDeals: number;
  points: number;
  dollars: number;
  /**
   * False when there is so little open value behind weak calls that quoting a
   * number would be theatre. Ellis needs "not here" to be a real answer.
   */
  material: boolean;
};

/** Open value sitting behind below-Proficient calls on this skill. */
export function exposureFor(repId: string, skillId: SkillId): { amount: number; deals: number } {
  const weak = dealsForRep(repId, skillId).filter(
    (d) => d.latestScore !== null && d.latestScore < PROFICIENT_MIN,
  );
  return {
    amount: weak.reduce((sum, d) => sum + (d.amount ?? 0), 0),
    deals: weak.length,
  };
}

/**
 * A point gain a manager would call realistic for someone at this score.
 * Lower scores have more headroom; Strong and above have very little.
 */
export function realisticPoints(osr: number): number {
  if (osr >= 70) return 3;
  return Math.min(10, Math.max(4, Math.round((70 - osr) / 4)));
}

function dollarsFor(exposed: number, points: number, skillId: SkillId): number {
  const raw = exposed * points * RATE_PER_POINT[skillId];
  // Round to something a person would say out loud.
  if (raw >= 100_000) return Math.round(raw / 10_000) * 10_000;
  if (raw >= 10_000) return Math.round(raw / 5_000) * 5_000;
  return Math.round(raw / 1_000) * 1_000;
}

/** The headline forecast: what a realistic gain on this skill has been worth. */
export function forecastFor(repId: string, skillId: SkillId): Forecast {
  const { amount, deals } = exposureFor(repId, skillId);
  const points = realisticPoints(repOsr(repId, skillId));
  const dollars = dollarsFor(amount, points, skillId);
  return {
    skillId,
    exposed: amount,
    exposedDeals: deals,
    points,
    dollars,
    material: deals > 0 && dollars >= 5_000,
  };
}

export function forecastsForRep(repId: string, skillIds: SkillId[]): Forecast[] {
  return skillIds.map((id) => forecastFor(repId, id));
}

/**
 * "If I can only tackle one to move the needle, which one." The skill with the
 * most money behind it is not always the lowest-scoring one — that is the whole
 * reason the person page has a switcher.
 */
export function richestSkill(repId: string, skillIds: SkillId[]): Forecast | null {
  const ranked = forecastsForRep(repId, skillIds)
    .filter((f) => f.material)
    .sort((a, b) => b.dollars - a.dollars);
  return ranked[0] ?? null;
}

/* ------------------------------------------------------------------ plans */

const WINDOW_FACTOR: Record<number, number> = { 4: 0.75, 6: 1, 8: 1.2 };
const PRACTICE_FACTOR: Record<number, number> = { 1: 0.8, 2: 1, 3: 1.15 };

/** A low-scoring sub-skill has more room to move than one already near Strong. */
function subSkillFactor(repId: string, skillId: SkillId, subSkill?: SubSkill): number {
  if (!subSkill) return 1;
  const found = repSubSkillAverages(repId, skillId).find((s) => s.name === subSkill);
  if (!found) return 1;
  return Math.min(1.35, Math.max(0.75, (72 - found.score) / 32));
}

export type Plan = {
  repId: string;
  skillId: SkillId;
  subSkill?: SubSkill;
  weeks: number;
  practicePerWeek: number;
};

/** The same forecast, re-cut for a specific coaching plan. */
export function forecastForPlan(plan: Plan): Forecast {
  const base = forecastFor(plan.repId, plan.skillId);
  const points = Math.min(
    14,
    Math.max(
      2,
      Math.round(
        base.points *
          (WINDOW_FACTOR[plan.weeks] ?? 1) *
          (PRACTICE_FACTOR[plan.practicePerWeek] ?? 1) *
          subSkillFactor(plan.repId, plan.skillId, plan.subSkill),
      ),
    ),
  );
  return {
    ...base,
    points,
    dollars: dollarsFor(base.exposed, points, plan.skillId),
  };
}

/* ------------------------------------------------------------------ copy */

/**
 * The whole surface: a number pair beside the score. Everything else lives in
 * the tooltip, because the page it sits on already has plenty to read.
 */
export function forecastHeadline(f: Forecast): string {
  return f.material ? `+${f.points} pts → about ${fmtMoney(f.dollars)}` : 'Little to recover here';
}

/**
 * Behind the info icon. Two short sentences: the if-then first, because that
 * is what the number pair is claiming, then what it is measured against.
 */
export function forecastTip(f: Forecast, firstName: string): string {
  const skill = skillById(f.skillId);
  if (!f.exposedDeals) {
    return `No open deal on ${firstName}’s book sits behind a below-Proficient ${skill.short} call. There is no money to recover on this skill.`;
  }
  if (!f.material) {
    return `Only ${fmtMoney(f.exposed)} of ${firstName}’s open book sits behind below-Proficient ${skill.short} calls. A good six weeks here has not been worth much on a book this shape.`;
  }
  return `${ifThen(f)} ${fmtMoney(f.exposed)} of ${firstName}’s open deals sit behind below-Proficient ${skill.short} calls.`;
}

/** The same claim, for the modal, where the plan inputs are the second half. */
export function forecastPlanTip(f: Forecast, weeks: number, practicePerWeek: number): string {
  const skill = skillById(f.skillId);
  if (!f.material) {
    return `Only ${fmtMoney(f.exposed)} of this open book sits behind below-Proficient ${skill.short} calls. This is a plan worth setting for the skill, not for the quarter’s number.`;
  }
  return `${ifThen(f)} That is ${weeks} weeks at ${practicePerWeek}× a week, against the ${fmtMoney(f.exposed)} sitting behind weak ${skill.short} calls.`;
}

/** The agreed plan, on the filled card. Week six is reported against it. */
export function forecastAgreedTip(f: Forecast, agreedOn: string): string {
  if (!f.material) {
    return `This is the plan agreed on ${agreedOn}. Little of this open book sits behind weak calls, so it is a plan about the skill rather than about this quarter.`;
  }
  return `This is the plan agreed on ${agreedOn}. ${ifThen(f)} Week six gets reported against that number.`;
}

function ifThen(f: Forecast): string {
  return `If this score goes up about ${f.points} points, we have seen about ${fmtMoney(f.dollars)} more of a book like this close.`;
}
