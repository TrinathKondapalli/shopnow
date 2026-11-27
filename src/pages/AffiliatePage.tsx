import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, Coins, Gem, Gift, Link2, Percent, Share2, UserPlus } from 'lucide-react';
import { SITE_INFO } from '../config/siteInfo';
import { linkHandler } from '../lib/router';
import { scrollToId } from '../lib/utils';

const ICONS = {
  saree: Gift,
  silver: Gem,
  gold: Coins,
} as const;

const STEPS = [
  { icon: UserPlus, title: 'Sign up', body: 'Join the SHOPNOW affiliate program and get your personal link.' },
  { icon: Share2, title: 'Share your link', body: 'Share kurtas, sarees, lehengas and more with your friends, family and followers.' },
  { icon: Percent, title: 'Earn commission & rewards', body: 'Earn 10% commission on every successful sale through your link, and unlock milestone rewards within 90 days of joining.' },
];

/** /affiliate: the SHOPNOW affiliate program (10% commission plus milestone rewards). */
export function AffiliatePage() {
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const prev = document.title;
    document.title = 'Affiliate program | SHOPNOW';
    let t = 0;
    if (window.location.hash === '#how-it-works') {
      t = window.setTimeout(() => scrollToId('how-it-works'), 60);
    } else if (window.location.hash === '#join') {
      t = window.setTimeout(() => scrollToId('join'), 60);
    } else {
      heading.current?.focus({ preventScroll: true });
    }
    return () => { document.title = prev; window.clearTimeout(t); };
  }, []);

  const goJoin = (e: React.MouseEvent) => {
    e.preventDefault();
    history.replaceState(history.state, '', '#join');
    scrollToId('join');
  };

  return (
    <div className="overflow-x-clip bg-bg text-text">
      {/* Hero */}
      <section aria-labelledby="aff-title" className="bg-bg-alt text-text">
        <div className="container-x grid gap-10 py-14 md:py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
          <div className="min-w-0">
            <p className="eyebrow">SHOPNOW affiliate program</p>
            <h1 id="aff-title" ref={heading} tabIndex={-1} className="mt-3 font-display text-[40px] font-semibold leading-[1.08] tracking-[-0.01em] text-text focus:outline-none md:text-[68px]">
              Share what you love. Earn <span className="italic text-accent">10%</span> on every sale.
            </h1>
            <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-text-muted md:text-[18px]">
              Recommend SHOPNOW ethnic and festive wear and earn {SITE_INFO.affiliate.commissionCondition}, plus milestone rewards within 90 days of joining: 1 Saree, 5g Silver and 0.5g Gold.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href={SITE_INFO.affiliate.signupUrl}
                onClick={goJoin}
                className="group inline-flex h-12 items-center gap-2 rounded-btn bg-action px-7 text-[15px] font-semibold text-action-text transition-colors hover:bg-action-hover"
              >
                Join the program <ArrowRight size={18} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => { e.preventDefault(); history.replaceState(history.state, '', '#how-it-works'); scrollToId('how-it-works'); }}
                className="inline-flex min-h-11 items-center text-[15px] font-semibold text-accent underline-offset-4 hover:underline"
              >
                How it works
              </a>
            </div>
          </div>

          <ul className="grid min-w-0 gap-3 sm:grid-cols-3" aria-label="Milestone rewards">
            {SITE_INFO.affiliate.milestones.map((m) => {
              const Icon = ICONS[m.id];
              return (
                <li key={m.id} className="flex flex-col rounded-[var(--radius-card)] border border-border border-t-[3px] border-t-accent bg-bg p-5 shadow-[var(--shadow-card)]">
                  <span className="grid size-11 place-items-center rounded-full bg-accent-soft text-accent" aria-hidden="true"><Icon size={22} /></span>
                  <p className="mt-4 font-display text-[26px] font-semibold leading-tight text-text">{m.reward}</p>
                  <p className="mt-1 text-[14px] leading-snug text-text-muted">{m.condition}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-24 py-16 md:py-24">
        <div className="container-x">
          <p className="eyebrow">How it works</p>
          <h2 id="how-title" className="mt-2 font-display text-[30px] font-semibold leading-[1.15] text-text md:text-[48px]">Three steps to start earning</h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="relative rounded-[var(--radius-card)] border border-border bg-bg p-6 shadow-[var(--shadow-card)] md:p-8">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-full bg-accent-soft text-accent" aria-hidden="true"><Icon size={20} /></span>
                  <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-text-muted">Step {i + 1}</span>
                </div>
                <h3 className="mt-5 text-[20px] font-semibold tracking-[-0.01em] text-text">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-text-muted">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Rewards */}
      <section aria-labelledby="rewards-title" className="bg-bg-alt py-16 md:py-24">
        <div className="container-x max-w-[960px]">
          <p className="eyebrow">Rewards</p>
          <h2 id="rewards-title" className="mt-2 font-display text-[30px] font-semibold leading-[1.15] text-text md:text-[48px]">What you can earn</h2>
          <div className="mt-8 overflow-x-auto rounded-[var(--radius-card)] border border-border bg-bg">
            <table className="w-full min-w-[320px] border-collapse text-left text-[15px]">
              <caption className="sr-only">Affiliate rewards and the condition to earn each one</caption>
              <thead className="bg-bg-alt text-[13px] uppercase tracking-[0.08em] text-text">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold md:px-6">Reward</th>
                  <th scope="col" className="px-4 py-3 font-semibold md:px-6">Condition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <th scope="row" className="px-4 py-4 font-semibold text-text md:px-6">10% commission</th>
                  <td className="px-4 py-4 text-text-muted md:px-6">Every successful sale (order delivered and not returned)</td>
                </tr>
                {SITE_INFO.affiliate.milestones.map((m) => (
                  <tr key={m.id}>
                    <th scope="row" className="px-4 py-4 font-semibold text-text md:px-6">{m.reward}</th>
                    <td className="px-4 py-4 text-text-muted md:px-6">{m.condition} ({m.window})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="aff-faq-title" className="py-16 md:py-24">
        <div className="container-x max-w-[960px]">
          <p className="eyebrow">FAQ</p>
          <h2 id="aff-faq-title" className="mt-2 font-display text-[30px] font-semibold leading-[1.15] text-text md:text-[48px]">Questions, answered</h2>
          <div className="mt-8 divide-y divide-border border-y border-border">
            {SITE_INFO.affiliate.faqs.map((f) => (
              <details key={f.q} className="group">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[16px] font-semibold text-text [&::-webkit-details-marker]:hidden">
                  <span className="[overflow-wrap:anywhere]">{f.q}</span>
                  <ChevronDown size={18} aria-hidden="true" className="shrink-0 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="pb-5 text-[15px] leading-relaxed text-text-muted [overflow-wrap:anywhere]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Join form */}
      <JoinSection />

      {/* Closing CTA */}
      <section aria-labelledby="aff-cta-title" className="pb-20">
        <div className="container-x">
          <div className="flex flex-col items-start gap-6 rounded-[var(--radius-modal)] bg-text p-8 text-text-inverse md:flex-row md:items-center md:justify-between md:p-12">
            <div className="min-w-0">
              <h2 id="aff-cta-title" className="font-display text-[30px] font-semibold leading-tight text-text-inverse md:text-[42px]">Ready to start earning?</h2>
              <p className="mt-2 text-[15px] text-dark-muted">
                Read the{' '}
                <a
                  href={SITE_INFO.affiliate.termsUrl}
                  onClick={linkHandler(SITE_INFO.affiliate.termsUrl)}
                  className="inline-flex flex-wrap items-center gap-1 font-semibold text-accent-dark underline underline-offset-4 hover:text-text-inverse focus-visible:outline-accent-dark"
                >
                  <Link2 size={14} aria-hidden="true" /> affiliate terms
                </a>{' '}
                before you join.
              </p>
            </div>
            <a
              href={SITE_INFO.affiliate.signupUrl}
              onClick={goJoin}
              className="group inline-flex h-12 shrink-0 items-center gap-2 rounded-btn bg-bg px-7 text-[15px] font-semibold text-text transition-colors hover:bg-bg-alt focus-visible:outline-accent-dark"
            >
              Join now <ArrowRight size={18} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function JoinSection() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [handle, setHandle] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim() || !email.trim()) {
      setError('Please fill in your name, mobile number and email.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <section id="join" aria-labelledby="aff-join-title" className="scroll-mt-24 pb-16 md:pb-20">
      <div className="container-x max-w-[680px]">
        <div className="rounded-[var(--radius-modal)] border border-border bg-bg-alt p-6 sm:p-8 md:p-10">
          <p className="eyebrow">Apply now</p>
          <h2 id="aff-join-title" className="mt-2 font-display text-[30px] font-semibold leading-[1.15] text-text md:text-[40px]">
            Join the affiliate program
          </h2>
          <p className="mt-2 text-[15px] text-text-muted">
            Fill in your details below to request your personal affiliate link.
          </p>

          {submitted ? (
            <div role="status" className="mt-6 flex items-start gap-3 rounded-[var(--radius-card)] border border-border bg-bg p-5 text-text">
              <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
              <p className="text-[16px] font-semibold">Thanks! Our team will contact you within 48 hours.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
              <div>
                <label htmlFor="aff-name" className="block text-[14px] font-semibold text-text">Name</label>
                <input
                  id="aff-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="mt-1.5 h-11 w-full rounded-input border border-border-strong bg-bg px-3.5 text-[15px] text-text placeholder:text-text-muted focus:border-accent"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="aff-mobile" className="block text-[14px] font-semibold text-text">Mobile</label>
                  <input
                    id="aff-mobile"
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 90000 00000"
                    className="mt-1.5 h-11 w-full rounded-input border border-border-strong bg-bg px-3.5 text-[15px] text-text placeholder:text-text-muted focus:border-accent"
                  />
                </div>
                <div>
                  <label htmlFor="aff-email" className="block text-[14px] font-semibold text-text">Email</label>
                  <input
                    id="aff-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1.5 h-11 w-full rounded-input border border-border-strong bg-bg px-3.5 text-[15px] text-text placeholder:text-text-muted focus:border-accent"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="aff-handle" className="block text-[14px] font-semibold text-text">
                  Instagram / YouTube handle <span className="font-normal text-text-muted">(optional)</span>
                </label>
                <input
                  id="aff-handle"
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@yourhandle"
                  className="mt-1.5 h-11 w-full rounded-input border border-border-strong bg-bg px-3.5 text-[15px] text-text placeholder:text-text-muted focus:border-accent"
                />
              </div>
              {error && <p role="alert" className="text-[14px] font-medium text-error">{error}</p>}
              <button
                type="submit"
                className="btn btn-dark mt-2 h-12 w-full sm:w-auto"
              >
                Request to join <ArrowRight size={16} className="arrow" aria-hidden="true" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
