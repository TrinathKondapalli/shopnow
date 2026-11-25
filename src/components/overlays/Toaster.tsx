import { AnimatePresence, motion } from 'motion/react';
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { DUR, EASE } from '../../lib/motion';
import { useShop } from '../../store/ShopProvider';

const ICON = { success: CircleCheck, info: Info, error: CircleAlert };

/** Toast notifications: slide and fade, 250ms. */
export function Toaster() {
  const { toasts, dismissToast } = useShop();
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[110] flex flex-col items-center gap-2 p-4 pt-[max(1rem,env(safe-area-inset-top))] sm:top-auto sm:bottom-0 sm:items-start sm:pt-4 sm:pb-[max(1rem,env(safe-area-inset-bottom))] sm:pl-[max(1rem,env(safe-area-inset-left))]"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const Icon = ICON[t.tone];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: DUR.toast, ease: EASE }}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl bg-ink p-4 text-white shadow-[var(--shadow-pop)]"
            >
              <Icon size={20} className={cn('mt-0.5 shrink-0', t.tone === 'success' ? 'text-[#86EFAC]' : t.tone === 'error' ? 'text-[#FCA5A5]' : 'text-lav-300')} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{t.title}</p>
                {t.description && <p className="mt-0.5 truncate text-[13px] text-white/70">{t.description}</p>}
              </div>
              {t.action && (
                <button type="button" onClick={() => { t.action!.onClick(); dismissToast(t.id); }} className="shrink-0 text-sm font-semibold text-lav-300 underline underline-offset-4 hover:text-white">
                  {t.action.label}
                </button>
              )}
              <button type="button" onClick={() => dismissToast(t.id)} className="-m-1 grid size-7 shrink-0 place-items-center rounded-full text-white/50 hover:text-white" aria-label="Dismiss notification">
                <X size={15} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
