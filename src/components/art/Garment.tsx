import { useId } from 'react';
import type { ArtKind } from '../../types';
import { garmentShape } from './garments';

export type GarmentView = 'front' | 'alt' | 'detail';

interface Props {
  kind: ArtKind;
  color: string;
  view?: GarmentView;
  className?: string;
}

/** One illustrated garment. `alt` hangs it (or tilts accessories); `detail` zooms in on the fabric. */
export function Garment({ kind, color, view = 'front', className }: Props) {
  const id = useId().replace(/:/g, '');
  const s = garmentShape(kind, color);
  const hangable = !!s.hang && view === 'alt';
  const off = hangable ? 46 : 0;

  if (view === 'detail') {
    const vw = s.w * 0.55;
    const vh = s.h * 0.5;
    return (
      <svg viewBox={`${s.w * 0.22} ${s.h * 0.12} ${vw} ${vh}`} className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id={`weave-${id}`} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <rect width="4" height="4" fill="transparent" />
            <path d="M0 0 V4" stroke="var(--color-text)" strokeOpacity=".07" strokeWidth="1.2" />
          </pattern>
        </defs>
        {s.body}
        <rect x="0" y="0" width={s.w} height={s.h} fill={`url(#weave-${id})`} />
      </svg>
    );
  }

  if (view === 'alt' && !hangable) {
    return (
      <svg viewBox={`-20 -20 ${s.w + 40} ${s.h + 40}`} className={className} aria-hidden="true">
        <g transform={`rotate(-9 ${s.w / 2} ${s.h / 2})`}>{s.body}</g>
      </svg>
    );
  }

  return (
    <svg viewBox={`0 0 ${s.w} ${s.h + off}`} className={className} aria-hidden="true">
      {hangable && s.hang && (
        <g stroke="var(--color-text-muted)" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M100 30 V21 Q100 8 112 8 Q122 8 122 17" />
          <path d={`M100 30 L${s.hang[0]} ${s.hang[1] + off} M100 30 L${s.w - s.hang[0]} ${s.hang[1] + off}`} />
        </g>
      )}
      {off ? <g transform={`translate(0 ${off})`}>{s.body}</g> : s.body}
    </svg>
  );
}
