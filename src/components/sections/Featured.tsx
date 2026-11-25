import { useEffect, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Product } from '../../types';
import { PRODUCTS } from '../../lib/catalog';
import { cn, inr } from '../../lib/utils';
import { DUR, EASE } from '../../lib/motion';
import { useShop } from '../../store/ShopProvider';
import { ProductImage } from '../product/ProductImage';

const A = '/figma/featured';
const CAMPAIGN_PHOTO = `${A}/campaign.png`;
const CAMPAIGN_MASK = `${A}/campaign-mask.svg`;
const CORNER_ARC = `${A}/corner-arc.png`;
const ICON_ARROW = `${A}/icon-arrow.svg`;
const ICON_PREV = `${A}/icon-arrow-prev.svg`;
const ICON_NEXT = `${A}/icon-arrow-next.svg`;
const ICON_HEART = `${A}/icon-heart.svg`;

interface DropPick {
  id: string;
  color: number;
  image?: string;
}

interface DropConfig {
  drop: string;
  season: string;
  photo: string;
  alt: string;
  titleMain: string;
  titleAccent: string;
  description: string;
  collection: string;
  picks: DropPick[];
}

const DROPS: DropConfig[] = [
  {
    drop: '01',
    season: 'SPRING-SUMMER 26',
    photo: `${A}/drop-01.jpg`,
    alt: 'Model in minimal oversized white tee and relaxed denim against concrete',
    titleMain: 'Pure comfort in',
    titleAccent: 'every thread.',
    description: 'Minimal cuts, breathable jersey and effortless draping. Timeless staples made for relaxed daily routines.',
    collection: 'neutral',
    picks: [
      { id: 'essential-tee', color: 0, image: `${A}/drop-01-tee.jpg` },
      { id: 'relaxed-jeans', color: 0, image: `${A}/drop-01-jeans.jpg` },
      { id: 'retro-runner', color: 0, image: `${A}/drop-01-shoes.jpg` },
    ],
  },
  {
    drop: '02',
    season: 'SUMMER CAPSULE',
    photo: `${A}/drop-02.jpg`,
    alt: 'Model in boxy graphic tee and parachute pants beside concrete pillars',
    titleMain: 'Light layers for',
    titleAccent: 'warmer days.',
    description: 'Airy poplins, relaxed cotton and effortless fits. Designed to keep cool when the temperature climbs.',
    collection: 'essential',
    picks: [
      { id: 'boxy-graphic-tee', color: 0, image: `${A}/drop-02-tee.jpg` },
      { id: 'parachute-pants', color: 0, image: `${A}/drop-02-pants.jpg` },
      { id: 'platform-sneakers', color: 0, image: `${A}/drop-02-shoes.jpg` },
    ],
  },
  {
    drop: '03',
    season: 'URBAN ESSENTIALS',
    photo: `${A}/drop-03.jpg`,
    alt: 'Model in cropped lavender jacket and wide-leg trousers by concrete monolith',
    titleMain: 'Sharp lines for',
    titleAccent: 'city streets.',
    description: 'Technical tailoring, structured fleece and tactical accents. Engineered for clean transitions across town.',
    collection: 'streetwear',
    picks: [
      { id: 'cropped-hoodie', color: 0, image: `${A}/drop-03-top.jpg` },
      { id: 'wide-leg-jeans', color: 0, image: `${A}/drop-03-pants.jpg` },
      { id: 'retro-runner', color: 0, image: `${A}/drop-03-shoes.jpg` },
    ],
  },
  {
    drop: '04', // The original Figma drop!
    season: 'AUTUMN-WINTER 26',
    photo: CAMPAIGN_PHOTO,
    alt: 'Model in a dark zip jacket and olive cargo pants against purple concrete',
    titleMain: 'Made for',
    titleAccent: 'every move.',
    description: 'Stretch fabrics, satin layers and cushioned soles. Pieces that keep up from the morning commute to the late show.',
    collection: 'move',
    picks: [
      { id: 'everyday-hoodie', color: 0 },
      { id: 'cargo-pants', color: 0 },
      { id: 'zip-overshirt', color: 0 },
    ],
  },
  {
    drop: '05',
    season: 'NIGHT LAB 26',
    photo: `${A}/drop-05.jpg`,
    alt: 'Model in reflective black track jacket and utility cargo joggers at night',
    titleMain: 'Built for',
    titleAccent: 'after hours.',
    description: 'Deep obsidian dyes, reflective piping and water-resistant nylon. Form and function tuned for the night.',
    collection: 'active',
    picks: [
      { id: 'track-jacket', color: 0, image: `${A}/drop-05-jacket.jpg` },
      { id: 'tech-joggers', color: 0, image: `${A}/drop-05-joggers.jpg` },
      { id: 'retro-runner', color: 0, image: `${A}/drop-05-shoes.jpg` },
    ],
  },
  {
    drop: '06',
    season: 'WINTER CORE 26',
    photo: `${A}/drop-06.jpg`,
    alt: 'Model in heavy layered loopback sweatshirt and insulated bomber jacket',
    titleMain: 'Heavyweight warmth for',
    titleAccent: 'cold days.',
    description: 'Brushed loopback fleece, insulated outerwear and rugged knits. Substantial comfort when winter hits.',
    collection: 'winter',
    picks: [
      { id: 'oversized-sweatshirt', color: 0, image: `${A}/drop-06-sweatshirt.jpg` },
      { id: 'satin-bomber', color: 0, image: `${A}/drop-06-bomber.jpg` },
      { id: 'cargo-pants', color: 0, image: `${A}/drop-06-pants.jpg` },
    ],
  },
];

