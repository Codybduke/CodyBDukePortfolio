import { AiLabel, Alert, Button, Modal, Tag, Tooltip } from './ui';
import { SkillMeter } from './charts';
import { IconAlert, IconCheckCircle, IconClock, IconPhone, IconUsers } from './icons';
import type { ProtoVersion } from './types';
import {
  BUCKET_META,
  PROFICIENT_MIN,
  STALL_DAYS,
  SUB_SKILL_HELP,
  bucketRead,
  fmtDate,
  fmtMoney,
  repById,
  skillById,
  tierFor,
  tierTone,
  type Deal,
  type SkillId,
} from '../../data/caliber/skill-intelligence';

/**
 * One named deal. This is the grain the model argues for: score the call, then
 * look at what the deal did afterwards.
 */
export function DealModal({
  deal,
  skillId,
  onClose,
  onSetFocus,
  version = '1',
  hasFocus = false,
}: {
  deal: Deal;
  skillId: SkillId;
  onClose: () => void;
  onSetFocus: () => void;
  version?: ProtoVersion;
  hasFocus?: boolean;
}) {
  const v11 = version === '1.1';
  const skill = skillById(skillId);
  const rep = repById(deal.repId);
  const latest = deal.calls[deal.calls.length - 1];
  const meta = BUCKET_META[deal.bucket];
  const growth = latest ? [...latest.subSkills].sort((a, b) => a.score - b.score).slice(0, 3) : [];
  const strengths = latest ? [...latest.subSkills].sort((a, b) => b.score - a.score).slice(0, 3) : [];

  const signals: { tone: 'red' | 'gold' | 'gray'; text: string }[] = [];
  if (!deal.economicBuyerOnCall) {
    signals.push({ tone: 'gold', text: 'No economic buyer has appeared on any scored call for this deal.' });
  }
  if (!v11 && deal.closeDatePushes) {
    signals.push({
      tone: deal.closeDatePushes > 1 ? 'red' : 'gold',
      text: `Close date has been pushed ${deal.closeDatePushes} time${deal.closeDatePushes === 1 ? '' : 's'}.`,
    });
  }
  if (!deal.nextStepSet) {
    signals.push({ tone: 'gray', text: 'No next step is recorded on the deal.' });
  }
  if (!v11 && deal.stalled) {
    signals.push({
      tone: 'gray',
      text: `Nothing has touched this deal in ${deal.daysIdle} days. It has been in ${deal.stage} for ${deal.daysInStage} days.`,
    });
  }

  return (
    <Modal
      eyebrow={<span className="cal-eyebrow">{rep?.name} · Open deal</span>}
      title={deal.name}
      onClose={onClose}
      footer={
        <>
          <Button variant="primary" onClick={onSetFocus}>{v11 && hasFocus ? 'Add to this focus' : 'Add to six-week focus'}</Button>
          <Button>Open in CRM</Button>
          <span className="cal-grow" />
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </>
      }
    >
      {/* ------------------------------------------------------------ facts */}
      <div className="cal-row cal-wrap cal-gap-24" style={{ marginBottom: 18, alignItems: v11 ? 'flex-start' : undefined }}>
        <Fact label="Stage" value={<Tag tone="outline">{deal.stage}</Tag>} sub={`${deal.daysInStage} days in stage`} />
        <Fact
          label="Amount"
          value={deal.amount === null ? <span className="cal-faint">—</span> : <span className="cal-d20 cal-num">{fmtMoney(deal.amount)}</span>}
          sub={deal.amount === null ? 'Not set in CRM' : undefined}
        />
        <Fact label="Last activity" value={<span className="cal-d20 cal-num">{deal.daysIdle}d</span>} sub={fmtDate(deal.lastActivity)} />
        <Fact
          label="Close date"
          value={<span className="cal-b16">{fmtDate(deal.closeDate)}</span>}
          sub={deal.closeDatePushes ? `pushed ${deal.closeDatePushes}×` : 'not pushed'}
        />
        <Fact
          label={`Latest ${skill.short} score`}
          value={
            latest ? (
              <Tag tone={tierTone(tierFor(latest.osr))}>{latest.osr} {tierFor(latest.osr)}</Tag>
            ) : (
              <span className="cal-faint cal-italic">No scored call</span>
            )
          }
        />
      </div>

      {v11 ? (
        deal.bucket === 'unscored' ? (
          <Alert tone="gray">No scored call on this deal, so it cannot be placed.</Alert>
        ) : null
      ) : (
        <Alert tone={deal.bucket === 'strong-stalled' ? 'blue' : deal.bucket === 'weak-stalled' ? 'gold' : 'gray'}>
          <strong>{meta.label}.</strong> {bucketRead(deal.bucket, skillId)}.{' '}
          {deal.bucket === 'weak-stalled'
            ? `The last ${skill.short} call on this deal scored below ${PROFICIENT_MIN}, and ${fmtMoney(deal.amount)} has not moved in ${deal.daysIdle} days.`
            : deal.bucket === 'strong-stalled'
              ? `The ${skill.short} on this deal scored well and it stalled anyway. Coaching ${skill.short} is unlikely to be what unblocks it.`
              : deal.bucket === 'unscored'
                ? 'No call on this deal has been scored, so it cannot be placed in the split at all.'
                : 'This deal is moving.'}
        </Alert>
      )}

      {/* ----------------------------------------------------------- calls */}
      <div className="cal-mt-20" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.15fr)', gap: 20 }}>
        <section>
          <h4 className="cal-d16" style={{ marginBottom: 12 }}>Scored calls on this deal</h4>
          {deal.calls.length ? (
            <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 10 }}>
              {deal.calls.map((c) => {
                const tier = tierFor(c.osr);
                return (
                  <li key={c.id} className="cal-card" style={{ padding: '12px 14px' }}>
                    <div className="cal-between cal-gap-10">
                      <div className="cal-stack cal-gap-4">
                        <span className="cal-b14" style={{ fontWeight: 600 }}>{c.title}</span>
                        <span className="cal-b12 cal-faint cal-row cal-gap-8">
                          <span className="cal-row cal-gap-4"><IconClock size={12} /> {c.durationMin} min</span>
                          {fmtDate(c.date)}
                        </span>
                      </div>
                      <Tag tone={tierTone(tier)}>{c.osr}</Tag>
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : (
            <div className="cal-card cal-card--dashed" style={{ padding: '14px 16px' }}>
              <p className="cal-b14 cal-muted">
                No calls on this deal have been uploaded or scored. Nothing here is evidence about skill.
              </p>
            </div>
          )}

          <h4 className="cal-d16 cal-mt-20" style={{ marginBottom: 10 }}>Contacts on scored calls</h4>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 7 }}>
            {deal.contacts.map((c) => (
              <li key={c.name} className="cal-row cal-gap-8 cal-b13">
                <IconUsers size={14} style={{ color: 'var(--cal-ink-4)' }} />
                <span>{c.name}</span>
                <span className="cal-faint">{c.title}</span>
              </li>
            ))}
          </ul>

          {signals.length ? (
            <>
              <h4 className="cal-d16 cal-mt-20" style={{ marginBottom: 10 }}>Signals</h4>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
                {signals.map((s) => (
                  <li key={s.text} className="cal-row cal-gap-8 cal-b13" style={{ alignItems: 'flex-start' }}>
                    <IconAlert
                      size={14}
                      style={{
                        flex: 'none',
                        marginTop: 2,
                        color: s.tone === 'red' ? 'var(--cal-red)' : s.tone === 'gold' ? 'var(--cal-gold)' : 'var(--cal-ink-4)',
                      }}
                    />
                    <span className="cal-muted">{s.text}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </section>

        {/* ------------------------------------------------------ breakdown */}
        <section>
          <h4 className="cal-d16" style={{ marginBottom: 12 }}>
            {latest ? `${skill.name} breakdown, latest call` : `${skill.name} breakdown`}
          </h4>

          {latest ? (
            <>
              <div className="cal-stack cal-gap-12">
                {latest.subSkills.map((sk) => (
                  <div key={sk.name} className="cal-stack cal-gap-6">
                    <div className="cal-between cal-b12 cal-gap-8">
                      <span className="cal-row cal-gap-6" style={{ color: 'var(--cal-ink-2)' }}>
                        {sk.name}
                        <Tooltip label={SUB_SKILL_HELP[sk.name]} side="bottom" />
                      </span>
                      <span className="cal-num cal-muted">{sk.score}</span>
                    </div>
                    <SkillMeter score={sk.score} />
                  </div>
                ))}
              </div>

              {v11 ? null : (
                <div className="cal-mt-20">
                  <AiLabel />
                  <p className="cal-b14 cal-muted cal-mt-8" style={{ lineHeight: 1.6 }}>
                    On this call {rep?.name.split(' ')[0]} was strongest on {strengths[0]?.name} at{' '}
                    {strengths[0]?.score}. {growth[0]?.name} scored {growth[0]?.score} and is what pulled
                    the call down: {SUB_SKILL_HELP[growth[0]?.name]?.replace(/\.$/, '').toLowerCase()} did
                    not happen here. On a {fmtMoney(deal.amount)} deal in {deal.stage}, that is the gap to
                    close on the next call.
                  </p>
                </div>
              )}

              <div className="cal-mt-16 cal-card" style={{ padding: '12px 14px' }}>
                <span className="cal-eyebrow">Weakest three on this call</span>
                <ul style={{ margin: '10px 0 0', padding: 0, listStyle: 'none', display: 'grid', gap: 7 }}>
                  {growth.map((g) => (
                    <li key={g.name} className="cal-row cal-gap-8 cal-b13">
                      <IconCheckCircle size={14} style={{ color: 'var(--cal-gold)' }} />
                      <span className="cal-grow">{g.name}</span>
                      <span className="cal-num cal-muted">{g.score}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="cal-card cal-card--dashed" style={{ padding: '16px' }}>
              <p className="cal-b14 cal-muted" style={{ lineHeight: 1.6 }}>
                There is no scored call on this deal, so there is no breakdown. A deal without a call is
                missing evidence. It is not a low score, and it should not be read as one.
              </p>
              <div className="cal-mt-12">
                <Button size="sm" variant="primary"><IconPhone size={13} /> Add a call</Button>
              </div>
            </div>
          )}
        </section>
      </div>

      {!v11 && deal.stalled && deal.latestScore !== null ? (
        <div className="cal-mt-20">
          <Alert tone="gray">
            The call was scored {fmtDate(latest!.date)} and the deal went quiet after it.{' '}
            {STALL_DAYS} days with no activity is the stall threshold here, not a CRM field.
          </Alert>
        </div>
      ) : null}
    </Modal>
  );
}

function Fact({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="cal-stack cal-gap-6">
      <span className="cal-eyebrow">{label}</span>
      <span>{value}</span>
      {sub ? <span className="cal-b10 cal-faint">{sub}</span> : null}
    </div>
  );
}
