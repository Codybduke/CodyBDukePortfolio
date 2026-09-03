/**
 * Data viz for the prototype. The OSR bar, heatmap row and gauge are rebuilt to
 * match the packet screenshots (they are not in the component library). The
 * split bar and sub-skill meter are new, composed from library tokens.
 */
import type { ReactNode } from 'react';
import { IconArrowDown, IconArrowUp } from './icons';
import {
  BUCKET_META,
  BUCKET_ORDER,
  TIERS,
  tierFor,
  type Bucket,
  type Split,
  type Tier,
} from '../../data/caliber/skill-intelligence';

const TIER_WIDTH: Record<Tier, number> = {
  Novice: 20,
  Developing: 20,
  Proficient: 30,
  Strong: 20,
  Expert: 10,
};

const TIER_HEX: Record<Tier, string> = {
  Novice: '#f04645',
  Developing: '#ff9d55',
  Proficient: '#ffce22',
  Strong: '#2ad651',
  Expert: '#6ee512',
};

export function tierHex(osr: number): string {
  return TIER_HEX[tierFor(osr)];
}

/* -------------------------------------------------------------- OSR bar */

/** The full-width tier bar from the dashboard: ramp, knob, tier ticks. */
export function OsrBar({ value }: { value: number }) {
  return (
    <div className="cal-osr">
      <span className="cal-osr__value cal-num" style={{ left: `${value}%` }}>{value}</span>
      <div className="cal-osr__track">
        <div className="cal-osr__dim" />
        <div className="cal-osr__fill" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
          <span className="cal-osr__fill-inner" />
        </div>
        <span className="cal-osr__knob" style={{ left: `${value}%` }} />
      </div>
      <div className="cal-osr__ticks">
        {TIERS.map((t) => (
          <span key={t.tier} className="cal-osr__tick" style={{ width: `${TIER_WIDTH[t.tier]}%` }}>
            {t.tier}: {t.tier === 'Expert' ? '90+' : `${t.min}-${t.max}`}
          </span>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- heatmap */

export function HeatmapHead() {
  return (
    <div className="cal-heat__head">
      {TIERS.map((t) => (
        <span key={t.tier} className="cal-heat__col" style={{ width: `${TIER_WIDTH[t.tier]}%` }}>
          {t.tier}: {t.tier === 'Expert' ? '90+' : `${t.min}-${t.max}`} OSR
        </span>
      ))}
    </div>
  );
}

export function HeatmapRow({
  name,
  value,
  delta,
  variant = 'member',
  showDelta = true,
  onClick,
  empty,
}: {
  name: ReactNode;
  value: number;
  delta?: number;
  variant?: 'team' | 'member';
  showDelta?: boolean;
  onClick?: () => void;
  empty?: boolean;
}) {
  const nameCls = [
    'cal-heat__name',
    variant === 'team' ? 'cal-heat__name--team' : 'cal-heat__name--indent',
  ].join(' ');

  return (
    <div
      className="cal-heat__row"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter') onClick(); } : undefined}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      <span className={nameCls}>{name}</span>
      {empty ? (
        <span className="cal-heat__empty">No data is available.</span>
      ) : (
        <span className="cal-heat__bar">
          <span className="cal-heat__bar-dim" />
          <span className="cal-heat__bar-fill" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
            <span />
          </span>
          <span className="cal-heat__score cal-num">{value} OSR</span>
          {showDelta && delta ? (
            <span
              className={`cal-heat__delta cal-heat__delta--${delta > 0 ? 'up' : 'down'}`}
              style={{ left: `calc(${value}% - 5px)` }}
            >
              {delta > 0 ? <IconArrowUp size={8} /> : <IconArrowDown size={8} />}
              {Math.abs(delta)}
            </span>
          ) : null}
          <span className="cal-heat__grid">
            {TIERS.map((t) => (
              <span key={t.tier} style={{ width: `${TIER_WIDTH[t.tier]}%` }} />
            ))}
          </span>
        </span>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- gauge */

/** Ring gauge from the Skill Report modal: value arc in tier colour, dim track. */
export function Gauge({ value, size = 132, label = 'OSR' }: { value: number; size?: number; label?: string }) {
  const stroke = 11;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const sweep = 0.86; // leave a gap at the bottom-left, as the packet does
  const arc = c * sweep * (value / 100);
  const tier = tierFor(value);

  return (
    <div className="cal-gauge" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <g transform={`rotate(140 ${size / 2} ${size / 2})`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#3a3a3c"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${c * sweep} ${c}`}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={TIER_HEX[tier]}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${arc} ${c}`}
          />
        </g>
      </svg>
      <span className="cal-gauge__text">
        <span className="cal-gauge__val cal-num" style={{ fontSize: size * 0.23 }}>{value}</span>
        <span className="cal-gauge__cap" style={{ display: 'block' }}>{label}</span>
        <span className="cal-gauge__cap" style={{ display: 'block' }}>{tier}</span>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------ split bar */

/** One rep's open book, segmented by discovery score × movement. */
export function SplitBar({
  split,
  total,
  highlight,
  onSegment,
  labelFor,
}: {
  split: Split;
  total: number;
  highlight?: Bucket | null;
  onSegment?: (b: Bucket) => void;
  labelFor?: (b: Bucket) => string;
}) {
  if (!total) return <div className="cal-split" aria-hidden="true" />;
  return (
    <div className="cal-split" role="img" aria-label="Open deals by discovery score and movement">
      {BUCKET_ORDER.map((b) => {
        const n = split[b].count;
        if (!n) return null;
        const meta = BUCKET_META[b];
        const label = labelFor ? labelFor(b) : meta.short;
        return (
          <span
            key={b}
            className="cal-split__seg"
            data-dim={Boolean(highlight) && highlight !== b}
            title={`${n} ${n === 1 ? 'deal' : 'deals'}: ${label}`}
            style={{
              width: `${(n / total) * 100}%`,
              background: meta.color,
              cursor: onSegment ? 'pointer' : undefined,
            }}
            onClick={onSegment ? () => onSegment(b) : undefined}
          />
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------- skill meter */

export function SkillMeter({ score, width }: { score: number; width?: number }) {
  return (
    <span className="cal-meter" style={{ display: 'block', width: width ?? '100%' }}>
      <span className="cal-meter__fill" style={{ width: `${score}%`, background: tierHex(score) }} />
    </span>
  );
}

/* ------------------------------------------------------- sparkline-ish */

/** Six-week OSR trace. Deliberately unlabelled beyond endpoints. */
export function TrendLine({ points, width = 108, height = 30 }: { points: number[]; width?: number; height?: number }) {
  if (points.length < 2) return null;
  const min = Math.min(...points) - 4;
  const max = Math.max(...points) + 4;
  const span = Math.max(1, max - min);
  const d = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p - min) / span) * height;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
  const rising = points[points.length - 1] >= points[0];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" style={{ display: 'block' }}>
      <path d={d} fill="none" stroke={rising ? 'var(--cal-green)' : 'var(--cal-red)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
