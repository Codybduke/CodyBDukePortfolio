import { useCallback, useEffect, useRef, useState } from 'react';

import {
  slides,
  slidesB,
  type ComparePair,
  type RingSlice,
  type Slide,
  type SlideMetric,
} from '../../data/presentations/move-in-scanner';
import DeckStoneTitle from './DeckStoneTitle';
import { labSrc } from './proto-driver';

type Props = {
  protoSrc: string;
};

const RING_COLORS = ['#1c1c1a', '#8a8a82', '#d0d0c6'];

function StageImage({ image }: { image: NonNullable<Slide['image']> }) {
  return <img className="deck-img" src={image.src} alt={image.alt} data-fit={image.fit ?? 'cover'} />;
}

function Metrics({ metrics }: { metrics: SlideMetric[] }) {
  return (
    <div className="deck-metrics">
      {metrics.map((metric) => (
        <div key={metric.label} className="deck-metric">
          <p className="deck-metric__value">{metric.value}</p>
          <p className="deck-metric__label">{metric.label}</p>
        </div>
      ))}
    </div>
  );
}

function Bullets({ bullets }: { bullets: string[] }) {
  return (
    <ul className="deck-bullets">
      {bullets.map((bullet) => (
        <li key={bullet}>{bullet}</li>
      ))}
    </ul>
  );
}

