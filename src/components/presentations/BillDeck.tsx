import { useCallback, useEffect, useRef, useState } from 'react';

import {
  billSlides,
  type BillImage,
  type BillSlide,
  type GallerySlot,
  type ScreenLayout,
  type SpeakerNote,
  type TimelineStop,
} from '../../data/presentations/bill';
import type { ComparePair, RingSlice, SlideImage, SlideMetric } from '../../data/presentations/move-in-scanner';
import BillOpener from './BillOpener';
import { labSrc } from './proto-driver';

type Props = {
  protoSrc: string;
};

const RING_COLORS = ['#1c1c1a', '#8a8a82', '#d0d0c6'];
const PROTOTYPE_TIMEOUT_MS = 12_000;

function StageImage({ image }: { image: SlideImage }) {
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

function Donut({ slices }: { slices: { value: number; color: string }[] }) {
  const r = 62;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg className="deck-donut" viewBox="0 0 180 180" aria-hidden="true">
      <g transform="rotate(-90 90 90)">
        {slices.map((slice) => {
          const len = (slice.value / 100) * c;
          const node = (
            <circle
              key={`${slice.color}-${offset}`}
              cx={90}
              cy={90}
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
              <img src={pair.before.src} alt={pair.before.alt} />
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

function Screens({ images, layout }: { images: BillImage[]; layout: ScreenLayout }) {
  return (
    <div className={`deck-screens deck-screens--${layout}`}>
      {images.map((image) => (
        <figure key={image.src}>
          <img src={image.src} alt={image.alt} />
          <figcaption>{image.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function GalleryPhoto({ item }: { item: GallerySlot }) {
  const [missing, setMissing] = useState(false);

  return (
    <figure className={`gallery__item${item.wide ? ' gallery__item--wide' : ''}`}>
      {missing ? (
        <div className="gallery__plate">
          <p>Photo needed</p>
        </div>
      ) : (
        <img src={item.src} alt={item.alt} onError={() => setMissing(true)} />
      )}
      <figcaption>
        <span>{item.caption}</span>
        {item.detail}
      </figcaption>
    </figure>
  );
}

function Timeline({ stops }: { stops: TimelineStop[] }) {
  return (
    <ol className="timeline">
      {stops.map((stop) => (
        <li key={`${stop.place}-${stop.role}`}>
          <p className="timeline__when">{stop.when}</p>
          <h2>{stop.place}</h2>
          <p className="timeline__role">{stop.role}</p>
          <p className="timeline__detail">{stop.detail}</p>
        </li>
      ))}
    </ol>
  );
}

function SlideContent({ slide }: { slide: BillSlide }) {
  switch (slide.layout) {
    case 'opener':
      return <BillOpener kicker={slide.stage} title={slide.title ?? ''} lead={slide.lead} />;

    case 'close':
      return <BillOpener polished kicker={slide.stage} title={slide.title ?? ''} lead={slide.lead} />;

    case 'gallery':
      return (
        <div className="slide slide--gallery">
          <div className="slide__inner">
            {slide.stage && <p className="slide__eyebrow">{slide.stage}</p>}
            {slide.title && <h1 className="slide__title slide__title--md">{slide.title}</h1>}
            {slide.body && <p className="slide__body">{slide.body}</p>}
            {slide.gallery && (
              <div className="gallery">
                {slide.gallery.map((item) => (
                  <GalleryPhoto key={item.src} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      );

    case 'timeline':
      return (
        <div className="slide slide--timeline">
          <div className="slide__inner">
            {slide.stage && <p className="slide__eyebrow">{slide.stage}</p>}
            {slide.title && <h1 className="slide__title slide__title--md">{slide.title}</h1>}
            {slide.body && <p className="slide__body">{slide.body}</p>}
            {slide.timeline && <Timeline stops={slide.timeline} />}
          </div>
        </div>
      );

    case 'feature':
      return (
        <div className="slide slide--feature">
          <div className="slide__copy">
            {slide.stage && <p className="slide__eyebrow">{slide.stage}</p>}
            {slide.title && <h1 className="slide__title slide__title--sm">{slide.title}</h1>}
            {slide.body && <p className="slide__body">{slide.body}</p>}
            {slide.caption && <p className="feature__caption">{slide.caption}</p>}
          </div>
          {slide.image && (
            <figure className="feature__figure" data-fit={slide.image.fit ?? 'cover'}>
              <img src={slide.image.src} alt={slide.image.alt} />
            </figure>
          )}
        </div>
      );

    case 'title':
      return (
        <div className="slide slide--title slide--bleed">
          {slide.image && <StageImage image={slide.image} />}
          {slide.image && <div className="slide__scrim" />}
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
            {slide.stage && <p className="slide__eyebrow slide__eyebrow--light">{slide.stage}</p>}
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
            {slide.bullets && <Bullets bullets={slide.bullets} />}
          </div>
        </div>
      );

    case 'bio':
      return (
        <div className="slide slide--bio slide--prose">
          <div className="slide__inner">
            {slide.image && <img className="deck-portrait" src={slide.image.src} alt={slide.image.alt} />}
            <div>
              {slide.stage && <p className="slide__eyebrow">{slide.stage}</p>}
              {slide.title && <h1 className="slide__title slide__title--md">{slide.title}</h1>}
              {slide.body && <p className="slide__lead">{slide.body}</p>}
              {slide.bullets && <Bullets bullets={slide.bullets} />}
            </div>
          </div>
        </div>
      );

    case 'screens':
      return (
        <div className="slide slide--screens">
          <div className="slide__inner">
            {slide.stage && <p className="slide__eyebrow">{slide.stage}</p>}
            {slide.title && <h1 className="slide__title">{slide.title}</h1>}
            {slide.body && <p className="slide__body">{slide.body}</p>}
            {slide.images && <Screens images={slide.images} layout={slide.screenLayout ?? 'single'} />}
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

function Notes({ notes, index, total }: { notes: SpeakerNote; index: number; total: number }) {
  return (
    <aside className="deck__notes" aria-label="Speaker notes">
      <p className="deck__notes-point">{notes.point}</p>
      <p className="deck__notes-next">Next: {notes.next}</p>
      {notes.evidence && <p className="deck__notes-meta">{notes.evidence}</p>}
      {notes.qualification && <p className="deck__notes-meta">Careful: {notes.qualification}</p>}
      <p className="deck__notes-meta">
        About {notes.time} · slide {index + 1} of {total}
      </p>
    </aside>
  );
}

function formatElapsed(ms: number) {
  const total = Math.floor(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function hashIndex(hash: string): number {
  const n = Number(hash.replace('#', ''));
  return Number.isInteger(n) && n >= 1 && n <= billSlides.length ? n - 1 : 0;
}

type ProtoStatus = 'loading' | 'ready' | 'failed';

export default function BillDeck({ protoSrc }: Props) {
  const [index, setIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [protoStatus, setProtoStatus] = useState<ProtoStatus>('loading');
  const [iframeSrc] = useState(() => labSrc(protoSrc, 'online'));
  const frameRef = useRef<HTMLIFrameElement>(null);
  const indexRef = useRef(0);
  const lastNav = useRef(0);
  const skipHashWrite = useRef(true);
  const onKeyRef = useRef<(event: KeyboardEvent) => void>(() => {});

  const slide = billSlides[index] ?? billSlides[0];
  const isSplit = slide.layout === 'split';

  const go = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(billSlides.length - 1, next));
    if (clamped > indexRef.current) setStartedAt((value) => value ?? Date.now());
    indexRef.current = clamped;
    setIndex(clamped);
  }, []);

  onKeyRef.current = (event: KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
    const target = event.target as HTMLElement | null;
    const tag = target?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;

    const stamp = performance.now();
    if (stamp - lastNav.current < 40) return;

    const key = event.key.toLowerCase();
    if (key === 'n' || key === 't') {
      lastNav.current = stamp;
      event.preventDefault();
      if (key === 'n') setShowNotes((value) => !value);
      else setShowTimer((value) => !value);
      return;
    }

    const forward = event.key === 'ArrowRight' || event.key === ' ' || event.key === 'PageDown';
    const back = event.key === 'ArrowLeft' || event.key === 'PageUp';
    const home = event.key === 'Home';
    const end = event.key === 'End';
    if (!forward && !back && !home && !end) return;

    lastNav.current = stamp;
    event.preventDefault();
    if (forward) go(indexRef.current + 1);
    else if (back) go(indexRef.current - 1);
    else if (home) go(0);
    else go(billSlides.length - 1);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => onKeyRef.current(event);
    const attach = (target: Window | null | undefined) => target?.addEventListener('keydown', onKey, true);
    const detach = (target: Window | null | undefined) => target?.removeEventListener('keydown', onKey, true);

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
    bindFrame();

    return () => {
      detach(window);
      iframe?.removeEventListener('load', bindFrame);
      try {
        detach(iframe?.contentWindow);
      } catch {
        // Prototype window is already gone.
      }
    };
  }, []);

  useEffect(() => {
    const next = hashIndex(window.location.hash);
    indexRef.current = next;
    setIndex(next);
    const hash = `#${next + 1}`;
    if (window.location.hash !== hash) history.replaceState(null, '', hash);

    const onHash = () => {
      const target = hashIndex(window.location.hash);
      indexRef.current = target;
      setIndex(target);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    if (skipHashWrite.current) {
      skipHashWrite.current = false;
      return;
    }
    const hash = `#${index + 1}`;
    if (window.location.hash !== hash) history.replaceState(null, '', hash);
  }, [index]);

  useEffect(() => {
    let settled = false;
    const iframe = frameRef.current;
    const loaded = () => {
      try {
        const doc = iframe?.contentDocument;
        return Boolean(doc && doc.readyState === 'complete' && doc.location.href !== 'about:blank');
      } catch {
        return false;
      }
    };
    if (loaded()) {
      settled = true;
      setProtoStatus((status) => (status === 'failed' ? status : 'ready'));
    }
    const timer = window.setTimeout(() => {
      if (settled) return;
      setProtoStatus((status) => (status === 'failed' ? status : loaded() ? 'ready' : 'failed'));
    }, PROTOTYPE_TIMEOUT_MS);

    fetch(iframeSrc, { method: 'GET', cache: 'no-store' })
      .then((response) => {
        if (!response.ok) {
          settled = true;
          setProtoStatus('failed');
        }
      })
      .catch(() => {
        settled = true;
        setProtoStatus('failed');
      });

    const onLoad = () => {
      settled = true;
      setProtoStatus((status) => (status === 'failed' ? status : 'ready'));
    };
    iframe?.addEventListener('load', onLoad);
    return () => {
      window.clearTimeout(timer);
      iframe?.removeEventListener('load', onLoad);
    };
  }, [iframeSrc]);

  useEffect(() => {
    if (!showTimer || startedAt === null) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [showTimer, startedAt]);

  const elapsed = startedAt === null ? 0 : Math.max(0, now - startedAt);

  return (
    <div className={`deck deck--${slide.layout}`}>
      <div className="deck__prototype" aria-hidden={!isSplit}>
        <iframe ref={frameRef} src={iframeSrc} title="OXP Move-In prototype" />
        {protoStatus === 'failed' && slide.fallback && (
          <div className="deck__fallback">
            <img src={slide.fallback.src} alt={slide.fallback.alt} />
            <a href={iframeSrc} target="_blank" rel="noopener noreferrer">
              Open the prototype in a new tab
            </a>
          </div>
        )}
      </div>

      <div className="deck__content" key={index} aria-live="polite">
        <SlideContent slide={slide} />
      </div>

      {showNotes && <Notes notes={slide.notes} index={index} total={billSlides.length} />}

      <nav className="deck__controls" aria-label="Slide navigation">
        <button type="button" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous slide">
          ‹
        </button>
        <span className="deck__count" aria-label={`Slide ${index + 1} of ${billSlides.length}`}>
          {showTimer && (
            <span className="deck__timer" title="Elapsed since the first slide change. Press T to hide.">
              {formatElapsed(elapsed)}
              {' · '}
            </span>
          )}
          {index + 1} / {billSlides.length}
        </span>
        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index === billSlides.length - 1}
          aria-label="Next slide"
        >
          ›
        </button>
      </nav>
    </div>
  );
}
