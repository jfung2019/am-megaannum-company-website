import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { PORTAL_INITIAL_SCALE } from "./portal.config";
import {
  HERO_SCRUB_SMOOTHING,
  HERO_SCROLL_VH,
  HERO_SEQUENCE_SCROLL_VH,
  HERO_SEGMENTS,
  TOTAL_FRAMES,
  TOTAL_SCROLL_WEIGHT,
} from "./segments.config";

gsap.registerPlugin(ScrollTrigger);

const SEQUENCE_PROGRESS_END = HERO_SEQUENCE_SCROLL_VH / HERO_SCROLL_VH;

export type HeroScrollCallbacks = {
  onFrame: (globalFrame: number) => void;
  onReady?: () => void;
};

export type HeroOverlayTimelineTargets = {
  intro?: HTMLElement | null;
  mid?: HTMLElement | null;
  exit?: HTMLElement | null;
  vignette?: HTMLElement | null;
};

export type HeroPortalTimelineTargets = {
  /** The real #platform section — scaled during the portal phase */
  platform?: HTMLElement | null;
  canvas?: HTMLElement | null;
  overlay?: HTMLElement | null;
};

export type HeroScrollController = {
  scrollTrigger: ScrollTrigger;
  kill: () => void;
  refresh: () => void;
};

function hidePlatform(platform: HTMLElement): void {
  platform.classList.add("pointer-events-none");
  platform.setAttribute("aria-hidden", "true");
  gsap.killTweensOf(platform);
  gsap.set(platform, {
    autoAlpha: 0,
    visibility: "hidden",
    scale: PORTAL_INITIAL_SCALE,
    transformOrigin: "center center",
    clearProps: "position,top,left,width,zIndex,pointerEvents",
  });
}

function settlePlatform(platform: HTMLElement): void {
  platform.classList.remove("pointer-events-none");
  platform.removeAttribute("aria-hidden");
  gsap.set(platform, {
    scale: 1,
    autoAlpha: 1,
    visibility: "visible",
    clearProps: "position,top,left,width,zIndex,transform",
  });
}

/**
 * Map scroll progress (0–1) to global frame index with per-segment scroll weights.
 */
export function scrollProgressToFrame(progress: number): number {
  const clamped = Math.max(0, Math.min(1, progress));
  const scaled = clamped * TOTAL_SCROLL_WEIGHT;

  let timeCursor = 0;
  let frameOffset = 0;

  for (const segment of HERO_SEGMENTS) {
    const segmentEnd = timeCursor + segment.scrollWeight;

    if (scaled <= segmentEnd || segment === HERO_SEGMENTS[HERO_SEGMENTS.length - 1]) {
      const segmentProgress =
        segment.scrollWeight > 0
          ? (scaled - timeCursor) / segment.scrollWeight
          : 0;
      const localFrame = Math.round(
        Math.max(0, Math.min(1, segmentProgress)) * (segment.frameCount - 1),
      );
      return Math.min(frameOffset + localFrame, TOTAL_FRAMES - 1);
    }

    timeCursor = segmentEnd;
    frameOffset += segment.frameCount;
  }

  return TOTAL_FRAMES - 1;
}

function buildOverlayTimeline(
  targets: HeroOverlayTimelineTargets,
): gsap.core.Timeline {
  const { intro, mid, exit, vignette } = targets;
  const timeline = gsap.timeline({ paused: true });

  const w1 = HERO_SEGMENTS[0].scrollWeight / TOTAL_SCROLL_WEIGHT;
  const w2 =
    (HERO_SEGMENTS[0].scrollWeight + HERO_SEGMENTS[1].scrollWeight) /
    TOTAL_SCROLL_WEIGHT;

  if (intro) {
    timeline.fromTo(
      intro,
      { autoAlpha: 1, y: 28 },
      { autoAlpha: 0, y: 0, duration: w1 * 0.12, ease: "power2.out" },
      0,
    );
    timeline.to(
      intro,
      { autoAlpha: 0, duration: w1 * 0.15, ease: "power1.inOut" },
      w1 * 0.35,
    );
  }

  if (mid) {
    timeline.fromTo(
      mid,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: w1 * 0.1, ease: "power2.out" },
      w1 * 0.9,
    );
    timeline.to(mid, { autoAlpha: 0, duration: w1 * 0.12, ease: "power1.in" }, w2 * 0.85);
  }

  if (exit) {
    timeline.fromTo(
      exit,
      { autoAlpha: 0, y: 16 },
      { autoAlpha: 1, y: 0, duration: w1 * 0.14, ease: "power2.out" },
      w2 * 0.95,
    );
    timeline.to(
      exit,
      { autoAlpha: 0, duration: (1 - SEQUENCE_PROGRESS_END) * 0.35, ease: "power1.in" },
      SEQUENCE_PROGRESS_END,
    );
  }

  if (vignette) {
    timeline.fromTo(
      vignette,
      { opacity: 0.2 },
      { opacity: 0.5, duration: (1 - w2) * 0.5, ease: "power1.in" },
      w2,
    );
    timeline.to(
      vignette,
      { opacity: 0, duration: (1 - SEQUENCE_PROGRESS_END) * 0.4, ease: "power1.in" },
      SEQUENCE_PROGRESS_END,
    );
  }

  return timeline;
}

