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
            <Star size={size} className="absolute inset-0 text-[#E0D7D3]" strokeWidth={1.5} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star size={size} className="fill-[#6A1ED5] text-[#6A1ED5]" strokeWidth={1.5} />
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
      <span className="font-bold text-ink">{inr(product.price)}</span>
      {product.compareAt && (
        <>
          <span className="text-[0.85em] text-muted line-through">{inr(product.compareAt)}</span>
          <span className="text-[0.8em] font-semibold text-purple">{off}% off</span>
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
        variant === 'flat'
          ? 'grid size-[30px] place-items-center rounded-[15px] bg-white text-ink transition-colors duration-200 hover:text-electric-alt'
          : 'grid size-[32px] place-items-center rounded-full bg-white/90 text-ink shadow-[0_2px_8px_rgba(0,0,0,0.08)] backdrop-blur transition-all duration-200 hover:bg-white hover:scale-105',
        on && 'text-purple',
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
          <Heart size={size} strokeWidth={1.8} className={cn('transition-[fill] duration-200', on ? 'fill-purple text-purple' : 'fill-transparent text-ink')} />
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
  eyebrowColor = 'text-purple',
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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: DUR.section, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-3xl">
        <div className="flex items-center gap-3.5">
          {accentLine && <span className="h-[2.5px] w-10 shrink-0 bg-purple" aria-hidden="true" />}
          <p className={cn('eyebrow', eyebrowColor)}>{eyebrow}</p>
        </div>
        <h2 id={id} className="display mt-3 text-[clamp(2.5rem,6.5vw,4.8rem)] tracking-tight">
          {title}
          {titleAccent && (
            <>
              {' '}
              <span className="font-bold italic text-purple">{titleAccent}</span>
            </>
          )}
        </h2>
        {intro && <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-muted">{intro}</p>}
      </div>
      {action}
    </motion.div>
  );
}
