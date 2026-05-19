import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  PORTAL_FILL_FADE_START,
  PORTAL_HERO_FADE_START,
  PORTAL_INITIAL_SCALE,
  PORTAL_WHITE_CROSSFADE_START,
  PORTAL_WHITE_HOLD_RATIO,
} from "./portal.config";
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
const PORTAL_EASE = gsap.parseEase("power2.inOut");
const REVERSE_PORTAL_FILL_START = 0.92;
const REVERSE_PORTAL_FILL_SOLID = 0.35;

let heroDismissed = false;
let platformViewportLocked = false;
/** True after scrolling past the hero pin forward — cleared when scrubbing back */
let portalHandoffComplete = false;
let lastPortalRevealT = -1;
/** Set after entering the hero pin from below; keeps reverse portal from replaying white/platform */
let reversePortalMode = false;
/** Set while the hero ScrollTrigger is live; cleared before kill (never kill inside ST callbacks) */
let activeHeroScrollTrigger: ScrollTrigger | null = null;

/** ScrollTrigger direction: 1 = down, -1 = up, 0 = unknown */
function isScrubbingBack(
  globalProgress: number,
  scrollDirection: number,
): boolean {
  if (scrollDirection === -1) return true;
  return reversePortalMode && globalProgress > SEQUENCE_PROGRESS_END;
}


/** Reverse portal: hero + last frame visible, platform/fill hidden (no white sheet) */
function applyPortalPhaseBackward(targets: HeroPortalTargets): void {
  const { hero, platform, canvas, overlay, portalFill } = targets;

  if (overlay) {
    gsap.set(overlay, { autoAlpha: 0 });
  }
  if (hero) {
    restoreHero(hero);
  }
  if (canvas) {
    gsap.set(canvas, { autoAlpha: 1 });
  }
  if (portalFill) {
    hidePortalFill(portalFill);
  }
  if (platform) {
    if (platformViewportLocked) {
      gsap.set(platform, { clearProps: "position,top,left,width,zIndex" });
      platformViewportLocked = false;
    }
    hidePlatform(platform);
  }
}

/** Reverse portal reveal: platform shrinks/fades, then white fill clears into hero */
function applyPortalPhaseReverse(
  portalProgress: number,
  targets: HeroPortalTargets,
): void {
  const { hero, platform, canvas, overlay, portalFill } = targets;
  const progress = clamp01(portalProgress);
  const revealT = mapToUnit(progress, PORTAL_WHITE_HOLD_RATIO, 1);

  if (progress < PORTAL_WHITE_HOLD_RATIO) {
    const holdT = mapToUnit(progress, 0, PORTAL_WHITE_HOLD_RATIO);

    if (overlay) {
      gsap.set(overlay, { autoAlpha: 0 });
    }
    if (hero) {
      restoreHero(hero);
    }
    if (canvas) {
      gsap.set(canvas, { autoAlpha: 1 });
    }
    if (portalFill) {
      gsap.set(portalFill, {
        autoAlpha: holdT,
        visibility: holdT > 0.001 ? "visible" : "hidden",
      });
    }
    if (platform) {
      if (platformViewportLocked) {
        gsap.set(platform, { clearProps: "position,top,left,width,zIndex" });
        platformViewportLocked = false;
      }
      hidePlatform(platform);
    }
    return;
  }

  const eased = PORTAL_EASE(revealT);
  const scale = PORTAL_INITIAL_SCALE + eased * (1 - PORTAL_INITIAL_SCALE);

  if (overlay) {
    gsap.set(overlay, { autoAlpha: 0 });
  }
  if (canvas) {
    gsap.set(canvas, { autoAlpha: 1 });
  }
  if (portalFill) {
    const fillT = 1 - mapToUnit(
      revealT,
      REVERSE_PORTAL_FILL_SOLID,
      REVERSE_PORTAL_FILL_START,
    );

    gsap.set(portalFill, {
      autoAlpha: fillT,
      visibility: fillT > 0.001 ? "visible" : "hidden",
    });
  }
  if (hero) {
    const shellFade = mapToUnit(revealT, PORTAL_HERO_FADE_START, 1);
    gsap.set(hero, {
      autoAlpha: 1 - shellFade,
      visibility: "visible",
      pointerEvents: shellFade >= 1 ? "none" : "auto",
    });
  }
  if (platform) {
    lockPlatformBehindViewport(platform);
    showPlatform(platform, scale, eased);
  }
}

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

