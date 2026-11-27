import { BadgeCheck, Quote } from 'lucide-react';
import type { Review } from '../../types';
import { CATALOG_REVIEWS, getProduct } from '../../lib/catalog';
import { formatDate } from '../../lib/utils';
import { useShop } from '../../store/ShopProvider';
import { ProductImage } from '../product/ProductImage';
import { SectionHeader, Stars } from '../product/bits';

/** 10. Customer reviews: summary computed from the real reviews, then each review exactly once. */
export function Reviews() {
  const reviews = CATALOG_REVIEWS;
  const total = reviews.length;
  const avg = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, count: reviews.filter((r) => r.rating === n).length }));

  return (
    <section id="reviews" className="scroll-mt-16 py-16 md:scroll-mt-20 md:py-24" aria-labelledby="reviews-title">
      <div className="container-x">
        <SectionHeader eyebrow="Customer reviews" title="Worn, washed and rated" id="reviews-title" />

        <div className="grid items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          {/* Rating summary */}
          {total > 0 && (
            <div className="rounded-[var(--radius-card)] bg-text p-7 text-text-inverse lg:sticky lg:top-24">
              <p className="display text-7xl text-text-inverse">{avg.toFixed(1)}</p>
              <Stars value={avg} size={18} className="mt-3" />
              <p className="mt-2 text-sm text-dark-muted">Average of {total} {total === 1 ? 'review' : 'reviews'}</p>
              <ul className="mt-6 space-y-2" aria-label="Rating breakdown">
                {dist.map((d) => (
                  <li key={d.n} className="flex items-center gap-3 text-sm">
                    <span className="w-3 tabular-nums">{d.n}</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15" aria-hidden="true">
                      <span className="block h-full rounded-full bg-accent-dark" style={{ width: `${(d.count / total) * 100}%` }} />
                    </span>
                    <span className="w-4 text-right tabular-nums text-dark-muted">
                      {d.count}<span className="sr-only"> {d.n}-star {d.count === 1 ? 'review' : 'reviews'}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Each review once: 3-column grid on desktop, snap scroller on phones */}
          <ul
            className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-3"
            aria-label="Customer reviews"
          >
            {/* Add verified ethnic wear product reviews here once available. */}
            {reviews.map((r) => (
              <li key={r.id} className="flex w-[82%] shrink-0 snap-start sm:w-auto">
                <ReviewCard r={r} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ r }: { r: Review }) {
  const { openQuickView } = useShop();
  const p = getProduct(r.productId);

  return (
    <article className="flex w-full flex-col rounded-[var(--radius-card)] border border-border bg-bg p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between">
        <Stars value={r.rating} />
        <Quote size={22} className="text-border" aria-hidden="true" />
      </div>
      <h3 className="mt-4 font-semibold text-text">{r.title}</h3>
      <p className="mt-2 flex-1 text-[15px] leading-relaxed text-text-muted">{r.body}</p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-text">
            {r.name} <BadgeCheck size={15} className="text-accent" aria-label="Verified buyer" />
          </p>
          <p className="text-xs text-text-muted">{r.city} · {formatDate(r.date)}</p>
        </div>
        {p && (
          <button
            type="button"
            onClick={() => openQuickView(p.id)}
            className="flex min-h-11 max-w-full items-center gap-2 rounded-pill bg-bg-alt py-1 pl-1 pr-3 text-xs font-medium text-text transition-colors hover:bg-accent-soft"
          >
            <span className="size-9 shrink-0 overflow-hidden rounded-full art-bg">
              <ProductImage product={p} inset="p-1" />
            </span>
            <span className="min-w-0 truncate">{p.name} · {r.size}</span>
          </button>
        )}
      </div>
    </article>
  );
}
