import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ChevronDown, Gift, Heart, Menu, Search, ShoppingCart, SearchX } from 'lucide-react';
import type { ExploreState, Product } from '../../types';
import { NAV_EXTRAS, NAV_GROUPS, PRODUCTS, getProduct, typeLabel } from '../../lib/catalog';
import type { NavGroup } from '../../lib/catalog';
import { searchProducts } from '../../lib/search';
import { AFFILIATE_PATH, linkHandler, navigate } from '../../lib/router';
import { cn } from '../../lib/utils';
import { DUR, EASE } from '../../lib/motion';
import { useShop } from '../../store/ShopProvider';
import { ProductImage } from '../product/ProductImage';
import { BrandMark } from './BrandLogo';

type MenuId = 'categories' | 'men' | 'women';

/** Featured product shown beside the Men and Women dropdown links. */
const FEATURE: Record<'men' | 'women', { productId: string; title: string; text: string; patch: Partial<ExploreState> }> = {
  men: { productId: 'mens-cotton-kurta', title: 'Men\'s Cotton Kurta', text: 'Pure combed cotton with mandarin collar.', patch: { tab: 'men', types: ['Kurtas'] } },
  women: { productId: 'anarkali-kurti', title: 'Anarkali Kurti', text: 'Graceful flared silhouette with zari work.', patch: { tab: 'women', types: ['Kurtis'] } },
};

const PANEL_ID = 'nav-panel';

