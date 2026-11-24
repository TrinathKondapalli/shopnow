import type { Product } from '../../types';
import { cn } from '../../lib/utils';
import { Garment, type GarmentView } from '../art/Garment';

const VIEW_INDEX: Record<GarmentView, number> = { front: 0, alt: 1, detail: 2 };

interface Props {
  product: Product;
  color?: number;
  view?: GarmentView;
  className?: string;
  /** Padding around illustrated art; photos always fill the frame. */
  inset?: string;
}

/**
 * Shows a real photo when one is set for this colour and view in products.json,
 * otherwise the illustrated garment.
 */
export function ProductImage({ product, color = 0, view = 'front', className, inset = 'p-[12%]' }: Props) {
  const c = product.colors[color] ?? product.colors[0];
  const photo = c.images?.[VIEW_INDEX[view]];
  if (photo) {
    return (
      <img
        src={photo}
        alt={`${product.name} in ${c.name}`}
        loading="lazy"
        decoding="async"
        className={cn('h-full w-full object-cover', className)}
      />
    );
  }
  return (
    <div className={cn('grid h-full w-full place-items-center', view === 'detail' ? '' : inset, className)} role="img" aria-label={`${product.name} in ${c.name}`}>
      <Garment kind={product.art} color={c.hex} view={view} className="h-full w-full" />
    </div>
  );
}
