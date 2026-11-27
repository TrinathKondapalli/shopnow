import { useState, type CSSProperties } from 'react';
import { motion } from 'motion/react';
import { Eye } from 'lucide-react';
import type { Product } from '../../types';
import { LOW_STOCK, colorStock, discountPct, isSoldOut, typeLabel } from '../../lib/catalog';
import { cn, inr } from '../../lib/utils';
import { DUR, EASE } from '../../lib/motion';
import { useShop } from '../../store/ShopProvider';
import { ProductImage } from './ProductImage';
import { WishButton } from './bits';

interface Props {
  product: Product;
  rank?: number;
  compact?: boolean;
  className?: string;
}

/** Very light swatches get a border outline on the white dot. */
const needsOutline = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255) > 225;
};

/** Figma "Stars" (70x12, 12px stars on a 14.5px pitch) with a fill clipped to the rating. */
function FigmaStars({ value }: { value: number }) {
  const icon = { '--icon': 'url(/figma/explore/stars.svg)' } as CSSProperties;
  return (
    <span className="relative block h-[12px] w-[70px] shrink-0" role="img" aria-label={`Rated ${value} out of 5`}>
      <span className="figma-icon absolute inset-0 text-border" style={icon} />
      <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${Math.max(0, Math.min(1, value / 5)) * 100}%` }}>
        <span className="figma-icon h-[12px] w-[70px] text-rating" style={icon} />
      </span>
    </span>
  );
}

/** Product card: surface background, border on images, warm hover shadow, alternate image on hover. */
export function ProductCard({ product, rank, compact, className }: Props) {
  const { openQuickView } = useShop();
  const [color, setColor] = useState(0);
  const [picked, setPicked] = useState(false);
  const off = discountPct(product);
  const soldOut = isSoldOut(product);
  const lowStock = !soldOut && colorStock(product, color) <= LOW_STOCK * 2;

  return (
    <article className={cn('group relative rounded-[var(--radius-card)] border border-transparent bg-bg p-2 transition-[border-color,box-shadow] duration-300 hover:border-border hover:shadow-[var(--shadow-card)]', className)}>
      <div
        className={cn(
          'relative cursor-pointer overflow-hidden rounded-[var(--radius-card)] bg-bg-alt',
          rank !== undefined ? 'aspect-[4/5]' : 'aspect-[297.198/247.844]',
        )}
        onClick={() => openQuickView(product.id, color)}
      >
        <ProductImage product={product} color={color} crop="grid" className="transition-transform duration-300 ease-out group-hover:scale-[1.03]" />
        {/* Alternate image fades in on hover */}
        <div className="absolute inset-0 bg-bg-alt opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" aria-hidden="true">
          <ProductImage product={product} color={color} view="alt" crop="grid" />
        </div>

        <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">
          {rank !== undefined && (
            <span className="rounded-btn bg-text/80 px-2 py-0.5 font-display text-2xl font-bold italic text-text-inverse md:text-3xl">
              #{rank}
            </span>
          )}
          <CardBadge product={product} soldOut={soldOut} />
        </div>

        <WishButton product={product} variant="flat" className="absolute right-3 top-3 z-10" />

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); openQuickView(product.id, color); }}
          className="absolute inset-x-3 bottom-3 hidden h-11 translate-y-3 items-center justify-center gap-2 rounded-btn bg-action text-[15px] font-semibold text-action-text opacity-0 transition-[opacity,transform,background-color] duration-300 ease-out hover:bg-action-hover focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:hover)]:flex"
          aria-label={`Quick view ${product.name}`}
        >
          <Eye size={16} /> Quick view
        </button>
      </div>

      <div className={cn('relative px-1.5 pb-2 pt-2 leading-[normal]')}>
        <div className={cn('flex flex-wrap items-center justify-between gap-x-2', !compact && 'sm:min-h-11')}>
          <p className="text-[13px] font-medium text-text-muted max-sm:basis-full">{typeLabel(product.type)}</p>
          {!compact && product.colors.length > 1 && (
            <div className="flex h-11 items-center gap-[28px] pl-[14px] sm:mr-[8px] sm:pl-0" role="group" aria-label={`Colours for ${product.name}`}>
              {product.colors.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => { setColor(i); setPicked(true); }}
                  aria-label={c.name}
                  aria-pressed={i === color}
                  title={c.name}
                  className={cn(
                    'relative size-4 rounded-full transition-shadow duration-150 after:absolute after:-inset-[14px] after:content-[\'\']',
                    needsOutline(c.hex) && 'border border-border-strong',
                    picked && i === color ? 'ring-2 ring-text ring-offset-2 ring-offset-bg' : '',
                  )}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          )}
        </div>
        <h3 className="mt-0.5 font-sans text-[15px] font-semibold leading-snug lg:text-[16px]">
          <button type="button" onClick={() => openQuickView(product.id, color)} className="text-left text-text transition-colors hover:text-accent">
            {product.name}
          </button>
        </h3>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-2.5 whitespace-nowrap tabular-nums">
          <span className="text-[16px] font-bold text-text md:text-[18px]">{inr(product.price)}</span>
          {product.compareAt && (
            <>
              <span className="text-[14px] text-text-muted line-through"><span className="sr-only">was </span>{inr(product.compareAt)}</span>
              <span className="text-[13px] font-semibold text-accent">{off}% off</span>
            </>
          )}
        </p>
        {!compact && (
          <div className="mt-2 flex items-center gap-3">
            <FigmaStars value={product.rating} />
            <span className="whitespace-nowrap text-[13px] font-medium text-text-muted tabular-nums">{product.rating} ({product.reviewCount})</span>
            {lowStock && <span className="ml-auto whitespace-nowrap text-[12px] font-medium text-warning">Low stock</span>}
          </div>
        )}
      </div>
    </article>
  );
}

function CardBadge({ product, soldOut }: { product: Product; soldOut: boolean }) {
  const off = discountPct(product);
  const base = 'flex h-[25px] min-w-[60px] items-center justify-center rounded-pill px-3 text-[12px] font-semibold leading-[normal]';
  if (soldOut) return <span className={cn(base, 'bg-bg-alt text-error')}>Sold out</span>;
  if (off > 0) return <span className={cn(base, 'bg-accent-soft text-accent')}><span className="sr-only">Save </span>-{off}%</span>;
  if (product.isNew) return <span className={cn(base, 'border border-border-strong bg-bg text-text')}>New</span>;
  return null;
}

/** Skeleton shown while the grid loads. */
export function ProductCardSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="skeleton aspect-[297.198/247.844]" />
      <div className="skeleton mt-[6px] h-3 w-1/3 rounded" />
      <div className="skeleton mt-2 h-4 w-2/3 rounded" />
      <div className="skeleton mt-2 h-4 w-1/4 rounded" />
      <div className="skeleton mt-2 h-3 w-1/2 rounded" />
    </div>
  );
}

/** Grid item wrapper: animated rearrangement when filters change (300ms). */
export function GridItem({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: DUR.filter, ease: EASE, delay: Math.min(index, 8) * 0.03 }}
    >
      <ProductCard product={product} />
    </motion.div>
  );
}
