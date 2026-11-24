import { useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Heart, Star } from 'lucide-react';
import type { Product } from '../../types';
import { discountPct } from '../../lib/catalog';
import { cn, inr } from '../../lib/utils';
import { DUR } from '../../lib/motion';
import { useShop } from '../../store/ShopProvider';

export function Stars({ value, size = 14, className }: { value: number; size?: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} role="img" aria-label={`Rated ${value} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="absolute inset-0 text-lav-300" strokeWidth={1.5} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star size={size} className="fill-electric text-electric" strokeWidth={1.5} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function Price({ product, className }: { product: Product; className?: string }) {
  const off = discountPct(product);
  return (
    <span className={cn('inline-flex flex-wrap items-baseline gap-x-2 tabular-nums', className)}>
      <span className="font-semibold text-ink">{inr(product.price)}</span>
      {product.compareAt && (
        <>
          <span className="text-[0.85em] text-muted line-through">{inr(product.compareAt)}</span>
          <span className="text-[0.8em] font-semibold text-electric">{off}% off</span>
        </>
      )}
    </span>
  );
}

/** Wishlist heart: fill and bounce, 200ms. */
export function WishButton({ product, className, size = 18 }: { product: Product; className?: string; size?: number }) {
  const { isWished, toggleWish, toast, openPanel } = useShop();
  const on = isWished(product.id);
  const [pop, setPop] = useState(0);
  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        const added = toggleWish(product.id);
        setPop((n) => n + 1);
        toast(added
          ? { title: 'Saved to wishlist', description: product.name, action: { label: 'View', onClick: () => openPanel('wishlist') } }
          : { title: 'Removed from wishlist', description: product.name, tone: 'info' });
      }}
      aria-pressed={on}
      aria-label={on ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      className={cn('grid size-10 place-items-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur transition-colors hover:bg-white', on && 'text-electric', className)}
      whileTap={{ scale: 0.85 }}
    >
      <motion.span
        key={pop}
        initial={pop ? { scale: 0.6 } : false}
        animate={{ scale: [0.6, 1.25, 1] }}
        transition={{ duration: DUR.heart * 1.6, ease: 'easeOut' }}
        className="grid place-items-center"
      >
        <Heart size={size} strokeWidth={1.8} className={cn('transition-[fill] duration-200', on ? 'fill-electric' : 'fill-transparent')} />
      </motion.span>
    </motion.button>
  );
}

export function SectionHeader({ eyebrow, title, intro, action, id, className }: {
  eyebrow: string; title: string; intro?: string; action?: ReactNode; id?: string; className?: string;
}) {
  return (
    <motion.div
      className={cn('mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 md:mb-10', className)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: DUR.section, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id} className="display mt-3 text-[clamp(2rem,5vw,3.5rem)]">{title}</h2>
        {intro && <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">{intro}</p>}
      </div>
      {action}
    </motion.div>
  );
}