export type HeroPortalTargets = {
  hero?: HTMLElement | null;
  platform?: HTMLElement | null;
  canvas?: HTMLElement | null;
  overlay?: HTMLElement | null;
  portalFill?: HTMLElement | null;
};

export type HeroScrollController = {
  scrollTrigger: ScrollTrigger | null;
  kill: () => void;
  refresh: () => void;
};

function releaseScrollLocks(): void {
  document.documentElement.style.removeProperty("overflow");
  document.body.style.removeProperty("overflow");
  gsap.set(document.documentElement, { clearProps: "overflow" });
  gsap.set(document.body, { clearProps: "overflow" });
}

/** Revert pin spacing and restore document scrolling */
function teardownHeroScrollTrigger(st: ScrollTrigger): void {
  st.kill(true);
  releaseScrollLocks();
  ScrollTrigger.clearScrollMemory?.();
  ScrollTrigger.refresh(true);
}

function killActiveHeroScrollTrigger(): void {
  const st = activeHeroScrollTrigger;
  if (!st) return;
  activeHeroScrollTrigger = null;
  teardownHeroScrollTrigger(st);
}

export function getPortalHoldFrameIndex(): number {
  return TOTAL_FRAMES - 1;
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function mapToUnit(value: number, inMin: number, inMax: number): number {
  if (inMax <= inMin) return value >= inMax ? 1 : 0;
  return clamp01((value - inMin) / (inMax - inMin));
}

function hidePlatform(platform: HTMLElement): void {
  platform.classList.add("pointer-events-none");
  platform.setAttribute("aria-hidden", "true");
  gsap.killTweensOf(platform);
  gsap.set(platform, {
    autoAlpha: 0,
    visibility: "hidden",
    scale: PORTAL_INITIAL_SCALE,
    transformOrigin: "center center",
  });
}

function hidePortalFill(fill: HTMLElement): void {
  gsap.killTweensOf(fill);
  gsap.set(fill, { autoAlpha: 0, visibility: "hidden" });
}

function showPlatform(platform: HTMLElement, scale: number, alpha: number): void {
  gsap.set(platform, {
    visibility: "visible",
    scale,
    autoAlpha: alpha,
    transformOrigin: "center center",
  });

  if (alpha >= 0.85) {
    platform.classList.remove("pointer-events-none");
    platform.removeAttribute("aria-hidden");
  } else {
    platform.classList.add("pointer-events-none");
    platform.setAttribute("aria-hidden", "true");
  }
}

function settlePlatform(platform: HTMLElement): void {
  platform.classList.remove("pointer-events-none");
  platform.removeAttribute("aria-hidden");
  platform.dataset.platformSettled = "true";
  gsap.killTweensOf(platform);
  gsap.set(platform, {
    scale: 1,
    autoAlpha: 1,
    visibility: "visible",
    clearProps: "transform",
  });
}

function lockPlatformBehindViewport(platform: HTMLElement): void {
  platformViewportLocked = true;
  gsap.set(platform, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 0,
  });
}

function releasePlatformToDocumentFlow(platform: HTMLElement): void {
  if (platformViewportLocked) {
    gsap.set(platform, {
      clearProps: "position,top,left,width,zIndex",
    });
    platformViewportLocked = false;
  }
}

function dismissHero(hero: HTMLElement): void {
  heroDismissed = true;
  hero.dataset.heroDismissed = "true";
  gsap.set(hero, {
    autoAlpha: 0,
    visibility: "hidden",
    pointerEvents: "none",
  });
}

function restoreHero(hero: HTMLElement): void {
  heroDismissed = false;
  delete hero.dataset.heroDismissed;
  gsap.set(hero, {
    autoAlpha: 1,
    visibility: "visible",
    pointerEvents: "auto",
  });
}

/** Forward exit only (past pin end or progress === 1) — portal phase stays scrubbable until then */
function finalizeForwardExit(
  hero: HTMLElement,
  platform: HTMLElement,
  portalFill: HTMLElement | null | undefined,
): void {
  if (portalHandoffComplete) return;
  portalHandoffComplete = true;

  settlePlatform(platform);
  if (portalFill) hidePortalFill(portalFill);
  dismissHero(hero);
  releasePlatformToDocumentFlow(platform);
  releaseScrollLocks();
}

