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
    <section aria-labelledby="benefits-title" className="border-y border-line bg-white">
      <h2 id="benefits-title" className="sr-only">Why shop with SHOPNOW</h2>
      <div className="container-x grid gap-px sm:grid-cols-3">
        {ITEMS.map(({ icon: Icon, title, text }, i) => (
          <motion.div
            key={title}
            className="flex items-start gap-4 py-6 sm:px-6 sm:py-8 sm:first:pl-0"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            custom={i}
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-lav-100 text-electric-600"><Icon size={22} strokeWidth={1.8} /></span>
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
