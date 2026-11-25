import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, CircleCheck, Lock, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { LOOKS, getProduct, stockFor } from '../../lib/catalog';
import { cn, inr, scrollToId } from '../../lib/utils';
import { EASE } from '../../lib/motion';
import { FREE_SHIPPING_AT, useShop } from '../../store/ShopProvider';
import { ProductImage } from '../product/ProductImage';
import { Drawer } from './Drawer';

/** Shopping bag drawer with quantities, bundle savings, shipping and totals. */
export function CartDrawer() {
  const { panel, closePanel } = useShop();
  return <AnimatePresence>{panel === 'cart' && <CartPanel onClose={closePanel} />}</AnimatePresence>;
}

function CartPanel({ onClose }: { onClose: () => void }) {
  const { cart, totals, setLineQty, removeLine, clearCart, openQuickView } = useShop();
  const [placed, setPlaced] = useState<{ count: number; total: number } | null>(null);
  const placeOrder = () => { setPlaced({ count: totals.count, total: totals.total }); clearCart(); };
  const progress = Math.min(1, (totals.subtotal - totals.discount) / FREE_SHIPPING_AT);

  const top = totals.count > 0 && (
    <div className="mx-5 mb-2 rounded-2xl bg-lav-50 p-4">
      <p className="text-sm">
        {totals.toFreeShipping > 0
          ? <>Add <span className="font-semibold">{inr(totals.toFreeShipping)}</span> more for free shipping.</>
          : <span className="font-semibold text-success">You’ve unlocked free shipping.</span>}
      </p>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-lav-200">
        <motion.div className="h-full rounded-full bg-electric" initial={false} animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.5, ease: EASE }} />
      </div>
    </div>
  );

  const footer = totals.count > 0 && (
    <div className="space-y-2 text-sm tabular-nums">
      <Row label="Subtotal" value={inr(totals.subtotal)} />
      {totals.discount > 0 && <Row label="Look bundle savings (15%)" value={`−${inr(totals.discount)}`} className="text-success" />}
      <Row label="Shipping" value={totals.shipping ? inr(totals.shipping) : 'Free'} />
      <Row label="Total" value={inr(totals.total)} className="pt-1 text-base font-bold" />
      <p className="text-xs text-muted">Prices include GST.</p>
      <button
        type="button"
        className="btn btn-dark mt-2 h-13 w-full"
        onClick={placeOrder}
      >
        <Lock size={16} /> Checkout · {inr(totals.total)}
      </button>
      <p className="text-center text-xs text-muted">Demo store: no payment is taken.</p>
      <button type="button" onClick={onClose} className="w-full py-2 text-center text-sm font-semibold underline underline-offset-4">Continue shopping</button>
    </div>
  );

  return (
    <Drawer title="Your bag" count={totals.count} onClose={onClose} top={top} footer={footer} returnFocusTo="[data-bag-target]">
      {placed && cart.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center" role="status">
          <span className="grid size-16 place-items-center rounded-full bg-lav-100 text-success"><CircleCheck size={30} /></span>
          <p className="display text-2xl">Thanks for shopping with us</p>
          <p className="max-w-xs text-sm text-muted">
            Your demo order of {placed.count} {placed.count === 1 ? 'item' : 'items'} ({inr(placed.total)}) is complete.
            This is a demo store, so no payment was taken and nothing will be shipped.
          </p>
          <button type="button" className="btn btn-dark mt-2" onClick={() => { onClose(); scrollToId('shop'); }}>Continue shopping <ArrowRight size={16} className="arrow" /></button>
        </div>
      ) : cart.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-lav-100 text-electric"><ShoppingBag size={28} /></span>
          <p className="display text-2xl">Your bag is empty</p>
          <p className="max-w-xs text-sm text-muted">Items you add will stay here, even if you refresh or come back later.</p>
          <button type="button" className="btn btn-dark mt-2" onClick={() => { onClose(); scrollToId('shop'); }}>Start shopping <ArrowRight size={16} className="arrow" /></button>
        </div>
      ) : (
        <ul>
          <AnimatePresence initial={false}>
            {cart.map((line) => {
              const p = getProduct(line.productId)!;
              const others = cart.filter((l) => l.key !== line.key && l.productId === line.productId && l.color === line.color && l.size === line.size).reduce((s, l) => s + l.qty, 0);
              const max = stockFor(p, line.color, line.size) - others;
              const look = line.lookId ? LOOKS.find((l) => l.id === line.lookId) : undefined;
              return (
                <motion.li
                  key={line.key}
                  layout
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40, height: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="overflow-hidden border-b border-line"
                >
                  <div className="grid grid-cols-[84px_1fr] gap-4 py-4">
                    <button type="button" onClick={() => openQuickView(p.id, line.color)} className="h-[100px] overflow-hidden rounded-xl art-bg" aria-label={`View ${p.name}`}>
                      <ProductImage product={p} color={line.color} inset="p-2" />
                    </button>
                    <div className="flex min-w-0 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold leading-snug">{p.name}</p>
                        <p className="font-semibold tabular-nums">{inr(p.price * line.qty)}</p>
                      </div>
                      <p className="mt-0.5 text-xs text-muted">{p.colors[line.color].name} · {line.size}{line.qty > 1 && ` · ${inr(p.price)} each`}</p>
                      {look && <p className="mt-1 w-fit rounded-full bg-lav-100 px-2 py-0.5 text-[11px] font-semibold text-electric-600">{look.name} bundle</p>}
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex h-9 items-center rounded-full border border-line" role="group" aria-label={`Quantity of ${p.name}`}>
                          <button type="button" onClick={() => setLineQty(line.key, line.qty - 1)} className="grid size-9 place-items-center" aria-label="Decrease quantity"><Minus size={14} /></button>
                          <span className="w-6 text-center text-sm font-semibold tabular-nums">{line.qty}</span>
                          <button type="button" onClick={() => setLineQty(line.key, line.qty + 1)} disabled={line.qty >= max} className="grid size-9 place-items-center disabled:opacity-30" aria-label="Increase quantity"><Plus size={14} /></button>
                        </div>
                        <button type="button" onClick={() => removeLine(line.key)} className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-danger" aria-label={`Remove ${p.name}`}>
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                      {line.qty >= max && <p className="mt-1 text-[11px] text-warn">Max available in this size</p>}
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

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return <div className={cn('flex justify-between', className)}><span>{label}</span><span>{value}</span></div>;
}
