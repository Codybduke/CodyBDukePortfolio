import { useEffect, useMemo, useState } from 'react';
import { AiLabel, Alert, Amount, Breadcrumbs, Button, Card, Chip, Dropdown, Tag, Tooltip, type Tone } from './ui';
import { Gauge, SkillMeter, SplitBar } from './charts';
import { ForecastPair } from './ForecastPair';
import { QuadrantsV11 } from './QuadrantsV11';
import { IconAlert, IconCalendar, IconCheckCircle, IconGem, IconTarget } from './icons';
import type { Focus, ProtoVersion } from './types';
import { dominantBucket, forecastAgreedTipV11, forecastTipV11, v11BucketLabel } from './v11';
import {
  BUCKET_META,
  BUCKET_ORDER,
  COVERAGE_HELP,
  PROFICIENT_MIN,
  REPS,
  ROLE_PROFILE,
  SKILLS,
  STALL_DAYS,
  TEAM,
  THIN_MIN,
  bucketRead,
  fmtDate,
  fmtMoney,
  narrativeFor,
  placementHelp,
  repSubSkillAverages,
  skillById,
  summaryFor,
  tierFor,
  tierTone,
  weakestSkillFor,
  type Bucket,
  type Deal,
  type RepSummary,
  type SkillId,
} from '../../data/caliber/skill-intelligence';
import { forecastAgreedTip, forecastFor, richestSkill } from '../../data/caliber/forecast';

type Props = {
  repId: string;
  skillId: SkillId;
  onSkill: (s: SkillId) => void;
  bucket: Bucket | null;
  onBucket: (b: Bucket | null) => void;
  onBack: () => void;
  onOpenDeal: (dealId: string) => void;
  onSetFocus: () => void;
  focus?: Focus;
  onClearFocus: () => void;
  version?: ProtoVersion;
};

