import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ChevronDown, Gift, Heart, ShoppingBag, X } from 'lucide-react';
import type { ExploreState } from '../../types';
import { NAV_EXTRAS, NAV_GROUPS } from '../../lib/catalog';
import { AFFILIATE_PATH, linkHandler } from '../../lib/router';
import { cn } from '../../lib/utils';
import { DUR, EASE } from '../../lib/motion';
import { useDialog, useLockBodyScroll } from '../../hooks/useOverlay';
import { useShop } from '../../store/ShopProvider';
import { BrandLogo } from './BrandLogo';

/** Responsive hamburger menu: slides in from the left, 300ms. Built from the same NAV_GROUPS / NAV_EXTRAS as the desktop nav. */
export function MobileMenu() {
  const { mobileMenuOpen, setMobileMenuOpen, shopWith, openPanel, totals, wishlist } = useShop();
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
          <motion.div className="absolute inset-0 bg-text/40 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: DUR.mobileMenu }} onClick={close} />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: DUR.mobileMenu, ease: EASE }}
            className="absolute inset-y-0 left-0 flex w-[min(86vw,380px)] flex-col rounded-r-[var(--radius-modal)] bg-bg shadow-[var(--shadow-pop)]"
            style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)', paddingLeft: 'env(safe-area-inset-left)' }}
          >
            <div className="flex h-16 items-center justify-between border-b border-border px-5">
              <BrandLogo markClassName="size-8" textClassName="text-[22px]" />
              <button type="button" className="icon-btn -mr-2" onClick={close} aria-label="Close menu"><X size={22} aria-hidden="true" /></button>
            </div>
            <nav className="flex-1 overflow-y-auto px-5 py-3" aria-label="Main">
              <a
                href={AFFILIATE_PATH}
                onClick={(e) => { close(); linkHandler(AFFILIATE_PATH)(e); }}
                className="my-2 flex min-h-12 items-center justify-between gap-3 rounded-pill bg-accent-soft px-4 text-[15px] font-semibold text-accent transition-colors hover:bg-accent hover:text-text-inverse"
              >
                <span className="flex items-center gap-2.5"><Gift size={20} aria-hidden="true" /> Earn with us</span>
                <ArrowRight size={18} aria-hidden="true" />
              </a>

              {NAV_GROUPS.map((g) => {
                const isOpen = expanded === g.id;
                const listId = `mobile-nav-${g.id}`;
                return (
                  <div key={g.id} className="border-b border-border">
                    <button
                      type="button"
                      className="flex min-h-14 w-full items-center justify-between text-lg font-semibold text-text"
                      aria-expanded={isOpen}
                      aria-controls={listId}
                      onClick={() => setExpanded((e) => (e === g.id ? null : g.id))}
                    >
                      {g.label}
                      <ChevronDown size={18} className={cn('transition-transform duration-200', isOpen && 'rotate-180')} aria-hidden="true" />
                    </button>
                    {isOpen && (
                      <ul id={listId} className="grid grid-cols-2 gap-x-4 pb-3">
                        <li className="col-span-2">
                          <button type="button" onClick={() => go({ tab: g.id })} className="flex min-h-11 w-full items-center text-left text-[15px] font-semibold text-accent">
                            Shop all {g.label.toLowerCase()}
                          </button>
                        </li>
                        {g.links.map((l) => (
                          <li key={l.label}>
                            <button type="button" onClick={() => go(l.patch)} className="flex min-h-11 w-full items-center text-left text-[15px] text-text-muted hover:text-accent">
                              {l.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
              {NAV_EXTRAS.map((l) => (
                <button
                  key={l.label}
                  type="button"
                  onClick={() => go(l.patch)}
                  className={cn('flex min-h-14 w-full items-center border-b border-border text-left text-lg font-semibold text-text', l.label === 'Sale' && 'text-accent')}
                >
                  {l.label}
                </button>
              ))}
            </nav>
            <div className="grid grid-cols-2 gap-2 border-t border-border p-4">
              <button type="button" className="chip h-11 justify-center text-[14px]" onClick={() => openPanel('wishlist')}>
                <Heart size={16} aria-hidden="true" /> Wishlist ({wishlist.length})
              </button>
              <button type="button" className="chip h-11 justify-center text-[14px]" onClick={() => openPanel('cart')}>
                <ShoppingBag size={16} aria-hidden="true" /> Cart ({totals.count})
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
