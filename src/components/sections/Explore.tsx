import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown, SearchX, SlidersHorizontal, X } from 'lucide-react';
import type { ColorFamily, PriceBand, ProductType, SortKey } from '../../types';
import {
  COLLECTIONS, COLOR_FAMILIES, DEFAULT_EXPLORE, PRICE_BANDS, PRODUCT_TYPES, SIZE_GROUPS, SORTS, TABS,
  activeFilterCount, applyExplore,
} from '../../lib/catalog';
import { cn } from '../../lib/utils';
import { DUR, EASE } from '../../lib/motion';
import { useDialog, useLockBodyScroll } from '../../hooks/useOverlay';
import { useShop } from '../../store/ShopProvider';
import { GridItem, ProductCardSkeleton } from '../product/ProductCard';
import { SectionHeader } from '../product/bits';

const PAGE = 8;
const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

/** 05. Explore products: tabs, filters, sorting and an animated grid. */
export function Explore() {
  const { explore, setExplore } = useShop();
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(PAGE);
  const [sheet, setSheet] = useState(false);
  const results = useMemo(() => applyExplore(explore), [explore]);
  const count = activeFilterCount(explore);

  // Simulated first load so the skeleton state is visible, like a real store fetching products.
  useEffect(() => { const t = window.setTimeout(() => setLoading(false), 700); return () => window.clearTimeout(t); }, []);
  useEffect(() => { setVisible(PAGE); }, [explore]);

  const reset = () => setExplore({ ...DEFAULT_EXPLORE, tab: explore.tab, sort: explore.sort });
  const shown = results.slice(0, visible);

  return (
    <section id="shop" className="scroll-mt-20 bg-white py-20 md:py-28" aria-labelledby="shop-title">
      <div className="container-x">
        <SectionHeader eyebrow="Explore products" title="Shop the edit" id="shop-title" intro="Filter by fit, size, colour and price. Everything updates instantly." />

        {/* Tabs */}
        <div className="no-scrollbar -mx-4 mb-6 flex gap-1 overflow-x-auto px-4 md:mx-0 md:px-0" role="tablist" aria-label="Product groups">
          {TABS.map((t) => {
            const on = explore.tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setExplore({ tab: t.id })}
                className={cn('relative h-11 shrink-0 rounded-full px-5 text-sm font-semibold transition-colors duration-200', on ? 'text-white' : 'text-ink-2 hover:text-ink')}
              >
                {on && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ duration: DUR.filter, ease: EASE }} />}
                <span className="relative">{t.label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block" aria-label="Filters">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 no-scrollbar">
              <FilterPanel />
            </div>
          </aside>

          <div>
            {/* Toolbar */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <button type="button" className="chip lg:hidden" onClick={() => setSheet(true)}>
                <SlidersHorizontal size={15} /> Filters {count > 0 && <span className="grid size-5 place-items-center rounded-full bg-electric text-[11px] text-white">{count}</span>}
              </button>
              <p className="text-sm text-muted" aria-live="polite">
                <span className="font-semibold text-ink">{results.length}</span> {results.length === 1 ? 'product' : 'products'}
              </p>
              <SortSelect value={explore.sort} onChange={(sort) => setExplore({ sort })} />
            </div>

            <ActiveChips />

            {loading ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : results.length === 0 ? (
              <EmptyState onReset={reset} query={explore.query} />
            ) : (
              <>
                <motion.div layout className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {shown.map((p, i) => <GridItem key={p.id} product={p} index={i} />)}
                  </AnimatePresence>
                </motion.div>
                {results.length > visible && (
                  <div className="mt-12 flex flex-col items-center gap-3">
                    <p className="text-sm text-muted">Showing {shown.length} of {results.length}</p>
                    <div className="h-1 w-48 overflow-hidden rounded-full bg-line"><div className="h-full bg-ink transition-[width] duration-300" style={{ width: `${(shown.length / results.length) * 100}%` }} /></div>
                    <button type="button" className="btn btn-line mt-2" onClick={() => setVisible((v) => v + PAGE)}>Load more</button>
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
  return (
    <label className="relative ml-auto inline-flex items-center">
      <span className="sr-only">Sort products</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="h-10 appearance-none rounded-full border border-line bg-white pl-4 pr-10 text-sm font-medium text-ink outline-none hover:border-ink/40 focus-visible:border-electric"
      >
        {SORTS.map((s) => <option key={s.id} value={s.id}>Sort: {s.label}</option>)}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-3.5 text-muted" />
    </label>
  );
}

function ActiveChips() {
  const { explore, setExplore } = useShop();
  const chips: { label: string; remove: () => void }[] = [];
  if (explore.query.trim()) chips.push({ label: `“${explore.query}”`, remove: () => setExplore({ query: '' }) });
  if (explore.collection) chips.push({ label: COLLECTIONS[explore.collection] ?? explore.collection, remove: () => setExplore({ collection: null }) });
  explore.types.forEach((t) => chips.push({ label: t, remove: () => setExplore({ types: explore.types.filter((x) => x !== t) }) }));
  explore.sizes.forEach((s) => chips.push({ label: `Size ${s}`, remove: () => setExplore({ sizes: explore.sizes.filter((x) => x !== s) }) }));
  explore.colors.forEach((c) => chips.push({ label: COLOR_FAMILIES.find((f) => f.id === c)?.label ?? c, remove: () => setExplore({ colors: explore.colors.filter((x) => x !== c) }) }));
  explore.prices.forEach((p) => chips.push({ label: PRICE_BANDS.find((b) => b.id === p)?.label ?? p, remove: () => setExplore({ prices: explore.prices.filter((x) => x !== p) }) }));
  if (!chips.length) return null;
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <button key={c.label} type="button" onClick={c.remove} className="chip border-lav-200 bg-lav-50 pr-2.5" aria-label={`Remove filter ${c.label}`}>
          {c.label} <X size={14} />
        </button>
      ))}
      <button type="button" onClick={() => setExplore({ ...DEFAULT_EXPLORE, tab: explore.tab, sort: explore.sort })} className="ml-1 text-sm font-semibold underline underline-offset-4 hover:text-electric">
        Clear all
      </button>
    </div>
  );
}

function EmptyState({ onReset, query }: { onReset: () => void; query: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center rounded-3xl border border-dashed border-lav-300 bg-lav-50 px-6 py-16 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-white text-electric"><SearchX size={26} /></span>
      <h3 className="display mt-5 text-2xl">No products match</h3>
      <p className="mt-2 max-w-sm text-sm text-muted">
        {query ? `Nothing matches “${query}” with these filters.` : 'Try removing a filter or two.'} Reset to see everything in this group.
      </p>
      <button type="button" onClick={onReset} className="btn btn-dark mt-6">Reset filters</button>
    </motion.div>
  );
}

function FilterGroup({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line py-4">
      <button type="button" className="flex w-full items-center justify-between text-sm font-semibold" aria-expanded={open} onClick={() => setOpen(!open)}>
        {title}
        <ChevronDown size={16} className={cn('transition-transform duration-200', open && 'rotate-180')} />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

/** Size, colour, category and price filters. Shared by the desktop sidebar and the mobile sheet. */
function FilterPanel() {
  const { explore, setExplore } = useShop();
  const setTypes = (t: ProductType) => setExplore({ types: toggle(explore.types, t) });
  const setSize = (s: string) => setExplore({ sizes: toggle(explore.sizes, s) });
  const setColor = (c: ColorFamily) => setExplore({ colors: toggle(explore.colors, c) });
  const setPrice = (p: PriceBand) => setExplore({ prices: toggle(explore.prices, p) });

  return (
    <div>
      <FilterGroup title="Category">
        <ul className="space-y-1">
          {PRODUCT_TYPES.map((t) => {
            const on = explore.types.includes(t);
            return (
              <li key={t}>
                <button type="button" role="checkbox" aria-checked={on} onClick={() => setTypes(t)} className="flex w-full items-center gap-3 rounded-lg py-1.5 text-left text-sm text-ink-2 hover:text-ink">
                  <span className={cn('grid size-[18px] place-items-center rounded-[5px] border transition-colors', on ? 'border-ink bg-ink text-white' : 'border-ink/25')}>{on && <Check size={12} strokeWidth={3} />}</span>
                  {t}
                </button>
              </li>
            );
          })}
        </ul>
      </FilterGroup>
      <FilterGroup title="Size">
        <div className="space-y-3">
          {SIZE_GROUPS.map((g) => (
            <div key={g.label}>
              <p className="mb-1.5 text-xs text-muted">{g.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {g.sizes.map((s) => (
                  <button key={s} type="button" aria-pressed={explore.sizes.includes(s)} onClick={() => setSize(s)} className="chip h-8 min-w-10 justify-center px-2.5 text-xs">{s}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Colour">
        <div className="grid grid-cols-4 gap-2">
          {COLOR_FAMILIES.map((c) => {
            const on = explore.colors.includes(c.id);
            return (
              <button key={c.id} type="button" aria-pressed={on} onClick={() => setColor(c.id)} className="flex flex-col items-center gap-1 text-[11px] text-ink-2" title={c.label}>
                <span className={cn('grid size-8 place-items-center rounded-full border border-black/10 ring-offset-2 transition-shadow', on && 'ring-2 ring-ink')} style={{ background: c.swatch }}>
                  {on && <Check size={14} strokeWidth={3} className={c.id === 'white' || c.id === 'neutral' ? 'text-ink' : 'text-white'} />}
                </span>
                {c.label}
              </button>
            );
          })}
        </div>
      </FilterGroup>
      <FilterGroup title="Price">
        <div className="flex flex-col gap-1.5">
          {PRICE_BANDS.map((b) => (
            <button key={b.id} type="button" aria-pressed={explore.prices.includes(b.id)} onClick={() => setPrice(b.id)} className="chip justify-start">{b.label}</button>
          ))}
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
          <motion.div className="absolute inset-0 bg-ink/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: DUR.drawer, ease: EASE }}
            className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-3xl bg-white"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button type="button" className="icon-btn -mr-2" onClick={onClose} aria-label="Close filters"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5"><FilterPanel /></div>
            <div className="grid grid-cols-2 gap-3 border-t border-line p-4">
              <button type="button" className="btn btn-line" onClick={() => setExplore({ ...DEFAULT_EXPLORE, tab: explore.tab, sort: explore.sort })}>Clear all</button>
              <button type="button" className="btn btn-dark" onClick={onClose}>Show {resultCount} {resultCount === 1 ? 'product' : 'products'}</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