export function PersonView({
  repId,
  skillId,
  onSkill,
  bucket,
  onBucket,
  onBack,
  onOpenDeal,
  onSetFocus,
  focus,
  onClearFocus,
  version = '1',
}: Props) {
  const v11 = version === '1.1';
  const s = summaryFor(repId, skillId);
  const rep = s.rep;
  const first = rep.name.split(' ')[0];
  const skill = skillById(skillId);
  const subSkills = useMemo(() => repSubSkillAverages(repId, skillId), [repId, skillId]);
  const forecast = useMemo(() => forecastFor(repId, skillId), [repId, skillId]);
  const weakest = weakestSkillFor(repId);
  const status = fitStatus(s, v11);

  const [cleared, setCleared] = useState(false);
  useEffect(() => {
    setCleared(false);
  }, [repId, skillId, version]);

  const dominant = useMemo(() => dominantBucket(s), [s]);
  const activeBucket = v11 && !cleared ? (bucket ?? dominant) : bucket;

  const visible = useMemo(
    () => (activeBucket ? s.deals.filter((d) => d.bucket === activeBucket) : s.deals),
    [s.deals, activeBucket],
  );

  const pickBucket = (b: Bucket | null) => {
    if (b === null || b === activeBucket) {
      setCleared(true);
      onBucket(null);
      return;
    }
    setCleared(false);
    onBucket(b);
  };

  const percentile = percentileOf(repId, skillId);

  return (
    <>
      <div style={{ marginBottom: 18 }}>
        <Breadcrumbs
          items={[
            { label: 'Skill Intelligence', onClick: onBack },
            { label: TEAM.name, onClick: onBack },
            { label: rep.name },
          ]}
        />
      </div>

      {/* ---------------------------------------------------------- header */}
      <Card variant="raised">
        <div className="cal-between cal-wrap cal-gap-24" style={{ alignItems: 'flex-start' }}>
          <div className="cal-stack cal-gap-8" style={{ minWidth: 280, flex: 1 }}>
            <h1 className="cal-d32">{rep.name}</h1>
            <p className="cal-b14 cal-muted">
              {TEAM.name} · {ROLE_PROFILE} · {rep.tenureMonths} months in seat
            </p>
            {v11 ? null : (
              <p className="cal-b14 cal-row cal-gap-6" style={{ fontWeight: 600 }}>
                <IconGem size={15} /> Outperforming {percentile}% of the team on {skill.name}
              </p>
            )}
            <p className="cal-link cal-b14" role="link" tabIndex={0}>
              {v11 ? `View ${skill.short} calls` : `View ${rep.name} ${skill.name} calls`}
            </p>
            <div className="cal-row cal-gap-16 cal-mt-8 cal-wrap" style={v11 ? { alignItems: 'flex-start' } : undefined}>
              <MiniStat label="Live scored calls" value={String(rep.liveCalls)} />
              <MiniStat label="Practice reps" value={String(rep.practiceReps)} />
              <MiniStat label="Open deals" value={String(s.open)} />
              <MiniStat
                label="Coverage"
                value={v11 ? `${s.scored}/${s.open}` : `${Math.round(s.coverage * 100)}%`}
                sub={v11 ? 'scored' : `${s.scored}/${s.open} scored`}
                help={COVERAGE_HELP}
              />
            </div>
          </div>

          {/* The switcher, the score and the money, in that order — this is how
              Ellis decides which skill is worth the hour. */}
          <div className="cal-stack cal-gap-14" style={{ width: 430, maxWidth: '100%' }}>
            <div>
              <span className="cal-label">Skill</span>
              <SkillSwitcher repId={repId} value={skillId} onChange={onSkill} weakest={weakest} version={version} />
            </div>
            {/* The pair sits with the gauge, not in a box of its own: it is a
                claim about this score, not a second thing to read. */}
            <div className="cal-row cal-gap-16 cal-wrap">
              <Gauge value={s.osr} size={132} />
              <div className="cal-grow" style={{ minWidth: 200 }}>
                <ForecastPair
                  forecast={forecast}
                  firstName={first}
                  side="bottom"
                  tip={v11 ? forecastTipV11(forecast, first) : undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ------------------------------------------------------ fit or skill */}
      <div className="cal-mt-20">
        {s.empty ? (
          <EmptyBook
            name={first}
            open={s.open}
            liveCalls={rep.liveCalls}
            skillName={v11 ? skill.short : skill.name}
            version={version}
          />
        ) : (
          <Card
            title={
              <span className="cal-row cal-gap-8">
                {v11 ? 'Skill or lead?' : 'Fit or skill?'}
                <Tooltip label={placementHelp(skillId)} />
              </span>
            }
            /* The piles already state the split. All this has to add is which
               way it points. */
            aside={status ? <Tag tone={status.tone}>{status.label}</Tag> : null}
          >
            {v11 ? (
              <>
                <QuadrantsV11
                  summary={s}
                  skillId={skillId}
                  active={activeBucket}
                  onPick={(b) => pickBucket(activeBucket === b ? null : b)}
                />
                <div className="cal-mt-12">
                  <SplitBar
                    split={s.split}
                    total={s.open}
                    highlight={activeBucket}
                    onSegment={(b) => pickBucket(activeBucket === b ? null : b)}
                    labelFor={v11BucketLabel}
                  />
                  <div className="cal-mt-8">
                    <Legend version="1.1" />
                  </div>
                </div>
              </>
            ) : (
              <Quadrants
                summary={s}
                skillId={skillId}
                active={bucket}
                onPick={(b) => onBucket(bucket === b ? null : b)}
              />
            )}

            {s.thin ? (
              <div className="cal-mt-16">
                <Alert tone="gold" icon={<IconAlert size={15} />}>
                  Only {s.scored} of {first}’s {s.open} open deals have a scored call. Under {THIN_MIN}{' '}
                  we will not {v11 ? 'characterize' : 'characterise'} the shape of a book. This is a coverage
                  problem before it is a skill problem.
                </Alert>
              </div>
            ) : null}
          </Card>
        )}
      </div>

      {/* ------------------------------------------- breakdown + next action */}
      {v11 && s.empty ? null : (
      <div
        className="cal-mt-20"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
          gap: 20,
          alignItems: 'start',
        }}
      >
          <Card title={v11 ? 'Where it breaks down' : `Where ${skill.short} breaks down`}>
            <div className="cal-stack cal-gap-12">
              {subSkills.length ? (
                subSkills.map((sk, i) => (
                  <div key={sk.name} className="cal-stack cal-gap-6">
                    <div className="cal-between cal-b12">
                      <span className="cal-row cal-gap-6" style={{ color: i < 3 ? 'var(--cal-ink)' : 'var(--cal-ink-3)' }}>
                        {i < 3 ? <IconTarget size={13} style={{ color: 'var(--cal-gold)' }} /> : <IconCheckCircle size={13} style={{ color: 'var(--cal-green)' }} />}
                        {sk.name}
                      </span>
                      <span className="cal-num cal-muted">{sk.score}</span>
                    </div>
                    <SkillMeter score={sk.score} />
                  </div>
                ))
              ) : (
                <p className="cal-b14 cal-faint cal-italic">No scored calls in this window.</p>
              )}
            </div>

            {narrativeFor(repId, skillId) && !(v11 && s.thin) ? (
              <div className="cal-mt-16">
                <AiLabel />
                <p className="cal-b14 cal-muted cal-mt-8" style={{ lineHeight: 1.6 }}>
                  {narrativeFor(repId, skillId)}
                </p>
              </div>
            ) : null}
          </Card>

        <PriorityAction
          repId={repId}
          repName={rep.name}
          first={first}
          skillId={skillId}
          onSkill={onSkill}
          focus={focus}
          onSetFocus={onSetFocus}
          onClearFocus={onClearFocus}
          disabled={s.empty}
          version={version}
          thin={s.thin}
          status={status}
        />
      </div>
      )}

      {/* -------------------------------------------------------- deal table */}
      <div className="cal-mt-20">
        <Card title={`Open deals (${visible.length}${activeBucket ? ` of ${s.open}` : ''})`}>
          <div className="cal-row cal-wrap cal-gap-8" style={{ marginBottom: 16 }}>
            {BUCKET_ORDER.map((b) => {
              const data = s.split[b];
              if (!data.count) return null;
              return (
                <Chip
                  key={b}
                  active={activeBucket === b}
                  color={BUCKET_META[b].color}
                  onClick={() => pickBucket(activeBucket === b ? null : b)}
                >
                  {v11 ? v11BucketLabel(b) : BUCKET_META[b].short} · {data.count}
                  {data.amount ? <> <Amount>{fmtMoney(data.amount)}</Amount></> : null}
                </Chip>
              );
            })}
            {activeBucket ? (
              <Button size="sm" variant="ghost" onClick={() => pickBucket(null)}>Clear</Button>
            ) : null}
          </div>

          <DealTable deals={visible} onOpenDeal={onOpenDeal} watched={focus?.watchDealIds ?? []} />

          {s.missingAmount ? (
            <p className="cal-b12 cal-faint cal-mt-12">
              {v11 ? (
                `${s.missingAmount} deal${s.missingAmount === 1 ? '' : 's'} ${s.missingAmount === 1 ? 'has' : 'have'} no amount in CRM.`
              ) : (
                <>
                  {s.missingAmount} deal{s.missingAmount === 1 ? '' : 's'} ha
                  {s.missingAmount === 1 ? 's' : 've'} no amount in CRM. Those rows fall back to stage and last
                  activity rather than being dropped or given an estimate.
                </>
              )}
            </p>
          ) : null}
        </Card>
      </div>
    </>
  );
}

