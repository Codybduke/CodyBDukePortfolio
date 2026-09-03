import type { SkillId, SubSkill } from '../../data/caliber/skill-intelligence';
import type { Forecast } from '../../data/caliber/forecast';

/** Presenter toggle. 1.0 is the shipped walkthrough; 1.1 is the critique pass. */
export type ProtoVersion = '1' | '1.1';

/**
 * The dated treatment. The packet's Skill Report shows "No actions have been
 * identified" — this is the object that fills it, and the T0 the model needs to
 * say "after the focus" rather than "because of it".
 *
 * `forecast` is stored rather than recomputed so the card keeps showing the
 * number Ellis agreed to, which is what week six gets measured against.
 */
export type Focus = {
  repId: string;
  skillId: SkillId;
  subSkill: SubSkill;
  startsOn: Date;
  endsOn: Date;
  practicePerWeek: number;
  watchDealIds: string[];
  setOn: Date;
  forecast: Forecast;
};
