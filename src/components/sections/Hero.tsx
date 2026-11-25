import { useEffect, useMemo, useState } from 'react';
import type React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Tag, Truck } from 'lucide-react';
import type { ExploreState } from '../../types';
import { PRODUCTS, discountPct } from '../../lib/catalog';
import { EASE } from '../../lib/motion';
import { cn } from '../../lib/utils';
import { useShop } from '../../store/ShopProvider';

interface HeroSlide {
  id: string;
  photo: string;
  alt: string;
  /** Horizontal focal point of the models inside the photo. */
  focus: string;
  tagline: string;
  line: string;
  patch: Partial<ExploreState>;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: '01',
    photo: '/figma/hero/hero-bg.png',
    alt: 'Two models in a lavender hoodie and a black hoodie with cargo pants, against purple concrete',
    focus: '78%',
    tagline: 'Style your everyday.',
    line: 'Everything you need. One place.',
    patch: { collection: 'move' },
  },
  {
    id: '02',
    photo: '/figma/hero/hero-slide-02.png',
    alt: 'Two models in a lilac jacket and an oversized lavender sweatshirt against purple concrete architecture',
    focus: '76%',
    tagline: 'Summer capsule is live.',
    line: 'Lilac layers. Easy fits.',
    patch: { tab: 'new' },
  },
  {
    id: '03',
    photo: '/figma/hero/hero-slide-03.png',
    alt: 'Models in technical streetwear and a violet hoodie against purple monolithic architecture',
    focus: '74%',
    tagline: 'Made for every move.',
    line: 'Tech layers for after hours.',
    patch: { collection: 'move' },
  },
];

const FEATURES = [
  { icon: Tag, title: 'Best deals', sub: '& offers' },
  { icon: ShieldCheck, title: 'Secure', sub: 'shopping' },
  { icon: Truck, title: 'Fast', sub: 'delivery' },
];

