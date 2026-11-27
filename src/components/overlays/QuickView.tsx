import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown, ChevronLeft, ChevronRight, LoaderCircle, Minus, Plus, Ruler, Share2, Truck, X, ZoomIn } from 'lucide-react';
import type { Product } from '../../types';
import { LOW_STOCK, getProduct, reviewsFor, stockFor } from '../../lib/catalog';
import { SITE_INFO } from '../../config/siteInfo';
import { cn, formatDate } from '../../lib/utils';
import { DUR, EASE } from '../../lib/motion';
import { flyToBag } from '../../lib/flyToBag';
import { useDialog, useLockBodyScroll } from '../../hooks/useOverlay';
import { useShop } from '../../store/ShopProvider';
import type { GarmentView } from '../art/Garment';
import { ProductImage } from '../product/ProductImage';
import { Price, Stars, WishButton } from '../product/bits';

const ART_VIEWS: { id: GarmentView; label: string }[] = [
  { id: 'front', label: 'Front' },
  { id: 'alt', label: 'Alternate' },
  { id: 'detail', label: 'Fabric detail' },
];

/** One gallery image: a real photo, or (for colours without photos) a view of the illustrated garment. */
type Slide = { kind: 'photo'; src: string } | { kind: 'art'; view: GarmentView; label: string };

/** Every distinct image for this colour: colors[c].images plus any extra art-directed crops in colors[c].photos. */
function gallerySlides(p: Product, color: number): Slide[] {
  const c = p.colors[color] ?? p.colors[0];
  const srcs = [...new Set([...(c.images ?? []), ...Object.values(c.photos ?? {})].filter((s): s is string => !!s))];
  if (srcs.length) return srcs.map((src) => ({ kind: 'photo', src }));
  return ART_VIEWS.map((v) => ({ kind: 'art', view: v.id, label: v.label }));
}

function SlideImage({ p, color, slide, fit = 'cover', inset = 'p-[10%]', decorative }: {
  p: Product; color: number; slide: Slide; fit?: 'cover' | 'contain'; inset?: string; decorative?: boolean;
}) {
  const c = p.colors[color] ?? p.colors[0];
  if (slide.kind === 'photo') {
    return (
      <img
        src={slide.src}
        alt={decorative ? '' : `${p.name} in ${c.name}`}
        decoding="async"
        draggable={false}
        className={cn('h-full w-full', fit === 'cover' ? 'object-cover' : 'object-contain')}
      />
    );
  }
  return <ProductImage product={p} color={color} view={slide.view} inset={inset} alt={decorative ? '' : `${p.name} in ${c.name}, ${slide.label.toLowerCase()} view`} />;
}

/**
 * Horizontal swipe on pointer devices (no library). Returns handlers plus `wasSwipe()`, which tells the
 * following click handler to ignore the click that ends a swipe.
 */
