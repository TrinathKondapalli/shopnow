import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  shortLabel: string;
  eyebrow: string;
  collection: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: '01',
    num: '01',
    photo: '/figma/hero/hero-bg.png',
    alt: 'Festive Indian couple in authentic ethnic wear: cream silk kurta, brocade Nehru jacket, and royal navy embroidered Anarkali gown in palace courtyard',
    label: 'FESTIVE EDIT\nETHNIC\nCOLLECTION',
    shortLabel: 'FESTIVE',
    eyebrow: 'The Festive Edit',
    collection: 'festive',
  },
  {
    id: '02',
    num: '02',
    photo: '/figma/hero/hero-slide-02.png',
    alt: 'Indian couple under royal palace archway in festive ethnic wedding attire with brass lamps and festive lighting',
    label: 'WEDDING EDIT\nROYAL\nCEREMONIAL',
    shortLabel: 'WEDDING',
    eyebrow: 'The Wedding Edit',
    collection: 'ethnic',
  },
  {
    id: '03',
    num: '03',
    photo: '/figma/hero/hero-slide-03.png',
    alt: 'Radiant Indian woman in festive yellow embroidered Anarkali gown with marigold garlands in palace courtyard',
    label: 'ETHNIC EDIT\nGOLDEN\nANARKALI',
    shortLabel: 'ANARKALI',
    eyebrow: 'The Ethnic Edit',
    collection: 'festive',
  },
];

/**
 * 01 Hero (Figma 104:269). Full-bleed campaign photograph (1648 × 928 frame) with
 * editorial copy on the left and a vertical interactive 3-slide campaign selector on the right.
 * Slides change only when the visitor picks one (01/02/03 or the arrows): no auto-rotation.
 * The promo banner above is the page's only auto-moving carousel.
 */
