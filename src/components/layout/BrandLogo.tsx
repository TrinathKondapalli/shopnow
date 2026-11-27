import { cn } from '../../lib/utils';

/** SHOPNOW mark: a shopping bag with an "N" cut-out. Shared by the header and footer. */
export function BrandMark({ className, tone = 'light' }: { className?: string; tone?: 'light' | 'dark' }) {
  const bag = tone === 'dark' ? 'var(--color-accent-dark)' : 'var(--color-accent)';
  const flap = tone === 'dark' ? 'var(--color-accent-dark)' : 'var(--color-accent-hover)';
  const letter = tone === 'dark' ? 'var(--color-text)' : 'var(--color-text-inverse)';
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M22 20v-4a10 10 0 0 1 20 0v4" fill="none" stroke={bag} strokeWidth="5" strokeLinecap="round" />
      <path d="M10 22a4 4 0 0 1 4-4h36a4 4 0 0 1 4 4l-3 32a6 6 0 0 1-6 6H19a6 6 0 0 1-6-6z" fill={bag} />
      <path d="M10 22a4 4 0 0 1 4-4h36a4 4 0 0 1 4 4l-1 10C40 40 24 40 11 33z" fill={flap} />
      <path d="M23 49V31l18 18V31" fill="none" stroke={letter} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Icon + wordmark. `tone="dark"` is for dark backgrounds (footer): SHOP turns white, NOW & icon turn light pink.
 * Sizes are set by the caller through `markClassName` and `textClassName`.
 */
export function BrandLogo({ tone = 'light', markClassName, textClassName }: {
  tone?: 'light' | 'dark'; markClassName?: string; textClassName?: string;
}) {
  return (
    <span className="flex items-center gap-2.5 select-none">
      <BrandMark tone={tone} className={cn('shrink-0', markClassName ?? 'size-10')} />
      <span className={cn('font-display font-bold leading-none tracking-[-0.02em]', textClassName ?? 'text-[28px]')}>
        <span className={tone === 'dark' ? 'text-text-inverse' : 'text-text'}>SHOP</span>
        <span className={tone === 'dark' ? 'text-accent-dark' : 'text-accent'}>NOW</span>
      </span>
    </span>
  );
}
