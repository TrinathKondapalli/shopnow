import type { CSSProperties } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { getProduct } from '../../lib/catalog';
import { DUR, EASE } from '../../lib/motion';
import { cn, inr, scrollToId } from '../../lib/utils';
import { useShop } from '../../store/ShopProvider';
import { ProductImage } from '../product/ProductImage';

function Icon({ src, className }: { src: string; className?: string }) {
  return <span className={cn('figma-icon', className)} style={{ '--icon': `url(${src})` } as CSSProperties} aria-hidden="true" />;
}

/** 07. Recently viewed: updates every time a product's quick view opens. Matches Figma 121:728. */
export function RecentlyViewed() {
  const { recentlyViewed, clearRecentlyViewed, openQuickView } = useShop();
  const items = recentlyViewed.map(getProduct).filter((p): p is NonNullable<typeof p> => !!p);
  const countStr = String(items.length).padStart(2, '0');

  return (
    <section id="recent" className="relative scroll-mt-16 md:scroll-mt-20 overflow-hidden bg-[#F9F2EC]" aria-labelledby="recent-title">
      <div className="relative mx-auto w-full max-w-[1648px] px-4 pb-[69px] pt-14 sm:px-8 lg:pt-[95.7px] xl:px-[70.6px]">
        {/* Outline count decoration 121:729 (only once there is something to count) */}
        {items.length > 0 && (
        <div
          className="pointer-events-none absolute right-2 top-[-9.36px] select-none whitespace-nowrap text-[150px] font-extrabold italic leading-normal tracking-[-6px] text-transparent sm:text-[220px] lg:text-[293px] lg:tracking-[-11.72px] xl:left-[1198.06px] xl:right-auto"
          style={{ WebkitTextStroke: '1px #8B4DFF' }}
          aria-hidden="true"
        >
          {countStr}
        </div>
        )}

        {/* Header 121:730-121:732 */}
        <div className="relative flex flex-wrap items-end justify-between gap-6 xl:pl-[5.3px]">
          <div>
            <div className="flex items-center gap-[20.3px]">
              <span className="h-[2.2px] w-[50.1px] bg-electric-alt" aria-hidden="true" />
              <p className="text-[16px] font-semibold uppercase leading-normal tracking-[2.625px] text-ink sm:text-[21px]">
                Recently viewed
              </p>
            </div>
            <h2
              id="recent-title"
              className="mt-[8.3px] text-[44px] font-extrabold leading-normal tracking-[-1.5px] text-ink sm:text-[64px] lg:text-[92px] lg:tracking-[-3.22px]"
            >
              Pick up where you <span className="italic text-electric-alt">left off</span>
            </h2>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={clearRecentlyViewed}
              className="mb-4 text-[18px] font-semibold leading-normal tracking-[-0.11px] text-ink underline underline-offset-4 transition-colors hover:text-electric-alt"
            >
              Clear history
            </button>
          )}
        </div>

        {/* Rule / Top 121:733 */}
        <div className="relative mt-10 h-[1.5px] w-full bg-ink lg:mt-[77.2px]" aria-hidden="true" />

        {items.length === 0 ? (
          <div className="relative flex flex-col items-start gap-6 py-8 md:min-h-[159.4px] md:flex-row md:pb-8 md:items-start md:gap-0 md:py-0 md:pl-[39.4px] md:pr-[19px]">
            {/* icon/history 121:735 */}
            <span className="relative block size-[56px] shrink-0 text-electric-alt md:mt-[46.3px] md:size-[66px]">
              <span className="absolute inset-[12.5%]">
                <span className="absolute inset-[-6.11%]">
                  <Icon src="/figma/recent/history.svg" />
                </span>
              </span>
            </span>

            {/* Empty Divider 121:740 */}
            <span className="hidden h-[93.3px] w-[1.5px] shrink-0 bg-ink md:ml-[61.1px] md:mt-[31.9px] md:block" aria-hidden="true" />

            <div className="min-w-0 flex-1 md:ml-[50.5px] md:mt-[31.3px]">
              <h3 className="text-[28px] font-bold leading-normal tracking-[0.663px] text-ink lg:text-[39px]">Nothing here yet</h3>
              <p className="mt-[5.5px] text-[17px] leading-normal tracking-[-0.069px] text-[#4B4B50] lg:text-[23px]">
                Products you open will appear here, even after you refresh the page.
              </p>
            </div>

            {/* Start Browsing Button 121:743 */}
            <button
              type="button"
              onClick={() => scrollToId('shop')}
              className="group flex h-[65.3px] w-full shrink-0 items-center justify-between bg-ink pl-[42.5px] pr-[36.4px] text-[22px] font-semibold leading-normal tracking-[-0.11px] text-white transition-colors hover:bg-ink-hover sm:w-[306.5px] md:ml-6 md:mt-[47.1px]"
            >
              <span>Start browsing</span>
              <span className="relative block size-[24px] shrink-0 transition-transform duration-200 group-hover:translate-x-1">
                <span className="absolute inset-[20.83%_16.67%]">
                  <span className="absolute inset-[-6.43%_-5.62%]">
                    <Icon src="/figma/recent/arrow-right.svg" />
                  </span>
                </span>
              </span>
            </button>
          </div>
        ) : (
          <div className="relative py-8 md:px-[39.4px]">
            <motion.ul layout className="no-scrollbar -mx-4 flex gap-6 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
              <AnimatePresence initial={false}>
                {items.map((p) => (
                  <motion.li
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: DUR.filter, ease: EASE }}
                    className="w-48 shrink-0 md:w-56"
                  >
                    <button type="button" onClick={() => openQuickView(p.id)} className="group w-full cursor-pointer text-left">
                      <div className="aspect-[4/4.5] overflow-hidden bg-[#EAE2DE]">
                        <ProductImage product={p} className="transition-transform duration-300 group-hover:scale-105" />
                      </div>
                      <p className="mt-3 truncate text-[18px] font-bold leading-normal tracking-[-0.185px] text-ink transition-colors group-hover:text-electric-alt">{p.name}</p>
                      <p className="mt-[2px] text-[17px] leading-normal tracking-[-0.085px] text-[#4B4B50]">{inr(p.price)}</p>
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </div>
        )}

        {/* Rule / Bottom 121:734 */}
        <div className="relative h-[1.5px] w-full bg-ink" aria-hidden="true" />
      </div>
    </section>
  );
}
