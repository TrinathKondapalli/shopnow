import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { MobileMenu } from './components/layout/MobileMenu';
import { BackToTop, Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { ShopHighlights } from './components/sections/ShopHighlights';
import { Categories } from './components/sections/Categories';
import { Explore } from './components/sections/Explore';
import { Featured } from './components/sections/Featured';
import { Trending } from './components/sections/Trending';
import { ShopTheLook } from './components/sections/ShopTheLook';
import { RecentlyViewed } from './components/sections/RecentlyViewed';
import { Reviews } from './components/sections/Reviews';
import { Newsletter } from './components/sections/Newsletter';
import { SearchOverlay } from './components/overlays/SearchOverlay';
import { QuickView } from './components/overlays/QuickView';
import { CartDrawer } from './components/overlays/CartDrawer';
import { WishlistDrawer } from './components/overlays/WishlistDrawer';
import { Toaster } from './components/overlays/Toaster';

/** The SHOPNOW landing page: 12 sections in order, plus four overlays. */
export default function App() {
  return (
    <>
      <a href="#shop" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
        Skip to products
      </a>
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <ShopHighlights />
        <Categories />
        <Explore />
        <Featured />
        <Trending />
        <ShopTheLook />
        <RecentlyViewed />
        <Reviews />
        <Newsletter />
      </main>
      <Footer />
      <BackToTop />

      <MobileMenu />
      <SearchOverlay />
      <QuickView />
      <WishlistDrawer />
      <CartDrawer />
      <Toaster />
    </>
  );
}
