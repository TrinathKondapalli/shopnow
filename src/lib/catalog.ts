import productsJson from '../data/products.json';
import looksJson from '../data/looks.json';
import reviewsJson from '../data/reviews.json';
import type { ColorFamily, ExploreState, ExploreTab, Look, PriceBand, Product, ProductType, Review, SortKey } from '../types';
import { searchProducts } from './search';

export const PRODUCTS = productsJson as unknown as Product[];
export const LOOKS = looksJson as unknown as Look[];
export const REVIEWS = reviewsJson as unknown as Review[];

const MAP = new Map(PRODUCTS.map((p) => [p.id, p]));
export const getProduct = (id: string) => MAP.get(id);

const ALL_TYPES: ProductType[] = [
  'Kurtas', 'Kurtis', 'Sarees', 'Lehengas', 'Nehru Jackets', 'Ethnic Sets', 'Dupattas',
  'T-Shirts', 'Hoodies', 'Sweatshirts', 'Jackets', 'Bottoms', 'Footwear', 'Accessories',
];

/** Product types that actually have products. Empty categories are never shown in nav, filters or chips. */
export const PRODUCT_TYPES: ProductType[] = ALL_TYPES.filter((t) => PRODUCTS.some((p) => p.type === t));

export const ETHNIC_TYPES: ProductType[] = ['Kurtas', 'Kurtis', 'Sarees', 'Lehengas', 'Nehru Jackets', 'Ethnic Sets', 'Dupattas'];

/** Customer-facing label for a product type. */
export const TYPE_LABEL: Partial<Record<ProductType, string>> = {
  Kurtis: 'Kurtis & Sets',
};
export const typeLabel = (t: ProductType) => TYPE_LABEL[t] ?? t;

const inGender = (p: Product, g: 'men' | 'women') => p.gender === g || p.gender === 'unisex';
export const countProducts = (g: 'men' | 'women' | null, t?: ProductType) =>
  PRODUCTS.filter((p) => (!g || inGender(p, g)) && (!t || p.type === t)).length;

export interface NavLink { label: string; patch: Partial<ExploreState> }
export interface NavGroup { id: 'men' | 'women'; label: string; links: NavLink[] }

/**
 * The one navigation source shared by the desktop nav, the All Categories mega menu and the mobile menu.
 * Each group lists its sub-categories in a fixed order and drops any that have no products.
 */
const NAV_WANTED: Record<'men' | 'women', ProductType[]> = {
  men: ['Kurtas', 'Nehru Jackets', 'Ethnic Sets', 'Accessories'],
  women: ['Sarees', 'Kurtis', 'Lehengas', 'Dupattas'],
};
export const NAV_GROUPS: NavGroup[] = (['men', 'women'] as const).map((g) => ({
  id: g,
  label: g === 'men' ? 'Men' : 'Women',
  links: NAV_WANTED[g]
    .filter((t) => countProducts(g, t) > 0)
    .map((t) => ({ label: typeLabel(t), patch: { tab: g, types: [t] } as Partial<ExploreState> })),
}));

/** Top-level destinations after Men and Women. */
export const NAV_EXTRAS: NavLink[] = [
  { label: 'New Arrivals', patch: { tab: 'new' } },
  { label: 'Festive Edit', patch: { tab: 'festive' } },
  { label: 'Sale', patch: { tab: 'sale' } },
];

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '38', '40', '42', '44', '46', '28', '30', '32', '34', '36', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'];
const sizeRank = (s: string) => { const i = SIZE_ORDER.indexOf(s); return i < 0 ? 999 : i; };
const ALL_SIZES = [...new Set(PRODUCTS.flatMap((p) => p.sizes))];
const groupOf = (z: string, p: Product) =>
  /^(XXS|XS|S|M|L|XL|XXL|XXXL)$/.test(z) ? 'Clothing'
    : z.startsWith('UK') ? 'Shoes'
      : /^\d+$/.test(z) ? (p.type === 'Bottoms' ? 'Waist' : 'Chest')
        : 'One size';

/** Size filter options built from the real product sizes (never a hard-coded list). */
export const SIZE_GROUPS: { label: string; sizes: string[] }[] = ['Clothing', 'Chest', 'Waist', 'Shoes', 'One size']
  .map((label) => ({
    label,
    sizes: ALL_SIZES.filter((z) => PRODUCTS.some((p) => p.sizes.includes(z) && groupOf(z, p) === label)).sort((a, b) => sizeRank(a) - sizeRank(b) || a.localeCompare(b)),
  }))
  .filter((g) => g.sizes.length > 0);

