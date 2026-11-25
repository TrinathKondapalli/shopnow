import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
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

const PAGE = 8;
const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
const icon = (name: string) => ({ '--icon': `url(/figma/explore/${name}.svg)` } as CSSProperties);

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

/** 03. Explore products: tabs, filters, sorting and an animated grid (Figma 111:311). */
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
    <section id="shop" className="relative scroll-mt-20 overflow-hidden bg-[#FCF3ED] leading-[normal]" aria-labelledby="shop-title">
      <div className="relative mx-auto max-w-[1648px] px-5 pb-16 pt-12 md:px-10 md:pt-16 lg:pt-[17.8px] xl:pb-[27.9px] xl:pl-[80px] xl:pr-[62px]">
        {/* Decoration / Concrete: 510.7 x 279 at the top-right of the frame */}
        <img
          src="/figma/explore/decoration-concrete.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 hidden h-[279px] w-[510.7px] max-w-none object-cover xl:block"
        />

        {/* Section Header */}
        <div className="relative">
          <div className="flex items-center gap-[14px]">
            <span className="h-[2.2px] w-[30px] shrink-0 bg-electric-alt" aria-hidden="true" />
            <p className="text-[14px] font-semibold uppercase tracking-[0.114em] text-electric-alt md:text-[16px]">Explore products</p>
          </div>
          <h2 id="shop-title" className="-mt-[1px] text-[clamp(2.75rem,5.5vw,76.5px)] font-bold leading-[1.21] tracking-[-0.028em] text-ink lg:-mt-[2.9px]">
            Shop the <span className="font-bold italic text-electric-alt">edit.</span>
          </h2>
          <p className="mt-[2px] text-[16px] tracking-[-0.0875px] text-[#504D4F] md:text-[17.5px]">
            Filter by fit, size, colour and price. Everything updates instantly.
          </p>
        </div>

        {/* Tabs + divider */}
        <div
          className="no-scrollbar relative -mx-5 mt-[22.6px] flex items-center gap-[3px] overflow-x-auto border-b border-[#E4DAD7] px-5 pb-[7.5px] md:mx-0 md:px-0"
          role="tablist"
          aria-label="Product groups"
        >
          {TABS.map((t) => {
            const on = explore.tab === t.id;
            const isSale = t.id === 'sale';
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setExplore({ tab: t.id })}
                className={cn(
                  'h-[36.5px] shrink-0 rounded-[100px] px-[22.6px] text-[15.5px] tracking-[-0.0775px] transition-colors duration-150',
                  on
                    ? 'bg-ink font-medium text-white'
                    : isSale
                      ? 'font-semibold text-electric-alt hover:bg-black/5'
                      : 'font-medium text-ink hover:bg-black/5 hover:text-electric-alt',
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="relative grid gap-x-[46.2px] lg:grid-cols-[220.4px_1fr]">
          <aside className="hidden lg:block" aria-label="Filters">
            <div className="no-scrollbar sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pl-[2.6px] pt-[27.2px]">
              <FilterPanel />
            </div>
          </aside>

          <div className="min-w-0 pt-5 lg:pt-[16.2px]">
            {/* Toolbar */}
            <div className="mb-[17px] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button type="button" className="chip lg:hidden" onClick={() => setSheet(true)}>
                  <SlidersHorizontal size={15} /> Filters {count > 0 && <span className="grid size-5 place-items-center rounded-full bg-electric-alt text-[11px] text-white">{count}</span>}
                </button>
                <p className="pl-px text-[15px] text-ink" aria-live="polite">
                  <span className="font-semibold">{results.length}</span> {results.length === 1 ? 'product' : 'products'}
                </p>
              </div>
              <SortSelect value={explore.sort} onChange={(sort) => setExplore({ sort })} />
            </div>

            <ActiveChips />

            {loading ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-[22.5px] sm:gap-x-4 md:grid-cols-3 xl:grid-cols-4 xl:gap-x-[16.5px]">
                {Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : results.length === 0 ? (
              <EmptyState onReset={reset} query={explore.query} />
            ) : (
              <>
                <motion.div layout className="grid grid-cols-2 gap-x-3 gap-y-[22.5px] sm:gap-x-4 md:grid-cols-3 xl:grid-cols-4 xl:gap-x-[16.5px]">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {shown.map((p, i) => <GridItem key={p.id} product={p} index={i} />)}
                  </AnimatePresence>
                </motion.div>
                {results.length > visible && (
                  <div className="mt-8 flex flex-col items-center gap-4 sm:mt-[21.5px] sm:flex-row sm:justify-center sm:gap-0 xl:pr-[38px]">
                    <p className="text-[15px] text-ink">Showing {shown.length} of {results.length}</p>
                    <div className="h-[4.3px] w-[208.1px] overflow-hidden rounded-[4px] bg-[#DDD6D3] sm:ml-[30px]">
                      <div className="h-full rounded-[4px] bg-ink transition-[width] duration-300" style={{ width: `${(shown.length / results.length) * 100}%` }} />
                    </div>
                    <button
                      type="button"
                      className="group flex h-[45.1px] w-[168.4px] items-center justify-center gap-[14px] rounded-[1px] bg-ink text-[16.5px] font-semibold text-white transition-colors hover:bg-ink-hover sm:ml-[48.3px]"
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
          'inline-flex h-[38px] items-center gap-2 rounded-full border bg-white px-4 text-[14px] font-semibold text-ink shadow-sm transition-all duration-150',
          open ? 'border-ink ring-2 ring-purple-bright/20' : 'border-[#D5CEC9] hover:border-ink hover:shadow',
        )}
      >
        <span className="text-muted font-normal">Sort:</span>
        <span className="font-semibold text-ink">{current.label}</span>
        <ChevronDown
          size={15}
          className={cn('text-ink transition-transform duration-200', open && 'rotate-180')}
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
            className="absolute right-0 top-full mt-2 z-30 min-w-[210px] overflow-hidden rounded-2xl border border-line bg-white p-1.5 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.15)]"
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
                    'flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-[14px] font-medium transition-colors',
                    active ? 'bg-lav-50 font-semibold text-purple' : 'text-ink hover:bg-black/5',
                  )}
                >
                  <span>{s.label}</span>
                  {active && <Check size={15} className="text-purple" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
    <div className="mb-[17px] flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <button key={c.label} type="button" onClick={c.remove} className="inline-flex h-[25.8px] items-center gap-1.5 rounded-[100px] border border-[#CFC8C5] bg-white px-[9px] text-[13px] font-medium text-ink hover:border-ink" aria-label={`Remove filter ${c.label}`}>
          {c.label} <X size={13} />
        </button>
      ))}
      <button type="button" onClick={() => setExplore({ ...DEFAULT_EXPLORE, tab: explore.tab, sort: explore.sort })} className="ml-1 text-[13px] font-semibold underline underline-offset-4 hover:text-electric-alt">
        Clear all
      </button>
    </div>
  );
}

function EmptyState({ onReset, query }: { onReset: () => void; query: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center rounded-[3px] border border-dashed border-[#CFC8C5] bg-white/60 px-6 py-16 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-white text-electric-alt shadow-sm"><SearchX size={26} /></span>
      <h3 className="mt-5 text-2xl font-bold text-ink">No products match</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#716F73]">
        {query ? `Nothing matches “${query}” with these filters.` : 'Try removing a filter or two.'} Reset to see everything in this group.
      </p>
      <button type="button" onClick={onReset} className="btn btn-dark mt-6">Reset filters</button>
    </motion.div>
  );
}

/**
 * Collapsible filter group. Figma spacing: header 17px/600, `bodyGap` to the content,
 * `bottom` to the 1.3px divider, ~9.6px from a divider to the next header.
 */
function FilterGroup({
  title, children, defaultOpen = true, bodyGap, bottom, first, last,
}: { title: string; children: ReactNode; defaultOpen?: boolean; bodyGap: string; bottom: string; first?: boolean; last?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cn(!first && 'pt-[9.6px]', !last && 'border-b-[1.3px] border-[#E4DAD7]', open ? !last && bottom : 'pb-[10px]')}>
      <button
        type="button"
        className="flex w-full items-center justify-between text-left text-[17px] font-semibold tracking-[-0.085px] text-ink transition-colors hover:text-electric-alt"
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

/** Size, colour, category and price filters. Shared by the desktop sidebar and the mobile sheet. */
function FilterPanel() {
  const { explore, setExplore } = useShop();
  const setTypes = (t: ProductType) => setExplore({ types: toggle(explore.types, t) });
  const setSize = (s: string) => setExplore({ sizes: toggle(explore.sizes, s) });
  const setColor = (c: ColorFamily) => setExplore({ colors: toggle(explore.colors, c) });
  const setPrice = (p: PriceBand) => setExplore({ prices: toggle(explore.prices, p) });

  return (
    <div className="leading-[normal] lg:w-[217.8px]">
      <FilterGroup title="Category" first bodyGap="mt-[17.3px]" bottom="pb-[18.7px]">
        <ul className="flex flex-col gap-[12.6px]">
          {PRODUCT_TYPES.map((t) => {
            const on = explore.types.includes(t);
            return (
              <li key={t}>
                <button type="button" role="checkbox" aria-checked={on} onClick={() => setTypes(t)} className="flex w-full items-center gap-[17.1px] text-left text-[15px] text-ink transition-colors hover:text-electric-alt">
                  <span className={cn('grid size-[17.2px] shrink-0 place-items-center rounded-[2.5px] border-[1.3px] border-[#9E9A9A] bg-white text-white transition-colors', on && 'border-ink bg-ink')}>
                    {on && <Check size={12} strokeWidth={3} />}
                  </span>
                  {t}
                </button>
              </li>
            );
          })}
        </ul>
      </FilterGroup>
      <FilterGroup title="Size" bodyGap="mt-[7.1px]" bottom="pb-[16.1px]">
        <div className="flex flex-col gap-[9.6px] pl-[1.1px]">
          {SIZE_GROUPS.map((g) => (
            <div key={g.label}>
              <p className="text-[12.5px] text-ink">{g.label}</p>
              <div className="mt-[6.3px] flex flex-wrap gap-x-[5px] gap-y-[4.2px]">
                {g.sizes.map((s) => {
                  const on = explore.sizes.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setSize(s)}
                      className={cn(
                        'inline-flex h-[25.8px] items-center rounded-[100px] border border-[#CFC8C5] bg-white px-[9px] text-[13px] font-medium text-ink transition-colors hover:border-ink',
                        on && 'border-ink bg-ink text-white',
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
        <div className="-ml-[2.1px] grid grid-cols-[repeat(4,55.8px)] gap-y-[9.2px]">
          {COLOR_FAMILIES.map((c) => {
            const on = explore.colors.includes(c.id);
            return (
              <button key={c.id} type="button" aria-pressed={on} onClick={() => setColor(c.id)} className="group flex flex-col items-center gap-[4.8px] text-[11.5px] text-ink" title={c.label}>
                <span className={cn('relative block size-[25.8px] rounded-full ring-offset-2 ring-offset-[#FCF3ED] transition-shadow group-hover:ring-1 group-hover:ring-[#CFC8C5]', on && 'ring-2 ring-ink group-hover:ring-2 group-hover:ring-ink')}>
                  <img src={`/figma/explore/swatch-${c.id}.svg`} alt="" className="absolute inset-0 block size-full max-w-none" />
                  {on && <Check size={13} strokeWidth={3} className={cn('absolute inset-0 m-auto', c.id === 'white' || c.id === 'neutral' ? 'text-ink' : 'text-white')} />}
                </span>
                <span className="w-full truncate text-center">{c.label}</span>
              </button>
            );
          })}
        </div>
      </FilterGroup>
      <FilterGroup title="Price" last bodyGap="mt-[18.4px]" bottom="">
        <div className="flex flex-col gap-[14.5px] pl-[3.8px]">
          {PRICE_BANDS.map((b) => {
            const on = explore.prices.includes(b.id);
            return (
              <button key={b.id} type="button" role="checkbox" aria-checked={on} onClick={() => setPrice(b.id)} className="flex items-center gap-[14.5px] text-left text-[15px] text-ink transition-colors hover:text-electric-alt">
                <span className="relative block size-[18.2px] shrink-0">
                  <img src={on ? '/figma/explore/radio-under-1000.svg' : '/figma/explore/radio.svg'} alt="" className="absolute inset-0 block size-full max-w-none" />
                  {on && <img src="/figma/explore/radio-selected.svg" alt="" className="absolute left-[4.55px] top-[4.55px] block size-[9.1px] max-w-none" />}
                </span>
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
            className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-3xl bg-[#FCF3ED]"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <div className="flex items-center justify-between border-b border-[#E4DAD7] px-5 py-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button type="button" className="icon-btn -mr-2" onClick={onClose} aria-label="Close filters"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5"><FilterPanel /></div>
            <div className="grid grid-cols-2 gap-3 border-t border-[#E4DAD7] p-4">
              <button type="button" className="btn btn-line" onClick={() => setExplore({ ...DEFAULT_EXPLORE, tab: explore.tab, sort: explore.sort })}>Clear all</button>
              <button type="button" className="btn btn-dark" onClick={onClose}>Show {resultCount} {resultCount === 1 ? 'product' : 'products'}</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
