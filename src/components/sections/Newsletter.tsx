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
        <div className="relative overflow-hidden rounded-[32px] bg-electric px-6 py-14 text-white md:px-16 md:py-20">
          <div className="pointer-events-none absolute -right-20 -top-24 size-80 rounded-full bg-lav-300/40 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 size-96 rounded-full bg-ink/30 blur-3xl" aria-hidden="true" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="eyebrow text-lav-200">Newsletter</p>
              <h2 id="news-title" className="display mt-3 text-[clamp(2.2rem,5vw,4rem)]">First dibs on every drop.</h2>
              <p className="mt-4 max-w-md text-white/80">One email when a new collection lands, plus early access to sales. No spam, unsubscribe any time.</p>
            </div>
            <div className="min-h-[132px]">
              <AnimatePresence mode="wait" initial={false}>
                {status === 'success' ? (
                  <motion.div key="ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} className="flex items-start gap-4 rounded-3xl bg-white/15 p-6 backdrop-blur" role="status">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-electric"><Check size={22} strokeWidth={3} /></span>
                    <div>
                      <p className="text-lg font-semibold">You’re on the list</p>
                      <p className="mt-1 text-sm text-white/80">We’ll write to {email.trim()} when the next drop lands. (Demo only: nothing was sent.)</p>
                      <button type="button" onClick={() => { setStatus('idle'); setEmail(''); setTouched(false); }} className="mt-3 text-sm font-semibold underline underline-offset-4">Use another email</button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <label htmlFor="news-email" className="sr-only">Email address</label>
                    <div className={cn('flex flex-col gap-2 rounded-[28px] bg-white p-2 sm:flex-row sm:items-center sm:rounded-full', error && 'animate-shake ring-2 ring-[#FFB4B4]')}>
                      <div className="flex flex-1 items-center gap-3 pl-4 text-ink">
                        <Mail size={18} className="shrink-0 text-muted" />
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
                          className="h-12 w-full bg-transparent text-[15px] outline-none placeholder:text-muted"
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-dark !rounded-full h-12 px-7 text-[15px] font-semibold transition-all duration-200"
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
                    <p id="news-error" className="mt-3 min-h-5 pl-4 text-sm font-medium text-[#FFE0E0]" aria-live="polite">{error}</p>
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
