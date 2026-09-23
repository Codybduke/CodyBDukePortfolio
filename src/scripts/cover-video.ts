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

/** Pause this far before the end so the player never fires `ended` and rewinds to frame 0. */
const END_GAP = 0.034;

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

function playedAmount(state: CoverState) {
  const duration = durationOf(state.forward);
  const current = state.forward.currentTime;
  const remembered = state.lastForwardTime;
  if (state.forward.ended) return duration || remembered;
  // A finished clip can report currentTime 0 after it rewinds. Trust the further position.
  if (current < 0.04 && remembered > current) return remembered;
  return Math.max(current, remembered);
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

  const onPresented = (video: HTMLVideoElement) => {
    if (video === forward && !video.paused) state.lastForwardTime = video.currentTime;
    const duration = durationOf(video);
    if (!duration || video.paused || duration - video.currentTime > END_GAP) return;

    if (video === forward && state.hovering) {
      video.pause();
      state.lastForwardTime = Math.max(state.lastForwardTime, video.currentTime);
      return;
    }

    // Reverse frame 0 is the hovered pose. Letting the clip end rewinds to that
    // frame, then the poster snaps back. Pause and hand off while still on the rest pose.
    if (video === reverse && !state.hovering && video.classList.contains('is-active')) {
      video.pause();
      resetToPoster(card, state);
    }
  };

  const watch = (video: HTMLVideoElement) => {
    const step = () => {
      onPresented(video);
      if (!video.paused && typeof video.requestVideoFrameCallback === 'function') {
        video.requestVideoFrameCallback(step);
      }
    };
    video.addEventListener('play', () => {
      if (typeof video.requestVideoFrameCallback === 'function') video.requestVideoFrameCallback(step);
    });
    video.addEventListener('timeupdate', () => onPresented(video));
  };

  watch(forward);
  if (reverse) watch(reverse);

  forward.addEventListener('loadeddata', () => pinIfResting(forward));
  reverse?.addEventListener('loadeddata', () => pinIfResting(reverse));

  forward.addEventListener('ended', () => {
    const duration = durationOf(forward);
    state.lastForwardTime = duration || state.lastForwardTime;
    if (!state.hovering || !duration || forward.currentTime >= 0.05) return;
    // The player already rewound to the first frame. Put the finished pose back.
    try {
      forward.currentTime = Math.max(duration - END_GAP, 0);
    } catch {
      /* ignore */
    }
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
  const gen = state.gen;
  state.hovering = false;
  state.lastForwardTime = 0;
  // Hide before seeking. Reverse time 0 is the hovered pose, and seeking there
  // while the video is still up flashes that pose, then the poster.
  setActive(card, state, null);
  const forward = state.forward;
  const reverse = state.reverse;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (gen !== state.gen) return;
      pinToStart(forward);
      if (reverse) pinToStart(reverse);
    });
  });
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

function seekTo(video: HTMLVideoElement, time: number, state: CoverState, done: () => void) {
  const gen = state.gen;
  const duration = durationOf(video);
  const target = duration ? Math.min(Math.max(time, 0), Math.max(duration - 0.001, 0)) : 0;
  const finish = () => {
    if (gen !== state.gen) return;
    done();
  };

  if (!duration || Math.abs(video.currentTime - target) < 0.02) {
    finish();
    return;
  }

  video.addEventListener('seeked', finish, { once: true });
  try {
    video.currentTime = target;
  } catch {
    finish();
  }
}

function seekAndPlay(video: HTMLVideoElement, time: number, state: CoverState) {
  seekTo(video, time, state, () => playWhenReady(video, state));
}

function enter(card: HTMLElement) {
  const state = getState(card);
  if (!state || reduceMotion.matches) return;

  const fromReverse =
    Boolean(state.reverse?.classList.contains('is-active')) && (state.reverse?.currentTime ?? 0) > 0.02;

  state.gen += 1;
  state.hovering = true;
  state.reverse?.pause();

  const duration = durationOf(state.forward);
  const atEnd =
    state.lastForwardTime > 0 &&
    (state.forward.ended || (duration > 0 && state.lastForwardTime >= duration - 0.04));

  if (atEnd && !fromReverse) {
    setActive(card, state, 'forward');
    if (duration && state.forward.currentTime < 0.05) {
      try {
        state.forward.currentTime = Math.max(duration - END_GAP, 0);
      } catch {
        /* ignore */
      }
    }
    return;
  }

  if (fromReverse && state.reverse) {
    const reverseDuration = durationOf(state.reverse);
    const mirrored = reverseDuration ? Math.max(reverseDuration - state.reverse.currentTime, 0) : 0;
    const gen = state.gen;
    seekTo(state.forward, mirrored, state, () => {
      if (gen !== state.gen || !state.hovering) return;
      setActive(card, state, 'forward');
      playWhenReady(state.forward, state);
    });
    return;
  }

  setActive(card, state, 'forward');
  if (state.forward.currentTime > 0.04) pinToStart(state.forward);
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
  const t = playedAmount(state);

  if (t < 0.04) {
    resetToPoster(card, state);
    return;
  }

  const mirrored = forwardDuration && reverseDuration ? Math.max(reverseDuration - t, 0) : 0;
  const reverse = state.reverse;
  const gen = state.gen;
  // Keep the forward frame up until reverse is parked on the matching frame.
  seekTo(reverse, mirrored, state, () => {
    if (gen !== state.gen || state.hovering) return;
    setActive(card, state, 'reverse');
    playWhenReady(reverse, state);
  });
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
