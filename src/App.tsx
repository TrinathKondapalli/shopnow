import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { MobileMenu } from './components/layout/MobileMenu';
import { BackToTop, Footer } from './components/layout/Footer';
import { TopHeroBanner } from './components/sections/TopHeroBanner';
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
import { QuickView } from './components/overlays/QuickView';
import { CartDrawer } from './components/overlays/CartDrawer';
import { WishlistDrawer } from './components/overlays/WishlistDrawer';
import { Toaster } from './components/overlays/Toaster';
import { InfoDialog } from './components/overlays/InfoDialog';
import { AffiliatePage } from './pages/AffiliatePage';
import { InfoPolicyPage } from './pages/InfoPolicyPage';
import { NotFound } from './pages/NotFound';
import { SITE_INFO } from './config/siteInfo';
import { AFFILIATE_PATH, usePath } from './lib/router';

function Home() {
  return (
    <>
      {/* On phones the hero comes first so its heading and CTA are in the first screen; the offer banner follows. */}
      <div className="flex flex-col">
        <div className="max-md:order-2"><TopHeroBanner /></div>
        <div className="max-md:order-1"><Hero /></div>
      </div>
      <ShopHighlights />
      <Categories />
      <Explore />
      <Featured />
      <Trending />
      <ShopTheLook />
      <RecentlyViewed />
      <Reviews />
      <Newsletter />
    </>
  );
}

/** SHOPNOW: the store home page and the /affiliate page share the header, footer and overlays. */
export default function App() {
  const path = usePath().replace(/\/+$/, '') || '/';
  // /product/<id> is the shareable product link: the home page with that product open
  // (ShopProvider opens it and rewrites the URL to /#p/<id>).
  const isHome = path === '/' || path.startsWith('/product/');
  let page = <NotFound />;
  if (isHome) page = <Home />;
  else if (path === AFFILIATE_PATH) page = <AffiliatePage />;
  else if (path === SITE_INFO.policies.privacyUrl) page = <InfoPolicyPage title="Privacy policy" body={SITE_INFO.policies.notice} />;
  else if (path === SITE_INFO.policies.termsUrl) page = <InfoPolicyPage title="Terms of service" body={SITE_INFO.policies.notice} />;
  else if (path === SITE_INFO.policies.shippingUrl) page = <InfoPolicyPage title="Shipping policy" body={SITE_INFO.policies.notice} />;
  else if (path === SITE_INFO.policies.returnsUrl) page = <InfoPolicyPage title="Returns & refunds" body={SITE_INFO.policies.notice} />;
  else if (path === SITE_INFO.affiliate.termsUrl) {
    page = <InfoPolicyPage title="Affiliate terms" body={SITE_INFO.affiliate.termsNotice} backHref={AFFILIATE_PATH} backLabel="Back to affiliate program" />;
  }

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-pill focus:bg-action focus:px-4 focus:py-2 focus:text-action-text">
        Skip to content
      </a>
      <AnnouncementBar />
      <Navbar />
      <main id="main">{page}</main>
      <Footer />
      <BackToTop />

      <MobileMenu />
      <QuickView />
      <WishlistDrawer />
      <CartDrawer />
      <InfoDialog />
      <Toaster />
    </>
  );
}
