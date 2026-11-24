import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ExploreState } from '../../types';
import { useShop } from '../../store/ShopProvider';

const MESSAGES: { text: string; cta: string; patch: Partial<ExploreState> }[] = [
  { text: 'Free shipping on orders above ₹999', cta: 'Shop now', patch: {} },
  { text: 'New season drop: Made for Every Move is live', cta: 'Explore', patch: { collection: 'move' } },
  { text: 'Mid-season sale: up to 30% off selected styles', cta: 'Shop sale', patch: { tab: 'sale' } },
];

/** 01. Promotional announcement that rotates every 5 seconds. */
export function AnnouncementBar() {
  const { shopWith } = useShop();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % MESSAGES.length), 5000);
    return () => window.clearInterval(t);
  }, [paused]);
  const m = MESSAGES[i];
  const go = (d: number) => setI((n) => (n + d + MESSAGES.length) % MESSAGES.length);

  return (
    <div
      className="relative z-50 bg-ink text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-label="Announcements"
    >
      <div className="container-x flex h-10 items-center justify-between gap-2 text-[13px]">
        <button type="button" onClick={() => go(-1)} className="grid size-8 place-items-center rounded-full text-white/70 hover:text-white" aria-label="Previous announcement">
          <ChevronLeft size={16} />
        </button>
        <div className="relative h-full flex-1 overflow-hidden" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={i}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center gap-2 truncate"
            >
              <span className="truncate">{m.text}</span>
              <button type="button" onClick={() => shopWith(m.patch)} className="shrink-0 font-semibold text-lav-300 underline underline-offset-4 hover:text-white">
                {m.cta}
              </button>
            </motion.p>
          </AnimatePresence>
        </div>
        <button type="button" onClick={() => go(1)} className="grid size-8 place-items-center rounded-full text-white/70 hover:text-white" aria-label="Next announcement">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
