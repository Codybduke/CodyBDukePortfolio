import type { SceneId } from '../../data/presentations/move-in-scanner';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function docOf(iframe: HTMLIFrameElement): Document | null {
  try {
    return iframe.contentDocument;
  } catch {
    return null;
  }
}

function winOf(iframe: HTMLIFrameElement): Window | null {
  try {
    return iframe.contentWindow;
  } catch {
    return null;
  }
}

function visible(el: Element): boolean {
  const style = getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
    return false;
  }
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function smallestTextMatch(root: Document | Element, text: string, exact: boolean): HTMLElement | null {
  const needle = text.trim();
  let best: HTMLElement | null = null;
  let bestLen = Infinity;
  const nodes = root.querySelectorAll<HTMLElement>('*');
  for (const el of nodes) {
    if (!visible(el)) continue;
    const t = el.textContent?.trim() ?? '';
    if (!t) continue;
    const match = exact ? t === needle : t.includes(needle);
    if (!match) continue;
    if (t.length < bestLen) {
      best = el;
      bestLen = t.length;
    }
  }
  return best;
}

function tap(el: HTMLElement) {
  el.scrollIntoView({ block: 'center', inline: 'nearest' });
  const rect = el.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const view = el.ownerDocument.defaultView;
  const common = { bubbles: true, cancelable: true, view, clientX: x, clientY: y };
  el.dispatchEvent(new PointerEvent('pointerdown', { ...common, pointerId: 1, pointerType: 'mouse' }));
  el.dispatchEvent(new PointerEvent('pointerup', { ...common, pointerId: 1, pointerType: 'mouse' }));
  el.dispatchEvent(new MouseEvent('mousedown', common));
  el.dispatchEvent(new MouseEvent('mouseup', common));
  el.dispatchEvent(new MouseEvent('click', common));
}

async function waitFor(
  iframe: HTMLIFrameElement,
  test: (doc: Document) => boolean,
  timeout: number,
  signal: AbortSignal,
): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (signal.aborted) return false;
    const doc = docOf(iframe);
    if (doc && test(doc)) return true;
    await sleep(120);
  }
  return false;
}

async function waitForText(
  iframe: HTMLIFrameElement,
  text: string,
  signal: AbortSignal,
  timeout = 20_000,
): Promise<boolean> {
  return waitFor(iframe, (doc) => Boolean(smallestTextMatch(doc, text, true)), timeout, signal);
}

async function clickText(
  iframe: HTMLIFrameElement,
  text: string,
  signal: AbortSignal,
  { exact = true, last = false }: { exact?: boolean; last?: boolean } = {},
): Promise<boolean> {
  const doc = docOf(iframe);
  if (!doc) return false;
  if (last) {
    const matches: HTMLElement[] = [];
    const nodes = doc.querySelectorAll<HTMLElement>('*');
    for (const el of nodes) {
      if (!visible(el)) continue;
      const t = el.textContent?.trim() ?? '';
      if (exact ? t === text : t.includes(text)) matches.push(el);
    }
    const el = matches[matches.length - 1];
    if (!el) return false;
    tap(el);
    await sleep(350);
    return !signal.aborted;
  }
  const el = smallestTextMatch(doc, text, exact);
  if (!el) return false;
  tap(el);
  await sleep(350);
  return !signal.aborted;
}

function scrollMoveInIntoView(doc: Document) {
  const target = smallestTextMatch(doc, 'Move-In', true);
  if (!target) return;
  let node: HTMLElement | null = target;
  while (node && node !== doc.body) {
    const style = getComputedStyle(node);
    const oy = style.overflowY;
    if ((oy === 'auto' || oy === 'scroll' || oy === 'overlay') && node.scrollHeight > node.clientHeight + 20) {
      const tr = target.getBoundingClientRect();
      const nr = node.getBoundingClientRect();
      node.scrollTop += tr.top - nr.top - nr.height * 0.35;
      return;
    }
    node = node.parentElement;
  }
  target.scrollIntoView({ block: 'center', inline: 'nearest' });
}

function screenOf(doc: Document): SceneId | 'unknown' | 'summary' {
  if (smallestTextMatch(doc, 'Confirm Move-in', true)) return 'confirm';
  if (smallestTextMatch(doc, 'Move-in Checklist', true)) return 'summary';
  if (smallestTextMatch(doc, 'Upcoming Move-ins', true)) return 'roster';
  if (smallestTextMatch(doc, 'Quick Actions', true)) return 'home';
  return 'unknown';
}

