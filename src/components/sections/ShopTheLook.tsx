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

/** Stage size in the Figma frame (956.4 x 627). Pin positions are the pin's top-left corner. */
const STAGE_W = 956.4;
const STAGE_H = 627;

/** Art direction per look: real outfit photography with hand-placed pins and caption breaks. */
const LOOK_PHOTOS: Record<string, { src: string; pins: [number, number][]; caption: string[] }> = {
  'city-layers': {
    src: '/figma/look/city-layers.png',
    pins: [[470, 132], [506.6, 340], [518.2, 547.1]],
    caption: ['A SOFT HOODIE,', 'UTILITY CARGOS AND', 'A RETRO RUNNER FOR', 'EVERYDAY ERRANDS.'],
  },
  'lavender-hour': {
    src: '/figma/look/lavender-hour.jpg',
    pins: [[480, 160], [505, 360], [515, 545]],
    caption: ['CROPPED FLEECE OVER', 'WIDE-LEG DENIM,', 'FINISHED WITH A', 'PLATFORM SOLE.'],
  },
  'night-shift': {
    src: '/figma/look/night-shift.jpg',
    pins: [[485, 205], [505, 395], [475, 80]],
    caption: ['TRACK JACKET,', 'TECH JOGGERS AND', 'A CAP. BUILT FOR', 'LATE PLANS.'],
  },
};

function Icon({ src, className }: { src: string; className?: string }) {
  return <span className={cn('figma-icon', className)} style={{ '--icon': `url(${src})` } as CSSProperties} aria-hidden="true" />;
}

