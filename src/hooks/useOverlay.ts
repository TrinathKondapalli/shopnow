import { useEffect, useRef, type RefObject } from 'react';

let locks = 0;

/** Locks page scroll while an overlay is open. Supports several overlays at once. */
export function useLockBodyScroll(active: boolean) {
  useEffect(() => {
    if (!active) return;
    locks += 1;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.paddingRight = gap ? `${gap}px` : '';
    return () => {
      locks -= 1;
      if (locks === 0) {
        document.documentElement.style.overflow = '';
        document.body.style.paddingRight = '';
      }
    };
  }, [active]);
}

// Open dialogs, newest last. Only the top one reacts to Escape and Tab.
const stack: object[] = [];

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Keeps keyboard focus inside a dialog, closes it on Escape,
 * and returns focus to whatever opened it.
 */
export function useDialog(ref: RefObject<HTMLElement | null>, active: boolean, onClose: () => void, initialFocus?: RefObject<HTMLElement | null>, fallbackFocus?: string) {
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    if (!active) return;
    const opener = document.activeElement as HTMLElement | null;
    const node = ref.current;
    const token = {};
    stack.push(token);
    const t = window.setTimeout(() => {
      (initialFocus?.current ?? ref.current?.querySelector<HTMLElement>(FOCUSABLE) ?? ref.current)?.focus();
    }, 40);
    const onKey = (e: KeyboardEvent) => {
      if (stack[stack.length - 1] !== token) return;
      if (e.key === 'Escape') { e.stopPropagation(); close.current(); return; }
      if (e.key !== 'Tab' || !ref.current) return;
      const items = [...ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      stack.splice(stack.indexOf(token), 1);
      // Give focus back to the opener, unless another dialog has already taken it.
      const now = document.activeElement;
      const free = !now || now === document.body || (node?.contains(now) ?? false);
      if (free) {
        if (opener && opener !== document.body && document.contains(opener)) {
          opener.focus({ preventScroll: true });
        } else if (fallbackFocus) {
          document.querySelector<HTMLElement>(fallbackFocus)?.focus({ preventScroll: true });
        }
      }
    };
  }, [active, ref, initialFocus, fallbackFocus]);
}
