import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { DUR, EASE } from '../../lib/motion';
import { scrollToId } from '../../lib/utils';
import { useShop } from '../../store/ShopProvider';

const ICON_ARROW = '/figma/hero/icon-arrow.svg';

interface HeroSlide {
  id: string;
  num: string;
  photo: string;
  alt: string;
  label: string;
  eyebrow: string;
  collection: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: '01',
    num: '01',
    photo: '/figma/hero/hero-bg.png',
    alt: 'Two models in a lavender hoodie and a black hoodie with cargo pants, against purple concrete',
    label: 'AW’24\nNEW\nSEASON',
    eyebrow: 'New season drop',
    collection: 'move',
  },
  {
    id: '02',
    num: '02',
    photo: '/figma/hero/hero-slide-02.png',
    alt: 'Two models in modern lilac jacket and oversized lavender sweatshirt against brutalist purple concrete architecture',
    label: 'SS’26\nDROP\n02',
    eyebrow: 'Summer capsule',
    collection: 'essential',
  },
  {
    id: '03',
    num: '03',
    photo: '/figma/hero/hero-slide-03.png',
    alt: 'Models in technical streetwear and violet zip overshirt against purple monolithic architecture',
    label: 'NIGHT\nLAB\n26',
    eyebrow: 'After hours',
    collection: 'active',
  },
];

/**
 * 01 Hero (Figma 104:269). Full-bleed campaign photograph (1648 × 928 frame) with the
 * navigation overlaid on top, copy on the left and a vertical 3-slide indicator on the right.
 * Auto-rotates across slides 01, 02, and 03 every 5 seconds, pausing on hover/focus.
 */
