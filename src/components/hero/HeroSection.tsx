"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  getAllFrameUrls,
  getSegmentFrameUrls,
  HERO_SEGMENTS,
} from "@/lib/hero/segments.config";
import {
  flattenSegmentImages,
  preloadHeroSequences,
  type PreloadProgress,
} from "@/lib/hero/imagePreloader";
import {
  createHeroScrollController,
  prefersReducedMotion,
  type HeroScrollController,
} from "@/lib/hero/heroScrollTrigger";

import HeroCanvas, { type HeroCanvasHandle } from "./HeroCanvas";
import HeroOverlay from "./HeroOverlay";

gsap.registerPlugin(ScrollTrigger);

type HeroSectionProps = {
  className?: string;
  platformRef?: React.RefObject<HTMLElement | null>;
};

export default function HeroSection({
  className = "",
  platformRef,
}: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HeroCanvasHandle>(null);
  const overlayRef = useRef<HTMLElement>(null);
  const scrollControllerRef = useRef<HeroScrollController | null>(null);
  const imagesLoadedRef = useRef(false);

  const [loadProgress, setLoadProgress] = useState<PreloadProgress>({
    loaded: 0,
    total: getAllFrameUrls().length,
    ratio: 0,
  });
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [maxDpr, setMaxDpr] = useState(2);

  const initScroll = useCallback(() => {
    const hero = heroRef.current;
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (!hero || !canvas || !imagesLoadedRef.current) return;

    scrollControllerRef.current?.kill();

    const intro = overlay?.querySelector<HTMLElement>("[data-hero-intro]");
    const mid = overlay?.querySelector<HTMLElement>("[data-hero-mid]");
    const exit = overlay?.querySelector<HTMLElement>("[data-hero-exit]");
    const vignette = overlay?.querySelector<HTMLElement>(
      "[data-hero-vignette]",
    );

    const platform = platformRef?.current ?? null;
    const canvasWrap = hero.querySelector<HTMLElement>("[data-hero-canvas-wrap]");
    const portalFill = hero.querySelector<HTMLElement>("[data-hero-portal-fill]");

    if (prefersReducedMotion()) {
      canvas.setFrame(0);
      if (platform) {
        platform.classList.remove("pointer-events-none");
        platform.removeAttribute("aria-hidden");
      }
      return;
    }

    scrollControllerRef.current = createHeroScrollController(
      hero,
      {
        onFrame: (frame) => canvas.setFrame(frame),
      },
      { intro, mid, exit, vignette },
      { hero, platform, canvas: canvasWrap, overlay, portalFill },
    );

    ScrollTrigger.refresh();
  }, [platformRef]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const updateDpr = () => setMaxDpr(mq.matches ? 1.5 : 2);
    updateDpr();
    mq.addEventListener("change", updateDpr);
    return () => mq.removeEventListener("change", updateDpr);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const segmentUrls = HERO_SEGMENTS.map((s) => getSegmentFrameUrls(s));
    const total = getAllFrameUrls().length;

    setLoadProgress({ loaded: 0, total, ratio: 0 });

    (async () => {
      try {
        const batches = await preloadHeroSequences(segmentUrls, {
          concurrency: 12,
          onProgress: (p) => {
            if (!cancelled) setLoadProgress(p);
          },
        });

        if (cancelled) return;

        const flat = flattenSegmentImages(batches);
        canvasRef.current?.setImages(flat);
        canvasRef.current?.setFrame(0);
        canvasRef.current?.resize();
        imagesLoadedRef.current = true;
        setIsReady(true);
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "Failed to load sequences";
        setLoadError(message);
      }
    })();

    return () => {
      cancelled = true;
      imagesLoadedRef.current = false;
      scrollControllerRef.current?.kill();
      scrollControllerRef.current = null;
    };
  }, []);

  // Init ScrollTrigger after loader unmounts and layout is stable
  useEffect(() => {
    if (!isReady) return;

    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        initScroll();
      });
    });

    return () => {
      cancelAnimationFrame(id);
      scrollControllerRef.current?.kill();
      scrollControllerRef.current = null;
    };
  }, [isReady, initScroll]);

  useEffect(() => {
    if (!isReady) return;

    const onResize = () => {
      canvasRef.current?.resize();
      scrollControllerRef.current?.refresh();
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isReady]);

  const progressPercent = Math.round(loadProgress.ratio * 100);

  return (
    <section
      ref={heroRef}
      className={`relative h-svh w-full overflow-hidden ${className}`}
      aria-label="Cinematic introduction"
    >
      <div data-hero-canvas-wrap className="absolute inset-0 z-10">
        <HeroCanvas ref={canvasRef} maxDpr={maxDpr} />
      </div>

      <div
        data-hero-portal-fill
        className="pointer-events-none invisible absolute inset-0 z-25 bg-[#f8f9fa]"
        aria-hidden
      />

      <HeroOverlay ref={overlayRef} className="absolute inset-0 z-20" />

      {!isReady && !loadError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#030712]/90 backdrop-blur-sm">
          <div className="h-px w-48 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-sky-400 transition-[width] duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="mt-4 text-xs tracking-[0.2em] text-white/50 uppercase">
            Loading experience {progressPercent}%
          </p>
        </div>
      )}

      {loadError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#030712] px-6 text-center">
          <p className="text-sm text-white/70">
            Image sequences could not be loaded. Add PNG frames to{" "}
            <code className="text-sky-300">public/sequences/</code> (see README).
          </p>
          <p className="mt-2 max-w-md text-xs text-white/40">{loadError}</p>
        </div>
      )}
    </section>
  );
}
