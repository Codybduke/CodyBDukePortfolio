import { useEffect, useRef } from 'react';
import PortraitReveal from './PortraitReveal';

type Props = {
  portrait: string;
  rough: string;
  smooth: string;
};

/** The portrait stays put until the polished-stone heading reaches this line. */
const TRIGGER = 0.25;

function easeInOut(t: number) {
  const clamped = Math.min(1, Math.max(0, t));
  return clamped < 0.5 ? 2 * clamped * clamped : 1 - (-2 * clamped + 2) ** 2 / 2;
}

/**
 * The window stays put. The portrait holds until the polished-stone heading
 * reaches the top quarter of the screen, then slides up to the rough stone
 * and, further down, to the polished stone.
 */
export default function AboutStage({ portrait, rough, smooth }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    const section = document.getElementById('polished-stone');
    if (!stage || !track || !section) return;

    const desktop = window.matchMedia('(min-width: 900px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    const update = () => {
      frame = 0;
      const height = stage.getBoundingClientRect().height;
      if (!desktop.matches || height < 2 || window.scrollY <= 1) {
        track.style.transform = '';
        return;
      }
      const view = window.innerHeight;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - view);
      const triggerAt = section.getBoundingClientRect().top + window.scrollY - view * TRIGGER;
      const traveled = window.scrollY - triggerAt;
      // Fit both slides, plus a rest on the polished stone, into the scroll that is left.
      const room = Math.max(0, maxScroll - triggerAt);
      const scrub = Math.min(view * 0.55, room * 0.44);
      const hold = Math.min(view * 0.16, room * 0.12);
      const need = scrub * 2 + hold;
      const scale = need > room * 0.92 && need > 0 ? (room * 0.92) / need : 1;
      const scrubSpan = scrub * scale;
      const holdSpan = hold * scale;
      if (scrubSpan < 1) {
        track.style.transform = '';
        return;
      }

      let slide = 0;
      if (traveled > 0 && traveled < scrubSpan) slide = easeInOut(traveled / scrubSpan);
      else if (traveled >= scrubSpan && traveled < scrubSpan + holdSpan) slide = 1;
      else if (traveled >= scrubSpan + holdSpan && traveled < scrubSpan * 2 + holdSpan) {
        slide = 1 + easeInOut((traveled - scrubSpan - holdSpan) / scrubSpan);
      } else if (traveled >= scrubSpan * 2 + holdSpan) slide = 2;

      if (reduce.matches) slide = Math.round(slide);
      const slides = track.children;
      const index = Math.min(slides.length - 1, Math.floor(slide));
      const next = Math.min(slides.length - 1, index + 1);
      const fraction = slide - index;
      const from = (slides[index] as HTMLElement).offsetTop;
      const to = (slides[next] as HTMLElement).offsetTop;
      track.style.transform = `translate3d(0, ${-(from + (to - from) * fraction)}px, 0)`;
    };

    const request = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    desktop.addEventListener('change', request);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      desktop.removeEventListener('change', request);
    };
  }, []);

  return (
    <div className="about-stage" ref={stageRef}>
      <div className="about-stage__track" ref={trackRef}>
        <div className="about-stage__slide">
          <PortraitReveal src={portrait} alt="Portrait of Cody Duke" />
        </div>
        <div className="about-stage__slide about-stage__slide--stone">
          <img src={rough} alt="Rough stone, before the work of polishing." />
        </div>
        <div className="about-stage__slide about-stage__slide--stone">
          <img src={smooth} alt="The same stone after it has been polished." />
        </div>
      </div>
    </div>
  );
}
