import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, HelpCircle, RefreshCw, Ruler, Sparkles, Truck, X } from 'lucide-react';
import { useDialog, useLockBodyScroll } from '../../hooks/useOverlay';
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
        className="relative z-10 w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl border border-white/15 bg-[#121216] p-6 text-white shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 grid size-9 place-items-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {type === 'size-guide' && (
          <div>
            <div className="flex items-center gap-3 text-lav-300">
              <Ruler size={22} />
              <span className="eyebrow text-lav-300">Size & Measurements</span>
            </div>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">Garment Size Guide</h3>
            <p className="mt-1 text-sm text-white/60">
              Designed with a relaxed streetwear drape. Choose your standard size for an oversized look, or size down for a tailored fit.
            </p>

            <div className="mt-5 flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/40">Tops & Outerwear</span>
              <div className="flex rounded-full bg-white/10 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setUnit('cm')}
                  className={`rounded-full px-3 py-1 font-semibold transition-colors ${unit === 'cm' ? 'bg-electric text-white' : 'text-white/60 hover:text-white'}`}
                >
                  CM
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('in')}
                  className={`rounded-full px-3 py-1 font-semibold transition-colors ${unit === 'in' ? 'bg-electric text-white' : 'text-white/60 hover:text-white'}`}
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
            <div className="flex items-center gap-3 text-lav-300">
              <Truck size={22} />
              <span className="eyebrow text-lav-300">Fast Dispatch</span>
            </div>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">Shipping & Delivery</h3>
            <p className="mt-1 text-sm text-white/60">
              We currently ship across India.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-white">Standard delivery across India</h4>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">3-5 Days</span>
                </div>
                <p className="mt-1 text-xs text-white/60">
                  Free shipping on orders above ₹999. A flat ₹99 delivery fee applies to smaller orders.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h4 className="font-semibold text-white">Same-Day Dispatch Guarantee</h4>
                <p className="mt-1 text-xs text-white/60">
                  All orders placed before 2:00 PM IST Monday through Saturday are securely packed and dispatched the same afternoon.
                </p>
              </div>
            </div>
          </div>
        )}

        {type === 'returns' && (
          <div>
            <div className="flex items-center gap-3 text-lav-300">
              <RefreshCw size={22} />
              <span className="eyebrow text-lav-300">Guaranteed Peace of Mind</span>
            </div>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">7-Day Returns & Exchanges</h3>
            <p className="mt-1 text-sm text-white/60">
              Need another size or changed your mind? Return or exchange any unworn piece within 7 days of delivery.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-electric text-sm font-bold">1</span>
                <div>
                  <h4 className="text-sm font-semibold text-white">Contact us within 7 days</h4>
                  <p className="text-xs text-white/60">Tell us your order details and the size you need, or that you want a refund.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-electric text-sm font-bold">2</span>
                <div>
                  <h4 className="text-sm font-semibold text-white">Doorstep Courier Pickup</h4>
                  <p className="text-xs text-white/60">Our courier collects the original garment directly from your doorstep at zero extra cost.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-electric text-sm font-bold">3</span>
                <div>
                  <h4 className="text-sm font-semibold text-white">Replacement or refund</h4>
                  <p className="text-xs text-white/60">Once the piece reaches us, we ship your new size or refund you to the original payment method.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {type === 'care' && (
          <div>
            <div className="flex items-center gap-3 text-lav-300">
              <Sparkles size={22} />
              <span className="eyebrow text-lav-300">Fabric Longevity</span>
            </div>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">Garment Care Guide</h3>
            <p className="mt-1 text-sm text-white/60">
              Crafted from 400 GSM custom-milled heavyweight combed cotton and Japanese hardware. Maintain pristine condition with simple steps.
            </p>

            <ul className="mt-6 space-y-3 text-xs text-white/70">
              <li className="flex items-start gap-2.5">
                <Check size={16} className="shrink-0 text-emerald-400 mt-0.5" />
                <span>Wash cold (30°C / 85°F) inside-out with gentle detergent to protect pigments and custom textures.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={16} className="shrink-0 text-emerald-400 mt-0.5" />
                <span>Line dry in shade. Avoid machine tumble drying to prevent shrinking and preserve drape.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={16} className="shrink-0 text-emerald-400 mt-0.5" />
                <span>Iron inside out on medium heat if required. Do not iron directly on screenprints or heat-stamped logos.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={16} className="shrink-0 text-emerald-400 mt-0.5" />
                <span>Do not bleach or dry clean. Our fabrics develop a richer character the more you wear and wash them.</span>
              </li>
            </ul>
          </div>
        )}

        {type === 'faq' && (
          <div>
            <div className="flex items-center gap-3 text-lav-300">
              <HelpCircle size={22} />
              <span className="eyebrow text-lav-300">Common Inquiries</span>
            </div>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">Frequently Asked Questions</h3>

            <div className="mt-6 space-y-4 text-xs">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h4 className="font-semibold text-white">How do SHOPNOW drops work?</h4>
                <p className="mt-1.5 text-white/60 leading-relaxed">
                  We release collections in numbered seasonal drops (e.g. Drop 01). Each piece is produced in limited archival batches to eliminate deadstock.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h4 className="font-semibold text-white">Are all sizes true to fit?</h4>
                <p className="mt-1.5 text-white/60 leading-relaxed">
                  All hoodies and sweatshirts feature an oversized boxy drape. Our T-shirts have relaxed shoulders. If you prefer a fitted silhouette, take one size down.
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
