import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown, ChevronLeft, ChevronRight, LoaderCircle, Minus, Plus, Ruler, Truck, X } from 'lucide-react';
import type { Product } from '../../types';
import { LOW_STOCK, getProduct, stockFor } from '../../lib/catalog';
import { cn } from '../../lib/utils';
import { DUR, EASE } from '../../lib/motion';
import { flyToBag } from '../../lib/flyToBag';
import { useDialog, useLockBodyScroll } from '../../hooks/useOverlay';
import { useShop } from '../../store/ShopProvider';
import type { GarmentView } from '../art/Garment';
import { ProductImage } from '../product/ProductImage';
import { Price, Stars, WishButton } from '../product/bits';

const VIEWS: { id: GarmentView; label: string }[] = [
  { id: 'front', label: 'Front' },
  { id: 'alt', label: 'Alternate' },
  { id: 'detail', label: 'Fabric detail' },
];

/** Product quick view: fade and scale, 300ms. */
export function QuickView() {
  const { quickView, closeQuickView } = useShop();
  const product = quickView ? getProduct(quickView.productId) : undefined;
  return (
    <AnimatePresence>
      {product && quickView && (
        <QuickViewDialog key={product.id} product={product} initialColor={quickView.color} onClose={closeQuickView} />
      )}
    </AnimatePresence>
  );
}

type AddState = 'idle' | 'adding' | 'added';

