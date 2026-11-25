import { motion } from 'motion/react';
import { Award, RotateCcw, Truck } from 'lucide-react';
import { fadeUp } from '../../lib/motion';

const ITEMS = [
  { icon: Truck, title: 'Free shipping', text: 'On every order above ₹999, delivered in 3 to 5 days.' },
  { icon: RotateCcw, title: 'Easy returns', text: '7-day returns and size exchanges, no questions asked.' },
  { icon: Award, title: 'Premium quality', text: 'Heavyweight cotton and fleece made to last for years.' },
];

/** 03. Shopping benefits: shipping, easy returns, quality. */
export function Benefits() {
  return (
    <section id="benefits" aria-labelledby="benefits-title" className="scroll-mt-16 md:scroll-mt-20 border-y border-[#EBE5E1] bg-[#FAF5F0]">
      <h2 id="benefits-title" className="sr-only">Why shop with SHOPNOW</h2>
      <div className="container-x grid gap-px sm:grid-cols-3">
        {ITEMS.map(({ icon: Icon, title, text }, i) => (
          <motion.div
            key={title}
            className="flex items-start gap-4 py-8 sm:px-6 sm:py-10 sm:first:pl-0"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            custom={i}
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-[3px] bg-white border border-[#EBE5E1] text-purple shadow-xs"><Icon size={22} strokeWidth={1.8} /></span>
            <div>
              <h3 className="font-['Inter'] font-semibold text-ink text-[16.5px]">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-[#6D6C77]">{text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
