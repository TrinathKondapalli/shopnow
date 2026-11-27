const INR_FMT = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
export const inr = (n: number) => INR_FMT.format(n);

export const cn = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ');

/** Darken (negative) or lighten (positive) a hex colour. */
export function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const ch = [n >> 16, (n >> 8) & 255, n & 255].map((v) =>
    Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt))),
  );
  return '#' + ch.map((v) => v.toString(16).padStart(2, '0')).join('');
}

/** Relative luminance, used to pick readable marks on light vs dark garments. */
export function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b > 170;
}

/** Height of the sticky header, so scroll targets land just below it. */
export const headerOffset = () => (document.querySelector('header')?.getBoundingClientRect().height ?? 72) + 8;

/**
 * Scrolls a section to just below the sticky header. Content above the target can still change height
 * while the smooth scroll runs (images loading, grids re-filtering), so the position is corrected once
 * the scroll settles. This is what stops "scrolls halfway to the results".
 */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const target = () => el.getBoundingClientRect().top + window.scrollY - headerOffset();
  window.scrollTo({ top: target(), behavior: reduce ? 'auto' : 'smooth' });
  let settle = 0;
  const check = () => {
    const off = Math.abs(el.getBoundingClientRect().top - headerOffset());
    if (off > 4 && settle < 3) { settle++; window.scrollTo({ top: target(), behavior: 'auto' }); }
  };
  window.setTimeout(check, reduce ? 50 : 700);
  window.setTimeout(check, reduce ? 300 : 1300);
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const formatDate = (iso: string) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
