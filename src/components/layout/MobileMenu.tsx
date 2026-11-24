import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Heart, Search, ShoppingBag, X } from 'lucide-react';
import type { ExploreState, ProductType } from '../../types';
import { PRODUCT_TYPES } from '../../lib/catalog';
import { cn } from '../../lib/utils';
import { DUR, EASE } from '../../lib/motion';
import { useDialog, useLockBodyScroll } from '../../hooks/useOverlay';
import { useShop } from '../../store/ShopProvider';

const GROUPS: { id: 'men' | 'women'; label: string; types: ProductType[] }[] = [
  { id: 'men', label: 'Men', types: PRODUCT_TYPES },
  { id: 'women', label: 'Women', types: PRODUCT_TYPES },
];

/** Responsive hamburger menu: slides in from the left, 300ms. */
export function MobileMenu() {
  const { mobileMenuOpen, setMobileMenuOpen, shopWith, setSearchOpen, openPanel, totals, wishlist } = useShop();
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<'men' | 'women' | null>('men');
  const close = () => setMobileMenuOpen(false);
  useLockBodyScroll(mobileMenuOpen);
  useDialog(ref, mobileMenuOpen, close);
  const go = (patch: Partial<ExploreState>) => { close(); shopWith(patch); };

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <motion.div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: DUR.mobileMenu }} onClick={close} />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: DUR.mobileMenu, ease: EASE }}
            className="absolute inset-y-0 left-0 flex w-[min(86vw,380px)] flex-col bg-white shadow-[var(--shadow-pop)]"
            style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)', paddingLeft: 'env(safe-area-inset-left)' }}
          >
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <span className="display text-2xl tracking-[-0.05em]">SHOP<span className="text-electric">NOW</span></span>
              <button type="button" className="icon-btn -mr-2" onClick={close} aria-label="Close menu"><X size={22} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {GROUPS.map((g) => (
                <div key={g.id} className="border-b border-line">
                  <button type="button" className="flex w-full items-center justify-between py-4 text-lg font-semibold" aria-expanded={expanded === g.id} onClick={() => setExpanded((e) => (e === g.id ? null : g.id))}>
                    {g.label}
                    <ChevronDown size={18} className={cn('transition-transform duration-200', expanded === g.id && 'rotate-180')} />
                  </button>
                  {expanded === g.id && (
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-1 pb-4">
                      <li className="col-span-2"><button type="button" onClick={() => go({ tab: g.id })} className="py-1.5 text-[15px] font-semibold text-electric">Shop all {g.label.toLowerCase()}</button></li>
                      {g.types.map((t) => (
                        <li key={t}><button type="button" onClick={() => go({ tab: g.id, types: [t] })} className="py-1.5 text-[15px] text-ink-2">{t}</button></li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              {[
                { label: 'New Arrivals', patch: { tab: 'new' } },
                { label: 'Made for Every Move', patch: { collection: 'move' } },
                { label: 'The Essentials', patch: { collection: 'essentials' } },
                { label: 'Sale', patch: { tab: 'sale' } },
              ].map((l) => (
                <button key={l.label} type="button" onClick={() => go(l.patch as Partial<ExploreState>)} className={cn('block w-full border-b border-line py-4 text-left text-lg font-semibold', l.label === 'Sale' && 'text-electric')}>
                  {l.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 border-t border-line p-4">
              <button type="button" className="chip justify-center" onClick={() => { close(); setSearchOpen(true); }}><Search size={15} /> Search</button>
              <button type="button" className="chip justify-center" onClick={() => openPanel('wishlist')}><Heart size={15} /> {wishlist.length}</button>
              <button type="button" className="chip justify-center" onClick={() => openPanel('cart')}><ShoppingBag size={15} /> {totals.count}</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
