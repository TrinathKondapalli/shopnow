import { useMemo } from 'react';
import type React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ChevronRight, Gem, Headphones, LayoutGrid, RefreshCw, ShieldCheck, Star } from 'lucide-react';
import type { ExploreState } from '../../types';
import { PRODUCTS, REVIEWS, discountPct } from '../../lib/catalog';
import { fadeUp } from '../../lib/motion';
import { cn, scrollToId } from '../../lib/utils';
import { useShop } from '../../store/ShopProvider';

const P = '/figma/products';
const C = '/figma/categories';

const RAIL: { label: string; img: string; patch: Partial<ExploreState> }[] = [
  { label: 'Men’s Wear', img: `${C}/men.png`, patch: { tab: 'men' } },
  { label: 'Women’s Wear', img: `${C}/women.png`, patch: { tab: 'women' } },
  { label: 'T-Shirts & Tees', img: `${P}/essential-tee.png`, patch: { types: ['T-Shirts'] } },
  { label: 'Hoodies & Fleece', img: `${P}/everyday-hoodie.png`, patch: { types: ['Hoodies'] } },
  { label: 'Sweatshirts & Crews', img: `${P}/heavyweight-crew.png`, patch: { types: ['Sweatshirts'] } },
  { label: 'Jackets & Layers', img: `${P}/track-jacket.png`, patch: { types: ['Jackets'] } },
  { label: 'Cargos & Bottoms', img: `${P}/cargo-pants.png`, patch: { types: ['Bottoms'] } },
  { label: 'Shoes & Sneakers', img: `${P}/platform-sneakers.png`, patch: { types: ['Footwear'] } },
  { label: 'Caps & Accessories', img: `${C}/accessories.png`, patch: { types: ['Accessories'] } },
  { label: 'New Arrivals', img: `${P}/zip-overshirt.png`, patch: { tab: 'new' } },
  { label: 'Sale & Offers', img: `${P}/relaxed-jeans.png`, patch: { tab: 'sale' } },
];

/** Category rail, service strip and three promo tiles that sit directly under the hero banner. */
export function ShopHighlights() {
  const { shopWith } = useShop();
  const maxOff = useMemo(() => Math.max(...PRODUCTS.map(discountPct)), []);
  const rating = useMemo(() => (REVIEWS.reduce((s, r) => s + r.rating, 0) / Math.max(1, REVIEWS.length)).toFixed(1), []);

  const TRUST = [
    { icon: Gem, title: 'Best prices', sub: 'every day' },
    { icon: RefreshCw, title: 'Easy returns', sub: 'within 7 days' },
    { icon: ShieldCheck, title: '100% secure', sub: 'payments' },
    { icon: Headphones, title: '24/7 customer', sub: 'support' },
    { icon: Star, title: `Rated ${rating}/5`, sub: 'by our shoppers' },
  ];

  return (
    <section id="highlights" aria-labelledby="highlights-title" className="bg-white pb-10 pt-3 lg:pb-14">
      <h2 id="highlights-title" className="sr-only">Shop categories and offers</h2>
      <div className="container-x space-y-3 lg:space-y-4">
        {/* Category rail */}
        <ul className="no-scrollbar -mx-5 flex snap-x scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 pt-1 md:-mx-0 md:px-0 lg:grid lg:grid-cols-12 lg:gap-2.5 lg:overflow-visible">
          {RAIL.map((c) => (
            <li key={c.label} className="w-[112px] shrink-0 snap-start lg:w-auto">
              <button
                type="button"
                onClick={() => shopWith(c.patch)}
                className="group flex h-full w-full flex-col items-center gap-2.5 rounded-xl border border-line bg-white px-2 pb-3 pt-3 text-center shadow-[0_8px_22px_-16px_rgba(40,20,90,0.45)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-lav-300 hover:shadow-[0_16px_30px_-18px_rgba(106,30,213,0.55)]"
              >
                <span className="block size-[72px] overflow-hidden rounded-lg bg-lav-100 xl:size-[84px]">
                  <img src={c.img} alt="" loading="lazy" className="size-full object-cover transition-transform duration-300 group-hover:scale-110" />
                </span>
                <span className="text-[13.5px] font-medium leading-[1.25] text-ink transition-colors group-hover:text-purple xl:text-[15px]">{c.label}</span>
              </button>
            </li>
          ))}
          <li className="w-[112px] shrink-0 snap-start lg:w-auto">
            <button
              type="button"
              onClick={() => shopWith({})}
              className="group flex h-full w-full flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-lav-200 bg-lav-100 px-2 py-3 text-center transition-colors hover:border-purple"
            >
              <LayoutGrid size={48} strokeWidth={1.6} className="text-purple" fill="currentColor" fillOpacity={0.9} aria-hidden="true" />
              <span className="text-[14px] font-semibold leading-[1.25] text-purple xl:text-[15.5px]">
                More<br /><span className="inline-flex items-center">Categories<ChevronRight size={16} strokeWidth={2.4} className="transition-transform group-hover:translate-x-0.5" /></span>
              </span>
            </button>
          </li>
        </ul>

        {/* Service strip */}
        <ul className="grid grid-cols-2 gap-y-4 rounded-xl border border-lav-200 bg-lav-100 px-4 py-4 sm:grid-cols-3 lg:flex lg:items-center lg:justify-between lg:px-10 lg:py-5">
          {TRUST.map(({ icon: Icon, title, sub }, i) => (
            <li key={title} className={cn('flex items-center gap-3 lg:flex-1 lg:justify-center', i > 0 && 'lg:border-l lg:border-lav-300', i === 4 && 'max-sm:col-span-2')}>
              <Icon size={36} strokeWidth={1.7} className="shrink-0 text-purple" aria-hidden="true" />
              <span className="text-[14px] font-medium leading-tight text-ink xl:text-[17px]">{title}<br />{sub}</span>
            </li>
          ))}
        </ul>

        {/* Promo tiles */}
        <div className="grid gap-3 md:grid-cols-3 lg:gap-4">
          <PromoTile
            i={0}
            className="bg-[linear-gradient(110deg,#0A0A0A_0%,#2A0F5C_55%,#6A1ED5_100%)] text-white"
            img="/figma/look/night-shift.jpg"
            imgPos="52% 30%"
            title={<>Streetwear<br /><span className="text-lav-300">Offer Zone</span></>}
            text={<>Latest drops<br />Best prices</>}
            cta="Shop now"
            ctaClass="bg-lav-300 text-ink hover:bg-white"
            badge={{ top: 'Up to', value: `${maxOff}%`, bottom: 'OFF', className: 'bg-lav-300 text-ink' }}
            onClick={() => shopWith({ tab: 'sale' })}
          />
          <PromoTile
            i={1}
            className="bg-[linear-gradient(110deg,#F6EEFF_0%,#E6DCFF_55%,#C2B0FA_100%)] text-ink"
            img="/figma/look/lavender-hour.jpg"
            imgPos="50% 35%"
            title={<>Fashion<br /><span className="text-purple">Trends</span></>}
            text={<>Style your life<br />with SHOPNOW</>}
            cta="Shop now"
            ctaClass="bg-purple text-white hover:bg-electric-600"
            badge={{ top: 'New', value: 'IN', bottom: 'this week', className: 'bg-ink text-white' }}
            onClick={() => shopWith({ tab: 'new' })}
          />
          <PromoTile
            i={2}
            className="bg-[linear-gradient(110deg,#FAF5F0_0%,#F3EDFF_60%,#E6DCFF_100%)] text-ink"
            img="/figma/featured/drop-02.jpg"
            imgPos="50% 40%"
            title={<>Join the Club<br /><span className="text-purple">&amp; Save More</span></>}
            text={<>Early access, drops<br />and member-only deals</>}
            cta="Join now"
            ctaClass="bg-ink text-white hover:bg-ink-hover"
            onClick={() => scrollToId('newsletter')}
          />
        </div>
      </div>
    </section>
  );
}

