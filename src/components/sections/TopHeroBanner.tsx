import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Gift, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { useShop } from '../../store/ShopProvider';
import { cn } from '../../lib/utils';
import { DUR, EASE } from '../../lib/motion';

interface PromoBanner {
  id: string;
  img: string;
  alt: string;
  title: string;
  ctaText: string;
  type: 'affiliate' | 'festive' | 'wedding';
}

const BANNERS: PromoBanner[] = [
  {
    id: 'affiliate',
    img: '/figma/banners/affiliate-offer-banner.jpg',
    alt: 'Limited Time Offer - Big Offer: Free 0.5g Gold, 5g Silver, 1 Saree. Join our Affiliate Program - Earn 10% commission on every sale.',
    title: 'Affiliate Program & Welcome Rewards',
    ctaText: 'Join Affiliate Program',
    type: 'affiliate',
  },
  {
    id: 'festive-50',
    img: '/figma/banners/festive-offer-banner.jpg',
    alt: 'Festive Season Dhamaka: Flat 50% Off on Handloom Sarees, Kurtas & Royal Bandhgalas. Use Code FESTIVE50.',
    title: 'Festive 50% Off Dhamaka',
    ctaText: 'Shop Festive Sale',
    type: 'festive',
  },
  {
    id: 'wedding-special',
    img: '/figma/banners/wedding-offer-banner.jpg',
    alt: 'Royal Wedding Collection: Bridal & Ceremonial embroidered lehengas and Kanjeevaram silks.',
    title: 'Royal Wedding Collection',
    ctaText: 'Explore Wedding Edit',
    type: 'wedding',
  },
];

/**
 * Top scrollable/rotatable banner carousel displayed right at the top hero section.
 * Supports auto-rotation, smooth swipe/scroll navigation, and interactive affiliate modal.
 */
