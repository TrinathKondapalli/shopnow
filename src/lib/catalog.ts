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

export const PRODUCT_TYPES: ProductType[] = ['T-Shirts', 'Hoodies', 'Sweatshirts', 'Jackets', 'Bottoms', 'Footwear', 'Accessories'];

export const SIZE_GROUPS: { label: string; sizes: string[] }[] = [
  { label: 'Clothing', sizes: ['XS', 'S', 'M', 'L', 'XL'] },
  { label: 'Waist', sizes: ['28', '30', '32', '34', '36'] },
  { label: 'Shoes', sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'] },
];

export const COLOR_FAMILIES: { id: ColorFamily; label: string; swatch: string }[] = [
  { id: 'black', label: 'Black', swatch: '#1F1F25' },
  { id: 'white', label: 'White', swatch: '#F4F4F6' },
  { id: 'purple', label: 'Purple', swatch: '#9B6BFF' },
  { id: 'grey', label: 'Grey', swatch: '#8C8C99' },
  { id: 'blue', label: 'Blue', swatch: '#3F5C96' },
  { id: 'green', label: 'Green', swatch: '#62684A' },
  { id: 'neutral', label: 'Neutral', swatch: '#D9C7A6' },
];

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
  { id: 'new', label: 'New Arrivals' },
  { id: 'sale', label: 'Sale' },
];

export const COLLECTIONS: Record<string, string> = {
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