function resetHandoffForScrubBack(
  hero: HTMLElement | null | undefined,
  platform: HTMLElement | null | undefined,
): void {
  portalHandoffComplete = false;
  lastPortalRevealT = -1;

  if (hero) {
    restoreHero(hero);
  }
  if (platform) {
    delete platform.dataset.platformSettled;
    releasePlatformToDocumentFlow(platform);
    gsap.killTweensOf(platform);
  }
}

function restoreHeroOverlay(overlay: HTMLElement | null | undefined): void {
  if (!overlay) return;
  gsap.set(overlay, { autoAlpha: 1 });
}

export function scrollProgressToFrame(progress: number): number {
  const clamped = clamp01(progress);
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
        clamp01(segmentProgress) * (segment.frameCount - 1),
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

/**
 * Platform stays in [data-platform-slot] behind the hero.
 * Hero white fill + shell fade out to reveal it with the same scale transition.
 */
function applyPortalPhase(
  portalProgress: number,
  targets: HeroPortalTargets,
  scrubbingBack: boolean,
): void {
  const { hero, platform, canvas, overlay, portalFill } = targets;
  const progress = clamp01(portalProgress);
  const revealT = mapToUnit(progress, PORTAL_WHITE_HOLD_RATIO, 1);

  if (
    portalHandoffComplete &&
    lastPortalRevealT >= 0 &&
    revealT < lastPortalRevealT - 0.0005
  ) {
    resetHandoffForScrubBack(hero, platform);
  }
  lastPortalRevealT = revealT;

  if (overlay) {
    gsap.set(overlay, { autoAlpha: 0 });
  }

  if (scrubbingBack) {
    applyPortalPhaseReverse(progress, targets);
    return;
  }

  if (progress < PORTAL_WHITE_HOLD_RATIO) {
    if (platform) {
      if (platformViewportLocked) {
        gsap.set(platform, { clearProps: "position,top,left,width,zIndex" });
        platformViewportLocked = false;
      }
      hidePlatform(platform);
    }

    const holdT = mapToUnit(progress, 0, PORTAL_WHITE_HOLD_RATIO);
    const crossfadeT = mapToUnit(holdT, PORTAL_WHITE_CROSSFADE_START, 1);

    if (hero) restoreHero(hero);
    if (canvas) gsap.set(canvas, { autoAlpha: 1 - crossfadeT });
    if (portalFill) {
      gsap.set(portalFill, {
        autoAlpha: crossfadeT,
        visibility: "visible",
      });
    }
    return;
  }

  const eased = PORTAL_EASE(revealT);
  const scale = PORTAL_INITIAL_SCALE + eased * (1 - PORTAL_INITIAL_SCALE);

  if (canvas) gsap.set(canvas, { autoAlpha: 0 });

  if (heroDismissed && hero && !portalHandoffComplete) {
    restoreHero(hero);
  }

  if (portalFill) {
    const fillFade = mapToUnit(revealT, PORTAL_FILL_FADE_START, 1);
    gsap.set(portalFill, {
      autoAlpha: 1 - fillFade,
      visibility: "visible",
    });
  }

  if (hero) {
    const shellFade = mapToUnit(revealT, PORTAL_HERO_FADE_START, 1);
    gsap.set(hero, {
      autoAlpha: 1 - shellFade,
      visibility: "visible",
      pointerEvents: shellFade >= 1 ? "none" : "auto",
    });
  }

  if (platform) {
    lockPlatformBehindViewport(platform);
    showPlatform(platform, scale, eased);
  }
}

function resetPortalVisuals(targets: HeroPortalTargets): void {
  const { hero, platform, canvas, portalFill, overlay } = targets;

  restoreHeroOverlay(overlay);

  if (hero && heroDismissed) {
    resetHandoffForScrubBack(hero, platform);
  }

  if (canvas) {
    gsap.set(canvas, { autoAlpha: 1 });
  }
  if (portalFill) {
    hidePortalFill(portalFill);
  }
  if (platform) {
    hidePlatform(platform);
    delete platform.dataset.platformSettled;
    if (platformViewportLocked) {
      gsap.set(platform, { clearProps: "position,top,left,width,zIndex" });
      platformViewportLocked = false;
    }
  }
}

function applyScrollProgress(
  progress: number,
  callbacks: HeroScrollCallbacks,
  overlayTimeline: gsap.core.Timeline | null,
  portalTargets: HeroPortalTargets,
  scrollDirection: number,
): void {
  const clamped = clamp01(progress);
  const scrubbingBack = isScrubbingBack(clamped, scrollDirection);

  const emitFrame = (frameIndex: number) => {
    callbacks.onFrame(frameIndex);
  };

  if (clamped <= SEQUENCE_PROGRESS_END) {
    reversePortalMode = false;
    const sequenceProgress = mapToUnit(clamped, 0, SEQUENCE_PROGRESS_END);
    const frame = scrollProgressToFrame(sequenceProgress);
    emitFrame(frame);
    overlayTimeline?.progress(sequenceProgress);
    restoreHeroOverlay(portalTargets.overlay);
    resetPortalVisuals(portalTargets);
    return;
  }

  emitFrame(getPortalHoldFrameIndex());
  overlayTimeline?.progress(1);

  const portalProgress = mapToUnit(clamped, SEQUENCE_PROGRESS_END, 1);
  applyPortalPhase(portalProgress, portalTargets, scrubbingBack);
}

function syncHeroScrollWhenAnchored(
  st: ScrollTrigger,
  callbacks: HeroScrollCallbacks,
  overlayTimeline: gsap.core.Timeline | null,
  portalContext: HeroPortalTargets,
): void {
  applyScrollProgress(
    st.progress,
    callbacks,
    overlayTimeline,
    portalContext,
    -1,
  );
}

export function createHeroScrollController(
  heroEl: HTMLElement,
  callbacks: HeroScrollCallbacks,
  overlayTargets?: HeroOverlayTimelineTargets,
  portalTargets: HeroPortalTargets = {},
): HeroScrollController {
  const { platform, portalFill } = portalTargets;
  const scrollRoot =
    heroEl.closest<HTMLElement>("[data-hero-stack]") ?? heroEl;
  const portalContext = {
    ...portalTargets,
    hero: portalTargets.hero ?? heroEl,
  };

  if (portalFill) hidePortalFill(portalFill);
  if (platform) hidePlatform(platform);

  const overlayTimeline =
    overlayTargets && Object.values(overlayTargets).some(Boolean)
      ? buildOverlayTimeline(overlayTargets)
      : null;

  const scrollTrigger = ScrollTrigger.create({
    trigger: scrollRoot,
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
        portalContext,
        self.direction,
      );

      if (
        self.progress >= 1 &&
        self.direction !== -1 &&
        !reversePortalMode &&
        platform &&
        heroEl &&
        !portalHandoffComplete
      ) {
        finalizeForwardExit(heroEl, platform, portalFill ?? null);
      }
    },
    onLeave: () => {
      callbacks.onFrame(getPortalHoldFrameIndex());
      if (platform && heroEl && !portalHandoffComplete) {
        finalizeForwardExit(heroEl, platform, portalFill ?? null);
      }
    },
    onEnterBack: (self) => {
      reversePortalMode = true;
      resetHandoffForScrubBack(heroEl, platform);
      releaseScrollLocks();
      syncHeroScrollWhenAnchored(
        self,
        callbacks,
        overlayTimeline,
        portalContext,
      );
    },
  });

  activeHeroScrollTrigger = scrollTrigger;

  applyScrollProgress(
    scrollTrigger.progress,
    callbacks,
    overlayTimeline,
    portalContext,
    0,
  );
  callbacks.onReady?.();

  return {
    scrollTrigger,
    kill: () => {
      killActiveHeroScrollTrigger();
      overlayTimeline?.kill();
      resetPortalVisuals(portalContext);
      if (heroEl) restoreHero(heroEl);
      if (platform) gsap.set(platform, { clearProps: "all" });
      if (portalFill) gsap.set(portalFill, { clearProps: "all" });
      heroDismissed = false;
      platformViewportLocked = false;
      portalHandoffComplete = false;
      lastPortalRevealT = -1;
      reversePortalMode = false;
    },
    refresh: () => {
      if (activeHeroScrollTrigger) {
        ScrollTrigger.refresh();
      }
    },
  };
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
