# SHOPNOW: frontend-only e-commerce landing page

A single, fully interactive fashion e-commerce landing page. There is no backend, database, login or payment. Everything runs in the browser with sample product data, overlays and `localStorage`.

**Stack:** React 19, Vite 7, TypeScript, Tailwind CSS v4, Motion for React, Lucide React, localStorage and a JSON catalog.

## Run it

Requires Node.js 20.19 or newer.

```bash
npm install
npm run dev        # local dev server at http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the production build locally
npm run typecheck  # TypeScript check
```

## Deploy

`npm run build` writes a static site to `dist/`. Upload that folder to any static host: Netlify, Vercel, Cloudflare Pages, GitHub Pages or S3. No server setup is needed. Asset paths are relative (`base: './'` in `vite.config.ts`), so it also works from a sub-folder.

## Page structure

| # | Section | File |
|---|---|---|
| 01 | Announcement bar | `src/components/layout/AnnouncementBar.tsx` |
| – | Navigation and mega menu | `src/components/layout/Navbar.tsx`, `MobileMenu.tsx` |
| 02 | Hero | `src/components/sections/Hero.tsx` |
| 03 | Shop highlights (category rail, service strip, promo tiles) | `src/components/sections/ShopHighlights.tsx` |
| 04 | Shop by category | `src/components/sections/Categories.tsx` |
| 05 | Explore products (tabs, filters, sorting) | `src/components/sections/Explore.tsx` |
| 06 | Featured collection | `src/components/sections/Featured.tsx` |
| 07 | Trending and bestsellers | `src/components/sections/Trending.tsx` |
| 08 | Shop the look | `src/components/sections/ShopTheLook.tsx` |
| 09 | Recently viewed | `src/components/sections/RecentlyViewed.tsx` |
| 10 | Customer reviews | `src/components/sections/Reviews.tsx` |
| 11 | Newsletter | `src/components/sections/Newsletter.tsx` |
| 12 | Footer and back to top | `src/components/layout/Footer.tsx` |

### Overlays
- **Search:** `src/components/overlays/SearchOverlay.tsx`. Live suggestions, recent searches and an empty state with a reset.
- **Quick view:** `src/components/overlays/QuickView.tsx`. Image gallery, colour, size, stock per variant and quantity.
- **Wishlist drawer:** `src/components/overlays/WishlistDrawer.tsx`.
- **Shopping bag drawer:** `src/components/overlays/CartDrawer.tsx`. Quantities, bundle savings, shipping and totals.
- **Toasts:** `src/components/overlays/Toaster.tsx`.

## Where things live

```
src/
  data/products.json   24 sample products: prices, colours, sizes, simulated stock
  data/looks.json      Shop the Look outfits
  data/reviews.json    sample reviews
  store/ShopProvider.tsx  cart, wishlist, history, overlays, filters, toasts
  lib/catalog.ts       filtering, sorting, stock helpers
  lib/search.ts        search ranking and suggestions
  lib/motion.ts        all animation timings from the plan
  lib/storage.ts       localStorage helpers
  index.css            Tailwind theme: colours, fonts, buttons
```

### Saved in the browser (localStorage)
Cart, wishlist, recently viewed products and recent searches all survive a refresh. Keys start with `shopnow:v1:`. Saved data stays in that browser and does not sync across devices.

### Business rules
- Free shipping on totals of ₹999 and above, otherwise ₹99. Change `FREE_SHIPPING_AT` and `SHIPPING_FEE` in `src/store/ShopProvider.tsx`.
- Adding a full look from Shop the Look takes 15% off every complete set (`BUNDLE_DISCOUNT`).
- You can't add more than the stock of a colour and size. The quick view and the bag both enforce this.

## Replacing the placeholder images

Products are drawn as SVG illustrations, so the page works without photos. To use real photography, add an `images` array to a colour in `src/data/products.json`. The order is front, alternate (shown on hover) and detail:

```json
{ "name": "Lavender", "hex": "#C2B0FA", "family": "purple",
  "images": ["/images/everyday-hoodie-lavender-front.jpg", "/images/everyday-hoodie-lavender-back.jpg", "/images/everyday-hoodie-lavender-detail.jpg"] }
```

Put the files in `public/images/`. A colour that has photos shows them everywhere: cards, quick view, drawers and search.

To change products, prices or stock, either edit `src/data/products.json` directly or edit `scripts/generate-catalog.mjs` and run `npm run catalog`. The script regenerates the whole file and overwrites any hand edits.

## Motion

All timings follow the plan and are kept in `src/lib/motion.ts`. For example: hero mask 800ms, headline reveal 700ms, quick view 300ms, cart drawer 350ms, toast 250ms and mobile menu 300ms. `MotionConfig reducedMotion="user"` and a CSS media query switch animations off for people who ask their device for reduced motion.

## Accessibility and SEO
- Semantic sections, a single `h1`, a skip link, and labelled buttons and inputs.
- Dialogs trap focus, close on Escape and return focus to whatever opened them.
- Meta description, Open Graph tags and `ClothingStore` JSON-LD are in `index.html`.

## Out of scope (by design)
Backend, database, login, separate product pages, payment, checkout and shipping, order management, admin and external APIs. Checkout is a demo: it empties the bag and shows a confirmation that states no payment was taken. Footer "Client Care" links open information dialogs.
