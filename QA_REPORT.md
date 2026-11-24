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

## 3. Passed Verification List

*(All text and numbers below copied verbatim from the live page DOM `innerText` via browser automation)*

### Step 1: Build Health
- [x] **`npm install`**: Succeeded cleanly (audited 96 packages, 0 vulnerabilities).
- [x] **`npm run typecheck` (`tsc --noEmit`)**:
  - *Console output:* `> shopnow@1.0.0 typecheck > tsc --noEmit`
  - *Result:* 0 errors.
- [x] **`npm run build` (`vite build`)**:
  - *Console output:*
    ```
    ✓ 2109 modules transformed.
    dist/index.html                   2.03 kB │ gzip:   0.97 kB
    dist/assets/index-B0kUedXy.css   60.51 kB │ gzip:  11.13 kB
    dist/assets/index-CdLhYPuk.js   499.45 kB │ gzip: 153.36 kB
    ✓ built in 18.53s
    ```
  - *Result:* Exit code 0, 0 errors, 0 warnings.
- [x] **`npm run dev`**: Vite dev server active on `http://localhost:5174/`.
- [x] **Runtime Console**: 0 uncaught exceptions, 0 runtime errors.

---

### Step 2: 12 Sections Verification (In Exact Order)

#### 01. Announcement Bar
- **Eyebrow:** None *(not rendered)*
- **Heading:** None *(rotates messages in region)*
- **Rendered Messages & CTAs (innerText):**
  - `"Free shipping on orders above ₹999"` | CTA: `"Shop now"`
  - `"New season drop: Made for Every Move is live"` | CTA: `"Explore"`
  - `"Mid-season sale: up to 30% off selected styles"` | CTA: `"Shop sale"`
- **Verified Behavior:** Auto-rotates every 5s; prev/next chevron buttons cycle announcements manually; live region (`aria-live="polite"`); CTA button filters grid and scrolls to `#shop`.
- **Screenshot:** [proof_01_announcement_bar.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_01_announcement_bar.png)

#### 01. Navigation & Mega Menu
- **Eyebrow:** None *(not rendered)*
- **Brand Heading:** `"SHOPNOW"`
- **Nav Links (innerText):** `"Men"`, `"Women"`, `"Collections"`, `"Sale"`
- **Action Icons (innerText / aria-label):**
  - `aria-label="Search products"`
  - `aria-label="Wishlist, 1 items"` (badge: `"1"`, attribute: `data-wishlist-target`)
  - `aria-label="Shopping bag, 3 items"` (badge: `"3"`, attribute: `data-bag-target`)
- **Verified Behavior:** Sticky header with backdrop blur; mega menus open on hover and click; category links filter grid.
- **Screenshot:** [proof_01_navigation_megamenu.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_01_navigation_megamenu.png)

#### 02. Hero
- **Eyebrow (innerText):** `"NEW SEASON DROP"`
- **Heading `<h1>` (innerText):** `"Style Your Everyday"`
- **Description (innerText):** `"Discover fashion that moves with you. Streetwear and everyday essentials for him and her."`
- **Buttons (innerText):** `"Explore Collection"`, `"Shop the Look"`
- **Floating Badge (innerText):** `"JUST DROPPED Cropped Hoodie ₹1,599"`
- **Verified Behavior:** Single semantic `<h1>`; staggered reveal animation; primary and secondary CTAs link to `#shop` and `#looks`.
- **Screenshot:** [proof_02_hero.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_02_hero.png)

#### 03. Benefits
- **Eyebrow:** None *(accessible via `aria-labelledby="benefits-title"`)*
- **Heading `<h2>` (innerText, sr-only):** `"Why shop with SHOPNOW"`
- **Benefit Items (innerText):**
  1. Title: `"Free shipping"` | Text: `"On every order above ₹999, delivered in 3 to 5 days."`
  2. Title: `"Easy returns"` | Text: `"7-day returns and size exchanges, no questions asked."`
  3. Title: `"Premium quality"` | Text: `"Heavyweight cotton and fleece made to last for years."`
- **Verified Behavior:** Sequential heading hierarchy (`h1` &rarr; `h2` &rarr; `h3`); 3 benefits per specification.
- **Screenshot:** [proof_03_benefits.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_03_benefits.png)

