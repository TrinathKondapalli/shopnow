import { AnimatePresence, motion } from 'motion/react';
import { History } from 'lucide-react';
import { getProduct } from '../../lib/catalog';
import { DUR, EASE } from '../../lib/motion';
import { scrollToId } from '../../lib/utils';
import { useShop } from '../../store/ShopProvider';
import { ProductImage } from '../product/ProductImage';
import { Price, SectionHeader } from '../product/bits';

/** 09. Recently viewed: updates every time a product's quick view opens; saved in localStorage. */
export function RecentlyViewed() {
  const { recentlyViewed, clearRecentlyViewed, openQuickView } = useShop();
  const items = recentlyViewed.map(getProduct).filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <section id="recent" className="border-t border-line bg-white py-20 md:py-24" aria-labelledby="recent-title">
      <div className="container-x">
        <SectionHeader
          eyebrow="Recently viewed"
          title="Pick up where you left off"
          id="recent-title"
          action={items.length > 0 && <button type="button" onClick={clearRecentlyViewed} className="text-sm font-semibold underline underline-offset-4 hover:text-electric">Clear history</button>}
        />
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-lav-300 bg-lav-50 px-6 py-12 text-center sm:flex-row sm:text-left">
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white text-electric"><History size={24} /></span>
            <div className="flex-1">
              <p className="font-semibold">Nothing here yet</p>
              <p className="mt-1 text-sm text-muted">Products you open will appear here, even after you refresh the page.</p>
            </div>
            <button type="button" onClick={() => scrollToId('shop')} className="btn btn-dark">Start browsing</button>
          </div>
        ) : (
          <motion.ul layout className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
            <AnimatePresence initial={false}>
              {items.map((p) => (
                <motion.li
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: DUR.filter, ease: EASE }}
                  className="w-40 shrink-0 md:w-48"
                >
                  <button type="button" onClick={() => openQuickView(p.id)} className="group w-full text-left">
                    <div className="aspect-square overflow-hidden rounded-2xl art-bg">
                      <ProductImage product={p} className="transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <p className="mt-2 truncate text-sm font-semibold group-hover:text-electric">{p.name}</p>
                    <Price product={p} className="text-xs" />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>
    </section>
  );
}
