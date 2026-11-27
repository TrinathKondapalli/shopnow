import type { Product } from '../types';

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9₹\s-]/g, ' ').replace(/\s+/g, ' ').trim();

// Words people type that mean the same thing as our product types.
const SYNONYMS: Record<string, string> = {
  sari: 'saree', saris: 'saree', sarees: 'saree', saree: 'saree', kurtas: 'kurta', kurti: 'kurti', kurtis: 'kurti',
  lehnga: 'lehenga', lehengas: 'lehenga', lengha: 'lehenga', nehru: 'nehru', bandhgala: 'bandhgala', dupattas: 'dupatta',
  tshirt: 't-shirts', tshirts: 't-shirts', 't-shirt': 't-shirts', tee: 't-shirts', tees: 't-shirts',
  hoody: 'hoodies', hoodie: 'hoodies', sweatshirt: 'sweatshirts', jumper: 'sweatshirts',
  pants: 'bottoms', trousers: 'bottoms', jeans: 'jeans', cargo: 'cargo', joggers: 'joggers',
  shoes: 'footwear', shoe: 'footwear', sneaker: 'sneakers', jacket: 'jackets', hat: 'hat',
  purple: 'purple', lilac: 'lilac', lavender: 'lavender', woman: 'women', womens: 'women', man: 'men', mens: 'men',
};

function haystack(p: Product) {
  return norm([p.name, p.type, p.gender === 'unisex' ? 'men women unisex' : p.gender, ...p.colors.map((c) => `${c.name} ${c.family}`), ...p.tags].join(' '));
}

const HAY = new WeakMap<Product, string>();
const hay = (p: Product) => { let h = HAY.get(p); if (!h) { h = haystack(p); HAY.set(p, h); } return h; };

/** Ranked search: every typed word must match somewhere; name matches score highest. */
export function searchProducts(query: string, list: Product[]): Product[] {
  const words = norm(query).split(' ').filter(Boolean);
  if (!words.length) return list;
  const scored: { p: Product; score: number }[] = [];
  for (const p of list) {
    const h = hay(p);
    const name = norm(p.name);
    let score = 0;
    let ok = true;
    for (const raw of words) {
      const w = SYNONYMS[raw] ?? raw;
      const alt = raw;
      const inName = name.includes(w) || name.includes(alt);
      const inHay = h.includes(w) || h.includes(alt) || (w.endsWith('s') && h.includes(w.slice(0, -1)));
      if (!inName && !inHay) { ok = false; break; }
      score += inName ? (name.startsWith(alt) ? 6 : 4) : 1;
    }
    if (ok) scored.push({ p, score: score + p.popularity / 100 });
  }
  return scored.sort((a, b) => b.score - a.score).map((x) => x.p);
}

/** Keyword suggestions (types, colours, names) that start with or contain the query. */
export function suggest(query: string, products: Product[], limit = 5): string[] {
  const q = norm(query);
  if (!q) return [];
  const pool = new Set<string>();
  for (const p of products) {
    pool.add(p.name);
    pool.add(p.type);
    p.colors.forEach((c) => pool.add(`${c.name} ${p.type.toLowerCase()}`));
    p.tags.forEach((t) => pool.add(t));
  }
  const starts: string[] = [];
  const contains: string[] = [];
  for (const term of pool) {
    const t = norm(term);
    if (t === q) continue;
    if (t.startsWith(q)) starts.push(term);
    else if (t.includes(q)) contains.push(term);
  }
  const byLen = (a: string, b: string) => a.length - b.length;
  return [...starts.sort(byLen), ...contains.sort(byLen)].slice(0, limit);
}

/** Splits text so the matched part can be highlighted. */
export function highlight(text: string, query: string): { text: string; hit: boolean }[] {
  const q = query.trim();
  if (!q) return [{ text, hit: false }];
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return [{ text, hit: false }];
  return [
    { text: text.slice(0, i), hit: false },
    { text: text.slice(i, i + q.length), hit: true },
    { text: text.slice(i + q.length), hit: false },
  ].filter((x) => x.text);
}
