import { useEffect, useMemo, useState } from 'react';
import { Button, Checkbox, Dropdown, Modal, Picker, Tag, Tooltip } from './ui';
import { SkillMeter } from './charts';
import { ForecastPair } from './ForecastPair';
import { IconCalendar } from './icons';
import type { Focus, ProtoVersion } from './types';
import { forecastPlanTipV11 } from './v11';
import {
  BUCKET_ORDER,
  PROFICIENT_MIN,
  SKILLS,
  STALL_DAYS,
  SUB_SKILL_HELP,
  TODAY,
  fmtDate,
  fmtMoney,
  repSubSkillAverages,
  skillById,
  summaryFor,
  tierFor,
  tierTone,
  type SkillId,
  type SubSkill,
} from '../../data/caliber/skill-intelligence';
import { forecastFor, forecastForPlan, forecastPlanTip } from '../../data/caliber/forecast';

const WEEKS = ['4', '6', '8'] as const;

function addWeeks(base: Date, weeks: number): Date {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + weeks * 7);
  return d;
}

/**
 * Fills the packet's empty "Priority action". Two jobs: pin a T0 so a rising
 * score can be reported against something, and show what the plan has been
 * worth — the prediction moves when the skill, the sub-skill, the window or
 * the practice cadence moves.
 */