export function Hero() {
  const { shopWith } = useShop();
  const [slide, setSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const current = HERO_SLIDES[slide];

  // 5 seconds auto-rotation with pause on hover/focus
  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setSlide((s) => (s + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [isPaused, slide]);

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-[#FBF7F2] lg:h-[clamp(720px,56.31vw,928px)]"
      aria-labelledby="hero-title"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Campaign photography cross-fade */}
      <AnimatePresence mode="wait">
        <motion.img
          key={current.photo}
          src={current.photo}
          alt={current.alt}
          className="pointer-events-none h-[420px] w-full object-cover object-[78%_50%] sm:h-[520px] lg:absolute lg:inset-0 lg:h-full lg:object-right"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.65, ease: EASE }}
        />
      </AnimatePresence>


      {/* Campaign indicator (Figma 104:275): count, 327px track, purple progress */}
      <div
        className="absolute right-[35px] top-[20.74%] z-20 hidden h-[380px] w-[66px] text-white lg:block select-none"
        aria-label="Campaign slides"
      >
        <div className="flex items-center gap-[5px] text-[18px] leading-none whitespace-nowrap">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={current.num}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.25 }}
              className="font-semibold"
            >
              {current.num}
            </motion.span>
          </AnimatePresence>
          <span className="font-medium text-white/60">/ 03</span>
        </div>

        {/* 327px vertical track with animated purple progress segment */}
        <div className="relative mt-4 h-[327px] w-[66px]">
          {/* Background guide rail */}
          <span className="absolute left-[43px] top-0 h-[327px] w-[1.5px] bg-white/30" />

          {/* Active purple indicator segment that glides across 01 -> 02 -> 03 */}
          <motion.span
            className="absolute left-[42.75px] h-[74px] w-[2px] bg-purple-bright shadow-[0_0_8px_rgba(139,77,255,0.85)]"
            animate={{ top: `${slide * 126.5}px` }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          />

          {/* Clickable hit areas for direct slide jumping */}
          {HERO_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSlide(idx)}
              className="group absolute left-0 flex h-[109px] w-full items-center justify-end pr-2 focus-visible:outline-none"
              style={{ top: `${idx * 109}px` }}
              aria-label={`Switch to slide ${s.num}`}
            >
              <span
                className={`size-2.5 rounded-full transition-all duration-200 ${
                  slide === idx ? 'bg-purple-bright scale-125' : 'bg-white/40 hover:bg-white'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Slide Indicator */}
      <div className="absolute right-4 top-20 z-20 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 font-mono text-xs text-white backdrop-blur-md lg:hidden">
        <span className="font-bold text-lav-300">{current.num}</span>
        <span className="text-white/60">/ 03</span>
      </div>

      {/* Campaign label (Figma 104:276) */}
      <div
        className="pointer-events-none absolute right-[17.4px] top-[77.76%] z-20 hidden w-[120px] text-center text-[18.7px] font-medium leading-[25.6px] tracking-[1.16px] text-white lg:block select-none"
        aria-hidden="true"
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={current.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="whitespace-pre-line"
          >
            {current.label}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Hero content (Figma 104:290): 56px vertical rhythm */}
      <div className="container-x relative z-10 pt-12 pb-12 lg:absolute lg:inset-x-0 lg:top-[24.24%] lg:p-0 lg:pl-[76px]">
        <div className="flex flex-col items-start gap-8 lg:gap-[56px]">
          <motion.div
            className="flex items-center gap-6"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.pageEntrance, ease: EASE }}
          >
            <span className="h-[2.5px] w-11 bg-purple" aria-hidden="true" />
            <AnimatePresence mode="wait">
              <motion.p
                key={current.eyebrow}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="text-[15px] font-semibold uppercase leading-none tracking-[0.145em] text-ink lg:text-[17.5px]"
              >
                {current.eyebrow}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Headline: Generous padding & proper line-height so descenders of 'y' are NEVER cut */}
          <h1 id="hero-title" className="font-bold whitespace-nowrap select-none">
            <span className="block overflow-hidden pb-1 -mb-1">
              <motion.span
                className="block text-[clamp(3.5rem,7.65vw,126px)] leading-[0.92] tracking-[-0.062em] text-ink"
                initial={{ y: '105%' }}
                animate={{ y: '0%' }}
                transition={{ duration: DUR.heroHeadline, ease: EASE, delay: 0.15 }}
              >
                Style your
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-6 -mb-6 pr-4">
              <motion.span
                className="block text-[clamp(3.75rem,8.19vw,135px)] italic leading-[0.98] tracking-[-0.07em] text-purple"
                initial={{ y: '105%' }}
                animate={{ y: '0%' }}
                transition={{ duration: DUR.heroHeadline, ease: EASE, delay: 0.28 }}
              >
                everyday.
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="max-w-[462px] text-[18px] leading-[1.3] tracking-[-0.013em] text-ink-2 lg:text-[21.5px] lg:leading-[28px]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.pageEntrance, ease: EASE, delay: 0.45 }}
          >
            Discover streetwear and everyday essentials designed for comfort, versatility and attitude.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-8 pt-2 lg:gap-[46px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.pageEntrance, ease: EASE, delay: 0.6 }}
          >
            {/* Button / Primary (Figma 96:26) */}
            <button
              type="button"
              className="group flex h-14 w-full items-center justify-center gap-5 whitespace-nowrap bg-ink pl-[41px] pr-[42px] text-[18px] font-medium text-white transition-[background-color,opacity] duration-[180ms] ease-soft hover:bg-ink-hover active:opacity-[0.88] sm:w-[292px] lg:h-16 lg:text-[20px]"
              onClick={() => shopWith({ collection: current.collection })}
            >
              Explore collection
              <span className="relative size-[22px] shrink-0 transition-transform duration-[180ms] ease-soft group-hover:translate-x-[5px]" aria-hidden="true">
                <span className="absolute inset-[20.83%_16.67%]">
                  <span className="absolute inset-[-5.36%_-4.69%]">
                    <img src={ICON_ARROW} alt="" className="block size-full max-w-none" />
                  </span>
                </span>
              </span>
            </button>

            {/* Link / Text (Figma 96:39) */}
            <button type="button" className="group relative flex flex-col items-start gap-[5px]" onClick={() => scrollToId('looks')}>
              <span className="text-[18px] font-medium leading-none text-ink lg:text-[20px]">Shop the look</span>
              <span className="relative h-[1.5px] w-full bg-ink">
                <span className="absolute inset-0 origin-left scale-x-0 bg-purple transition-transform duration-200 group-hover:scale-x-100" />
              </span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