export function TopHeroBanner() {
  const { shopWith, pushToast } = useShop();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);
  const [affiliateEmail, setAffiliateEmail] = useState('');
  const [affiliateName, setAffiliateName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Auto-scroll every 6 seconds unless paused
  useEffect(() => {
    if (isPaused || showAffiliateModal) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, showAffiliateModal]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % BANNERS.length);
  };

  const handleBannerClick = (banner: PromoBanner) => {
    if (banner.type === 'affiliate') {
      setShowAffiliateModal(true);
    } else if (banner.type === 'festive') {
      shopWith({ tab: 'sale' });
    } else if (banner.type === 'wedding') {
      shopWith({ tab: 'festive' });
    }
  };

  const handleAffiliateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliateEmail || !affiliateName) return;
    setIsSubmitted(true);
    pushToast({
      id: Date.now(),
      tone: 'success',
      title: 'Affiliate Application Submitted!',
      description: `Welcome, ${affiliateName}! Your 10% commission link and welcome gift instructions have been sent to ${affiliateEmail}.`,
    });
    setTimeout(() => {
      setShowAffiliateModal(false);
      setIsSubmitted(false);
      setAffiliateEmail('');
      setAffiliateName('');
    }, 2000);
  };

  return (
    <>
      <div
        className="w-full bg-[#FAF6F0] py-2 sm:py-3 border-b border-[#EADFCF]/60"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        role="region"
        aria-roledescription="carousel"
        aria-label="Promotional campaign banners"
      >
        <div className="container-x">
          <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-[0_4px_20px_-8px_rgba(20,10,40,0.18)] bg-white aspect-[3/1] max-h-[220px] sm:max-h-[260px] md:max-h-[300px]">
            {/* Scrollable / Rotatable Slide Frame */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={BANNERS[currentIdx].id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="size-full cursor-pointer"
                onClick={() => handleBannerClick(BANNERS[currentIdx])}
              >
                <img
                  src={BANNERS[currentIdx].img}
                  alt={BANNERS[currentIdx].alt}
                  className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.015]"
                />
              </motion.div>
            </AnimatePresence>

            {/* Left Chevron */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous promotional banner"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 grid size-8 sm:size-10 place-items-center rounded-full bg-black/45 text-white backdrop-blur-md transition-all hover:bg-black/75 hover:scale-105 active:scale-95 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 z-10"
            >
              <ChevronLeft size={20} strokeWidth={2.4} />
            </button>

            {/* Right Chevron */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next promotional banner"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 grid size-8 sm:size-10 place-items-center rounded-full bg-black/45 text-white backdrop-blur-md transition-all hover:bg-black/75 hover:scale-105 active:scale-95 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 z-10"
            >
              <ChevronRight size={20} strokeWidth={2.4} />
            </button>

            {/* Pagination Dots indicator */}
            <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm z-10">
              {BANNERS.map((b, idx) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIdx(idx);
                  }}
                  aria-label={`Jump to banner ${idx + 1}`}
                  className={cn(
                    'h-1.5 sm:h-2 rounded-full transition-all duration-300',
                    idx === currentIdx
                      ? 'w-5 sm:w-7 bg-white shadow-sm'
                      : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/70'
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Affiliate Program Modal */}
      <AnimatePresence>
        {showAffiliateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-line overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="affiliate-title"
            >
              <button
                type="button"
                onClick={() => setShowAffiliateModal(false)}
                className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-ink-2 hover:bg-lav-100 transition-colors"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-purple/10 text-purple">
                  <Gift size={22} />
                </span>
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-wider text-purple">Partner & Earn</p>
                  <h3 id="affiliate-title" className="text-xl font-extrabold text-ink sm:text-2xl">
                    SHOPNOW Affiliate Program
                  </h3>
                </div>
              </div>

              {isSubmitted ? (
                <div className="mt-6 flex flex-col items-center py-6 text-center">
                  <CheckCircle2 size={48} className="text-emerald-500 animate-bounce" />
                  <h4 className="mt-4 text-lg font-bold text-ink">Welcome to the Partner Team!</h4>
                  <p className="mt-1 text-sm text-ink-2">
                    Check your inbox for your exclusive tracking link and welcome gold/silver reward voucher.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-4 rounded-xl bg-[#F6EEFF] p-4 text-[13.5px] text-ink leading-relaxed border border-lav-200">
                    <p className="font-bold text-purple flex items-center gap-1.5">
                      <Sparkles size={16} /> Exclusive Limited Time Perks:
                    </p>
                    <ul className="mt-2 space-y-1 text-ink-2">
                      <li>• <strong>10% commission</strong> paid directly to your bank account on every sale</li>
                      <li>• <strong>FREE 0.5g Gold / 5g Silver / 1 Saree</strong> welcome gift on your first 5 referrals</li>
                      <li>• Real-time dashboard tracking &amp; 24/7 dedicated affiliate support</li>
                    </ul>
                  </div>

                  <form onSubmit={handleAffiliateSubmit} className="mt-5 space-y-3.5">
                    <div>
                      <label htmlFor="affiliate-name" className="block text-xs font-semibold uppercase text-ink">
                        Your Full Name
                      </label>
                      <input
                        id="affiliate-name"
                        type="text"
                        required
                        placeholder="e.g. Priya Sharma"
                        value={affiliateName}
                        onChange={(e) => setAffiliateName(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-purple focus:ring-2 focus:ring-purple/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="affiliate-email" className="block text-xs font-semibold uppercase text-ink">
                        Email Address
                      </label>
                      <input
                        id="affiliate-email"
                        type="email"
                        required
                        placeholder="priya@example.com"
                        value={affiliateEmail}
                        onChange={(e) => setAffiliateEmail(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-purple focus:ring-2 focus:ring-purple/20"
                      />
                    </div>

                    <button
                      type="submit"
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-purple py-3 text-sm font-bold text-white shadow-md hover:bg-purple-hover active:scale-[0.99] transition-all"
                    >
                      Join Now &amp; Claim Welcome Rewards →
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
