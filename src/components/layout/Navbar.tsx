import { useEffect, useRef, useState } from 'react';
import type React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight, Camera, ChevronDown, Heart, House, Layers, LayoutGrid, Menu, Search,
  Shirt, ShoppingCart, Sparkles, Tag, UserRound,
} from 'lucide-react';
import type { ExploreState, ProductType } from '../../types';
import { PRODUCT_TYPES, getProduct } from '../../lib/catalog';
import { cn, scrollToId } from '../../lib/utils';
import { DUR, EASE } from '../../lib/motion';
import { useShop } from '../../store/ShopProvider';
import { ProductImage } from '../product/ProductImage';

type MenuId = 'categories' | 'men' | 'women' | 'collections' | 'more';
type MegaId = 'men' | 'women' | 'collections';

interface MegaColumn { title: string; links: { label: string; patch: Partial<ExploreState> }[] }
interface MegaPanel { columns: MegaColumn[]; feature: { productId: string; color: number; title: string; text: string; patch: Partial<ExploreState> } }

const typeLinks = (tab: 'men' | 'women', types: ProductType[]) =>
  types.map((t) => ({ label: t, patch: { tab, types: [t] } as Partial<ExploreState> }));

const MEGA: Record<MegaId, MegaPanel> = {
  men: {
    columns: [
      { title: 'Clothing', links: [{ label: 'Shop all men', patch: { tab: 'men' } }, ...typeLinks('men', ['T-Shirts', 'Hoodies', 'Sweatshirts', 'Jackets', 'Bottoms'])] },
      { title: 'More', links: [...typeLinks('men', ['Footwear', 'Accessories']), { label: 'New arrivals', patch: { tab: 'new' } }, { label: 'Sale', patch: { tab: 'sale' } }] },
    ],
    feature: { productId: 'track-jacket', color: 0, title: 'The Track Jacket', text: 'Just dropped in three colours.', patch: { tab: 'men', types: ['Jackets'] } },
  },
  women: {
    columns: [
      { title: 'Clothing', links: [{ label: 'Shop all women', patch: { tab: 'women' } }, ...typeLinks('women', ['T-Shirts', 'Hoodies', 'Sweatshirts', 'Jackets', 'Bottoms'])] },
      { title: 'More', links: [...typeLinks('women', ['Footwear', 'Accessories']), { label: 'New arrivals', patch: { tab: 'new' } }, { label: 'Sale', patch: { tab: 'sale' } }] },
    ],
    feature: { productId: 'cropped-hoodie', color: 0, title: 'Cropped Hoodie', text: 'This season in lavender.', patch: { tab: 'women', types: ['Hoodies'] } },
  },
  collections: {
    columns: [
      { title: 'Collections', links: [{ label: 'Made for Every Move', patch: { collection: 'move' } }, { label: 'The Essentials', patch: { collection: 'essentials' } }, { label: 'New arrivals', patch: { tab: 'new' } }] },
      { title: 'Shop by', links: [{ label: 'Bestsellers', patch: { sort: 'popular' } }, { label: 'Under ₹1,000', patch: { prices: ['under-1000'] } }, { label: 'Lavender edit', patch: { colors: ['purple'] } }] },
    ],
    feature: { productId: 'satin-bomber', color: 1, title: 'Made for Every Move', text: 'Our cinematic streetwear drop.', patch: { collection: 'move' } },
  },
};

const MORE_LINKS: { label: string; target: string }[] = [
  { label: 'Featured drops', target: 'featured' },
  { label: 'Trending now', target: 'trending' },
  { label: 'Shop the look', target: 'looks' },
  { label: 'Recently viewed', target: 'recent' },
  { label: 'Reviews', target: 'reviews' },
  { label: 'Newsletter', target: 'newsletter' },
];

