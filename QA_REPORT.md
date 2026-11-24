# SHOPNOW QA Review Report

**Date:** 2026-11-24  
**Application:** SHOPNOW — Frontend-only Streetwear E-Commerce Landing Page  
**Tech Stack:** React 19, Vite 7, TypeScript, Tailwind CSS v4, Motion, Lucide React, localStorage  
**Target URL:** `http://localhost:5174/` (Local Dev) / `http://localhost:4173/` (Preview)  
**QA Lead:** Senior Frontend Engineer & QA Automation Lead  

---

## 1. Executive Summary

| Status | Count | Description |
|---|:---:|---|
| **Fixed** | 3 | BUG-01 (Horizontal overflow at 768px), BUG-03 (Heading order in Benefits), BUG-04 (Focus not returning after closing drawer) |
| **Rejected** | 1 | BUG-02 (4th benefit item request rejected — spec strictly defines 3 benefits) |
| **Open Issues** | **0** | No remaining open defects |
| **Total Tracked** | **4** | |

### Overall Verdict: **PRODUCTION READY / APPROVED**
All targeted fixes have been successfully implemented and verified with zero side-effects. Both `npm run typecheck` and `npm run build` pass with 0 errors and 0 warnings. Automated browser testing confirms zero horizontal overflow across all required breakpoints (768px, 820px, 1024px, 1440px, 390px with `document.documentElement.scrollWidth <= window.innerWidth`). Heading order strictly adheres to WCAG specifications (`<h1>` &rarr; `<h2>` &rarr; `<h3>`), and dialog focus returns reliably to bag and wishlist trigger targets. All catalog numbers, section names, and business calculations match design and specification criteria.

---

## 2. Issues Table & Verification Proofs

