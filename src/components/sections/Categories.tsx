import type React from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { ExploreState, ProductType } from '../../types';
import { countProducts } from '../../lib/catalog';
import { useShop } from '../../store/ShopProvider';

const DIR = '/figma/categories';

interface Cat { label: string; text: string; img: string; pos: string; types: ProductType[]; patch: Partial<ExploreState> }

/** Ethnic categories, each pointed at product types that exist. Cards with no products are dropped. */
const CATS: Cat[] = [
  { label: 'Kurtas', text: 'Cotton, printed and silk festive kurtas for men', img: `${DIR}/men.png`, pos: '50% 20%', types: ['Kurtas'], patch: { tab: 'all', types: ['Kurtas'] } },
  { label: 'Nehru Jackets', text: 'Nehru jacket sets and bandhgalas', img: '/figma/products/nehru-jacket.jpg', pos: '50% 15%', types: ['Nehru Jackets'], patch: { tab: 'all', types: ['Nehru Jackets'] } },
  { label: 'Sarees', text: 'Traditional drapes for festive days', img: '/figma/products/traditional-sari.jpg', pos: '50% 20%', types: ['Sarees'], patch: { tab: 'all', types: ['Sarees'] } },
  { label: 'Kurtis & Lehengas', text: 'Anarkali kurtis and festive lehengas', img: '/figma/products/anarkali-kurti.jpg', pos: '50% 15%', types: ['Kurtis', 'Lehengas'], patch: { tab: 'all', types: ['Kurtis', 'Lehengas'] } },
];

const countFor = (c: Cat) => c.types.reduce((s, t) => s + countProducts(null, t), 0);

/** 02 Shop by category: a clean grid (4 / 2 columns) that becomes a snap scroller on phones. */
export function Categories() {
  const { shopWith } = useShop();
  const cats = CATS.map((c) => ({ ...c, count: countFor(c) })).filter((c) => c.count > 0);

  return (
    <section id="categories" className="scroll-mt-16 bg-bg py-12 md:scroll-mt-20 md:py-16" aria-labelledby="cat-title">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <div className="min-w-0">
            <div className="flex items-center gap-4">
              <span className="h-[1px] w-12 bg-accent" aria-hidden="true" />
              <p className="eyebrow">Shop by category</p>
            </div>
            <h2 id="cat-title" className="mt-2 font-display text-[30px] font-semibold leading-[1.15] tracking-[-0.01em] text-text md:text-[48px]">
              Find your <span className="italic text-accent">fit</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={() => shopWith({ tab: 'ethnic' })}
            className="group inline-flex min-h-11 flex-col items-start justify-center gap-1.5"
          >
            <span className="flex items-center gap-3 text-[16px] font-semibold leading-none text-accent transition-colors group-hover:text-accent-hover lg:text-[18px]">
              View all ethnic wear
              <ArrowUpRight size={20} strokeWidth={2} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" aria-hidden="true" />
            </span>
            <span className="h-[1.5px] w-full bg-accent transition-colors group-hover:bg-accent-hover" />
          </button>
        </div>

        <ul
          className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 md:mt-10"
          aria-label="Ethnic categories"
        >
          {cats.map((c) => (
            <li key={c.label} className="flex w-[75%] shrink-0 snap-start sm:w-auto">
              <button
                type="button"
                onClick={() => shopWith(c.patch)}
                className="group grid w-full grid-rows-[auto_auto_1fr_auto] rounded-[var(--radius-card)] text-left"
              >
                <span className="relative block aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-card)] bg-bg-alt">
                  <img
                    src={c.img}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    style={{ objectPosition: c.pos } as React.CSSProperties}
                  />
                </span>
                <span className="mt-4 flex items-start justify-between gap-3">
                  <span className="min-w-0 font-display text-[24px] font-semibold leading-tight text-text [overflow-wrap:anywhere] xl:text-[28px]">{c.label}</span>
                  <ArrowUpRight size={20} strokeWidth={2} className="mt-1 shrink-0 text-text transition-colors group-hover:text-accent" aria-hidden="true" />
                </span>
                <span className="mt-1 text-[14px] leading-snug text-text-muted sm:text-[15px]">{c.text}</span>
                <span className="mt-2 text-[14px] font-medium leading-6 text-text-muted tabular-nums">{c.count} {c.count === 1 ? 'style' : 'styles'}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
