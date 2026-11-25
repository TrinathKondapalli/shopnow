import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp, Globe, HelpCircle, RefreshCw, Ruler, Sparkles, Truck } from 'lucide-react';
import type { ExploreState } from '../../types';
import { scrollToId } from '../../lib/utils';
import { useScrolledPast } from '../../hooks/useScrollY';
import { useShop, type InfoType } from '../../store/ShopProvider';

const SHOP_LINKS: { label: string; patch?: Partial<ExploreState>; anchor?: string }[] = [
  { label: "Men's Collection", patch: { tab: 'men' } },
  { label: "Women's Collection", patch: { tab: 'women' } },
  { label: 'New Arrivals', patch: { tab: 'new' } },
  { label: 'Sale', patch: { tab: 'sale' } },
  { label: 'Trending & Bestsellers', anchor: 'trending' },
  { label: 'Styled Head to Toe', anchor: 'looks' },
  { label: 'Customer Reviews', anchor: 'reviews' },
];

const CLIENT_SERVICES: { label: string; modal: InfoType; icon: typeof Ruler }[] = [
  { label: 'Size & Fit Guide', modal: 'size-guide', icon: Ruler },
  { label: 'Shipping & Delivery', modal: 'shipping', icon: Truck },
  { label: '7-Day Returns & Exchanges', modal: 'returns', icon: RefreshCw },
  { label: 'Garment Care Guide', modal: 'care', icon: Sparkles },
  { label: 'Frequently Asked', modal: 'faq', icon: HelpCircle },
];

/** Footer: brand, shop links, client-care info dialogs and copyright. */
export function Footer() {
  const { shopWith, openInfo } = useShop();

  const handleShopClick = (link: (typeof SHOP_LINKS)[number]) => {
    if (link.patch) {
      shopWith(link.patch);
    } else if (link.anchor) {
      scrollToId(link.anchor);
    }
  };

  return (
    <footer className="relative bg-[#0A0A0C] text-white/70 overflow-hidden" aria-labelledby="footer-title">
      <div className="container-x pt-16 md:pt-20">
        {/* Main footer grid */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12">
          {/* Column 1: Brand Manifesto & Utility (Span 6) */}
          <div className="lg:col-span-6 pr-0 lg:pr-12">
            <div className="inline-block">
              <h2 id="footer-title" className="display text-4xl sm:text-5xl tracking-[-0.05em] text-white">
                SHOP<span className="text-lav-300">NOW</span>
              </h2>
            </div>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/60">
              Architectural streetwear and everyday essentials designed for unrestricted movement. Minimal cuts, custom
              washes, and zero compromise.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80">
                <Globe size={13} className="text-lav-300" />
                <span>India · INR (₹) · English</span>
              </div>
            </div>
          </div>

          {/* Column 2: Shop (Span 3) */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 text-xs font-semibold tracking-widest text-white/40 uppercase">Shop</h3>
            <ul className="space-y-3 text-[14.5px]">
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => handleShopClick(link)}
                    className="text-white/70 transition-colors duration-150 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5"
                  >
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Client Services / Interactive Modals (Span 3) */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 text-xs font-semibold tracking-widest text-white/40 uppercase">Client Care</h3>
            <ul className="space-y-3 text-[14.5px]">
              {CLIENT_SERVICES.map((s) => {
                const Icon = s.icon;
                return (
                  <li key={s.label}>
                    <button
                      type="button"
                      onClick={() => openInfo(s.modal)}
                      className="group flex items-center gap-2 text-white/70 transition-colors duration-150 hover:text-white"
                    >
                      <Icon size={14} className="text-white/40 transition-colors group-hover:text-lav-300" />
                      <span>{s.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Wordmark */}
        <div className="relative mt-16 overflow-hidden border-t border-white/10 pt-10 select-none">
          <p
            className="display text-center font-black tracking-[-0.08em] leading-none text-[clamp(4.5rem,17vw,17rem)] text-white/[0.07] transition-colors duration-700 hover:text-white/[0.16] uppercase whitespace-nowrap cursor-default"
            aria-hidden="true"
          >
            SHOPNOW
          </p>
        </div>

        {/* Sub-footer */}
        <div className="flex items-center justify-center gap-4 border-t border-white/10 py-8 pb-20 text-[12.5px] text-white/50 md:justify-start md:pb-8">
          <div className="flex flex-wrap items-center justify-center gap-4 text-center md:justify-start md:text-left">
            <p>© {new Date().getFullYear()} SHOPNOW. All rights reserved.</p>
          </div>
        </div>
      </div>

    </footer>
  );
}

/** Back to top button for App.tsx */
export function BackToTop() {
  const show = useScrolledPast(900);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          onClick={() => scrollToId('top')}
          className="fixed bottom-5 right-5 z-30 grid size-12 place-items-center rounded-full bg-ink text-white shadow-[var(--shadow-pop)] hover:bg-electric transition-colors"
          style={{ marginBottom: 'env(safe-area-inset-bottom)', marginRight: 'env(safe-area-inset-right)' }}
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
