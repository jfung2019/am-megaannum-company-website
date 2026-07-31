import gsap from "gsap";

/** Fired after hero ScrollTrigger init + refresh so below-fold reveals can re-check visibility */
export const HERO_SCROLL_LAYOUT_EVENT = "hero-scroll-layout";

type RevealOnScrollOptions = {
  /** How much of the trigger must be visible (0–1) */
  threshold?: number;
  /** Shrink the viewport box — negative bottom margin delays until further in view */
  rootMargin?: string;
  /** Viewport ratio the trigger top must pass before the manual sync can play */
  syncStartRatio?: number;
  /** Viewport ratio the trigger bottom must remain beyond before the manual sync can play */
  syncEndRatio?: number;
};

function isInView(
  trigger: Element,
  syncStartRatio: number,
  syncEndRatio: number,
): boolean {
  const rect = trigger.getBoundingClientRect();
  const vh = window.innerHeight;
  return rect.top < vh * syncStartRatio && rect.bottom > vh * syncEndRatio;
}

/**
 * Play a paused GSAP timeline once when the trigger intersects the viewport.
 * Uses IntersectionObserver (reliable with pinned hero / ScrollTrigger layout).
 */
export function revealOnScroll(
  trigger: Element,
  timeline: gsap.core.Timeline,
  options: RevealOnScrollOptions = {},
): () => void {
  const {
    threshold = 0.12,
    rootMargin = "0px 0px -5% 0px",
    syncStartRatio = 0.92,
    syncEndRatio = 0.08,
  } = options;
  let played = false;

  const play = () => {
    if (played) return;
    played = true;
    timeline.play(0);
  };

  const sync = () => {
    if (isInView(trigger, syncStartRatio, syncEndRatio)) play();
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.target !== trigger || !entry.isIntersecting) continue;
        play();
        observer.disconnect();
        return;
      }
    },
    { threshold, rootMargin },
  );

  const onLayout = () => sync();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      observer.observe(trigger);
      sync();
    });
  });

  window.addEventListener(HERO_SCROLL_LAYOUT_EVENT, onLayout);

  return () => {
    observer.disconnect();
    window.removeEventListener(HERO_SCROLL_LAYOUT_EVENT, onLayout);
  };
}
