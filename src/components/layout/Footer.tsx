import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ArrowUp, Clock, Facebook, Globe, Instagram, Mail, MapPin, MessageCircle, Phone, Youtube } from 'lucide-react';
import type { ExploreState } from '../../types';
import { SITE_INFO } from '../../config/siteInfo';
import { prefersReducedMotion, scrollToId } from '../../lib/utils';
import { AFFILIATE_PATH, linkHandler, navigate } from '../../lib/router';
import { useShop, type InfoType } from '../../store/ShopProvider';
import { BrandLogo } from './BrandLogo';

const SHOP_LINKS: { label: string; patch?: Partial<ExploreState>; anchor?: string }[] = [
  { label: 'Men', patch: { tab: 'men' } },
  { label: 'Women', patch: { tab: 'women' } },
  { label: 'Ethnic Wear', patch: { tab: 'ethnic' } },
  { label: 'Festive Edit', patch: { tab: 'festive' } },
  { label: 'New Arrivals', patch: { tab: 'new' } },
  { label: 'Sale', patch: { tab: 'sale' } },
  { label: 'Trending', anchor: 'trending' },
  { label: 'Customer Reviews', anchor: 'reviews' },
];

const HELP_LINKS: { label: string; modal: InfoType }[] = [
  { label: 'Size guide', modal: 'size-guide' },
  { label: 'Garment care', modal: 'care' },
  { label: 'FAQs', modal: 'faq' },
];

const POLICIES: { label: string; href: string }[] = [
  { label: 'Privacy policy', href: SITE_INFO.policies.privacyUrl },
  { label: 'Terms of service', href: SITE_INFO.policies.termsUrl },
  { label: 'Shipping policy', href: SITE_INFO.policies.shippingUrl },
  { label: 'Returns & refunds', href: SITE_INFO.policies.returnsUrl },
];

const SOCIAL: { label: string; icon: typeof Instagram; href: string }[] = [
  { label: 'Instagram', icon: Instagram, href: SITE_INFO.social.instagram },
  { label: 'Facebook', icon: Facebook, href: SITE_INFO.social.facebook },
  { label: 'YouTube', icon: Youtube, href: SITE_INFO.social.youtube },
];

const linkCls = 'inline-flex min-h-11 items-center gap-2 text-left text-dark-muted transition-colors duration-150 hover:text-accent-dark focus-visible:outline-accent-dark md:min-h-9';
const headCls = 'mb-2 font-display text-[20px] font-semibold tracking-normal text-text-inverse';

/** Simple payment marks: text in a rounded rectangle, each with an accessible name. */
function PayMark({ label, width = 52, children }: { label: string; width?: number; children: ReactNode }) {
  return (
    <li>
      <svg width={width} height={32} viewBox={`0 0 ${width} 32`} role="img" aria-label={label}>
        <title>{label}</title>
        <rect x="0.5" y="0.5" width={width - 1} height="31" rx="5" fill="var(--color-bg)" stroke="var(--color-border)" />
        {children}
      </svg>
    </li>
  );
}

function PaymentMethods() {
  const text = { fontFamily: 'var(--font-sans)', fontWeight: 700, textAnchor: 'middle' as const };
  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Payment methods">
      <PayMark label="UPI"><text x="26" y="21" fontSize="13" fill="var(--color-text)" style={text}>UPI</text></PayMark>
      <PayMark label="Visa"><text x="26" y="21" fontSize="13" fill="var(--color-accent)" fontStyle="italic" style={text}>VISA</text></PayMark>
      <PayMark label="Mastercard">
        <circle cx="21" cy="16" r="8" fill="var(--color-accent)" />
        <circle cx="31" cy="16" r="8" fill="var(--color-rating)" fillOpacity="0.9" />
      </PayMark>
      <PayMark label="RuPay"><text x="26" y="21" fontSize="12" fill="var(--color-text)" fontStyle="italic" style={text}>RuPay</text></PayMark>
      <PayMark label="Net banking" width={92}><text x="46" y="20" fontSize="12" fill="var(--color-text)" style={text}>Net banking</text></PayMark>
    </ul>
  );
}