function PromoTile({ i, className, img, imgPos, title, text, cta, ctaClass, badge, onClick }: {
  i: number; className: string; img: string; imgPos: string;
  title: React.ReactNode; text: React.ReactNode; cta: string; ctaClass: string;
  badge?: { top: string; value: string; bottom: string; className: string };
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      custom={i}
      className={cn('group relative flex min-h-[220px] overflow-hidden rounded-2xl text-left lg:min-h-[240px] xl:min-h-[260px]', className)}
    >
      <img
        src={img}
        alt=""
        loading="lazy"
        className="absolute inset-y-0 right-0 h-full w-[56%] object-cover [mask-image:linear-gradient(90deg,transparent_0%,#000_38%)] transition-transform duration-500 group-hover:scale-105"
        style={{ objectPosition: imgPos }}
      />

      <span className="relative z-10 flex w-[62%] flex-col items-start justify-between p-5 xl:p-7">
        <span>
          <span className="block text-[26px] font-extrabold leading-[1.02] tracking-[-0.03em] xl:text-[34px]">{title}</span>
          <span className="mt-2.5 block text-[15px] font-semibold leading-snug opacity-90 xl:text-[18px]">{text}</span>
        </span>
        <span className={cn('mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-bold shadow-[0_10px_20px_-12px_rgba(10,10,10,0.6)] transition-colors xl:text-[17px]', ctaClass)}>
          {cta} <ArrowRight size={18} strokeWidth={2.6} className="transition-transform group-hover:translate-x-1" />
        </span>
      </span>

      {badge && (
        <span className={cn('absolute right-4 top-4 z-10 grid size-[84px] place-items-center rounded-full text-center leading-none shadow-[0_10px_24px_-12px_rgba(10,10,10,0.6)] xl:size-[96px]', badge.className)}>
          <span>
            <span className="block text-[13px] font-bold xl:text-[14px]">{badge.top}</span>
            <span className="block text-[28px] font-black tracking-[-0.04em] xl:text-[32px]">{badge.value}</span>
            <span className="block text-[12px] font-extrabold uppercase xl:text-[13px]">{badge.bottom}</span>
          </span>
        </span>
      )}
    </motion.button>
  );
}
