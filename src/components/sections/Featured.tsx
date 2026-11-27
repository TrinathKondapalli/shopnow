import { useEffect, useState, type CSSProperties } from 'react';
import { motion } from 'motion/react';
import type { ExploreState, Product } from '../../types';
import { getProduct } from '../../lib/catalog';
import { cn, inr, prefersReducedMotion } from '../../lib/utils';
import { EASE } from '../../lib/motion';
import { useShop } from '../../store/ShopProvider';
import { ProductImage } from '../product/ProductImage';

const A = '/figma/featured';
const P = '/figma/products';
const CAMPAIGN_MASK = `${A}/campaign-mask.svg`;
const CORNER_ARC = `${A}/corner-arc.png`;
const ICON_ARROW = `${A}/icon-arrow.svg`;
const ICON_PREV = `${A}/icon-arrow-prev.svg`;
const ICON_NEXT = `${A}/icon-arrow-next.svg`;
const ICON_HEART = `${A}/icon-heart.svg`;

interface EditConfig {
  edit: string;
  name: string;
  label: string;
  photo: string;
  photoPos: string;
  alt: string;
  titleMain: string;
  titleAccent: string;
  description: string;
  patch: Partial<ExploreState>;
  picks: string[];
}

/** Ethnic edits. Every pick is a product id that exists in products.json; missing ids are skipped. */
const EDITS: EditConfig[] = [
  {
    edit: '01',
    name: 'Festive Edit',
    label: 'FESTIVE EDIT',
    photo: `${P}/festive-lehenga.jpg`,
    photoPos: '50% 20%',
    alt: 'Model in a magenta festive lehenga with gold zari work and a sheer dupatta',
    titleMain: 'Dressed for',
    titleAccent: 'every festival.',
    description: 'Lehengas, sarees and Anarkali kurtis with rich embroidery and zari detail, made for pujas, sangeets and family celebrations.',
    patch: { tab: 'festive', types: ['Lehengas', 'Sarees', 'Kurtis'] },
    picks: ['festive-lehenga', 'traditional-sari', 'anarkali-kurti'],
  },
  {
    edit: '02',
    name: 'Wedding Edit',
    label: 'WEDDING EDIT',
    photo: `${P}/nehru-jacket.jpg`,
    photoPos: '50% 15%',
    alt: 'Model in a golden beige brocade Nehru jacket over a silk kurta',
    titleMain: 'Made for',
    titleAccent: 'the big day.',
    description: 'Bandhgalas, Nehru jacket sets and silk kurtas for weddings, receptions and every function in between.',
    patch: { tab: 'festive', types: ['Nehru Jackets', 'Kurtas'] },
    picks: ['royal-bandhgala', 'nehru-jacket-set', 'maroon-kurta'],
  },
  {
    edit: '03',
    name: 'Ethnic Edit',
    label: 'ETHNIC EDIT',
    photo: '/figma/categories/men.png',
    photoPos: '50% 25%',
    alt: 'Model in an ivory cotton kurta and churidar standing under carved sandstone arches',
    titleMain: 'Easy ethnic',
    titleAccent: 'for every day.',
    description: 'Breathable cotton and printed kurtas and easy kurtis that move from office days to evening plans.',
    patch: { tab: 'ethnic', types: ['Kurtas', 'Kurtis'] },
    picks: ['mens-cotton-kurta', 'printed-kurta', 'anarkali-kurti'],
  },
];

const SLIDES = EDITS.length;
const pad = (n: number) => String(n).padStart(2, '0');

/**
 * 04 Featured collection (Figma 114:539). Masked campaign photograph on the left, editorial copy,
 * three mini product cards and CTAs on the right. Every slide is always rendered with content:
 * slide changes cross-fade, so the area never shows as an empty block.
 */