/* ------------------------------------------------------- skill switcher */

function SkillSwitcher({
  repId,
  value,
  onChange,
  weakest,
  version = '1',
}: {
  repId: string;
  value: SkillId;
  onChange: (s: SkillId) => void;
  weakest: SkillId;
  version?: ProtoVersion;
}) {
  const v11 = version === '1.1';
  const options = useMemo(() => {
    const forecasts = SKILLS.map((s) => ({ skill: s, f: forecastFor(repId, s.id) }));
    const top = [...forecasts].sort((a, b) => b.f.dollars - a.f.dollars)[0];
    return forecasts.map(({ skill, f }) => {
      const notes = [`${repOsrLabel(repId, skill.id)} OSR`];
      if (skill.id === weakest) notes.push('lowest score');
      if (top?.f.material && skill.id === top.skill.id) notes.push(v11 ? 'highest $' : 'most money behind it');
      return {
        id: skill.id,
        label: skill.name,
        meta: f.material ? `about ${fmtMoney(f.dollars)}` : '—',
        triggerMeta: v11 && f.material ? `about ${fmtMoney(f.dollars)}` : `${repOsrLabel(repId, skill.id)} OSR`,
        note: notes.join(' · '),
      };
    });
  }, [repId, weakest, v11]);

  return <Dropdown label="Skill" options={options} value={value} onChange={onChange} />;
}

