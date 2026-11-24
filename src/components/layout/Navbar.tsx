import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Heart, Menu, Search, ShoppingBag } from 'lucide-react';
import type { ExploreState, ProductType } from '../../types';
import { getProduct } from '../../lib/catalog';
import { cn, scrollToId } from '../../lib/utils';
import { DUR, EASE } from '../../lib/motion';
import { useScrolledPast } from '../../hooks/useScrollY';
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
  const scrolled = useScrolledPast(24);
  const [open, setOpen] = useState<MenuId | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const navRef = useRef<HTMLDivElement>(null);

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

  return (
    <header
      ref={navRef}
      className={cn(
        'sticky top-0 z-40 border-b transition-[background-color,box-shadow,border-color] duration-[250ms]',
        scrolled || open ? 'border-line bg-white/90 shadow-[0_10px_30px_-20px_rgba(15,15,20,0.35)] backdrop-blur-xl' : 'border-transparent bg-paper',
      )}
      onMouseLeave={scheduleClose}
    >
      <div className={cn('container-x flex items-center gap-4 transition-[height] duration-[250ms]', scrolled ? 'h-16' : 'h-[72px]')}>
        <button type="button" className="icon-btn -ml-2 lg:hidden" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <a href="#top" onClick={(e) => { e.preventDefault(); scrollToId('top'); }} className="display text-[26px] tracking-[-0.05em]" aria-label="SHOPNOW home">
          SHOP<span className="text-electric">NOW</span>
        </a>

        <nav className="ml-10 hidden h-full items-stretch lg:flex" aria-label="Main">
          {NAV.map((item) => item.id === 'sale' ? (
            <button key={item.id} type="button" onClick={() => pick({ tab: 'sale' })} onMouseEnter={scheduleClose} className="relative px-4 text-[14.5px] font-medium text-electric">
              {item.label}
            </button>
          ) : (
            <button
              key={item.id}
              type="button"
              aria-expanded={open === item.id}
              aria-haspopup="true"
              onMouseEnter={() => openMenu(item.id as MenuId)}
              onClick={() => setOpen((o) => (o === item.id ? null : (item.id as MenuId)))}
              className="group relative px-4 text-[14.5px] font-medium"
            >
              {item.label}
              <span className={cn('absolute inset-x-4 bottom-0 h-0.5 origin-left bg-ink transition-transform duration-200', open === item.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100')} />
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-0.5">
          <button type="button" className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search products">
            <Search size={21} strokeWidth={1.8} />
          </button>
          <button type="button" className="icon-btn" onClick={() => openPanel('wishlist')} aria-label={`Wishlist, ${wishlist.length} items`} data-wishlist-target>
            <Heart size={21} strokeWidth={1.8} />
            {wishlist.length > 0 && <Badge n={wishlist.length} />}
          </button>
          <button type="button" className="icon-btn" onClick={() => openPanel('cart')} aria-label={`Shopping bag, ${totals.count} items`} data-bag-target>
            <ShoppingBag size={21} strokeWidth={1.8} />
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
