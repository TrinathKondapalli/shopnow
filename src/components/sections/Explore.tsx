import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown, SearchX, SlidersHorizontal, X } from 'lucide-react';
import type { ColorFamily, ExploreState, PriceBand, ProductType, SortKey } from '../../types';
import {
  COLLECTIONS, COLOR_FAMILIES, DEFAULT_EXPLORE, NAV_GROUPS, PRICE_BANDS, PRODUCT_TYPES, SIZE_GROUPS, SORTS, TABS,
  activeFilterCount, applyExplore, typeLabel,
} from '../../lib/catalog';
import { cn } from '../../lib/utils';
import { DUR, EASE } from '../../lib/motion';
import { useDialog, useLockBodyScroll } from '../../hooks/useOverlay';
import { useShop } from '../../store/ShopProvider';
import { GridItem, ProductCardSkeleton } from '../product/ProductCard';

const PAGE = 8;
const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
const icon = (name: string) => ({ '--icon': `url(/figma/explore/${name}.svg)` } as CSSProperties);

/** Everything a shopper can filter by, including "Shop for" (the tab). Sort is kept. */
const cleared = (e: ExploreState): ExploreState => ({ ...DEFAULT_EXPLORE, sort: e.sort });
const filterCount = (e: ExploreState) => activeFilterCount(e) + (e.tab !== 'all' ? 1 : 0);

/** Popular categories offered when a search or filter finds nothing: the same links as the main nav. */
const POPULAR = NAV_GROUPS.flatMap((g) => g.links.map((l) => ({ label: `${g.label}: ${l.label}`, patch: l.patch })));

/** Figma chevron (Group at 25%/37.5% inset, stroke overhang wrapper), recoloured via currentColor. */
function Chevron({ name, className }: { name: 'icon-chevron-filter' | 'icon-chevron-sort'; className?: string }) {
  return (
    <span className={cn('relative block shrink-0 overflow-hidden', className)} aria-hidden="true">
      <span className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]">
        <span className="absolute inset-[-16.67%_-8.33%]">
          <span className="figma-icon" style={icon(name)} />
        </span>
      </span>
    </span>
  );
}

/**
 * 03. Explore products: one filter system (sidebar on desktop, Filters sheet on mobile), sorting and an animated grid.
 * "Shop for" (Men, Women, Ethnic, Festive, New, Sale) lives inside that filter panel.
 */
