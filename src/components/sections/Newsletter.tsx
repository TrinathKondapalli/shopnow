import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, LoaderCircle, Mail } from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASE } from '../../lib/motion';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
type Status = 'idle' | 'loading' | 'success';

/** 11. Newsletter: email validation, loading and a demo success state (nothing is sent). */
export function Newsletter() {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const valid = EMAIL.test(email.trim());
  const error = touched && !valid ? (email.trim() ? 'Enter a valid email, like name@example.com' : 'Enter your email address') : '';

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    setStatus('loading');
    window.setTimeout(() => setStatus('success'), 900);
  };

  return (
    <section id="newsletter" className="scroll-mt-16 md:scroll-mt-20 pb-20 md:pb-28" aria-labelledby="news-title">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[var(--radius-modal)] bg-text px-6 py-14 text-text-inverse md:px-16 md:py-20">
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="eyebrow text-accent-dark">Newsletter</p>
              <h2 id="news-title" className="display mt-3 text-[30px] text-text-inverse md:text-[48px]">First look at every festive edit.</h2>
              <p className="mt-4 max-w-md text-dark-muted">One email when a new collection lands, plus early access to sales. No spam, unsubscribe any time.</p>
            </div>
            <div className="min-h-[132px]">
              <AnimatePresence mode="wait" initial={false}>
                {status === 'success' ? (
                  <motion.div key="ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} className="flex items-start gap-4 rounded-[var(--radius-card)] bg-white/10 p-6 backdrop-blur" role="status">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-success text-text-inverse"><Check size={22} strokeWidth={3} /></span>
                    <div>
                      <p className="text-lg font-semibold text-text-inverse">You’re on the list</p>
                      <p className="mt-1 text-sm text-dark-muted">We’ll write to {email.trim()} when the next collection lands. (Demo only: nothing was sent.)</p>
                      <button type="button" onClick={() => { setStatus('idle'); setEmail(''); setTouched(false); }} className="mt-3 text-sm font-semibold text-accent-dark underline underline-offset-4 focus-visible:outline-accent-dark">Use another email</button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <label htmlFor="news-email" className="sr-only">Email address</label>
                    <div className={cn('flex flex-col gap-2 rounded-[var(--radius-card)] bg-bg p-2 sm:flex-row sm:items-center', error && 'animate-shake ring-2 ring-accent-dark')}>
                      <div className="flex flex-1 items-center gap-3 pl-4 text-text">
                        <Mail size={18} className="shrink-0 text-text-muted" />
                        <input
                          id="news-email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onBlur={() => email && setTouched(true)}
                          aria-invalid={!!error}
                          aria-describedby="news-error"
                          className="h-12 w-full bg-transparent text-[15px] text-text outline-none placeholder:text-text-muted"
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn h-12 rounded-btn bg-text px-7 text-[15px] font-semibold text-text-inverse transition-all duration-200 hover:bg-action-hover focus-visible:outline-accent sm:bg-bg sm:text-text sm:border sm:border-border-strong sm:hover:bg-bg-alt"
                        disabled={status === 'loading'}
                      >
                        {status === 'loading' ? (
                          <>
                            <LoaderCircle size={18} className="animate-spin" /> Subscribing
                          </>
                        ) : (
                          <>
                            Subscribe <ArrowRight size={16} className="arrow" />
                          </>
                        )}
                      </button>
                    </div>
                    <p id="news-error" className="mt-3 min-h-5 pl-4 text-sm font-medium text-accent-dark" aria-live="polite">{error}</p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
