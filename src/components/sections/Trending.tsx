import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Eye } from 'lucide-react';
import type { Product } from '../../types';
import { PRODUCTS, discountPct, isSoldOut } from '../../lib/catalog';
import { cn, inr, prefersReducedMotion } from '../../lib/utils';
import { EASE } from '../../lib/motion';
import { useShop } from '../../store/ShopProvider';
import { ProductImage } from '../product/ProductImage';

type Mode = 'trending' | 'bestsellers';

const TABS: { id: Mode; label: string }[] = [
  { id: 'trending', label: 'Trending' },
  { id: 'bestsellers', label: 'Bestsellers' },
];

/** Figma "Scroll Progress" is 138px of a 1518.2px track. */
const THUMB_PCT = (138 / 1518.2) * 100;

const icon = (name: string) => ({ '--icon': `url(/figma/trending/${name}.svg)` }) as CSSProperties;

/** 05. Trending & bestsellers: ranked, swipeable product row (Figma 117:579). */
export function Trending() {
  const [mode, setMode] = useState<Mode>('trending');
  const rail = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 105.3 });
  const [progress, setProgress] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });

  const list = useMemo(
    () => [...PRODUCTS].sort((a, b) => (mode === 'trending' ? b.trending - a.trending : b.popularity - a.popularity)).slice(0, 8),
    [mode],
  );

  // Indicator follows the active tab button.
  useLayoutEffect(() => {
    const measure = () => {
      const btn = tabRefs.current[TABS.findIndex((t) => t.id === mode)];
      if (btn) setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [mode]);

  // Progress bar and arrow states follow the rail's own scroll position.
  const onScroll = () => {
    const el = rail.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft >= max - 4 });
  };
  useEffect(() => {
    onScroll();
    window.addEventListener('resize', onScroll);
    return () => window.removeEventListener('resize', onScroll);
  }, [list]);

  const scrollByArrow = (dir: number) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-card]');
    const step = card ? card.offsetWidth + 22 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  const handleTabChange = (t: Mode) => {
    setMode(t);
    rail.current?.scrollTo({ left: 0 });
  };

  return (
    <section id="trending" className="relative scroll-mt-16 md:scroll-mt-20 bg-[#F8F1ED] py-14 md:py-20" aria-labelledby="trending-title">
      {/* Header */}
      <div className="mx-auto flex w-full max-w-[1648px] flex-wrap items-start justify-between gap-x-6 gap-y-3 px-5 md:px-10 xl:pl-[64.5px] xl:pr-[64px]">
        <div className="min-w-0">
          <div className="flex items-center gap-[19.9px]">
            <span className="h-[2px] w-[42.7px] shrink-0 bg-electric-alt" aria-hidden="true" />
            <p className="whitespace-nowrap text-[14px] font-semibold leading-normal tracking-[0.064px] text-electric-alt md:text-[16px]">
              TRENDING &amp; BESTSELLERS
            </p>
          </div>
          <h2
            id="trending-title"
            className="mt-[2.24px] pl-[0.9px] text-[clamp(1.85rem,3.4vw,48px)] font-bold leading-normal tracking-[1.035px] text-ink"
          >
            What everyone is <span className="font-bold italic text-electric-alt">wearing</span>
          </h2>
        </div>

        <div className="flex max-w-full items-start gap-[29.95px] xl:mt-[20px]">
          {/* Tabs */}
          <div className="relative w-[336px] max-w-[calc(100vw-160px)] xl:mt-[9.73px]">
            <div className="flex gap-[17.3px]" role="tablist" aria-label="Ranking">
              {TABS.map((t, i) => {
                const active = mode === t.id;
                return (
                  <button
                    key={t.id}
                    ref={(el) => { tabRefs.current[i] = el; }}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => handleTabChange(t.id)}
                    className={cn(
                      'whitespace-nowrap px-[12.7px] pb-[14px] text-[16px] leading-[22px] tracking-[-0.0925px] transition-colors md:text-[18.5px]',
                      active ? 'font-semibold text-ink' : 'font-medium text-muted hover:text-ink',
                    )}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-[#E3DCD8]" aria-hidden="true" />
            <motion.div
              className="absolute bottom-0 h-[2.7px] bg-electric-alt"
              initial={false}
              animate={{ left: indicator.left, width: indicator.width }}
              transition={{ duration: 0.25, ease: EASE }}
              aria-hidden="true"
            />
          </div>

          {/* Arrows */}
          <div className="flex shrink-0 items-start gap-[16.85px]">
            <button
              type="button"
              onClick={() => scrollByArrow(-1)}
              disabled={edges.start}
              aria-label="Scroll left"
              className="flex size-[44px] items-center justify-center rounded-full border border-[#DDD5D1] bg-white text-ink transition-[transform,opacity] duration-200 ease-soft hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 md:size-[48.1px]"
            >
              <span className="relative size-[21.864px] shrink-0 overflow-hidden">
                <span className="absolute inset-[20.83%_16.67%]">
                  <span className="absolute inset-[-6.07%_-5.31%]">
                    <span className="figma-icon" style={icon('icon-arrow-left')} />
                  </span>
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => scrollByArrow(1)}
              disabled={edges.end}
              aria-label="Scroll right"
              className="flex size-[44px] items-center justify-center rounded-full bg-electric-alt text-white transition-[transform,opacity] duration-200 ease-soft hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 md:mt-[0.95px] md:size-[47.2px]"
            >
              <span className="relative size-[21.455px] shrink-0 overflow-hidden">
                <span className="absolute inset-[20.83%_16.67%]">
                  <span className="absolute inset-[-6.07%_-5.31%]">
                    <span className="figma-icon" style={icon('icon-arrow-right')} />
                  </span>
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Swipeable row */}
      <div
        ref={rail}
        onScroll={onScroll}
        className="no-scrollbar mt-8 flex snap-x snap-mandatory scroll-px-5 gap-[22.2px] overflow-x-auto px-5 pb-2 md:mt-10 md:scroll-px-10 md:px-10 xl:scroll-px-[max(63.6px,calc((100vw-1648px)/2+63.6px))] xl:px-[max(63.6px,calc((100vw-1648px)/2+63.6px))]"
      >
        {list.map((p, i) => (
          <div
            key={`${mode}-${p.id}`}
            data-card
            className="w-[72vw] shrink-0 snap-start sm:w-[44vw] md:w-[32vw] lg:w-[24vw] xl:w-[303.3px]"
          >
            <TrendingCard product={p} rank={i + 1} />
          </div>
        ))}
      </div>

      {/* Scroll progress */}
      <div className="mx-auto mt-6 w-full max-w-[1648px] px-5 md:px-10 xl:pl-[64.5px] xl:pr-[65.3px]">
        <div className="relative h-[3.2px] w-full rounded-[4px] bg-[#DCD4D0]" aria-hidden="true">
          <div
            className="absolute inset-y-0 rounded-[4px] bg-electric-alt transition-[left] duration-150"
            style={{ width: `${THUMB_PCT}%`, left: `${progress * (100 - THUMB_PCT)}%` }}
          />
        </div>
      </div>
    </section>
  );
}

/** Figma "Trending Card" (117:555): full-bleed photo, rank, pill, glass wishlist button, details below. */
function TrendingCard({ product, rank }: { product: Product; rank: number }) {
  const { openQuickView, isWished, toggleWish, toast, openPanel } = useShop();
  const [color, setColor] = useState(0);
  const off = discountPct(product);
  const soldOut = isSoldOut(product);
  const wished = isWished(product.id);

  const onWish = (e: MouseEvent) => {
    e.stopPropagation();
    const added = toggleWish(product.id);
    toast(added
      ? { title: 'Saved to wishlist', description: product.name, action: { label: 'View', onClick: () => openPanel('wishlist') } }
      : { title: 'Removed from wishlist', description: product.name, tone: 'info' });
  };

  return (
    <article className="group relative">
      {/* Product image */}
      <div
        className="relative aspect-[303.3/345] w-full cursor-pointer overflow-hidden bg-line"
        onClick={() => openQuickView(product.id, color)}
      >
        <ProductImage product={product} color={color} crop="portrait" className="transition-transform duration-300 ease-soft group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-line opacity-0 transition-opacity duration-300 ease-soft group-hover:opacity-100" aria-hidden="true">
          <ProductImage product={product} color={color} view="alt" crop="portrait" />
        </div>

        <p className="pointer-events-none absolute left-[18.2px] top-[9.87px] text-[47px] font-extrabold italic leading-normal tracking-[-1.41px] text-white">
          #{rank}
        </p>

        <div className="pointer-events-none absolute left-[19.1px] top-[69.9px] flex flex-col items-start gap-1.5">
          {product.isNew && <Pill className="bg-white text-ink">New</Pill>}
          {off > 0 && <Pill className="bg-electric-alt text-white">-{off}%</Pill>}
          {soldOut && <Pill className="bg-ink text-white">Sold out</Pill>}
        </div>

        <button
          type="button"
          onClick={onWish}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className={cn(
            'absolute right-[14.5px] top-[14.95px] z-10 flex size-10 items-center justify-center overflow-hidden rounded-full border-[1.5px] border-solid border-white backdrop-blur-[2px] transition-[background-color,color,transform] duration-200 ease-soft hover:scale-105 active:scale-90',
            wished ? 'bg-white text-electric-alt' : 'bg-white/18 text-white hover:bg-white/30',
          )}
        >
          <span className="relative size-[19px] shrink-0 overflow-hidden">
            <span className="absolute inset-[12.5%_8.33%]">
              <span className="absolute inset-[-5%_-4.5%]">
                <span className="figma-icon" style={icon('icon-heart')} />
              </span>
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); openQuickView(product.id, color); }}
          className="absolute inset-x-3 bottom-3 hidden h-11 translate-y-3 items-center justify-center gap-2 bg-ink text-sm font-semibold text-white opacity-0 transition-[opacity,transform,background-color] duration-300 ease-soft hover:bg-ink-hover focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:hover)]:flex"
          aria-label={`Quick view ${product.name}`}
        >
          <Eye size={16} /> Quick view
        </button>
      </div>

      {/* Details */}
      <div className="px-[1.8px] pt-2 pb-0.5">
        <div className="relative">
          <p className="text-[13px] md:text-[14px] font-normal leading-normal text-ink">{product.type}</p>
          <div className="absolute right-[6.2px] top-[-0.14px] flex gap-[6.4px]" role="group" aria-label="Colours">
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColor(i)}
                aria-label={c.name}
                aria-pressed={i === color}
                className={cn('relative size-[16px] md:size-[18.2px] rounded-full transition-shadow after:absolute after:-inset-[7px]', i === color && 'shadow-[0_0_0_1.5px_#0A0A0A]')}
                style={{ background: c.hex }}
              />
            ))}
          </div>
        </div>
        <h3 className="mt-1 truncate text-[17px] md:text-[19px] font-semibold leading-normal tracking-[-0.19px]">
          <button type="button" onClick={() => openQuickView(product.id, color)} className="text-left text-ink transition-colors hover:text-electric-alt">
            {product.name}
          </button>
        </h3>
        <p className="mt-1 flex items-baseline gap-2 tabular-nums">
          <span className="text-[20px] md:text-[22px] font-bold leading-normal tracking-[-0.22px] text-ink">{inr(product.price)}</span>
          {product.compareAt && <span className="text-[14px] text-muted line-through">{inr(product.compareAt)}</span>}
        </p>
        <div className="mt-1.5 flex items-center gap-[10px] md:gap-[14.5px]">
          <img src="/figma/trending/stars.svg" alt={`Rated ${product.rating} out of 5`} className="h-[14px] md:h-[16px] w-[80px] md:w-[92px] shrink-0" />
          <p className="whitespace-nowrap text-[14px] md:text-[16px] font-normal leading-normal text-ink">
            {product.rating} ({product.reviewCount})
          </p>
        </div>
      </div>
    </article>
  );
}

function Pill({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span className={cn('flex h-[22.7px] items-center overflow-hidden whitespace-nowrap rounded-[100px] px-[10.9px] text-[13.5px] font-semibold leading-normal', className)}>
      {children}
    </span>
  );
}
