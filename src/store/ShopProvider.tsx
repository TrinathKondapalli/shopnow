import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import type { CartLine, ExploreState, Toast } from '../types';
import { DEFAULT_EXPLORE, LOOKS, getProduct, stockFor } from '../lib/catalog';
import { usePersistentState } from '../lib/storage';
import { scrollToId } from '../lib/utils';

export const FREE_SHIPPING_AT = 999;
export const SHIPPING_FEE = 99;
export const BUNDLE_DISCOUNT = 0.15;
const MAX_RECENT_VIEWED = 10;
const MAX_RECENT_SEARCHES = 6;

type Panel = 'cart' | 'wishlist' | null;
export type AddResult = { ok: boolean; added: number; reason?: 'out-of-stock' | 'limited' };

interface Totals { count: number; subtotal: number; discount: number; shipping: number; total: number; toFreeShipping: number }

interface ShopContextValue {
  // cart
  cart: CartLine[];
  totals: Totals;
  addToCart: (productId: string, color: number, size: string, qty: number, lookId?: string) => AddResult;
  setLineQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
  variantInCart: (productId: string, color: number, size: string) => number;
  // wishlist
  wishlist: string[];
  isWished: (id: string) => boolean;
  toggleWish: (id: string) => boolean;
  removeWish: (id: string) => void;
  // history
  recentlyViewed: string[];
  clearRecentlyViewed: () => void;
  recentSearches: string[];
  addRecentSearch: (q: string) => void;
  removeRecentSearch: (q: string) => void;
  clearRecentSearches: () => void;
  // overlays
  quickView: { productId: string; color: number } | null;
  openQuickView: (productId: string, color?: number) => void;
  closeQuickView: () => void;
  panel: Panel;
  openPanel: (p: Exclude<Panel, null>) => void;
  closePanel: () => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
  // explore grid
  explore: ExploreState;
  setExplore: (patch: Partial<ExploreState>) => void;
  shopWith: (patch: Partial<ExploreState>) => void;
  // toasts
  toasts: Toast[];
  toast: (t: Omit<Toast, 'id' | 'tone'> & { tone?: Toast['tone'] }) => void;
  dismissToast: (id: number) => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);

const lineKey = (productId: string, color: number, size: string, lookId?: string) => [productId, color, size, lookId ?? ''].join('|');
const validLine = (l: CartLine) => {
  const p = getProduct(l.productId);
  return !!p && !!p.colors[l.color] && p.sizes.includes(l.size) && l.qty > 0;
};
const onlyProducts = (ids: string[]) => (Array.isArray(ids) ? ids.filter((id) => !!getProduct(id)) : []);