function Donut({ slices, track = false }: { slices: { value: number; color: string }[]; track?: boolean }) {
  const r = 62;
  const c = 2 * Math.PI * r;
  const cx = 90;
  const cy = 90;
  let offset = 0;

  return (
    <svg className="deck-donut" viewBox="0 0 180 180" aria-hidden="true">
      {track && <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e4e4d8" strokeWidth="16" />}
      <g transform={`rotate(-90 ${cx} ${cy})`}>
        {slices.map((slice) => {
          const len = (slice.value / 100) * c;
          const node = (
            <circle
              key={`${slice.color}-${offset}`}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={slice.color}
              strokeWidth="16"
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
            />
          );
          offset += len;
          return node;
        })}
      </g>
    </svg>
  );
}

function RingKey({ rings }: { rings: RingSlice[] }) {
  return (
    <ul className="deck-ring__key">
      {rings.map((ring, index) => (
        <li key={ring.label}>
          <span className="deck-ring__swatch" style={{ background: RING_COLORS[index] }} />
          <div>
            <p className="deck-ring__value">{ring.display}</p>
            <p className="deck-ring__label">{ring.label}</p>
            <p className="deck-ring__hint">{ring.hint}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Pairs({ pairs }: { pairs: ComparePair[] }) {
  return (
    <div className="deck-pairs">
      {pairs.map((pair) => (
        <figure key={pair.label} className="deck-pair">
          <div className="deck-pair__shots">
            <div>
              <img src={pair.before.src} alt={pair.before.alt} data-wide={pair.before.wide ? '' : undefined} />
              <p>Before</p>
            </div>
            <div>
              <img src={pair.after.src} alt={pair.after.alt} />
              <p>After</p>
            </div>
          </div>
        </figure>
      ))}
    </div>
  );
}

function SlideContent({ slide }: { slide: Slide }) {
  switch (slide.layout) {
    case 'stone':
      return <DeckStoneTitle title={slide.title ?? 'Real Time\nMove-ins'} />;

    case 'title':
      return (
        <div className="slide slide--title slide--bleed">
          {slide.image && <StageImage image={slide.image} />}
          <div className="slide__scrim" />
          <div className="slide__inner">
            {slide.stage && <p className="slide__eyebrow slide__eyebrow--light">{slide.stage}</p>}
            <h1 className="slide__title">{slide.title}</h1>
            {slide.lead && <p className="slide__lead">{slide.lead}</p>}
          </div>
        </div>
      );

    case 'chapter':
      return (
        <div className={`slide slide--chapter${slide.image ? ' slide--bleed' : ''}`}>
          {slide.image && <StageImage image={slide.image} />}
          {slide.image && <div className="slide__scrim" />}
          <div className="slide__inner">
            {slide.stage && (
              <p className={`slide__eyebrow${slide.image ? ' slide__eyebrow--light' : ''}`}>{slide.stage}</p>
            )}
            <h1 className="slide__chapter-title">{slide.title}</h1>
            {slide.lead && <p className="slide__lead">{slide.lead}</p>}
            {slide.bullets && <Bullets bullets={slide.bullets} />}
          </div>
        </div>
      );

    case 'statement':
      return (
        <div className="slide slide--statement slide--bleed">
          {slide.image && <StageImage image={slide.image} />}
          {slide.image && <div className="slide__scrim slide__scrim--bottom" />}
          <div className="slide__inner slide__inner--bottom">
            {slide.stage && <p className="slide__eyebrow slide__eyebrow--light">{slide.stage}</p>}
            {slide.lead && <p className="slide__statement">{slide.lead}</p>}
            {slide.body && <p className="slide__meaning">{slide.body}</p>}
          </div>
        </div>
      );

    case 'rings':
      return (
        <div className="slide slide--metrics">
          <div className="slide__inner">
            {slide.stage && <p className="slide__eyebrow">{slide.stage}</p>}
            {slide.title && <h1 className="slide__title slide__title--md">{slide.title}</h1>}
            {slide.body && <p className="slide__body">{slide.body}</p>}
            {slide.rings && (
              <div className="deck-ring">
                <Donut slices={slide.rings.map((ring, index) => ({ value: ring.value, color: RING_COLORS[index] }))} />
                <RingKey rings={slide.rings} />
              </div>
            )}
          </div>
        </div>
      );

    case 'metrics':
      return (
        <div className="slide slide--metrics">
          <div className="slide__inner">
            {slide.stage && <p className="slide__eyebrow">{slide.stage}</p>}
            {slide.title && <h1 className="slide__title slide__title--md">{slide.title}</h1>}
            {slide.body && <p className="slide__body">{slide.body}</p>}
            {slide.metrics && <Metrics metrics={slide.metrics} />}
          </div>
        </div>
      );

    case 'compare':
      return (
        <div className="slide slide--compare">
          <div className="slide__inner">
            {slide.stage && <p className="slide__eyebrow">{slide.stage}</p>}
            {slide.title && <h1 className="slide__title slide__title--md">{slide.title}</h1>}
            {slide.body && <p className="slide__body">{slide.body}</p>}
            {slide.bullets && <Bullets bullets={slide.bullets} />}
            {slide.pairs && <Pairs pairs={slide.pairs} />}
          </div>
        </div>
      );

    case 'prose':
      return (
        <div className="slide slide--prose">
          <div className="slide__inner">
            {slide.stage && <p className="slide__eyebrow">{slide.stage}</p>}
            {slide.title && <h1 className="slide__title slide__title--md">{slide.title}</h1>}
            {slide.body && <p className="slide__body">{slide.body}</p>}
            {slide.bullets && <Bullets bullets={slide.bullets} />}
          </div>
        </div>
      );

    case 'feature':
      return (
        <div className="slide slide--feature">
          <div className="slide__feature-media">{slide.image && <StageImage image={slide.image} />}</div>
          <div className="slide__feature-copy">
            {slide.stage && <p className="slide__eyebrow">{slide.stage}</p>}
            {slide.title && <h1 className="slide__title slide__title--sm">{slide.title}</h1>}
            {slide.body && <p className="slide__body">{slide.body}</p>}
            {slide.bullets && <Bullets bullets={slide.bullets} />}
          </div>
        </div>
      );

    case 'split':
    default:
      return (
        <div className="slide slide--split">
          <div className="deck__copy">
            {slide.stage && <p className="slide__eyebrow">{slide.stage}</p>}
            {slide.title && <h1 className="slide__title slide__title--sm">{slide.title}</h1>}
            {slide.body && <p className="slide__body">{slide.body}</p>}
            {slide.metrics && <Metrics metrics={slide.metrics} />}
            {slide.bullets && <Bullets bullets={slide.bullets} />}
          </div>
        </div>
      );
  }
}

type DeckVersion = 'full' | 'short';

const DECKS: Record<DeckVersion, Slide[]> = { full: slides, short: slidesB };
const DOUBLE_TAP_MS = 700;

function deckHash(version: DeckVersion, index: number) {
  return version === 'short' ? `#b${index + 1}` : `#${index + 1}`;
}

function eraseStrayLetter(event: KeyboardEvent, letter: string) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement | null;
  if (!target || (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA')) return;
  const value = target.value ?? '';
  if (!value.toLowerCase().endsWith(letter)) return;
  const view = target.ownerDocument?.defaultView;
  const ctor = target.tagName === 'TEXTAREA' ? view?.HTMLTextAreaElement : view?.HTMLInputElement;
  const proto = ctor ? Object.getOwnPropertyDescriptor(ctor.prototype, 'value') : undefined;
  const next = value.slice(0, -1);
  if (proto?.set) proto.set.call(target, next);
  else target.value = next;
  target.dispatchEvent(new Event('input', { bubbles: true }));
}

export default function MoveInDeck({ protoSrc }: Props) {
  const [version, setVersion] = useState<DeckVersion>('full');
  const [index, setIndex] = useState(0);
  const [iframeSrc] = useState(() => labSrc(protoSrc, 'online'));
  const frameRef = useRef<HTMLIFrameElement>(null);
  const versionRef = useRef<DeckVersion>('full');
  const indexRef = useRef(0);
  const memory = useRef<Record<DeckVersion, number>>({ full: 0, short: 0 });
  const lastTap = useRef({ key: '', at: 0 });
  const lastDown = useRef(0);
  const lastStamp = useRef(-1);
  const lastNav = useRef(0);
  const skipHashWrite = useRef(true);
  const onKeyRef = useRef<(event: KeyboardEvent) => void>(() => {});

  const deck = DECKS[version];
  const slide = deck[index] ?? deck[0];
  const isSplit = slide.layout === 'split';

  const go = useCallback((next: number) => {
    const length = DECKS[versionRef.current].length;
    const clamped = Math.max(0, Math.min(length - 1, next));
    memory.current[versionRef.current] = clamped;
    indexRef.current = clamped;
    setIndex(clamped);
  }, []);

  const setDeck = useCallback((next: DeckVersion, at?: number) => {
    const current = versionRef.current;
    memory.current[current] = indexRef.current;
    const restored =
      at === undefined ? memory.current[next] : at;
    const clamped = Math.max(0, Math.min(DECKS[next].length - 1, restored));
    versionRef.current = next;
    indexRef.current = clamped;
    memory.current[next] = clamped;
    setVersion(next);
    setIndex(clamped);
  }, []);

  onKeyRef.current = (event: KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
    if (event.timeStamp === lastStamp.current) return;

    const deckLetter =
      event.code === 'KeyA' || event.key === 'a' || event.key === 'A'
        ? 'a'
        : event.code === 'KeyB' || event.key === 'b' || event.key === 'B'
          ? 'b'
          : '';

    if (deckLetter) {
      // A keyup follows its keydown. Count that pair once. If the system only
      // delivers the keyup, still count it.
      if (event.type === 'keydown') lastDown.current = performance.now();
      else if (performance.now() - lastDown.current < 500) return;

      lastStamp.current = event.timeStamp;
      const now = performance.now();
      // The same press can be delivered twice when focus sits in the prototype.
      // A real second tap is slower than that.
      if (lastTap.current.key === deckLetter && now - lastTap.current.at <= 30) return;
      if (lastTap.current.key === deckLetter && now - lastTap.current.at <= DOUBLE_TAP_MS) {
        event.preventDefault();
        event.stopPropagation();
        lastTap.current = { key: '', at: 0 };
        eraseStrayLetter(event, deckLetter);
        if (deckLetter === 'a') setDeck('full', 0);
        else setDeck('short');
      } else {
        lastTap.current = { key: deckLetter, at: now };
      }
      return;
    }

    if (event.type !== 'keydown') return;

    const tag = (event.target as HTMLElement | null)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    const forward = event.key === 'ArrowRight' || event.key === ' ' || event.key === 'PageDown' || event.key === 'j';
    const back = event.key === 'ArrowLeft' || event.key === 'PageUp' || event.key === 'k';
    const home = event.key === 'Home';
    const end = event.key === 'End';
    if (!forward && !back && !home && !end) return;

    const now = performance.now();
    if (now - lastNav.current < 40) return;
    lastNav.current = now;

    event.preventDefault();
    if (forward) go(indexRef.current + 1);
    else if (back) go(indexRef.current - 1);
    else if (home) go(0);
    else go(DECKS[versionRef.current].length - 1);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => onKeyRef.current(event);
    const attach = (target: Window | null | undefined) => {
      target?.addEventListener('keydown', onKey, true);
      target?.addEventListener('keyup', onKey, true);
    };
    const detach = (target: Window | null | undefined) => {
      target?.removeEventListener('keydown', onKey, true);
      target?.removeEventListener('keyup', onKey, true);
    };

    attach(window);

    const iframe = frameRef.current;
    const bindFrame = () => {
      try {
        detach(iframe?.contentWindow);
        attach(iframe?.contentWindow);
      } catch {
        // Prototype window is not reachable until it loads.
      }
    };
    iframe?.addEventListener('load', bindFrame);
    window.addEventListener('blur', bindFrame);
    bindFrame();

    return () => {
      detach(window);
      window.removeEventListener('blur', bindFrame);
      iframe?.removeEventListener('load', bindFrame);
      try {
        detach(iframe?.contentWindow);
      } catch {
        // Prototype window is already gone.
      }
    };
  }, []);

  useEffect(() => {
    let nextVersion: DeckVersion = 'full';
    let nextIndex = 0;
    const short = /^#b(\d+)$/.exec(window.location.hash);
    if (short) {
      const n = Number(short[1]);
      if (n >= 1 && n <= slidesB.length) {
        nextVersion = 'short';
        nextIndex = n - 1;
      }
    } else {
      const n = Number(window.location.hash.replace('#', ''));
      if (Number.isInteger(n) && n >= 1 && n <= slides.length) nextIndex = n - 1;
    }
    versionRef.current = nextVersion;
    indexRef.current = nextIndex;
    memory.current[nextVersion] = nextIndex;
    setVersion(nextVersion);
    setIndex(nextIndex);
    const hash = deckHash(nextVersion, nextIndex);
    if (window.location.hash !== hash) history.replaceState(null, '', hash);
  }, []);

  useEffect(() => {
    if (skipHashWrite.current) {
      skipHashWrite.current = false;
      return;
    }
    const hash = deckHash(version, index);
    if (window.location.hash !== hash) history.replaceState(null, '', hash);
  }, [index, version]);

  return (
    <div className={`deck deck--${slide.layout}`} data-deck={version}>
      <div className="deck__prototype" aria-hidden={!isSplit}>
        <iframe ref={frameRef} src={iframeSrc} title="OXP Move-In prototype" />
      </div>

      <div className="deck__content" key={`${version}-${index}`} aria-live="polite">
        <SlideContent slide={slide} />
      </div>

      <nav className="deck__controls" aria-label="Slide navigation">
        <button type="button" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous slide">
          ‹
        </button>
        <span
          className="deck__count"
          aria-label={
            version === 'short'
              ? `30-minute version, slide ${index + 1} of ${deck.length}`
              : `Full version, slide ${index + 1} of ${deck.length}`
          }
        >
          <span
            className="deck__version"
            title={
              version === 'short'
                ? '30-minute version. Double-tap A for the full deck, first slide.'
                : 'Full deck. Double-tap B for the 30-minute version.'
            }
          >
            {version === 'short' ? 'B' : 'A'}
          </span>
          {index + 1} / {deck.length}
        </span>
        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index === deck.length - 1}
          aria-label="Next slide"
        >
          ›
        </button>
      </nav>
    </div>
  );
}