function repOsrLabel(repId: string, skillId: SkillId): number {
  return REPS.find((r) => r.id === repId)?.osrBySkill[skillId] ?? 0;
}

/* ----------------------------------------------------------- quadrants */

function Quadrants({
  summary,
  skillId,
  active,
  onPick,
}: {
  summary: RepSummary;
  skillId: SkillId;
  active: Bucket | null;
  onPick: (b: Bucket) => void;
}) {
  const cell = (b: Bucket) => {
    const meta = BUCKET_META[b];
    const data = summary.split[b];
    return (
      <button
        type="button"
        className="cal-quad"
        aria-pressed={active === b}
        style={{ ['--quad-accent' as string]: meta.color }}
        onClick={() => onPick(b)}
      >
        <span className="cal-quad__figure">
          <span className="cal-quad__count cal-num">{data.count}</span>
          {data.amount ? <Amount>{fmtMoney(data.amount)}</Amount> : null}
        </span>
        <span className="cal-quad__meta">
          {data.count === 1 ? 'deal' : 'deals'}
          {data.missingAmount ? ` · ${data.missingAmount} with no amount` : ''}
        </span>
        <span className="cal-quad__read">{bucketRead(b, skillId)}</span>
      </button>
    );
  };

  return (
    <>
      {/* Best outcome top right: Proficient-or-better on top, moving on the
          right, so the grid reads like a quadrant rather than a list. */}
      <div className="cal-quads">
        <span className="cal-quads__corner" />
        <span className="cal-quads__colhead">Stalled {STALL_DAYS}+ days</span>
        <span className="cal-quads__colhead">Moved recently</span>

        <span className="cal-quads__rowhead">
          Proficient or better
          <span className="cal-b10 cal-faint">Last call {PROFICIENT_MIN}+ OSR</span>
        </span>
        {cell('strong-stalled')}
        {cell('strong-moving')}

        <span className="cal-quads__rowhead">
          Below Proficient
          <span className="cal-b10 cal-faint">Last call under {PROFICIENT_MIN} OSR</span>
        </span>
        {cell('weak-stalled')}
        {cell('weak-moving')}
      </div>

      <div className="cal-mt-12">
        <SplitBar split={summary.split} total={summary.open} highlight={active} onSegment={onPick} />
        <div className="cal-mt-8">
          <Legend />
        </div>
      </div>
    </>
  );
}

