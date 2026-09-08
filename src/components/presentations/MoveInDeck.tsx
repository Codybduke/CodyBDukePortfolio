import { useCallback, useEffect, useRef, useState } from 'react';

import { scenes, slides, type SceneId } from '../../data/presentations/move-in-scanner';
import { driveScene, labSrc, networkFor, waitUntilReady } from './proto-driver';

type Props = {
  protoSrc: string;
};

function paramsOf(src: string) {
  return (src.split('?')[1] ?? '').replace(/&r=\d+/g, '');
}

export default function MoveInDeck({ protoSrc }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const sceneRef = useRef<SceneId>(slides[0].scene);
  const reloadsRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [sceneOverride, setSceneOverride] = useState<SceneId | null>(null);
  const [iframeSrc, setIframeSrc] = useState(() => labSrc(protoSrc, 'online'));
  const [driving, setDriving] = useState(false);

  const slide = slides[index];
  const scene = sceneOverride ?? slide.scene;
  sceneRef.current = scene;

  const go = useCallback((next: number) => {
    setSceneOverride(null);
    setIndex(Math.max(0, Math.min(slides.length - 1, next)));
  }, []);

  const requestSrc = useCallback(
    (target: SceneId, force = false) => {
      const next = labSrc(protoSrc, networkFor(target));
      setIframeSrc((prev) => {
        if (!force && paramsOf(prev) === paramsOf(next)) return prev;
        reloadsRef.current = force ? reloadsRef.current + 1 : 0;
        return force ? `${next}&r=${Date.now()}` : next;
      });
    },
    [protoSrc],
  );

  const runScene = useCallback(async (target: SceneId) => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setDriving(true);
    try {
      await waitUntilReady(iframe, ac.signal);
      if (ac.signal.aborted || sceneRef.current !== target) return;
      const result = await driveScene(iframe, target, ac.signal);
      if (ac.signal.aborted || sceneRef.current !== target) return;
      if (result === 'reload' && reloadsRef.current < 1) {
        requestSrc(target, true);
      }
    } finally {
      if (sceneRef.current === target) setDriving(false);
    }
  }, [requestSrc]);

  useEffect(() => {
    requestSrc(scene);
    void runScene(scene);
    return () => abortRef.current?.abort();
  }, [scene, requestSrc, runScene]);

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
    const hash = `#${index + 1}`;
    if (window.location.hash !== hash) history.replaceState(null, '', hash);
  }, [index]);

  useEffect(() => {
    const raw = Number(window.location.hash.replace('#', ''));
    if (Number.isInteger(raw) && raw >= 1 && raw <= slides.length) setIndex(raw - 1);
  }, []);

  return (
    <div className="deck">
      <section className="deck__copy" aria-live="polite">
        <p className="deck__eyebrow">
          {slide.stage ?? 'Walkthrough'}
          <span className="deck__count">
            {index + 1} / {slides.length}
          </span>
        </p>
        {slide.kicker && <p className="deck__kicker">{slide.kicker}</p>}
        <h1>{slide.title}</h1>
        {slide.body && <p className="deck__body">{slide.body}</p>}
        {slide.metrics && (
          <div className="deck__metrics">
            {slide.metrics.map((metric) => (
              <div key={metric.label} className="deck__metric">
                <p className="deck__metric-value">{metric.value}</p>
                <p className="deck__metric-label">{metric.label}</p>
              </div>
            ))}
          </div>
        )}
        {slide.bullets && (
          <ul className="deck__bullets">
            {slide.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        )}
        {slide.cue && <p className="deck__cue">{slide.cue}</p>}

        <div className="deck__nav">
          <button type="button" onClick={() => go(index - 1)} disabled={index === 0}>
            Prev
          </button>
          <button type="button" onClick={() => go(index + 1)} disabled={index === slides.length - 1}>
            Next
          </button>
          <p className="deck__keys">← → or space</p>
        </div>
      </section>

      <section className="deck__stage">
        <div className="deck__scenes" role="tablist" aria-label="Prototype states">
          {scenes.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={scene === item.id}
              className={scene === item.id ? 'is-active' : undefined}
              onClick={() => {
                reloadsRef.current = 0;
                setSceneOverride(item.id);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="deck__frame">
          <iframe
            ref={iframeRef}
            src={iframeSrc}
            title="OXP Move-In prototype"
            onLoad={() => {
              reloadsRef.current = 0;
              void runScene(sceneRef.current);
            }}
          />
          {driving && (
            <p className="deck__driving">Opening {scenes.find((item) => item.id === scene)?.label}…</p>
          )}
        </div>
      </section>
    </div>
  );
}
