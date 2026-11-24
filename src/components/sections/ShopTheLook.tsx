import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Plus } from 'lucide-react';
import type { Look, Product } from '../../types';
import { LOOKS, getProduct, stockFor } from '../../lib/catalog';
import { cn, inr } from '../../lib/utils';
import { EASE } from '../../lib/motion';
import { flyToBag } from '../../lib/flyToBag';
import { BUNDLE_DISCOUNT, useShop } from '../../store/ShopProvider';
import { Mannequin, PIN_POS } from '../art/Mannequin';
import { ProductImage } from '../product/ProductImage';
import { SectionHeader } from '../product/bits';

const PREFERRED = ['M', '32', 'UK 8', 'One Size', 'L', 'S', '30', '34', 'UK 7', 'UK 9'];
const defaultSize = (p: Product, color: number) =>
  PREFERRED.find((s) => p.sizes.includes(s) && stockFor(p, color, s) > 0) ?? p.sizes.find((s) => stockFor(p, color, s) > 0) ?? p.sizes[0];

const lookItems = (look: Look) => look.items.map((it) => ({ ...it, p: getProduct(it.productId)! }));

/** 08. Shop the look: outfit carousel with hotspots and a 15% bundle. */
export function ShopTheLook() {
  const [index, setIndex] = useState(0);
  const go = (n: number) => setIndex((n + LOOKS.length) % LOOKS.length);

  return (
    <section id="looks" className="bg-lav-50 py-20 md:py-28" aria-labelledby="looks-title">
      <div className="container-x">
        <SectionHeader eyebrow="Shop the look" title="Styled head to toe" id="looks-title" intro="Tap a pin to find the piece. Add the full outfit to save 15%." />
        <div className="grid overflow-hidden rounded-[28px] border border-line bg-white lg:grid-cols-[1fr_400px]">
          <div className="relative flex min-h-[560px] flex-col" style={{ background: 'radial-gradient(70% 60% at 50% 40%, #fff 0%, #F1EBFF 100%)' }}>
            <p className="pt-5 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">{LOOKS[index].caption}</p>
            <div className="relative flex-1 overflow-hidden">
              {LOOKS.map((look, i) => {
                let d = i - index;
                if (d > 1) d -= LOOKS.length;
                if (d < -1) d += LOOKS.length;
                return (
                  <div key={look.id} className="absolute inset-y-4 left-1/2 aspect-[240/500] -translate-x-1/2">
                    <motion.div
                      className="relative h-full w-full"
                      animate={{ x: `${d * 105}%`, scale: d ? 0.78 : 1, opacity: d ? 0.45 : 1, filter: d ? 'blur(4px)' : 'blur(0px)' }}
                      transition={{ duration: 0.6, ease: EASE }}
                      style={{ zIndex: d ? 1 : 2, pointerEvents: d ? 'none' : 'auto' }}
                      aria-hidden={d !== 0}
                    >
                      <Mannequin look={look} className="h-full w-full" />
                      {d === 0 && look.items.map((it, n) => {
                        const p = getProduct(it.productId)!;
                        const [x, y] = PIN_POS[it.slot];
                        return <Pin key={it.productId} n={n + 1} x={x} y={y} label={p.name} target={`look-item-${look.id}-${n}`} />;
                      })}
                    </motion.div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 px-5 pb-5">
              <div className="flex gap-2">
                <button type="button" className="icon-btn size-10 border border-line bg-white" onClick={() => go(index - 1)} aria-label="Previous look"><ArrowLeft size={17} /></button>
                <button type="button" className="icon-btn size-10 border border-line bg-white" onClick={() => go(index + 1)} aria-label="Next look"><ArrowRight size={17} /></button>
              </div>
              <div className="grid flex-1 grid-cols-3 gap-3">
                {LOOKS.map((l, i) => (
                  <button key={l.id} type="button" onClick={() => go(i)} aria-current={i === index} className={cn('flex min-w-0 flex-col gap-1.5 text-left text-xs', i === index ? 'font-semibold text-ink' : 'text-muted')}>
                    <span className="relative block h-0.5 overflow-hidden rounded bg-line">
                      <motion.span className="absolute inset-0 origin-left bg-ink" animate={{ scaleX: i === index ? 1 : 0 }} transition={{ duration: 0.6, ease: EASE }} />
                    </span>
                    <span className="truncate">0{i + 1} {l.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <LookPanel key={LOOKS[index].id} look={LOOKS[index]} />
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Pin({ n, x, y, label, target }: { n: number; x: number; y: number; label: string; target: string }) {
  return (
    <button
      type="button"
      className="group absolute z-10 grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[1.5px] border-ink bg-white text-[11px] font-bold transition-[background-color,color,transform] duration-200 hover:scale-110 hover:bg-ink hover:text-white"
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={() => {
        const el = document.getElementById(target);
        el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        el?.animate([{ backgroundColor: '#ECE4FF' }, { backgroundColor: 'transparent' }], { duration: 1400, easing: 'ease-out' });
      }}
      aria-label={`Piece ${n}: ${label}`}
    >
      <span className="animate-ping-soft absolute -inset-1.5 rounded-full border-[1.5px] border-lav-400" aria-hidden="true" />
      {n}
      <span className="pointer-events-none absolute left-9 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{label}</span>
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
      className="flex flex-col gap-4 border-t border-line p-5 md:p-6 lg:border-l lg:border-t-0"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.3, ease: EASE }}
      aria-label={`Pieces in ${look.name}`}
    >
      <div>
        <p className="eyebrow">In this look</p>
        <h3 className="display mt-2 text-3xl">{look.name}</h3>
      </div>
      <ul className="flex flex-1 flex-col gap-1">
        {items.map((it, n) => (
          <li key={it.p.id} id={`look-item-${look.id}-${n}`} className="grid grid-cols-[64px_1fr_auto] items-center gap-3 rounded-2xl p-2">
            <div ref={(el) => { thumbs.current[n] = el; }} className="relative h-[72px] w-16 overflow-hidden rounded-xl art-bg">
              <span className="absolute left-1 top-1 z-10 grid size-5 place-items-center rounded-full bg-ink text-[10px] font-bold text-white">{n + 1}</span>
              <ProductImage product={it.p} color={it.color} inset="p-1.5" />
            </div>
            <div className="min-w-0">
              <button type="button" onClick={() => openQuickView(it.p.id, it.color)} className="block truncate text-left text-sm font-semibold hover:text-electric">{it.p.name}</button>
              <p className="text-xs text-muted">{it.p.colors[it.color].name} · {inr(it.p.price)}</p>
              <label className="mt-1.5 inline-flex items-center gap-1.5 text-xs">
                <span className="text-muted">Size</span>
                <select
                  value={sizes[n]}
                  onChange={(e) => setSizes((s) => s.map((v, i) => (i === n ? e.target.value : v)))}
                  className="h-7 rounded-full border border-line bg-white px-2 text-xs font-semibold outline-none focus-visible:border-electric"
                  aria-label={`Size for ${it.p.name}`}
                >
                  {it.p.sizes.map((s) => (
                    <option key={s} value={s} disabled={stockFor(it.p, it.color, s) <= 0}>{s}{stockFor(it.p, it.color, s) <= 0 ? ' (sold out)' : ''}</option>
                  ))}
                </select>
              </label>
            </div>
            <button
              type="button"
              onClick={() => addOne(n)}
              disabled={soldOut[n]}
              className={cn('grid size-9 place-items-center rounded-full border transition-colors duration-200', added === n ? 'border-success bg-success text-white' : 'border-line hover:border-ink hover:bg-ink hover:text-white')}
              aria-label={`Add ${it.p.name} to bag`}
            >
              {added === n ? <Check size={16} /> : <Plus size={16} />}
            </button>
          </li>
        ))}
      </ul>
      <div className="border-t border-line pt-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Complete the look</p>
            <p className="text-xs text-muted">Bundle of {items.length}, save 15%</p>
          </div>
          <p className="text-right tabular-nums">
            <span className="block text-xs text-muted line-through">{inr(total)}</span>
            <span className="display text-2xl">{inr(bundle)}</span>
          </p>
        </div>
        <button type="button" onClick={addAll} className={cn('btn mt-4 h-13 w-full', added === 'all' ? 'bg-success text-white' : 'btn-dark')}>
          {added === 'all' ? <>Added full look <Check size={18} /></> : <>Add full look to bag <ArrowRight size={18} className="arrow" /></>}
        </button>
      </div>
    </motion.aside>
  );
}
