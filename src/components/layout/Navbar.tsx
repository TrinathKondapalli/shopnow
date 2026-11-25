import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type React from 'react';
import { ArrowRight, Menu } from 'lucide-react';
import type { ExploreState, ProductType } from '../../types';
import { getProduct } from '../../lib/catalog';
import { cn, scrollToId } from '../../lib/utils';
import { DUR, EASE } from '../../lib/motion';
import { useShop } from '../../store/ShopProvider';
import { ProductImage } from '../product/ProductImage';

type MenuId = 'men' | 'women' | 'collections';

interface MegaColumn { title: string; links: { label: string; patch: Partial<ExploreState> }[] }
interface MegaPanel { columns: MegaColumn[]; feature: { productId: string; color: number; title: string; text: string; patch: Partial<ExploreState> } }

const typeLinks = (tab: 'men' | 'women', types: ProductType[]) =>
  types.map((t) => ({ label: t, patch: { tab, types: [t] } as Partial<ExploreState> }));

const MEGA: Record<MenuId, MegaPanel> = {
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

const NAV: { id: MenuId | 'sale'; label: string }[] = [
  { id: 'men', label: 'Men' },
  { id: 'women', label: 'Women' },
  { id: 'collections', label: 'Collections' },
  { id: 'sale', label: 'Sale' },
];

export function Navbar() {
  const { shopWith, setSearchOpen, openPanel, setMobileMenuOpen, totals, wishlist } = useShop();
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [open, setOpen] = useState<MenuId | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const navRef = useRef<HTMLDivElement>(null);

  // Detect when scroll leaves the Hero section (#top)
  useEffect(() => {
    const checkScroll = () => {
      const hero = document.getElementById('top');
      if (hero) {
        const heroBottom = hero.getBoundingClientRect().bottom;
        // When hero bottom reaches near the navbar (<= 64px), switch to white background
        setScrolledPastHero(heroBottom <= 64);
      } else {
        setScrolledPastHero(window.scrollY > 500);
      }
    };

    checkScroll();
    window.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const openMenu = (id: MenuId) => { window.clearTimeout(closeTimer.current); setOpen(id); };
  const scheduleClose = () => { window.clearTimeout(closeTimer.current); closeTimer.current = window.setTimeout(() => setOpen(null), 140); };
  const pick = (patch: Partial<ExploreState>) => { setOpen(null); shopWith(patch); };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    const onDown = (e: PointerEvent) => { if (!navRef.current?.contains(e.target as Node)) setOpen(null); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown); };
  }, [open]);

  const panel = open ? MEGA[open] : null;
  const feature = panel ? getProduct(panel.feature.productId) : undefined;
  const isSolid = scrolledPastHero || open;

  return (
    <header
      ref={navRef}
      className={cn(
        'sticky top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300 lg:-mb-[64px]',
        isSolid
          ? 'border-b border-line bg-white/95 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)] backdrop-blur-md'
          : 'border-b border-transparent bg-transparent shadow-none',
      )}
      onMouseLeave={scheduleClose}
    >
      <div className="container-x flex h-14 sm:h-16 md:h-[64px] items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Brand Logo */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="grid size-9 place-items-center rounded-full text-ink transition-colors hover:bg-black/5 lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <a
            href="#top"
            onClick={(e) => { e.preventDefault(); scrollToId('top'); }}
            className="text-[21px] sm:text-[24px] md:text-[25px] font-black leading-none tracking-[-0.03em] select-none"
            aria-label="SHOPNOW home"
          >
            <span className="text-ink">SHOP</span><span className="text-purple">NOW</span>
          </a>
        </div>

        {/* Center: Clean & Streamlined Navigation links */}
        <nav className="hidden h-full items-center gap-7 lg:flex" aria-label="Main">
          {NAV.map((item) => item.id === 'sale' ? (
            <button
              key={item.id}
              type="button"
              onClick={() => pick({ tab: 'sale' })}
              onMouseEnter={scheduleClose}
              className="group relative flex h-full items-center text-[15px] font-semibold tracking-[-0.01em] text-purple transition-colors"
            >
              <span>{item.label}</span>
              <span className="absolute bottom-3 inset-x-0 h-[2px] origin-left scale-x-0 bg-purple transition-transform duration-150 group-hover:scale-x-100" />
            </button>
          ) : (
            <button
              key={item.id}
              type="button"
              aria-expanded={open === item.id}
              aria-haspopup="true"
              onMouseEnter={() => openMenu(item.id as MenuId)}
              onClick={() => setOpen((o) => (o === item.id ? null : (item.id as MenuId)))}
              className={cn(
                'group relative flex h-full items-center text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-150 hover:text-purple',
                open === item.id ? 'text-purple' : 'text-ink',
              )}
            >
              <span>{item.label}</span>
              <span className={cn('absolute bottom-3 inset-x-0 h-[2px] origin-left bg-purple transition-transform duration-150', open === item.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100')} />
            </button>
          ))}
        </nav>

        {/* Right: Actions (Search, Wishlist, Bag) */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            type="button"
            className="relative grid size-9 sm:size-10 place-items-center rounded-full text-ink transition-colors duration-150 hover:bg-black/5 hover:text-purple"
            onClick={() => setSearchOpen(true)}
            aria-label="Search products"
          >
            <FigmaIcon src="/figma/hero/icon-search.svg" inset="14.58%" bleed="-5%" />
          </button>
          <button
            type="button"
            className="relative grid size-9 sm:size-10 place-items-center rounded-full text-ink transition-colors duration-150 hover:bg-black/5 hover:text-purple"
            onClick={() => openPanel('wishlist')}
            aria-label={`Wishlist, ${wishlist.length} items`}
            data-wishlist-target
          >
            <FigmaIcon src="/figma/hero/icon-wishlist.svg" inset="12.5% 8.33%" bleed="-4.72% -4.25%" />
            {wishlist.length > 0 && <Badge n={wishlist.length} />}
          </button>
          <button
            type="button"
            className="relative grid size-9 sm:size-10 place-items-center rounded-full text-ink transition-colors duration-150 hover:bg-black/5 hover:text-purple"
            onClick={() => openPanel('cart')}
            aria-label={`Shopping bag, ${totals.count} items`}
            data-bag-target
          >
            <FigmaIcon src="/figma/hero/icon-bag.svg" inset="8.33% 12.5%" bleed="-4.25% -4.72%" />
            {totals.count > 0 && <Badge n={totals.count} />}
          </button>
        </div>
      </div>

      {/* Mega menu: fade and slide, 200ms */}
      <AnimatePresence>
        {panel && feature && (
          <motion.div
            key={open}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: DUR.dropdown, ease: EASE }}
            onMouseEnter={() => window.clearTimeout(closeTimer.current)}
            className="absolute inset-x-0 top-full hidden border-b border-line bg-white shadow-[0_30px_60px_-30px_rgba(15,15,20,0.35)] lg:block"
          >
            <div className="container-x grid grid-cols-[1fr_1fr_1.3fr] gap-10 py-10">
              {panel.columns.map((col) => (
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
              <button type="button" onClick={() => pick(panel.feature.patch)} className="group grid grid-cols-[150px_1fr] items-center gap-5 overflow-hidden rounded-2xl bg-lav-50 p-4 text-left">
                <div className="aspect-square overflow-hidden rounded-xl art-bg-alt">
                  <ProductImage product={feature} color={panel.feature.color} className="transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div>
                  <p className="eyebrow">Featured</p>
                  <p className="display mt-2 text-2xl">{panel.feature.title}</p>
                  <p className="mt-1 text-sm text-muted">{panel.feature.text}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">Shop now <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></span>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/** 28px outline icon from Figma (Icon Button 96:104), masked so hover can recolour it. */
function FigmaIcon({ src, inset, bleed }: { src: string; inset: string; bleed: string }) {
  return (
    <span className="relative size-[24px] overflow-hidden" aria-hidden="true">
      <span className="absolute" style={{ inset }}>
        <span className="absolute" style={{ inset: bleed }}>
          <span className="figma-icon" style={{ '--icon': `url(${src})` } as React.CSSProperties} />
        </span>
      </span>
    </span>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <motion.span
      key={n}
      initial={{ scale: 0.4 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
      className="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-electric px-1 text-[10.5px] font-bold text-white tabular-nums"
    >
      {n > 99 ? '99+' : n}
    </motion.span>
  );
}