| ID | Severity | Section | Viewport | Steps to Reproduce | Expected | Actual / Resolution | Proof / Screenshot |
|---|---|---|---|---|---|---|---|
| **BUG-01** | **Medium** | 12 Footer (`Footer.tsx`) | Tablet (768px, 820px) | 1. Open app at 768px width.<br>2. Scroll to footer.<br>3. Check `scrollWidth` vs `innerWidth`. | `document.documentElement.scrollWidth === window.innerWidth` (no horizontal overflow). | **FIXED** in [Footer.tsx](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/src/components/layout/Footer.tsx#L28-L29).<br>Changed footer grid to `grid-cols-2 md:grid-cols-4 lg:grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))]` and made brand column span full row below `lg:` (`col-span-2 md:col-span-4 lg:col-span-1`).<br>Verified `scrollWidth = 753px <= 768px` at 768px, `805px <= 820px` at 820px, `1009px <= 1024px` at 1024px, and `1425px <= 1440px` at 1440px. | [fix01_footer_grid_768px.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/fix01_footer_grid_768px.png) |
| **BUG-02** | **N/A** | 03 Shopping Benefits (`Benefits.tsx`) | All | 1. Count items in section 03. | Exactly 3 benefits as specified: Free shipping, Easy returns, Premium quality. | **REJECTED – NOT IN SPEC**.<br>The product specification intentionally mandates exactly 3 benefits (Shipping, Easy Returns, Quality). No 4th benefit was missing; the implementation matches the design specification. | [proof_03_benefits.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_03_benefits.png) |
| **BUG-03** | **Low** | 03 Shopping Benefits (`Benefits.tsx`) | All | 1. Inspect DOM headings from Hero downward. | Sequential heading progression (`<h1>` &rarr; `<h2>` &rarr; `<h3>`). | **FIXED** in [Benefits.tsx](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/src/components/sections/Benefits.tsx#L14-L16).<br>Replaced `aria-label` with `aria-labelledby="benefits-title"` on `<section>` and added `<h2 id="benefits-title" className="sr-only">Why shop with SHOPNOW</h2>` as the first child.<br>Verified DOM sequence: `h1#hero-title` &rarr; `h2#benefits-title` &rarr; `h3` ("Free shipping", "Easy returns", "Premium quality"). | [fix02_benefits_heading.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/fix02_benefits_heading.png) |
| **BUG-04** | **Low** | Overlays / Drawers (`useOverlay.ts`, `Drawer.tsx`, `CartDrawer.tsx`, `WishlistDrawer.tsx`, `Navbar.tsx`) | All | 1. Go to "Shop the Look", click "Add full look to bag".<br>2. Click "View bag" in toast.<br>3. Press `Escape`. | Focus lands on the Shopping bag button (`[data-bag-target]`). Repeat for wishlist heart &rarr; "View" &rarr; `Escape` landing on `[data-wishlist-target]`. | **FIXED** across overlay components.<br>- Added `fallbackFocus?: string` to `useDialog` in [useOverlay.ts](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/src/hooks/useOverlay.ts#L32-L71); cleanup focuses `document.querySelector(fallbackFocus)` if opener is no longer in document.<br>- Added `returnFocusTo` to [Drawer.tsx](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/src/components/overlays/Drawer.tsx#L14-L21).<br>- Passed `returnFocusTo="[data-bag-target]"` in [CartDrawer.tsx](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/src/components/overlays/CartDrawer.tsx#L52).<br>- Passed `returnFocusTo="[data-wishlist-target]"` in [WishlistDrawer.tsx](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/src/components/overlays/WishlistDrawer.tsx#L26).<br>- Added `data-wishlist-target` attribute in [Navbar.tsx](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/src/components/layout/Navbar.tsx#L116).<br>Verified focus lands on Shopping Bag button for cart and Wishlist button for wishlist. | [proof_focus_wishlist_button.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_focus_wishlist_button.png) |

---

## 3. Passed Verification List (With Screen Quotes & Proofs)

### Step 1: Build Health
- [x] **`npm install`**: Audited 96 packages with 0 vulnerabilities.
- [x] **`npm run typecheck` (`tsc --noEmit`)**:
  - *Console output:* `> shopnow@1.0.0 typecheck > tsc --noEmit`
  - *Result:* 0 TypeScript compiler errors.
- [x] **`npm run build` (`vite build`)**:
  - *Console output:*
    ```
    ✓ 2109 modules transformed.
    dist/index.html                   2.03 kB │ gzip:   0.97 kB
    dist/assets/index-B0kUedXy.css   60.51 kB │ gzip:  11.13 kB
    dist/assets/index-CdLhYPuk.js   499.45 kB │ gzip: 153.36 kB
    ✓ built in 18.53s
    ```
  - *Result:* Exit code 0, 0 build warnings.
- [x] **`npm run dev`**: Vite dev server active on `http://localhost:5174/` with instantaneous Hot Module Replacement.
- [x] **Browser Console Health**: 0 uncaught exceptions, 0 runtime errors.

---

### Step 2: 12 Sections Verification (In Exact Order)

#### 01. Announcement Bar
- **Screen Quote:** `"Free express shipping on all orders over ₹999"` | `"7-day hassle-free returns on all apparel"` | `"End of season sale: up to 40% off select styles"` | CTA: `"Shop now"`
- **Verified Behavior:** Auto-rotates every 5s; chevron navigation arrows allow manual cycle; "Shop now" applies explore filter and scrolls down smoothly to `#shop`.
- **Screenshot:** [proof_01_announcement_bar.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_01_announcement_bar.png)

#### 01. Navigation & Mega Menu
- **Screen Quote:** Links: `"Men"`, `"Women"`, `"Collections"` | Actions: `"Search products"`, `"Wishlist, 1 items"`, `"Shopping bag, 3 items"`
- **Verified Behavior:** Mega menus open on click and hover with subcategories ("Hoodies & Sweatshirts", "T-Shirts", "Pants & Cargos", "Outerwear", "Accessories"); sticky header applies backdrop blur on scroll; live badge counts update dynamically.
- **Screenshot:** [proof_01_navigation_megamenu.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_01_navigation_megamenu.png)

#### 02. Hero
- **Screen Quote:** Eyebrow: `"Autumn / Winter '26"` | `<h1>` title: `"Style Your Everyday"` | Subtitle: `"Heavyweight essentials, relaxed cuts and muted tones built for daily wear."` | Buttons: `"Explore collection"`, `"Shop the look"`
- **Verified Behavior:** Semantic single `<h1>`; stagger reveal animations; CTAs link directly to `#shop` and `#looks`.
- **Screenshot:** [proof_02_hero.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_02_hero.png)

#### 03. Benefits
- **Screen Quote:** `<h2>` (sr-only): `"Why shop with SHOPNOW"` | Benefit 1: `"Free shipping" · "On every order above ₹999, delivered in 3 to 5 days."` | Benefit 2: `"Easy returns" · "7-day returns and size exchanges, no questions asked."` | Benefit 3: `"Premium quality" · "Heavyweight cotton and fleece made to last for years."`
- **Verified Behavior:** Section accessible via `aria-labelledby="benefits-title"`; sequential heading hierarchy (`h1` &rarr; `h2` &rarr; `h3`); 3 benefits per design spec.
- **Screenshot:** [proof_03_benefits.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_03_benefits.png)

#### 04. Categories
- **Screen Quote:** Eyebrow: `"Curated capsules"` | Heading: `"Shop by category"` | Cards: `"Men" (15 items)`, `"Women" (14 items)`, `"Hoodies" (6 items)`, `"Accessories" (5 items)`
- **Verified Behavior:** Hover zoom animation on cards; clicking any card filters the Explore grid to that category and scrolls to `#shop`.
- **Screenshot:** [proof_04_categories.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_04_categories.png)

#### 05. Explore Products (Exact Counts Verified on Screen)
- **Screen Quotes & Verified Counts:**
  - Tab **All**: 24 products (`"Showing 8 of 24"`)
  - Tab **Men**: 15 products (`"Showing 8 of 15"`)
  - Tab **Women**: 14 products (`"Showing 8 of 14"`)
  - Tab **New Arrivals**: 8 products (All 8 displayed on page)
  - Tab **Sale**: 6 products (All 6 displayed on page)
- **Verified Filters & Sorting:**
  - Category filters: Hoodies, T-Shirts, Pants, Outerwear, Accessories
  - Size pills: XS, S, M, L, XL, XXL
  - Color filters: Black, White, Grey, Beige, Blue, Green, Purple
  - Price bands: Under ₹1,000, ₹1,000–₹1,999, ₹2,000+
  - Sorting: Featured, Popular, Newest, Price low to high, Price high to low
  - Active filter chips render with remove 'x' buttons; "Clear all" resets state; "Reset filters" recovers from empty matches.
  - "Load more" button increments pagination in batches of 8 with a live progress bar.
- **Screenshot:** [proof_05_explore_tabs_counts.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_05_explore_tabs_counts.png)

#### 06. Featured Collection
- **Screen Quote:** Eyebrow: `"Featured Drop"` | Title: `"Made for Every Move"` | Description: `"Boxy tees, structured fleece and modular outerwear built in 460 GSM loopback cotton."`
- **Verified Behavior:** Editorial photography card layout with quick-shop interaction.
- **Screenshot:** [proof_06_featured_collection.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_06_featured_collection.png)

#### 07. Trending & Bestsellers
- **Screen Quote:** Eyebrow: `"Right now"` | Title: `"Trending now"` | Tabs: `"Trending"`, `"Bestsellers"`
- **Verified Behavior:** Tab switching swaps active product set; left/right arrow buttons slide carousel smoothly with momentum scroll.
- **Screenshot:** [proof_07_trending_bestsellers.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_07_trending_bestsellers.png)

#### 08. Shop the Look (Exact Look Name Verified)
- **Screen Quote:** Eyebrow: `"Shop the look"` | Title: `"Styled head to toe"` | Active Look Carousel Option: `"02 Lavender Hour"` | Caption: `"Cropped fleece over wide-leg denim, finished with a platform sole."` | Look Items: `"Cropped Fleece Hoodie" · ₹1,899`, `"Wide-Leg Denim" · ₹2,499`, `"Platform Retro Sneaker" · ₹2,999`
- **Verified Behavior:** Interactive hotspot pins (1, 2, 3) map to garment slots; clicking pins scrolls to item card; individual size selectors; "Add full look to bag" applies 15% bundle discount and opens toast with "View bag" action.
- **Screenshot:** [proof_08_shop_the_look_lavender_hour.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_08_shop_the_look_lavender_hour.png)

#### 09. Recently Viewed
- **Screen Quote:** Title: `"Recently viewed"` | Product Card: `"Essential Boxy Tee" · ₹1,299` | Action: `"Clear history"`
- **Verified Behavior:** Automatically populates when products are inspected via Quick View; persists in `shopnow:v1:recently-viewed`; "Clear history" removes cards and displays empty message.
- **Screenshot:** [proof_09_recently_viewed.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_09_recently_viewed.png)

#### 10. Customer Reviews
- **Screen Quote:** Eyebrow: `"Real feedback"` | Title: `"Loved by 50,000+ customers"` | Subtitle: `"4.8 out of 5 based on 2,400+ verified purchases"` | Review Card: `"Best heavyweight hoodie I own" · Ananya S., Mumbai`
- **Verified Behavior:** Star ratings render correctly; verified buyer badges and purchased size tags visible.
- **Screenshot:** [proof_10_reviews.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_10_reviews.png)

#### 11. Newsletter
- **Screen Quote:** Title: `"Join the inner circle"` | Subtitle: `"Get 10% off your first order, early access to limited drops, and member-only editorial previews."` | Input: `"Enter your email address"` | Button: `"Subscribe"`
- **Verified Behavior:** Regex validation rejects malformed email strings; displays loader during submission; renders success state with discount code upon completion.
- **Screenshot:** [proof_11_newsletter.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_11_newsletter.png)

#### 12. Footer & Back to Top (Exact Column Name Verified)
- **Screen Quote:** Brand: `"SHOPNOW"` | Tagline: `"Premium streetwear and everyday essentials, designed to move with you."`
- **Columns on Screen:**
  - **Shop**: `"Men"`, `"Women"`, `"New Arrivals"`, `"Sale"`
  - **About** *(Verified exact column title, not "Company")*: `"Our story"`, `"Sustainability"`, `"Careers"`, `"Stores"`
  - **Help**: `"Shipping"`, `"Returns and exchanges"`, `"Size guide"`, `"Contact us"`, `"FAQs"`
  - **Social**: `"Instagram"`, `"YouTube"`, `"Pinterest"`, `"X"`
- **Back to Top:** Floating button appears dynamically when scrolled past 900px (`useScrolledPast(900)`); clicking scrolls smoothly to viewport top.
- **Screenshot:** [proof_12_footer_about_column.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_12_footer_about_column.png)

---

### Step 3: Overlays Verification

#### Search Overlay
- **Screen Quote:** Input placeholder: `"Search by item, color, style..."` | Highlighting: `<mark>hoodie</mark>` | Popular searches: `"Heavyweight Hoodie"`, `"Cargo Pants"`, `"Boxy Tee"`
- **Verified Behavior:** Live autocomplete filtering; search term highlighting; recent search history (add on Enter, remove individual search, clear all); empty state with query reset; "View all results" button populates Explore query and closes modal.
- **Screenshot:** [proof_overlay_search.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_overlay_search.png)

#### Quick View Modal
- **Screen Quote:** Product: `"Essential Boxy Tee" · ₹1,299` | Color swatches: Off-White, Washed Black, Slate | Size selector: XS, S, M, L, XL | Stock notice: `"Only 2 left in this size"`
- **Verified Behavior:** 3-image gallery (Front, Detail, Fabric) with thumbnail switching; colour swatch switches active preview image; size selection validation prevents add-to-bag without selected size; quantity increment capped by inventory stock; wishlist button toggles state.
- **Screenshot:** [proof_overlay_quickview.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_overlay_quickview.png)

#### Shopping Bag Drawer
- **Screen Quote:** Title: `"Your bag (3)"` | Free shipping bar: `"You’ve unlocked free shipping."` | Line item: `"Everyday Hoodie · ₹1,699"`, `"Cargo Pants · ₹1,499"`, `"Retro Runner Sneakers · ₹2,499"` | Savings: `"Look bundle savings (15%) −₹855"` | Total: `"Total ₹4,842"`
- **Verified Behavior:** Slide-out drawer with backdrop blur; line quantity controls (+/-/trash); free shipping progress bar; order summary calculations match mathematical formula; demo checkout notice; focus returns to Navbar bag target upon closing.
- **Screenshot:** [proof_overlay_cart_drawer.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_overlay_cart_drawer.png)

#### Wishlist Drawer
- **Screen Quote:** Title: `"Wishlist (1)"` | Item: `"Essential Boxy Tee · ₹1,299"` | Footer note: `"Saved in this browser. Choose a size to move an item to your bag."`
- **Verified Behavior:** Saved items render with thumbnail, price, and stock status; remove button; move-to-bag opens Quick View; focus returns to Navbar wishlist target upon closing.
- **Screenshot:** [proof_overlay_wishlist_drawer.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_overlay_wishlist_drawer.png)

#### Mobile Navigation Menu (390px Viewport)
- **Screen Quote:** Header: `"SHOPNOW"` | Accordion categories: `"Men"`, `"Women"` | Bottom shortcuts: Search, Wishlist, Bag
- **Verified Behavior:** Slides from left at viewports < 1024px; trap focus inside drawer; backdrop dismissal and Escape dismissal work seamlessly.
- **Screenshot:** [proof_overlay_mobile_menu.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_overlay_mobile_menu.png)

---

### Step 4: Business Rules (Mathematical Verification)

1. **Free Shipping Threshold (₹999)**:
   - Order with Subtotal ₹799 (< ₹999): Shipping is **₹99**; Total = **₹898**. Remaining amount banner quotes: `"Add ₹200 more for free shipping."`
   - Order with Subtotal ₹1,299 (&ge; ₹999): Shipping is **₹0 (Free)**; Total = **₹1,299**. Banner quotes: `"You’ve unlocked free shipping."`
2. **Shop the Look Bundle Discount (15%)**:
   - "City Layers" Complete Look:
     - Everyday Hoodie (₹1,699) + Cargo Pants (₹1,499) + Retro Runner Sneakers (₹2,499) = **₹5,697** subtotal.
     - Bundle discount = `Math.round(5697 * 0.15)` = **₹855**.
     - Subtotal minus discount = `5697 - 855` = **₹4,842** (&ge; ₹999 &rarr; Free Shipping).
     - Total = `4842 + 0` = **₹4,842**. Displayed and computed exactly.
3. **Variant Stock Enforcement**:
   - In Quick View (Essential Boxy Tee, Off-White, Size M with 2 in stock): Quantity selector increments up to 2; disables "+" button at 2 and displays: `"That's all we have in stock for this size."`
   - In Shopping Bag drawer: Line quantity "+" button is disabled when `qty >= available stock`.
4. **Total Calculation Formula**:
   - Formula verified: `Total = Subtotal - Bundle Discount + Shipping`.
5. **State Persistence Across Page Refresh (`localStorage`)**:
   - `shopnow:v1:cart`: Preserved items with variant keys and look bundle IDs.
   - `shopnow:v1:wishlist`: Preserved saved product IDs.
   - `shopnow:v1:recently-viewed`: Preserved recently inspected product IDs.
   - `shopnow:v1:recent-searches`: Preserved search queries list.
   - Fully tested and verified to reload seamlessly after complete browser reload.

---

### Step 5: Accessibility, Motion & Responsive Layout

- [x] **No Horizontal Overflow Across All Required Widths**:
  - `1440px`: `scrollWidth = 1425px` (0 overflow)
  - `1024px`: `scrollWidth = 1009px` (0 overflow)
  - `820px`: `scrollWidth = 805px` (0 overflow)
  - `768px`: `scrollWidth = 753px` (0 overflow)
  - `390px`: `scrollWidth = 390px` (0 overflow)
- [x] **Heading Hierarchy**:
  - `<h1>`: `#hero-title` ("Style Your Everyday")
  - `<h2>`: `#benefits-title` ("Why shop with SHOPNOW" - sr-only)
  - `<h3>`: "Free shipping", "Easy returns", "Premium quality"
  - Sequential hierarchy validates WCAG 1.3.1.
- [x] **Keyboard Navigation & Focus Trapping**:
  - `useDialog` captures focus inside dialogs (Search, Quick View, Cart Drawer, Wishlist Drawer, Mobile Menu).
  - Pressing `Escape` reliably dismisses active overlay.
  - Focus returns to opener element, with selector fallback to `[data-bag-target]` and `[data-wishlist-target]` when opener was dismissed with a toast notification.
- [x] **Reduced Motion Support**:
  - Emulation of `prefers-reduced-motion: reduce` degrades motion springs and transitions to immediate layout states without visual artifacts or layout shifts.
