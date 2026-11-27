import { useState } from 'react';
import type { PhotoCrop, Product } from '../../types';
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
  /** Preferred art-directed crop for the front photo; falls back to images[0]. */
  crop?: PhotoCrop;
  /** Override the default alt ("{name} in {colour}"). Pass "" when the image is decorative, e.g. inside a labelled button. */
  alt?: string;
}

/**
 * Shows a real photo when one is set for this colour and view in products.json,
 * otherwise the illustrated garment.
 */
export function ProductImage({ product, color = 0, view = 'front', className, inset = 'p-[12%]', crop, alt }: Props) {
  const c = product.colors[color] ?? product.colors[0];
  const front = (crop && c.photos?.[crop]) || c.images?.[0];
  // A product with a front photo never falls back to illustration for its other views.
  const photo = view === 'front' ? front : c.images?.[VIEW_INDEX[view]] ?? front;
  const [loaded, setLoaded] = useState(false);
  const label = alt ?? `${product.name} in ${c.name}`;
  if (photo) {
    return (
      <img
        src={photo}
        alt={label}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={cn('h-full w-full object-cover', !loaded && 'skeleton', className)}
      />
    );
  }
  return (
    <div className={cn('grid h-full w-full place-items-center', view === 'detail' ? '' : inset, className)} {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}>
      <Garment kind={product.art} color={c.hex} view={view} className="h-full w-full" />
    </div>
  );
}
