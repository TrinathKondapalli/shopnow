import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, CircleCheck, Lock, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { LOOKS, getProduct, stockFor } from '../../lib/catalog';
import { cn, inr, scrollToId } from '../../lib/utils';
import { EASE } from '../../lib/motion';
import { FREE_SHIPPING_AT, useShop } from '../../store/ShopProvider';
import { ProductImage } from '../product/ProductImage';
import { Drawer } from './Drawer';

/** Shopping bag drawer with quantities, savings, shipping and totals. */
export function CartDrawer() {
  const { panel, closePanel } = useShop();
  return <AnimatePresence>{panel === 'cart' && <CartPanel onClose={closePanel} />}</AnimatePresence>;
}

function CartPanel({ onClose }: { onClose: () => void }) {
  const { cart, totals, setLineQty, removeLine, clearCart, openQuickView } = useShop();
  const [placed, setPlaced] = useState<{ count: number; total: number } | null>(null);
  const placeOrder = () => { setPlaced({ count: totals.count, total: totals.total }); clearCart(); };
  const progress = Math.min(1, (totals.subtotal - totals.discount) / FREE_SHIPPING_AT);

  // Savings = markdowns (compareAt − price, per unit) plus the look-bundle discount.
  const markdown = cart.reduce((s, l) => {
    const p = getProduct(l.productId);
    return p?.compareAt && p.compareAt > p.price ? s + (p.compareAt - p.price) * l.qty : s;
  }, 0);
  const saved = markdown + totals.discount;

  const top = totals.count > 0 && (
    <div className="mx-5 mb-2 rounded-[var(--radius-card)] bg-bg-alt p-4">
      <p className="text-sm text-text">
        {totals.toFreeShipping > 0
          ? <>Add <span className="font-semibold tabular-nums">{inr(totals.toFreeShipping)}</span> more for free shipping.</>
          : <span className="font-semibold text-success">You’ve unlocked free shipping.</span>}
      </p>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-border" role="progressbar" aria-label="Progress to free shipping" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
        <motion.div className="h-full rounded-full bg-accent" initial={false} animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.5, ease: EASE }} />
      </div>
    </div>
  );

  const footer = totals.count > 0 && (
    <div className="space-y-2 text-sm tabular-nums text-text">
      <CouponField />
      <Row label="Subtotal" value={inr(totals.subtotal)} />
      {totals.discount > 0 && <Row label="Look bundle savings (15%)" value={`−${inr(totals.discount)}`} className="text-success" />}
      <Row label="Shipping" value={totals.shipping ? inr(totals.shipping) : 'Free'} />
      <Row label="Total" value={inr(totals.total)} className="pt-1 text-base font-bold" />
      {saved > 0 && <p className="rounded-btn bg-success/10 px-3 py-2 font-semibold text-success">You save {inr(saved)} on this order</p>}
      <p className="text-xs text-text-muted">Prices include GST.</p>
      <button
        type="button"
        className="btn btn-dark mt-2 h-13 w-full"
        onClick={placeOrder}
      >
        <Lock size={16} aria-hidden="true" /> Checkout · {inr(totals.total)}
      </button>
      <p className="text-center text-xs text-text-muted">Demo store: no payment is taken.</p>
      <button type="button" onClick={onClose} className="min-h-11 w-full py-2 text-center text-sm font-semibold text-accent underline underline-offset-4 hover:text-accent-hover">Continue shopping</button>
    </div>
  );

  return (
    <Drawer title="Your bag" count={totals.count} onClose={onClose} top={top} footer={footer} returnFocusTo="[data-bag-target]">
      {placed && cart.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center" role="status">
          <span className="grid size-16 place-items-center rounded-full bg-success/10 text-success" aria-hidden="true"><CircleCheck size={30} /></span>
          <p className="display text-2xl text-text">Thanks for shopping with us</p>
          <p className="max-w-xs text-sm text-text-muted">
            Your demo order of {placed.count} {placed.count === 1 ? 'item' : 'items'} ({inr(placed.total)}) is complete.
            This is a demo store, so no payment was taken and nothing will be shipped.
          </p>
          <button type="button" className="btn btn-dark mt-2" onClick={() => { onClose(); scrollToId('shop'); }}>Continue shopping <ArrowRight size={16} className="arrow" /></button>
        </div>
      ) : cart.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-accent-soft text-accent" aria-hidden="true"><ShoppingBag size={28} /></span>
          <p className="display text-2xl text-text">Your bag is empty</p>
          <p className="max-w-xs text-sm text-text-muted">Items you add will stay here, even if you refresh or come back later.</p>
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
              const was = p.compareAt && p.compareAt > p.price ? p.compareAt * line.qty : 0;
              return (
                <motion.li
                  key={line.key}
                  layout
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40, height: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="overflow-hidden border-b border-border"
                >
                  <div className="grid grid-cols-[84px_1fr] gap-4 py-4">
                    <button type="button" onClick={() => openQuickView(p.id, line.color)} className="h-[100px] overflow-hidden rounded-[var(--radius-card)] border border-border art-bg" aria-label={`View ${p.name}`}>
                      <ProductImage product={p} color={line.color} inset="p-2" alt="" />
                    </button>
                    <div className="flex min-w-0 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <p className="min-w-0 font-semibold leading-snug text-text">{p.name}</p>
                        <p className="shrink-0 text-right tabular-nums">
                          <span className="block font-semibold text-text">{inr(p.price * line.qty)}</span>
                          {was > 0 && <span className="block text-xs text-text-muted line-through"><span className="sr-only">was </span>{inr(was)}</span>}
                        </p>
                      </div>
                      <p className="mt-0.5 text-xs text-text-muted">{p.colors[line.color].name} · {line.size}{line.qty > 1 && ` · ${inr(p.price)} each`}</p>
                      {look && <p className="mt-1 w-fit rounded-pill bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent">{look.name} bundle</p>}
                      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                        <div className="flex h-11 items-center rounded-pill border border-border-strong" role="group" aria-label={`Quantity of ${p.name}`}>
                          <button type="button" onClick={() => setLineQty(line.key, line.qty - 1)} className="grid size-11 place-items-center rounded-full text-text hover:text-accent" aria-label={line.qty === 1 ? `Remove ${p.name}` : 'Decrease quantity'}><Minus size={14} /></button>
                          <span className="w-6 text-center text-sm font-semibold tabular-nums" aria-live="polite">{line.qty}</span>
                          <button type="button" onClick={() => setLineQty(line.key, line.qty + 1)} disabled={line.qty >= max} className="grid size-11 place-items-center rounded-full text-text hover:text-accent disabled:opacity-30" aria-label="Increase quantity"><Plus size={14} /></button>
                        </div>
                        <button type="button" onClick={() => removeLine(line.key)} className="-mr-2 inline-flex min-h-11 items-center gap-1 rounded-pill px-2 text-xs font-medium text-text-muted hover:text-error" aria-label={`Remove ${p.name}`}>
                          <Trash2 size={14} aria-hidden="true" /> Remove
                        </button>
                      </div>
                      {line.qty >= max && <p className="mt-1 text-xs text-warning">Max available in this size</p>}
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

/** Coupon entry. UI only for now: no codes are validated and no discount is applied. */
function CouponField() {
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');
  return (
    <form
      noValidate
      className="pb-2"
      onSubmit={(e) => { e.preventDefault(); setMsg(code.trim() ? 'Coupon codes coming soon' : 'Enter a coupon code first.'); }}
    >
      <label htmlFor="bag-coupon" className="sr-only">Coupon code</label>
      <div className="flex gap-2">
        <input
          id="bag-coupon"
          name="coupon"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder="Coupon code"
          value={code}
          onChange={(e) => { setCode(e.target.value); setMsg(''); }}
          aria-describedby="bag-coupon-msg"
          className="h-11 min-w-0 flex-1 rounded-input border border-border-strong bg-bg px-4 text-[16px] uppercase text-text placeholder:normal-case placeholder:text-text-muted focus:border-accent"
        />
        <button type="submit" className="h-11 shrink-0 rounded-btn bg-action px-5 text-sm font-semibold text-action-text transition-colors hover:bg-action-hover">Apply</button>
      </div>
      <p id="bag-coupon-msg" className="mt-1.5 min-h-4 text-xs text-text-muted" aria-live="polite">{msg}</p>
    </form>
  );
}

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return <div className={cn('flex justify-between', className)}><span>{label}</span><span>{value}</span></div>;
}