function buildPortalTimeline(
  targets: HeroPortalTimelineTargets,
): gsap.core.Timeline {
  const { platform, canvas, overlay } = targets;
  /** Timeline 0–1 covers only the portal phase (not the frame sequence). */
  const timeline = gsap.timeline({ paused: true });

  if (platform) {
    gsap.set(platform, {
      scale: PORTAL_INITIAL_SCALE,
      autoAlpha: 0,
      visibility: "hidden",
      transformOrigin: "center center",
    });

    timeline.set(
      platform,
      {
        visibility: "visible",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 40,
      },
      0,
    );
    timeline.fromTo(
      platform,
      { scale: PORTAL_INITIAL_SCALE, autoAlpha: 0 },
      {
        scale: 1,
        autoAlpha: 1,
        duration: 0.92,
        ease: "power2.inOut",
      },
      0,
    );
    timeline.set(platform, { pointerEvents: "auto" }, 0.85);
  }

  if (canvas) {
    timeline.to(
      canvas,
      { autoAlpha: 0, duration: 0.45, ease: "power1.in" },
      0.35,
    );
  }

  if (overlay) {
    timeline.to(
      overlay,
      { autoAlpha: 0, duration: 0.25, ease: "power1.in" },
      0,
    );
  }

  return timeline;
}

function applyScrollProgress(
  progress: number,
  callbacks: HeroScrollCallbacks,
  overlayTimeline: gsap.core.Timeline | null,
  portalTimeline: gsap.core.Timeline | null,
  platform: HTMLElement | null,
): void {
  if (progress <= SEQUENCE_PROGRESS_END) {
    const sequenceProgress =
      SEQUENCE_PROGRESS_END > 0 ? progress / SEQUENCE_PROGRESS_END : 0;
    callbacks.onFrame(scrollProgressToFrame(sequenceProgress));
    overlayTimeline?.progress(sequenceProgress);
    portalTimeline?.progress(0);
    if (platform) hidePlatform(platform);
    return;
  }

  callbacks.onFrame(TOTAL_FRAMES - 1);
  overlayTimeline?.progress(1);

  const portalProgress =
    (progress - SEQUENCE_PROGRESS_END) / (1 - SEQUENCE_PROGRESS_END);
  portalTimeline?.progress(portalProgress);
}

export function createHeroScrollController(
  heroEl: HTMLElement,
  callbacks: HeroScrollCallbacks,
  overlayTargets?: HeroOverlayTimelineTargets,
  portalTargets?: HeroPortalTimelineTargets,
): HeroScrollController {
  const platform = portalTargets?.platform ?? null;

  const overlayTimeline =
    overlayTargets && Object.values(overlayTargets).some(Boolean)
      ? buildOverlayTimeline(overlayTargets)
      : null;

  const portalTimeline =
    portalTargets && Object.values(portalTargets).some(Boolean)
      ? buildPortalTimeline(portalTargets)
      : null;

  const scrollTrigger = ScrollTrigger.create({
    trigger: heroEl,
    start: "top top",
    end: () => `+=${HERO_SCROLL_VH * window.innerHeight}`,
    pin: true,
    pinSpacing: true,
    scrub: HERO_SCRUB_SMOOTHING,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      applyScrollProgress(
        self.progress,
        callbacks,
        overlayTimeline,
        portalTimeline,
        platform,
      );
    },
    onLeave: () => {
      callbacks.onFrame(TOTAL_FRAMES - 1);
      if (platform) settlePlatform(platform);
    },
    onEnterBack: () => {
      if (platform) hidePlatform(platform);
    },
  });

  applyScrollProgress(
    scrollTrigger.progress,
    callbacks,
    overlayTimeline,
    portalTimeline,
    platform,
  );

  callbacks.onReady?.();

  return {
    scrollTrigger,
    kill: () => {
      scrollTrigger.kill();
      overlayTimeline?.kill();
      portalTimeline?.kill();
      if (platform) gsap.set(platform, { clearProps: "all" });
    },
    refresh: () => ScrollTrigger.refresh(),
  };
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
