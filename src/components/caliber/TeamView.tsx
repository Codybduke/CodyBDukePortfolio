import { useMemo } from 'react';
import { Amount, Button, Card, Legend, Tabs, Tag, Toggle, Tooltip } from './ui';
import { HeatmapHead, HeatmapRow, OsrBar, SplitBar } from './charts';
import { IconChevronRight, IconChevronUp } from './icons';
import {
  BUCKET_META,
  COVERAGE_HELP,
  DEFAULT_SKILL,
  ROLE_PROFILE,
  SKILL,
  STALL_DAYS,
  SUMMARIES,
  TEAM,
  TEAM_COVERAGE,
  fmtMoney,
  tierFor,
  tierTone,
  type Bucket,
} from '../../data/caliber/skill-intelligence';
import { forecastFor, forecastTip, type Forecast } from '../../data/caliber/forecast';
import type { ProtoVersion } from './types';
import { v11BucketLabel } from './v11';

const OPPORTUNITY_HELP =
  'What a realistic gain on this skill has been worth on this rep’s open book. Across customers we have seen books like this close about that much more. It is an association, not a projection.';

export type TeamTab = 'skill' | 'deals';

type Props = {
  tab: TeamTab;
  onTab: (t: TeamTab) => void;
  compare: boolean;
  onCompare: (v: boolean) => void;
  onOpenRep: (repId: string, bucket?: Bucket) => void;
  version?: ProtoVersion;
};

const LEGEND_ORDER: Bucket[] = ['weak-stalled', 'strong-stalled', 'weak-moving', 'strong-moving', 'unscored'];