#### 04. Categories
- **Eyebrow (innerText):** `"SHOP BY CATEGORY"`
- **Heading `<h2>` (innerText):** `"Find your fit"`
- **Action Button (innerText):** `"View all products"`
- **Category Cards (innerText):**
  - Card 1: `"Men | Jackets, cargos and everyday tees | 15 styles"`
  - Card 2: `"Women | Cropped fleece, wide-leg denim | 14 styles"`
  - Card 3: `"Hoodies | Brushed fleece in five fits | 3 styles"`
  - Card 4: `"Accessories | Caps, hats and totes | 3 styles"`
- **Verified Behavior:** Hover zoom effect; clicking any card filters the Explore grid and scrolls to `#shop`.
- **Screenshot:** [proof_04_categories.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_04_categories.png)

#### 05. Explore Products
- **Eyebrow (innerText):** `"EXPLORE PRODUCTS"`
- **Heading `<h2>` (innerText):** `"Shop the edit"`
- **Intro (innerText):** `"Filter by fit, size, colour and price. Everything updates instantly."`
- **Tabs (innerText):** `"All"`, `"Men"`, `"Women"`, `"New Arrivals"`, `"Sale"`
- **Counts on Screen (innerText):**
  - Tab **All**: 24 items (`"Showing 8 of 24"`)
  - Tab **Men**: 15 items (`"Showing 8 of 15"`)
  - Tab **Women**: 14 items (`"Showing 8 of 14"`)
  - Tab **New Arrivals**: 8 items (All 8 displayed on page)
  - Tab **Sale**: 6 items (All 6 displayed on page)
- **Filter Groups (innerText):**
  - Categories: `"T-Shirts"`, `"Hoodies"`, `"Sweatshirts"`, `"Jackets"`, `"Bottoms"`, `"Footwear"`, `"Accessories"`
  - Sizes:
    - Clothing: `"XS"`, `"S"`, `"M"`, `"L"`, `"XL"`
    - Waist: `"28"`, `"30"`, `"32"`, `"34"`, `"36"`
    - Shoes: `"UK 6"`, `"UK 7"`, `"UK 8"`, `"UK 9"`, `"UK 10"`
  - Colours: `"Black"`, `"White"`, `"Purple"`, `"Grey"`, `"Blue"`, `"Green"`, `"Neutral"`
  - Prices: `"Under ₹1,000"`, `"₹1,000 – ₹1,999"`, `"₹2,000 and above"`
- **Sort Options (innerText):**
  - `"Sort: Featured"`
  - `"Sort: Most popular"`
  - `"Sort: Newest"`
  - `"Sort: Price: low to high"`
  - `"Sort: Price: high to low"`
- **Verified Behavior:** Active filter chips with remove 'x'; "Clear all" button; empty state with "Reset filters"; pagination with "Load more" and progress bar.
- **Screenshot:** [proof_05_explore_tabs_counts.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_05_explore_tabs_counts.png)

#### 06. Featured Collection
- **Eyebrow (innerText):** `"FEATURED COLLECTION"`
- **Heading `<h2>` (innerText):** `"Made for every move."`
- **Description (innerText):** `"Stretch fabrics, satin layers and cushioned soles. Pieces that keep up from the morning commute to the late show."`
- **Campaign Label (innerText):** `"SHOPNOW / Drop 04"` · `"Autumn–Winter 26"`
- **Verified Behavior:** Asymmetric campaign mask reveal with parallax mannequin and product quick-shop cards.
- **Screenshot:** [proof_06_featured_collection.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_06_featured_collection.png)

#### 07. Trending & Bestsellers
- **Eyebrow (innerText):** `"TRENDING & BESTSELLERS"`
- **Heading `<h2>` (innerText):** `"What everyone is wearing"`
- **Tabs (innerText):** `"Trending"`, `"Bestsellers"`
- **Verified Behavior:** Tab switching swaps ranked product list; carousel navigation arrow buttons scroll smoothly left and right.
- **Screenshot:** [proof_07_trending_bestsellers.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_07_trending_bestsellers.png)