function QuickViewDialog({ product: p, initialColor, onClose }: { product: Product; initialColor: number; onClose: () => void }) {
  const { addToCart, variantInCart, toast, openPanel } = useShop();
  const ref = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const oneSize = p.sizes.length === 1;
  const [color, setColor] = useState(Math.min(initialColor, p.colors.length - 1));
  const [view, setView] = useState(0);
  const [size, setSize] = useState<string | null>(oneSize ? p.sizes[0] : null);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [state, setState] = useState<AddState>('idle');
  const [openInfo, setOpenInfo] = useState<string | null>('details');
  useLockBodyScroll(true);
  useDialog(ref, true, onClose);

  const stock = size ? stockFor(p, color, size) : 0;
  const inBag = size ? variantInCart(p.id, color, size) : 0;
  const available = Math.max(0, stock - inBag);
  const maxQty = Math.max(1, available);

  const pickColor = (i: number) => { setColor(i); setQty(1); };
  const pickSize = (s: string) => { setSize(s); setSizeError(false); setQty(1); };

  const add = () => {
    if (!size) { setSizeError(true); return; }
    if (available <= 0 || state === 'adding') return;
    setState('adding');
    window.setTimeout(() => {
      const r = addToCart(p.id, color, size, qty);
      if (!r.ok) { setState('idle'); toast({ title: 'Sold out', description: 'This size just sold out.', tone: 'error' }); return; }
      flyToBag(imageRef.current);
      setState('added');
      setQty(1);
      toast({
        title: r.reason === 'limited' ? `Added ${r.added}, the last in stock` : 'Added to bag',
        description: `${p.name} · ${p.colors[color].name} · ${size}`,
        action: { label: 'View bag', onClick: () => { onClose(); openPanel('cart'); } },
      });
      window.setTimeout(() => setState('idle'), 1800);
    }, 450);
  };

  let stockNote: { text: string; tone: string } | null = null;
  if (size) {
    if (stock === 0) stockNote = { text: `Out of stock in ${size}. Try another size or colour.`, tone: 'text-danger' };
    else if (available === 0) stockNote = { text: `You have all ${stock} in your bag.`, tone: 'text-warn' };
    else if (stock <= LOW_STOCK) stockNote = { text: `Only ${available} left in ${size}. Order soon.`, tone: 'text-warn' };
    else stockNote = { text: 'In stock, ships in 1 to 2 days.', tone: 'text-success' };
  }

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center p-0 md:p-6">
      <motion.div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: DUR.quickView }} onClick={onClose} />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="qv-title"
        className="relative grid h-full w-full max-w-[1080px] overflow-y-auto bg-white md:h-auto md:max-h-[92vh] md:grid-cols-[1.1fr_1fr] md:overflow-hidden md:rounded-[28px]"
        style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: DUR.quickView, ease: EASE }}
      >
        <button type="button" onClick={onClose} className="icon-btn absolute right-3 top-3 z-20 bg-white/80 backdrop-blur" aria-label="Close product details" style={{ marginTop: 'env(safe-area-inset-top)' }}>
          <X size={20} />
        </button>

        {/* Gallery */}
        <div className="flex flex-col gap-3 bg-[#F4F2F8] p-4 md:p-6">
          <div ref={imageRef} className="relative aspect-[4/5] overflow-hidden rounded-2xl art-bg md:aspect-auto md:flex-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={`${color}-${view}`} className={cn('absolute inset-0', view === 1 && 'art-bg-alt')} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <ProductImage product={p} color={color} view={VIEWS[view].id} inset="p-[10%]" />
              </motion.div>
            </AnimatePresence>
            <button type="button" onClick={() => setView((v) => (v + 2) % 3)} className="icon-btn absolute left-3 top-1/2 size-10 -translate-y-1/2 bg-white/90 shadow-sm" aria-label="Previous image"><ChevronLeft size={18} /></button>
            <button type="button" onClick={() => setView((v) => (v + 1) % 3)} className="icon-btn absolute right-3 top-1/2 size-10 -translate-y-1/2 bg-white/90 shadow-sm" aria-label="Next image"><ChevronRight size={18} /></button>
            <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium">{VIEWS[view].label} · {view + 1}/3</span>
          </div>
          <div className="grid grid-cols-3 gap-3" role="group" aria-label="Product images">
            {VIEWS.map((v, i) => (
              <button key={v.id} type="button" onClick={() => setView(i)} aria-pressed={view === i} aria-label={`Show ${v.label.toLowerCase()} image`} className={cn('aspect-[4/3] overflow-hidden rounded-xl border-2 transition-colors', view === i ? 'border-ink' : 'border-transparent hover:border-ink/30', i === 1 ? 'art-bg-alt' : 'art-bg')}>
                <ProductImage product={p} color={color} view={v.id} inset="p-2" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5 p-5 md:overflow-y-auto md:p-8">
          <div className="pr-10">
            <p className="text-sm text-muted">{p.type} · {p.gender === 'unisex' ? 'Unisex' : p.gender === 'men' ? 'Men' : 'Women'}</p>
            <h2 id="qv-title" className="display mt-1 text-[clamp(1.8rem,3.5vw,2.4rem)]">{p.name}</h2>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted"><Stars value={p.rating} /> {p.rating} · {p.reviewCount} reviews</div>
            <Price product={p} className="mt-3 text-xl" />
          </div>
          <p className="text-[15px] leading-relaxed text-ink-2">{p.description}</p>

          <div>
            <p className="mb-2 text-sm"><span className="font-semibold">Colour:</span> {p.colors[color].name}</p>
            <div className="flex gap-2.5">
              {p.colors.map((c, i) => (
                <button key={c.name} type="button" onClick={() => pickColor(i)} aria-pressed={i === color} aria-label={c.name} className={cn('size-9 rounded-full border border-black/10 ring-offset-2 transition-shadow', i === color ? 'ring-2 ring-ink' : 'hover:ring-1 hover:ring-ink/40')} style={{ background: c.hex }} />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span><span className="font-semibold">Size:</span> {size ?? <span className="text-muted">Select a size</span>}</span>
              <span className="inline-flex items-center gap-1 text-muted"><Ruler size={14} /> True to size</span>
            </div>
            <div className={cn('flex flex-wrap gap-2', sizeError && 'animate-shake')} role="radiogroup" aria-label="Size">
              {p.sizes.map((s) => {
                const n = stockFor(p, color, s);
                const out = n === 0;
                return (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={size === s}
                    onClick={() => pickSize(s)}
                    className={cn(
                      'relative h-11 min-w-12 rounded-full border px-4 text-sm font-semibold transition-colors duration-150',
                      size === s ? 'border-ink bg-ink text-white' : 'border-line hover:border-ink',
                      out && size !== s && 'text-muted line-through decoration-1',
                    )}
                    aria-label={`${s}${out ? ', out of stock' : n <= LOW_STOCK ? `, only ${n} left` : ''}`}
                  >
                    {s}
                    {!out && n <= LOW_STOCK && <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-white bg-warn" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
            <p className={cn('mt-2 min-h-5 text-sm font-medium', sizeError ? 'text-danger' : stockNote?.tone)} aria-live="polite">
              {sizeError ? 'Please select a size.' : stockNote?.text}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-13 shrink-0 items-center rounded-full border border-line" role="group" aria-label="Quantity">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} className="grid size-11 place-items-center rounded-full disabled:opacity-30 sm:size-12" aria-label="Decrease quantity"><Minus size={16} /></button>
              <output className="w-8 text-center font-semibold tabular-nums" aria-live="polite">{qty}</output>
              <button type="button" onClick={() => setQty((q) => Math.min(maxQty, q + 1))} disabled={!size || qty >= maxQty} className="grid size-11 place-items-center rounded-full disabled:opacity-30 sm:size-12" aria-label="Increase quantity"><Plus size={16} /></button>
            </div>
            <button
              type="button"
              onClick={add}
              disabled={!!size && available === 0}
              className={cn('btn h-13 min-w-0 flex-1 text-[15px] sm:min-w-[200px]', state === 'added' ? 'bg-success text-white' : 'btn-dark')}
            >
              {state === 'adding' && <><LoaderCircle size={18} className="animate-spin" /> Adding…</>}
              {state === 'added' && <>Added to bag <Check size={18} /></>}
              {state === 'idle' && (size && available === 0 ? 'Out of stock' : 'Add to bag')}
            </button>
            <WishButton product={p} className="size-13 shrink-0 border border-line" size={20} />
          </div>
          {size && qty >= maxQty && available > 1 && <p className="-mt-3 text-xs text-muted">That’s all we have in stock for this size.</p>}

          <div className="border-t border-line">
            {[
              { id: 'details', title: 'Details and fit', body: <ul className="list-disc space-y-1 pl-5">{p.details.map((d) => <li key={d}>{d}</li>)}</ul> },
              { id: 'delivery', title: 'Delivery and returns', body: <p className="flex gap-2"><Truck size={16} className="mt-0.5 shrink-0" /> Free shipping above ₹999. Delivered in 3 to 5 days. Easy 7-day returns and size exchanges.</p> },
            ].map((s) => (
              <div key={s.id} className="border-b border-line">
                <button type="button" className="flex w-full items-center justify-between py-4 text-sm font-semibold" aria-expanded={openInfo === s.id} onClick={() => setOpenInfo((o) => (o === s.id ? null : s.id))}>
                  {s.title}<ChevronDown size={16} className={cn('transition-transform duration-200', openInfo === s.id && 'rotate-180')} />
                </button>
                {openInfo === s.id && <div className="pb-4 text-sm leading-relaxed text-ink-2">{s.body}</div>}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
