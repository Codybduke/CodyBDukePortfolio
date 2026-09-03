import {
  BUCKET_ORDER,
  fmtMoney,
  skillById,
  type Bucket,
  type RepSummary,
  type SkillId,
} from '../../data/caliber/skill-intelligence';
import type { Forecast } from '../../data/caliber/forecast';

/** Largest scored pile. Unscored does not win a default filter. */
export function dominantBucket(s: RepSummary): Bucket | null {
  if (s.empty || s.thin) return null;
  let best: Bucket | null = null;
  let n = 0;
  for (const b of BUCKET_ORDER) {
    if (b === 'unscored') continue;
    const count = s.split[b].count;
    if (count > n) {
      best = b;
      n = count;
    }
  }
  return n ? best : null;
}

/** Team-stat wording, reused on the key, chips, and split-bar hover. */
export function v11BucketLabel(bucket: Bucket): string {
  switch (bucket) {
    case 'weak-stalled':
      return 'Stalled after a weak call';
    case 'strong-stalled':
      return 'Stalled after a strong call';
    case 'strong-moving':
      return 'Progressing after a strong call';
    case 'weak-moving':
      return 'Progressing after a weak call';
    case 'unscored':
      return 'Not scored';
  }
}

/** Short cell reads from the 1.1 quadrant screenshot. */
export function v11BucketRead(bucket: Bucket, skillId: SkillId): string {
  const skill = skillById(skillId).short;
  switch (bucket) {
    case 'strong-stalled':
      return `Not explained by ${skill}`;
    case 'strong-moving':
      return 'Healthy';
    case 'weak-stalled':
      return 'Consistent with skill gap';
    case 'weak-moving':
      return 'Skill was not the blocker here';
    case 'unscored':
      return '';
  }
}

export function forecastTipV11(f: Forecast, firstName: string): string {
  const skill = skillById(f.skillId);
  if (!f.exposedDeals) {
    return `No open deal on ${firstName}’s book sits behind a below-Proficient ${skill.short} call.`;
  }
  if (!f.material) {
    return `Only ${fmtMoney(f.exposed)} sits behind below-Proficient ${skill.short} calls.`;
  }
  return `If this score goes up about ${f.points} points, we have seen about ${fmtMoney(f.dollars)} more close. That is against ${fmtMoney(f.exposed)} sitting behind weak ${skill.short} calls.`;
}

export function forecastAgreedTipV11(f: Forecast, agreedOn: string): string {
  if (!f.material) {
    return `Agreed ${agreedOn}. Little of this open book sits behind weak calls.`;
  }
  return `Agreed ${agreedOn}. If this score goes up about ${f.points} points, we have seen about ${fmtMoney(f.dollars)} more close.`;
}

export function forecastPlanTipV11(f: Forecast, weeks: number, practicePerWeek: number): string {
  const skill = skillById(f.skillId);
  if (!f.material) {
    return `Only ${fmtMoney(f.exposed)} sits behind below-Proficient ${skill.short} calls.`;
  }
  return `If this score goes up about ${f.points} points, we have seen about ${fmtMoney(f.dollars)} more close. That is ${weeks} weeks at ${practicePerWeek}× a week.`;
}
