import type { ColorFamily, ExploreState, ExploreTab, PriceBand, SortKey } from '../types';
import { DEFAULT_EXPLORE, PRODUCTS, PRODUCT_TYPES, getProduct } from './catalog';

/**
 * Shareable links, kept in the URL hash so any static host works:
 *   #p/<product-id>[/<colour-index>]   opens that product's quick view
 *   #shop?tab=men&type=Hoodies,Jackets  restores the product grid filters
 * Every value read from a link is checked against the catalogue.
 */

const TABS: ExploreTab[] = ['all', 'men', 'women', 'new', 'sale'];
const SORTS: SortKey[] = ['featured', 'popular', 'newest', 'price-asc', 'price-desc'];
const PRICES: PriceBand[] = ['under-1000', '1000-1999', '2000-plus'];
const COLORS: ColorFamily[] = ['black', 'white', 'purple', 'grey', 'blue', 'green', 'neutral'];
const SIZES = [...new Set(PRODUCTS.flatMap((p) => p.sizes))];
const COLLECTIONS = [...new Set(PRODUCTS.flatMap((p) => p.collections))];

const LISTS = [
  ['types', 'type', PRODUCT_TYPES],
  ['sizes', 'size', SIZES],
  ['colors', 'color', COLORS],
  ['prices', 'price', PRICES],
] as const;

export function productHash(productId: string, color = 0) {
  return `#p/${productId}${color > 0 ? `/${color}` : ''}`;
}

export function hashToProduct(hash: string): { productId: string; color: number } | null {
  const m = /^#p\/([\w-]+)(?:\/(\d+))?$/.exec(hash);
  const p = m && getProduct(m[1]);
  if (!m || !p) return null;
  const color = Number(m[2] ?? 0);
  return { productId: p.id, color: color < p.colors.length ? color : 0 };
}

export function exploreToHash(e: ExploreState) {
  const parts: string[] = [];
  const add = (k: string, v: string) => parts.push(`${k}=${encodeURIComponent(v)}`);
  if (e.tab !== DEFAULT_EXPLORE.tab) add('tab', e.tab);
  if (e.query.trim()) add('q', e.query.trim());
  for (const [key, name] of LISTS) {
    const v = e[key] as readonly string[];
    if (v.length) parts.push(`${name}=${v.map(encodeURIComponent).join(',')}`);
  }
  if (e.collection) add('collection', e.collection);
  if (e.sort !== DEFAULT_EXPLORE.sort) add('sort', e.sort);
  return parts.length ? `#shop?${parts.join('&')}` : '';
}

export function hashToExplore(hash: string): Partial<ExploreState> | null {
  if (!hash.startsWith('#shop?')) return null;
  const q = new URLSearchParams(hash.slice('#shop?'.length));
  const out: Partial<ExploreState> = {};
  const tab = q.get('tab');
  if (tab && (TABS as string[]).includes(tab)) out.tab = tab as ExploreTab;
  const query = q.get('q');
  if (query) out.query = query.slice(0, 80);
  for (const [key, name, allowed] of LISTS) {
    const raw = q.get(name);
    if (!raw) continue;
    const vals = raw.split(',').filter((v) => (allowed as readonly string[]).includes(v));
    if (vals.length) (out as Record<string, unknown>)[key] = vals;
  }
  const collection = q.get('collection');
  if (collection && COLLECTIONS.includes(collection)) out.collection = collection;
  const sort = q.get('sort');
  if (sort && (SORTS as string[]).includes(sort)) out.sort = sort as SortKey;
  return out;
}