export function Explore() {
  const { explore, setExplore } = useShop();
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(PAGE);
  const [sheet, setSheet] = useState(false);
  const results = useMemo(() => applyExplore(explore), [explore]);
  const count = filterCount(explore);

  // Simulated first load so the skeleton state is visible, like a real store fetching products.
  useEffect(() => { const t = window.setTimeout(() => setLoading(false), 700); return () => window.clearTimeout(t); }, []);
  useEffect(() => { setVisible(PAGE); }, [explore]);

  const reset = () => setExplore(cleared(explore));
  const shown = results.slice(0, visible);

  return (
    <section id="shop" className="relative scroll-mt-20 overflow-hidden bg-bg leading-[normal]" aria-labelledby="shop-title">
      <div className="relative mx-auto max-w-[1648px] px-5 pb-16 pt-12 md:px-10 md:pt-16 lg:pt-[28px] xl:pb-[40px] xl:pl-[80px] xl:pr-[62px]">
        {/* Section Header */}
        <div className="relative">
          <div className="flex items-center gap-4">
            <span className="h-[1px] w-10 shrink-0 bg-accent" aria-hidden="true" />
            <p className="eyebrow">Explore products</p>
          </div>
          <h2 id="shop-title" className="mt-2 font-display text-[30px] font-semibold leading-[1.15] tracking-[-0.01em] text-text md:text-[48px]">
            Shop the <span className="italic text-accent">edit.</span>
          </h2>
          <p className="mt-2 text-[16px] text-text-muted md:text-[17px]">
            Kurtas, sarees, lehengas and more. Filter by category, size, colour and price.
          </p>
        </div>

        <div className="relative mt-6 border-b border-border" aria-hidden="true" />

        <div className="relative mt-6 grid gap-x-10 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block" aria-label="Filters">
            <div className="no-scrollbar sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-[var(--radius-card)] bg-bg-alt p-5">
              <FilterPanel idPrefix="side" />
            </div>
          </aside>

          <div className="min-w-0 pt-2 lg:pt-0">
            {/* Toolbar */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button type="button" className="chip h-11 lg:hidden" onClick={() => setSheet(true)} aria-haspopup="dialog">
                  <SlidersHorizontal size={15} aria-hidden="true" /> Filters
                  {count > 0 && <span className="grid size-5 place-items-center rounded-full bg-accent text-[12px] text-text-inverse tabular-nums"><span className="sr-only">, </span>{count}<span className="sr-only"> active</span></span>}
                </button>
                <p className="pl-px text-[15px] text-text tabular-nums" aria-live="polite">
                  <span className="font-semibold">{results.length}</span> {results.length === 1 ? 'product' : 'products'}
                </p>
              </div>
              <SortSelect value={explore.sort} onChange={(sort) => setExplore({ sort })} />
            </div>

            <ActiveChips />

            {loading ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : results.length === 0 ? (
              <EmptyState onReset={reset} query={explore.query.trim()} />
            ) : (
              <>
                <motion.div layout className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 md:grid-cols-3 xl:grid-cols-4">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {shown.map((p, i) => <GridItem key={p.id} product={p} index={i} />)}
                  </AnimatePresence>
                </motion.div>
                {results.length > visible && (
                  <div className="mt-8 flex flex-col items-center gap-4 sm:mt-7 sm:flex-row sm:justify-center sm:gap-0 xl:pr-[38px]">
                    <p className="text-[15px] text-text tabular-nums">Showing {shown.length} of {results.length}</p>
                    <div className="h-[4px] w-[208px] overflow-hidden rounded-pill bg-border sm:ml-[30px]" aria-hidden="true">
                      <div className="h-full rounded-pill bg-accent transition-[width] duration-300" style={{ width: `${(shown.length / results.length) * 100}%` }} />
                    </div>
                    <button
                      type="button"
                      data-avoid-fab=""
                      className="group flex h-12 items-center justify-center gap-3 rounded-btn bg-action px-6 text-[15px] font-semibold text-action-text transition-colors hover:bg-action-hover sm:ml-[48px]"
                      onClick={() => setVisible((v) => v + PAGE)}
                    >
                      Load more
                      <span className="relative block size-[18px] shrink-0 overflow-hidden transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
                        <span className="absolute inset-[20.83%_16.67%]">
                          <span className="absolute inset-[-7.14%_-6.25%]">
                            <span className="figma-icon" style={icon('icon-arrow-right')} />
                          </span>
                        </span>
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <FilterSheet open={sheet} onClose={() => setSheet(false)} resultCount={results.length} />
    </section>
  );
}

function SortSelect({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = SORTS.find((s) => s.id === value) ?? SORTS[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: globalThis.MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative ml-auto">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'inline-flex h-11 items-center gap-2 rounded-pill border bg-bg px-4 text-[14px] font-semibold text-text shadow-sm transition-all duration-150 lg:h-[38px]',
          open ? 'border-accent ring-2 ring-accent/20' : 'border-border-strong hover:border-text',
        )}
      >
        <span className="text-text-muted font-normal">Sort:</span>
        <span className="font-semibold text-text">{current.label}</span>
        <ChevronDown
          size={15}
          aria-hidden="true"
          className={cn('text-text transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            role="listbox"
            aria-label="Sort options"
            className="absolute right-0 top-full mt-2 z-30 min-w-[210px] overflow-hidden rounded-[var(--radius-card)] border border-border bg-bg p-1.5 shadow-[var(--shadow-pop)]"
          >
            {SORTS.map((s) => {
              const active = s.id === value;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(s.id);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex min-h-11 w-full items-center justify-between rounded-btn px-3.5 py-2.5 text-left text-[14px] font-medium transition-colors',
                    active ? 'bg-accent-soft font-semibold text-accent' : 'text-text hover:bg-bg-alt',
                  )}
                >
                  <span>{s.label}</span>
                  {active && <Check size={15} className="text-accent" aria-hidden="true" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Removable "applied filter" chips. */
function ActiveChips() {
  const { explore, setExplore } = useShop();
  const chips: { label: string; remove: () => void }[] = [];
  if (explore.tab !== 'all') chips.push({ label: TABS.find((t) => t.id === explore.tab)?.label ?? explore.tab, remove: () => setExplore({ tab: 'all' }) });
  if (explore.query.trim()) chips.push({ label: `“${explore.query}”`, remove: () => setExplore({ query: '' }) });
  if (explore.collection) chips.push({ label: COLLECTIONS[explore.collection] ?? explore.collection, remove: () => setExplore({ collection: null }) });
  explore.types.forEach((t) => chips.push({ label: typeLabel(t), remove: () => setExplore({ types: explore.types.filter((x) => x !== t) }) }));
  explore.sizes.forEach((s) => chips.push({ label: `Size ${s}`, remove: () => setExplore({ sizes: explore.sizes.filter((x) => x !== s) }) }));
  explore.colors.forEach((c) => chips.push({ label: COLOR_FAMILIES.find((f) => f.id === c)?.label ?? c, remove: () => setExplore({ colors: explore.colors.filter((x) => x !== c) }) }));
  explore.prices.forEach((p) => chips.push({ label: PRICE_BANDS.find((b) => b.id === p)?.label ?? p, remove: () => setExplore({ prices: explore.prices.filter((x) => x !== p) }) }));
  if (!chips.length) return null;
  return (
    <div className="mb-[17px] flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <button key={c.label} type="button" onClick={c.remove} className="inline-flex h-11 items-center gap-1.5 rounded-pill border border-accent/30 bg-accent-soft px-3 text-[13px] font-medium text-accent hover:border-accent lg:h-8" aria-label={`Remove filter ${c.label}`}>
          {c.label} <X size={13} aria-hidden="true" />
        </button>
      ))}
      <button type="button" onClick={() => setExplore(cleared(explore))} className="ml-1 inline-flex h-11 items-center px-1 text-[13px] font-semibold text-accent underline underline-offset-4 hover:text-accent-hover lg:h-8">
        Clear all
      </button>
    </div>
  );
}

function EmptyState({ onReset, query }: { onReset: () => void; query: string }) {
  const { shopWith } = useShop();
  return (
    <div className="flex flex-col items-center rounded-[var(--radius-card)] border border-dashed border-border bg-bg px-5 py-14 text-center sm:px-6" role="status">
      <span className="grid size-14 place-items-center rounded-full bg-accent-soft text-accent shadow-sm" aria-hidden="true"><SearchX size={26} /></span>
      <h3 className="mt-5 break-words font-display text-3xl font-semibold text-text [overflow-wrap:anywhere]">
        {query ? <>No results for ‘{query}’</> : 'No products match these filters'}
      </h3>
      <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-text-muted">
        {query ? 'Check the spelling, try a shorter word, or browse a popular category.' : 'Try removing a filter or two, or browse a popular category.'}
      </p>
      <p className="mt-6 text-[13px] font-semibold uppercase tracking-[0.12em] text-text">Popular categories</p>
      <ul data-avoid-fab="" className="mt-3 flex max-w-xl flex-wrap justify-center gap-2">
        {POPULAR.map((c) => (
          <li key={c.label}>
            <button type="button" onClick={() => shopWith(c.patch)} className="inline-flex h-11 items-center rounded-pill border border-border-strong bg-bg px-4 text-[14px] font-medium text-text transition-colors hover:border-accent hover:bg-accent-soft hover:text-accent">
              {c.label}
            </button>
          </li>
        ))}
      </ul>
      <button type="button" data-avoid-fab="" onClick={onReset} className="btn btn-dark mt-7 min-h-11">{query ? 'Clear search and filters' : 'Clear filters'}</button>
    </div>
  );
}

function FilterGroup({
  title, children, defaultOpen = true, bodyGap, bottom, first, last,
}: { title: string; children: ReactNode; defaultOpen?: boolean; bodyGap: string; bottom: string; first?: boolean; last?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cn(!first && 'pt-[9.6px]', !last && 'border-b border-border', open ? !last && bottom : 'pb-[10px]')}>
      <button
        type="button"
        className="flex min-h-11 w-full items-center justify-between text-left text-[16px] font-semibold text-text transition-colors hover:text-accent lg:min-h-8"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className="pl-[1.1px]">{title}</span>
        <Chevron name="icon-chevron-filter" className={cn('mr-[1.2px] size-[17px] transition-transform duration-200', !open && 'rotate-180')} />
      </button>
      {open && <div className={bodyGap}>{children}</div>}
    </div>
  );
}

function CheckMark({ on }: { on: boolean }) {
  return (
    <span className={cn('grid size-[17.2px] shrink-0 place-items-center rounded-[4px] border border-border-strong bg-bg text-text-inverse transition-colors', on && 'border-accent bg-accent')} aria-hidden="true">
      {on && <Check size={12} strokeWidth={3} />}
    </span>
  );
}

function FilterPanel({ idPrefix }: { idPrefix: string }) {
  const { explore, setExplore } = useShop();
  const setTypes = (t: ProductType) => setExplore({ types: toggle(explore.types, t) });
  const setSize = (s: string) => setExplore({ sizes: toggle(explore.sizes, s) });
  const setColor = (c: ColorFamily) => setExplore({ colors: toggle(explore.colors, c) });
  const setPrice = (p: PriceBand) => setExplore({ prices: toggle(explore.prices, p) });

  return (
    <div className="leading-[normal] lg:w-full">
      <FilterGroup title="Shop for" first bodyGap="mt-[10px]" bottom="pb-[14px]">
        <div role="radiogroup" aria-label="Shop for" className="flex flex-col lg:gap-[6px]">
          {TABS.map((t) => {
            const on = explore.tab === t.id;
            return (
              <label key={t.id} className="flex min-h-11 cursor-pointer items-center gap-[14.5px] text-[15px] text-text transition-colors hover:text-accent lg:min-h-7">
                <input
                  type="radio"
                  name={`${idPrefix}-shop-for`}
                  value={t.id}
                  checked={on}
                  onChange={() => setExplore({ tab: t.id })}
                  className="peer sr-only"
                />
                <span className={cn('grid size-[18px] shrink-0 place-items-center rounded-full border bg-bg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent', on ? 'border-accent' : 'border-border-strong')} aria-hidden="true">
                  {on && <span className="size-[9px] rounded-full bg-accent" />}
                </span>
                <span className={cn(on && 'font-semibold text-accent', t.id === 'sale' && !on && 'text-accent')}>{t.label}</span>
              </label>
            );
          })}
        </div>
      </FilterGroup>
      <FilterGroup title="Category" bodyGap="mt-[10px]" bottom="pb-[14px]">
        <ul className="flex flex-col lg:gap-[6px]">
          {PRODUCT_TYPES.map((t) => {
            const on = explore.types.includes(t);
            return (
              <li key={t}>
                <button type="button" role="checkbox" aria-checked={on} onClick={() => setTypes(t)} className="flex min-h-11 w-full items-center gap-[14px] text-left text-[15px] text-text transition-colors hover:text-accent lg:min-h-7">
                  <CheckMark on={on} />
                  {typeLabel(t)}
                </button>
              </li>
            );
          })}
        </ul>
      </FilterGroup>
      <FilterGroup title="Size" bodyGap="mt-[7.1px]" bottom="pb-[16.1px]">
        <div className="flex flex-col gap-[9.6px] pl-[1.1px]">
          {SIZE_GROUPS.map((g) => (
            <div key={g.label} role="group" aria-label={`${g.label} sizes`}>
              <p className="text-[12.5px] font-medium text-text-muted" aria-hidden="true">{g.label}</p>
              <div className="mt-[6.3px] flex flex-wrap gap-[6px] lg:gap-x-[5px] lg:gap-y-[4.2px]">
                {g.sizes.map((s) => {
                  const on = explore.sizes.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setSize(s)}
                      className={cn(
                        'inline-flex h-11 min-w-11 items-center justify-center rounded-pill border border-border-strong bg-bg px-[10px] text-[13px] font-medium text-text transition-colors hover:border-text lg:h-[28px] lg:min-w-[34px] lg:px-[9px]',
                        on && 'border-action bg-action text-action-text',
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Colour" bodyGap="mt-[10.2px]" bottom="pb-[16.7px]">
        <div className="-ml-[2.1px] grid grid-cols-[repeat(auto-fill,52px)] gap-y-[9.2px] lg:grid-cols-[repeat(4,48px)]">
          {COLOR_FAMILIES.map((c) => {
            const on = explore.colors.includes(c.id);
            return (
              <button key={c.id} type="button" aria-pressed={on} onClick={() => setColor(c.id)} className="group flex min-h-11 flex-col items-center gap-[4.8px] text-[12px] text-text">
                <span className={cn('relative block size-[25.8px] rounded-full ring-offset-2 ring-offset-bg-alt transition-shadow group-hover:ring-1 group-hover:ring-border-strong', on && 'ring-2 ring-text group-hover:ring-2 group-hover:ring-text')} aria-hidden="true">
                  <img src={`/figma/explore/swatch-${c.id}.svg`} alt="" className="absolute inset-0 block size-full max-w-none" />
                  {on && <Check size={13} strokeWidth={3} className={cn('absolute inset-0 m-auto', c.id === 'white' || c.id === 'neutral' ? 'text-text' : 'text-text-inverse')} />}
                </span>
                <span className="w-full truncate text-center">{c.label}</span>
              </button>
            );
          })}
        </div>
      </FilterGroup>
      <FilterGroup title="Price" last bodyGap="mt-[10px]" bottom="">
        <div className="flex flex-col pl-[3.8px] lg:gap-[6px]">
          {PRICE_BANDS.map((b) => {
            const on = explore.prices.includes(b.id);
            return (
              <button key={b.id} type="button" role="checkbox" aria-checked={on} onClick={() => setPrice(b.id)} className="flex min-h-11 items-center gap-[14px] text-left text-[15px] text-text transition-colors hover:text-accent lg:min-h-7">
                <CheckMark on={on} />
                {b.label}
              </button>
            );
          })}
        </div>
      </FilterGroup>
    </div>
  );
}

function FilterSheet({ open, onClose, resultCount }: { open: boolean; onClose: () => void; resultCount: number }) {
  const { explore, setExplore } = useShop();
  const ref = useRef<HTMLDivElement>(null);
  useLockBodyScroll(open);
  useDialog(ref, open, onClose);
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <motion.div className="absolute inset-0 bg-text/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby="filters-title"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: DUR.drawer, ease: EASE }}
            className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-[var(--radius-modal)] bg-bg shadow-[var(--shadow-pop)]"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <h3 id="filters-title" className="font-display text-2xl font-semibold text-text">Filters</h3>
              <button type="button" className="icon-btn -mr-2" onClick={onClose} aria-label="Close filters"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4"><FilterPanel idPrefix="sheet" /></div>
            <div className="grid grid-cols-2 gap-3 border-t border-border p-4">
              <button type="button" className="btn btn-line px-3" onClick={() => setExplore(cleared(explore))}>Clear all</button>
              <button type="button" className="btn btn-dark px-3" onClick={onClose}>Show {resultCount} {resultCount === 1 ? 'product' : 'products'}</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
