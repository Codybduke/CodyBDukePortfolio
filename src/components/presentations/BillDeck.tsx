import { Fragment, useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';

import {
  billSlides,
  type BillImage,
  type BillSlide,
  type ChapterIcon,
  type MotifIcon,
  type GallerySlot,
  type MetricGroup,
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

/** Lucide outlines (ISC), inlined so the deck does not need the package. */
const CHAPTER_PATHS: Record<ChapterIcon, ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.34-4.34" />
    </>
  ),
  'git-branch': (
    <>
      <line x1="6" x2="6" y1="3" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </>
  ),
  smartphone: (
    <>
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  'list-tree': (
    <>
      <path d="M21 12h-8" />
      <path d="M21 6H8" />
      <path d="M21 18h-8" />
      <path d="M3 6v4c0 1.1.9 2 2 2h3" />
      <path d="M3 10v6c0 1.1.9 2 2 2h3" />
    </>
  ),
  'pencil-ruler': (
    <>
      <path d="M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13" />
      <path d="m8 6 2-2" />
      <path d="m18 16 2-2" />
      <path d="m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17" />
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
      <path d="m15 5 4 4" />
    </>
  ),
  layers: (
    <>
      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
      <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
      <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
    </>
  ),
  'chart-no-axes-column': (
    <>
      <path d="M5 21v-6" />
      <path d="M12 21V3" />
      <path d="M19 21V9" />
    </>
  ),
};

/** Lucide 1.77 paths, with the drawn extent of each in the 24-unit viewBox (stroke included). */
const MOTIFS: Record<MotifIcon, { paths: ReactNode; extent: [number, number, number, number] }> = {
  'pencil-sparkles': {
    extent: [1, 1, 23, 23],
    paths: (
      <>
        <path d="M10 3H8" />
        <path d="m15.007 5.008 3.987 3.986" />
        <path d="M20 15v4" />
        <path d="M21.174 6.813a2.82 2.82 0 0 0-3.986-3.987L3.842 16.175a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
        <path d="M22 17h-4" />
        <path d="M4 5v4" />
        <path d="M6 7H2" />
        <path d="M9 2v2" />
      </>
    ),
  },
  'user-exclamation-point': {
    extent: [4, 2, 20, 22],
    paths: (
      <>
        <path d="M15 15H9a4 4 0 00-4 4v2" />
        <path d="M18.988 13v4" />
        <path d="M18.988 21h.01" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
  },
  sparkles: {
    extent: [1, 1, 23, 23],
    paths: (
      <>
        <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
        <path d="M20 2v4" />
        <path d="M22 4h-4" />
        <circle cx="4" cy="20" r="2" />
      </>
    ),
  },
  'squares-intersect': {
    extent: [1, 1, 23, 23],
    paths: (
      <>
        <path d="M10 22a2 2 0 0 1-2-2" />
        <path d="M14 2a2 2 0 0 1 2 2" />
        <path d="M16 22h-2" />
        <path d="M2 10V8" />
        <path d="M2 4a2 2 0 0 1 2-2" />
        <path d="M20 8a2 2 0 0 1 2 2" />
        <path d="M22 14v2" />
        <path d="M22 20a2 2 0 0 1-2 2" />
        <path d="M4 16a2 2 0 0 1-2-2" />
        <path d="M8 10a2 2 0 0 1 2-2h5a1 1 0 0 1 1 1v5a2 2 0 0 1-2 2H9a1 1 0 0 1-1-1z" />
        <path d="M8 2h2" />
      </>
    ),
  },
};

/** The drawn icon sits this far from the top, right, and bottom of the 1440 x 997 frame. */
const MOTIF_EDGE = 72;
const MOTIF_HEIGHT = 997 - MOTIF_EDGE * 2;

function Motif({ icon }: { icon: MotifIcon }) {
  const { paths, extent } = MOTIFS[icon];
  const [, top, right, bottom] = extent;
  const box = (MOTIF_HEIGHT * 24) / (bottom - top);
  const unit = box / 24;
  const style = {
    '--motif-box': box,
    '--motif-top': MOTIF_EDGE - top * unit,
    '--motif-right': MOTIF_EDGE - (24 - right) * unit,
  } as CSSProperties;
  return (
    <svg
      className="slide__motif"
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths}
    </svg>
  );
}

function ChapterGlyph({ icon, className }: { icon: ChapterIcon; className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {CHAPTER_PATHS[icon]}
    </svg>
  );
}


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

function FlowArrow() {
  return (
    <svg className="screen-flow__arrow" viewBox="5 5 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" overflow="visible">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function Screens({ images, layout }: { images: BillImage[]; layout: ScreenLayout }) {
  if (layout === 'flow') {
    return (
      <div className="screen-flow">
        {images.map((image, index) => (
          <Fragment key={image.src}>
            {index > 0 && <FlowArrow />}
            <figure className="screen-card">
              <img src={image.src} alt={image.alt} />
            </figure>
          </Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className={`deck-screens deck-screens--${layout}`}>
      {images.map((image) => (
        <figure key={image.src}>
          <div className="screen-frame">
            <img
              src={image.src}
              alt={image.alt}
              style={image.trimBottom ? { clipPath: `inset(0 0 ${image.trimBottom}% 0)` } : undefined}
            />
          </div>
          {image.caption && <figcaption>{image.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}

/** Explorations stacked for comparison, each labeled on the left. */
function Passes({ images }: { images: BillImage[] }) {
  return (
    <div className="passes-frame">
      {images.map((image) => (
        <div className="pass" key={image.src}>
          <div className="pass__copy">
            <h2 className="pass__label">{image.caption}</h2>
            {image.detail && <p className="pass__detail">{image.detail}</p>}
          </div>
          <figure className="screen-card pass__card">
            <img src={image.src} alt={image.alt} />
          </figure>
        </div>
      ))}
    </div>
  );
}

function MetricGroups({ groups }: { groups: MetricGroup[] }) {
  return (
    <div className="metric-groups">
      {groups.map((group) => (
        <section className="metric-group" key={group.label}>
          <h2 className="metric-group__label">{group.label}</h2>
          <Metrics metrics={group.metrics} />
        </section>
      ))}
    </div>
  );
}

type GridColumn = { wide: GallerySlot } | { pair: GallerySlot[] };

function gridColumns(band: GallerySlot[]): GridColumn[] {
  const columns: GridColumn[] = [];
  let pending: GallerySlot[] = [];
  for (const photo of band) {
    if (photo.wide) {
      columns.push({ wide: photo });
      continue;
    }
    pending.push(photo);
    if (pending.length === 2) {
      columns.push({ pair: pending });
      pending = [];
    }
  }
  if (pending.length) columns.push({ pair: pending });
  return columns;
}

function GridPhoto({ photo, hidden }: { photo: GallerySlot; hidden?: boolean }) {
  return <img className="photo-grid__photo" src={photo.src} alt={hidden ? '' : photo.alt} draggable={false} />;
}

function GridSet({ band, hidden }: { band: GallerySlot[]; hidden?: boolean }) {
  return (
    <div className="photo-grid__set" aria-hidden={hidden || undefined}>
      {gridColumns(band).map((column, index) =>
        'wide' in column ? (
          <div key={index} className="photo-grid__col photo-grid__col--wide">
            <GridPhoto photo={column.wide} hidden={hidden} />
          </div>
        ) : (
          <div key={index} className="photo-grid__col">
            {column.pair.map((photo) => (
              <GridPhoto key={photo.src} photo={photo} hidden={hidden} />
            ))}
          </div>
        ),
      )}
    </div>
  );
}

const GRID_LOOP_SECONDS = 90;

/**
 * Each band repeats once so the loop is seamless. The copy enters from the right, inside the clip.
 * Position is kept as a fraction of one set so a drag or a resize never causes a jump.
 */
function PhotoGrid({ bands }: { bands: GallerySlot[][] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const drag = useRef<{ id: number; x: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const setWidth = () => railRef.current?.querySelector<HTMLElement>('.photo-grid__set')?.offsetWidth ?? 0;

  useEffect(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100) / 1000;
      last = now;
      if (!drag.current && !still.matches) progress.current = (progress.current + dt / GRID_LOOP_SECONDS) % 1;
      const rail = railRef.current;
      if (rail) rail.style.transform = `translate3d(${-progress.current * setWidth()}px, 0, 0)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    drag.current = { id: event.pointerId, x: event.clientX };
    gridRef.current?.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    const width = setWidth();
    if (!current || current.id !== event.pointerId || !width) return;
    const dx = event.clientX - current.x;
    current.x = event.clientX;
    progress.current = (((progress.current - dx / width) % 1) + 1) % 1;
  };

  const onPointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (drag.current?.id !== event.pointerId) return;
    drag.current = null;
    setDragging(false);
  };

  return (
    <div
      ref={gridRef}
      className={`photo-grid${dragging ? ' is-dragging' : ''}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onLostPointerCapture={onPointerEnd}
    >
      <div ref={railRef} className="photo-grid__rail">
        {bands.map((band, index) => (
          <div key={index} className="photo-grid__band">
            <GridSet band={band} />
            <GridSet band={band} hidden />
          </div>
        ))}
      </div>
    </div>
  );
}

function Timeline({ stops }: { stops: TimelineStop[] }) {
  return (
    <ol className="path">
      {stops.map((stop, index) => (
        <li key={index}>
          <img className="path__card" src={stop.image.src} alt={stop.image.alt} />
          <span className="path__dot" aria-hidden="true" />
          <p className="path__when">{stop.when}</p>
          <h2 className="path__place">{stop.place}</h2>
          <p className="path__role">{stop.role}</p>
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
        <div className="slide slide--intro">
          {slide.gallery && <PhotoGrid bands={slide.gallery} />}
          <div className="intro-portrait">
            {slide.portrait && <img src={slide.portrait.src} alt={slide.portrait.alt} />}
            {slide.title && <h1 className="intro-portrait__title">{slide.title}</h1>}
          </div>
        </div>
      );

    case 'divider':
      return (
        <div className="slide slide--divider">
          {slide.chapter && <ChapterGlyph icon={slide.chapter} className="divider__icon" />}
          {slide.title && <h1 className="divider__label">{slide.title}</h1>}
        </div>
      );

    case 'showcase': {
      const shot = slide.images?.[0];
      return (
        <div className="slide slide--showcase">
          <div className="showcase-frame">
            {shot && (
              <figure className="showcase__card">
                <img src={shot.src} alt={shot.alt} />
              </figure>
            )}
            {slide.title && (
              <h1 className="showcase__title">
                {slide.titleLead && <span className="showcase__lead">{slide.titleLead} </span>}
                {slide.title}
              </h1>
            )}
            {slide.body && <p className="showcase__support">{slide.body}</p>}
          </div>
        </div>
      );
    }

    case 'project':
      return (
        <div className={`slide slide--project slide--project-${slide.projectLayout ?? 'side'}`}>
          <div className="project-frame">
            {slide.title && <h1 className="project-frame__title">{slide.title}</h1>}
            {slide.image && <img className="project-frame__image" src={slide.image.src} alt={slide.image.alt} />}
          </div>
        </div>
      );

    case 'timeline':
      return (
        <div className="slide slide--path">
          <div className="path-frame">
            {slide.title && <h1 className="path-frame__title">{slide.title}</h1>}
            {slide.timeline && <Timeline stops={slide.timeline} />}
          </div>
        </div>
      );

    case 'feature':
      return (
        <div className="slide slide--feature">
          <div className="slide__copy">
            {slide.stage && <p className="slide__eyebrow">{slide.stage}</p>}
            {slide.title && <h1 className="slide__title slide__headline">{slide.title}</h1>}
            {slide.body && <p className="slide__body slide__support">{slide.body}</p>}
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
      if (slide.screenLayout === 'passes') {
        return (
          <div className="slide slide--passes">
            {slide.title && <h1 className="deck-hidden">{slide.title}</h1>}
            {slide.images && <Passes images={slide.images} />}
          </div>
        );
      }
      return (
        <div className="slide slide--screens">
          <div className="slide__inner">
            {slide.stage && <p className="slide__eyebrow">{slide.stage}</p>}
            {slide.title && <h1 className="slide__title slide__headline">{slide.title}</h1>}
            {slide.body && <p className="slide__body slide__support">{slide.body}</p>}
            {slide.images && <Screens images={slide.images} layout={slide.screenLayout ?? 'single'} />}
          </div>
        </div>
      );

    case 'rings':
      return (
        <div className="slide slide--metrics">
          <div className="slide__inner">
            {slide.stage && <p className="slide__eyebrow">{slide.stage}</p>}
            {slide.title && <h1 className="slide__title slide__headline">{slide.title}</h1>}
            {slide.body && <p className="slide__body slide__support">{slide.body}</p>}
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
            {slide.title && <h1 className="slide__title slide__headline">{slide.title}</h1>}
            {slide.body && <p className="slide__body slide__support">{slide.body}</p>}
            {slide.metrics && <Metrics metrics={slide.metrics} />}
            {slide.metricGroups && <MetricGroups groups={slide.metricGroups} />}
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
          {slide.motif && <Motif icon={slide.motif} />}
          <div className="slide__inner">
            {slide.stage && <p className="slide__eyebrow">{slide.stage}</p>}
            {slide.title && <h1 className="slide__title slide__headline">{slide.title}</h1>}
            {slide.body && <p className="slide__body slide__support">{slide.body}</p>}
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
            {slide.title && <h1 className="slide__title slide__headline">{slide.title}</h1>}
            {slide.body && <p className="slide__body slide__support">{slide.body}</p>}
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
      <ul className="deck__notes-points">
        {notes.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <p className="deck__notes-next">Next: {notes.next}</p>
      {notes.careful && <p className="deck__notes-meta">Careful: {notes.careful}</p>}
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

/** The prototype draws its phone at a fixed 844px tall. Scale the frame so the phone fills this share of the card. */
const PROTO_PHONE_HEIGHT = 844;
const PROTO_PHONE_SHARE = 0.7;

export default function BillDeck({ protoSrc }: Props) {
  const [index, setIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [protoStatus, setProtoStatus] = useState<ProtoStatus>('loading');
  const [iframeSrc] = useState(() => labSrc(protoSrc, 'online'));
  const frameRef = useRef<HTMLIFrameElement>(null);
  const paneRef = useRef<HTMLDivElement>(null);
  const [protoScale, setProtoScale] = useState(1);
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

  useEffect(() => {
    const pane = paneRef.current;
    if (!pane) return;
    const fit = () => setProtoScale(Math.min(1, (pane.clientHeight * PROTO_PHONE_SHARE) / PROTO_PHONE_HEIGHT));
    const observer = new ResizeObserver(fit);
    observer.observe(pane);
    fit();
    return () => observer.disconnect();
  }, []);

  const elapsed = startedAt === null ? 0 : Math.max(0, now - startedAt);

  return (
    <div className={`deck deck--${slide.layout}`}>
      <div
        ref={paneRef}
        className="deck__prototype"
        aria-hidden={!isSplit}
        style={{ '--proto-scale': protoScale } as CSSProperties}
      >
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

      {slide.chapter && slide.layout !== 'divider' && slide.layout !== 'showcase' && <ChapterGlyph icon={slide.chapter} className="chapter-mark" />}

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
