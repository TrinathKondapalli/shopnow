import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import type { Look } from '../../types';
import { PRODUCTS } from '../../lib/catalog';
import { DUR, EASE } from '../../lib/motion';
import { useShop } from '../../store/ShopProvider';
import { Mannequin } from '../art/Mannequin';
import { ProductImage } from '../product/ProductImage';
import { Price } from '../product/bits';

const CAMPAIGN_LOOK: Look = {
  id: 'campaign', name: 'Campaign', caption: '', figure: 'f',
  items: [
    { productId: 'satin-bomber', color: 0, slot: 'top' },
    { productId: 'parachute-pants', color: 0, slot: 'bottom' },
    { productId: 'retro-runner', color: 1, slot: 'feet' },
  ],
};

/** 06. Featured collection: "Made for every move", a cinematic streetwear campaign. */
export function Featured() {
  const { shopWith, openQuickView } = useShop();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yFigure = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);
  const xType = useTransform(scrollYProgress, [0, 1], ['6%', '-14%']);
  const picks = PRODUCTS.filter((p) => p.collections.includes('move')).slice(0, 3);

  return (
    <section ref={ref} id="featured" className="relative overflow-hidden bg-ink py-20 text-white md:py-28" aria-labelledby="featured-title">
      <motion.p
        style={{ x: xType }}
        className="display pointer-events-none absolute left-0 top-10 whitespace-nowrap text-[clamp(6rem,18vw,16rem)] leading-none text-white/[0.04] select-none"
        aria-hidden="true"
      >
        MADE FOR EVERY MOVE
      </motion.p>

      <div className="container-x relative grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        {/* Asymmetric campaign frame with a mask reveal */}
        <motion.div
          className="relative h-[520px] overflow-hidden rounded-[32px] md:h-[640px]"
          style={{ background: 'radial-gradient(80% 70% at 50% 35%, #7B2FF7 0%, #3A1782 55%, #15102A 100%)' }}
          initial={{ clipPath: 'inset(0% 0% 100% 0% round 32px)' }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 32px)' }}
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          transition={{ duration: DUR.heroMask, ease: EASE }}
        >
          <div className="absolute inset-x-8 top-8 flex justify-between text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60">
            <span>SHOPNOW / Drop 04</span><span>Autumn–Winter 26</span>
          </div>
          <motion.div style={{ y: yFigure }} className="absolute inset-x-0 bottom-[-4%] flex h-[88%] justify-center">
            <Mannequin look={CAMPAIGN_LOOK} className="h-full w-auto drop-shadow-[0_40px_40px_rgba(0,0,0,0.45)]" />
          </motion.div>
          <div className="absolute bottom-6 left-6 h-24 w-24 rounded-full border border-white/20" aria-hidden="true" />
        </motion.div>

        <div>
          <motion.p className="eyebrow text-lav-300" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>Featured collection</motion.p>
          <h2 id="featured-title" className="display mt-4 text-[clamp(2.8rem,7vw,5.6rem)]">
            {['Made for', 'every move.'].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.05em]">
                <motion.span
                  className={i ? 'block text-lav-300' : 'block'}
                  initial={{ y: '105%' }}
                  whileInView={{ y: '0%' }}
                  viewport={{ once: true }}
                  transition={{ duration: DUR.heroHeadline, ease: EASE, delay: i * 0.12 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h2>
          <motion.p
            className="mt-6 max-w-md text-lg leading-relaxed text-white/70"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: DUR.section, delay: 0.2 }}
          >
            Stretch fabrics, satin layers and cushioned soles. Pieces that keep up from the morning commute to the late show.
          </motion.p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {picks.map((p, i) => (
              <motion.button
                key={p.id}
                type="button"
                onClick={() => openQuickView(p.id)}
                className="group text-left"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: DUR.section, ease: EASE, delay: 0.25 + i * 0.08 }}
              >
                <div className="aspect-square overflow-hidden rounded-2xl bg-white/10">
                  <ProductImage product={p} className="transition-transform duration-300 group-hover:scale-105" />
                </div>
                <p className="mt-2 truncate text-sm font-semibold">{p.name}</p>
                <Price product={p} className="text-xs [&_.text-ink]:text-white/80" />
              </motion.button>
            ))}
          </div>

          <button type="button" onClick={() => shopWith({ collection: 'move' })} className="btn btn-light mt-10 h-14 px-7">
            Shop the collection <ArrowRight size={18} className="arrow" />
          </button>
        </div>
      </div>
    </section>
  );
}
