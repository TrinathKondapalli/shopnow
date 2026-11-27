import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import type { Product } from '../../types';
import { colorStock, getProduct, isSoldOut, stockFor } from '../../lib/catalog';
import { cn, scrollToId } from '../../lib/utils';
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
  const { wishlist } = useShop();
  const items = wishlist.map(getProduct).filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <Drawer
      title="Wishlist"
      count={items.length}
      onClose={onClose}
      returnFocusTo="[data-wishlist-target]"
      footer={items.length > 0 && <p className="text-center text-xs text-text-muted">Saved in this browser. Choose a size to move an item to your bag.</p>}
    >
      {items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-accent-soft text-accent" aria-hidden="true"><Heart size={28} /></span>
          <p className="display text-2xl text-text">No saved items yet</p>
          <p className="max-w-xs text-sm text-text-muted">Tap the heart on any product to save it for later.</p>
          <button type="button" className="btn btn-dark mt-2" onClick={() => { onClose(); scrollToId('shop'); }}>Explore products <ArrowRight size={16} className="arrow" /></button>
        </div>
      ) : (
        <ul>
          <AnimatePresence initial={false}>
            {items.map((p) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40, height: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="overflow-hidden border-b border-border"
              >
                <WishRow product={p} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </Drawer>
  );
}

/** One saved product: pick a size and move it straight to the bag. */
function WishRow({ product: p }: { product: Product }) {
  const { removeWish, openQuickView, addToCart, toast, openPanel } = useShop();
  const color = Math.max(0, p.colors.findIndex((_, i) => colorStock(p, i) > 0));
  const oneSize = p.sizes.length === 1;
  const [size, setSize] = useState(oneSize ? p.sizes[0] : '');
  const [missing, setMissing] = useState(false);
  const soldOut = isSoldOut(p);

  const move = () => {
    if (!size) { setMissing(true); return; }
    const r = addToCart(p.id, color, size, 1);
    if (!r.ok) { toast({ title: 'That size is sold out', description: `${p.name} · ${size}`, tone: 'error' }); return; }
    removeWish(p.id);
    toast({ title: 'Moved to bag', description: `${p.name} · ${p.colors[color].name} · ${size}`, action: { label: 'View bag', onClick: () => openPanel('cart') } });
  };

  return (
    <div className="grid grid-cols-[84px_1fr] gap-4 py-4">
      <button type="button" onClick={() => openQuickView(p.id, color)} className="h-[100px] overflow-hidden rounded-[var(--radius-card)] border border-border art-bg" aria-label={`View ${p.name}`}>
        <ProductImage product={p} color={color} inset="p-2" alt="" />
      </button>
      <div className="flex min-w-0 flex-col">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold leading-snug text-text">{p.name}</p>
          <button
            type="button"
            onClick={() => { removeWish(p.id); toast({ title: 'Removed from wishlist', description: p.name, tone: 'info' }); }}
            className="-mr-2 -mt-2 grid size-11 shrink-0 place-items-center rounded-full text-text-muted hover:bg-accent-soft hover:text-error"
            aria-label={`Remove ${p.name} from wishlist`}
          >
            <Trash2 size={15} />
          </button>
        </div>
        <p className="text-xs text-text-muted">{p.type} · {p.colors[color].name}</p>
        <Price product={p} className="mt-1 text-sm" />
        {soldOut ? (
          <p className="mt-auto pt-2 text-xs font-semibold text-error">Sold out</p>
        ) : (
          <div className="mt-auto flex items-center gap-2 pt-2">
            {!oneSize && (
              <select
                value={size}
                onChange={(e) => { setSize(e.target.value); setMissing(false); }}
                aria-label={`Size for ${p.name}`}
                aria-invalid={missing}
                className={cn('h-11 min-w-0 flex-1 rounded-input border bg-bg px-3 text-[14px] font-medium text-text', missing ? 'border-error text-error' : 'border-border-strong')}
              >
                <option value="">{missing ? 'Pick a size' : 'Size'}</option>
                {p.sizes.map((s) => {
                  const out = stockFor(p, color, s) === 0;
                  return <option key={s} value={s} disabled={out}>{s}{out ? ' (sold out)' : ''}</option>;
                })}
              </select>
            )}
            <button type="button" onClick={move} className="btn btn-dark h-11 shrink-0 px-4 text-[13px]">
              <ShoppingBag size={14} /> Move to bag
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
