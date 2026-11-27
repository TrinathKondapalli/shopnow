// Motion timings from the SHOPNOW plan (section 4). Durations are in seconds for Motion.
export const EASE = [0.22, 1, 0.36, 1] as const; // soft ease-out
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const DUR = {
  pageEntrance: 0.6,   // staggered fade-up
  heroMask: 0.8,       // hero photography mask reveal
  heroHeadline: 0.7,   // sequential text reveal
  navbar: 0.25,        // sticky transition
  dropdown: 0.2,       // mega menu fade and slide
  cta: 0.15,           // scale and arrow movement
  categoryZoom: 0.3,   // image zoom on hover
  cardAlt: 0.3,        // alternate image reveal
  filter: 0.3,         // animated grid rearrangement
  search: 0.25,        // fade and expand
  quickView: 0.3,      // fade and scale
  heart: 0.2,          // fill and bounce
  drawer: 0.35,        // slide from right
  toast: 0.25,         // slide and fade
  section: 0.5,        // staggered section reveal
  mobileMenu: 0.3,     // slide from left
} as const;

export const STAGGER = 0.08;

/**
 * Reveal used by sections; pass the item index as `custom`.
 * Content is never hidden: the "hidden" state is fully opaque and only offset by 12px, so nothing renders
 * as a blank block before the observer fires (fast scrolling, anchor jumps, slow phones).
 * With reduced motion, MotionConfig drops the transform and nothing moves at all.
 */
export const fadeUp = {
  hidden: { opacity: 1, y: 12 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASE, delay: Math.min(i, 3) * 0.05 },
  }),
};
