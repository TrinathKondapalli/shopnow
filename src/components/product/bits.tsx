import { useState, type CSSProperties, type ReactNode } from 'react';
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
            <Star size={size} className="absolute inset-0 text-border" strokeWidth={1.5} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star size={size} className="fill-rating text-rating" strokeWidth={1.5} />
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
      <span className="font-bold text-text">{inr(product.price)}</span>
      {product.compareAt && (
        <>
          <span className="text-[0.85em] text-text-muted line-through">{inr(product.compareAt)}</span>
          <span className="text-[0.8em] font-semibold text-accent">{off}% off</span>
        </>
      )}
    </span>
  );
}

/**
 * Wishlist heart: circular button with glass/white effect.
 * `variant="flat"` is the Figma Explore card button: 30px solid white circle, no shadow, Figma heart outline.
 */
export function WishButton({
  product, className, size = 17, variant = 'default',
}: { product: Product; className?: string; size?: number; variant?: 'default' | 'flat' }) {
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
      className={cn(
        // after: extends the 36px circle to a 44px hit area.
        "after:absolute after:-inset-1 after:content-['']",
        !/\b(absolute|fixed|sticky)\b/.test(className ?? '') && 'relative',
        variant === 'flat'
          ? 'grid size-9 place-items-center rounded-full bg-bg text-text transition-colors duration-200 hover:text-accent'
          : 'grid size-9 place-items-center rounded-full bg-bg/90 text-text shadow-[var(--shadow-card)] backdrop-blur transition-all duration-200 hover:bg-bg hover:scale-105',
        on && 'text-accent',
        className,
      )}
      whileTap={{ scale: 0.88 }}
    >
      <motion.span
        key={pop}
        initial={pop ? { scale: 0.6 } : false}
        animate={{ scale: [0.6, 1.25, 1] }}
        transition={{ duration: DUR.heart * 1.6, ease: 'easeOut' }}
        className="grid place-items-center"
      >
        {variant === 'flat' && !on ? (
          <span className="relative block size-[17px] overflow-hidden" aria-hidden="true">
            <span className="absolute inset-[12.5%_8.33%]">
              <span className="absolute inset-[-5.28%_-4.75%]">
                <span className="figma-icon" style={{ '--icon': 'url(/figma/explore/icon-heart.svg)' } as CSSProperties} />
              </span>
            </span>
          </span>
        ) : (
          <Heart size={size} strokeWidth={1.8} className={cn('transition-[fill] duration-200', on ? 'fill-accent text-accent' : 'fill-transparent text-text')} />
        )}
      </motion.span>
    </motion.button>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  titleAccent,
  accentLine = true,
  intro,
  action,
  id,
  className,
  eyebrowColor = 'text-accent',
}: {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  accentLine?: boolean;
  intro?: string;
  action?: ReactNode;
  id?: string;
  className?: string;
  eyebrowColor?: string;
}) {
  return (
    <motion.div
      className={cn('mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 md:mb-12', className)}
      initial={{ y: 12 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: DUR.section, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-3xl">
        <div className="flex items-center gap-3.5">
          {accentLine && <span className="h-[1px] w-10 shrink-0 bg-accent" aria-hidden="true" />}
          <p className={cn('eyebrow', eyebrowColor)}>{eyebrow}</p>
        </div>
        <h2 id={id} className="display mt-3 text-[30px] text-text md:text-[48px]">
          {title}
          {titleAccent && (
            <>
              {' '}
              <span className="italic text-accent">{titleAccent}</span>
            </>
          )}
        </h2>
        {intro && <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-text-muted">{intro}</p>}
      </div>
      {action}
    </motion.div>
  );
}
