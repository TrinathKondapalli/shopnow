import { useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Flame, TrendingUp } from 'lucide-react';
import { PRODUCTS } from '../../lib/catalog';
import { cn } from '../../lib/utils';
import { DUR, EASE } from '../../lib/motion';
import { ProductCard } from '../product/ProductCard';
import { SectionHeader } from '../product/bits';

type Mode = 'trending' | 'bestsellers';

/** 07. Trending & bestsellers: ranked carousel with two tabs. */
export function Trending() {
  const [mode, setMode] = useState<Mode>('trending');
  const rail = useRef<HTMLDivElement>(null);
  const list = useMemo(
    () => [...PRODUCTS].sort((a, b) => (mode === 'trending' ? b.trending - a.trending : b.popularity - a.popularity)).slice(0, 8),
    [mode],
  );
  const scroll = (dir: number) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector('article');
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 280) + 20) * 2, behavior: 'smooth' });
  };

  return (
    <section id="trending" className="py-20 md:py-28" aria-labelledby="trending-title">
      <div className="container-x">
        <SectionHeader
          eyebrow="Trending & bestsellers"
          title="What everyone is wearing"
          id="trending-title"
          action={
            <div className="flex items-center gap-3">
              <div className="flex rounded-full bg-lav-100 p-1" role="tablist" aria-label="Ranking">
                {([['trending', 'Trending', TrendingUp], ['bestsellers', 'Bestsellers', Flame]] as const).map(([id, label, Icon]) => (
                  <button key={id} type="button" role="tab" aria-selected={mode === id} onClick={() => setMode(id)} className={cn('relative flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold', mode === id ? 'text-white' : 'text-ink-2')}>
                    {mode === id && <motion.span layoutId="trend-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ duration: DUR.filter, ease: EASE }} />}
                    <Icon size={15} className="relative" /><span className="relative">{label}</span>
                  </button>
                ))}
              </div>
              <div className="hidden gap-2 md:flex">
                <button type="button" className="icon-btn border border-line" onClick={() => scroll(-1)} aria-label="Scroll left"><ArrowLeft size={18} /></button>
                <button type="button" className="icon-btn border border-line" onClick={() => scroll(1)} aria-label="Scroll right"><ArrowRight size={18} /></button>
              </div>
            </div>
          }
        />
      </div>
      <div ref={rail} className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-2 md:scroll-px-8 md:px-8 xl:px-[max(2rem,calc((100vw-1320px)/2+2rem))]">
        {list.map((p, i) => (
          <motion.div
            key={`${mode}-${p.id}`}
            className="w-[70vw] shrink-0 snap-start sm:w-[42vw] md:w-[30vw] lg:w-[23vw] xl:w-[290px]"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: DUR.section, ease: EASE, delay: Math.min(i, 5) * 0.06 }}
          >
            <ProductCard product={p} rank={i + 1} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
