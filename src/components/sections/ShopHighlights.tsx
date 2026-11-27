import { useMemo } from 'react';
import type React from 'react';
import { ArrowRight, ChevronRight, Gem, LayoutGrid, RefreshCw, Star } from 'lucide-react';
import type { ExploreState, ProductType } from '../../types';
import { CATALOG_REVIEWS, ETHNIC_TYPES, PRODUCTS, PRODUCT_TYPES, discountPct, matchesTab } from '../../lib/catalog';
import { cn } from '../../lib/utils';
import { useShop } from '../../store/ShopProvider';

const P = '/figma/products';
const EVERYDAY_TYPES: ProductType[] = PRODUCT_TYPES.filter((t) => !ETHNIC_TYPES.includes(t));

const RAIL_WANTED: { label: string; img: string; patch: Partial<ExploreState> }[] = [
  { label: 'Kurtas', img: `${P}/cotton-kurta.jpg`, patch: { types: ['Kurtas'] } },
  { label: 'Nehru Jackets', img: `${P}/nehru-jacket.jpg`, patch: { types: ['Nehru Jackets'] } },
  { label: 'Sarees', img: `${P}/traditional-sari.jpg`, patch: { types: ['Sarees'] } },
  { label: 'Kurtis', img: `${P}/anarkali-kurti.jpg`, patch: { types: ['Kurtis'] } },
  { label: 'Lehengas', img: `${P}/festive-lehenga.jpg`, patch: { types: ['Lehengas'] } },
  { label: 'Men’s Ethnic', img: '/figma/categories/men.png', patch: { tab: 'men', types: ['Kurtas', 'Nehru Jackets'] } },
  { label: 'Women’s Ethnic', img: '/figma/categories/women.png', patch: { tab: 'women', types: ['Sarees', 'Kurtis', 'Lehengas'] } },
  { label: 'Festive Edit', img: `${P}/printed-kurta.jpg`, patch: { tab: 'festive' } },
  { label: 'Everyday Wear', img: `${P}/fitted-baby-tee.jpg`, patch: { types: EVERYDAY_TYPES } },
];

const countFor = (patch: Partial<ExploreState>) =>
  PRODUCTS.filter((p) => (!patch.tab || matchesTab(p, patch.tab)) && (!patch.types?.length || patch.types.includes(p.type))).length;