function setNativeValue(input: HTMLInputElement, value: string) {
  const proto = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
  proto?.set?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

async function fillSearch(iframe: HTMLIFrameElement, value: string, signal: AbortSignal): Promise<boolean> {
  const doc = docOf(iframe);
  if (!doc) return false;
  const input =
    doc.querySelector<HTMLInputElement>('input[placeholder*="Search" i]') ||
    doc.querySelector<HTMLInputElement>('input[placeholder*="name" i]');
  if (!input) return false;
  input.focus();
  setNativeValue(input, value);
  await sleep(400);
  return !signal.aborted;
}

async function openMoveIn(iframe: HTMLIFrameElement, signal: AbortSignal): Promise<boolean> {
  const doc = docOf(iframe);
  if (!doc) return false;
  scrollMoveInIntoView(doc);
  await sleep(250);
  if (!(await clickText(iframe, 'Move-In', signal))) return false;
  return waitForText(iframe, 'Upcoming Move-ins', signal, 12_000);
}

async function ensureRoster(iframe: HTMLIFrameElement, signal: AbortSignal): Promise<boolean> {
  const doc = docOf(iframe);
  if (!doc) return false;
  const screen = screenOf(doc);
  if (screen === 'roster') return true;
  if (screen === 'confirm' || screen === 'summary') {
    // Back chevron has no accessible name; reset via home is more reliable.
    return false;
  }
  if (screen === 'home' || smallestTextMatch(doc, 'Move-In', true)) {
    return openMoveIn(iframe, signal);
  }
  return false;
}

async function openResident(
  iframe: HTMLIFrameElement,
  name: string,
  signal: AbortSignal,
): Promise<boolean> {
  if (!(await ensureRoster(iframe, signal))) return false;
  if (!(await clickText(iframe, name, signal))) return false;
  return waitFor(
    iframe,
    (doc) => Boolean(smallestTextMatch(doc, 'Move-in Checklist', true) || smallestTextMatch(doc, name, false)),
    12_000,
    signal,
  );
}

export function labSrc(base: string, network: 'online' | 'offline'): string {
  const trimmed = base.endsWith('/') ? base : `${base}/`;
  const params = new URLSearchParams({
    lab: '1',
    version: 'full',
    eli: 'enabled',
    briefing: 'v2',
    device: 'ios',
    size: 'mobile',
    phoneSim: 'on',
    network,
    brand: 'preview',
  });
  return `${trimmed}?${params.toString()}`;
}

export function networkFor(scene: SceneId): 'online' | 'offline' {
  return scene.startsWith('offline') ? 'offline' : 'online';
}

export async function waitUntilReady(iframe: HTMLIFrameElement, signal: AbortSignal): Promise<boolean> {
  return waitFor(
    iframe,
    (doc) =>
      Boolean(
        smallestTextMatch(doc, 'Quick Actions', true) ||
          smallestTextMatch(doc, 'Upcoming Move-ins', true) ||
          smallestTextMatch(doc, 'Move-In', true),
      ),
    25_000,
    signal,
  );
}

/**
 * Drive the same-origin Expo iframe to a move-in scene.
 * Returns false if the iframe needed a reload (caller should swap src and retry).
 */
export async function driveScene(
  iframe: HTMLIFrameElement,
  scene: SceneId,
  signal: AbortSignal,
): Promise<'ok' | 'reload'> {
  if (!(await waitUntilReady(iframe, signal))) return 'ok';
  if (signal.aborted) return 'ok';

  const doc = docOf(iframe);
  const win = winOf(iframe);
  if (!doc || !win) return 'ok';

  const wantOffline = networkFor(scene) === 'offline';
  const url = new URL(win.location.href);
  const urlOffline = url.searchParams.get('network') === 'offline';
  if (wantOffline !== urlOffline) return 'reload';

  switch (scene) {
    case 'home':
    case 'offline-home':
      if (screenOf(doc) === 'home' || smallestTextMatch(doc, 'Move-In', true)) return 'ok';
      return 'reload';
    case 'roster':
    case 'offline-roster': {
      const ok = await ensureRoster(iframe, signal);
      return ok ? 'ok' : 'reload';
    }
    case 'riley': {
      const ok = await openResident(iframe, 'Foster, Riley', signal);
      return ok ? 'ok' : 'reload';
    }
    case 'confirm': {
      if (screenOf(doc) !== 'summary') {
        const opened = await openResident(iframe, 'Foster, Riley', signal);
        if (!opened) return 'reload';
      }
      if (!(await clickText(iframe, 'Move in', signal, { exact: true }))) return 'reload';
      await waitForText(iframe, 'Confirm Move-in', signal, 8_000);
      return 'ok';
    }
    case 'morgan': {
      const ok = await openResident(iframe, 'Diaz, Morgan', signal);
      return ok ? 'ok' : 'reload';
    }
    case 'jamie': {
      const ok = await openResident(iframe, 'Baker, Jamie', signal);
      return ok ? 'ok' : 'reload';
    }
    case 'taylor': {
      const ok = await openResident(iframe, 'Anderson, Taylor', signal);
      return ok ? 'ok' : 'reload';
    }
    case 'roommates': {
      if (!(await ensureRoster(iframe, signal))) return 'reload';
      if (!(await fillSearch(iframe, '204', signal))) return 'reload';
      await waitForText(iframe, 'Baker, Jamie', signal, 6_000);
      return 'ok';
    }
    default:
      return 'ok';
  }
}