export function Navbar() {
  const { shopWith, openPanel, setMobileMenuOpen, totals, wishlist } = useShop();
  const [open, setOpen] = useState<MenuId | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const barRef = useRef<HTMLDivElement>(null);
  const triggers = useRef<Partial<Record<MenuId, HTMLButtonElement | null>>>({});
  const focusFirst = useRef(false);

  const openMenu = (id: MenuId) => { window.clearTimeout(closeTimer.current); setOpen(id); };
  const scheduleClose = () => { window.clearTimeout(closeTimer.current); closeTimer.current = window.setTimeout(() => setOpen(null), 140); };
  const toggle = (id: MenuId, e: React.MouseEvent) => {
    // e.detail === 0 means the click came from the keyboard (Enter / Space): move focus into the panel.
    focusFirst.current = e.detail === 0;
    setOpen((o) => (o === id ? null : id));
  };
  const pick = (patch: Partial<ExploreState>) => { setOpen(null); shopWith(patch); };

  useEffect(() => {
    if (!open) return;
    if (focusFirst.current) {
      focusFirst.current = false;
      window.requestAnimationFrame(() => document.getElementById(PANEL_ID)?.querySelector<HTMLElement>('a, button')?.focus());
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const trigger = triggers.current[open];
      setOpen(null);
      if (barRef.current?.contains(document.activeElement)) trigger?.focus();
    };
    const onDown = (e: PointerEvent) => { if (!barRef.current?.contains(e.target as Node)) setOpen(null); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown); };
  }, [open]);

  const goHome = (e: React.MouseEvent) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (window.location.pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
    else navigate('/');
  };

  const panel = (id: MenuId) => (
    <AnimatePresence>
      {open === id && (
        <motion.div
          id={PANEL_ID}
          key={id}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: DUR.dropdown, ease: EASE }}
          onMouseEnter={() => window.clearTimeout(closeTimer.current)}
          className="absolute inset-x-0 top-full pt-2 text-text"
        >
          <div className="container-x">
            <div className="overflow-hidden rounded-[var(--radius-modal)] border border-border bg-bg shadow-[var(--shadow-pop)]">
              {id === 'categories' ? (
                <div className="grid grid-cols-2 gap-10 p-8 xl:p-10">
                  {NAV_GROUPS.map((g) => <GroupColumn key={g.id} group={g} onPick={pick} />)}
                </div>
              ) : (
                <GroupPanel group={NAV_GROUPS.find((g) => g.id === id)!} onPick={pick} />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Main row: menu (mobile), logo, search (desktop), earn with us, wishlist, cart. Sticky. */}
      <header className="sticky top-0 z-40 border-b border-border bg-bg/95 backdrop-blur-md">
        <div className="container-x flex h-16 items-center gap-2 sm:gap-5 lg:h-[104px] lg:gap-8">
          <button
            type="button"
            className="-ml-2 grid size-11 shrink-0 place-items-center rounded-full text-text transition-colors hover:bg-bg-alt hover:text-accent lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} aria-hidden="true" />
          </button>

          <a
            href="/"
            onClick={goHome}
            className="flex min-w-0 shrink-0 items-center gap-2.5 select-none lg:gap-3.5"
            aria-label="SHOPNOW home"
          >
            <BrandMark className="size-9 shrink-0 sm:size-10 lg:size-[68px]" />
            <span className="flex flex-col">
              <span className="font-display text-[24px] font-bold leading-none tracking-[-0.02em] sm:text-[28px] lg:text-[46px]">
                <span className="text-text">SHOP</span><span className="text-accent">NOW</span>
              </span>
              <span className="mt-1 hidden text-[13px] font-semibold italic leading-none tracking-[-0.01em] text-text-muted sm:block lg:mt-1.5 lg:text-[15px]">
                Style your everyday.
              </span>
            </span>
          </a>

          {/* Search: inline from md up; below md it is the full-width row under the header. */}
          <SearchField className="mx-auto hidden max-w-[620px] flex-1 md:block" />

          <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-2 lg:gap-5">
            <a
              href={AFFILIATE_PATH}
              onClick={linkHandler(AFFILIATE_PATH)}
              className="hidden h-10 items-center gap-2 whitespace-nowrap rounded-pill bg-accent-soft px-4 text-[15px] font-semibold text-accent transition-colors hover:bg-accent hover:text-text-inverse lg:inline-flex"
            >
              <Gift size={18} strokeWidth={2} aria-hidden="true" />
              Earn with us
            </a>
            <HeaderAction
              label="Wishlist"
              aria={`Wishlist, ${wishlist.length} items`}
              count={wishlist.length}
              onClick={() => openPanel('wishlist')}
              dataAttr={{ 'data-wishlist-target': '' }}
            >
              <Heart size={26} strokeWidth={1.8} aria-hidden="true" />
            </HeaderAction>
            <HeaderAction
              label="Cart"
              aria={`Shopping cart, ${totals.count} items`}
              count={totals.count}
              onClick={() => openPanel('cart')}
              dataAttr={{ 'data-bag-target': '' }}
            >
              <ShoppingCart size={28} strokeWidth={1.8} aria-hidden="true" />
            </HeaderAction>
          </div>
        </div>
      </header>

      {/* Mobile search row (the only search control below md) */}
      <div className="relative z-30 border-b border-border bg-bg px-5 py-3 md:hidden">
        <SearchField />
      </div>

      {/* Category navigation bar (desktop). Each dropdown panel sits right after its trigger in the DOM, so Tab flows into it. */}
      <div ref={barRef} className="relative z-30 hidden border-b border-border bg-bg py-2 lg:block" onMouseLeave={scheduleClose}>
        <div className="container-x">
          <nav className="flex h-[58px] items-center bg-bg px-3 text-text xl:px-5" aria-label="Main">
            <button
              ref={(el) => { triggers.current.categories = el; }}
              type="button"
              aria-expanded={open === 'categories'}
              aria-controls={open === 'categories' ? PANEL_ID : undefined}
              onClick={(e) => toggle('categories', e)}
              onMouseEnter={() => openMenu('categories')}
              className="flex h-11 shrink-0 items-center gap-3 rounded-btn border border-border-strong bg-bg px-4 text-[15px] font-semibold text-text transition-colors hover:bg-bg-alt xl:text-[16px]"
            >
              <Menu size={20} aria-hidden="true" />
              All Categories
              <ChevronDown size={16} className={cn('transition-transform', open === 'categories' && 'rotate-180')} aria-hidden="true" />
            </button>
            {panel('categories')}

            <span className="mx-3 h-7 w-px bg-border xl:mx-5" aria-hidden="true" />

            <ul className="flex flex-1 items-center justify-between gap-1">
              {NAV_GROUPS.map((g) => (
                <li key={g.id}>
                  <NavButton
                    buttonRef={(el) => { triggers.current[g.id] = el; }}
                    expanded={open === g.id}
                    controls={open === g.id ? PANEL_ID : undefined}
                    onClick={(e) => toggle(g.id, e)}
                    onMouseEnter={() => openMenu(g.id)}
                    chevron
                  >
                    {g.label}
                  </NavButton>
                  {panel(g.id)}
                </li>
              ))}
              {NAV_EXTRAS.map((l) => (
                <li key={l.label}>
                  <NavButton onClick={() => pick(l.patch)} onMouseEnter={scheduleClose}>{l.label}</NavButton>
                </li>
              ))}
              <li>
                <a
                  href={AFFILIATE_PATH}
                  onClick={(e) => { setOpen(null); linkHandler(AFFILIATE_PATH)(e); }}
                  onMouseEnter={scheduleClose}
                  className="group relative flex h-11 items-center gap-2 whitespace-nowrap rounded-pill bg-accent-soft px-3.5 text-[15px] font-semibold text-accent transition-colors hover:bg-accent hover:text-text-inverse xl:px-4 xl:text-[16px]"
                >
                  <Gift size={18} strokeWidth={2} aria-hidden="true" />
                  Earn with us
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

function GroupColumn({ group, onPick }: { group: NavGroup; onPick: (p: Partial<ExploreState>) => void }) {
  return (
    <div>
      <p className="eyebrow mb-3">{group.label}</p>
      <ul className="space-y-0.5">
        <li><MenuLink strong onClick={() => onPick({ tab: group.id })}>Shop all {group.label.toLowerCase()}</MenuLink></li>
        {group.links.map((l) => <li key={l.label}><MenuLink onClick={() => onPick(l.patch)}>{l.label}</MenuLink></li>)}
      </ul>
    </div>
  );
}

function GroupPanel({ group, onPick }: { group: NavGroup; onPick: (p: Partial<ExploreState>) => void }) {
  const f = FEATURE[group.id];
  const product = getProduct(f.productId);
  return (
    <div className="grid grid-cols-[1fr_1.3fr] gap-10 p-8 xl:p-10">
      <GroupColumn group={group} onPick={onPick} />
      {product && (
        <button type="button" onClick={() => onPick(f.patch)} className="group grid grid-cols-[150px_1fr] items-center gap-5 overflow-hidden rounded-[var(--radius-card)] bg-bg-alt p-4 text-left">
          <div className="aspect-square overflow-hidden rounded-[var(--radius-btn)] art-bg-alt">
            <ProductImage product={product} className="transition-transform duration-300 group-hover:scale-105" />
          </div>
          <div>
            <p className="eyebrow">Featured</p>
            <p className="display mt-2 text-2xl text-text">{f.title}</p>
            <p className="mt-1 text-sm text-text-muted">{f.text}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">Shop now <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
          </div>
        </button>
      )}
    </div>
  );
}

function MenuLink({ children, onClick, strong }: { children: React.ReactNode; onClick: () => void; strong?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group -mx-2 inline-flex min-h-10 items-center gap-2 rounded-btn px-2 text-[15px] transition-colors hover:text-accent',
        strong ? 'font-semibold text-accent' : 'font-medium text-text',
      )}
    >
      {children}
      <ArrowRight size={14} className="-translate-x-1 opacity-0 transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true" />
    </button>
  );
}