export function Navbar() {
  const { shopWith, setSearchOpen, openPanel, setMobileMenuOpen, totals, wishlist, addRecentSearch, toast } = useShop();
  const [open, setOpen] = useState<MenuId | null>(null);
  const [query, setQuery] = useState('');
  const closeTimer = useRef<number | undefined>(undefined);
  const barRef = useRef<HTMLDivElement>(null);

  const openMenu = (id: MenuId) => { window.clearTimeout(closeTimer.current); setOpen(id); };
  const scheduleClose = () => { window.clearTimeout(closeTimer.current); closeTimer.current = window.setTimeout(() => setOpen(null), 140); };
  const toggle = (id: MenuId) => setOpen((o) => (o === id ? null : id));
  const pick = (patch: Partial<ExploreState>) => { setOpen(null); shopWith(patch); };
  const jump = (id: string) => { setOpen(null); scrollToId(id); };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    const onDown = (e: PointerEvent) => { if (!barRef.current?.contains(e.target as Node)) setOpen(null); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown); };
  }, [open]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) { setSearchOpen(true); return; }
    addRecentSearch(q);
    shopWith({ query: q });
  };

  const signIn = () => toast({ title: 'Sign in is coming soon', description: 'Your bag and wishlist are saved on this device for now.', tone: 'info' });

  const mega = open === 'men' || open === 'women' || open === 'collections' ? MEGA[open] : null;
  const feature = mega ? getProduct(mega.feature.productId) : undefined;

  return (
    <>
      {/* Main row: logo, search, offers, sign in, wishlist, cart (sticky) */}
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-md">
        <div className="container-x flex h-16 items-center gap-3 sm:gap-5 lg:h-[104px] lg:gap-8">
          <button
            type="button"
            className="grid size-10 shrink-0 place-items-center rounded-full text-ink transition-colors hover:bg-lav-100 lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <a
            href="#top"
            onClick={(e) => { e.preventDefault(); scrollToId('top'); }}
            className="flex min-w-0 shrink-0 items-center gap-2.5 select-none lg:gap-3.5"
            aria-label="SHOPNOW home"
          >
            <BrandMark className="size-9 shrink-0 sm:size-10 lg:size-[68px]" />
            <span className="flex flex-col">
              <span className="text-[22px] font-black leading-none tracking-[-0.04em] sm:text-[26px] lg:text-[44px]">
                <span className="text-ink">SHOP</span><span className="text-purple">NOW</span>
              </span>
              <span className="mt-1 hidden text-[13px] font-semibold italic leading-none tracking-[-0.01em] text-ink-2 sm:block lg:mt-1.5 lg:text-[17px]">
                Style your everyday.
              </span>
            </span>
          </a>

          {/* Search (desktop inline, mobile in second row) */}
          <SearchField className="mx-auto hidden max-w-[620px] flex-1 md:flex" query={query} setQuery={setQuery} onSubmit={submitSearch} />

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2 lg:gap-5">
            <button
              type="button"
              onClick={() => pick({ tab: 'new' })}
              className="relative hidden items-center gap-3 rounded-xl border-2 border-lav-200 bg-white px-4 py-2 text-left transition-colors hover:border-purple xl:flex"
            >
              <span className="absolute -top-2.5 right-3 rounded-full bg-purple px-2 py-0.5 text-[11px] font-bold leading-none text-white">New</span>
              <Sparkles size={28} strokeWidth={1.8} className="text-purple" aria-hidden="true" />
              <span className="text-[16px] font-bold leading-[1.1] text-ink">Fresh<br />Drops</span>
            </button>

            <span className="hidden h-9 w-0.5 bg-line xl:block" aria-hidden="true" />

            <button
              type="button"
              onClick={signIn}
              className="group hidden h-12 items-center gap-2.5 rounded-full bg-purple pl-4 pr-5 text-[16px] font-semibold text-white shadow-[0_8px_20px_-10px_rgba(106,30,213,0.8)] transition-colors hover:bg-electric-600 lg:flex"
            >
              <UserRound size={22} strokeWidth={2} aria-hidden="true" />
              Sign in
              <ArrowRight size={18} className="transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true" />
            </button>

            <button
              type="button"
              className="grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-lav-100 hover:text-purple md:hidden"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
            >
              <Search size={22} />
            </button>

            <span className="hidden h-12 w-px bg-line lg:block" aria-hidden="true" />

            <HeaderAction
              label="Wishlist"
              aria={`Wishlist, ${wishlist.length} items`}
              count={wishlist.length}
              onClick={() => openPanel('wishlist')}
              dataAttr={{ 'data-wishlist-target': '' }}
            >
              <Heart size={26} strokeWidth={1.8} />
            </HeaderAction>
            <HeaderAction
              label="Cart"
              aria={`Shopping cart, ${totals.count} items`}
              count={totals.count}
              onClick={() => openPanel('cart')}
              dataAttr={{ 'data-bag-target': '' }}
            >
              <ShoppingCart size={28} strokeWidth={1.8} />
            </HeaderAction>
          </div>
        </div>
      </header>

      {/* Mobile search row */}
      <div className="border-b border-line bg-white px-5 py-3 md:hidden">
        <SearchField className="flex" query={query} setQuery={setQuery} onSubmit={submitSearch} />
      </div>

      {/* Category navigation bar */}
      <div ref={barRef} className="relative z-30 hidden bg-white lg:block" onMouseLeave={scheduleClose}>
        <div className="container-x">
          <nav className="flex h-[58px] items-center rounded-xl bg-purple px-3 text-white shadow-[0_12px_30px_-16px_rgba(106,30,213,0.9)] xl:px-5" aria-label="Main">
            <button
              type="button"
              aria-expanded={open === 'categories'}
              aria-haspopup="true"
              onClick={() => toggle('categories')}
              onMouseEnter={() => openMenu('categories')}
              className="flex h-10 shrink-0 items-center gap-3 rounded-lg px-3 text-[16px] font-semibold transition-colors hover:bg-white/10 xl:text-[17px]"
            >
              <Menu size={22} aria-hidden="true" />
              All Categories
              <ChevronDown size={16} className={cn('transition-transform', open === 'categories' && 'rotate-180')} aria-hidden="true" />
            </button>

            <span className="mx-3 h-7 w-px bg-white/30 xl:mx-5" aria-hidden="true" />

            <ul className="flex flex-1 items-center justify-between gap-1">
              <li>
                <NavItem icon={House} active onClick={() => jump('top')} onMouseEnter={scheduleClose}>Home</NavItem>
              </li>
              {(['men', 'women', 'collections'] as const).map((id) => (
                <li key={id}>
                  <NavItem
                    icon={id === 'collections' ? Layers : Shirt}
                    expanded={open === id}
                    onClick={() => toggle(id)}
                    onMouseEnter={() => openMenu(id)}
                  >
                    {id === 'men' ? 'Men' : id === 'women' ? 'Women' : 'Collections'}
                  </NavItem>
                </li>
              ))}
              <li><NavItem icon={Tag} onClick={() => pick({ tab: 'sale' })} onMouseEnter={scheduleClose}>Offers Zone</NavItem></li>
              <li><NavItem icon={Sparkles} onClick={() => pick({ tab: 'new' })} onMouseEnter={scheduleClose}>New Arrivals</NavItem></li>
              <li className="hidden min-[1440px]:block"><NavItem icon={Camera} onClick={() => jump('looks')} onMouseEnter={scheduleClose}>Shop the Look</NavItem></li>
              <li>
                <NavItem icon={LayoutGrid} expanded={open === 'more'} onClick={() => toggle('more')} onMouseEnter={() => openMenu('more')} chevron>
                  More
                </NavItem>
              </li>
            </ul>
          </nav>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              key={open}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: DUR.dropdown, ease: EASE }}
              onMouseEnter={() => window.clearTimeout(closeTimer.current)}
              className="absolute inset-x-0 top-full pt-2"
            >
              <div className="container-x">
                <div className="overflow-hidden rounded-xl border border-line bg-white shadow-[0_30px_60px_-30px_rgba(15,15,20,0.35)]">
                  {open === 'categories' && (
                    <div className="grid grid-cols-4 gap-2 p-6 xl:grid-cols-7">
                      {PRODUCT_TYPES.map((t) => (
                        <button key={t} type="button" onClick={() => pick({ types: [t] })} className="rounded-lg px-4 py-3 text-left text-[15px] font-medium text-ink transition-colors hover:bg-lav-100 hover:text-purple">
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                  {open === 'more' && (
                    <div className="grid grid-cols-3 gap-2 p-6 xl:grid-cols-6">
                      {MORE_LINKS.map((l) => (
                        <button key={l.target} type="button" onClick={() => jump(l.target)} className="rounded-lg px-4 py-3 text-left text-[15px] font-medium text-ink transition-colors hover:bg-lav-100 hover:text-purple">
                          {l.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {mega && feature && (
                    <div className="grid grid-cols-[1fr_1fr_1.3fr] gap-10 p-10">
                      {mega.columns.map((col) => (
                        <div key={col.title}>
                          <p className="eyebrow mb-4 text-muted">{col.title}</p>
                          <ul className="space-y-2.5">
                            {col.links.map((l) => (
                              <li key={l.label}>
                                <button type="button" onClick={() => pick(l.patch)} className="group inline-flex items-center gap-2 text-[15px] font-medium hover:text-electric">
                                  {l.label}
                                  <ArrowRight size={14} className="-translate-x-1 opacity-0 transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <button type="button" onClick={() => pick(mega.feature.patch)} className="group grid grid-cols-[150px_1fr] items-center gap-5 overflow-hidden rounded-2xl bg-lav-50 p-4 text-left">
                        <div className="aspect-square overflow-hidden rounded-xl art-bg-alt">
                          <ProductImage product={feature} color={mega.feature.color} className="transition-transform duration-300 group-hover:scale-105" />
                        </div>
                        <div>
                          <p className="eyebrow">Featured</p>
                          <p className="display mt-2 text-2xl">{mega.feature.title}</p>
                          <p className="mt-1 text-sm text-muted">{mega.feature.text}</p>
                          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">Shop now <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

/** SHOPNOW mark: a purple shopping bag with a lightning "N" cut-out. */
function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M22 20v-4a10 10 0 0 1 20 0v4" fill="none" stroke="#6A1ED5" strokeWidth="5" strokeLinecap="round" />
      <path d="M10 22a4 4 0 0 1 4-4h36a4 4 0 0 1 4 4l-3 32a6 6 0 0 1-6 6H19a6 6 0 0 1-6-6z" fill="#6A1ED5" />
      <path d="M10 22a4 4 0 0 1 4-4h36a4 4 0 0 1 4 4l-1 10C40 40 24 40 11 33z" fill="#8B4DFF" />
      <path d="M23 49V31l18 18V31" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchField({ className, query, setQuery, onSubmit }: {
  className?: string; query: string; setQuery: (q: string) => void; onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form role="search" onSubmit={onSubmit} className={cn('h-12 items-stretch rounded-full border-2 border-lav-200 bg-white shadow-[0_6px_18px_-12px_rgba(40,20,90,0.35)] transition-colors focus-within:border-purple lg:h-[54px]', className)}>
      <label htmlFor="header-search" className="sr-only">Search for products</label>
      <input
        id="header-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for hoodies, cargos, sneakers…"
        className="min-w-0 flex-1 rounded-l-full bg-transparent pl-5 text-[15px] text-ink outline-none placeholder:text-muted lg:pl-6 lg:text-[16px]"
      />
      <button type="submit" className="-m-0.5 grid w-14 shrink-0 place-items-center rounded-r-full bg-purple text-white transition-colors hover:bg-electric-600 lg:w-[78px]" aria-label="Search">
        <Search size={24} strokeWidth={2.2} />
      </button>
    </form>
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
      className="group relative flex size-10 flex-col items-center justify-center text-ink transition-colors hover:text-purple lg:size-auto lg:px-1"
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

function NavItem({ icon: Icon, children, onClick, onMouseEnter, active, expanded, chevron }: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  children: React.ReactNode; onClick: () => void; onMouseEnter: () => void;
  active?: boolean; expanded?: boolean; chevron?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      aria-expanded={expanded}
      aria-current={active ? 'page' : undefined}
      className="group relative flex h-10 items-center gap-2 whitespace-nowrap rounded-lg px-2.5 text-[15.5px] font-medium transition-colors hover:bg-white/10 xl:px-3 xl:text-[17px]"
    >
      <Icon size={22} strokeWidth={1.9} className="shrink-0" />
      {children}
      {chevron && <ChevronDown size={16} className={cn('transition-transform', expanded && 'rotate-180')} />}
      <span
        className={cn(
          'absolute inset-x-2.5 -bottom-1 h-[3px] rounded-full bg-lav-300 transition-transform duration-150 origin-left',
          active || expanded ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
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
      className="absolute -right-2.5 -top-2 grid h-5 min-w-5 place-items-center rounded-full border-2 border-white bg-purple px-1 text-[11px] font-bold text-white tabular-nums"
    >
      {n > 99 ? '99+' : n}
    </motion.span>
  );
}
