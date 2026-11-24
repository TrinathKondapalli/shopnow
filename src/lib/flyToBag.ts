import { prefersReducedMotion } from './utils';

/**
 * Add-to-bag feedback: a copy of the product image flies into the bag icon,
 * then the icon bounces. Uses the Web Animations API so it never blocks React.
 */
export function flyToBag(source: Element | null, delay = 0) {
  const bag = document.querySelector<HTMLElement>('[data-bag-target]');
  const bounce = () => {
    bag?.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 380, easing: 'ease-out' });
  };
  if (!bag || !source || prefersReducedMotion()) { window.setTimeout(bounce, delay); return; }
  const from = source.getBoundingClientRect();
  if (!from.width) { bounce(); return; }
  const to = bag.getBoundingClientRect();
  const clone = source.cloneNode(true) as HTMLElement;
  Object.assign(clone.style, {
    position: 'fixed', left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px`,
    margin: '0', zIndex: '120', pointerEvents: 'none', borderRadius: '16px', overflow: 'hidden', transformOrigin: 'center',
  });
  document.body.appendChild(clone);
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  const s = Math.max(0.08, 32 / Math.max(from.width, from.height));
  const anim = clone.animate(
    [
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 60}px) scale(${(1 + s) / 2})`, opacity: 0.85, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(${s})`, opacity: 0.2 },
    ],
    { duration: 700, delay, easing: 'cubic-bezier(.5,0,.3,1)', fill: 'both' },
  );
  anim.onfinish = () => { clone.remove(); bounce(); };
}
