import type React from 'react';
import { motion } from 'motion/react';
import type { ExploreState } from '../../types';
import { PRODUCTS, matchesTab } from '../../lib/catalog';
import { fadeUp } from '../../lib/motion';
import { useShop } from '../../store/ShopProvider';

const DIR = '/figma/categories';

/**
 * Card geometry from Figma 104:315, in the 1648px frame's coordinate system.
 * Cards overlap and step down; `top` is measured from the highest card (Women, y = 163).
 */
const CATS: {
  label: string; text: string; img: string; patch: Partial<ExploreState>;
  x: number; top: number; w: number; imgH: number; labelGap: number; labelX: number; labelW: number;
}[] = [
  { label: 'Men', text: 'Jackets, cargos and everyday tees', img: `${DIR}/men.png`, patch: { tab: 'men' }, x: 20.2, top: 13.1, w: 455.587, imgH: 406.524, labelGap: 4.98, labelX: 26.28, labelW: 310.15 },
  { label: 'Women', text: 'Cropped fleece, wide-leg denim', img: `${DIR}/women.png`, patch: { tab: 'women' }, x: 412.7, top: 0, w: 481.871, imgH: 422.295, labelGap: 2.3, labelX: 23.66, labelW: 343.443 },
  { label: 'Hoodies', text: 'Brushed fleece in five fits', img: `${DIR}/hoodies.png`, patch: { types: ['Hoodies'] }, x: 826.2, top: 38.5, w: 458.216, imgH: 369.727, labelGap: 16.37, labelX: 28.91, labelW: 317.159 },
  { label: 'Accessories', text: 'Caps, hats and totes', img: `${DIR}/accessories.png`, patch: { types: ['Accessories'] }, x: 1227.5, top: 79.7, w: 403.02, imgH: 339.938, labelGap: 4.96, labelX: 29.79, labelW: 338.186 },
];

const FRAME_W = 1648;
const AREA_H = 530.6; // tallest card (Women)
const pct = (n: number, of = FRAME_W) => `${(n / of) * 100}%`;

const countFor = (patch: Partial<ExploreState>) =>
  PRODUCTS.filter((p) => (patch.tab ? matchesTab(p, patch.tab) : true) && (patch.types ? patch.types.includes(p.type) : true)).length;

/** 02 Shop by Category (Figma 104:301). Hover: image zooms 1.05 and arrow turns purple (300ms). */
export function Categories() {
  const { shopWith } = useShop();
  return (
    <section id="categories" className="scroll-mt-16 md:scroll-mt-20 bg-paper pt-12 pb-16 lg:pt-[27.8px] lg:pb-[38.4px]" aria-labelledby="cat-title">
      <div className="mx-auto w-full max-w-[1648px]">
        {/* Section header (Figma 104:302) */}
        <div className="flex flex-wrap items-end justify-between gap-6 px-5 md:px-10 lg:items-start lg:pl-[71px] lg:pr-[44px]">
          <div>
            <div className="flex items-center gap-[18px]">
              <span className="h-[2.6px] w-[58.7px] bg-purple" aria-hidden="true" />
              <p className="text-[14.5px] font-semibold uppercase leading-none tracking-[0.14em] text-purple">Shop by category</p>
            </div>
            <h2 id="cat-title" className="mt-[6px] text-[clamp(3rem,5.64vw,93px)] font-bold leading-[1.075] tracking-[-0.02em] whitespace-nowrap text-ink">
              Find your <span className="italic text-purple">fit</span>
            </h2>
          </div>
          <button type="button" onClick={() => shopWith({})} className="group flex flex-col items-start gap-[6px] lg:mt-[48.8px]">
            <span className="flex items-center gap-[18px] text-[18px] font-semibold leading-none tracking-[-0.01em] text-ink transition-colors duration-200 group-hover:text-purple lg:text-[22px]">
              View all products
              <span className="relative size-[26px] transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
                <span className="absolute inset-[20.83%_16.67%]">
                  <span className="absolute inset-[-5.36%_-4.69%]"><MaskIcon src={`${DIR}/icon-arrow-right.svg`} /></span>
                </span>
              </span>
            </span>
            <span className="h-[1.8px] w-full bg-ink transition-colors duration-200 group-hover:bg-purple" />
          </button>
        </div>

        {/* Category cards (Figma 104:315): overlapping, stepped layout on desktop */}
        <div
          className="@container mt-10 grid grid-cols-1 gap-8 px-5 sm:grid-cols-2 md:px-10 lg:relative lg:mt-[3px] lg:block lg:px-0 lg:[height:var(--h)]"
          // Women card: image 422.3 + gap 2.3 scale with width; the 106px label does not.
          style={{ '--h': `calc(${(422.295 / FRAME_W) * 100}cqw + ${AREA_H - 422.295}px)` } as React.CSSProperties}
        >
          {CATS.map((c, i) => (
            <motion.button
              key={c.label}
              type="button"
              onClick={() => shopWith(c.patch)}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              custom={i}
              className="group flex w-full flex-col text-left lg:absolute lg:[left:var(--x)] lg:[top:var(--t)] lg:[width:var(--w)]"
              style={{ '--x': pct(c.x), '--t': `${(c.top / FRAME_W) * 100}cqw`, '--w': pct(c.w) } as React.CSSProperties}
            >
              <span className="relative block w-full overflow-hidden mix-blend-multiply" style={{ aspectRatio: `${c.w} / ${c.imgH}` }}>
                <img
                  src={c.img}
                  alt={`${c.label} category`}
                  loading="lazy"
                  className="pointer-events-none absolute inset-0 size-full max-w-none object-cover transition-transform duration-300 ease-out group-hover:scale-[1.05]"
                />
              </span>

              {/* Category Label (Figma 104:258) */}
              <span
                className="flex flex-col items-start lg:[margin-top:var(--lg)] lg:[margin-left:var(--lx)] lg:[width:var(--lw)]"
                style={{ '--lg': `${c.labelGap}px`, '--lx': pct(c.labelX, c.w), '--lw': pct(c.labelW, c.w) } as React.CSSProperties}
              >
                <span className="flex w-full items-center justify-between">
                  <h3 className="text-[34px] font-bold leading-[50px] tracking-[-0.004em] whitespace-nowrap text-ink xl:text-[41px]">{c.label}</h3>
                  <span className="relative size-5 shrink-0 text-ink transition-colors duration-300 group-hover:text-purple" aria-hidden="true">
                    <span className="absolute inset-[29.17%]">
                      <span className="absolute inset-[-8%]"><MaskIcon src={`${DIR}/icon-arrow-up-right.svg`} /></span>
                    </span>
                  </span>
                </span>
                <span className="text-[17px] leading-[30px] whitespace-nowrap text-ink-2">{c.text}</span>
                <span className="text-[16px] leading-[26px] whitespace-nowrap text-[#716F73]">{countFor(c.patch)} styles</span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

function MaskIcon({ src }: { src: string }) {
  return <span className="figma-icon" style={{ '--icon': `url(${src})` } as React.CSSProperties} />;
}
