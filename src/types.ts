export type Gender = 'men' | 'women' | 'unisex';
export type ProductType = 'T-Shirts' | 'Hoodies' | 'Sweatshirts' | 'Jackets' | 'Bottoms' | 'Footwear' | 'Accessories';
export type ArtKind =
  | 'tee' | 'longsleeve' | 'sweat' | 'hoodie' | 'cropped-hoodie' | 'jacket' | 'bomber'
  | 'cargo' | 'jeans' | 'wide' | 'cap' | 'bucket' | 'shoe' | 'platform' | 'tote';
export type ColorFamily = 'black' | 'white' | 'purple' | 'grey' | 'blue' | 'green' | 'neutral';

export interface ProductColor {
  name: string;
  hex: string;
  family: ColorFamily;
  /** Optional real photos for this colour: [front, alternate, detail]. When empty, the illustrated garment is shown. */
  images?: string[];
  /** Optional art-directed crops of the front photo, per layout (see ProductImage `crop`). */
  photos?: Partial<Record<PhotoCrop, string>>;
}

/** grid: landscape product grid · portrait: carousel cards · square: mini cards · thumb: list rows. */
export type PhotoCrop = 'grid' | 'portrait' | 'square' | 'thumb';

export interface Product {
  id: string;
  name: string;
  gender: Gender;
  type: ProductType;
  art: ArtKind;
  price: number;
  compareAt?: number;
  rating: number;
  reviewCount: number;
  popularity: number;
  trending: number;
  featured: number;
  createdAt: string;
  isNew: boolean;
  collections: string[];
  tags: string[];
  description: string;
  details: string[];
  colors: ProductColor[];
  sizes: string[];
  /** stock[colourName][size] = units available (simulated). */
  stock: Record<string, Record<string, number>>;
}

export interface CartLine {
  key: string;
  productId: string;
  color: number;
  size: string;
  qty: number;
  /** Set when the line was added as part of a "Shop the look" bundle. */
  lookId?: string;
}

export type LookSlot = 'top' | 'bottom' | 'feet' | 'head';
export interface Look {
  id: string;
  name: string;
  caption: string;
  figure: 'm' | 'f';
  items: { productId: string; color: number; slot: LookSlot }[];
}

export interface Review {
  id: string;
  name: string;
  city: string;
  rating: number;
  title: string;
  body: string;
  productId: string;
  size: string;
  date: string;
}

export type ExploreTab = 'all' | 'men' | 'women' | 'new' | 'sale';
export type SortKey = 'featured' | 'popular' | 'newest' | 'price-asc' | 'price-desc';
export type PriceBand = 'under-1000' | '1000-1999' | '2000-plus';

export interface ExploreState {
  tab: ExploreTab;
  query: string;
  types: ProductType[];
  sizes: string[];
  colors: ColorFamily[];
  prices: PriceBand[];
  collection: string | null;
  sort: SortKey;
}

export type ToastTone = 'success' | 'info' | 'error';
export interface Toast {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
  action?: { label: string; onClick: () => void };
}
