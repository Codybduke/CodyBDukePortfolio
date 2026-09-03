import { useCallback, useEffect, useState } from 'react';
import { AppChrome } from './AppChrome';
import { TeamView, type TeamTab } from './TeamView';
import { PersonView } from './PersonView';
import { DealModal } from './DealModal';
import { FocusModal } from './FocusModal';
import type { Focus, ProtoVersion } from './types';
import {
  DEFAULT_SKILL,
  SKILL_IDS,
  dealById,
  weakestSkillFor,
  type Bucket,
  type SkillId,
} from '../../data/caliber/skill-intelligence';

/** Walkthrough stops. Each one exists to show a different honest state. */
const STOPS: { id: string; label: string; hash: string }[] = [
  { id: 'team', label: 'Team', hash: '' },
  { id: 'tara', label: 'Tara — skill', hash: 'tara' },
  { id: 'priya', label: 'Priya — fit', hash: 'priya' },
  { id: 'nate', label: 'Nate — fairness', hash: 'nate' },
  { id: 'simone', label: 'Simone — thin', hash: 'simone' },
  { id: 'devon', label: 'Devon — no data', hash: 'devon' },
];

type View = { kind: 'team' } | { kind: 'person'; repId: string };

function isSkill(v: string | undefined): v is SkillId {
  return Boolean(v) && SKILL_IDS.includes(v as SkillId);
}

function parseVersion(): ProtoVersion {
  if (typeof window === 'undefined') return '1';
  return new URLSearchParams(window.location.search).get('v') === '1.1' ? '1.1' : '1';
}

function writeVersion(v: ProtoVersion) {
  const url = new URL(window.location.href);
  if (v === '1.1') url.searchParams.set('v', '1.1');
  else url.searchParams.delete('v');
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}

