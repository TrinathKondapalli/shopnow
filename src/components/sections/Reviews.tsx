import { motion } from 'motion/react';
import { BadgeCheck, Quote } from 'lucide-react';
import { REVIEWS, getProduct } from '../../lib/catalog';
import { fadeUp } from '../../lib/motion';
import { formatDate } from '../../lib/utils';
import { useShop } from '../../store/ShopProvider';
import { ProductImage } from '../product/ProductImage';
import { SectionHeader, Stars } from '../product/bits';

/** 10. Customer reviews: rating summary computed from reviews, plus infinite opposite-direction vertical marquee. */
export function Reviews() {
  const avg = REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length;
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, count: REVIEWS.filter((r) => r.rating === n).length }));

  // Column 1 (indices 0..3) moving upwards, Column 2 (indices 4..7) moving downwards
  const col1 = REVIEWS.slice(0, 4);
  const col2 = REVIEWS.slice(4, 8);

  // Duplicated for a seamless 50% infinite translation loop
  const col1Loop = [...col1, ...col1];
  const col2Loop = [...col2, ...col2];

  return (
    <section id="reviews" className="scroll-mt-16 md:scroll-mt-20 py-20 md:py-28 overflow-hidden" aria-labelledby="reviews-title">
      <div className="container-x">
        <SectionHeader eyebrow="Customer reviews" title="Worn, washed and rated" id="reviews-title" />
        <div className="grid gap-6 lg:grid-cols-[320px_1fr] items-start">
          {/* Rating Summary Card (sticky on desktop) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="h-fit rounded-3xl bg-ink p-7 text-white lg:sticky lg:top-24 z-10"
          >
            <p className="display text-7xl">{avg.toFixed(1)}</p>
            <Stars value={avg} size={18} className="mt-3" />
            <p className="mt-2 text-sm text-white/60">Based on {REVIEWS.length} reviews</p>
            <ul className="mt-6 space-y-2">
              {dist.map((d) => (
                <li key={d.n} className="flex items-center gap-3 text-sm">
                  <span className="w-3 tabular-nums">{d.n}</span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
                    <motion.span
                      className="block h-full rounded-full bg-lav-300"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(d.count / REVIEWS.length) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </span>
                  <span className="w-4 text-right tabular-nums text-white/60">{d.count}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Dual-column infinite vertical marquee with top and bottom fade gradient */}
          <div
            className="relative h-[620px] md:h-[660px] overflow-hidden"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
            }}
          >
            <div className="grid h-full grid-cols-1 gap-5 md:grid-cols-2">
              {/* Column 1: moves UPWARDS */}
              <div className="overflow-hidden">
                <div className="animate-marquee-up flex flex-col gap-5">
                  {col1Loop.map((r, i) => (
                    <ReviewCard key={`col1-${r.id}-${i}`} r={r} />
                  ))}
                </div>
              </div>

              {/* Column 2: moves DOWNWARDS */}
              <div className="overflow-hidden">
                <div className="animate-marquee-down flex flex-col gap-5">
                  {col2Loop.map((r, i) => (
                    <ReviewCard key={`col2-${r.id}-${i}`} r={r} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ r }: { r: (typeof REVIEWS)[number] }) {
  const { openQuickView } = useShop();
  const p = getProduct(r.productId);

  return (
    <article className="rounded-3xl border border-line bg-white p-6 shadow-sm transition-[box-shadow,transform] duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <Stars value={r.rating} />
        <Quote size={22} className="text-lav-300" />
      </div>
      <h3 className="mt-4 font-semibold text-ink">{r.title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{r.body}</p>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
        <div>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
            {r.name} <BadgeCheck size={15} className="text-electric" aria-label="Verified buyer" />
          </p>
          <p className="text-xs text-muted">{r.city} · {formatDate(r.date)}</p>
        </div>
        {p && (
          <button
            type="button"
            onClick={() => openQuickView(p.id)}
            className="flex items-center gap-2 rounded-full bg-lav-50 py-1 pl-1 pr-3 text-xs font-medium text-ink transition-colors hover:bg-lav-100"
          >
            <span className="size-8 overflow-hidden rounded-full art-bg">
              <ProductImage product={p} inset="p-1" />
            </span>
            <span className="max-w-[120px] truncate">{p.name} · {r.size}</span>
          </button>
        )}
      </div>
    </article>
  );
}
