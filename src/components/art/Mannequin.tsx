import type { Look, LookSlot } from '../../types';
import { getProduct } from '../../lib/catalog';
import { shade } from '../../lib/utils';
import { garmentShape } from './garments';

const BOX: Record<Exclude<LookSlot, 'feet'>, [number, number, number, number]> = {
  top: [34, 86, 172, 189],
  bottom: [52, 254, 136, 204],
  head: [86, 6, 68, 54],
};

/** Pin positions (percent of the figure box) for the hotspots in Shop the Look. */
export const PIN_POS: Record<LookSlot, [number, number]> = { top: [50, 31], bottom: [50, 68], feet: [40, 94], head: [50, 6.5] };

/** A dressed mannequin built from the products in a look. viewBox 240 x 500. */
export function Mannequin({ look, className }: { look: Look; className?: string }) {
  const skin = 'var(--color-bg-alt)';
  const limb = 'var(--color-border)';
  const parts = look.items.map((it) => ({ ...it, p: getProduct(it.productId) })).filter((x) => x.p);
  const feet = parts.find((x) => x.slot === 'feet');
  const shoeC = feet ? feet.p!.colors[feet.color].hex : 'var(--color-bg)';
  const sd = shade(shoeC, -0.25);
  const shoe = (x: number, flip: boolean) => (
    <g transform={`translate(${x} 0)${flip ? ' translate(56 0) scale(-1 1)' : ''}`}>
      <path d="M2 24 Q0 6 22 4 L46 4 Q56 6 56 24 Z" fill={shoeC} />
      <rect x="-2" y="20" width="62" height={feet?.p?.art === 'platform' ? 13 : 9} rx="4.5" fill="var(--color-bg)" />
      <path d="M2 24 H56" stroke={sd} strokeWidth="1.5" />
    </g>
  );
  const part = (slot: Exclude<LookSlot, 'feet'>) => {
    const x = parts.find((q) => q.slot === slot);
    if (!x) return null;
    const s = garmentShape(x.p!.art, x.p!.colors[x.color].hex);
    const [bx, by, bw, bh] = BOX[slot];
    return <svg x={bx} y={by} width={bw} height={bh} viewBox={`0 0 ${s.w} ${s.h}`} preserveAspectRatio="xMidYMin meet">{s.body}</svg>;
  };
  return (
    <svg viewBox="0 0 240 500" className={className} aria-hidden="true">
      <ellipse cx="120" cy="488" rx="80" ry="8" fill="var(--color-text)" opacity=".12" />
      <line x1="56" y1="108" x2="42" y2="264" stroke={limb} strokeWidth="17" strokeLinecap="round" />
      <line x1="184" y1="108" x2="198" y2="264" stroke={limb} strokeWidth="17" strokeLinecap="round" />
      <rect x="111" y="66" width="18" height="30" rx="8" fill={skin} />
      {look.figure === 'f' && <circle cx="120" cy="14" r="13" fill={limb} />}
      <ellipse cx="120" cy="46" rx="21" ry="27" fill={skin} />
      <rect x="84" y="430" width="28" height="30" rx="10" fill={limb} />
      <rect x="128" y="430" width="28" height="30" rx="10" fill={limb} />
      <g transform="translate(0 452)">{shoe(62, false)}{shoe(122, true)}</g>
      {part('bottom')}
      {part('top')}
      {part('head')}
    </svg>
  );
}
