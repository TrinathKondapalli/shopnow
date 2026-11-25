import { Headphones, ShieldCheck, Truck, UserRound } from 'lucide-react';
import { useShop } from '../../store/ShopProvider';

const PERKS = [
  { icon: Truck, text: 'Free shipping above ₹999' },
  { icon: ShieldCheck, text: 'Secure & safe payments' },
  { icon: Headphones, text: '24/7 customer support' },
];

/** Utility bar above the header: service promises on the left, greeting on the right. */
export function AnnouncementBar() {
  const { toast } = useShop();
  return (
    <div className="relative z-50 bg-ink text-white" role="region" aria-label="Store information">
      <div className="container-x flex h-10 items-center justify-center gap-6 text-[13px] font-medium md:h-12 md:justify-between md:text-[15px]">
        <ul className="flex items-center">
          {PERKS.map(({ icon: Icon, text }, i) => (
            <li
              key={text}
              className={
                i === 0
                  ? 'flex items-center gap-2.5'
                  : 'hidden items-center gap-2.5 border-l border-white/25 pl-8 ml-8 md:flex xl:pl-10 xl:ml-10'
              }
            >
              <Icon size={20} strokeWidth={1.8} className="text-lav-300" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => toast({ title: 'Welcome to SHOPNOW', description: 'Accounts are coming soon. Your bag and wishlist are saved on this device.', tone: 'info' })}
          className="hidden items-center gap-2.5 transition-colors hover:text-lav-300 md:flex"
        >
          Welcome to SHOPNOW
          <UserRound size={20} strokeWidth={1.8} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
