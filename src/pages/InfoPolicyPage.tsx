import { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { linkHandler } from '../lib/router';

interface Props {
  title: string;
  body: string;
  backHref?: string;
  backLabel?: string;
}

/** Simple static policy / terms page. */
export function InfoPolicyPage({ title, body, backHref = '/', backLabel = 'Back to the store' }: Props) {
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const prev = document.title;
    document.title = `${title} | SHOPNOW`;
    heading.current?.focus({ preventScroll: true });
    return () => { document.title = prev; };
  }, [title]);

  return (
    <section className="container-x py-16 md:py-24" aria-labelledby="policy-title">
      <div className="max-w-2xl">
        <a
          href={backHref}
          onClick={linkHandler(backHref)}
          className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-accent underline-offset-4 hover:underline"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          {backLabel}
        </a>
        <h1
          id="policy-title"
          ref={heading}
          tabIndex={-1}
          className="mt-4 font-display text-[36px] font-semibold leading-[1.1] tracking-[-0.01em] text-text focus:outline-none md:text-[48px]"
        >
          {title}
        </h1>
        <p className="mt-6 text-[16px] leading-relaxed text-text-muted">{body}</p>
      </div>
    </section>
  );
}