/* ----------------------------------------------------------------------------------------------
 * Search with live suggestions (ARIA combobox + listbox).
 * Two characters show up to 6 products. ArrowUp / ArrowDown move, Enter opens the active product
 * (or applies the query to the grid), Escape closes.
 * -------------------------------------------------------------------------------------------- */

const MIN_CHARS = 2;
const MAX_SUGGESTIONS = 6;
const POPULAR_CATEGORIES = NAV_GROUPS.flatMap((g) => g.links.map((l) => ({ ...l, label: `${g.label}: ${l.label}` }))).slice(0, 6);

function SearchField({ className }: { className?: string }) {
  const { shopWith, addRecentSearch, openQuickView } = useShop();
  const uid = useId();
  const inputId = `${uid}-search`;
  const listId = `${uid}-list`;
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const q = query.trim();
  const ready = q.length >= MIN_CHARS;
  const results = useMemo<Product[]>(() => (ready ? searchProducts(q, PRODUCTS).slice(0, MAX_SUGGESTIONS) : []), [q, ready]);
  const showList = open && ready;

  useEffect(() => { setActive(-1); }, [q]);

  const close = () => { setOpen(false); setActive(-1); };
  const applyQuery = () => {
    if (!q) { inputRef.current?.focus(); return; }
    addRecentSearch(q);
    close();
    inputRef.current?.blur();
    shopWith({ query: q });
  };
  const openProduct = (p: Product) => {
    addRecentSearch(q);
    close();
    inputRef.current?.blur();
    openQuickView(p.id);
  };
  const pickCategory = (patch: Partial<ExploreState>) => { close(); setQuery(''); shopWith(patch); };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!ready || !results.length) return;
      e.preventDefault();
      setOpen(true);
      const d = e.key === 'ArrowDown' ? 1 : -1;
      // Cycle through -1 (nothing active, the input text) and 0..n-1.
      setActive((i) => {
        const next = i + d;
        return next >= results.length ? -1 : next < -1 ? results.length - 1 : next;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (showList && active >= 0 && results[active]) openProduct(results[active]);
      else applyQuery();
    } else if (e.key === 'Escape') {
      if (showList) { e.preventDefault(); close(); }
      else if (query) { e.preventDefault(); setQuery(''); }
    }
  };

  return (
    <div
      ref={wrapRef}
      className={cn('relative', className)}
      onBlur={(e) => { if (!wrapRef.current?.contains(e.relatedTarget as Node | null)) close(); }}
    >
      <form
        role="search"
        onSubmit={(e) => { e.preventDefault(); applyQuery(); }}
        className="flex h-12 items-stretch rounded-btn border border-border-strong bg-bg transition-colors focus-within:border-accent lg:h-[52px]"
      >
        <label htmlFor={inputId} className="sr-only">Search products</label>
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && active >= 0 ? `${listId}-${active}` : undefined}
          autoComplete="off"
          enterKeyHint="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search kurtas, sarees, lehengas…"
          className="min-w-0 flex-1 rounded-l-btn bg-transparent pl-5 text-[16px] text-text outline-none placeholder:text-text-muted lg:pl-6"
        />
        <button type="submit" className="-m-px grid w-14 shrink-0 place-items-center rounded-r-btn bg-action text-action-text transition-colors hover:bg-action-hover lg:w-[72px]" aria-label="Search">
          <Search size={22} strokeWidth={2.2} aria-hidden="true" />
        </button>
      </form>

      <p className="sr-only" role="status" aria-live="polite">
        {showList ? (results.length ? `${results.length} suggestion${results.length === 1 ? '' : 's'} available` : `No results for ${q}`) : ''}
      </p>

      {showList && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-[var(--radius-modal)] border border-border bg-bg text-text shadow-[var(--shadow-pop)]">
          {results.length > 0 ? (
            <>
            <ul id={listId} role="listbox" aria-label="Product suggestions" className="pt-2">
              {results.map((p, i) => (
                <li
                  key={p.id}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => openProduct(p)}
                  onMouseEnter={() => setActive(i)}
                  className={cn('flex min-h-12 cursor-pointer items-center gap-3 px-3 py-1.5', i === active && 'bg-accent-soft')}
                >
                  <span className="size-10 shrink-0 overflow-hidden rounded-btn art-bg"><ProductImage product={p} inset="p-1" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-semibold">{p.name}</span>
                    <span className="block truncate text-[13px] text-text-muted">{typeLabel(p.type)}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-1 border-t border-border px-3 py-1">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={applyQuery}
                className="flex min-h-11 w-full items-center justify-between text-[14px] font-semibold text-accent"
              >
                See all results for “{q}” <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
            </>
          ) : (
            <div id={listId} className="p-4">
              <p className="flex items-center gap-2 text-[15px] font-semibold">
                <SearchX size={18} className="text-accent" aria-hidden="true" />
                No results for ‘{q}’
              </p>
              <p className="mt-1 text-[14px] text-text-muted">Try a popular category:</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {POPULAR_CATEGORIES.map((c) => (
                  <button key={c.label} type="button" className="chip h-11" onClick={() => pickCategory(c.patch)}>{c.label}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function HeaderAction({ label, aria, count, onClick, dataAttr, children }: {
  label: string; aria: string; count: number; onClick: () => void; dataAttr: Record<string, string>; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={aria}
      className="group relative flex size-11 flex-col items-center justify-center rounded-full text-text transition-colors hover:text-accent lg:size-auto lg:rounded-btn lg:px-1"
      {...dataAttr}
    >
      <span className="relative">
        {children}
        {count > 0 && <Badge n={count} />}
      </span>
      <span className="mt-1 hidden text-[15px] font-semibold leading-none lg:block">{label}</span>
    </button>
  );
}

function NavButton({ children, onClick, onMouseEnter, expanded, controls, chevron, buttonRef }: {
  children: React.ReactNode; onClick: (e: React.MouseEvent) => void; onMouseEnter: () => void;
  expanded?: boolean; controls?: string; chevron?: boolean; buttonRef?: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      aria-expanded={chevron ? !!expanded : undefined}
      aria-controls={controls}
      className={cn(
        'group relative flex h-11 items-center gap-2 whitespace-nowrap rounded-btn px-2.5 text-[15px] font-medium transition-colors hover:text-accent xl:px-3 xl:text-[16px]',
        expanded ? 'font-semibold text-accent' : 'text-text',
      )}
    >
      {children}
      {chevron && <ChevronDown size={16} className={cn('transition-transform', expanded && 'rotate-180')} aria-hidden="true" />}
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-x-2.5 -bottom-0.5 h-[2px] rounded-full bg-accent transition-transform duration-150 origin-left',
          expanded ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
        )}
      />
    </button>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <motion.span
      key={n}
      initial={{ scale: 0.4 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
      className="absolute -right-2.5 -top-2 grid h-5 min-w-5 place-items-center rounded-full border-2 border-bg bg-accent px-1 text-[12px] font-bold text-text-inverse tabular-nums"
    >
      {n > 99 ? '99+' : n}
    </motion.span>
  );
}