export function TeamView({ tab, onTab, compare, onCompare, onOpenRep, version = '1' }: Props) {
  const v11 = version === '1.1';
  // Coaching priority: most open deals stalled behind a below-Proficient call.
  const rows = useMemo(
    () =>
      [...SUMMARIES].sort(
        (a, b) =>
          b.split['weak-stalled'].count - a.split['weak-stalled'].count ||
          a.rep.osr - b.rep.osr,
      ),
    [],
  );

  /**
   * "Which person has the most money behind a skill gain." The team tab is
   * still one skill, so this is discovery; the person page is where Ellis
   * compares skills against each other.
   */
  const forecasts = useMemo(
    () =>
      Object.fromEntries(
        SUMMARIES.map((s) => [s.rep.id, forecastFor(s.rep.id, DEFAULT_SKILL)]),
      ) as Record<string, Forecast>,
    [],
  );

  const stalledTotal = SUMMARIES.reduce((s, r) => s + r.stalledCount, 0);
  const weakStalled = TEAM.split['weak-stalled'];
  const strongStalled = TEAM.split['strong-stalled'];

  return (
    <>
      <div className="cal-between cal-wrap" style={{ marginBottom: 22 }}>
        <h1 className="cal-d40">
          Skill Intelligence<span style={{ fontSize: 18, verticalAlign: 'super' }}>™</span>
        </h1>
        <Button>View Skill Evaluations</Button>
      </div>

      <div className="cal-filters" style={{ marginBottom: 28 }}>
        <Filter label="Role profile:" value={ROLE_PROFILE} />
        <Filter label="Skill:" value={SKILL} />
        <Filter label="Teams / Members:" value={TEAM.name} />
        <Filter label="Time frame:" value="Last 90 days" />
      </div>

      <Tabs
        tabs={[
          { id: 'skill', label: 'Skill' },
          { id: 'deals', label: 'Deals', badge: 'NEW' },
        ]}
        value={tab}
        onChange={onTab}
      />

      {tab === 'skill' ? (
        <SkillTab compare={compare} onCompare={onCompare} onOpenRep={onOpenRep} version={version} />
      ) : (
        <div className="cal-stack cal-gap-20" style={{ marginTop: 24 }}>
          <Card title={`${SKILL} on open deals`}>
            <div className="cal-row cal-wrap cal-gap-32" style={{ marginBottom: 20, alignItems: 'flex-start' }}>
              <Stat label="Open deals" value={String(TEAM.openDeals)} sub={fmtMoney(TEAM.openAmount)} />
              <Stat
                label="Scored"
                value={`${TEAM.scoredDeals}`}
                sub={`${Math.round(TEAM_COVERAGE * 100)}% coverage`}
                help={COVERAGE_HELP}
              />
              <Stat label={`Stalled ${STALL_DAYS}+ days`} value={String(stalledTotal)} />
              <Stat
                label="Stalled after a weak call"
                value={String(weakStalled.count)}
                amount={fmtMoney(weakStalled.amount)}
                sub="below Proficient"
                tone="var(--cal-bucket-weak-stalled)"
              />
              <Stat
                label="Stalled after a strong call"
                value={String(strongStalled.count)}
                amount={fmtMoney(strongStalled.amount)}
                sub="Proficient or better"
                tone="var(--cal-bucket-strong-stalled)"
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <Legend
                items={LEGEND_ORDER.map((b) => ({
                  color: BUCKET_META[b].color,
                  label: v11 ? v11BucketLabel(b) : BUCKET_META[b].short,
                }))}
              />
            </div>

            <table className="cal-table">
              <thead>
                <tr>
                  <th>Rep</th>
                  <th>Live OSR</th>
                  <th className="cal-table__num">Tenure</th>
                  <th className="cal-table__num">Coverage</th>
                  <th style={{ width: '28%', minWidth: 220 }}>{v11 ? 'Open deals by score' : 'Open book by discovery score'}</th>
                  <th className="cal-table__num">Stalled after weak call</th>
                  <th className="cal-table__num">
                    <span className="cal-row cal-gap-6" style={{ justifyContent: 'flex-end' }}>
                      Opportunity
                      <Tooltip label={OPPORTUNITY_HELP} />
                    </span>
                  </th>
                  <th aria-label="Open" />
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => {
                  const tier = tierFor(s.rep.osr);
                  const ws = s.split['weak-stalled'];
                  return (
                    <tr
                      key={s.rep.id}
                      data-clickable="true"
                      data-flag={ws.count >= 5}
                      onClick={() => onOpenRep(s.rep.id)}
                    >
                      <td className="cal-table__name">
                        {s.rep.name}
                        {ws.count >= 5 ? (
                          <span className="cal-table__sub" style={{ color: 'var(--cal-bucket-weak-stalled)' }}>
                            Largest coaching gap on this team
                          </span>
                        ) : null}
                        {s.empty ? <span className="cal-table__sub">No scored call on any open deal</span> : null}
                        {s.thin ? <span className="cal-table__sub">Thin data, {s.scored} scored deals</span> : null}
                      </td>
                      <td><Tag tone={tierTone(tier)}>{s.rep.osr} {tier}</Tag></td>
                      <td className="cal-muted cal-table__num">{s.rep.tenureMonths} mo</td>
                      <td className="cal-table__num">
                        {s.scored}/{s.open}
                        <span className="cal-table__sub">{Math.round(s.coverage * 100)}%</span>
                      </td>
                      <td>
                        <SplitBar split={s.split} total={s.open} labelFor={v11 ? v11BucketLabel : undefined} />
                      </td>
                      {/* Count and dollars share a baseline on every row, so
                          the column still scans when a rep has none. */}
                      <td className="cal-table__num">
                        <span
                          className="cal-row cal-gap-6"
                          style={{ justifyContent: 'flex-end', alignItems: 'baseline' }}
                        >
                          <strong className={ws.count ? undefined : 'cal-faint'}>{ws.count}</strong>
                          {ws.amount ? <Amount>{fmtMoney(ws.amount)}</Amount> : null}
                        </span>
                      </td>
                      <td className="cal-table__num" title={forecastTip(forecasts[s.rep.id], s.rep.name.split(' ')[0])}>
                        {forecasts[s.rep.id].material ? (
                          <>
                            about {fmtMoney(forecasts[s.rep.id].dollars)}
                            <span className="cal-table__sub">+{forecasts[s.rep.id].points} pts</span>
                          </>
                        ) : (
                          <span className="cal-faint">—</span>
                        )}
                      </td>
                      <td style={{ width: 28, color: 'var(--cal-ink-4)' }}><IconChevronRight size={15} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------ skill tab */

function SkillTab({
  compare,
  onCompare,
  onOpenRep,
  version = '1',
}: {
  compare: boolean;
  onCompare: (v: boolean) => void;
  onOpenRep: (repId: string) => void;
  version?: ProtoVersion;
}) {
  return (
    <div className="cal-stack cal-gap-20" style={{ marginTop: 24 }}>
      <h2 className="cal-d24 cal-row cal-gap-8">
        Overall Skill Rating (OSR) <Tooltip label="Weighted average of every scored live call and role play on this skill in the window." />
      </h2>

      <Card title={`${SKILL}: overall`}>
        <OsrBar value={TEAM.osr} />
      </Card>

      <Card
        title={`${SKILL}: teams & individuals`}
        aside={<Toggle on={compare} onChange={onCompare} label="Compare to previous time frame" />}
      >
        <HeatmapHead />
        <HeatmapRow
          variant="team"
          name={<><IconChevronUp size={14} /> {TEAM.name}</>}
          value={TEAM.osr}
          delta={TEAM.delta}
          showDelta={compare}
        />
        {SUMMARIES.map((s) => (
          <HeatmapRow
            key={s.rep.id}
            name={s.rep.name}
            value={s.rep.osr}
            delta={s.rep.delta}
            showDelta={compare}
            onClick={() => onOpenRep(s.rep.id)}
          />
        ))}
        {version === '1.1' ? null : (
          <p className="cal-b12 cal-faint" style={{ marginTop: 14 }}>
            This is the existing skill view, unchanged. It answers who is low, not why. The Deals tab is the new surface.
          </p>
        )}
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------- helpers */

function Filter({ label, value }: { label: string; value: string }) {
  return (
    <div className="cal-filter">
      <span className="cal-label">{label}</span>
      <div className="cal-field">
        <span>{value}</span>
        <span className="cal-field__x">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6 18 18M18 6 6 18" />
          </svg>
        </span>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  amount,
  sub,
  tone,
  help,
}: {
  label: string;
  value: string;
  /** Dollars in parentheses beside the count, same size, not bold. */
  amount?: string;
  sub?: string;
  tone?: string;
  help?: string;
}) {
  return (
    <div className="cal-stack cal-gap-4">
      <span className="cal-eyebrow cal-row cal-gap-6">
        {label}
        {help ? <Tooltip label={help} /> : null}
      </span>
      <span className="cal-d24 cal-num" style={{ color: tone }}>
        {value}
        {amount ? <> <Amount>{amount}</Amount></> : null}
      </span>
      {sub ? <span className="cal-b12 cal-faint">{sub}</span> : null}
    </div>
  );
}