/** `#tara/closing/weak-stalled` — rep, skill, pile. All parts optional. */
function parseHash(): { view: View; skill: SkillId | null; bucket: Bucket | null } {
  if (typeof window === 'undefined') return { view: { kind: 'team' }, skill: null, bucket: null };
  const raw = window.location.hash.replace(/^#/, '');
  if (!raw) return { view: { kind: 'team' }, skill: null, bucket: null };
  const [repId, skill, bucket] = raw.split('/');
  if (!repId || repId === 'team') return { view: { kind: 'team' }, skill: null, bucket: null };
  return {
    view: { kind: 'person', repId },
    skill: isSkill(skill) ? skill : null,
    bucket: (bucket as Bucket) ?? null,
  };
}

export default function SkillOnDeals() {
  const [view, setView] = useState<View>({ kind: 'team' });
  const [tab, setTab] = useState<TeamTab>('deals');
  const [compare, setCompare] = useState(true);
  const [skill, setSkill] = useState<SkillId>(DEFAULT_SKILL);
  const [bucket, setBucket] = useState<Bucket | null>(null);
  const [openDealId, setOpenDealId] = useState<string | null>(null);
  const [version, setVersion] = useState<ProtoVersion>(parseVersion);
  const [focusRepId, setFocusRepId] = useState<string | null>(null);
  const [focusPreselect, setFocusPreselect] = useState<string | null>(null);
  const [focuses, setFocuses] = useState<Record<ProtoVersion, Record<string, Focus>>>({
    '1': {},
    '1.1': {},
  });
  const activeFocuses = focuses[version];

  const setVer = (v: ProtoVersion) => {
    setVersion(v);
    writeVersion(v);
  };

  // Deep links so a walkthrough can jump straight to a state.
  useEffect(() => {
    const sync = () => {
      const { view: v, skill: s, bucket: b } = parseHash();
      setView(v);
      setBucket(b);
      setSkill(s ?? (v.kind === 'person' ? weakestSkillFor(v.repId) : DEFAULT_SKILL));
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const go = useCallback((repId: string | null, b: Bucket | null = null) => {
    // A person page opens on the skill they score lowest on, which is where
    // Ellis would start if he had to pick one hour.
    const s = repId ? weakestSkillFor(repId) : DEFAULT_SKILL;
    const hash = repId ? `#${repId}/${s}${b ? `/${b}` : ''}` : '#team';
    if (window.location.hash !== hash) window.location.hash = hash;
    setView(repId ? { kind: 'person', repId } : { kind: 'team' });
    setSkill(s);
    setBucket(b);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const writeHash = useCallback((repId: string, s: SkillId, b: Bucket | null) => {
    const url = new URL(window.location.href);
    url.hash = `#${repId}/${s}${b ? `/${b}` : ''}`;
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  }, []);

  const setBucketAndHash = useCallback(
    (b: Bucket | null) => {
      if (view.kind !== 'person') return;
      setBucket(b);
      writeHash(view.repId, skill, b);
    },
    [view, skill, writeHash],
  );

  const setSkillAndHash = useCallback(
    (s: SkillId) => {
      setSkill(s);
      // The four piles are re-cut per skill, so a pile filter does not carry.
      setBucket(null);
      if (view.kind === 'person') writeHash(view.repId, s, null);
    },
    [view, writeHash],
  );

  const deal = openDealId ? dealById(openDealId, skill) : null;
  const activeStop = view.kind === 'team' ? 'team' : view.repId;

  return (
    <div className={`cal${version === '1.1' ? ' cal--v11' : ''}`}>
      <AppChrome />

      <main className="cal-shell cal-page">
        {view.kind === 'team' ? (
          <TeamView
            tab={tab}
            onTab={setTab}
            compare={compare}
            onCompare={setCompare}
            onOpenRep={(repId, b) => go(repId, b ?? null)}
            version={version}
          />
        ) : (
          <PersonView
            repId={view.repId}
            skillId={skill}
            onSkill={setSkillAndHash}
            bucket={bucket}
            onBucket={setBucketAndHash}
            onBack={() => go(null)}
            onOpenDeal={setOpenDealId}
            onSetFocus={() => {
              setFocusPreselect(null);
              setFocusRepId(view.repId);
            }}
            focus={activeFocuses[view.repId]}
            onClearFocus={() =>
              setFocuses((f) => {
                const next = { ...f[version] };
                delete next[view.repId];
                return { ...f, [version]: next };
              })
            }
            version={version}
          />
        )}
      </main>

      {deal ? (
        <DealModal
          deal={deal}
          skillId={skill}
          onClose={() => setOpenDealId(null)}
          onSetFocus={() => {
            setFocusPreselect(deal.id);
            setFocusRepId(deal.repId);
            setOpenDealId(null);
          }}
          version={version}
          hasFocus={Boolean(activeFocuses[deal.repId])}
        />
      ) : null}

      {focusRepId ? (
        <FocusModal
          repId={focusRepId}
          skillId={skill}
          existing={activeFocuses[focusRepId]}
          preselectDealId={focusPreselect}
          onClose={() => setFocusRepId(null)}
          onSave={(f) => {
            setFocuses((prev) => ({ ...prev, [version]: { ...prev[version], [f.repId]: f } }));
            setFocusRepId(null);
          }}
          version={version}
        />
      ) : null}

      {/* Prototype affordance, not part of the product UI. */}
      <nav className="cal-presenter" aria-label="Prototype states">
        <span className="cal-eyebrow" style={{ letterSpacing: '0.08em' }}>Version</span>
        <button type="button" className="cal-picker__opt" aria-pressed={version === '1'} onClick={() => setVer('1')}>
          1.0
        </button>
        <button type="button" className="cal-picker__opt" aria-pressed={version === '1.1'} onClick={() => setVer('1.1')}>
          1.1
        </button>
        <span className="cal-presenter__rule" aria-hidden="true" />
        <span className="cal-eyebrow" style={{ letterSpacing: '0.08em' }}>States</span>
        {STOPS.map((s) => (
          <button
            key={s.id}
            type="button"
            className="cal-picker__opt"
            aria-pressed={activeStop === s.id}
            onClick={() => go(s.id === 'team' ? null : s.id)}
          >
            {s.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