const SLIDES = DROPS.length;
const pad = (n: number) => String(n).padStart(2, '0');

/**
 * 04 Featured Collection (Figma 114:539, 1648 × 927.5). Masked campaign photograph on the
 * left, editorial copy, three mini product cards and CTAs on the right. Horizontal offsets
 * are percentages of the 1648px frame so the layout is pixel-matched at 1648 and scales below.
 */
export function Featured() {
  const { shopWith } = useShop();
  const [slide, setSlide] = useState(0); // Starts at Drop 01 so all 6 appear one by one
  const [isPaused, setIsPaused] = useState(false);
  const current = DROPS[slide];

  // 5 seconds auto-rotation with pause on hover/focus
  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setSlide((s) => (s + 1) % SLIDES);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [isPaused, slide]);

  const nextSlide = () => setSlide((s) => (s + 1) % SLIDES);
  const prevSlide = () => setSlide((s) => (s - 1 + SLIDES) % SLIDES);

  const picks = current.picks.flatMap(({ id, color, image }) => {
    const p = PRODUCTS.find((x) => x.id === id);
    return p ? [{ product: p, color, image }] : [];
  });

  return (
    <section
      id="featured"
      className="relative scroll-mt-16 md:scroll-mt-20 overflow-hidden bg-[#F9F0EC] text-ink"
      aria-labelledby="featured-title"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="relative mx-auto max-w-[1648px] lg:flex lg:items-start">
        {/* Decoration / Corner Arc (114:540) */}
        <div className="pointer-events-none absolute bottom-0 right-0 hidden h-[158.7px] w-[307.522px] overflow-hidden lg:block" aria-hidden="true">
          <img src={CORNER_ARC} alt="" className="absolute left-[-6.41%] top-0 h-full w-[106.41%] max-w-none" />
        </div>

        {/* Campaign Visual (114:541): 778.7 × 927.5 */}
        <motion.div
          className="@container relative aspect-[778.7/927.5] w-full shrink-0 lg:w-[47.251%]"
          initial={{ opacity: 0.95 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: DUR.heroMask, ease: EASE }}
        >
          {/* Masked Photography (114:543) */}
          <div
            className="absolute inset-0"
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
            <AnimatePresence mode="wait">
              <motion.img
                loading="lazy"
                decoding="async"
                key={current.drop}
                src={current.photo}
                alt={current.alt}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.65, ease: EASE }}
                className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
              />
            </AnimatePresence>
          </div>

          {/* Photo tags (114:545 / 114:546) */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`drop-tag-${current.drop}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="pointer-events-none absolute left-[19.751%] top-[16.288%] whitespace-nowrap text-[1.926cqw] font-semibold leading-none tracking-[0.115em] text-white select-none"
              aria-hidden="true"
            >
              SHOPNOW / DROP {current.drop}
            </motion.p>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key={`season-tag-${current.drop}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="pointer-events-none absolute left-[67.587%] top-[16.288%] whitespace-nowrap text-[1.926cqw] font-semibold leading-none tracking-[0.115em] text-white select-none"
              aria-hidden="true"
            >
              {current.season}
            </motion.p>
          </AnimatePresence>

          {/* Progress line (114:547): 5-second motion graphic countdown fill */}
          <div className="pointer-events-none absolute left-[12.97%] top-[36.13%] h-[49.952%] w-[1.5px] overflow-hidden bg-white/30" aria-hidden="true">
            <motion.div
              key={current.drop}
              className="h-full w-full origin-top bg-white"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: isPaused ? undefined : 1 }}
              transition={{ duration: 5, ease: 'linear' }}
            />
          </div>

          {/* Slide counter (114:548) */}
          <p className="pointer-events-none absolute left-[12.662%] top-[88.608%] whitespace-nowrap text-[max(14px,2.633cqw)] leading-none text-white select-none" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={current.drop}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="inline-block font-semibold"
              >
                {current.drop}
              </motion.span>
            </AnimatePresence>
            <span className="font-normal">{` / ${pad(SLIDES)}`}</span>
          </p>

          {/* Carousel arrows (114:549 / 114:554) */}
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-[72.017%] top-[86.717%] flex size-[max(40px,7.346cqw)] items-center justify-center rounded-full bg-white transition-transform duration-[180ms] ease-soft hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-bright"
            aria-label="Previous featured look"
          >
            <span className="relative size-[45.45%] shrink-0 overflow-clip" aria-hidden="true">
              <span className="absolute inset-[20.83%_16.67%]">
                <span className="absolute inset-[-6.07%_-5.31%]">
                  <img src={ICON_PREV} alt="" className="block size-full max-w-none" />
                </span>
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="absolute left-[80.878%] top-[86.717%] flex size-[max(40px,7.346cqw)] items-center justify-center rounded-full bg-purple transition-transform duration-[180ms] ease-soft hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-bright"
            aria-label="Next featured look"
          >
            <span className="relative size-[45.45%] shrink-0 overflow-clip" aria-hidden="true">
              <span className="absolute inset-[20.83%_16.67%]">
                <span className="absolute inset-[-6.07%_-5.31%]">
                  <img src={ICON_NEXT} alt="" className="block size-full max-w-none" />
                </span>
              </span>
            </span>
          </button>
        </motion.div>

        {/* Content column: x 825 → 1575.1 in the 1648 frame */}
        <div className="relative flex min-w-0 flex-1 flex-col items-start px-4 pt-12 pb-14 sm:px-8 lg:pl-[2.81%] lg:pr-[4.42%] lg:pt-[clamp(40px,4.325vw,71.27px)] lg:pb-[clamp(48px,4.6vw,75.9px)]">
          {/* Accent line + eyebrow (114:559 / 114:560) */}
          <div className="ml-[11.8px] flex items-center gap-[23.6px]">
            <span className="h-[3px] w-[50.3px] translate-y-px bg-purple" aria-hidden="true" />
            <p className="text-[15px] font-semibold uppercase leading-[18px] tracking-[0.198em] text-ink">Featured collection</p>
          </div>

          {/* Title & Description with smooth fade transition */}
          <div className="relative w-full">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.drop}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                {/* Title (114:561 / 114:562) */}
                <h2
                  id="featured-title"
                  className="mt-[33.27px] ml-[0.077em] whitespace-nowrap text-[clamp(52px,6.25vw,103px)] font-bold leading-[0.9515em] text-ink"
                >
                  <span className="block tracking-[-0.044em]">{current.titleMain}</span>{' '}
                  <span className="-mt-[0.1097em] -ml-[0.0194em] block italic tracking-[-0.045em] text-purple">{current.titleAccent}</span>
                </h2>

                {/* Description (114:563) */}
                <p className="mt-[28.53px] ml-[13.8px] max-w-[591.4px] text-[17px] leading-[1.438] tracking-[0.027em] text-[#504D4F] lg:text-[18.5px] lg:leading-[26.6px]">
                  {current.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mini product cards (114:564 / 114:572 / 114:580) */}
          <div className="mt-[48.63px] w-full max-w-[750.1px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.drop}
                className="grid grid-cols-3 gap-[15.8px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                {picks.map(({ product, color, image }, i) => (
                  <MiniProductCard key={`${current.drop}-${product.id}`} product={product} color={color} image={image} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* CTAs (114:588 / 114:594) */}
          <div className="mt-[56.5px] ml-[9.8px] flex flex-wrap items-start gap-x-[56px] gap-y-6">
            {/* Button / Primary (96:26) */}
            <button
              type="button"
              onClick={() => shopWith({ collection: current.collection })}
              className="group flex h-14 w-full items-center justify-center gap-5 whitespace-nowrap bg-ink pl-[41px] pr-[42px] text-[18px] font-medium leading-none text-white transition-[background-color,opacity] duration-[180ms] ease-soft hover:bg-ink-hover active:opacity-[0.88] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-bright sm:w-[292px] lg:h-[61.1px] lg:text-[20px]"
            >
              Shop the collection
              <span className="relative size-[22px] shrink-0 transition-transform duration-[180ms] ease-soft group-hover:translate-x-[5px]" aria-hidden="true">
                <span className="absolute inset-[20.83%_16.67%]">
                  <span className="absolute inset-[-5.36%_-4.69%]">
                    <img src={ICON_ARROW} alt="" className="block size-full max-w-none" />
                  </span>
                </span>
              </span>
            </button>

            {/* Link / Text (96:39) */}
            <button type="button" onClick={() => shopWith({})} className="group relative flex flex-col items-start gap-[5px] lg:mt-[11.9px]">
              <span className="text-[18px] font-medium leading-none text-ink lg:text-[20px]">View all products</span>
              <span className="relative h-[1.5px] w-full bg-ink">
                <span className="absolute inset-0 origin-left scale-x-0 bg-purple transition-transform duration-200 group-hover:scale-x-100" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Mini Product Card (Figma 114:564): 239.5 × 296.4, image 239.5 × 232.6, 33.5px wishlist. */
