import { useRef, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { DUR, EASE } from '../../lib/motion';
import { useDialog, useLockBodyScroll } from '../../hooks/useOverlay';

interface Props {
  title: string;
  count?: number;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  top?: ReactNode;
  returnFocusTo?: string;
}

/** Slide-out panel from the right (350ms), shared by the bag and wishlist. Render inside <AnimatePresence>. */
export function Drawer({ title, count, onClose, children, footer, top, returnFocusTo }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useLockBodyScroll(true);
  useDialog(ref, true, onClose, undefined, returnFocusTo);
  return (
    <div className="fixed inset-0 z-[85]">
      <motion.div className="absolute inset-0 bg-text/45 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: DUR.drawer }} onClick={onClose} />
      <motion.aside
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col rounded-l-[var(--radius-modal)] bg-bg shadow-[var(--shadow-pop)]"
        style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)', paddingRight: 'env(safe-area-inset-right)' }}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: DUR.drawer, ease: EASE }}
      >
        <div className="flex items-center justify-between px-5 pb-3 pt-5">
          <h2 className="display text-[28px] text-text">{title}{count ? <span className="ml-2 font-sans text-base font-semibold text-text-muted tabular-nums">({count})</span> : null}</h2>
          <button type="button" className="icon-btn -mr-2" onClick={onClose} aria-label={`Close ${title.toLowerCase()}`}><X size={20} /></button>
        </div>
        {top}
        <div className="flex-1 overflow-y-auto px-5">{children}</div>
        {footer && <div className="max-h-[60vh] overflow-y-auto border-t border-border px-5 pb-5 pt-4">{footer}</div>}
      </motion.aside>
    </div>
  );
}
