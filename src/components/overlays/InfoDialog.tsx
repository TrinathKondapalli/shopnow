import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, HelpCircle, RefreshCw, Ruler, Sparkles, Truck, X } from 'lucide-react';
import { useDialog, useLockBodyScroll } from '../../hooks/useOverlay';
import { SITE_INFO } from '../../config/siteInfo';
import { useShop, type InfoType } from '../../store/ShopProvider';

const TITLES: Record<InfoType, string> = {
  'size-guide': 'Size guide',
  shipping: 'Shipping and delivery',
  returns: 'Returns and exchanges',
  care: 'Garment care guide',
  faq: 'Frequently asked questions',
};

/** Store information dialogs (size guide, shipping, returns, care, FAQ). Opened from the footer and from quick view. */
export function InfoDialog() {
  const { info, closeInfo } = useShop();
  return <AnimatePresence>{info && <InfoPanel key={info} type={info} onClose={closeInfo} />}</AnimatePresence>;
}

function InfoPanel({ type, onClose }: { type: InfoType; onClose: () => void }) {
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const ref = useRef<HTMLDivElement>(null);
  useLockBodyScroll(true);
  useDialog(ref, true, onClose);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={TITLES[type]}
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-[var(--radius-modal)] border border-white/12 bg-text p-6 text-text-inverse shadow-[var(--shadow-pop)] sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white/10 text-dark-muted transition-colors hover:bg-white/20 hover:text-text-inverse focus-visible:outline-accent-dark"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {type === 'size-guide' && (
          <div>
            <div className="flex items-center gap-3 text-accent">
              <Ruler size={22} />
              <span className="eyebrow text-accent">Size & Measurements</span>
            </div>
            <h3 className="mt-2 font-display text-3xl font-semibold text-bg">Garment Size Guide</h3>
            <p className="mt-1 text-sm text-bg/80">
              Garment measurements for kurtas and everyday tops. Measure a piece that fits you well and compare. If you are between sizes, choose the larger one.
            </p>

            <div className="mt-5 flex items-center justify-between border-b border-bg/15 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-bg/80">Kurtas & tops</span>
              <div className="flex rounded-pill bg-bg/10 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setUnit('cm')}
                  className={`min-h-11 rounded-pill px-4 font-semibold transition-colors focus-visible:outline-accent ${unit === 'cm' ? 'bg-accent text-text' : 'text-bg/80 hover:text-bg'}`}
                >
                  CM
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('in')}
                  className={`min-h-11 rounded-pill px-4 font-semibold transition-colors focus-visible:outline-accent ${unit === 'in' ? 'bg-accent text-text' : 'text-bg/80 hover:text-bg'}`}
                >
                  INCHES
                </button>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs font-semibold uppercase text-white/40">
                    <th className="py-2.5">Size</th>
                    <th className="py-2.5">Chest</th>
                    <th className="py-2.5">Length</th>
                    <th className="py-2.5">Shoulder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-white/80">
                  {unit === 'cm' ? (
                    <>
                      <tr><td className="py-2.5 font-sans font-bold text-white">S</td><td>108 cm</td><td>70 cm</td><td>48 cm</td></tr>
                      <tr><td className="py-2.5 font-sans font-bold text-white">M</td><td>114 cm</td><td>72 cm</td><td>50 cm</td></tr>
                      <tr><td className="py-2.5 font-sans font-bold text-white">L</td><td>120 cm</td><td>74 cm</td><td>52 cm</td></tr>
                      <tr><td className="py-2.5 font-sans font-bold text-white">XL</td><td>126 cm</td><td>76 cm</td><td>54 cm</td></tr>
                      <tr><td className="py-2.5 font-sans font-bold text-white">XXL</td><td>132 cm</td><td>78 cm</td><td>56 cm</td></tr>
                    </>
                  ) : (
                    <>
                      <tr><td className="py-2.5 font-sans font-bold text-white">S</td><td>42.5"</td><td>27.5"</td><td>18.9"</td></tr>
                      <tr><td className="py-2.5 font-sans font-bold text-white">M</td><td>44.8"</td><td>28.3"</td><td>19.7"</td></tr>
                      <tr><td className="py-2.5 font-sans font-bold text-white">L</td><td>47.2"</td><td>29.1"</td><td>20.5"</td></tr>
                      <tr><td className="py-2.5 font-sans font-bold text-white">XL</td><td>49.6"</td><td>29.9"</td><td>21.2"</td></tr>
                      <tr><td className="py-2.5 font-sans font-bold text-white">XXL</td><td>52.0"</td><td>30.7"</td><td>22.0"</td></tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {type === 'shipping' && (
          <div>
            <div className="flex items-center gap-3 text-accent-dark">
              <Truck size={22} />
              <span className="eyebrow text-accent-dark">Fast Dispatch</span>
            </div>
            <h3 className="mt-2 font-display text-3xl font-semibold text-text-inverse">Shipping & Delivery</h3>
            <p className="mt-1 text-sm text-dark-muted">
              We currently ship across India.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-[var(--radius-card)] border border-white/12 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-semibold text-text-inverse">Standard delivery across India</h4>
                  <span className="shrink-0 rounded-pill bg-accent px-2.5 py-0.5 text-xs font-semibold text-text-inverse">{SITE_INFO.delivery.badge}</span>
                </div>
                <p className="mt-1 text-sm text-dark-muted">
                  {SITE_INFO.delivery.message}. Free shipping on orders above ₹999; a flat ₹99 delivery fee applies to smaller orders.
                </p>
              </div>

              <div className="rounded-[var(--radius-card)] border border-white/12 bg-white/5 p-4">
                <h4 className="font-semibold text-text-inverse">Same-Day Dispatch Guarantee</h4>
                <p className="mt-1 text-sm text-dark-muted">
                  All orders placed before 2:00 PM IST Monday through Saturday are securely packed and dispatched the same afternoon.
                </p>
              </div>
            </div>
          </div>
        )}

        {type === 'returns' && (
          <div>
            <div className="flex items-center gap-3 text-accent">
              <RefreshCw size={22} />
              <span className="eyebrow text-accent">Guaranteed Peace of Mind</span>
            </div>
            <h3 className="mt-2 font-display text-3xl font-semibold text-bg">7-Day Returns & Exchanges</h3>
            <p className="mt-1 text-sm text-bg/80">
              Need another size or changed your mind? Return or exchange any unworn piece within 7 days of delivery.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-sm font-bold text-text">1</span>
                <div>
                  <h4 className="text-sm font-semibold text-bg">Contact us within 7 days</h4>
                  <p className="text-sm text-bg/80">Tell us your order details and the size you need, or that you want a refund.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-sm font-bold text-text">2</span>
                <div>
                  <h4 className="text-sm font-semibold text-bg">Doorstep Courier Pickup</h4>
                  <p className="text-sm text-bg/80">Our courier collects the original garment directly from your doorstep at zero extra cost.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-sm font-bold text-text">3</span>
                <div>
                  <h4 className="text-sm font-semibold text-bg">Replacement or refund</h4>
                  <p className="text-sm text-bg/80">Once the piece reaches us, we ship your new size or refund you to the original payment method.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {type === 'care' && (
          <div>
            <div className="flex items-center gap-3 text-accent">
              <Sparkles size={22} />
              <span className="eyebrow text-accent">Fabric Longevity</span>
            </div>
            <h3 className="mt-2 font-display text-3xl font-semibold text-bg">Garment Care Guide</h3>
            <p className="mt-1 text-sm text-bg/80">
              Always follow the care label on each piece first. These general steps keep everyday cotton pieces looking their best.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-bg/80">
              <li className="flex items-start gap-2.5">
                <Check size={16} className="shrink-0 text-accent mt-0.5" />
                <span>Wash cold (30°C / 85°F) inside-out with gentle detergent to protect pigments and custom textures.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={16} className="shrink-0 text-accent mt-0.5" />
                <span>Line dry in shade. Avoid machine tumble drying to prevent shrinking and preserve drape.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={16} className="shrink-0 text-accent mt-0.5" />
                <span>Iron inside out on medium heat if required. Do not iron directly on prints, embroidery or embellishments.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={16} className="shrink-0 text-accent mt-0.5" />
                <span>Do not bleach. For embroidered, zari or embellished festive pieces, follow the care label.</span>
              </li>
            </ul>
          </div>
        )}

        {type === 'faq' && (
          <div>
            <div className="flex items-center gap-3 text-accent">
              <HelpCircle size={22} />
              <span className="eyebrow text-accent">Common Inquiries</span>
            </div>
            <h3 className="mt-2 font-display text-3xl font-semibold text-bg">Frequently Asked Questions</h3>

            <div className="mt-6 space-y-4 text-sm">
              <div className="rounded-[var(--radius-card)] border border-bg/15 bg-bg/5 p-4">
                <h4 className="font-semibold text-white">How do sizes work for sarees, lehengas and Nehru jackets?</h4>
                <p className="mt-1.5 text-white/60 leading-relaxed">
                  Sarees are free size. Lehengas come semi-stitched in a free size. Nehru jackets are sized by chest (38 to 46). Kurtas and kurtis use letter sizes (XS to XXL); see the size guide.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h4 className="font-semibold text-white">Are all sizes true to fit?</h4>
                <p className="mt-1.5 text-white/60 leading-relaxed">
                  In our everyday range, hoodies and sweatshirts have a relaxed, boxy fit. Our T-shirts have relaxed shoulders. If you prefer a fitted silhouette, take one size down.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h4 className="font-semibold text-white">What payment methods are supported?</h4>
                <p className="mt-1.5 text-white/60 leading-relaxed">
                  UPI (GPay, PhonePe, Paytm), Credit/Debit cards, Net Banking, and Cash on Delivery (COD) across India.
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
