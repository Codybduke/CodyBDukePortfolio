type CoverState = {
  forward: HTMLVideoElement;
  reverse: HTMLVideoElement | null;
  hovering: boolean;
  lastForwardTime: number;
  gen: number;
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const states = new WeakMap<HTMLElement, CoverState>();
let activeCard: HTMLElement | null = null;

function durationOf(video: HTMLVideoElement) {
  return Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0;
}

function pinToStart(video: HTMLVideoElement) {
  video.pause();
  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
    try {
      video.currentTime = 0;
    } catch {
      /* ignore */
    }
  }
}

function getState(card: HTMLElement): CoverState | null {
  const existing = states.get(card);
  if (existing) return existing;

  const forward = card.querySelector<HTMLVideoElement>('video[data-dir="forward"]');
  if (!forward) return null;
  const reverse = card.querySelector<HTMLVideoElement>('video[data-dir="reverse"]');

  forward.muted = true;
  forward.playsInline = true;
  if (reverse) {
    reverse.muted = true;
    reverse.playsInline = true;
  }

  const state: CoverState = {
    forward,
    reverse,
    hovering: false,
    lastForwardTime: 0,
    gen: 0,
  };
  states.set(card, state);

  const pinIfResting = (video: HTMLVideoElement) => {
    if (state.hovering || card.classList.contains('is-playing')) return;
    pinToStart(video);
  };

  forward.addEventListener('loadeddata', () => pinIfResting(forward));
  reverse?.addEventListener('loadeddata', () => pinIfResting(reverse));

  forward.addEventListener('timeupdate', () => {
    if (!forward.paused) state.lastForwardTime = forward.currentTime;
  });
  forward.addEventListener('ended', () => {
    const duration = durationOf(forward);
    state.lastForwardTime = duration;
    if (duration) forward.currentTime = Math.max(duration - 0.001, 0);
  });
  reverse?.addEventListener('ended', () => {
    if (state.hovering) return;
    resetToPoster(card, state);
  });

  pinToStart(forward);
  if (reverse) pinToStart(reverse);

  return state;
}

function setActive(card: HTMLElement, state: CoverState, which: 'forward' | 'reverse' | null) {
  state.forward.classList.toggle('is-active', which === 'forward');
  state.reverse?.classList.toggle('is-active', which === 'reverse');
  card.classList.toggle('is-playing', which !== null);
}

function resetToPoster(card: HTMLElement, state: CoverState) {
  state.gen += 1;
  state.hovering = false;
  state.lastForwardTime = 0;
  pinToStart(state.forward);
  if (state.reverse) pinToStart(state.reverse);
  setActive(card, state, null);
}

function playWhenReady(video: HTMLVideoElement, state: CoverState) {
  const gen = state.gen;
  video.muted = true;
  video.playsInline = true;
  const play = () => {
    if (gen !== state.gen) return;
    void video.play().catch(() => undefined);
  };
  play();
  if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
    video.addEventListener('canplay', play, { once: true });
  }
}

function seekAndPlay(video: HTMLVideoElement, time: number, state: CoverState) {
  const gen = state.gen;
  video.muted = true;
  const duration = durationOf(video);
  const target = duration ? Math.min(Math.max(time, 0), Math.max(duration - 0.001, 0)) : 0;

  const play = () => {
    if (gen !== state.gen) return;
    playWhenReady(video, state);
  };

  if (!duration || Math.abs(video.currentTime - target) < 0.03) {
    play();
    return;
  }

  video.addEventListener(
    'seeked',
    () => {
      if (gen !== state.gen) return;
      play();
    },
    { once: true },
  );
  try {
    video.currentTime = target;
  } catch {
    play();
  }
}

function enter(card: HTMLElement) {
  const state = getState(card);
  if (!state || reduceMotion.matches) return;

  const fromReverse =
    Boolean(state.reverse?.classList.contains('is-active')) && (state.reverse?.currentTime ?? 0) > 0.02;

  state.gen += 1;
  state.hovering = true;
  state.reverse?.pause();
  setActive(card, state, 'forward');

  const duration = durationOf(state.forward);
  const atEnd =
    state.lastForwardTime > 0 &&
    (state.forward.ended || (duration > 0 && state.lastForwardTime >= duration - 0.04));

  if (atEnd && !fromReverse) {
    if (duration) state.forward.currentTime = duration - 0.001;
    return;
  }

  if (fromReverse && state.reverse) {
    const reverseDuration = durationOf(state.reverse);
    const mirrored = reverseDuration ? Math.max(reverseDuration - state.reverse.currentTime, 0) : 0;
    seekAndPlay(state.forward, mirrored, state);
    return;
  }

  if (state.forward.currentTime > 0.04 && !fromReverse) {
    pinToStart(state.forward);
  }
  playWhenReady(state.forward, state);
}

function leave(card: HTMLElement) {
  const state = getState(card);
  if (!state) return;

  state.hovering = false;
  if (reduceMotion.matches || !state.reverse) {
    resetToPoster(card, state);
    return;
  }

  state.gen += 1;
  state.forward.pause();
  const forwardDuration = durationOf(state.forward);
  const reverseDuration = durationOf(state.reverse);
  const t = state.forward.ended ? forwardDuration : state.lastForwardTime || state.forward.currentTime;

  if (t < 0.04) {
    resetToPoster(card, state);
    return;
  }

  setActive(card, state, 'reverse');
  const mirrored = forwardDuration && reverseDuration ? Math.max(reverseDuration - t, 0) : 0;
  seekAndPlay(state.reverse, mirrored, state);
}

function cardFromTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;
  return target.closest<HTMLElement>('.case-card:has(video)');
}

document.addEventListener(
  'pointerover',
  (event) => {
    const card = cardFromTarget(event.target);
    if (!card || card === activeCard) return;
    if (activeCard) leave(activeCard);
    activeCard = card;
    enter(card);
  },
  true,
);

document.addEventListener(
  'pointerout',
  (event) => {
    if (!activeCard) return;
    const next = event.relatedTarget;
    if (next instanceof Node && activeCard.contains(next)) return;
    if (
      cardFromTarget(event.target) !== activeCard &&
      !(event.target instanceof Node && activeCard.contains(event.target))
    ) {
      return;
    }
    leave(activeCard);
    activeCard = null;
  },
  true,
);