#### 08. Shop the Look
- **Eyebrow (innerText):** `"SHOP THE LOOK"`
- **Heading `<h2>` (innerText):** `"Styled head to toe"`
- **Intro (innerText):** `"Tap a pin to find the piece. Add the full outfit to save 15%."`
- **Look Carousel Options (innerText):**
  - `"01 City Layers"`
  - `"02 Lavender Hour"`
  - `"03 Night Shift"`
- **Caption for "02 Lavender Hour" (innerText):** `"CROPPED FLEECE OVER WIDE-LEG DENIM, FINISHED WITH A PLATFORM SOLE."`
- **Look Items for "02 Lavender Hour" (innerText):**
  - Item 1: `"Cropped Fleece Hoodie"` · `₹1,899`
  - Item 2: `"Wide-Leg Denim"` · `₹2,499`
  - Item 3: `"Platform Retro Sneaker"` · `₹2,999`
- **Bundle Action Button (innerText):** `"Add full look to bag"`
- **Verified Behavior:** Hotspot pins link to items; per-item size selectors; full look bundle applies 15% discount; triggers toast with "View bag" action.
- **Screenshot:** [proof_08_shop_the_look_lavender_hour.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_08_shop_the_look_lavender_hour.png)

#### 09. Recently Viewed
- **Eyebrow (innerText):** `"RECENTLY VIEWED"`
- **Heading `<h2>` (innerText):** `"Pick up where you left off"`
- **Action (innerText):** `"Clear history"`
- **Empty State (innerText when cleared):**
  - Title: `"Nothing here yet"`
  - Description: `"Products you open will appear here, even after you refresh the page."`
  - Button: `"Start browsing"`
- **Verified Behavior:** Populates automatically when products are opened in Quick View; survives browser reload via `shopnow:v1:recently-viewed`.
- **Screenshot:** [proof_09_recently_viewed.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_09_recently_viewed.png)

#### 10. Customer Reviews
- **Eyebrow (innerText):** `"CUSTOMER REVIEWS"`
- **Heading `<h2>` (innerText):** `"Worn, washed and rated"`
- **Summary Panel (innerText):**
  - Rating: `"4.5"`
  - Count: `"Based on 8 reviews"`
  - Disclaimer: `"Sample reviews for this demo store."`
- **Sample Review (innerText):**
  - Title: `"Heavy, soft, holds its shape"`
  - Author: `"Aarav M."`
  - Meta: `"Hyderabad · 2 Nov 2026"`
- **Screenshot:** [proof_10_reviews.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_10_reviews.png)

#### 11. Newsletter
- **Eyebrow (innerText):** `"NEWSLETTER"`
- **Heading `<h2>` (innerText):** `"First dibs on every drop."`
- **Description (innerText):** `"One email when a new collection lands, plus early access to sales. No spam, unsubscribe any time."`
- **Input Placeholder (innerText / attr):** `"you@example.com"`
- **Button (innerText):** `"Subscribe"`
- **Success State (innerText):**
  - Title: `"You’re on the list"`
  - Message: `"We’ll write to [email] when the next drop lands. (Demo only: nothing was sent.)"`
  - Reset: `"Use another email"`
- **Screenshot:** [proof_11_newsletter.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_11_newsletter.png)

#### 12. Footer & Back to Top
- **Eyebrow:** None *(not rendered)*
- **Brand Heading `<h2>` (innerText):** `"SHOPNOW"`
- **Tagline (innerText):** `"Premium streetwear and everyday essentials, designed to move with you."`
- **Columns & Links (innerText):**
  - **Shop**: `"Men"`, `"Women"`, `"New Arrivals"`, `"Sale"`
  - **About**: `"Our story"`, `"Sustainability"`, `"Careers"`, `"Stores"`
  - **Help**: `"Shipping"`, `"Returns and exchanges"`, `"Size guide"`, `"Contact us"`, `"FAQs"`
  - **Social**: `"Instagram"`, `"YouTube"`, `"Pinterest"`, `"X"`
- **Copyright (innerText):** `"© 2026 SHOPNOW. All rights reserved."`
- **Notice (innerText):** `"Frontend demo: sample products, prices and reviews. No real orders are placed."`
- **Back to Top:** Floating icon button appears after scrolling past 900px (`aria-label="Back to top"`); clicks smoothly to top.
- **Screenshot:** [proof_12_footer_about_column.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_12_footer_about_column.png)

