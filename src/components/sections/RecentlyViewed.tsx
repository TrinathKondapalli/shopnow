import { AnimatePresence, motion } from 'motion/react';
import { getProduct } from '../../lib/catalog';
import { DUR, EASE } from '../../lib/motion';
import { inr } from '../../lib/utils';
import { useShop } from '../../store/ShopProvider';
import { ProductImage } from '../product/ProductImage';

/** 07. Recently viewed: updates every time a product's quick view opens. Matches Figma 121:728. */
export function RecentlyViewed() {
  const { recentlyViewed, clearRecentlyViewed, openQuickView } = useShop();
  const items = recentlyViewed.map(getProduct).filter((p): p is NonNullable<typeof p> => !!p);

  // First visit (nothing viewed yet): no section at all.
  if (items.length === 0) return null;
  const countStr = String(items.length).padStart(2, '0');

  return (
    <section id="recent" className="relative scroll-mt-16 overflow-hidden bg-bg-alt md:scroll-mt-20" aria-labelledby="recent-title">
      <div className="relative mx-auto w-full max-w-[1648px] px-4 pb-[69px] pt-14 sm:px-8 lg:pt-[95.7px] xl:px-[70.6px]">
        {/* Outline count decoration */}
        <div
          className="pointer-events-none absolute right-2 top-[-9.36px] select-none whitespace-nowrap font-display text-[150px] font-bold italic leading-normal tracking-[-6px] text-transparent sm:text-[220px] lg:text-[293px] lg:tracking-[-11.72px] xl:left-[1198.06px] xl:right-auto"
          style={{ WebkitTextStroke: '1px var(--color-border)' }}
          aria-hidden="true"
        >
          {countStr}
        </div>

        {/* Header */}
        <div className="relative flex flex-wrap items-end justify-between gap-6 xl:pl-[5.3px]">
          <div className="min-w-0">
            <div className="flex items-center gap-4">
              <span className="h-[1px] w-12 bg-accent" aria-hidden="true" />
              <p className="eyebrow">
                Recently viewed
              </p>
            </div>
            <h2
              id="recent-title"
              className="mt-2 font-display text-[30px] font-semibold leading-[1.15] tracking-[-0.01em] text-text md:text-[48px]"
            >
              Pick up where you <span className="italic text-accent">left off</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={clearRecentlyViewed}
            className="mb-2 min-h-11 text-[16px] font-semibold text-accent underline underline-offset-4 transition-colors hover:text-accent-hover"
          >
            Clear history
          </button>
        </div>

        {/* Rule / Top */}
        <div className="relative mt-10 h-[1px] w-full bg-border lg:mt-[64px]" aria-hidden="true" />

        <div className="relative py-8 md:px-[39.4px]">
          <motion.ul layout className="no-scrollbar -mx-4 flex snap-x gap-6 overflow-x-auto scroll-px-4 px-4 pb-2 sm:-mx-8 sm:scroll-px-8 sm:px-8 md:mx-0 md:scroll-px-0 md:px-0">
            <AnimatePresence initial={false}>
              {items.map((p) => (
                <motion.li
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: DUR.filter, ease: EASE }}
                  className="w-48 shrink-0 snap-start md:w-56"
                >
                  <button type="button" onClick={() => openQuickView(p.id)} className="group w-full cursor-pointer text-left">
                    <div className="aspect-[4/4.5] overflow-hidden rounded-[var(--radius-card)] bg-bg">
                      <ProductImage product={p} className="object-top transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <p className="mt-3 text-[16px] font-semibold leading-snug text-text transition-colors group-hover:text-accent">{p.name}</p>
                    <p className="mt-[2px] text-[15px] font-bold tabular-nums text-text">{inr(p.price)}</p>
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </div>

        {/* Rule / Bottom */}
        <div className="relative h-[1px] w-full bg-border" aria-hidden="true" />
      </div>
    </section>
  );
}