export function FocusModal({
  repId,
  skillId,
  existing,
  preselectDealId,
  onClose,
  onSave,
  version = '1',
}: {
  repId: string;
  skillId: SkillId;
  existing?: Focus;
  preselectDealId?: string | null;
  onClose: () => void;
  onSave: (f: Focus) => void;
  version?: ProtoVersion;
}) {
  const v11 = version === '1.1';
  const [skill, setSkill] = useState<SkillId>(existing?.skillId ?? skillId);
  const s = summaryFor(repId, skill);
  const rep = s.rep;
  const first = rep.name.split(' ')[0];
  const ranked = useMemo(() => repSubSkillAverages(repId, skill), [repId, skill]);

  const [subSkill, setSubSkill] = useState<SubSkill>(existing?.subSkill ?? ranked[0]?.name);
  const [weeks, setWeeks] = useState<(typeof WEEKS)[number]>(
    existing ? (String(Math.round((+existing.endsOn - +existing.startsOn) / 6048e5)) as (typeof WEEKS)[number]) : '6',
  );
  const [practice, setPractice] = useState(existing?.practicePerWeek ?? 2);

  // Switching skill invalidates the sub-skill: it belongs to the old scorecard.
  useEffect(() => {
    if (!ranked.some((r) => r.name === subSkill)) setSubSkill(ranked[0]?.name);
  }, [ranked, subSkill]);

  /** Recommended first: the deals the split says are actionable. */
  const candidates = useMemo(
    () =>
      [...s.deals]
        .filter((d) => d.latestScore !== null)
        .sort(
          (a, b) =>
            BUCKET_ORDER.indexOf(a.bucket) - BUCKET_ORDER.indexOf(b.bucket) ||
            (b.amount ?? 0) - (a.amount ?? 0),
        ),
    [s.deals],
  );

  const recommended = useMemo(
    () => new Set(s.deals.filter((d) => d.bucket === 'weak-stalled').map((d) => d.id)),
    [s.deals],
  );

  const [watch, setWatch] = useState<string[]>(() => {
    if (existing) return existing.watchDealIds;
    const base = s.deals.filter((d) => d.bucket === 'weak-stalled').map((d) => d.id);
    if (preselectDealId && !base.includes(preselectDealId)) return [...base, preselectDealId];
    return base;
  });

  // A watch list from another skill's split does not survive the switch.
  useEffect(() => {
    setWatch((w) => {
      const valid = w.filter((id) => candidates.some((d) => d.id === id));
      return valid.length ? valid : [...recommended];
    });
  }, [candidates, recommended]);

  const starts = existing?.startsOn ?? TODAY;
  const ends = addWeeks(starts, Number(weeks));
  const watchedAmount = s.deals
    .filter((d) => watch.includes(d.id))
    .reduce((sum, d) => sum + (d.amount ?? 0), 0);

  const plan = useMemo(
    () => forecastForPlan({ repId, skillId: skill, subSkill, weeks: Number(weeks), practicePerWeek: practice }),
    [repId, skill, subSkill, weeks, practice],
  );

  const skillOptions = useMemo(
    () =>
      SKILLS.map((sk) => {
        const f = forecastFor(repId, sk.id);
        return {
          id: sk.id,
          label: sk.name,
          meta: f.material ? `about ${fmtMoney(f.dollars)}` : '—',
          triggerMeta: v11 && f.material ? `about ${fmtMoney(f.dollars)}` : `${rep.osrBySkill[sk.id]} OSR`,
          note: `${rep.osrBySkill[sk.id]} OSR · ${f.exposedDeals} deal${f.exposedDeals === 1 ? '' : 's'} below Proficient`,
        };
      }),
    [repId, rep, v11],
  );

  const toggle = (id: string) =>
    setWatch((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));

  return (
    <Modal
      eyebrow={<span className="cal-eyebrow">Priority action</span>}
      title={`Set ${weeks === '8' ? 'an' : 'a'} ${weeks}-week focus for ${rep.name}`}
      size="mid"
      onClose={onClose}
      footer={
        <>
          <Button
            variant="primary"
            disabled={!watch.length || !subSkill}
            onClick={() =>
              onSave({
                repId,
                skillId: skill,
                subSkill,
                startsOn: starts,
                endsOn: ends,
                practicePerWeek: practice,
                watchDealIds: watch,
                setOn: TODAY,
                forecast: plan,
              })
            }
          >
            {existing ? 'Update focus' : 'Set focus'}
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          {!watch.length ? (
            <span className="cal-b12 cal-faint">Pick at least one deal to watch.</span>
          ) : null}
        </>
      }
    >
      <div className="cal-stack cal-gap-20">
        {/* ------------------------------------------------------ forecast */}
        <ForecastPair
          forecast={plan}
          firstName={first}
          eyebrow={v11 ? 'What we have seen this kind of plan go with' : 'What this plan has been worth'}
          tip={v11 ? forecastPlanTipV11(plan, Number(weeks), practice) : forecastPlanTip(plan, Number(weeks), practice)}
          side="bottom"
        />

        {/* -------------------------------------------------------- skill */}
        <section>
          <span className="cal-label">Skill</span>
          <Dropdown label="Skill" options={skillOptions} value={skill} onChange={setSkill} />
        </section>

        {/* ----------------------------------------------------- sub-skill */}
        <section>
          <div className="cal-between" style={{ marginBottom: 10 }}>
            <span className="cal-label" style={{ margin: 0 }}>
              What {first} will {v11 ? 'practice' : 'practise'}
            </span>
            <Tooltip
              side="bottom"
              label="One sub-skill per rep per window. Eight reps with eight different plans is unmanageable, so the list is the lowest scoring first."
            />
          </div>
          <div className="cal-stack cal-gap-8">
            {ranked.slice(0, 4).map((sk, i) => (
              <button
                key={sk.name}
                type="button"
                className="cal-card"
                aria-pressed={subSkill === sk.name}
                onClick={() => setSubSkill(sk.name)}
                style={{
                  padding: '11px 13px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderColor: subSkill === sk.name ? 'var(--cal-lime)' : undefined,
                  background: subSkill === sk.name ? 'rgba(110,229,18,0.06)' : undefined,
                }}
              >
                <div className="cal-between cal-gap-10" style={{ marginBottom: 7 }}>
                  <span className="cal-row cal-gap-8 cal-b14">
                    <span style={{ fontWeight: 600 }}>{sk.name}</span>
                    {i === 0 ? <Tag tone="gold">Lowest</Tag> : null}
                  </span>
                  <span className="cal-num cal-muted cal-b12">{sk.score}</span>
                </div>
                <SkillMeter score={sk.score} />
                {!v11 || subSkill === sk.name ? (
                  <p className="cal-b12 cal-faint" style={{ marginTop: 7 }}>{SUB_SKILL_HELP[sk.name]}</p>
                ) : null}
              </button>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------- time window */}
        <section>
          <span className="cal-label">Time window</span>
          <div className="cal-row cal-gap-16 cal-wrap">
            <Picker options={WEEKS} value={weeks} onChange={setWeeks} labels={{ '4': '4 weeks', '6': '6 weeks', '8': '8 weeks' }} />
            <span className="cal-row cal-gap-8 cal-b14 cal-muted">
              <IconCalendar size={15} />
              {fmtDate(starts)} – {fmtDate(ends)}
            </span>
          </div>
        </section>

        {/* ------------------------------------------------------ practice */}
        <section>
          <div className="cal-row cal-gap-6" style={{ marginBottom: 6 }}>
            <span className="cal-label" style={{ margin: 0 }}>Practice</span>
            <Tooltip
              side="bottom"
              label="Practice is evidence the coaching happened. It is counted separately and never added to the live call score this focus is measured on."
            />
          </div>
          <div className="cal-row cal-gap-16 cal-wrap">
            <Picker
              options={['1', '2', '3'] as const}
              value={String(practice) as '1' | '2' | '3'}
              onChange={(v) => setPractice(Number(v))}
              labels={{ '1': '1× / week', '2': '2× / week', '3': '3× / week' }}
            />
            <span className="cal-b14 cal-muted">
              {practice * Number(weeks)} role plays over the window
            </span>
          </div>
        </section>

        {/* --------------------------------------------------------- deals */}
        <section>
          <div className="cal-between" style={{ marginBottom: 8 }}>
            <span className="cal-label" style={{ margin: 0 }}>
              Deals to watch ({watch.length})
            </span>
            <span className="cal-b12 cal-faint">
              {watchedAmount ? `${fmtMoney(watchedAmount)} open` : ''}
            </span>
          </div>
          <p className="cal-b12 cal-faint" style={{ marginBottom: 12 }}>
            {v11
              ? `Recommended = stalled after a weak ${skillById(skill).short} call. Those are checked.`
              : `Checked by default: every open deal whose last ${skillById(skill).short} call scored under ${PROFICIENT_MIN} and that has not moved in ${STALL_DAYS}+ days. Those are the deals whose stage and activity get reported at week ${weeks}.`}
          </p>
          <div className="cal-stack cal-gap-8">
            {candidates.map((d) => {
              const tier = tierFor(d.latestScore as number);
              return (
                <Checkbox key={d.id} checked={watch.includes(d.id)} onChange={() => toggle(d.id)}>
                  <span className="cal-between cal-gap-10">
                    <span className="cal-grow">
                      <span className="cal-row cal-gap-8">
                        <span>{d.name}</span>
                        {recommended.has(d.id) ? <Tag tone="gray">Recommended</Tag> : null}
                      </span>
                      <span className="cal-table__sub">
                        {d.stage} · {fmtMoney(d.amount)} · {d.daysIdle}d since activity
                      </span>
                    </span>
                    <Tag tone={tierTone(tier)}>{d.latestScore}</Tag>
                  </span>
                </Checkbox>
              );
            })}
          </div>
        </section>
      </div>
    </Modal>
  );
}