export function computeTotals(cart: CartLine[]): Totals {
  let subtotal = 0;
  let count = 0;
  for (const l of cart) {
    const p = getProduct(l.productId);
    if (!p) continue;
    subtotal += p.price * l.qty;
    count += l.qty;
  }
  // A look earns 15% off for every complete set of its pieces added as a bundle.
  let discount = 0;
  for (const look of LOOKS) {
    const sets = Math.min(
      ...look.items.map((it) => cart.filter((l) => l.lookId === look.id && l.productId === it.productId).reduce((s, l) => s + l.qty, 0)),
    );
    if (sets > 0) discount += sets * look.items.reduce((s, it) => s + (getProduct(it.productId)?.price ?? 0), 0) * BUNDLE_DISCOUNT;
  }
  discount = Math.round(discount);
  const afterDiscount = subtotal - discount;
  const shipping = count === 0 || afterDiscount >= FREE_SHIPPING_AT ? 0 : SHIPPING_FEE;
  return { count, subtotal, discount, shipping, total: afterDiscount + shipping, toFreeShipping: Math.max(0, FREE_SHIPPING_AT - afterDiscount) };
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = usePersistentState<CartLine[]>('cart', [], (v) => (Array.isArray(v) ? v.filter(validLine) : []));
  const [wishlist, setWishlist] = usePersistentState<string[]>('wishlist', [], onlyProducts);
  const [recentlyViewed, setRecentlyViewed] = usePersistentState<string[]>('recently-viewed', [], onlyProducts);
  const [recentSearches, setRecentSearches] = usePersistentState<string[]>('recent-searches', [], (v) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []));

  const [quickView, setQuickView] = useState<{ productId: string; color: number } | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [explore, setExploreState] = useState<ExploreState>(DEFAULT_EXPLORE);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  // A ref mirror lets addToCart check stock synchronously, even when called several times in one click.
  const cartRef = useRef(cart);
  cartRef.current = cart;

  const variantInCart = useCallback((productId: string, color: number, size: string) =>
    cartRef.current.filter((l) => l.productId === productId && l.color === color && l.size === size).reduce((s, l) => s + l.qty, 0), []);

  const addToCart = useCallback((productId: string, color: number, size: string, qty: number, lookId?: string): AddResult => {
    const p = getProduct(productId);
    if (!p) return { ok: false, added: 0, reason: 'out-of-stock' };
    const available = stockFor(p, color, size) - variantInCart(productId, color, size);
    if (available <= 0) return { ok: false, added: 0, reason: 'out-of-stock' };
    const added = Math.min(qty, available);
    const key = lineKey(productId, color, size, lookId);
    const prev = cartRef.current;
    const next = prev.some((l) => l.key === key)
      ? prev.map((l) => (l.key === key ? { ...l, qty: l.qty + added } : l))
      : [...prev, { key, productId, color, size, qty: added, lookId }];
    cartRef.current = next;
    setCart(next);
    return { ok: true, added, reason: added < qty ? 'limited' : undefined };
  }, [setCart, variantInCart]);

  const setLineQty = useCallback((key: string, qty: number) => {
    setCart((prev) => {
      const line = prev.find((l) => l.key === key);
      if (!line) return prev;
      const p = getProduct(line.productId)!;
      const others = prev.filter((l) => l.key !== key && l.productId === line.productId && l.color === line.color && l.size === line.size).reduce((s, l) => s + l.qty, 0);
      const max = Math.max(1, stockFor(p, line.color, line.size) - others);
      const q = Math.min(max, qty);
      return q <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty: q } : l));
    });
  }, [setCart]);

  const removeLine = useCallback((key: string) => setCart((prev) => prev.filter((l) => l.key !== key)), [setCart]);

  const isWished = useCallback((id: string) => wishlist.includes(id), [wishlist]);
  const toggleWish = useCallback((id: string) => {
    const on = !wishlist.includes(id);
    setWishlist((prev) => (on ? [id, ...prev.filter((x) => x !== id)] : prev.filter((x) => x !== id)));
    return on;
  }, [wishlist, setWishlist]);
  const removeWish = useCallback((id: string) => setWishlist((prev) => prev.filter((x) => x !== id)), [setWishlist]);

  const openQuickView = useCallback((productId: string, color = 0) => {
    setQuickView({ productId, color });
    setRecentlyViewed((prev) => [productId, ...prev.filter((x) => x !== productId)].slice(0, MAX_RECENT_VIEWED));
  }, [setRecentlyViewed]);
  const closeQuickView = useCallback(() => setQuickView(null), []);

  const addRecentSearch = useCallback((q: string) => {
    const t = q.trim();
    if (!t) return;
    setRecentSearches((prev) => [t, ...prev.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, MAX_RECENT_SEARCHES));
  }, [setRecentSearches]);

  const setExplore = useCallback((patch: Partial<ExploreState>) => setExploreState((s) => ({ ...s, ...patch })), []);
  const shopWith = useCallback((patch: Partial<ExploreState>) => {
    setExploreState({ ...DEFAULT_EXPLORE, ...patch });
    setMobileMenuOpen(false);
    window.requestAnimationFrame(() => scrollToId('shop'));
  }, []);

  const dismissToast = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const toast = useCallback<ShopContextValue['toast']>((t) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev.slice(-2), { tone: 'success', ...t, id }]);
    window.setTimeout(() => dismissToast(id), 3600);
  }, [dismissToast]);

  const totals = useMemo(() => computeTotals(cart), [cart]);

  const value: ShopContextValue = {
    cart, totals, addToCart, setLineQty, removeLine, variantInCart,
    wishlist, isWished, toggleWish, removeWish,
    recentlyViewed, clearRecentlyViewed: () => setRecentlyViewed([]),
    recentSearches, addRecentSearch,
    removeRecentSearch: (q) => setRecentSearches((prev) => prev.filter((x) => x !== q)),
    clearRecentSearches: () => setRecentSearches([]),
    quickView, openQuickView, closeQuickView,
    panel, openPanel: (p) => { setPanel(p); setMobileMenuOpen(false); }, closePanel: () => setPanel(null),
    searchOpen, setSearchOpen, mobileMenuOpen, setMobileMenuOpen,
    explore, setExplore, shopWith,
    toasts, toast, dismissToast,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used inside <ShopProvider>');
  return ctx;
}