/** 06. Shop the look: outfit stage with hotspots and a 15% bundle, matching Figma 119:707. */
export function ShopTheLook() {
  const [index, setIndex] = useState(0);
  const go = (n: number) => setIndex((n + LOOKS.length) % LOOKS.length);
  const look = LOOKS[index];
  const photo = LOOK_PHOTOS[look.id];

  return (
    <section id="looks" className="scroll-mt-16 md:scroll-mt-20 bg-[#F8EFEB] pb-[46px] pt-10 lg:pt-[22.5px]" aria-labelledby="looks-title">
      <div className="mx-auto w-full max-w-[1648px] px-4 sm:px-8 xl:px-[66.5px]">
        {/* Header 119:708-119:712 */}
        <div className="flex flex-col gap-y-4 lg:flex-row lg:items-start">
          <div className="shrink-0">
            <div className="flex items-center gap-[11.6px]">
              <span className="h-[2.2px] w-[35.6px] bg-electric-alt" aria-hidden="true" />
              <p className="text-[15px] font-semibold uppercase leading-normal tracking-[1.4685px] text-electric-alt lg:text-[16.5px]">
                Shop the look
              </p>
            </div>
            <h2
              id="looks-title"
              className="mt-[-1.4px] text-[40px] font-extrabold leading-normal tracking-[-0.441px] text-ink sm:text-[52px] lg:text-[63px]"
            >
              Styled head to <span className="italic text-electric-alt">toe</span>
            </h2>
          </div>
          <div className="hidden h-[44.3px] w-px shrink-0 bg-[#D8D0CC] lg:ml-[40px] lg:mt-[35.3px] lg:block" aria-hidden="true" />
          <p className="text-[16px] leading-normal tracking-[-0.0825px] text-[#504D4F] lg:ml-[43.3px] lg:mt-[48.2px] lg:text-[16.5px]">
            Tap a pin to find the piece. Add the full outfit to save 15%.
          </p>
        </div>

        <div className="mt-6 grid gap-y-8 lg:mt-[23.5px] lg:grid-cols-[minmax(0,1fr)_1px_503px] lg:gap-x-[27.5px]">
          {/* Left column: stage + controls */}
          <div className="min-w-0">
            {/* Outfit stage 119:713 */}
            <div
              className="relative aspect-[956.4/627] w-full overflow-hidden"
              style={photo ? undefined : { background: 'radial-gradient(85% 75% at 50% 35%, #FFFFFF 0%, #F1EAFA 55%, #E2D3F5 100%)' }}
            >
              <AnimatePresence initial={false}>
                <motion.div
                  key={look.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  style={photo ? undefined : { background: 'radial-gradient(85% 75% at 50% 35%, #FFFFFF 0%, #F1EAFA 55%, #E2D3F5 100%)' }}
                >
                  {photo ? (
                    <>
                      <img
                        src={photo.src}
                        alt={`${look.name} outfit: ${look.caption}`}
                        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                      />
                      {look.items.map((it, n) => {
                        const p = getProduct(it.productId)!;
                        const pos = photo.pins[n];
                        if (!pos) return null;
                        return (
                          <Pin
                            key={it.productId}
                            n={n + 1}
                            style={{ left: `${(pos[0] / STAGE_W) * 100}%`, top: `${(pos[1] / STAGE_H) * 100}%` }}
                            label={p.name}
                            target={`look-item-${look.id}-${n}`}
                          />
                        );
                      })}
                    </>
                  ) : (
                    <div className="absolute inset-y-[6%] left-1/2 aspect-[240/500] -translate-x-1/2">
                      <Mannequin look={look} className="h-full w-full drop-shadow-[0_25px_30px_rgba(40,15,80,0.2)]" />
                      {look.items.map((it, n) => {
                        const p = getProduct(it.productId)!;
                        const [x, y] = PIN_POS[it.slot];
                        return (
                          <Pin
                            key={it.productId}
                            n={n + 1}
                            centered
                            style={{ left: `${x}%`, top: `${y}%` }}
                            label={p.name}
                            target={`look-item-${look.id}-${n}`}
                          />
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Caption 119:715 + rule 119:716 */}
              <div className="pointer-events-none absolute left-[16px] top-[16px] z-[5] sm:left-[37.6px] sm:top-[32.5px]">
                <p
                  className={cn(
                    'max-w-[240px] text-[11px] font-semibold uppercase leading-[20px] tracking-[2.5px] sm:text-[14px] sm:leading-[25px] sm:tracking-[3.752px]',
                    photo ? 'whitespace-nowrap text-white' : 'text-[#504D4F]'
                  )}
                >
                  {photo ? photo.caption.map((l, i) => <span key={i} className="block">{l}</span>) : look.caption}
                </p>
                <span className={cn('ml-[0.9px] mt-[18.7px] block h-[1.5px] w-[46.2px]', photo ? 'bg-white' : 'bg-electric-alt')} />
              </div>
            </div>

            {/* Controls: arrows 119:729/119:734, tabs 119:740-119:744 */}
            <div className="mt-[19.3px] flex items-center">
              <div className="flex shrink-0 gap-[18.3px]">
                <button
                  type="button"
                  className="grid size-[44px] place-items-center border border-[#D3CBC7] bg-white/30 text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-white sm:size-[52px]"
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
                  className="grid size-[44px] place-items-center bg-electric-alt text-white transition-colors duration-200 hover:bg-electric-600 sm:size-[52px]"
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

              <div className="ml-4 hidden h-[50.1px] w-px shrink-0 bg-[#D8D0CC] sm:ml-[40.5px] sm:block" aria-hidden="true" />

              <div className="relative ml-4 h-[52px] min-w-0 flex-1 sm:ml-[44.2px]" role="tablist" aria-label="Looks">
                <span className="absolute inset-x-0 top-[46.3px] h-[1.3px] bg-[#D8D0CC]" aria-hidden="true" />
                <div className="grid h-full grid-cols-3">
                  {LOOKS.map((l, i) => (
                    <button
                      key={l.id}
                      type="button"
                      role="tab"
                      onClick={() => go(i)}
                      aria-selected={i === index}
                      className={cn(
                        'relative min-w-0 pl-[2.9px] pt-[10.5px] text-left text-[13px] leading-normal tracking-[-0.18px] transition-colors sm:text-[18px]',
                        i === index ? 'font-semibold text-ink' : 'font-medium text-muted hover:text-ink'
                      )}
                    >
                      <span className="block truncate pr-2">0{i + 1} {l.name}</span>
                      <motion.span
                        className="absolute left-[2px] top-[44.8px] h-[2.9px] w-[73.7%] origin-left bg-electric-alt"
                        initial={false}
                        animate={{ scaleX: i === index ? 1 : 0 }}
                        transition={{ duration: 0.5, ease: EASE }}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Panel divider 119:745 */}
          <div className="hidden h-[694.5px] w-px bg-[#D8D0CC] lg:block" aria-hidden="true" />

          {/* Right: look panel */}
          <AnimatePresence mode="wait" initial={false}>
            <LookPanel key={look.id} look={look} />
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/** Hotspot pin 119:688: 52px pulse ring with a 30.8px pin and number. */
function Pin({ n, style, label, target, centered }: { n: number; style: CSSProperties; label: string; target: string; centered?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        'group absolute z-10 size-[36px] transition-transform duration-200 hover:scale-110 sm:size-[52px]',
        centered && '-translate-x-1/2 -translate-y-1/2'
      )}
      style={style}
      onClick={() => {
        const el = document.getElementById(target);
        el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        el?.animate([{ backgroundColor: '#EFE6FF' }, { backgroundColor: 'transparent' }], { duration: 1400, easing: 'ease-out' });
      }}
      aria-label={`Piece ${n}: ${label}`}
    >
      <img src="/figma/look/pulse-ring.svg" alt="" className="animate-ping-soft absolute inset-0 size-full" aria-hidden="true" />
      <img src="/figma/look/pulse-ring.svg" alt="" className="absolute inset-0 size-full" aria-hidden="true" />
      <img src="/figma/look/pin.svg" alt="" className="absolute left-[20.38%] top-[20.38%] size-[59.23%]" aria-hidden="true" />
      <span className="absolute inset-0 grid place-items-center text-[11px] font-bold leading-normal text-ink sm:text-[13.5px]">{n}</span>
      <span className="pointer-events-none absolute left-[calc(100%+6px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-[2px] bg-ink px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
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
      const r = addToCart(it.p.id, it.color, sizes[n], 1, look.id);
      if (r.ok) flyToBag(thumbs.current[n], n * 120);
    });
    flash('all');
    toast({ title: `${look.name} added`, description: `Bundle price ${inr(bundle)}, you save ${inr(total - bundle)}`, action: { label: 'View bag', onClick: () => openPanel('cart') } });
  };

  return (
    <motion.aside
      className="min-w-0 lg:pl-[4.1px] lg:pt-[10px]"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.3, ease: EASE }}
      aria-label={`Pieces in ${look.name}`}
    >
      {/* 119:746 / 119:747 */}
      <p className="text-[15px] font-bold uppercase leading-normal tracking-[2.3925px] text-electric-alt lg:-ml-[0.9px] lg:text-[16.5px]">
        In this look
      </p>
      <h3 className="mt-[2.5px] text-[38px] font-extrabold leading-normal tracking-[-0.147px] text-ink lg:-ml-[2.9px] lg:text-[49px]">
        {look.name}
      </h3>

      {/* Look items 119:748 / 119:763 / 119:778 */}
      <ul className="mt-[17px] flex flex-col">
        {items.map((it, n) => (
          <li key={it.p.id}>
            {n > 0 && <div className="my-[10px] ml-[118px] h-px bg-[#DED6D2] sm:ml-[182.1px] lg:w-[315.9px]" aria-hidden="true" />}
            <div id={`look-item-${look.id}-${n}`} className="grid grid-cols-[96px_minmax(0,1fr)_auto] items-start gap-x-[22px] sm:grid-cols-[151.2px_minmax(0,1fr)_48.2px] sm:gap-x-[30.8px]">
              <div
                ref={(el) => { thumbs.current[n] = el; }}
                className="relative h-[72px] w-[96px] overflow-hidden bg-[#EBE5E1] sm:h-[113.7px] sm:w-[151.2px]"
              >
                <ProductImage product={it.p} color={it.color} crop="thumb" inset="p-1" />
              </div>
              <div className="min-w-0 pt-[4px] sm:pt-[12.9px]">
                <button
                  type="button"
                  onClick={() => openQuickView(it.p.id, it.color)}
                  className="block max-w-full truncate text-left text-[16px] font-bold leading-normal tracking-[-0.185px] text-ink transition-colors hover:text-electric-alt sm:text-[18.5px]"
                >
                  {it.p.name}
                </button>
                <p className="mt-[2.1px] text-[14.5px] leading-normal tracking-[-0.085px] text-muted sm:text-[17px]">
                  {it.p.colors[it.color].name} · {inr(it.p.price)}
                </p>
                <label className="mt-[6px] flex items-center gap-[16px] sm:mt-[7.5px] sm:gap-[23.8px]">
                  <span className="text-[14.5px] leading-normal tracking-[-0.085px] text-muted sm:text-[17px]">Size</span>
                  <span className="relative inline-flex">
                    <select
                      value={sizes[n]}
                      onChange={(e) => setSizes((s) => s.map((v, i) => (i === n ? e.target.value : v)))}
                      className="h-[36.6px] cursor-pointer appearance-none [field-sizing:content] rounded-[3px] border border-[#CFC8C5] bg-white/35 pl-[13.5px] pr-[43.1px] text-[16.5px] font-bold leading-normal tracking-[-0.0825px] text-ink outline-none transition-colors hover:border-ink focus-visible:border-electric-alt"
                      aria-label={`Size for ${it.p.name}`}
                    >
                      {it.p.sizes.map((s) => (
                        <option key={s} value={s} disabled={stockFor(it.p, it.color, s) <= 0}>{s}{stockFor(it.p, it.color, s) <= 0 ? ' (sold out)' : ''}</option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-[11.6px] top-1/2 size-[18px] -translate-y-1/2 text-ink">
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
                  'mt-[24px] grid size-[44px] place-items-center rounded-[2px] border transition-colors duration-200 disabled:opacity-40 sm:mt-[30.8px] sm:size-[48.2px]',
                  added === n
                    ? 'border-success bg-success text-white'
                    : 'border-[#CFC8C5] bg-white/35 text-ink hover:border-ink hover:bg-ink hover:text-white'
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

      {/* Bundle 119:795-119:799 */}
      <div className="mt-[20.2px] h-px bg-[#D8D0CC] lg:w-[498px]" aria-hidden="true" />
      <div className="mt-[30.6px] flex items-start justify-between gap-4 lg:w-[498px]">
        <div className="pl-[3.9px] pt-[2.5px]">
          <p className="text-[19px] font-extrabold leading-normal tracking-[-0.3225px] text-ink sm:text-[21.5px]">Complete the look</p>
          <p className="mt-[3.8px] text-[16px] leading-normal tracking-[-0.0925px] text-muted sm:text-[18.5px]">
            Bundle of {items.length}, save 15%
          </p>
        </div>
        <p className="text-right tabular-nums">
          <span className="block text-[15px] leading-normal tracking-[-0.085px] text-muted line-through sm:text-[17px]">{inr(total)}</span>
          <span className="mt-[5.4px] block text-[28px] font-extrabold leading-normal tracking-[-0.64px] text-ink sm:text-[32px]">{inr(bundle)}</span>
        </p>
      </div>

      {/* Add full look 119:800 */}
      <button
        type="button"
        onClick={addAll}
        className={cn(
          'group mt-[22.1px] flex h-[64.5px] w-full items-center justify-center gap-[13.5px] text-[18px] font-bold leading-normal tracking-[-0.205px] text-white transition-colors sm:text-[20.5px] lg:w-[498.9px]',
          added === 'all' ? 'bg-success' : 'bg-ink hover:bg-ink-hover'
        )}
      >
        {added === 'all' ? (
          <>Added full look <Check size={22} /></>
        ) : (
          <>
            Add full look to bag
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
