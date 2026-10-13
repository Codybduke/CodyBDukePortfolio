import { useCallback, useEffect, useState } from 'react';

import {
  slides,
  type ComparePair,
  type RingSlice,
  type Slide,
  type SlideMetric,
} from '../../data/presentations/move-in-scanner';
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

export default function MoveInDeck({ protoSrc }: Props) {
  const [index, setIndex] = useState(0);
  const [iframeSrc] = useState(() => labSrc(protoSrc, 'online'));

  const slide = slides[index];
  const isSplit = slide.layout === 'split';

  const go = useCallback((next: number) => {
    setIndex(Math.max(0, Math.min(slides.length - 1, next)));
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'PageDown' || event.key === 'j') {
        event.preventDefault();
        go(index + 1);
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp' || event.key === 'k') {
        event.preventDefault();
        go(index - 1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        go(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        go(slides.length - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, index]);

  useEffect(() => {
    const raw = Number(window.location.hash.replace('#', ''));
    if (Number.isInteger(raw) && raw >= 1 && raw <= slides.length) setIndex(raw - 1);
  }, []);

  useEffect(() => {
    const hash = `#${index + 1}`;
    if (window.location.hash !== hash) history.replaceState(null, '', hash);
  }, [index]);

  return (
    <div className={`deck deck--${slide.layout}`}>
      <div className="deck__prototype" aria-hidden={!isSplit}>
        <iframe src={iframeSrc} title="OXP Move-In prototype" />
      </div>

      <div className="deck__content" key={index} aria-live="polite">
        <SlideContent slide={slide} />
      </div>

      <nav className="deck__controls" aria-label="Slide navigation">
        <button type="button" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous slide">
          ‹
        </button>
        <span className="deck__count">
          {index + 1} / {slides.length}
        </span>
        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index === slides.length - 1}
          aria-label="Next slide"
        >
          ›
        </button>
      </nav>
    </div>
  );
}