/** Category rail, service strip and promo tiles that sit directly under the hero banner. */
export function ShopHighlights() {
  const { shopWith } = useShop();
  const rail = useMemo(() => RAIL_WANTED.filter((c) => countFor(c.patch) > 0), []);
  const maxOff = useMemo(() => Math.max(...PRODUCTS.filter((p) => matchesTab(p, 'festive')).map(discountPct)), []);
  const rating = useMemo(
    () => (CATALOG_REVIEWS.length ? (CATALOG_REVIEWS.reduce((s, r) => s + r.rating, 0) / CATALOG_REVIEWS.length).toFixed(1) : null),
    [],
  );

  const TRUST = [
    { icon: Gem, title: 'Best prices', sub: 'every day' },
    { icon: RefreshCw, title: 'Easy returns', sub: 'within 7 days' },
    ...(rating ? [{ icon: Star, title: `Rated ${rating}/5`, sub: `from ${CATALOG_REVIEWS.length} reviews` }] : []),
  ];

  return (
    <section id="highlights" aria-labelledby="highlights-title" className="scroll-mt-16 bg-bg pb-10 pt-6 md:scroll-mt-20 lg:pb-14">
      <div className="container-x space-y-4">
        <h2 id="highlights-title" className="font-display text-[30px] font-semibold leading-[1.15] text-text md:text-[38px]">
          Shop by category
        </h2>

        {/* Category rail: scrolls inside its own box, never past the page edge */}
        <div className="no-scrollbar w-full overflow-x-auto overscroll-x-contain xl:overflow-visible">
          <ul className="flex snap-x gap-3 pb-1 pt-1 xl:grid xl:grid-cols-10 xl:gap-2.5">
            {rail.map((c) => (
              <li key={c.label} className="w-[112px] shrink-0 snap-start xl:w-auto">
                <button
                  type="button"
                  onClick={() => shopWith(c.patch)}
                  className="group flex h-full w-full flex-col items-center gap-2.5 rounded-[var(--radius-card)] border border-border bg-bg px-2 pb-3 pt-3 text-center shadow-[var(--shadow-card)] transition-[border-color,box-shadow] duration-200 hover:border-accent"
                >
                  <span className="block size-[72px] overflow-hidden rounded-[var(--radius-btn)] bg-bg-alt xl:size-[84px]">
                    <img src={c.img} alt="" loading="lazy" className="size-full object-cover object-top transition-transform duration-300 group-hover:scale-110" />
                  </span>
                  <span className="text-[14px] font-medium leading-[1.25] text-text transition-colors group-hover:text-accent xl:text-[15px]">{c.label}</span>
                </button>
              </li>
            ))}
            <li className="w-[112px] shrink-0 snap-start xl:w-auto">
              <button
                type="button"
                onClick={() => shopWith({})}
                className="group flex h-full w-full flex-col items-center justify-center gap-2.5 rounded-[var(--radius-card)] border border-border bg-accent-soft px-2 py-3 text-center transition-colors hover:border-accent"
              >
                <LayoutGrid size={44} strokeWidth={1.6} className="text-accent" fill="currentColor" fillOpacity={0.9} aria-hidden="true" />
                <span className="text-[14px] font-semibold leading-[1.25] text-accent xl:text-[15px]">
                  All<br /><span className="inline-flex items-center">products<ChevronRight size={16} strokeWidth={2.4} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></span>
                </span>
              </button>
            </li>
          </ul>
        </div>

        {/* Service strip */}
        <ul className="grid grid-cols-2 gap-y-4 rounded-[var(--radius-card)] border border-border bg-bg-alt px-4 py-4 sm:grid-cols-3 lg:flex lg:items-center lg:justify-between lg:px-10 lg:py-5">
          {TRUST.map(({ icon: Icon, title, sub }, i) => (
            <li key={title} className={cn('flex items-center gap-3 lg:flex-1 lg:justify-center', i > 0 && 'lg:border-l lg:border-border', i === 2 && 'max-sm:col-span-2')}>
              <Icon size={34} strokeWidth={1.7} className="shrink-0 text-accent" aria-hidden="true" />
              <span className="text-[14px] font-medium leading-tight text-text xl:text-[16px]">{title}<br />{sub}</span>
            </li>
          ))}
        </ul>

        {/* Promo tiles */}
        <div className="grid gap-3 md:grid-cols-2 lg:gap-4">
          <PromoTile
            className="bg-text text-text-inverse"
            img={`${P}/festive-lehenga.jpg`}
            imgPos="50% 18%"
            title={<>Festive Edit<br /><span className="text-accent-dark">Festival Zone</span></>}
            text={<>Lehengas, sarees<br />and festive kurtas</>}
            cta="Shop now"
            ctaClass="bg-bg text-text hover:bg-bg-alt focus-visible:outline-accent-dark"
            badge={maxOff > 0 ? { top: 'Up to', value: `${maxOff}%`, bottom: 'OFF', className: 'bg-accent text-text-inverse' } : undefined}
            onClick={() => shopWith({ tab: 'festive' })}
          />
          <PromoTile
            className="bg-bg-alt border border-border text-text"
            img={`${P}/anarkali-kurti.jpg`}
            imgPos="50% 15%"
            title={<>Ethnic Edit<br /><span className="text-accent">New in</span></>}
            text={<>Kurtis, kurtas<br />and Nehru jackets</>}
            cta="Shop new in"
            ctaClass="bg-action text-action-text hover:bg-action-hover"
            onClick={() => shopWith({ tab: 'new' })}
          />
        </div>
      </div>
    </section>
  );
}

function PromoTile({ className, img, imgPos, title, text, cta, ctaClass, badge, onClick }: {
  className: string; img: string; imgPos: string;
  title: React.ReactNode; text: React.ReactNode; cta: string; ctaClass: string;
  badge?: { top: string; value: string; bottom: string; className: string };
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('group relative flex min-h-[220px] overflow-hidden rounded-[var(--radius-card)] text-left shadow-[var(--shadow-card)] lg:min-h-[260px]', className)}
    >
      <img
        src={img}
        alt=""
        loading="lazy"
        className="absolute inset-y-0 right-0 h-full w-[56%] object-cover [mask-image:linear-gradient(90deg,transparent_0%,var(--color-text)_38%)] transition-transform duration-500 group-hover:scale-105"
        style={{ objectPosition: imgPos }}
      />

      <span className="relative z-10 flex w-[62%] flex-col items-start justify-between p-5 xl:p-7">
        <span>
          <span className="block font-display text-[28px] font-semibold leading-[1.05] xl:text-[36px]">{title}</span>
          <span className="mt-2.5 block text-[15px] font-medium leading-snug opacity-90 xl:text-[17px]">{text}</span>
        </span>
        <span className={cn('mt-4 inline-flex min-h-11 items-center gap-2 rounded-btn px-5 py-2.5 text-[15px] font-semibold transition-colors', ctaClass)}>
          {cta} <ArrowRight size={18} strokeWidth={2.2} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </span>

      {badge && (
        <span className={cn('absolute right-4 top-4 z-10 grid size-[84px] place-items-center rounded-full text-center leading-none shadow-[var(--shadow-card)] xl:size-[96px]', badge.className)}>
          <span>
            <span className="block text-[12px] font-semibold xl:text-[13px]">{badge.top}</span>
            <span className="block text-[26px] font-bold tabular-nums tracking-[-0.02em] xl:text-[30px]">{badge.value}</span>
            <span className="block text-[12px] font-bold uppercase xl:text-[12px]">{badge.bottom}</span>
          </span>
        </span>
      )}
    </button>
  );
}
