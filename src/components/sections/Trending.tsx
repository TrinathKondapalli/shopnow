import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Eye } from 'lucide-react';
import type { Product } from '../../types';
import { PRODUCTS, discountPct, isSoldOut } from '../../lib/catalog';
import { cn, inr, prefersReducedMotion } from '../../lib/utils';
import { EASE } from '../../lib/motion';
import { useShop } from '../../store/ShopProvider';
import { ProductImage } from '../product/ProductImage';
import { Stars } from '../product/bits';

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
    <section id="trending" className="relative scroll-mt-16 md:scroll-mt-20 bg-bg py-14 md:py-20" aria-labelledby="trending-title">
      {/* Header */}
      <div className="mx-auto flex w-full max-w-[1648px] flex-wrap items-start justify-between gap-x-6 gap-y-3 px-5 md:px-10 xl:pl-[64.5px] xl:pr-[64px]">
        <div className="min-w-0">
          <div className="flex items-center gap-4">
            <span className="h-[1px] w-10 shrink-0 bg-accent" aria-hidden="true" />
            <p className="eyebrow whitespace-nowrap">
              TRENDING &amp; BESTSELLERS
            </p>
          </div>
          <h2
            id="trending-title"
            className="mt-2 font-display text-[30px] font-semibold leading-[1.15] tracking-[-0.01em] text-text md:text-[48px]"
          >
            What everyone is <span className="italic text-accent">wearing</span>
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
                      'whitespace-nowrap px-[12.7px] pb-[14px] text-[16px] leading-[22px] transition-colors md:text-[18px]',
                      active ? 'font-semibold text-accent' : 'font-medium text-text-muted hover:text-text',
                    )}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-border" aria-hidden="true" />
            <motion.div
              className="absolute bottom-0 h-[2px] bg-accent"
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
              className="flex size-[44px] items-center justify-center rounded-full border border-border-strong bg-bg text-text transition-[transform,opacity] duration-200 ease-soft hover:scale-105 hover:border-text active:scale-95 disabled:opacity-40 disabled:hover:scale-100 md:size-[48.1px]"
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
              className="flex size-[44px] items-center justify-center rounded-full bg-action text-action-text transition-[transform,opacity,background-color] duration-200 ease-soft hover:scale-105 hover:bg-action-hover active:scale-95 disabled:opacity-40 disabled:hover:scale-100 md:mt-[0.95px] md:size-[47.2px]"
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
        <div className="relative h-[3.2px] w-full rounded-pill bg-border" aria-hidden="true">
          <div
            className="absolute inset-y-0 rounded-pill bg-accent transition-[left] duration-150"
            style={{ width: `${THUMB_PCT}%`, left: `${progress * (100 - THUMB_PCT)}%` }}
          />
        </div>
      </div>
    </section>
  );
}

function TrendingCard({ product, rank }: { product: Product; rank: number }) {
  const { openQuickView, isWished, toggleWish, toast, openPanel } = useShop();
  const [color, setColor] = useState(0);
  const off = discountPct(product);
  const soldOut = isSoldOut(product);
  const wished = isWished(product.id);
  const badge = soldOut
    ? { label: 'Sold out', className: 'bg-bg-alt text-error' }
    : off > 0
      ? { label: `-${off}%`, className: 'bg-accent-soft text-accent' }
      : product.isNew
        ? { label: 'New', className: 'border border-border-strong bg-bg text-text' }
        : null;

  const onWish = (e: MouseEvent) => {
    e.stopPropagation();
    const added = toggleWish(product.id);
    toast(added
      ? { title: 'Saved to wishlist', description: product.name, action: { label: 'View', onClick: () => openPanel('wishlist') } }
      : { title: 'Removed from wishlist', description: product.name, tone: 'info' });
  };

  return (
    <article className="group relative rounded-[var(--radius-card)] border border-transparent bg-bg p-2 transition-[border-color,box-shadow] duration-300 hover:border-border hover:shadow-[var(--shadow-card)]">
      {/* Product image */}
      <div
        className="relative aspect-[303.3/345] w-full cursor-pointer overflow-hidden rounded-[var(--radius-card)] bg-bg-alt"
        onClick={() => openQuickView(product.id, color)}
      >
        <ProductImage product={product} color={color} crop="portrait" className="transition-transform duration-300 ease-soft group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-bg-alt opacity-0 transition-opacity duration-300 ease-soft group-hover:opacity-100" aria-hidden="true">
          <ProductImage product={product} color={color} view="alt" crop="portrait" />
        </div>

        {/* Scrim so the white rank number stays readable on light photos */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b from-text/65 to-transparent" aria-hidden="true" />
        <p className="pointer-events-none absolute left-[18px] top-[10px] font-display text-[44px] font-bold italic leading-normal text-text-inverse tabular-nums">
          #{rank}
        </p>

        {/* One badge per card: sold out, then discount, then New */}
        {badge && (
          <div className="pointer-events-none absolute left-[19px] top-[68px]">
            <Pill className={badge.className}>{badge.label}</Pill>
          </div>
        )}

        <button
          type="button"
          onClick={onWish}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className={cn(
            'absolute right-[12px] top-[12px] z-10 flex size-11 items-center justify-center overflow-hidden rounded-full border border-bg backdrop-blur-[2px] transition-[background-color,color,transform] duration-200 ease-soft hover:scale-105 active:scale-90',
            wished ? 'bg-bg text-accent' : 'bg-white/25 text-text-inverse hover:bg-white/40',
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
          className="absolute inset-x-3 bottom-3 hidden h-11 translate-y-3 items-center justify-center gap-2 rounded-btn bg-action text-[15px] font-semibold text-action-text opacity-0 transition-[opacity,transform,background-color] duration-300 ease-soft hover:bg-action-hover focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:hover)]:flex"
          aria-label={`Quick view ${product.name}`}
        >
          <Eye size={16} /> Quick view
        </button>
      </div>

      {/* Details */}
      <div className="px-1.5 pt-2.5 pb-1">
        <div className="relative">
          <p className="text-[13px] font-medium text-text-muted">{product.type}</p>
          <div className="absolute -right-[7px] -top-[13px] flex md:-top-[6px] md:right-[0px] md:gap-3" role="group" aria-label="Colours">
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColor(i)}
                aria-label={c.name}
                aria-pressed={i === color}
                className="grid size-11 place-items-center rounded-full md:size-[30px] md:-m-[6px]"
              >
                <span
                  className={cn('block size-[16px] rounded-full border border-text/20 transition-shadow md:size-[18px]', i === color && 'ring-2 ring-text ring-offset-2 ring-offset-bg')}
                  style={{ background: c.hex }}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </div>
        <h3 className="mt-1 truncate font-sans text-[15px] font-semibold leading-normal lg:text-[16px]">
          <button type="button" onClick={() => openQuickView(product.id, color)} className="text-left text-text transition-colors hover:text-accent">
            {product.name}
          </button>
        </h3>
        <p className="mt-1 flex items-baseline gap-2 tabular-nums">
          <span className="text-[16px] font-bold text-text md:text-[18px]">{inr(product.price)}</span>
          {product.compareAt && <span className="text-[14px] text-text-muted line-through">{inr(product.compareAt)}</span>}
        </p>
        <div className="mt-1.5 flex items-center gap-3">
          <Stars value={product.rating} size={15} />
          <p className="whitespace-nowrap text-[13px] font-medium text-text-muted tabular-nums">
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