function Legend({ version = '1' }: { version?: ProtoVersion }) {
  return (
    <div className="cal-legend">
      {BUCKET_ORDER.map((b) => (
        <span key={b} className="cal-legend__item">
          <span className="cal-legend__dot" style={{ background: BUCKET_META[b].color }} />
          {version === '1.1' ? v11BucketLabel(b) : BUCKET_META[b].short}
        </span>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------- deal table */

export function DealTable({
  deals,
  onOpenDeal,
  watched,
}: {
  deals: Deal[];
  onOpenDeal: (id: string) => void;
  watched: string[];
}) {
  const sorted = useMemo(
    () => [...deals].sort((a, b) => b.daysIdle - a.daysIdle),
    [deals],
  );

  if (!sorted.length) {
    return <p className="cal-b14 cal-faint cal-italic">No deals in this group.</p>;
  }

  return (
    <table className="cal-table">
      <thead>
        <tr>
          <th>Deal</th>
          <th>Stage</th>
          <th className="cal-table__num">Amount</th>
          <th className="cal-table__num">Last activity</th>
          <th>Latest score</th>
          <th className="cal-table__num">Scored calls</th>
          <th>Close date</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((d) => {
          const tier = d.latestScore === null ? null : tierFor(d.latestScore);
          return (
            <tr key={d.id} data-clickable="true" onClick={() => onOpenDeal(d.id)}>
              <td className="cal-table__name">
                {d.name}
                {watched.includes(d.id) ? (
                  <span className="cal-table__sub" style={{ color: 'var(--cal-lime)' }}>On six-week focus</span>
                ) : null}
              </td>
              <td><Tag tone="outline">{d.stage}</Tag></td>
              <td className="cal-table__num">
                {d.amount === null ? (
                  <span className="cal-faint" title="No amount in CRM">—</span>
                ) : (
                  fmtMoney(d.amount)
                )}
              </td>
              <td className="cal-table__num" style={{ color: d.stalled ? 'var(--cal-bucket-weak-stalled)' : undefined }}>
                {d.daysIdle}d ago
              </td>
              <td>
                {tier ? (
                  <Tag tone={tierTone(tier)}>{d.latestScore} {tier}</Tag>
                ) : (
                  <span className="cal-faint cal-italic cal-b12">No scored call</span>
                )}
              </td>
              <td className="cal-table__num cal-muted">{d.calls.length || '—'}</td>
              <td className="cal-muted cal-b12">
                {fmtDate(d.closeDate)}
                {d.closeDatePushes ? (
                  <span className="cal-table__sub" style={{ color: 'var(--cal-orange)' }}>
                    pushed {d.closeDatePushes}×
                  </span>
                ) : null}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/* ------------------------------------------------------- priority action */

function PriorityAction({
  repId,
  repName,
  first,
  skillId,
  onSkill,
  focus,
  onSetFocus,
  onClearFocus,
  disabled,
  version = '1',
  thin = false,
  status = null,
}: {
  repId: string;
  repName: string;
  first: string;
  skillId: SkillId;
  onSkill: (s: SkillId) => void;
  focus?: Focus;
  onSetFocus: () => void;
  onClearFocus: () => void;
  disabled: boolean;
  version?: ProtoVersion;
  thin?: boolean;
  status?: { label: string; tone: Tone } | null;
}) {
  const v11 = version === '1.1';
  const skill = skillById(skillId);
  const forecast = useMemo(() => forecastFor(repId, skillId), [repId, skillId]);
  const richest = useMemo(() => richestSkill(repId, SKILLS.map((s) => s.id)), [repId]);
  const watchedAmount = useMemo(() => {
    if (!focus) return 0;
    const ids = new Set(focus.watchDealIds);
    return summaryFor(repId, focus.skillId)
      .deals.filter((d) => ids.has(d.id))
      .reduce((sum, d) => sum + (d.amount ?? 0), 0);
  }, [repId, focus]);
  const betterSkill = richest && richest.skillId !== skillId && richest.dollars > forecast.dollars
    ? richest
    : null;

  return (
    <Card title={v11 ? 'Priority action' : `Priority action for ${repName}`}>
      {focus ? (
        <div className="cal-stack cal-gap-16">
          <div className="cal-row cal-gap-8 cal-wrap">
            <Tag tone="lime">Six-week focus</Tag>
            <Tag tone="outline">
              <IconCalendar size={12} /> {fmtDate(focus.startsOn)} – {fmtDate(focus.endsOn)}
            </Tag>
          </div>
          <div className="cal-stack cal-gap-4">
            <span className="cal-eyebrow">{skillById(focus.skillId).name}</span>
            <p className="cal-d18">{focus.subSkill}</p>
          </div>
          <ul className="cal-plan">
            <li>{v11 ? 'Practice' : 'Practise'} {focus.subSkill} {focus.practicePerWeek}× a week</li>
            <li>
              Watch {focus.watchDealIds.length} {focus.watchDealIds.length === 1 ? 'deal' : 'deals'}
              {watchedAmount ? <> <Amount>{fmtMoney(watchedAmount)}</Amount></> : null}
            </li>
            <li>Score every live call on those deals against {skillById(focus.skillId).name}</li>
          </ul>

          <ForecastPair
            forecast={focus.forecast}
            firstName={first}
            eyebrow={v11 ? 'What we have seen this kind of plan go with' : 'What this plan has been worth'}
            tip={v11 ? forecastAgreedTipV11(focus.forecast, fmtDate(focus.setOn)) : forecastAgreedTip(focus.forecast, fmtDate(focus.setOn))}
          />

          {v11 ? null : (
            <>
              <hr className="cal-divider" />
              <div className="cal-stack cal-gap-10">
                <span className="cal-eyebrow">What gets reported at week six</span>
                <Checklist items={[
                  `Practice reps completed vs ${focus.practicePerWeek * 6} agreed`,
                  `Live ${skillById(focus.skillId).name} score on the watched deals, start vs end`,
                  'Stage movement and stall on those same deals',
                  'Open value that moved stage, against the forecast above',
                ]} />
              </div>
            </>
          )}
          <div className="cal-row cal-gap-8">
            <Button size="sm" onClick={onSetFocus}>Edit focus</Button>
            <Button size="sm" variant="ghost" onClick={onClearFocus}>Remove</Button>
          </div>
        </div>
      ) : (
        <div className="cal-stack cal-gap-16">
          {v11 ? (
            <>
              <div className="cal-card cal-card--dashed" style={{ padding: '14px 16px' }}>
                <p className="cal-b14 cal-faint cal-italic">
                  {disabled
                    ? `None of ${first}’s scored calls sit on a currently open deal.`
                    : thin
                      ? 'Too few scored open deals to set a focus on this skill.'
                      : status?.tone === 'blue'
                        ? 'This skill is not what is stalling these deals.'
                        : 'No focus set for this window.'}
                </p>
              </div>
              <div>
                {disabled || thin ? (
                  <Button variant="primary">Upload calls from these deals</Button>
                ) : status?.tone === 'blue' ? (
                  betterSkill ? (
                    <Button variant="primary" onClick={() => onSkill(betterSkill.skillId)}>
                      Look at {skillById(betterSkill.skillId).name}
                    </Button>
                  ) : (
                    <p className="cal-b13 cal-faint">Use the skill switcher above.</p>
                  )
                ) : (
                  <Button variant="primary" onClick={onSetFocus}>Set six-week focus</Button>
                )}
              </div>
              {disabled || thin ? null : (
                <ForecastPair
                  forecast={forecast}
                  firstName={first}
                  tip={forecastTipV11(forecast, first)}
                />
              )}
              {betterSkill && !disabled && !thin ? (
                <p className="cal-b13 cal-muted">
                  {skillById(betterSkill.skillId).name} has more behind it.{' '}
                  <span
                    className="cal-link"
                    role="link"
                    tabIndex={0}
                    onClick={() => onSkill(betterSkill.skillId)}
                    onKeyDown={(e) => { if (e.key === 'Enter') onSkill(betterSkill.skillId); }}
                  >
                    Look at that skill
                  </span>
                </p>
              ) : null}
            </>
          ) : (
            <>
              <p className="cal-b16 cal-muted cal-italic">No actions have been identified.</p>
              {disabled ? (
                <p className="cal-b14 cal-muted" style={{ lineHeight: 1.6 }}>
                  There are no scored calls on {first}’s open deals, so there is nothing to base a focus on yet. Upload calls from this pipeline first.
                </p>
              ) : (
                <>
                  <ForecastPair
                    forecast={forecast}
                    firstName={first}
                    eyebrow={`If ${first} improves ${skill.name}`}
                  />
                  {betterSkill ? (
                    <p className="cal-b13 cal-muted" style={{ lineHeight: 1.6 }}>
                      {skillById(betterSkill.skillId).name} has more behind it on this book: about{' '}
                      {fmtMoney(betterSkill.dollars)} for a {betterSkill.points}-point gain.{' '}
                      <span
                        className="cal-link"
                        role="link"
                        tabIndex={0}
                        onClick={() => onSkill(betterSkill.skillId)}
                        onKeyDown={(e) => { if (e.key === 'Enter') onSkill(betterSkill.skillId); }}
                      >
                        Look at that skill instead
                      </span>
                    </p>
                  ) : null}
                </>
              )}
              <div>
                <Button variant="primary" onClick={onSetFocus} disabled={disabled}>
                  Set six-week focus
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </Card>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
      {items.map((i) => (
        <li key={i} className="cal-row cal-gap-8 cal-b14 cal-muted" style={{ alignItems: 'flex-start' }}>
          <IconCheckCircle size={15} style={{ color: 'var(--cal-green)', flex: 'none', marginTop: 2 }} />
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------------------------------------- empty */

function EmptyBook({
  name,
  open,
  liveCalls,
  skillName,
  version = '1',
}: {
  name: string;
  open: number;
  liveCalls: number;
  skillName: string;
  version?: ProtoVersion;
}) {
  return (
    <Card variant="dashed">
      <div className="cal-stack cal-gap-12" style={{ alignItems: 'flex-start' }}>
        <Tag tone="gray">No coverage</Tag>
        <h3 className="cal-d20">Nothing to place yet</h3>
        <p className="cal-b14 cal-muted" style={{ maxWidth: 620, lineHeight: 1.6 }}>
          {version === '1.1'
            ? `${name} has ${liveCalls} scored ${skillName} calls in this window. None of them are on open deals, so this view cannot say whether the skill is landing on live pipeline.`
            : `${name} has ${liveCalls} scored ${skillName} calls in this window, but none of them sit on a currently open deal. They were scored on deals that have since closed. All ${open} open deals are unscored, so this view cannot say anything about whether the skill is landing on live pipeline, or what it is worth.`}
        </p>
        <Button variant="primary">Upload calls from these deals</Button>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------- helpers */

function MiniStat({ label, value, sub, help }: { label: string; value: string; sub?: string; help?: string }) {
  return (
    <div className="cal-stack cal-gap-4">
      <span className="cal-b12 cal-muted cal-row cal-gap-6">
        {label}
        {help ? <Tooltip label={help} /> : null}
      </span>
      <span className="cal-d18 cal-num">{value}</span>
      {sub ? <span className="cal-b10 cal-faint">{sub}</span> : null}
    </div>
  );
}

/** Share of teammates this rep out-scores, as the packet's Skill Report phrases it. */
function percentileOf(repId: string, skillId: SkillId): number {
  const mine = REPS.find((r) => r.id === repId)?.osrBySkill[skillId] ?? 0;
  const others = REPS.filter((r) => r.id !== repId);
  if (!others.length) return 100;
  return Math.round((others.filter((r) => r.osrBySkill[skillId] < mine).length / others.length) * 100);
}

/**
 * Which way the piles point, in four words. The counts and the dollars are
 * already on the quadrant, so restating them in a paragraph earned nothing.
 * Tones follow the pile colours: orange is stalled-after-weak, blue is
 * stalled-after-strong.
 */
function fitStatus(s: RepSummary, v11 = false): { label: string; tone: Tone } | null {
  if (s.thin || s.empty) return null;
  const ws = s.split['weak-stalled'].count;
  const ss = s.split['strong-stalled'].count;
  const wm = s.split['weak-moving'].count;
  if (v11 && wm > ws && wm > ss) return { label: 'Deals are moving anyway', tone: 'gray' };
  if (!ws && !ss) return null;
  if (ws > ss * 2) return { label: v11 ? 'Skill problem' : 'Looks like skill, not the leads', tone: 'orange' };
  if (ss > ws) return { label: v11 ? 'Lead problem' : 'Looks like fit, not this skill', tone: 'blue' };
  return { label: v11 ? 'Skill and lead' : 'Skill and fit both show', tone: 'gray' };
}
