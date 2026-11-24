import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import type { ExploreState } from '../../types';
import { scrollToId } from '../../lib/utils';
import { useScrolledPast } from '../../hooks/useScrollY';
import { useShop } from '../../store/ShopProvider';

const SOCIAL = ['Instagram', 'YouTube', 'Pinterest', 'X'];
const ABOUT = ['Our story', 'Sustainability', 'Careers', 'Stores'];
const HELP = ['Shipping', 'Returns and exchanges', 'Size guide', 'Contact us', 'FAQs'];
const SHOP: { label: string; patch: Partial<ExploreState> }[] = [
  { label: 'Men', patch: { tab: 'men' } },
  { label: 'Women', patch: { tab: 'women' } },
  { label: 'New Arrivals', patch: { tab: 'new' } },
  { label: 'Sale', patch: { tab: 'sale' } },
];

/** 12. Footer: brand, shop links, about, help and social media. */
export function Footer() {
  const { shopWith, toast } = useShop();
  // Pages outside the landing page are out of scope for this frontend-only build.
  const placeholder = (label: string) => toast({ title: `${label} page`, description: 'This page is not part of the landing page demo.', tone: 'info' });

  return (
    <footer className="bg-ink text-white/70" aria-labelledby="footer-title">
      <div className="container-x pt-16 pb-10 md:pt-24">
        <div className="grid gap-12 grid-cols-2 md:grid-cols-4 lg:grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))]">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h2 id="footer-title" className="display text-[clamp(2.75rem,7vw,4.5rem)] tracking-[-0.06em] text-white">SHOP<span className="text-lav-300">NOW</span></h2>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed">Premium streetwear and everyday essentials, designed to move with you.</p>
          </div>
          <FooterCol title="Shop">
            {SHOP.map((l) => <li key={l.label}><button type="button" onClick={() => shopWith(l.patch)} className="hover:text-white">{l.label}</button></li>)}
          </FooterCol>
          <FooterCol title="About">
            {ABOUT.map((l) => <li key={l}><button type="button" onClick={() => placeholder(l)} className="hover:text-white">{l}</button></li>)}
          </FooterCol>
          <FooterCol title="Help">
            {HELP.map((l) => <li key={l}><button type="button" onClick={() => placeholder(l)} className="hover:text-white">{l}</button></li>)}
          </FooterCol>
          <FooterCol title="Social">
            {SOCIAL.map((l) => (
              <li key={l}>
                <button type="button" onClick={() => placeholder(l)} className="group inline-flex items-center gap-1 hover:text-white">
                  {l} <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </button>
              </li>
            ))}
          </FooterCol>
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-[13px]">
          <p>© {new Date().getFullYear()} SHOPNOW. All rights reserved.</p>
          <p>Frontend demo: sample products, prices and reviews. No real orders are placed.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-white">{title}</h3>
      <ul className="space-y-2.5 text-[14.5px]">{children}</ul>
    </div>
  );
}

/** Back to top: smooth scroll to the page beginning. */
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
          className="fixed bottom-5 right-5 z-30 grid size-12 place-items-center rounded-full bg-ink text-white shadow-[var(--shadow-pop)] hover:bg-electric"
          style={{ marginBottom: 'env(safe-area-inset-bottom)', marginRight: 'env(safe-area-inset-right)' }}
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
