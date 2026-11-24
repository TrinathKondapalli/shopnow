import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { getProduct, isSoldOut } from '../../lib/catalog';
import { scrollToId } from '../../lib/utils';
import { EASE } from '../../lib/motion';
import { useShop } from '../../store/ShopProvider';
import { ProductImage } from '../product/ProductImage';
import { Price } from '../product/bits';
import { Drawer } from './Drawer';

/** Wishlist drawer: view, remove and pick options for saved products. */
export function WishlistDrawer() {
  const { panel, closePanel } = useShop();
  return <AnimatePresence>{panel === 'wishlist' && <WishlistPanel onClose={closePanel} />}</AnimatePresence>;
}

function WishlistPanel({ onClose }: { onClose: () => void }) {
  const { wishlist, removeWish, openQuickView, toast } = useShop();
  const items = wishlist.map(getProduct).filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <Drawer
      title="Wishlist"
      count={items.length}
      onClose={onClose}
      returnFocusTo="[data-wishlist-target]"
      footer={items.length > 0 && <p className="text-center text-xs text-muted">Saved in this browser. Choose a size to move an item to your bag.</p>}
    >
      {items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-lav-100 text-electric"><Heart size={28} /></span>
          <p className="display text-2xl">No saved items yet</p>
          <p className="max-w-xs text-sm text-muted">Tap the heart on any product to save it for later.</p>
          <button type="button" className="btn btn-dark mt-2" onClick={() => { onClose(); scrollToId('shop'); }}>Explore products <ArrowRight size={16} className="arrow" /></button>
        </div>
      ) : (
        <ul>
          <AnimatePresence initial={false}>
            {items.map((p) => {
              const soldOut = isSoldOut(p);
              return (
                <motion.li
                  key={p.id}
                  layout
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40, height: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="overflow-hidden border-b border-line"
                >
                  <div className="grid grid-cols-[84px_1fr] gap-4 py-4">
                    <button type="button" onClick={() => openQuickView(p.id)} className="h-[100px] overflow-hidden rounded-xl art-bg" aria-label={`View ${p.name}`}>
                      <ProductImage product={p} inset="p-2" />
                    </button>
                    <div className="flex min-w-0 flex-col">
                      <p className="font-semibold leading-snug">{p.name}</p>
                      <p className="text-xs text-muted">{p.type} · {p.colors.length} colours</p>
                      <Price product={p} className="mt-1 text-sm" />
                      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                        <button type="button" disabled={soldOut} onClick={() => openQuickView(p.id)} className="btn btn-dark h-9 px-4 text-xs">
                          <ShoppingBag size={14} /> {soldOut ? 'Sold out' : 'Select size'}
                        </button>
                        <button
                          type="button"
                          onClick={() => { removeWish(p.id); toast({ title: 'Removed from wishlist', description: p.name, tone: 'info' }); }}
                          className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-danger"
                          aria-label={`Remove ${p.name} from wishlist`}
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </Drawer>
  );
}
