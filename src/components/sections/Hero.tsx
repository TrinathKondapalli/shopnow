import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { LOOKS, getProduct } from '../../lib/catalog';
import { DUR, EASE } from '../../lib/motion';
import { inr, scrollToId } from '../../lib/utils';
import { useShop } from '../../store/ShopProvider';
import { Mannequin } from '../art/Mannequin';
import { ProductImage } from '../product/ProductImage';

const HEADLINE = ['Style', 'Your', 'Everyday'];

/** 02. Hero: lavender campaign with mask reveal (800ms) and sequential headline reveal (700ms). */
export function Hero() {
  const { shopWith, openQuickView } = useShop();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yBack = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const yFront = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);
  const him = LOOKS[0];
  const her = LOOKS[1];
  const chip = getProduct('cropped-hoodie')!;

  return (
    <section ref={ref} id="top" className="relative overflow-hidden" aria-labelledby="hero-title">
      <div className="container-x grid items-center gap-10 pt-8 pb-16 md:pt-12 lg:grid-cols-[1fr_1.08fr] lg:gap-6 lg:pb-24">
        <div className="relative z-10">
          <motion.p
            className="eyebrow inline-flex items-center gap-2 rounded-full bg-lav-100 px-3 py-1.5 text-electric-600"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.pageEntrance, ease: EASE }}
          >
            <Sparkles size={13} /> New season drop
          </motion.p>

          <h1 id="hero-title" className="display mt-6 text-[clamp(3.4rem,10vw,8.4rem)]">
            {HEADLINE.map((w, i) => (
              <span key={w} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className={i === 2 ? 'block text-electric' : 'block'}
                  initial={{ y: '105%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: DUR.heroHeadline, ease: EASE, delay: 0.15 + i * 0.12 }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-6 max-w-md text-lg leading-relaxed text-ink-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.pageEntrance, ease: EASE, delay: 0.55 }}
          >
            Discover fashion that moves with you. Streetwear and everyday essentials for him and her.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.pageEntrance, ease: EASE, delay: 0.68 }}
          >
            <button type="button" className="btn btn-dark h-14 px-7 text-[15px]" onClick={() => shopWith({ collection: 'move' })}>
              Explore Collection <ArrowRight size={18} className="arrow" />
            </button>
            <button type="button" className="btn btn-line h-14 px-7 text-[15px]" onClick={() => scrollToId('looks')}>
              Shop the Look
            </button>
          </motion.div>

          <motion.ul
            className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: DUR.pageEntrance, delay: 0.85 }}
          >
            <li>Free shipping above ₹999</li>
            <li>7-day easy returns</li>
            <li>Sizes XS to XL</li>
          </motion.ul>
        </div>

        {/* Campaign panel: mask reveal */}
        <motion.div
          className="relative h-[480px] overflow-hidden rounded-[32px] md:h-[600px]"
          style={{ background: 'radial-gradient(120% 90% at 70% 20%, #F3EDFF 0%, #CDBBFF 55%, #9B6BFF 100%)' }}
          initial={{ clipPath: 'inset(100% 0% 0% 0% round 32px)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0% round 32px)' }}
          transition={{ duration: DUR.heroMask, ease: EASE, delay: 0.1 }}
        >
          <motion.p
            style={{ y: yBack }}
            className="display pointer-events-none absolute inset-x-0 top-[8%] select-none text-center text-[clamp(5rem,15vw,11rem)] leading-none text-white/40"
            aria-hidden="true"
          >
            MOVE
          </motion.p>
          <motion.div style={{ y: yFront }} className="absolute inset-x-0 bottom-0 flex h-[90%] items-end justify-center">
            <motion.div
              className="relative h-[92%] w-auto -mr-[6%]"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
            >
              <Mannequin look={her} className="h-full w-auto drop-shadow-[0_30px_30px_rgba(42,26,94,0.25)]" />
            </motion.div>
            <motion.div
              className="relative h-full w-auto"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.7 }}
            >
              <Mannequin look={him} className="h-full w-auto drop-shadow-[0_30px_30px_rgba(42,26,94,0.3)]" />
            </motion.div>
          </motion.div>

          <motion.button
            type="button"
            onClick={() => openQuickView(chip.id)}
            className="absolute left-4 top-4 flex items-center gap-3 rounded-2xl bg-white/90 p-2 pr-4 text-left shadow-[var(--shadow-card)] backdrop-blur md:left-6 md:top-6"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 1.05 }}
            whileHover={{ y: -3 }}
          >
            <span className="size-12 overflow-hidden rounded-xl art-bg"><ProductImage product={chip} inset="p-1.5" /></span>
            <span className="text-sm leading-tight">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-electric">Just dropped</span>
              <span className="block font-semibold">{chip.name}</span>
              <span className="text-muted">{inr(chip.price)}</span>
            </span>
          </motion.button>

          <motion.div
            className="absolute bottom-5 right-5 rounded-2xl bg-ink px-4 py-3 text-white shadow-[var(--shadow-pop)]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: EASE, delay: 1.2 }}
          >
            <span className="block text-[11px] uppercase tracking-wider text-lav-300">Mid-season</span>
            <span className="display text-2xl">Up to 30% off</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
