import { linkHandler } from '../lib/router';

/** Shown for any path that isn't the home page or /affiliate. */
export function NotFound() {
  return (
    <section className="container-x grid min-h-[60vh] place-items-center py-20 text-center" aria-labelledby="nf-title">
      <div>
        <p className="font-display text-[clamp(64px,16vw,140px)] font-bold leading-none tracking-[-0.04em] text-accent" aria-hidden="true">404</p>
        <h1 id="nf-title" className="mt-4 font-display text-[32px] font-semibold tracking-[-0.01em] text-text md:text-[42px]">This page doesn’t exist</h1>
        <p className="mx-auto mt-2 max-w-md text-[16px] text-text-muted">The link may be old or mistyped. Everything in the store is on our home page.</p>
        <a href="/" onClick={linkHandler('/')} className="btn btn-dark mt-8 min-h-11">Back to the store</a>
      </div>
    </section>
  );
}
