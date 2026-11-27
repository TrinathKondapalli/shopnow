import { useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check } from 'lucide-react';
import type { Look, Product } from '../../types';
import { LOOKS, getProduct, stockFor } from '../../lib/catalog';
import { cn, inr } from '../../lib/utils';
import { EASE } from '../../lib/motion';
import { flyToBag } from '../../lib/flyToBag';
import { BUNDLE_DISCOUNT, useShop } from '../../store/ShopProvider';
import { Mannequin, PIN_POS } from '../art/Mannequin';
import { ProductImage } from '../product/ProductImage';

const PREFERRED = ['M', '32', 'UK 8', 'One Size', 'L', 'S', '30', '34', 'UK 7', 'UK 9'];
const defaultSize = (p: Product, color: number) =>
  PREFERRED.find((s) => p.sizes.includes(s) && stockFor(p, color, s) > 0) ?? p.sizes.find((s) => stockFor(p, color, s) > 0) ?? p.sizes[0];

const lookItems = (look: Look) => look.items.map((it) => ({ ...it, p: getProduct(it.productId)! }));

/**
 * Pin position (centre, % of the product's photo panel) for each ethnic piece's own photo.
 * The stage shows each piece's real product photo side by side, so every pin sits on that garment.
 */
const PIN_AT: Record<string, [number, number]> = {
  'maroon-kurta': [50, 55],
  'nehru-jacket-set': [44, 50],
  'traditional-sari': [52, 52],
  'anarkali-kurti': [50, 60],
};

/** Zoom for low-res source photos that carry a baked-in border and wishlist icon (see report). */
const PHOTO_ZOOM: Record<string, number> = { 'maroon-kurta': 1.2 };

function Icon({ src, className }: { src: string; className?: string }) {
  return <span className={cn('figma-icon', className)} style={{ '--icon': `url(${src})` } as CSSProperties} aria-hidden="true" />;
}

