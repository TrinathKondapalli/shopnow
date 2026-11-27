import { ArrowRight } from 'lucide-react';
import { SITE_INFO } from '../../config/siteInfo';
import { linkHandler } from '../../lib/router';

/**
 * Centered affiliate big-offer banner at the top of the home page.
 * Uses the button-free artwork and overlays an accessible, interactive "Join Now" button.
 */
export function TopHeroBanner() {
  return (
    <section
      className="w-full border-b border-border bg-bg py-3 sm:py-4"
      aria-label="Affiliate program offer"
    >
      <div className="container-x">
        <div className="mx-auto max-w-[1320px]">
          <div className="relative overflow-hidden rounded-[var(--radius-modal)] shadow-[var(--shadow-card)]">
            <img
              src="/figma/banners/affiliate-big-offer.png"
              alt="Limited time offer: Join our Affiliate Program, earn 10% commission on every sale, plus free 0.5g gold, 5g silver, and 1 saree"
              className="block h-auto w-full"
              decoding="async"
            />
            {/* Desktop/tablet interactive button placed in the exact Join Now slot */}
            <a
              href={SITE_INFO.affiliate.signupUrl}
              onClick={linkHandler(SITE_INFO.affiliate.signupUrl)}
              className="group absolute left-[74.6%] top-[59%] hidden h-[12.2%] w-[16.8%] items-center justify-center gap-1.5 rounded-pill bg-rating text-[clamp(11px,1.25vw,18px)] font-bold text-text shadow-[var(--shadow-card)] transition-transform duration-150 hover:scale-[1.03] focus-visible:outline-accent-dark md:inline-flex"
            >
              <span>Join Now</span>
              <ArrowRight className="size-[1em] transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} aria-hidden="true" />
            </a>
          </div>

          {/* Mobile: full-size tappable button below the banner so it stays >= 44px tall */}
          <div className="mt-3 flex justify-center md:hidden">
            <a
              href={SITE_INFO.affiliate.signupUrl}
              onClick={linkHandler(SITE_INFO.affiliate.signupUrl)}
              className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-pill bg-rating px-6 text-[15px] font-bold text-text shadow-[var(--shadow-card)] transition-transform active:scale-95"
            >
              <span>Join Now</span>
              <ArrowRight size={17} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
