import { useEffect, useState } from 'react';
import type React from 'react';

/**
 * Minimal path router (no dependency): the store is a single page plus /affiliate.
 * vercel.json rewrites every path to index.html so these routes also work on a fresh load.
 */
const EVENT = 'shopnow:navigate';

export function navigate(to: string) {
  if (to === window.location.pathname + window.location.hash) return;
  window.history.pushState(null, '', to);
  window.dispatchEvent(new Event(EVENT));
  if (!to.includes('#')) window.scrollTo({ top: 0, behavior: 'auto' });
}

export function usePath() {
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => {
    const sync = () => setPath(window.location.pathname);
    window.addEventListener('popstate', sync);
    window.addEventListener(EVENT, sync);
    return () => { window.removeEventListener('popstate', sync); window.removeEventListener(EVENT, sync); };
  }, []);
  return path;
}

/** onClick for <a href="/..."> internal links: client-side navigation, but keeps new-tab / modifier clicks native. */
export function linkHandler(to: string) {
  return (e: React.MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };
}

export const AFFILIATE_PATH = '/affiliate';
