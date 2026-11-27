import { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Gift, RotateCcw, Truck } from 'lucide-react';
import { AFFILIATE_PATH, linkHandler } from '../../lib/router';
import { prefersReducedMotion } from '../../lib/utils';

interface Message {
  id: string;
  icon: LucideIcon;
  /** Full text, shown from md up. */
  text: string;
  /** Short text for small screens so the bar stays one line. Defaults to `text`. */
  short?: string;
  href?: string;
}

const MESSAGES: Message[] = [
  { id: 'shipping', icon: Truck, text: 'Free shipping above ₹999' },
  { id: 'returns', icon: RotateCcw, text: '7-day easy returns' },
  {
    id: 'affiliate',
    icon: Gift,
    text: 'Join our affiliate program: earn 10% commission + win gold, silver & sarees →',
    short: 'Earn 10% + win gold →',
    href: AFFILIATE_PATH,
  },
];

const INTERVAL = 5000;

/**
 * One-line utility bar above the header. Rotates three messages every 5s with a fade.
 * Rotation pauses on hover or focus, stops for good once someone uses the arrows,
 * and never starts when the visitor prefers reduced motion.
 */
export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [manual, setManual] = useState(() => prefersReducedMotion());

  useEffect(() => {
    if (manual || hovered || focused) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % MESSAGES.length), INTERVAL);
    return () => window.clearTimeout(t);
  }, [index, manual, hovered, focused]);

  const step = (d: number) => { setManual(true); setIndex((i) => (i + d + MESSAGES.length) % MESSAGES.length); };
  const msg = MESSAGES[index];
  const Icon = msg.icon;

  const label = (
    <>
      <Icon size={18} strokeWidth={1.8} className={msg.href ? 'shrink-0 text-accent-dark' : 'shrink-0 text-accent-dark'} aria-hidden />
      {msg.short ? (
        <>
          <span className="truncate md:hidden">{msg.short}</span>
          <span className="hidden truncate md:inline">{msg.text}</span>
        </>
      ) : (
        <span className="truncate">{msg.text}</span>
      )}
    </>
  );

  return (
    <div
      className="relative z-50 bg-text text-text-inverse"
      role="region"
      aria-roledescription="carousel"
      aria-label="Store announcements"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false); }}
    >
      <div className="container-x flex h-11 items-center justify-between gap-1 md:h-12">
        <ArrowButton dir="prev" onClick={() => step(-1)} />
        <div className="relative flex min-w-0 flex-1 justify-center overflow-hidden" aria-live={manual ? 'polite' : 'off'} aria-atomic="true">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={msg.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex min-w-0 max-w-full items-center justify-center whitespace-nowrap text-[13px] font-medium md:text-[15px]"
            >
              {msg.href ? (
                <a
                  href={msg.href}
                  onClick={linkHandler(msg.href)}
                  className="flex min-h-11 min-w-0 items-center gap-2 font-semibold text-accent-dark underline-offset-4 hover:text-text-inverse hover:underline focus-visible:outline-accent-dark"
                >
                  {label}
                </a>
              ) : (
                <p className="flex min-w-0 items-center gap-2 text-text-inverse">{label}</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <ArrowButton dir="next" onClick={() => step(1)} />
      </div>
    </div>
  );
}

function ArrowButton({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
  const Icon = dir === 'prev' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 'prev' ? 'Previous announcement' : 'Next announcement'}
      className="-mx-2 grid size-11 shrink-0 place-items-center rounded-full text-dark-muted transition-colors hover:bg-text-inverse/10 hover:text-text-inverse focus-visible:outline-accent-dark"
    >
      <Icon size={18} strokeWidth={2} aria-hidden="true" />
    </button>
  );
}
