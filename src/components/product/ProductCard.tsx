import { useState } from 'react';
import { motion } from 'motion/react';
import { Eye } from 'lucide-react';
import type { Product } from '../../types';
import { LOW_STOCK, colorStock, discountPct, isSoldOut } from '../../lib/catalog';
import { cn } from '../../lib/utils';
import { DUR, EASE } from '../../lib/motion';
import { useShop } from '../../store/ShopProvider';
import { ProductImage } from './ProductImage';
import { Price, Stars, WishButton } from './bits';

interface Props {
  product: Product;
  rank?: number;
  compact?: boolean;
  className?: string;
}

/** Product card: alternate image on hover (300ms), wishlist heart, colour dots and a quick-view button. */
export function ProductCard({ product, rank, compact, className }: Props) {
  const { openQuickView } = useShop();
  const [color, setColor] = useState(0);
  const off = discountPct(product);
  const soldOut = isSoldOut(product);
  const lowStock = !soldOut && colorStock(product, color) <= LOW_STOCK * 2;

  return (
    <article className={cn('group relative', className)}>
      <div
        className="relative aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl art-bg"
        onClick={() => openQuickView(product.id, color)}
      >
        <ProductImage product={product} color={color} className="transition-transform duration-300 ease-out group-hover:scale-[1.04]" />
        {/* Alternate image fades in on hover */}
        <div className="absolute inset-0 art-bg-alt opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" aria-hidden="true">
          <ProductImage product={product} color={color} view="alt" />
        </div>

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {rank !== undefined && <span className="display grid size-9 place-items-center rounded-full bg-ink text-sm text-white">#{rank}</span>}
          {product.isNew && <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-ink">New</span>}
          {off > 0 && <span className="rounded-full bg-electric px-2.5 py-1 text-[11px] font-semibold text-white">-{off}%</span>}
          {soldOut && <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white">Sold out</span>}
        </div>

        <WishButton product={product} className="absolute right-3 top-3" />

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); openQuickView(product.id, color); }}
          className="absolute inset-x-3 bottom-3 flex h-11 items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white transition-[opacity,transform,background-color] duration-300 ease-out hover:bg-electric focus-visible:translate-y-0 focus-visible:opacity-100 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
          aria-label={`Quick view ${product.name}`}
        >
          <Eye size={16} /> Quick view
        </button>
      </div>

      <div className={cn('flex flex-col gap-1 px-1 pt-3', compact && 'pt-2.5')}>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted">{product.type}</span>
          {!compact && (
            <div className="flex gap-1.5" role="group" aria-label="Colours">
              {product.colors.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColor(i)}
                  aria-label={c.name}
                  aria-pressed={i === color}
                  className={cn('size-4 rounded-full border border-black/10 ring-offset-2 transition-shadow', i === color && 'ring-1 ring-ink')}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          )}
        </div>
        <h3 className="text-[15px] font-semibold leading-snug">
          <button type="button" onClick={() => openQuickView(product.id, color)} className="text-left hover:text-electric">{product.name}</button>
        </h3>
        <Price product={product} className="text-sm" />
        {!compact && (
          <div className="flex items-center gap-2 text-xs text-muted">
            <Stars value={product.rating} size={12} /> <span>{product.rating} ({product.reviewCount})</span>
            {lowStock && <span className="ml-auto font-medium text-warn">Low stock</span>}
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
      <div className="skeleton aspect-[4/5] rounded-2xl" />
      <div className="skeleton mt-3 h-3 w-1/3 rounded" />
      <div className="skeleton mt-2 h-4 w-2/3 rounded" />
      <div className="skeleton mt-2 h-3 w-1/4 rounded" />
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
