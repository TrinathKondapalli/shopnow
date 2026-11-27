import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';
import type { Toast } from '../../types';
import { cn } from '../../lib/utils';
import { DUR, EASE } from '../../lib/motion';
import { useShop } from '../../store/ShopProvider';

const ICON = { success: CircleCheck, info: Info, error: CircleAlert };
const TOAST_MS = 4000;

/** Toast notifications: slide and fade, 250ms. Each stays 4 seconds; hovering or focusing it pauses the timer. */
export function Toaster() {
  const { toasts } = useShop();
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[110] flex flex-col items-center gap-2 p-4 pt-[max(1rem,env(safe-area-inset-top))] sm:top-auto sm:bottom-0 sm:items-start sm:pt-4 sm:pb-[max(1rem,env(safe-area-inset-bottom))] sm:pl-[max(1rem,env(safe-area-inset-left))]"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => <ToastItem key={t.id} t={t} />)}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ t }: { t: Toast }) {
  const { dismissToast } = useShop();
  const [paused, setPaused] = useState(false);
  const remaining = useRef(TOAST_MS);
  const startedAt = useRef(0);

  useEffect(() => {
    if (paused) return;
    startedAt.current = Date.now();
    const timer = window.setTimeout(() => dismissToast(t.id), remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current = Math.max(800, remaining.current - (Date.now() - startedAt.current));
    };
  }, [paused, t.id, dismissToast]);

  const Icon = ICON[t.tone];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: DUR.toast, ease: EASE }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-[var(--radius-card)] bg-text p-4 text-text-inverse shadow-[var(--shadow-pop)]"
    >
      <Icon size={20} className={cn('shrink-0 self-start', t.tone === 'success' ? 'text-accent-dark' : t.tone === 'error' ? 'text-accent-dark' : 'text-accent-dark')} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{t.title}</p>
        {t.description && <p className="mt-0.5 truncate text-[13px] text-dark-muted">{t.description}</p>}
      </div>
      {t.action && (
        <button
          type="button"
          onClick={() => { t.action!.onClick(); dismissToast(t.id); }}
          className="min-h-11 shrink-0 px-1 text-sm font-semibold text-accent-dark underline underline-offset-4 hover:text-text-inverse focus-visible:outline-accent-dark"
        >
          {t.action.label}
        </button>
      )}
      <button type="button" onClick={() => dismissToast(t.id)} className="-my-2 -mr-2 grid size-11 shrink-0 place-items-center rounded-full text-dark-muted hover:text-text-inverse focus-visible:outline-accent-dark" aria-label="Dismiss notification">
        <X size={16} />
      </button>
    </motion.div>
  );
}