export function Featured() {
  const { shopWith } = useShop();
  const [slide, setSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reduced] = useState(prefersReducedMotion);
  const current = EDITS[slide];

  // 6-second auto-rotation, paused on hover/focus and off entirely with reduced motion.
  useEffect(() => {
    if (isPaused || reduced) return;
    const timer = window.setInterval(() => setSlide((s) => (s + 1) % SLIDES), 6000);
    return () => window.clearInterval(timer);
  }, [isPaused, reduced, slide]);

  const nextSlide = () => setSlide((s) => (s + 1) % SLIDES);
  const prevSlide = () => setSlide((s) => (s - 1 + SLIDES) % SLIDES);

  const picks = current.picks.flatMap((id) => {
    const p = getProduct(id);
    return p ? [p] : [];
  });

  return (
    <section
      id="featured"
      className="relative scroll-mt-16 overflow-hidden bg-bg-alt text-text md:scroll-mt-20"
      aria-labelledby="featured-title"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="relative mx-auto max-w-[1648px] lg:flex lg:items-start">
        <div className="pointer-events-none absolute bottom-0 right-0 hidden h-[158.7px] w-[307.522px] overflow-hidden opacity-25 lg:block" aria-hidden="true">
          <img src={CORNER_ARC} alt="" className="absolute left-[-6.41%] top-0 h-full w-[106.41%] max-w-none" />
        </div>

        {/* Campaign visual (114:541): 778.7 × 927.5 */}
        <div className="@container relative aspect-[778.7/927.5] w-full shrink-0 lg:w-[47.251%]">
          <div
            className="absolute inset-0 bg-border"
            style={{
              WebkitMaskImage: `url(${CAMPAIGN_MASK})`,
              maskImage: `url(${CAMPAIGN_MASK})`,
              maskMode: 'alpha',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskSize: '99.616% 100.108%',
              maskSize: '99.616% 100.108%',
              WebkitMaskPosition: '-0.5px -0.5px',
              maskPosition: '-0.5px -0.5px',
            }}
          >
            {/* All photos stay mounted; the active one is opaque, so a photo is always on screen. */}
            {EDITS.map((d, i) => (
              <img
                key={d.edit}
                decoding="async"
                src={d.photo}
                alt={i === slide ? d.alt : ''}
                aria-hidden={i === slide ? undefined : true}
                className={cn(
                  'pointer-events-none absolute inset-0 size-full max-w-none object-cover transition-opacity duration-300 ease-soft',
                  i === slide ? 'opacity-100' : 'opacity-0',
                )}
                style={{ objectPosition: d.photoPos }}
              />
            ))}
            {/* Scrims keep the white labels readable on light photos (WCAG AA). */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[34%] bg-gradient-to-b from-text/65 to-transparent" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[24%] bg-gradient-to-t from-text/65 to-transparent" aria-hidden="true" />
          </div>

          {/* Photo labels */}
          <div
            className="pointer-events-none absolute left-[19.751%] right-[12%] top-[16.288%] flex flex-wrap justify-between gap-x-4 gap-y-1 text-[max(12px,1.926cqw)] font-semibold leading-none tracking-[0.115em] text-text-inverse select-none"
            aria-hidden="true"
          >
            <span>EDIT {current.edit}</span>
            <span>{current.label}</span>
          </div>

          {/* Progress line: decorative 6-second countdown */}
          <div className="pointer-events-none absolute left-[12.97%] top-[36.13%] h-[49.952%] w-[1.5px] overflow-hidden bg-white/30" aria-hidden="true">
            {!reduced && (
              <motion.div
                key={`${current.edit}-${isPaused}`}
                className="h-full w-full origin-top bg-accent-dark"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: isPaused ? 0 : 1 }}
                transition={{ duration: isPaused ? 0 : 6, ease: 'linear' }}
              />
            )}
          </div>

          {/* Slide counter */}
          <p className="pointer-events-none absolute left-[12.662%] top-[88.608%] whitespace-nowrap text-[max(14px,2.633cqw)] leading-none text-text-inverse tabular-nums select-none" aria-live="polite">
            <span className="sr-only">{current.label}, slide </span>
            <span className="font-semibold">{current.edit}</span>
            <span className="font-normal">{` / ${pad(SLIDES)}`}</span>
          </p>

          {/* Carousel arrows */}
          <div className="absolute left-[64%] top-[86.717%] flex gap-[max(8px,1.5cqw)]">
            <button
              type="button"
              onClick={prevSlide}
              className="flex size-[max(44px,7.346cqw)] items-center justify-center rounded-full bg-bg shadow-[var(--shadow-card)] transition-transform duration-[180ms] ease-soft hover:scale-105 active:scale-95"
              aria-label="Previous edit"
            >
              <img src={ICON_PREV} alt="" className="block size-[30%] max-w-none" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="flex size-[max(44px,7.346cqw)] items-center justify-center rounded-full bg-action shadow-[var(--shadow-card)] transition-transform duration-[180ms] ease-soft hover:scale-105 hover:bg-action-hover active:scale-95"
              aria-label="Next edit"
            >
              <img src={ICON_NEXT} alt="" className="block size-[30%] max-w-none" />
            </button>
          </div>
        </div>

        {/* Content column */}
        <div className="relative flex min-w-0 flex-1 flex-col items-start px-5 pb-14 pt-12 sm:px-8 lg:pb-[clamp(48px,4.6vw,75.9px)] lg:pl-[2.81%] lg:pr-[4.42%] lg:pt-[clamp(40px,4.325vw,71.27px)]">
          <div className="flex items-center gap-4 lg:ml-[11.8px]">
            <span className="h-[1px] w-12 bg-accent" aria-hidden="true" />
            <p className="eyebrow">Featured collection</p>
          </div>

          {/* Title and description */}
          <motion.div
            key={current.edit}
            className="w-full"
            initial={{ opacity: 0.25, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <h2
              id="featured-title"
              className="mt-6 font-display text-[30px] font-semibold leading-[1.12] tracking-[-0.01em] text-text sm:text-[42px] lg:ml-[0.077em] lg:text-[48px]"
            >
              <span className="block">{current.titleMain}</span>{' '}
              <span className="block pb-1 italic text-accent">{current.titleAccent}</span>
            </h2>
            <p className="mt-4 max-w-[591px] text-[16px] leading-[1.6] text-text-muted lg:ml-[13.8px] lg:text-[17px]">
              {current.description}
            </p>
          </motion.div>

          {/* Mini product cards */}
          <div className="mt-8 w-full max-w-[750.1px]">
            <div className="grid grid-cols-3 gap-3 sm:gap-[15.8px]">
              {picks.map((product) => (
                <MiniProductCard key={`${current.edit}-${product.id}`} product={product} />
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex w-full flex-wrap items-center gap-x-10 gap-y-5 lg:ml-[9.8px]">
            <button
              type="button"
              onClick={() => shopWith(current.patch)}
              className="group flex h-13 w-full items-center justify-center gap-4 whitespace-nowrap rounded-btn bg-action px-8 text-[15px] font-semibold text-action-text transition-colors duration-[180ms] ease-soft hover:bg-action-hover active:opacity-[0.9] sm:w-auto lg:h-14 lg:text-[16px]"
            >
              Shop the {current.name}
              <img src={ICON_ARROW} alt="" className="block size-[16px] max-w-none transition-transform duration-[180ms] ease-soft group-hover:translate-x-[5px]" />
            </button>

            <button type="button" onClick={() => shopWith({ tab: 'ethnic' })} className="group relative flex min-h-11 flex-col items-start justify-center gap-[5px]">
              <span className="text-[16px] font-semibold leading-none text-accent lg:text-[17px]">View all ethnic wear</span>
              <span className="relative h-[1.5px] w-full bg-accent/40">
                <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-200 group-hover:scale-x-100" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniProductCard({ product }: { product: Product }) {
  const { openQuickView, isWished, toggleWish, toast, openPanel } = useShop();
  const on = isWished(product.id);

  return (
    <div className="group relative min-w-0">
      <button
        type="button"
        onClick={() => openQuickView(product.id, 0)}
        className="block w-full text-left"
      >
        <span className="relative block aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-bg-alt">
          <ProductImage product={product} color={0} className="object-top transition-transform duration-500 ease-soft group-hover:scale-[1.04]" />
        </span>
        <span className="mt-2 block text-[15px] font-semibold leading-[1.25] text-text transition-colors group-hover:text-accent sm:text-[16px]">
          {product.name}
        </span>
        <span className="mt-1 block text-[15px] font-bold leading-[1.21] text-text tabular-nums sm:text-[16px]">
          {inr(product.price)}
        </span>
      </button>

      <button
        type="button"
        onClick={() => {
          const added = toggleWish(product.id);
          toast(added
            ? { title: 'Saved to wishlist', description: product.name, action: { label: 'View', onClick: () => openPanel('wishlist') } }
            : { title: 'Removed from wishlist', description: product.name, tone: 'info' });
        }}
        aria-pressed={on}
        aria-label={on ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
        className={cn(
          "absolute right-1.5 top-1.5 flex size-[34px] items-center justify-center rounded-full bg-bg transition-[color,transform] duration-200 after:absolute after:-inset-[5px] after:content-[''] hover:scale-105 active:scale-90 sm:right-3 sm:top-2.5",
          on ? 'text-accent' : 'text-text hover:text-accent',
        )}
      >
        <span className="relative size-[18px] shrink-0 overflow-clip" aria-hidden="true">
          <span className="absolute inset-[12.5%_8.33%]">
            <span className="absolute inset-[-5.28%_-4.75%]">
              <span className="figma-icon" style={{ '--icon': `url(${ICON_HEART})` } as CSSProperties} />
            </span>
          </span>
        </span>
      </button>
    </div>
  );
}