/** 06. Shop the look: outfit stage with hotspots and a 15% bundle, matching Figma 119:707. */
export function ShopTheLook() {
  const [index, setIndex] = useState(0);
  const go = (n: number) => setIndex((n + LOOKS.length) % LOOKS.length);
  const look = LOOKS[index];
  const pieces = lookItems(look).filter((it) => !!it.p);
  const photo = pieces.length > 0 && pieces.every((it) => !!it.p.colors[it.color]?.images?.[0]);

  return (
    <section id="looks" className="scroll-mt-16 md:scroll-mt-20 bg-bg-alt pb-[46px] pt-10 lg:pt-[22.5px]" aria-labelledby="looks-title">
      <div className="mx-auto w-full max-w-[1648px] px-4 sm:px-8 xl:px-[66.5px]">
        {/* Header */}
        <div className="flex flex-col gap-y-4 lg:flex-row lg:items-start">
          <div className="shrink-0">
            <div className="flex items-center gap-4">
              <span className="h-[1px] w-10 bg-accent" aria-hidden="true" />
              <p className="eyebrow">
                Shop the look
              </p>
            </div>
            <h2
              id="looks-title"
              className="mt-2 font-display text-[30px] font-semibold leading-[1.15] tracking-[-0.01em] text-text md:text-[48px]"
            >
              Styled head to <span className="italic text-accent">toe</span>
            </h2>
          </div>
          <div className="hidden h-[44.3px] w-px shrink-0 bg-border lg:ml-[40px] lg:mt-[35.3px] lg:block" aria-hidden="true" />
          <p className="text-[16px] leading-normal text-text-muted lg:ml-[43.3px] lg:mt-[42px]">
            Tap a pin to find the piece. Add a multi-piece look in one go to save 15%.
          </p>
        </div>

        <div className="mt-6 grid gap-y-8 lg:mt-[23.5px] lg:grid-cols-[minmax(0,1fr)_1px_503px] lg:gap-x-[27.5px]">
          {/* Left column: stage + controls */}
          <div className="min-w-0">
            {/* Outfit stage */}
            <div className="relative aspect-[956.4/627] w-full overflow-hidden rounded-[var(--radius-card)] bg-bg">
              <AnimatePresence initial={false}>
                <motion.div
                  key={look.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  style={photo ? undefined : { backgroundColor: 'var(--color-bg-alt)' }}
                >
                  {photo ? (
                    <div className="flex h-full w-full justify-center">
                      {pieces.map((it, n) => {
                        const c = it.p.colors[it.color] ?? it.p.colors[0];
                        const [x, y] = PIN_AT[it.p.id] ?? [50, 50];
                        return (
                          <div key={it.p.id} className="relative h-full w-1/2 overflow-hidden">
                            <img
                              decoding="async"
                              src={c.images![0]}
                              alt={`${it.p.name} in ${c.name}`}
                              className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top"
                              style={PHOTO_ZOOM[it.p.id] ? { transform: `scale(${PHOTO_ZOOM[it.p.id]})`, objectPosition: '50% 40%' } : undefined}
                            />
                            <Pin
                              n={n + 1}
                              centered
                              style={{ left: `${x}%`, top: `${y}%` }}
                              label={it.p.name}
                              target={`look-item-${look.id}-${n}`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="absolute inset-y-[6%] left-1/2 aspect-[240/500] -translate-x-1/2">
                      <Mannequin look={look} className="h-full w-full drop-shadow-[var(--shadow-pop)]" />
                      {pieces.map((it, n) => {
                        const [x, y] = PIN_POS[it.slot];
                        return (
                          <Pin
                            key={it.p.id}
                            n={n + 1}
                            centered
                            style={{ left: `${x}%`, top: `${y}%` }}
                            label={it.p.name}
                            target={`look-item-${look.id}-${n}`}
                          />
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Caption sits below the photos (not over them) so it always has full contrast. */}
            <p className="mt-4 text-[14px] font-semibold uppercase leading-[22px] tracking-[0.14em] text-text-muted sm:text-[15px]">
              {look.caption}
            </p>

            {/* Controls */}
            <div className="mt-[19.3px] flex flex-wrap items-center gap-y-3">
              <div className="flex shrink-0 gap-[18.3px]">
                <button
                  type="button"
                  className="grid size-[44px] place-items-center rounded-btn border border-border-strong bg-bg text-text transition-colors duration-200 hover:bg-bg-alt sm:size-[52px]"
                  onClick={() => go(index - 1)}
                  aria-label="Previous look"
                >
                  <span className="relative block size-[24px]">
                    <span className="absolute inset-[20.83%_16.67%]">
                      <span className="absolute inset-[-6.07%_-5.31%]">
                        <Icon src="/figma/look/arrow-left.svg" />
                      </span>
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  className="grid size-[44px] place-items-center rounded-btn bg-action text-action-text transition-colors duration-200 hover:bg-action-hover sm:size-[52px]"
                  onClick={() => go(index + 1)}
                  aria-label="Next look"
                >
                  <span className="relative block size-[24px]">
                    <span className="absolute inset-[20.83%_16.67%]">
                      <span className="absolute inset-[-6.07%_-5.31%]">
                        <Icon src="/figma/look/arrow-right.svg" />
                      </span>
                    </span>
                  </span>
                </button>
              </div>

              <div className="ml-4 hidden h-[50.1px] w-px shrink-0 bg-border sm:ml-[40.5px] sm:block" aria-hidden="true" />

              <div className="relative min-w-0 basis-full sm:ml-[44.2px] sm:basis-0 sm:flex-1" role="tablist" aria-label="Looks">
                <span className="absolute inset-x-0 bottom-0 h-[1px] bg-border" aria-hidden="true" />
                <div className="grid grid-cols-3">
                  {LOOKS.map((l, i) => (
                    <button
                      key={l.id}
                      type="button"
                      role="tab"
                      onClick={() => go(i)}
                      aria-selected={i === index}
                      className={cn(
                        'relative flex min-h-[52px] min-w-0 items-center pb-2 pl-[2.9px] pt-2 text-left text-[14px] leading-tight transition-colors sm:text-[17px]',
                        i === index ? 'font-semibold text-accent' : 'font-medium text-text-muted hover:text-text'
                      )}
                    >
                      <span className="block pr-2">0{i + 1} {l.name}</span>
                      <motion.span
                        className="absolute bottom-0 left-[2px] h-[2px] w-[73.7%] origin-left bg-accent"
                        initial={false}
                        animate={{ scaleX: i === index ? 1 : 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Panel divider */}
          <div className="hidden h-[694.5px] w-px bg-border lg:block" aria-hidden="true" />

          {/* Right: look panel */}
          <LookPanel key={look.id} look={look} />
        </div>
      </div>
    </section>
  );
}

/** Hotspot pin: pulse ring with pin and number. */
function Pin({ n, style, label, target, centered }: { n: number; style: CSSProperties; label: string; target: string; centered?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        'group absolute z-10 size-[44px] transition-transform duration-200 hover:scale-110 sm:size-[52px]',
        centered && '-translate-x-1/2 -translate-y-1/2'
      )}
      style={style}
      onClick={() => {
        const el = document.getElementById(target);
        el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        el?.animate([{ backgroundColor: 'var(--color-accent-soft)' }, { backgroundColor: 'transparent' }], { duration: 1400, easing: 'ease-out' });
      }}
      aria-label={`Piece ${n}: ${label}`}
    >
      <img src="/figma/look/pulse-ring.svg" alt="" className="animate-ping-soft absolute inset-0 size-full" aria-hidden="true" />
      <img src="/figma/look/pulse-ring.svg" alt="" className="absolute inset-0 size-full" aria-hidden="true" />
      <img src="/figma/look/pin.svg" alt="" className="absolute left-[20.38%] top-[20.38%] size-[59.23%]" aria-hidden="true" />
      <span className="absolute inset-0 grid place-items-center text-[12px] font-bold leading-normal text-text sm:text-[13.5px]">{n}</span>
      <span className="pointer-events-none absolute left-[calc(100%+6px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-btn bg-text px-3 py-1.5 text-xs font-semibold text-text-inverse opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        {label}
      </span>
    </button>
  );
}

function LookPanel({ look }: { look: Look }) {
  const { addToCart, toast, openPanel, openQuickView } = useShop();
  const items = useMemo(() => lookItems(look), [look]);
  const [sizes, setSizes] = useState<string[]>(() => items.map((it) => defaultSize(it.p, it.color)));
  const [added, setAdded] = useState<number | 'all' | null>(null);
  const thumbs = useRef<(HTMLDivElement | null)[]>([]);
  const total = items.reduce((s, it) => s + it.p.price, 0);
  const bundle = Math.round(total * (1 - BUNDLE_DISCOUNT));
  const isBundle = items.length > 1;
  const soldOut = items.map((it, n) => stockFor(it.p, it.color, sizes[n]) <= 0);

  const flash = (v: number | 'all') => { setAdded(v); window.setTimeout(() => setAdded(null), 1600); };

  const addOne = (n: number) => {
    const it = items[n];
    const r = addToCart(it.p.id, it.color, sizes[n], 1);
    if (!r.ok) { toast({ title: 'That size is sold out', description: `${it.p.name}, size ${sizes[n]}`, tone: 'error' }); return; }
    flyToBag(thumbs.current[n]);
    flash(n);
    toast({ title: 'Added to bag', description: `${it.p.name} · ${sizes[n]}`, action: { label: 'View bag', onClick: () => openPanel('cart') } });
  };

  const addAll = () => {
    const blocked = items.findIndex((_, n) => soldOut[n]);
    if (blocked >= 0) { toast({ title: 'Pick another size', description: `${items[blocked].p.name} is sold out in ${sizes[blocked]}.`, tone: 'error' }); return; }
    items.forEach((it, n) => {
      const r = addToCart(it.p.id, it.color, sizes[n], 1, isBundle ? look.id : undefined);
      if (r.ok) flyToBag(thumbs.current[n], n * 120);
    });
    flash('all');
    toast({ title: `${look.name} added`, description: isBundle ? `Bundle price ${inr(bundle)}, you save ${inr(total - bundle)}` : items[0].p.name, action: { label: 'View bag', onClick: () => openPanel('cart') } });
  };

  return (
    <motion.aside
      className="min-w-0 lg:pl-[4.1px] lg:pt-[10px]"
      initial={{ opacity: 0.25, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
      aria-label={`Pieces in ${look.name}`}
    >
      {/* Look panel heading */}
      <p className="eyebrow lg:-ml-[0.9px]">
        In this look
      </p>
      <h3 className="mt-1 font-display text-[32px] font-semibold leading-[1.1] text-text lg:-ml-[2.9px] lg:text-[42px]">
        {look.name}
      </h3>

      {/* Look items */}
      <ul className="mt-[17px] flex flex-col">
        {items.map((it, n) => (
          <li key={it.p.id}>
            {n > 0 && <div className="my-[10px] ml-[118px] h-px bg-border sm:ml-[182.1px] lg:w-[315.9px]" aria-hidden="true" />}
            <div id={`look-item-${look.id}-${n}`} className="grid grid-cols-[96px_minmax(0,1fr)_auto] items-start gap-x-[22px] sm:grid-cols-[151.2px_minmax(0,1fr)_48.2px] sm:gap-x-[30.8px]">
              <div
                ref={(el) => { thumbs.current[n] = el; }}
                className="relative h-[72px] w-[96px] overflow-hidden rounded-[var(--radius-btn)] border border-border bg-bg sm:h-[113.7px] sm:w-[151.2px]"
              >
                <ProductImage product={it.p} color={it.color} crop="thumb" inset="p-1" className="object-top" />
              </div>
              <div className="min-w-0 pt-[4px] sm:pt-[12.9px]">
                <button
                  type="button"
                  onClick={() => openQuickView(it.p.id, it.color)}
                  className="block max-w-full text-left text-[16px] font-semibold leading-normal text-text transition-colors hover:text-accent sm:text-[18px]"
                >
                  {it.p.name}
                </button>
                <p className="mt-[2.1px] text-[14.5px] leading-normal text-text-muted tabular-nums sm:text-[16px]">
                  {it.p.colors[it.color].name} · {inr(it.p.price)}
                </p>
                <label className="mt-[6px] flex items-center gap-[16px] sm:mt-[7.5px] sm:gap-[23.8px]">
                  <span className="text-[14.5px] leading-normal text-text-muted sm:text-[16px]">Size</span>
                  <span className="relative inline-flex">
                    <select
                      value={sizes[n]}
                      onChange={(e) => setSizes((s) => s.map((v, i) => (i === n ? e.target.value : v)))}
                      className="h-11 cursor-pointer appearance-none [field-sizing:content] rounded-btn border border-border-strong bg-bg pl-[13.5px] pr-[43.1px] text-[15px] font-semibold text-text outline-none transition-colors hover:border-text focus-visible:border-accent"
                      aria-label={`Size for ${it.p.name}`}
                    >
                      {it.p.sizes.map((s) => (
                        <option key={s} value={s} disabled={stockFor(it.p, it.color, s) <= 0}>{s}{stockFor(it.p, it.color, s) <= 0 ? ' (sold out)' : ''}</option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-[11.6px] top-1/2 size-[18px] -translate-y-1/2 text-text">
                      <span className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]">
                        <span className="absolute inset-[-16.67%_-8.33%]">
                          <Icon src="/figma/look/chevron-down.svg" />
                        </span>
                      </span>
                    </span>
                  </span>
                </label>
              </div>
              <button
                type="button"
                onClick={() => addOne(n)}
                disabled={soldOut[n]}
                className={cn(
                  'mt-[24px] grid size-[44px] place-items-center rounded-btn border transition-colors duration-200 disabled:opacity-40 sm:mt-[30.8px] sm:size-[48.2px]',
                  added === n
                    ? 'border-success bg-success text-text-inverse'
                    : 'border-border-strong bg-bg text-text hover:border-action hover:bg-action hover:text-action-text'
                )}
                aria-label={`Add ${it.p.name} to bag`}
              >
                {added === n ? (
                  <Check size={20} />
                ) : (
                  <span className="relative block size-[24px]">
                    <span className="absolute inset-[20.83%]">
                      <span className="absolute inset-[-5.71%]">
                        <Icon src="/figma/look/plus.svg" />
                      </span>
                    </span>
                  </span>
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Bundle */}
      {isBundle && (<>
      <div className="mt-[20.2px] h-px bg-border lg:w-[498px]" aria-hidden="true" />
      <div className="mt-[30.6px] flex items-start justify-between gap-4 lg:w-[498px]">
        <div className="pl-[3.9px] pt-[2.5px]">
          <p className="text-[19px] font-bold leading-normal text-text sm:text-[21px]">Complete the look</p>
          <p className="mt-[3.8px] text-[15px] leading-normal text-text-muted sm:text-[17px]">
            Bundle of {items.length}, save 15%
          </p>
        </div>
        <p className="text-right tabular-nums">
          <span className="block text-[15px] leading-normal text-text-muted line-through sm:text-[17px]">{inr(total)}</span>
          <span className="mt-[5.4px] block text-[26px] font-bold leading-normal text-accent sm:text-[30px]">{inr(bundle)}</span>
        </p>
      </div>
      </>)}

      {/* Add full look */}
      <button
        type="button"
        onClick={addAll}
        className={cn(
          'group mt-[22.1px] flex h-14 w-full items-center justify-center gap-3 rounded-btn text-[16px] font-semibold text-action-text transition-colors sm:text-[17px] lg:w-[498.9px]',
          added === 'all' ? 'bg-success' : 'bg-action hover:bg-action-hover'
        )}
      >
        {added === 'all' ? (
          <>{isBundle ? 'Added full look' : 'Added to bag'} <Check size={22} /></>
        ) : (
          <>
            {isBundle ? 'Add full look to bag' : `Add to bag, ${inr(total)}`}
            <span className="relative block size-[24px] transition-transform duration-200 group-hover:translate-x-1">
              <span className="absolute inset-[20.83%_16.67%]">
                <span className="absolute inset-[-6.43%_-5.62%]">
                  <Icon src="/figma/look/arrow-right-cta.svg" />
                </span>
              </span>
            </span>
          </>
        )}
      </button>
    </motion.aside>
  );
}
