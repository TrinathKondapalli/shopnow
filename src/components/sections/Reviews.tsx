import { motion } from 'motion/react';
import { BadgeCheck, Quote } from 'lucide-react';
import { REVIEWS, getProduct } from '../../lib/catalog';
import { fadeUp } from '../../lib/motion';
import { formatDate } from '../../lib/utils';
import { useShop } from '../../store/ShopProvider';
import { ProductImage } from '../product/ProductImage';
import { SectionHeader, Stars } from '../product/bits';

/** 10. Customer reviews: rating summary computed from the reviews data, plus review cards. */
export function Reviews() {
  const { openQuickView } = useShop();
  const avg = REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length;
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, count: REVIEWS.filter((r) => r.rating === n).length }));

  return (
    <section id="reviews" className="py-20 md:py-28" aria-labelledby="reviews-title">
      <div className="container-x">
        <SectionHeader eyebrow="Customer reviews" title="Worn, washed and rated" id="reviews-title" />
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="h-fit rounded-3xl bg-ink p-7 text-white lg:sticky lg:top-24">
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
            <p className="mt-6 text-xs text-white/40">Sample reviews for this demo store.</p>
          </motion.div>

          <div className="columns-1 gap-5 md:columns-2 [&>*]:mb-5">
            {REVIEWS.map((r, i) => {
              const p = getProduct(r.productId);
              return (
                <motion.article
                  key={r.id}
                  className="break-inside-avoid rounded-3xl border border-line bg-white p-6"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                  custom={i % 2}
                >
                  <div className="flex items-center justify-between">
                    <Stars value={r.rating} />
                    <Quote size={22} className="text-lav-300" />
                  </div>
                  <h3 className="mt-4 font-semibold">{r.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{r.body}</p>
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
                    <div>
                      <p className="flex items-center gap-1.5 text-sm font-semibold">{r.name} <BadgeCheck size={15} className="text-electric" aria-label="Verified buyer" /></p>
                      <p className="text-xs text-muted">{r.city} · {formatDate(r.date)}</p>
                    </div>
                    {p && (
                      <button type="button" onClick={() => openQuickView(p.id)} className="flex items-center gap-2 rounded-full bg-lav-50 py-1 pl-1 pr-3 text-xs font-medium hover:bg-lav-100">
                        <span className="size-8 overflow-hidden rounded-full art-bg"><ProductImage product={p} inset="p-1" /></span>
                        <span className="max-w-[120px] truncate">{p.name} · {r.size}</span>
                      </button>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
