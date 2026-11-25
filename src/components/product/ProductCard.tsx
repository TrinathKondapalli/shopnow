import { useState, type CSSProperties } from 'react';
import { motion } from 'motion/react';
import { Eye } from 'lucide-react';
import type { Product } from '../../types';
import { LOW_STOCK, colorStock, discountPct, isSoldOut } from '../../lib/catalog';
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

/** Very light swatches get the 1px #2A2A2A outline Figma draws on the white dot. */
const needsOutline = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255) > 225;
};

/** Figma "Stars" (70x12, 12px stars on a 14.5px pitch) with a fill clipped to the rating. */
function FigmaStars({ value }: { value: number }) {
  const icon = { '--icon': 'url(/figma/explore/stars.svg)' } as CSSProperties;
  return (
    <span className="relative block h-[12px] w-[70px] shrink-0" role="img" aria-label={`Rated ${value} out of 5`}>
      <span className="figma-icon absolute inset-0 text-[#E4DAD7]" style={icon} />
      <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${Math.max(0, Math.min(1, value / 5)) * 100}%` }}>
        <span className="figma-icon h-[12px] w-[70px] text-electric-alt" style={icon} />
      </span>
    </span>
  );
}

/** Product card (Figma "Product Card", 110:337): alternate image on hover (300ms), wishlist heart, colour dots and quick view. */
export function ProductCard({ product, rank, compact, className }: Props) {
  const { openQuickView } = useShop();
  const [color, setColor] = useState(0);
  const [picked, setPicked] = useState(false);
  const off = discountPct(product);
  const soldOut = isSoldOut(product);
  const lowStock = !soldOut && colorStock(product, color) <= LOW_STOCK * 2;

  return (
    <article className={cn('group relative', className)}>
      <div
        className={cn(
          'relative cursor-pointer overflow-hidden bg-[#EBE5E1]',
          rank !== undefined ? 'aspect-[4/5]' : 'aspect-[297.198/247.844]',
        )}
        onClick={() => openQuickView(product.id, color)}
      >
        <ProductImage product={product} color={color} crop="grid" className="transition-transform duration-300 ease-out group-hover:scale-[1.03]" />
        {/* Alternate image fades in on hover */}
        <div className="absolute inset-0 bg-[#E6DDF8] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" aria-hidden="true">
          <ProductImage product={product} color={color} view="alt" crop="grid" />
        </div>

        <div className="pointer-events-none absolute left-[11.8px] top-[10.7px] z-10 flex flex-col items-start gap-1.5">
          {rank !== undefined && (
            <span className="text-3xl font-extrabold italic text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] md:text-4xl">
              #{rank}
            </span>
          )}
          {product.isNew && (
            <span className="flex h-[24.7px] min-w-[60px] items-center rounded-[2px] bg-white px-[12px] text-[13.5px] font-semibold leading-[normal] text-ink">
              New
            </span>
          )}
          {off > 0 && (
            <span className="flex h-[24.7px] min-w-[60px] items-center rounded-[2px] bg-electric-alt px-[12px] text-[13.5px] font-semibold leading-[normal] text-white">
              -{off}%
            </span>
          )}
          {soldOut && (
            <span className="flex h-[24.7px] items-center rounded-[2px] bg-ink px-[12px] text-[13.5px] font-semibold leading-[normal] text-white">
              Sold out
            </span>
          )}
        </div>

        <WishButton product={product} variant="flat" className="absolute right-[12.9px] top-[10.7px] z-10" />

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); openQuickView(product.id, color); }}
          className="absolute inset-x-3 bottom-3 hidden h-11 translate-y-3 items-center justify-center gap-2 rounded-[1px] bg-ink text-sm font-semibold text-white opacity-0 transition-[opacity,transform,background-color] duration-300 ease-out hover:bg-ink-hover focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:hover)]:flex"
          aria-label={`Quick view ${product.name}`}
        >
          <Eye size={16} /> Quick view
        </button>
      </div>

      <div className={cn('relative px-[6.4px] pb-[10.5px] pt-[6.1px] leading-[normal]')}>
        <p className="text-[12.5px] text-ink">{product.type}</p>
        {!compact && (
          <div className="absolute right-[13.9px] top-[8px] flex gap-[7px] sm:top-[16.6px]" role="group" aria-label="Colours">
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                type="button"
                onClick={() => { setColor(i); setPicked(true); }}
                aria-label={c.name}
                aria-pressed={i === color}
                title={c.name}
                className={cn(
                  'relative size-[14px] rounded-full outline-offset-2 transition-[outline-color] duration-150 after:absolute after:-inset-[7px]',
                  needsOutline(c.hex) && 'border border-[#2A2A2A]',
                  picked && i === color ? 'outline outline-1 outline-ink' : 'outline-transparent',
                )}
                style={{ background: c.hex }}
              />
            ))}
          </div>
        )}
        <h3 className={cn('mt-[0.4px] text-[16.5px] font-semibold tracking-[-0.0825px]', !compact && 'sm:pr-[64px]')}>
          <button type="button" onClick={() => openQuickView(product.id, color)} className="text-left text-ink transition-colors hover:text-electric-alt">
            {product.name}
          </button>
        </h3>
        <p className="mt-[3.1px] flex flex-wrap items-baseline gap-x-[10px] whitespace-nowrap tabular-nums">
          <span className="text-[17.5px] font-bold tracking-[-0.0875px] text-ink">{inr(product.price)}</span>
          {product.compareAt && (
            <>
              <span className="text-[13px] text-[#716F73]"><span className="sr-only">was </span>{inr(product.compareAt)}</span>
              <span className="text-[13px] font-semibold text-electric-alt">{off}% off</span>
            </>
          )}
        </p>
        {!compact && (
          <div className="mt-[6.5px] flex items-center gap-[12px]">
            <FigmaStars value={product.rating} />
            <span className="whitespace-nowrap text-[13px] text-[#716F73]">{product.rating} ({product.reviewCount})</span>
            {lowStock && <span className="ml-auto whitespace-nowrap text-[12px] font-medium text-warn">Low stock</span>}
          </div>
        )}
      </div>
    </article>
  );
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