function useSwipe(onPrev: () => void, onNext: () => void, enabled = true) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  return {
    handlers: {
      onPointerDown: (e: ReactPointerEvent) => { start.current = { x: e.clientX, y: e.clientY }; swiped.current = false; },
      onPointerUp: (e: ReactPointerEvent) => {
        const s = start.current;
        start.current = null;
        if (!s || !enabled) return;
        const dx = e.clientX - s.x;
        const dy = e.clientY - s.y;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
          swiped.current = true;
          if (dx < 0) onNext(); else onPrev();
        }
      },
      onPointerCancel: () => { start.current = null; },
    },
    wasSwipe: () => { const s = swiped.current; swiped.current = false; return s; },
  };
}

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
  const { addToCart, variantInCart, toast, openPanel, openInfo: openInfoDialog } = useShop();
  const hasSizeGuide = p.type !== 'Footwear' && p.type !== 'Accessories';
  const ref = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const oneSize = p.sizes.length === 1;
  const [color, setColor] = useState(Math.min(initialColor, p.colors.length - 1));
  const [slide, setSlide] = useState(0);
  const [zoom, setZoom] = useState(false);
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

  const slides = gallerySlides(p, color);
  const n = slides.length;
  const current = Math.min(slide, n - 1);
  const go = (d: number) => setSlide((s) => (Math.min(s, n - 1) + d + n) % n);
  const swipe = useSwipe(() => go(-1), () => go(1), n > 1);
  const reviews = reviewsFor(p.id);

  const share = async () => {
    const url = `${window.location.origin}/product/${p.id}${color > 0 ? `/${color}` : ''}`;
    try {
      if (navigator.share) { await navigator.share({ title: `${p.name} | SHOPNOW`, url }); return; }
      await navigator.clipboard.writeText(url);
      toast({ title: 'Link copied', description: p.name });
    } catch (e) {
      if ((e as Error).name !== 'AbortError') toast({ title: 'Could not share', description: url, tone: 'error' });
    }
  };

  const pickColor = (i: number) => { setColor(i); setQty(1); setSlide(0); };
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

  const onGalleryKey = (e: ReactKeyboardEvent) => {
    if (n < 2) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
  };

  let stockNote: { text: string; tone: string } | null = null;
  if (size) {
    if (stock === 0) stockNote = { text: `Out of stock in ${size}. Try another size or colour.`, tone: 'text-error' };
    else if (available === 0) stockNote = { text: `You have all ${stock} in your bag.`, tone: 'text-warning' };
    else if (stock <= LOW_STOCK) stockNote = { text: `Only ${available} left in ${size}. Order soon.`, tone: 'text-warning' };
    else stockNote = { text: `In stock · ${SITE_INFO.delivery.message}`, tone: 'text-success' };
  }

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center p-0 md:p-6">
      <motion.div className="absolute inset-0 bg-text/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: DUR.quickView }} onClick={onClose} />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="qv-title"
        className="relative grid h-full w-full max-w-[1080px] overflow-y-auto overflow-x-hidden bg-bg shadow-[var(--shadow-pop)] md:h-auto md:max-h-[92vh] md:grid-cols-[1.1fr_1fr] md:overflow-hidden md:rounded-[var(--radius-modal)]"
        style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: DUR.quickView, ease: EASE }}
      >
        <button type="button" onClick={onClose} className="icon-btn absolute right-3 top-3 z-20 bg-bg/85 backdrop-blur" aria-label="Close product details" style={{ marginTop: 'env(safe-area-inset-top)' }}>
          <X size={20} />
        </button>

        {/* Gallery: arrows, thumbnails, swipe (touch) and click to zoom */}
        <div className="flex min-w-0 flex-col gap-3 bg-bg-alt p-4 md:p-6" role="group" aria-roledescription="carousel" aria-label={`${p.name} images`} onKeyDown={onGalleryKey}>
          <div ref={imageRef} className="relative aspect-[4/5] touch-pan-y select-none overflow-hidden rounded-[var(--radius-card)] border border-border art-bg md:aspect-auto md:min-h-[420px] md:flex-1" {...swipe.handlers}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={`${color}-${current}`} className={cn('absolute inset-0', slides[current].kind === 'art' && current === 1 && 'art-bg-alt')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <button
                  type="button"
                  onClick={() => { if (!swipe.wasSwipe()) setZoom(true); }}
                  className="absolute inset-0 block cursor-zoom-in focus-visible:outline-offset-[-4px]"
                  aria-label={`Zoom in on image ${current + 1} of ${n}`}
                  aria-haspopup="dialog"
                >
                  <SlideImage p={p} color={color} slide={slides[current]} />
                </button>
              </motion.div>
            </AnimatePresence>
            {n > 1 && (
              <>
                <button type="button" onClick={() => go(-1)} className="icon-btn absolute left-3 top-1/2 z-10 -translate-y-1/2 bg-bg/90 shadow-sm" aria-label="Previous image"><ChevronLeft size={20} /></button>
                <button type="button" onClick={() => go(1)} className="icon-btn absolute right-3 top-1/2 z-10 -translate-y-1/2 bg-bg/90 shadow-sm" aria-label="Next image"><ChevronRight size={20} /></button>
              </>
            )}
            <span className="pointer-events-none absolute bottom-3 left-3 rounded-pill bg-bg/90 px-3 py-1 text-xs font-medium text-text" aria-live="polite">
              {slides[current].kind === 'art' ? `${(slides[current] as { label: string }).label} · ` : ''}{current + 1}/{n}
            </span>
            <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-pill bg-bg/90 px-3 py-1 text-xs font-medium text-text" aria-hidden="true">
              <ZoomIn size={14} /> Zoom
            </span>
          </div>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5" role="group" aria-label="Choose an image">
            {slides.map((s, i) => (
              <button
                key={s.kind === 'photo' ? s.src : s.view}
                type="button"
                onClick={() => setSlide(i)}
                aria-pressed={current === i}
                aria-label={`Show image ${i + 1} of ${n}`}
                className={cn('aspect-square min-h-11 overflow-hidden rounded-[var(--radius-btn)] border-2 transition-colors', current === i ? 'border-text' : 'border-transparent hover:border-border-strong', s.kind === 'art' && i === 1 ? 'art-bg-alt' : 'art-bg')}
              >
                <SlideImage p={p} color={color} slide={s} inset="p-2" decorative />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex min-w-0 flex-col gap-5 p-5 md:overflow-y-auto md:p-8">
          <div className="pr-10">
            <p className="text-sm font-medium text-text-muted">{p.type} · {p.gender === 'unisex' ? 'Unisex' : p.gender === 'men' ? 'Men' : 'Women'}</p>
            <h2 id="qv-title" className="display mt-1 text-[26px] font-semibold leading-[1.1] text-text md:text-[34px]">{p.name}</h2>
            <div className="mt-2 flex items-center gap-2 text-sm text-text-muted tabular-nums"><Stars value={p.rating} /> {p.rating} · {p.reviewCount} ratings</div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <Price product={p} className="text-xl" />
              <button type="button" onClick={share} className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-pill border border-border-strong px-4 text-[13px] font-semibold text-text transition-colors hover:bg-bg-alt hover:text-accent">
                <Share2 size={15} aria-hidden="true" /> Share
              </button>
            </div>
          </div>
          <p className="text-[15px] leading-relaxed text-text-muted">{p.description}</p>

          <div>
            <p className="mb-1 text-sm text-text"><span className="font-semibold">Colour:</span> {p.colors[color].name}</p>
            <div className="-ml-1 flex flex-wrap gap-1" role="group" aria-label="Colour">
              {p.colors.map((c, i) => (
                <button key={c.name} type="button" onClick={() => pickColor(i)} aria-pressed={i === color} aria-label={c.name} title={c.name} className="group grid size-11 place-items-center rounded-full">
                  <span className={cn('size-9 rounded-full border border-text/15 ring-offset-2 ring-offset-bg transition-shadow', i === color ? 'ring-2 ring-text' : 'group-hover:ring-1 group-hover:ring-border-strong')} style={{ background: c.hex }} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-sm text-text">
              <span><span className="font-semibold">Size:</span> {size ?? <span className="text-text-muted">Select a size</span>}</span>
              {hasSizeGuide ? (
                <button type="button" onClick={() => openInfoDialog('size-guide')} className="inline-flex min-h-11 items-center gap-1 font-medium text-accent underline underline-offset-4 hover:text-accent-hover">
                  <Ruler size={14} aria-hidden="true" /> Size guide
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 text-text-muted"><Ruler size={14} aria-hidden="true" /> True to size</span>
              )}
            </div>
            <div className={cn('flex flex-wrap gap-2', sizeError && 'animate-shake')} role="radiogroup" aria-label="Size" aria-describedby="qv-size-note">
              {p.sizes.map((s) => {
                const stockN = stockFor(p, color, s);
                const out = stockN === 0;
                return (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={size === s}
                    onClick={() => pickSize(s)}
                    className={cn(
                      'relative h-11 min-w-12 rounded-pill border px-4 text-sm font-semibold transition-colors duration-150',
                      size === s
                        ? 'border-action bg-action text-action-text'
                        : out
                          ? 'border-border bg-bg-alt text-text-muted line-through decoration-1'
                          : 'border-border-strong bg-bg text-text hover:border-text',
                    )}
                    aria-label={`${s}${out ? ', out of stock' : stockN <= LOW_STOCK ? `, only ${stockN} left` : ''}`}
                  >
                    {s}
                    {!out && stockN <= LOW_STOCK && <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-bg bg-warning" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
            <p id="qv-size-note" className={cn('mt-2 min-h-5 text-sm font-medium', sizeError ? 'text-error' : stockNote?.tone)} aria-live="polite">
              {sizeError ? 'Please select a size.' : stockNote?.text}
            </p>
          </div>

          {/* Buy row */}
          <div className="sticky bottom-0 z-10 -mx-5 flex items-center gap-2 border-t border-border bg-bg px-5 py-3 sm:gap-3 md:static md:mx-0 md:border-0 md:p-0">
            <div className="flex h-13 shrink-0 items-center rounded-pill border border-border-strong" role="group" aria-label="Quantity">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} className="grid size-11 place-items-center rounded-full text-text hover:text-accent disabled:opacity-30 sm:size-12" aria-label="Decrease quantity"><Minus size={16} /></button>
              <output className="w-8 text-center font-semibold tabular-nums text-text" aria-live="polite">{qty}</output>
              <button type="button" onClick={() => setQty((q) => Math.min(maxQty, q + 1))} disabled={!size || qty >= maxQty} className="grid size-11 place-items-center rounded-full text-text hover:text-accent disabled:opacity-30 sm:size-12" aria-label="Increase quantity"><Plus size={16} /></button>
            </div>
            <button
              type="button"
              onClick={add}
              disabled={!!size && available === 0}
              className={cn('btn h-13 min-w-0 flex-1 text-[15px] sm:min-w-[200px]', state === 'added' ? 'bg-success text-text-inverse' : 'btn-dark')}
            >
              {state === 'adding' && <><LoaderCircle size={18} className="animate-spin" /> Adding…</>}
              {state === 'added' && <>Added to bag <Check size={18} /></>}
              {state === 'idle' && (size && available === 0 ? 'Out of stock' : 'Add to bag')}
            </button>
            <WishButton product={p} className="size-13 shrink-0 border border-border-strong" size={20} />
          </div>
          {size && qty >= maxQty && available > 1 && <p className="-mt-3 text-xs text-text-muted">That’s all we have in stock for this size.</p>}

          <div className="border-t border-border">
            {[
              { id: 'details', title: 'Details and fit', body: <ul className="list-disc space-y-1 pl-5">{p.details.map((d) => <li key={d}>{d}</li>)}</ul> },
              {
                id: 'delivery',
                title: 'Delivery and returns',
                body: (
                  <>
                    <p className="flex gap-2"><Truck size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" /> Free shipping above ₹999. {SITE_INFO.delivery.message}. Easy 7-day returns and size exchanges.</p>
                    <PincodeCheck />
                  </>
                ),
              },
            ].map((s) => (
              <div key={s.id} className="border-b border-border">
                <button type="button" className="flex min-h-11 w-full items-center justify-between py-3 text-sm font-semibold text-text hover:text-accent" aria-expanded={openInfo === s.id} aria-controls={`qv-${s.id}`} onClick={() => setOpenInfo((o) => (o === s.id ? null : s.id))}>
                  {s.title}<ChevronDown size={16} aria-hidden="true" className={cn('transition-transform duration-200', openInfo === s.id && 'rotate-180')} />
                </button>
                {openInfo === s.id && <div id={`qv-${s.id}`} className="pb-4 text-sm leading-relaxed text-text-muted">{s.body}</div>}
              </div>
            ))}
          </div>

          <section aria-labelledby="qv-reviews-title">
            <h3 id="qv-reviews-title" className="text-base font-semibold text-text">Customer reviews{reviews.length > 0 && <span className="font-normal text-text-muted"> ({reviews.length})</span>}</h3>
            {reviews.length === 0 ? (
              <p className="mt-2 text-sm text-text-muted">No reviews yet</p>
            ) : (
              <ul className="mt-3 space-y-4">
                {reviews.map((r) => (
                  <li key={r.id} className="rounded-[var(--radius-card)] border border-border p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Stars value={r.rating} size={14} />
                      <time dateTime={r.date} className="text-xs text-text-muted">{formatDate(r.date)}</time>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-text">{r.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-text-muted">{r.body}</p>
                    <p className="mt-2 text-xs text-text-muted">{r.name}, {r.city}{r.size ? ` · Size ${r.size}` : ''}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </motion.div>

      <AnimatePresence>
        {zoom && (
          <ZoomView
            p={p}
            color={color}
            slides={slides}
            index={current}
            onIndex={setSlide}
            onClose={() => setZoom(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Delivery estimate by pincode. There is no delivery API yet, so a valid pincode gets the general
 * estimate (never a pincode-specific promise).
 */
function PincodeCheck() {
  const [pin, setPin] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const input = useRef<HTMLInputElement>(null);
  return (
    <form
      noValidate
      className="mt-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!/^\d{6}$/.test(pin)) {
          setMsg({ ok: false, text: SITE_INFO.delivery.pincodeInvalid });
          input.current?.focus();
          return;
        }
        setMsg({ ok: true, text: SITE_INFO.delivery.pincodeValid(pin) });
      }}
    >
      <label htmlFor="qv-pincode" className="block text-sm font-semibold text-text">Check delivery to your pincode</label>
      <div className="mt-2 flex gap-2">
        <input
          ref={input}
          id="qv-pincode"
          name="pincode"
          inputMode="numeric"
          autoComplete="postal-code"
          pattern="[0-9]{6}"
          maxLength={6}
          placeholder="6-digit pincode"
          value={pin}
          onChange={(e) => { setPin(e.target.value.replace(/\D/g, '').slice(0, 6)); setMsg(null); }}
          aria-invalid={msg ? !msg.ok : undefined}
          aria-describedby="qv-pincode-msg"
          className={cn('h-11 min-w-0 flex-1 rounded-input border bg-bg px-4 text-[16px] tabular-nums tracking-wider text-text placeholder:tracking-normal placeholder:text-text-muted', msg && !msg.ok ? 'border-error' : 'border-border-strong focus:border-accent')}
        />
        <button type="submit" className="h-11 shrink-0 rounded-btn bg-action px-5 text-sm font-semibold text-action-text transition-colors hover:bg-action-hover">Check</button>
      </div>
      <p id="qv-pincode-msg" className={cn('mt-2 min-h-5 text-sm', msg && (msg.ok ? 'text-success' : 'font-medium text-error'))} aria-live="polite">
        {msg?.text}
      </p>
    </form>
  );
}

/** Full-screen zoom: click or tap the image to magnify, move the pointer (or drag) to pan, Escape closes. */
function ZoomView({ p, color, slides, index, onIndex, onClose }: {
  p: Product; color: number; slides: Slide[]; index: number; onIndex: (i: number) => void; onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const pressed = useRef(false);
  const n = slides.length;
  const go = (d: number) => { setZoomed(false); onIndex((index + d + n) % n); };
  const swipe = useSwipe(() => go(-1), () => go(1), n > 1 && !zoomed);
  useDialog(ref, true, onClose);
  useEffect(() => { setOrigin({ x: 50, y: 50 }); }, [index]);

  const pan = (e: ReactPointerEvent<HTMLElement>) => {
    if (!zoomed || (e.pointerType !== 'mouse' && !pressed.current)) return;
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin({ x: Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)), y: Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100)) });
  };

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={`${p.name}: zoomed image ${index + 1} of ${n}`}
      className="fixed inset-0 z-[95] flex flex-col bg-text/95 text-text-inverse"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onKeyDown={(e) => {
        if (n > 1 && e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
        if (n > 1 && e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-2">
        <p className="text-sm text-dark-muted" aria-live="polite">{index + 1} / {n} · {zoomed ? 'Move or drag to look around. Select the image again to zoom out.' : 'Select the image to zoom in.'}</p>
        <button type="button" onClick={onClose} className="grid size-11 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus-visible:outline-accent-dark" aria-label="Close zoom">
          <X size={20} />
        </button>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden" {...swipe.handlers}>
        <button
          type="button"
          aria-pressed={zoomed}
          aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
          className={cn('absolute inset-0 block touch-none overflow-hidden focus-visible:outline-offset-[-4px]', zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in')}
          onPointerDown={(e) => { pressed.current = true; if (zoomed) pan(e); }}
          onPointerUp={() => { pressed.current = false; }}
          onPointerLeave={() => { pressed.current = false; }}
          onPointerMove={pan}
          onClick={(e) => {
            if (swipe.wasSwipe()) return;
            const r = e.currentTarget.getBoundingClientRect();
            if (!zoomed && e.detail > 0) setOrigin({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
            setZoomed((z) => !z);
          }}
        >
          <div
            className="h-full w-full transition-transform duration-200 ease-out"
            style={{ transform: zoomed ? 'scale(2.5)' : 'scale(1)', transformOrigin: `${origin.x}% ${origin.y}%` }}
          >
            <SlideImage p={p} color={color} slide={slides[index]} fit="contain" inset="p-[6%]" />
          </div>
        </button>
        {n > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} className="absolute left-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-bg/90 text-text shadow-sm" aria-label="Previous image"><ChevronLeft size={20} /></button>
            <button type="button" onClick={() => go(1)} className="absolute right-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-bg/90 text-text shadow-sm" aria-label="Next image"><ChevronRight size={20} /></button>
          </>
        )}
      </div>
    </motion.div>
  );
}