/** Footer: about, shop links, help and policies, contact, payment methods and the affiliate programme. */
export function Footer() {
  const { shopWith, openInfo } = useShop();

  const goToAnchor = (id: string) => {
    if (window.location.pathname !== '/') { navigate('/'); window.setTimeout(() => scrollToId(id), 120); }
    else scrollToId(id);
  };

  return (
    <footer id="site-footer" className="relative overflow-hidden bg-text text-[14px] text-dark-muted" aria-label="Site footer">
      <div className="container-x pt-14 md:pt-20">
        <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* About */}
          <div className="sm:col-span-2 lg:col-span-4 lg:pr-6">
            <a href="/" onClick={linkHandler('/')} aria-label="SHOPNOW home" className="inline-block rounded focus-visible:outline-accent-dark">
              <BrandLogo tone="dark" markClassName="size-10" textClassName="text-[28px]" />
            </a>
            <h2 className={`${headCls} mt-6`}>About us</h2>
            <p className="max-w-sm text-[15px] leading-relaxed text-dark-muted">
              Ethnic and festive wear for India: kurtas, sarees, lehengas, kurtis and Nehru jackets, plus a small everyday range. Made for everyday comfort and for every celebration.
            </p>
            <a
              href={AFFILIATE_PATH}
              onClick={linkHandler(AFFILIATE_PATH)}
              className="group mr-3 mt-6 inline-flex min-h-11 items-center gap-2 rounded-pill border border-white/12 bg-white/5 px-5 font-semibold text-text-inverse transition-colors hover:border-accent-dark hover:bg-white/10 hover:text-accent-dark focus-visible:outline-accent-dark"
            >
              Become an affiliate <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
            </a>
            <p className="mt-5 inline-flex items-center gap-2 rounded-pill border border-white/12 bg-white/5 px-3 py-1.5 text-[12px] text-dark-muted">
              <Globe size={13} className="text-accent-dark" aria-hidden="true" /> India · INR (₹) · English
            </p>
          </div>

          {/* Shop */}
          <nav className="lg:col-span-2" aria-labelledby="footer-shop">
            <h2 id="footer-shop" className={headCls}>Shop</h2>
            <ul>
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <button type="button" onClick={() => (link.patch ? shopWith(link.patch) : link.anchor && goToAnchor(link.anchor))} className={linkCls}>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Help and policies */}
          <nav className="lg:col-span-3" aria-labelledby="footer-help">
            <h2 id="footer-help" className={headCls}>Help</h2>
            <ul>
              {HELP_LINKS.map((l) => (
                <li key={l.label}><button type="button" onClick={() => openInfo(l.modal)} className={linkCls}>{l.label}</button></li>
              ))}
            </ul>
            <h2 className={`${headCls} mt-6`}>Policies</h2>
            <ul>
              {POLICIES.map((l) => (
                <li key={l.label}>
                  <a href={l.href} onClick={linkHandler(l.href)} className={linkCls}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h2 className={headCls}>Contact</h2>
            <address className="not-italic">
              <ul className="space-y-1">
                <li className="flex min-h-9 items-start gap-2.5 py-1">
                  <Phone size={16} className="mt-0.5 shrink-0 text-accent-dark" aria-hidden="true" />
                  <a href={SITE_INFO.contact.phoneHref} className="text-dark-muted hover:text-accent-dark focus-visible:outline-accent-dark">
                    <span className="sr-only">Phone: </span>{SITE_INFO.contact.phone}
                  </a>
                </li>
                <li className="flex min-h-9 items-start gap-2.5 py-1">
                  <Mail size={16} className="mt-0.5 shrink-0 text-accent-dark" aria-hidden="true" />
                  <a href={SITE_INFO.contact.emailHref} className="text-dark-muted hover:text-accent-dark focus-visible:outline-accent-dark">
                    <span className="sr-only">Email: </span>{SITE_INFO.contact.email}
                  </a>
                </li>
                <li className="flex min-h-9 items-start gap-2.5 py-1">
                  <MessageCircle size={16} className="mt-0.5 shrink-0 text-accent-dark" aria-hidden="true" />
                  <a href={SITE_INFO.contact.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-dark-muted hover:text-accent-dark focus-visible:outline-accent-dark">
                    WhatsApp: {SITE_INFO.contact.whatsapp}
                  </a>
                </li>
                <li className="flex min-h-9 items-start gap-2.5 py-1">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-accent-dark" aria-hidden="true" />
                  <span><span className="sr-only">Address: </span>{SITE_INFO.contact.address}</span>
                </li>
                <li className="flex min-h-9 items-start gap-2.5 py-1">
                  <Clock size={16} className="mt-0.5 shrink-0 text-accent-dark" aria-hidden="true" />
                  <span><span className="sr-only">Business hours: </span>{SITE_INFO.contact.hours}</span>
                </li>
              </ul>
            </address>
            <h2 className={`${headCls} mt-6`}>Follow us</h2>
            <ul>
              {SOCIAL.map((s) => {
                const Icon = s.icon;
                return (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                      <Icon size={16} aria-hidden="true" className="text-accent-dark" /> {s.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Sub-footer: payment methods and copyright */}
        <div className="mt-12 flex flex-col gap-5 border-t border-white/12 py-8 md:flex-row md:items-center md:justify-between" style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-dark-muted">We accept</p>
            <PaymentMethods />
          </div>
          <p className="text-[13px] text-dark-muted">© {new Date().getFullYear()} SHOPNOW. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

/**
 * Back to top: appears after two screens of scrolling, sits 24px from the corner (plus safe area), and
 * steps aside while the footer or any [data-avoid-fab] control (e.g. "Load more") is near its corner.
 */
export function BackToTop() {
  const [past, setPast] = useState(false);
  const [footerInView, setFooterInView] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const h = window.innerHeight;
      const w = window.innerWidth;
      setPast(window.scrollY > 2 * h);
      // The button's corner zone (48px button + 24px gap + 16px breathing room).
      const zoneTop = h - 24 - 48 - 16;
      const zoneLeft = w - 24 - 48 - 16;
      const hit = [...document.querySelectorAll<HTMLElement>('[data-avoid-fab]')].some((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.bottom > zoneTop && r.top < h && r.right > zoneLeft;
      });
      setBlocked(hit);
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(read); };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const footer = document.getElementById('site-footer');
    if (!footer || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setFooterInView(e.isIntersecting));
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  const show = past && !footerInView && !blocked;
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })}
          className="fixed z-30 grid size-12 place-items-center rounded-full bg-action text-action-text shadow-[var(--shadow-pop)] transition-colors hover:bg-action-hover"
          style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom))', right: 'calc(1.5rem + env(safe-area-inset-right))' }}
          aria-label="Back to top"
        >
          <ArrowUp size={20} aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