const ALL_COLOR_FAMILIES: { id: ColorFamily; label: string; swatch: string }[] = [
  { id: 'black', label: 'Black', swatch: '#1F1F25' },
  { id: 'white', label: 'White', swatch: '#F4F4F6' },
  { id: 'red', label: 'Red', swatch: '#B3263A' },
  { id: 'pink', label: 'Pink', swatch: '#D63F8C' },
  { id: 'yellow', label: 'Yellow', swatch: '#D9A520' },
  { id: 'purple', label: 'Purple', swatch: '#9B6BFF' },
  { id: 'blue', label: 'Blue', swatch: '#3F5C96' },
  { id: 'green', label: 'Green', swatch: '#3E7D55' },
  { id: 'grey', label: 'Grey', swatch: '#8C8C99' },
  { id: 'neutral', label: 'Neutral', swatch: '#D9C7A6' },
];
/** Colour filter options that at least one product actually comes in. */
export const COLOR_FAMILIES = ALL_COLOR_FAMILIES.filter((c) => PRODUCTS.some((p) => p.colors.some((x) => x.family === c.id)));

export const PRICE_BANDS: { id: PriceBand; label: string; test: (n: number) => boolean }[] = [
  { id: 'under-1000', label: 'Under ₹1,000', test: (n) => n < 1000 },
  { id: '1000-1999', label: '₹1,000 – ₹1,999', test: (n) => n >= 1000 && n < 2000 },
  { id: '2000-plus', label: '₹2,000 and above', test: (n) => n >= 2000 },
];

export const SORTS: { id: SortKey; label: string }[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'popular', label: 'Most popular' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
];

export const TABS: { id: ExploreTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'men', label: 'Men' },
  { id: 'women', label: 'Women' },
  { id: 'ethnic', label: 'Ethnic Wear' },
  { id: 'festive', label: 'Festive Edit' },
  { id: 'new', label: 'New Arrivals' },
  { id: 'sale', label: 'Sale' },
];

export const COLLECTIONS: Record<string, string> = {
  ethnic: 'Ethnic Edit',
  festive: 'Festive Edit',
  move: 'Made for Every Move',
  essentials: 'The Essentials',
};

export const DEFAULT_EXPLORE: ExploreState = {
  tab: 'all', query: '', types: [], sizes: [], colors: [], prices: [], collection: null, sort: 'featured',
};

export const stockFor = (p: Product, color: number, size: string) => p.stock[p.colors[color]?.name ?? '']?.[size] ?? 0;
export const colorStock = (p: Product, color: number) => p.sizes.reduce((s, size) => s + stockFor(p, color, size), 0);
export const isSoldOut = (p: Product) => p.colors.every((_, i) => colorStock(p, i) === 0);
export const discountPct = (p: Product) => (p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0);
export const LOW_STOCK = 3;

export function matchesTab(p: Product, tab: ExploreTab) {
  switch (tab) {
    case 'men': return p.gender !== 'women';
    case 'women': return p.gender !== 'men';
    case 'ethnic': return p.collections.includes('ethnic') || ETHNIC_TYPES.includes(p.type);
    case 'festive': return p.collections.includes('festive') || p.tags.includes('festive');
    case 'new': return p.isNew;
    case 'sale': return !!p.compareAt;
    default: return true;
  }
}

export function applyExplore(s: ExploreState): Product[] {
  let list = PRODUCTS.filter((p) => matchesTab(p, s.tab));
  if (s.collection) list = list.filter((p) => p.collections.includes(s.collection!));
  if (s.query.trim()) list = searchProducts(s.query, list);
  if (s.types.length) list = list.filter((p) => s.types.includes(p.type));
  if (s.sizes.length) list = list.filter((p) => p.sizes.some((z) => s.sizes.includes(z) && p.colors.some((_, i) => stockFor(p, i, z) > 0)));
  if (s.colors.length) list = list.filter((p) => p.colors.some((c) => s.colors.includes(c.family)));
  if (s.prices.length) list = list.filter((p) => PRICE_BANDS.some((b) => s.prices.includes(b.id) && b.test(p.price)));
  const sorted = [...list];
  switch (s.sort) {
    case 'popular': sorted.sort((a, b) => b.popularity - a.popularity); break;
    case 'newest': sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
    case 'price-asc': sorted.sort((a, b) => a.price - b.price); break;
    case 'price-desc': sorted.sort((a, b) => b.price - a.price); break;
    default: if (!s.query.trim()) sorted.sort((a, b) => a.featured - b.featured);
  }
  return sorted;
}

export const activeFilterCount = (s: ExploreState) =>
  s.types.length + s.sizes.length + s.colors.length + s.prices.length + (s.collection ? 1 : 0) + (s.query.trim() ? 1 : 0);

/** Reviews whose product is in the catalogue, newest first. */
export const CATALOG_REVIEWS: Review[] = REVIEWS.filter((r) => MAP.has(r.productId)).sort((a, b) => b.date.localeCompare(a.date));
export const reviewsFor = (productId: string) => CATALOG_REVIEWS.filter((r) => r.productId === productId);
