import type { ReactNode } from 'react';
import type { ArtKind } from '../../types';
import { isLight, shade } from '../../lib/utils';

/**
 * Illustrated garments used in place of product photography.
 * Each shape returns its own viewBox size and, for tops and bottoms, the two points a hanger hooks onto.
 * Swap in real photos with `images` on a product colour in products.json.
 */
export interface Shape { w: number; h: number; hang?: [number, number]; body: ReactNode }

const SH = '#000';

export function garmentShape(kind: ArtKind, c: string): Shape {
  const d = shade(c, -0.2);
  const mark = isLight(c) ? '#1F1F25' : '#FFFFFF';
  const collar = <path d="M72 22 Q100 52 128 22 Q124 32 118 36 Q100 54 82 36 Q76 32 72 22 Z" fill={d} />;
  switch (kind) {
    case 'tee':
      return { w: 200, h: 220, hang: [66, 26], body: <>
        <path d="M72 22 Q100 44 128 22 L170 42 L190 88 L158 100 L150 84 L150 198 Q100 208 50 198 L50 84 L42 100 L10 88 L30 42 Z" fill={c} />
        <path d="M128 22 L170 42 L190 88 L158 100 L150 84 L150 198 Q132 202 128 201 Z" fill={SH} opacity=".07" />
        <path d="M62 150 Q100 160 138 150" stroke={SH} strokeOpacity=".08" strokeWidth="2" fill="none" />
        {collar}
      </> };
    case 'longsleeve':
      return { w: 200, h: 220, hang: [66, 26], body: <>
        <path d="M72 22 Q100 44 128 22 L170 40 L192 168 L160 176 L150 92 L150 198 Q100 208 50 198 L50 92 L40 176 L8 168 L30 40 Z" fill={c} />
        <path d="M128 22 L170 40 L192 168 L160 176 L150 92 L150 198 Q132 202 128 201 Z" fill={SH} opacity=".07" />
        <path d="M165 110 L176 108 M167 122 L178 120 M169 134 L180 132" stroke={mark} strokeOpacity=".55" strokeWidth="3" strokeLinecap="round" />
        <rect x="84" y="70" width="32" height="10" rx="2" fill={mark} opacity=".5" />
        {collar}
      </> };
    case 'sweat':
      return { w: 200, h: 220, hang: [66, 26], body: <>
        <path d="M72 22 Q100 44 128 22 L170 40 L192 168 L160 176 L150 92 L150 198 Q100 208 50 198 L50 92 L40 176 L8 168 L30 40 Z" fill={c} />
        <path d="M128 22 L170 40 L192 168 L160 176 L150 92 L150 198 Q132 202 128 201 Z" fill={SH} opacity=".07" />
        <path d="M8 168 L40 176 L37 191 L5 183 Z M192 168 L160 176 L163 191 L195 183 Z M50 198 Q100 208 150 198 L150 209 Q100 219 50 209 Z" fill={d} />
        {collar}
      </> };
    case 'hoodie':
    case 'cropped-hoodie': {
      const crop = kind === 'cropped-hoodie';
      const hem = crop ? 160 : 200;
      return { w: 200, h: 220, hang: [70, 38], body: <>
        <path d="M62 30 Q100 -6 138 30 L134 58 Q100 70 66 58 Z" fill={d} />
        <path d={`M64 46 L34 62 L10 172 L40 178 L50 96 L50 ${hem} Q100 ${hem + 10} 150 ${hem} L150 96 L160 178 L190 172 L166 62 L136 46 Q100 66 64 46 Z`} fill={c} />
        <path d={`M136 46 L166 62 L190 172 L160 178 L150 96 L150 ${hem} Q132 ${hem + 4} 128 ${hem + 3} Z`} fill={SH} opacity=".07" />
        <path d="M72 50 Q100 76 128 50 Q100 38 72 50 Z" fill={SH} opacity=".28" />
        {!crop && <path d="M66 150 L134 150 L142 186 L58 186 Z" fill={SH} opacity=".09" />}
        <path d="M90 68 L88 104 M110 68 L112 104" stroke="#fff" strokeOpacity=".75" strokeWidth="2.4" strokeLinecap="round" />
        <path d={`M10 172 L40 178 L37 192 L7 186 Z M190 172 L160 178 L163 192 L193 186 Z M50 ${hem} Q100 ${hem + 10} 150 ${hem} L150 ${hem + 10} Q100 ${hem + 20} 50 ${hem + 10} Z`} fill={d} />
      </> };
    }
    case 'jacket':
      return { w: 200, h: 220, hang: [68, 36], body: <>
        <path d="M60 40 L28 56 L6 168 L38 176 L50 94 L50 202 L150 202 L150 94 L162 176 L194 168 L172 56 L140 40 L100 66 Z" fill={c} />
        <path d="M140 40 L172 56 L194 168 L162 176 L150 94 L150 202 L104 202 L104 70 Z" fill={SH} opacity=".07" />
        <path d="M66 30 L100 62 L134 30 L148 42 L100 76 L52 42 Z" fill={d} />
        <path d="M100 72 V202" stroke="#fff" strokeOpacity=".6" strokeWidth="2.2" />
        <path d="M62 142 H90 V172 H62 Z M110 142 H138 V172 H110 Z" fill={SH} opacity=".11" />
        <path d="M6 168 L38 176 L35 190 L3 182 Z M194 168 L162 176 L165 190 L197 182 Z" fill={d} />
      </> };
    case 'bomber':
      return { w: 200, h: 220, hang: [68, 34], body: <>
        <path d="M64 34 Q100 52 136 34 L172 54 L192 164 L162 172 L152 96 L152 188 Q100 196 48 188 L48 96 L38 172 L8 164 L28 54 Z" fill={c} />
        <path d="M136 34 L172 54 L192 164 L162 172 L152 96 L152 188 Q126 192 104 192 L104 48 Z" fill={SH} opacity=".08" />
        <path d="M64 34 Q100 52 136 34 L134 44 Q100 62 66 44 Z" fill={d} />
        <path d="M48 188 Q100 196 152 188 L152 204 Q100 212 48 204 Z M8 164 L38 172 L35 188 L5 180 Z M192 164 L162 172 L165 188 L195 180 Z" fill={d} />
        <path d="M100 50 V196" stroke={mark} strokeOpacity=".5" strokeWidth="2" />
        <path d="M30 70 L44 150 M170 70 L156 150" stroke={mark} strokeOpacity=".35" strokeWidth="3" />
      </> };
    case 'cargo':
      return { w: 200, h: 300, hang: [58, 18], body: <>
        <path d="M50 6 H150 L158 62 L168 292 H112 L100 100 L88 292 H32 L42 62 Z" fill={c} />
        <path d="M100 100 L112 292 H168 L158 62 L150 6 H100 Z" fill={SH} opacity=".07" />
        <path d="M50 6 H150 V24 H50 Z" fill={d} />
        <path d="M100 24 V100" stroke={SH} strokeOpacity=".12" strokeWidth="2" />
        <path d="M37 150 H73 V202 H35 Z M127 150 H163 V202 H165 Z" fill={SH} opacity=".1" />
        <path d="M32 274 H88 V292 H32 Z M112 274 H168 V292 H112 Z" fill={d} />
      </> };
    case 'jeans':
      return { w: 200, h: 300, hang: [58, 18], body: <>
        <path d="M50 6 H150 L158 60 L166 292 H110 L100 106 L90 292 H34 L42 60 Z" fill={c} />
        <path d="M100 106 L110 292 H166 L158 60 L150 6 H100 Z" fill={SH} opacity=".07" />
        <path d="M50 6 H150 V22 H50 Z" fill={d} />
        <path d="M100 22 V106 M56 28 Q64 52 86 54 M144 28 Q136 52 114 54 M36 276 H90 M110 276 H164" stroke="#fff" strokeOpacity=".4" strokeWidth="2" fill="none" strokeDasharray="4 3" />
      </> };
    case 'wide':
      return { w: 200, h: 300, hang: [58, 18], body: <>
        <path d="M50 6 H150 L162 60 L186 292 H110 L100 106 L90 292 H14 L38 60 Z" fill={c} />
        <path d="M100 106 L110 292 H186 L162 60 L150 6 H100 Z" fill={SH} opacity=".07" />
        <path d="M50 6 H150 V22 H50 Z" fill={d} />
        <path d="M100 22 V106 M56 28 Q64 52 86 54 M144 28 Q136 52 114 54 M16 276 H90 M110 276 H184" stroke="#fff" strokeOpacity=".4" strokeWidth="2" fill="none" strokeDasharray="4 3" />
      </> };
    case 'cap':
      return { w: 200, h: 160, body: <>
        <path d="M34 112 Q34 30 100 30 Q166 30 166 112 Z" fill={c} />
        <path d="M100 30 V112 M66 36 Q58 80 62 112 M134 36 Q142 80 138 112" stroke={SH} strokeOpacity=".12" strokeWidth="2" fill="none" />
        <path d="M24 114 Q100 92 176 114 Q168 144 100 144 Q32 144 24 114 Z" fill={d} />
        <circle cx="100" cy="30" r="6" fill={d} />
      </> };
    case 'bucket':
      return { w: 200, h: 150, body: <>
        <path d="M56 40 Q100 22 144 40 L154 96 H46 Z" fill={c} />
        <path d="M100 30 Q124 30 144 40 L154 96 H104 Z" fill={SH} opacity=".07" />
        <path d="M20 108 Q100 82 180 108 Q170 130 100 132 Q30 130 20 108 Z" fill={d} />
        <path d="M48 84 Q100 74 152 84" stroke={SH} strokeOpacity=".15" strokeWidth="3" fill="none" />
      </> };
    case 'shoe':
    case 'platform': {
      const plat = kind === 'platform';
      const sole = plat ? 18 : 12;
      return { w: 200, h: 100 + (plat ? 8 : 0), body: <>
        <path d="M16 78 V54 Q16 46 26 46 L58 48 Q68 48 74 40 L94 24 Q102 20 110 24 L124 38 Q150 42 178 60 Q190 68 188 78 Z" fill={c} />
        <path d="M110 24 L124 38 Q150 42 178 60 Q190 68 188 78 H120 Z" fill={SH} opacity=".07" />
        <rect x="14" y="78" width="176" height={sole} rx="6" fill="#fff" stroke={SH} strokeOpacity=".12" />
        <path d="M84 36 L100 46 M94 30 L110 40 M104 28 L118 38" stroke={isLight(c) ? '#8C8C99' : '#fff'} strokeOpacity=".9" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M16 62 Q40 58 62 66" stroke={d} strokeWidth="3" fill="none" />
        {!plat && <path d="M120 58 Q140 50 160 62" stroke="#7B2FF7" strokeOpacity=".6" strokeWidth="4" fill="none" strokeLinecap="round" />}
      </> };
    }
    case 'tote':
      return { w: 200, h: 220, body: <>
        <path d="M70 70 Q70 18 100 18 Q130 18 130 70" stroke={d} strokeWidth="9" fill="none" />
        <path d="M36 66 H164 L172 210 H28 Z" fill={c} />
        <path d="M100 66 H164 L172 210 H100 Z" fill={SH} opacity=".06" />
        <text x="100" y="150" textAnchor="middle" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="20" fill={mark} opacity=".75" letterSpacing="-1">SHOP<tspan fill="#7B2FF7">NOW</tspan></text>
      </> };
  }
}
