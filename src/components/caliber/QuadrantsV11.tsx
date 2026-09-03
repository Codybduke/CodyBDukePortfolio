import { Amount } from './ui';
import { v11BucketRead } from './v11';
import {
  STALL_DAYS,
  fmtMoney,
  type Bucket,
  type RepSummary,
  type SkillId,
} from '../../data/caliber/skill-intelligence';

const CELLS: { bucket: Bucket; corner: 'tl' | 'tr' | 'bl' | 'br' }[] = [
  { bucket: 'strong-stalled', corner: 'tl' },
  { bucket: 'strong-moving', corner: 'tr' },
  { bucket: 'weak-stalled', corner: 'bl' },
  { bucket: 'weak-moving', corner: 'br' },
];

const COLORS: Record<Exclude<Bucket, 'unscored'>, string> = {
  'strong-stalled': 'var(--cal-bucket-strong-stalled)',
  'strong-moving': 'var(--cal-bucket-strong-moving)',
  'weak-stalled': 'var(--cal-bucket-weak-stalled)',
  'weak-moving': 'var(--cal-bucket-weak-moving)',
};

/**
 * Cody's 1.1 quadrant: one open grid (no top/right stroke), pill color bars,
 * only the bottom-left corner rounded. Version 1 keeps the four cards.
 */
export function QuadrantsV11({
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
  const cell = (bucket: Exclude<Bucket, 'unscored'>, corner: 'tl' | 'tr' | 'bl' | 'br') => {
    const data = summary.split[bucket];
    const read = data.count ? v11BucketRead(bucket, skillId) : '';
    return (
      <button
        type="button"
        className={`cal-quad cal-quad--${corner}`}
        aria-pressed={active === bucket}
        disabled={!data.count}
        style={{ ['--quad-accent' as string]: COLORS[bucket] }}
        onClick={() => onPick(bucket)}
      >
        <span className="cal-quad__rail" aria-hidden="true" />
        <span className="cal-quad__body">
          <span className="cal-quad__figure">
            <span className="cal-quad__count cal-num">{data.count}</span>
            {data.amount ? <Amount>{fmtMoney(data.amount)}</Amount> : null}
            <span className="cal-quad__unit">{data.count === 1 ? 'deal' : 'deals'}</span>
          </span>
          {read ? <span className="cal-quad__read">{read}</span> : null}
        </span>
      </button>
    );
  };

  return (
    <div className="cal-quads cal-quads--v11">
      <div className="cal-quads__axis">
        <span className="cal-quads__corner" />
        <span className="cal-quads__rowhead">
          Proficient or better
          <span className="cal-b10 cal-faint">Strong call</span>
        </span>
        <span className="cal-quads__rowhead">
          Below proficient
          <span className="cal-b10 cal-faint">Weak call</span>
        </span>
      </div>
      <div className="cal-quads__plot">
        <div className="cal-quads__colheads">
          <span className="cal-quads__colhead">Stalled {STALL_DAYS}+ days</span>
          <span className="cal-quads__colhead">Progressed recently</span>
        </div>
        <div className="cal-quads__board">
          {cell(CELLS[0].bucket, CELLS[0].corner)}
          {cell(CELLS[1].bucket, CELLS[1].corner)}
          {cell(CELLS[2].bucket, CELLS[2].corner)}
          {cell(CELLS[3].bucket, CELLS[3].corner)}
        </div>
      </div>
    </div>
  );
}
