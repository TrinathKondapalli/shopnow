import { useEffect, useState } from 'react';

/** True once the page has scrolled past `threshold` pixels. */
export function useScrolledPast(threshold: number) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    let frame = 0;
    const read = () => { frame = 0; setPast(window.scrollY > threshold); };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(read); };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (frame) window.cancelAnimationFrame(frame); };
  }, [threshold]);
  return past;
}
