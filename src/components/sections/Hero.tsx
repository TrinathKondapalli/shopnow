import { useEffect, useState } from 'react';
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
    label: 'FESTIVE’24\nETHNIC\nCOLLECTION',
    shortLabel: 'ETHNIC’24',
    eyebrow: 'Festive season drop',
    collection: 'festive',
  },
  {
    id: '02',
    num: '02',
    photo: '/figma/hero/hero-slide-02.png',
    alt: 'Indian couple under royal palace archway in festive ethnic wedding attire with brass lamps and festive lighting',
    label: 'ROYAL’24\nWEDDING\nEDITION',
    shortLabel: 'WEDDING',
    eyebrow: 'Ceremonial edit',
    collection: 'ethnic',
  },
  {
    id: '03',
    num: '03',
    photo: '/figma/hero/hero-slide-03.png',
    alt: 'Radiant Indian woman in festive yellow embroidered Anarkali gown with marigold garlands in palace courtyard',
    label: 'FESTIVE’24\nGOLDEN\nANARKALI',
    shortLabel: 'FESTIVE',
    eyebrow: 'Celebration edit',
    collection: 'festive',
  },
];

/**
 * 01 Hero (Figma 104:269). Full-bleed campaign photograph (1648 × 928 frame) with
 * editorial copy on the left and a vertical interactive 3-slide campaign selector on the right.
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

  const go = (delta: number) => {
    setSlide((s) => (s + delta + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

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
      {/* Campaign photography cross-fade: authentic Indian streetwear models */}
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

      {/* Campaign indicator (Figma 104:275): Clear 01, 02, 03 display so all 3 slides are directly visible and clickable */}
      <div
        className="absolute right-[35px] top-[18%] z-20 hidden w-[150px] rounded-2xl bg-black/45 p-4 text-white backdrop-blur-md border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.5)] lg:block select-none"
        aria-label="Campaign slides selector"
      >
        <div className="flex items-center justify-between border-b border-white/15 pb-3 font-mono text-[18px] leading-none whitespace-nowrap">
          <div className="flex items-center gap-[5px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={current.num}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.25 }}
                className="text-[22px] font-black tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
              >
                {current.num}
              </motion.span>
            </AnimatePresence>
            <span className="text-[17px] font-medium text-white/70">/ 03</span>
          </div>
          <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-purple-bright">Slides</span>
        </div>

        {/* Vertical track showing all 3 slides explicitly: 01, 02, 03 */}
        <div className="relative mt-4 h-[255px] w-full">
          {/* Background vertical rail */}
          <span className="absolute right-[12px] top-0 h-[240px] w-[1.5px] bg-white/25" />

          {/* Active glowing purple progress segment that glides across 01 -> 02 -> 03 */}
          <motion.span
            className="absolute right-[11.25px] h-[64px] w-[3px] rounded-full bg-purple-bright shadow-[0_0_12px_rgba(139,77,255,0.95)]"
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
                className="group absolute right-0 flex h-[78px] w-full items-center justify-end gap-3.5 pr-1 focus-visible:outline-none"
                style={{ top: `${idx * 80}px` }}
                aria-label={`Switch to slide ${s.num}: ${s.shortLabel}`}
                aria-current={isActive}
              >
                {/* Slide label and number */}
                <div className="flex flex-col items-end text-right transition-transform duration-200 group-hover:-translate-x-1">
                  <span
                    className={`font-mono text-[16px] font-black tracking-wider transition-colors duration-200 ${
                      isActive ? 'text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]' : 'text-white/70 group-hover:text-white'
                    }`}
                  >
                    {s.num}
                  </span>
                  <span
                    className={`text-[11px] font-semibold tracking-wider uppercase transition-colors duration-200 ${
                      isActive ? 'text-lav-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : 'text-white/55 group-hover:text-white/85'
                    }`}
                  >
                    {s.shortLabel}
                  </span>
                </div>

                {/* Track indicator dot */}
                <span
                  className={`size-[11px] rounded-full border-2 transition-all duration-300 ${
                    isActive
                      ? 'scale-125 border-white bg-purple-bright shadow-[0_0_10px_#8B4DFF]'
                      : 'border-white/40 bg-white/20 group-hover:border-white group-hover:bg-white/60'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Campaign label / Season in bottom-right corner (Figma 104:273) */}
      <div
        className="pointer-events-none absolute right-[35px] bottom-[30px] z-20 hidden text-right text-[15px] font-semibold uppercase leading-[1.3] tracking-[0.145em] text-white lg:block select-none"
        aria-hidden="true"
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={current.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="whitespace-pre-line drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
          >
            {current.label}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Hero content (Figma 104:290): 56px vertical rhythm */}
      <div className="container-x relative z-10 pt-10 pb-8 sm:pt-12 sm:pb-12 lg:absolute lg:inset-x-0 lg:top-[24.24%] lg:p-0 lg:pl-[76px]">
        <div className="flex flex-col items-start gap-7 lg:gap-[52px]">
          {/* Eyebrow with purple accent bar */}
          <motion.div
            className="flex items-center gap-5 sm:gap-6"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.pageEntrance, ease: EASE }}
          >
            <span className="h-[2.5px] w-10 sm:w-11 bg-purple" aria-hidden="true" />
            <AnimatePresence mode="wait">
              <motion.p
                key={current.eyebrow}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="text-[14px] font-semibold uppercase leading-none tracking-[0.145em] text-ink sm:text-[15px] lg:text-[17.5px]"
              >
                {current.eyebrow}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Headline: Generous padding & proper line-height (1.08) so descenders of 'y' are NEVER cut */}
          <h1 id="hero-title" className="font-bold select-none leading-none">
            <span className="block overflow-hidden pb-2 -mb-2">
              <motion.span
                className="block text-[clamp(3.5rem,7.65vw,126px)] leading-[0.95] tracking-[-0.062em] text-ink"
                initial={{ y: '105%' }}
                animate={{ y: '0%' }}
                transition={{ duration: DUR.heroHeadline, ease: EASE, delay: 0.15 }}
              >
                Style your
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-8 -mb-8 pr-6 pt-1">
              <motion.span
                className="block text-[clamp(3.75rem,8.19vw,135px)] italic leading-[1.08] tracking-[-0.07em] text-purple drop-shadow-[0_4px_16px_rgba(106,30,213,0.15)]"
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
            className="max-w-[462px] text-[16px] leading-[1.4] tracking-[-0.013em] text-ink-2 sm:text-[18px] sm:leading-[1.3] lg:text-[21.5px] lg:leading-[28px]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.pageEntrance, ease: EASE, delay: 0.45 }}
          >
            Festive &amp; Daily wear for everyone — discover authentic kurtas, sarees, lehengas and ethnic essentials.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap items-center gap-6 pt-1 sm:gap-8 sm:pt-2 lg:gap-[46px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.pageEntrance, ease: EASE, delay: 0.6 }}
          >
            {/* Button / Primary (Figma 96:26) */}
            <button
              type="button"
              className="group flex h-13 w-full items-center justify-center gap-4 whitespace-nowrap bg-ink px-8 text-[17px] font-medium text-white transition-[background-color,opacity] duration-[180ms] ease-soft hover:bg-ink-hover active:opacity-[0.88] sm:h-14 sm:w-[292px] sm:gap-5 sm:pl-[41px] sm:pr-[42px] sm:text-[18px] lg:h-16 lg:text-[20px]"
              onClick={() => shopWith({ collection: current.collection })}
            >
              Explore collection
              <span className="relative size-[20px] shrink-0 transition-transform duration-[180ms] ease-soft group-hover:translate-x-[5px] sm:size-[22px]" aria-hidden="true">
                <span className="absolute inset-[20.83%_16.67%]">
                  <span className="absolute inset-[-5.36%_-4.69%]">
                    <img src={ICON_ARROW} alt="" className="block size-full max-w-none" />
                  </span>
                </span>
              </span>
            </button>

            {/* Link / Text (Figma 96:39) */}
            <button
              type="button"
              className="group relative flex flex-col items-start gap-[5px]"
              onClick={() => scrollToId('looks')}
            >
              <span className="text-[17px] font-medium leading-none text-ink sm:text-[18px] lg:text-[20px]">
                Shop the look
              </span>
              <span className="relative h-[1.5px] w-full bg-ink">
                <span className="absolute inset-0 origin-left scale-x-0 bg-purple transition-transform duration-200 group-hover:scale-x-100" />
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
                aria-label={`Show slide ${s.num}`}
                className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-[13px] font-mono font-bold transition-all ${
                  isActive ? 'bg-purple text-white shadow-sm' : 'border border-ink/20 bg-white/80 text-ink/70 hover:bg-white'
                }`}
              >
                <span>{s.num}</span>
                {isActive && <span className="text-[11px] font-sans font-medium uppercase">{s.shortLabel}</span>}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous slide"
            className="grid size-8 place-items-center rounded-full border border-ink/20 bg-white/80 text-ink transition-colors hover:bg-white"
          >
            <ChevronLeft size={16} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next slide"
            className="grid size-8 place-items-center rounded-full border border-ink/20 bg-white/80 text-ink transition-colors hover:bg-white"
          >
            <ChevronRight size={16} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </section>
  );
}
