import { useEffect, useState } from 'react';

/** a: knockout nav over the dithered stone. b and c: the centred stone, rough set a or b. */
export type HomeVersion = 'a' | 'b' | 'c';

export const HOME_VERSION_KEY = 'home-version-v2';
export const HOME_VERSION_EVENT = 'home-version';

export function readHomeVersion(): HomeVersion {
  const value = document.documentElement.dataset.home;
  return value === 'b' || value === 'c' ? value : 'a';
}

export function setHomeVersion(next: HomeVersion) {
  document.documentElement.dataset.home = next;
  try {
    localStorage.setItem(HOME_VERSION_KEY, next);
  } catch {
    /* private mode: the switch still works for this visit */
  }
  window.dispatchEvent(new CustomEvent(HOME_VERSION_EVENT, { detail: next }));
}

/** `null` until hydrated, so server and first client render agree. */
export function useHomeVersion(): HomeVersion | null {
  const [version, setVersion] = useState<HomeVersion | null>(null);

  useEffect(() => {
    const sync = () => setVersion(readHomeVersion());
    sync();
    window.addEventListener(HOME_VERSION_EVENT, sync);
    return () => window.removeEventListener(HOME_VERSION_EVENT, sync);
  }, []);

  return version;
}