function MiniProductCard({ product, color, image, index }: { product: Product; color: number; image?: string; index: number }) {
  const { openQuickView, isWished, toggleWish, toast, openPanel } = useShop();
  const on = isWished(product.id);

  return (
    <motion.div
      className="group relative min-w-0"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE, delay: index * 0.08 }}
    >
      <button
        type="button"
        onClick={() => openQuickView(product.id)}
        className="block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-bright"
        aria-label={`Quick view ${product.name}`}
      >
        <span className="relative block aspect-[239.5/232.6] overflow-hidden">
          {image ? (
            <img
              loading="lazy"
              decoding="async"
              src={image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 ease-soft group-hover:scale-[1.04]"
            />
          ) : (
            <ProductImage product={product} color={color} crop="square" className="transition-transform duration-500 ease-soft group-hover:scale-[1.04]" />
          )}
        </span>
        <span className="mt-[8.19px] ml-[7.01%] block truncate text-[clamp(14px,1.153vw,19px)] font-semibold leading-[1.21] tracking-[-0.01em] text-ink transition-colors group-hover:text-purple">
          {product.name}
        </span>
        <span className="mt-[9.6px] ml-[6.6%] block text-[clamp(14px,1.153vw,19px)] font-normal leading-[1.21] tracking-[-0.005em] text-ink">
          {inr(product.price)}
        </span>
      </button>

      {/* Wishlist Button (114:522) */}
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
          'absolute right-[14.75px] top-[10.85px] flex size-[33.5px] items-center justify-center overflow-clip rounded-full bg-white transition-[color,transform] duration-200 hover:scale-105 active:scale-90',
          on ? 'text-purple' : 'text-ink hover:text-purple',
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
    </motion.div>
  );
}