/** 01 Hero banner: campaign carousel with brand copy, photo and offer badge. Auto-rotates every 5s. */
export function Hero() {
  const { shopWith } = useShop();
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = HERO_SLIDES[slide];
  const maxOff = useMemo(() => Math.max(...PRODUCTS.map(discountPct)), []);
  const go = (d: number) => setSlide((s) => (s + d + HERO_SLIDES.length) % HERO_SLIDES.length);

  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 5000);
    return () => window.clearInterval(t);
  }, [paused, slide]);

  return (
    <section
      id="top"
      className="relative bg-white pt-0 lg:pt-3"
      aria-roledescription="carousel"
      aria-labelledby="hero-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative overflow-hidden bg-[linear-gradient(90deg,#FBF7F2_0%,#FBF7F2_40%,#F3EDFF_72%,#E6DCFF_100%)] md:h-[420px] lg:h-[clamp(400px,30vw,500px)]">
        {/* Photo: stacked on mobile, right half on tablet, centred band on desktop with soft faded edges */}
        <div className="relative h-[260px] sm:h-[340px] md:absolute md:inset-0 md:h-auto">
        <AnimatePresence initial={false}>
          <motion.img
            key={current.photo}
            src={current.photo}
            alt={current.alt}
            className="pointer-events-none absolute inset-0 size-full object-cover [object-position:var(--focus)_30%] md:inset-y-0 md:left-auto md:right-0 md:w-[60%] md:[mask-image:linear-gradient(90deg,transparent_0%,#000_30%)] md:[object-position:100%_30%] lg:left-[33%] lg:right-auto lg:w-[40%] lg:[mask-image:linear-gradient(90deg,transparent_0%,#000_18%,#000_86%,transparent_100%)]"
            style={{ '--focus': current.focus } as React.CSSProperties}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          />
        </AnimatePresence>
        </div>

        {/* Copy */}
        <div className="container-x relative z-10 py-8 md:absolute md:inset-y-0 md:left-0 md:flex md:items-center md:py-0">
          <div className="flex flex-col items-start md:pl-6 lg:pl-[2.5vw]">
            <h1 id="hero-title" className="text-[64px] font-black leading-[0.9] tracking-[-0.06em] text-ink sm:text-[80px] lg:text-[clamp(72px,6.6vw,112px)]">
              SHOP<span className="text-purple">NOW</span>
            </h1>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <p className="mt-3 text-[28px] font-extrabold italic leading-tight tracking-[-0.03em] text-purple sm:text-[32px] lg:text-[clamp(28px,2.65vw,44px)]">
                  {current.tagline}
                </p>
                <p className="mt-3 flex items-center gap-3 text-[17px] font-bold italic text-ink sm:text-[19px] lg:mt-[0.9vw] lg:text-[clamp(17px,1.45vw,24px)]">
                  <span className="h-0.5 w-10 bg-ink" aria-hidden="true" />
                  {current.line}
                  <span className="hidden h-0.5 w-10 bg-ink sm:block" aria-hidden="true" />
                </p>
              </motion.div>
            </AnimatePresence>

            <ul className="mt-6 flex items-center lg:mt-[1.8vw]">
              {FEATURES.map(({ icon: Icon, title, sub }, i) => (
                <li key={title} className={cn('flex items-center gap-2.5', i > 0 && 'ml-4 border-l border-ink/25 pl-4 xl:ml-6 xl:pl-6')}>
                  <Icon size={30} strokeWidth={1.7} className="shrink-0 text-purple" aria-hidden="true" />
                  <span className="text-[14px] font-medium leading-tight text-ink sm:text-[15px] lg:text-[clamp(14px,1.1vw,18px)]">
                    {title}<br />{sub}
                  </span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => shopWith(current.patch)}
              className="group mt-6 flex h-[52px] items-center gap-3 rounded-full bg-purple px-9 text-[19px] font-bold text-white shadow-[0_14px_30px_-14px_rgba(106,30,213,0.9)] transition-colors hover:bg-electric-600 lg:mt-[1.6vw] xl:h-[58px] xl:px-11 xl:text-[22px]"
            >
              Shop now
              <ArrowRight size={22} strokeWidth={2.4} className="transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Offer badge */}
        <OfferBadge pct={maxOff} onClick={() => shopWith({ tab: 'sale' })} />

        {/* Arrows */}
        <ArrowButton side="left" onClick={() => go(-1)} label="Previous slide"><ChevronLeft size={26} strokeWidth={2.2} /></ArrowButton>
        <ArrowButton side="right" onClick={() => go(1)} label="Next slide"><ChevronRight size={26} strokeWidth={2.2} /></ArrowButton>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 max-md:top-[232px] max-md:bottom-auto sm:max-md:top-[312px]">
          {HERO_SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSlide(i)}
              aria-label={`Show slide ${i + 1} of ${HERO_SLIDES.length}`}
              aria-current={slide === i}
              className={cn(
                'h-3 rounded-full border-2 border-white shadow transition-all duration-300',
                slide === i ? 'w-8 bg-white' : 'w-3 bg-white/30 hover:bg-white/70',
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ArrowButton({ side, onClick, label, children }: { side: 'left' | 'right'; onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'absolute z-20 grid size-11 place-items-center rounded-full text-white shadow-[0_10px_24px_-10px_rgba(10,10,10,0.6)] transition-colors max-md:top-[108px] sm:max-md:top-[148px] md:top-1/2 md:size-[52px] md:-translate-y-1/2',
        side === 'left' ? 'left-3 bg-ink/45 hover:bg-ink/70 md:left-5' : 'right-3 bg-purple hover:bg-electric-600 md:right-5',
      )}
    >
      {children}
    </button>
  );
}

/** Tilted "Big offers / up to X% off" badge with confetti, shown on md+ at the right of the banner. */
function OfferBadge({ pct, onClick }: { pct: number; onClick: () => void }) {
  return (
    <div className="absolute inset-y-0 left-[73%] right-[5%] z-10 hidden items-center justify-center text-[clamp(10px,0.9vw,15px)] lg:flex">
      <Confetti />
      <button type="button" onClick={onClick} className="group relative flex flex-col items-center" aria-label={`Big offers, up to ${pct}% off. Shop the sale`}>
        <span className="relative -rotate-[6deg] bg-ink px-[0.35em] pb-[0.05em] pt-[0.12em] text-[4.5em] font-black italic leading-none tracking-[-0.04em] text-white shadow-[0.4rem_0.4rem_0_#8B4DFF]">
          BIG
        </span>
        <span className="relative -mt-[0.1em] -rotate-[6deg] bg-ink px-[0.35em] py-[0.1em] text-[4.25em] font-black italic leading-none tracking-[-0.04em] text-lav-300 shadow-[0.4rem_0.4rem_0_#8B4DFF]">
          OFFERS
        </span>
        <span className="relative -mt-[0.6em] flex -rotate-[6deg] flex-col items-center rounded-[1.9em] bg-purple px-[2em] pb-[1.2em] pt-[0.8em] text-white shadow-[0_18px_40px_-16px_rgba(106,30,213,0.9)]">
          <span className="flex items-center gap-[0.4em] text-[1.85em] font-extrabold italic">
            <span className="h-0.5 w-[0.9em] bg-white/70" aria-hidden="true" />UP TO<span className="h-0.5 w-[0.9em] bg-white/70" aria-hidden="true" />
          </span>
          <span className="flex items-baseline text-[5.8em] font-black italic leading-[0.9] tracking-[-0.05em]">
            {pct}%<span className="ml-[0.1em] text-[0.55em] tracking-[-0.03em]">OFF</span>
          </span>
        </span>
        <span className="relative -mt-[0.9em] flex -rotate-[6deg] items-center gap-[0.4em] rounded-full bg-lav-300 px-[1.6em] py-[0.7em] text-[1.3em] font-extrabold text-ink shadow-[0_10px_20px_-10px_rgba(10,10,10,0.5)] transition-transform group-hover:-translate-y-0.5">
          Don’t miss out <ArrowRight className="size-[1.1em] transition-transform group-hover:translate-x-1" strokeWidth={2.6} />
        </span>
      </button>
    </div>
  );
}

function Confetti() {
  const bits = [
    { c: '#6A1ED5', l: '4%', t: '18%', r: -25, s: 'tri' },
    { c: '#8B4DFF', l: '10%', t: '52%', r: 15, s: 'bar' },
    { c: '#0A0A0A', l: '88%', t: '10%', r: 35, s: 'tri' },
    { c: '#C2B0FA', l: '94%', t: '42%', r: -10, s: 'bar' },
    { c: '#6A1ED5', l: '84%', t: '80%', r: 60, s: 'bar' },
    { c: '#8B4DFF', l: '2%', t: '80%', r: 20, s: 'tri' },
  ];
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {bits.map((b, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            left: b.l, top: b.t, transform: `rotate(${b.r}deg)`, background: b.c,
            width: b.s === 'tri' ? 22 : 6, height: b.s === 'tri' ? 22 : 18,
            clipPath: b.s === 'tri' ? 'polygon(0 0, 100% 50%, 0 100%)' : undefined,
            borderRadius: b.s === 'bar' ? 2 : 0,
          }}
        />
      ))}
    </div>
  );
}
