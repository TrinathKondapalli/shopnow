import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import type { ExploreState } from '../../types';
import { PRODUCTS, getProduct, matchesTab } from '../../lib/catalog';
import { fadeUp } from '../../lib/motion';
import { cn } from '../../lib/utils';
import { useShop } from '../../store/ShopProvider';
import { ProductImage } from '../product/ProductImage';

const CATS: { label: string; text: string; productId: string; color: number; patch: Partial<ExploreState>; bg: string; tall?: boolean }[] = [
  { label: 'Men', text: 'Jackets, cargos and everyday tees', productId: 'zip-overshirt', color: 0, patch: { tab: 'men' }, bg: 'from-[#E9E4F3] to-[#D5CCE8]', tall: true },
  { label: 'Women', text: 'Cropped fleece, wide-leg denim', productId: 'cropped-hoodie', color: 0, patch: { tab: 'women' }, bg: 'from-[#F1EAFF] to-[#D6C6FF]', tall: true },
  { label: 'Hoodies', text: 'Brushed fleece in five fits', productId: 'everyday-hoodie', color: 1, patch: { types: ['Hoodies'] }, bg: 'from-[#EEEBF3] to-[#DCD6E6]' },
  { label: 'Accessories', text: 'Caps, hats and totes', productId: 'dad-cap', color: 2, patch: { types: ['Accessories'] }, bg: 'from-[#F4F0FF] to-[#E2D7FF]' },
];

const countFor = (patch: Partial<ExploreState>) =>
  PRODUCTS.filter((p) => (patch.tab ? matchesTab(p, patch.tab) : true) && (patch.types ? patch.types.includes(p.type) : true)).length;

/** 04. Shop by category: image zoom on hover (300ms); each card filters the product grid. */
export function Categories() {
  const { shopWith } = useShop();
  return (
    <section id="categories" className="py-20 md:py-28" aria-labelledby="cat-title">
      <div className="container-x">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Shop by category</p>
            <h2 id="cat-title" className="display mt-3 text-[clamp(2rem,5vw,3.5rem)]">Find your fit</h2>
          </div>
          <button type="button" onClick={() => shopWith({})} className="btn btn-line">View all products</button>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {CATS.map((c, i) => {
            const p = getProduct(c.productId)!;
            return (
              <motion.button
                key={c.label}
                type="button"
                onClick={() => shopWith(c.patch)}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                custom={i}
                className={cn('group relative overflow-hidden rounded-3xl bg-linear-to-b text-left', c.bg, c.tall ? 'aspect-[3/4]' : 'aspect-[3/4] md:mt-16')}
              >
                <div className="absolute inset-0 transition-transform duration-300 ease-out group-hover:scale-[1.06]">
                  <ProductImage product={p} color={c.color} view="alt" inset="p-[14%] pb-[30%]" />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 md:p-5">
                  <div>
                    <h3 className="display text-2xl md:text-3xl">{c.label}</h3>
                    <p className="mt-1 hidden text-[13px] text-ink-2 sm:block">{c.text}</p>
                    <p className="mt-1 text-xs font-medium text-muted">{countFor(c.patch)} styles</p>
                  </div>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white shadow-sm transition-colors duration-200 group-hover:bg-ink group-hover:text-white">
                    <ArrowUpRight size={18} className="transition-transform duration-200 group-hover:rotate-45" />
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
