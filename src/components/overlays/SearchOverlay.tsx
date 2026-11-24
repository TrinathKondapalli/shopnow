import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Clock, Search, SearchX, TrendingUp, X } from 'lucide-react';
import { PRODUCTS } from '../../lib/catalog';
import { highlight, searchProducts, suggest } from '../../lib/search';
import { DUR, EASE } from '../../lib/motion';
import { useDialog, useLockBodyScroll } from '../../hooks/useOverlay';
import { useShop } from '../../store/ShopProvider';
import { ProductImage } from '../product/ProductImage';
import { Price } from '../product/bits';

const POPULAR = ['Hoodie', 'Cargo', 'Lavender', 'Sneakers', 'Jacket', 'Denim'];

/** Search overlay: real-time suggestions, recent searches and an empty state. Fade and expand, 250ms. */
export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useShop();
  return (
    <AnimatePresence>
      {searchOpen && <SearchPanel onClose={() => setSearchOpen(false)} />}
    </AnimatePresence>
  );
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches, openQuickView, shopWith } = useShop();
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  useLockBodyScroll(true);
  useDialog(ref, true, onClose, input);

  useEffect(() => { const t = window.setTimeout(() => setDebounced(q), 120); return () => window.clearTimeout(t); }, [q]);

  const results = useMemo(() => (debounced.trim() ? searchProducts(debounced, PRODUCTS) : []), [debounced]);
  const suggestions = useMemo(() => suggest(debounced, PRODUCTS), [debounced]);
  const trending = useMemo(() => [...PRODUCTS].sort((a, b) => b.trending - a.trending).slice(0, 4), []);
  const typing = debounced.trim().length > 0;

  const viewAll = (term: string) => {
    const t = term.trim();
    if (!t) return;
    addRecentSearch(t);
    onClose();
    shopWith({ query: t });
  };
  const openProduct = (id: string) => {
    if (q.trim()) addRecentSearch(q);
    onClose();
    openQuickView(id);
  };
  const onSubmit = (e: FormEvent) => { e.preventDefault(); viewAll(q); };

  return (
    <div className="fixed inset-0 z-[80]">
      <motion.div className="absolute inset-0 bg-ink/45 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: DUR.search }} onClick={onClose} />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
        className="absolute inset-x-0 top-0 max-h-[92vh] overflow-y-auto rounded-b-[28px] bg-white shadow-[var(--shadow-pop)]"
        style={{ paddingTop: 'env(safe-area-inset-top)', transformOrigin: 'top center' }}
        initial={{ opacity: 0, scaleY: 0.92, y: -16 }}
        animate={{ opacity: 1, scaleY: 1, y: 0 }}
        exit={{ opacity: 0, scaleY: 0.96, y: -12 }}
        transition={{ duration: DUR.search, ease: EASE }}
      >
        <div className="container-x py-5 md:py-8">
          <form onSubmit={onSubmit} className="flex items-center gap-3 border-b-2 border-ink pb-3" role="search">
            <Search size={24} className="shrink-0" />
            <input
              ref={input}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search hoodies, cargos, lavender…"
              className="display h-12 min-w-0 flex-1 bg-transparent text-[clamp(1.4rem,4vw,2.4rem)] outline-none placeholder:text-ink/25"
              aria-label="Search products"
              autoComplete="off"
              enterKeyHint="search"
            />
            {q && <button type="button" onClick={() => { setQ(''); input.current?.focus(); }} className="text-sm font-semibold text-muted hover:text-ink">Clear</button>}
            <button type="button" onClick={onClose} className="icon-btn -mr-2" aria-label="Close search"><X size={22} /></button>
          </form>

          <div className="mt-6 min-h-[200px]" aria-live="polite">
            {!typing ? (
              <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
                <div className="space-y-7">
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Recent searches</p>
                        <button type="button" onClick={clearRecentSearches} className="text-xs font-semibold underline underline-offset-4">Clear</button>
                      </div>
                      <ul className="space-y-1">
                        {recentSearches.map((s) => (
                          <li key={s} className="group flex items-center justify-between rounded-xl px-2 py-1.5 hover:bg-lav-50">
                            <button type="button" onClick={() => viewAll(s)} className="flex flex-1 items-center gap-3 text-left text-[15px]"><Clock size={16} className="text-muted" />{s}</button>
                            <button type="button" onClick={() => removeRecentSearch(s)} aria-label={`Remove ${s} from recent searches`} className="grid size-7 place-items-center rounded-full text-muted hover:bg-white hover:text-ink"><X size={14} /></button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Popular searches</p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR.map((s) => <button key={s} type="button" className="chip" onClick={() => setQ(s)}><TrendingUp size={14} /> {s}</button>)}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Trending now</p>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {trending.map((p) => (
                      <button key={p.id} type="button" onClick={() => openProduct(p.id)} className="group text-left">
                        <div className="aspect-square overflow-hidden rounded-2xl art-bg"><ProductImage product={p} className="transition-transform duration-300 group-hover:scale-105" /></div>
                        <p className="mt-2 truncate text-sm font-semibold">{p.name}</p>
                        <Price product={p} className="text-xs" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <span className="grid size-14 place-items-center rounded-full bg-lav-100 text-electric"><SearchX size={26} /></span>
                <p className="display mt-4 text-2xl">No results for “{debounced}”</p>
                <p className="mt-2 text-sm text-muted">Check the spelling or try one of these.</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {POPULAR.slice(0, 4).map((s) => <button key={s} type="button" className="chip" onClick={() => setQ(s)}>{s}</button>)}
                </div>
                <button type="button" onClick={() => { setQ(''); input.current?.focus(); }} className="btn btn-dark mt-6">Reset search</button>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Suggestions</p>
                  <ul className="space-y-0.5">
                    {suggestions.map((s) => (
                      <li key={s}>
                        <button type="button" onClick={() => viewAll(s)} className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-[15px] hover:bg-lav-50">
                          <Search size={15} className="text-muted" />
                          <span>{highlight(s, debounced).map((part, i) => part.hit ? <mark key={i} className="bg-transparent font-bold text-ink">{part.text}</mark> : <span key={i} className="text-ink-2">{part.text}</span>)}</span>
                        </button>
                      </li>
                    ))}
                    {suggestions.length === 0 && <li className="px-2 text-sm text-muted">Keep typing for suggestions</li>}
                  </ul>
                </div>
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">{results.length} {results.length === 1 ? 'product' : 'products'}</p>
                    <button type="button" onClick={() => viewAll(debounced)} className="inline-flex items-center gap-1 text-sm font-semibold hover:text-electric">View all results <ArrowRight size={15} /></button>
                  </div>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {results.slice(0, 6).map((p) => (
                      <li key={p.id}>
                        <button type="button" onClick={() => openProduct(p.id)} className="flex w-full items-center gap-3 rounded-2xl p-2 text-left hover:bg-lav-50">
                          <span className="size-16 shrink-0 overflow-hidden rounded-xl art-bg"><ProductImage product={p} inset="p-1.5" /></span>
                          <span className="min-w-0">
                            <span className="block truncate text-[15px] font-semibold">{highlight(p.name, debounced).map((part, i) => part.hit ? <mark key={i} className="rounded bg-lav-200 text-ink">{part.text}</mark> : <span key={i}>{part.text}</span>)}</span>
                            <span className="block text-xs text-muted">{p.type} · {p.colors.length} colours</span>
                            <Price product={p} className="text-sm" />
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