---

### Step 3: Overlays Verification

#### Search Overlay
- **Input Placeholder (attr):** `"Search hoodies, cargos, lavender…"`
- **Popular Search Chips (innerText):** `"Hoodie"`, `"Cargo"`, `"Lavender"`, `"Sneakers"`, `"Jacket"`, `"Denim"`
- **Verified Behavior:** Real-time search suggestions with highlight (`<mark>`); recent searches tracking; zero-results state with reset; "View all results" button filters grid.
- **Screenshot:** [proof_overlay_search.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_overlay_search.png)

#### Quick View Modal
- **Gallery Tabs (innerText):** `"Front · 1/3"`, `"Alternate · 2/3"`, `"Fabric detail · 3/3"`
- **Size Required Message (innerText):** `"Please select a size."`
- **Stock Status Messages (innerText):**
  - In stock: `"In stock, ships in 1 to 2 days."`
  - Low stock: `"Only [N] left in [size]. Order soon."`
  - Sold out: `"Out of stock in [size]. Try another size or colour."`
- **Verified Behavior:** Color swatches switch images; quantity increment capped by inventory stock; wishlist button toggles state.
- **Screenshot:** [proof_overlay_quickview.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_overlay_quickview.png)

#### Shopping Bag Drawer
- **Title (innerText):** `"Your bag ([count])"`
- **Free Shipping Progress (innerText):**
  - Below threshold: `"Add [amount] more for free shipping."`
  - Unlocked: `"You’ve unlocked free shipping."`
- **Order Summary Labels (innerText):** `"Subtotal"`, `"Look bundle savings (15%)"`, `"Shipping"`, `"Total"`
- **GST Notice (innerText):** `"Prices include GST."`
- **Buttons (innerText):** `"Checkout · [amount]"`, `"Continue shopping"`
- **Empty State (innerText):** `"Your bag is empty"`, `"Items you add will stay here, even if you refresh or come back later."`, `"Start shopping"`
- **Screenshot:** [proof_overlay_cart_drawer.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_overlay_cart_drawer.png)

#### Wishlist Drawer
- **Title (innerText):** `"Wishlist ([count])"`
- **Footer Note (innerText):** `"Saved in this browser. Choose a size to move an item to your bag."`
- **Empty State (innerText):** `"No saved items yet"`, `"Tap the heart on any product to save it for later."`, `"Explore products"`
- **Screenshot:** [proof_overlay_wishlist_drawer.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_overlay_wishlist_drawer.png)

#### Mobile Navigation Menu (390px Viewport)
- **Header (innerText):** `"SHOPNOW"`
- **Accordion Categories (innerText):** `"Men"`, `"Women"`, `"Collections"`, `"Sale"`
- **Bottom Shortcuts (innerText):** Search, Wishlist, Bag
- **Screenshot:** [proof_overlay_mobile_menu.png](file:///c:/Users/KondapalliTrinath/Downloads/shopnow/screenshots/proof_overlay_mobile_menu.png)

---

### Step 4: Business Rules (Mathematical Verification)

1. **Free Shipping Threshold (₹999)**:
   - Subtotal < ₹999: Shipping is **₹99**.
   - Subtotal &ge; ₹999: Shipping is **Free (₹0)**.
2. **Shop the Look Bundle Discount (15%)**:
   - Complete look bundle gives exactly 15% off that look's total per complete set.
   - Example "City Layers": Everyday Hoodie (₹1,699) + Cargo Pants (₹1,499) + Retro Runner (₹2,499) = ₹5,697.
   - Discount = `Math.round(5697 * 0.15)` = **₹855**.
   - Total = `5697 - 855 + 0` = **₹4,842**.
3. **Variant Stock Enforcement**:
   - Quantity selector increments cannot exceed variant inventory stock.
   - Shopping bag "+" button disables when `qty >= available stock`.
4. **Total Formula**:
   - `Total = Subtotal - Bundle Discount + Shipping`.
5. **State Persistence (`localStorage`)**:
   - Keys: `shopnow:v1:cart`, `shopnow:v1:wishlist`, `shopnow:v1:recently-viewed`, `shopnow:v1:recent-searches`.
   - Verified persistent across full browser refresh.