export function Hero() {
  const { shopWith } = useShop();
  const [slide, setSlide] = useState(0);
  const current = HERO_SLIDES[slide];

  const go = (delta: number) => {
    setSlide((s) => (s + delta + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-bg lg:h-[clamp(720px,56.31vw,928px)]"
      aria-labelledby="hero-title"
    >
      {/* Campaign photography cross-fade: festive Indian ethnic wear.
          Below lg the photo is capped at 45vh so the heading and "Explore collection" stay in the first screen. */}
      <div className="relative h-[45vh] min-h-[240px] max-h-[520px] overflow-hidden lg:absolute lg:inset-0 lg:h-full lg:max-h-none">
        <AnimatePresence initial={false}>
          <motion.img
            key={current.photo}
            src={current.photo}
            alt={current.alt}
            className="pointer-events-none absolute inset-0 size-full object-cover object-[78%_50%] lg:object-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          />
        </AnimatePresence>
      </div>

      {/* Campaign indicator: Clear 01, 02, 03 display so all 3 slides are directly visible and clickable */}
      <div
        className="absolute right-[35px] top-[18%] z-20 hidden w-[150px] rounded-[var(--radius-card)] bg-text/85 p-4 text-text-inverse backdrop-blur-md border border-white/15 shadow-[var(--shadow-pop)] lg:block select-none"
        role="group"
        aria-label="Choose a campaign slide"
      >
        <div className="flex items-center justify-between border-b border-white/20 pb-3 font-mono text-[18px] leading-none whitespace-nowrap">
          <div className="flex items-center gap-[5px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={current.num}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.25 }}
                className="text-[22px] font-bold tracking-tight text-bg tabular-nums"
              >
                {current.num}
              </motion.span>
            </AnimatePresence>
            <span className="text-[17px] font-medium text-bg/75 tabular-nums">/ 03</span>
          </div>
          <span className="text-[12px] font-sans font-bold uppercase tracking-wider text-accent">Slides</span>
        </div>

        {/* Vertical track showing all 3 slides explicitly: 01, 02, 03 */}
        <div className="relative mt-4 h-[255px] w-full">
          {/* Background vertical rail */}
          <span className="absolute right-[12px] top-0 h-[240px] w-[1.5px] bg-bg/25" />

          {/* Active marigold progress segment that glides across 01 -> 02 -> 03 */}
          <motion.span
            className="absolute right-[11.25px] h-[64px] w-[3px] rounded-full bg-accent"
            animate={{ top: `${slide * 80}px` }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          />

          {/* Interactive buttons for all 3 slides: 01, 02, 03 */}
          {HERO_SLIDES.map((s, idx) => {
            const isActive = slide === idx;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSlide(idx)}
                className="group absolute right-0 flex h-[78px] w-full items-center justify-end gap-3.5 rounded-btn pr-1 focus-visible:outline-accent"
                style={{ top: `${idx * 80}px` }}
                aria-label={`Switch to slide ${s.num}: ${s.shortLabel}`}
                aria-current={isActive ? 'true' : undefined}
              >
                {/* Slide label and number */}
                <div className="flex flex-col items-end text-right transition-transform duration-200 group-hover:-translate-x-1">
                  <span
                    className={`font-mono text-[16px] font-bold tracking-wider transition-colors duration-200 tabular-nums ${
                      isActive ? 'text-bg' : 'text-bg/85 group-hover:text-bg'
                    }`}
                  >
                    {s.num}
                  </span>
                  <span
                    className={`text-[12px] font-semibold tracking-wider uppercase transition-colors duration-200 ${
                      isActive ? 'text-accent' : 'text-bg/80 group-hover:text-bg'
                    }`}
                  >
                    {s.shortLabel}
                  </span>
                </div>

                {/* Track indicator dot */}
                <span
                  className={`size-[11px] rounded-full border-2 transition-all duration-300 ${
                    isActive
                      ? 'scale-125 border-text-inverse bg-accent-dark'
                      : 'border-white/40 bg-white/20 group-hover:border-white group-hover:bg-white/60'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Campaign label / Season in bottom-right corner */}
      <div
        className="pointer-events-none absolute right-[35px] bottom-[30px] z-20 hidden rounded-[var(--radius-card)] bg-text/80 px-4 py-3 text-right text-[14px] font-semibold uppercase leading-[1.3] tracking-[0.145em] text-text-inverse lg:block select-none"
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

      {/* Hero content */}
      <div className="container-x relative z-10 pt-5 pb-6 sm:pt-10 sm:pb-10 lg:absolute lg:inset-x-0 lg:top-[22%] lg:p-0 lg:pl-[76px]">
        <div className="flex flex-col items-start gap-4 sm:gap-7 lg:gap-10">
          {/* Eyebrow with gold accent rule */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.pageEntrance, ease: EASE }}
          >
            <span className="h-[1px] w-10 bg-accent" aria-hidden="true" />
            <AnimatePresence mode="wait">
              <motion.p
                key={current.eyebrow}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="eyebrow"
              >
                {current.eyebrow}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Headline: Playfair Display 700, 40px -> 68px */}
          <h1 id="hero-title" className="font-display font-bold select-none leading-[1.08] tracking-[-0.01em]">
            <span className="block overflow-hidden pb-2 -mb-2">
              <motion.span
                className="block text-[40px] sm:text-[54px] lg:text-[68px] text-text"
                initial={{ y: '105%' }}
                animate={{ y: '0%' }}
                transition={{ duration: DUR.heroHeadline, ease: EASE, delay: 0.15 }}
              >
                Style your
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-6 -mb-6 pr-4 pt-1">
              <motion.span
                className="block text-[40px] sm:text-[54px] lg:text-[68px] font-semibold italic text-accent"
                initial={{ y: '105%' }}
                animate={{ y: '0%' }}
                transition={{ duration: DUR.heroHeadline, ease: EASE, delay: 0.28 }}
              >
                everyday.
              </motion.span>
            </span>
          </h1>

          {/* Description */}
          <motion.p
            className="max-w-[462px] max-sm:order-last text-[16px] leading-[1.6] text-text-muted sm:text-[18px]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.pageEntrance, ease: EASE, delay: 0.45 }}
          >
            Festive and everyday wear for everyone. Discover authentic kurtas, sarees, lehengas and ethnic essentials.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap items-center gap-6 pt-1 sm:gap-8 sm:pt-2 lg:gap-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.pageEntrance, ease: EASE, delay: 0.6 }}
          >
            <button
              type="button"
              className="group flex h-13 w-full items-center justify-center gap-4 whitespace-nowrap rounded-btn bg-action px-8 text-[15px] font-semibold text-action-text transition-colors duration-[180ms] ease-soft hover:bg-action-hover active:opacity-[0.9] sm:h-14 sm:w-[272px] sm:text-[16px]"
              onClick={() => shopWith({ collection: current.collection })}
            >
              Explore collection
              <span className="relative size-[18px] shrink-0 transition-transform duration-[180ms] ease-soft group-hover:translate-x-[5px]" aria-hidden="true">
                <span className="absolute inset-[20.83%_16.67%]">
                  <span className="absolute inset-[-5.36%_-4.69%]">
                    <img src={ICON_ARROW} alt="" className="block size-full max-w-none" />
                  </span>
                </span>
              </span>
            </button>

            <button
              type="button"
              className="group relative flex min-h-11 flex-col items-start justify-center gap-[5px]"
              onClick={() => scrollToId('looks')}
            >
              <span className="text-[15px] font-semibold leading-none text-accent underline-offset-4 group-hover:underline sm:text-[16px]">
                Shop the look
              </span>
              <span className="relative h-[1.5px] w-full bg-accent/40">
                <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-200 group-hover:scale-x-100" />
              </span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile/Tablet slide switcher bar: ensures slides 01, 02, 03 are fully accessible on smaller viewports */}
      <div className="container-x relative z-20 flex items-center justify-between pb-6 pt-2 lg:hidden">
        <div className="flex items-center gap-2">
          {HERO_SLIDES.map((s, idx) => {
            const isActive = slide === idx;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSlide(idx)}
                title={`Show slide ${s.num}: ${s.shortLabel}`}
                aria-current={isActive ? 'true' : undefined}
                className={`flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-pill px-3 text-[13px] font-mono font-bold transition-all ${
                  isActive ? 'bg-action text-action-text shadow-sm' : 'border border-border-strong bg-bg text-text-muted hover:bg-bg-alt hover:text-accent'
                }`}
              >
                <span>{s.num}</span>
                {isActive ? <span className="text-[12px] font-sans font-semibold uppercase"> {s.shortLabel}</span> : <span className="sr-only"> {s.shortLabel}</span>}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous slide"
            className="grid size-11 place-items-center rounded-full border border-border-strong bg-bg text-text transition-colors hover:bg-bg-alt hover:text-accent"
          >
            <ChevronLeft size={18} strokeWidth={2.2} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next slide"
            className="grid size-11 place-items-center rounded-full border border-border-strong bg-bg text-text transition-colors hover:bg-bg-alt hover:text-accent"
          >
            <ChevronRight size={18} strokeWidth={2.4} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
