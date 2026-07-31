"use client";

import { useLayoutEffect, useRef } from "react";
import { Playfair_Display } from "next/font/google";
import gsap from "gsap";

import { revealOnScroll } from "@/lib/gsap/revealOnScroll";
import {
  formatPlatformStatValue,
  PLATFORM_CONTENT,
} from "./platform/platform.config";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

type PlatformSectionContentProps = {
  className?: string;
};

export default function PlatformSectionContent({
  className = "",
}: PlatformSectionContentProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDListElement>(null);
  const { headline, intro, stats, footnote } = PLATFORM_CONTENT;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const statsEl = statsRef.current;
    if (!root || !statsEl) return;

    const valueEls = Array.from(
      statsEl.querySelectorAll<HTMLElement>("[data-stat-value]"),
    );
    if (valueEls.length !== stats.length) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let disconnectReveal: (() => void) | undefined;
    let revealTl: gsap.core.Timeline | null = null;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        valueEls.forEach((el, i) => {
          const stat = stats[i];
          el.textContent = formatPlatformStatValue(stat.value, stat);
        });
        return;
      }

      const counters = stats.map((stat, i) => {
        const from =
          stat.from ?? Math.max(0, Math.round(stat.value * 0.85));
        valueEls[i].textContent = formatPlatformStatValue(from, stat);
        return { n: from, el: valueEls[i], stat };
      });

      revealTl = gsap.timeline({ paused: true });
      counters.forEach(({ el, stat }, i) => {
        const proxy = counters[i];
        revealTl!.to(
          proxy,
          {
            n: stat.value,
            duration: 0.9,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = formatPlatformStatValue(proxy.n, stat);
            },
          },
          i * 0.1,
        );
      });
    }, root);

    if (revealTl) {
      disconnectReveal = revealOnScroll(statsEl, revealTl, {
        threshold: 0.2,
        rootMargin: "0px 0px -8% 0px",
      });
    }

    return () => {
      disconnectReveal?.();
      ctx.revert();
    };
  }, [stats]);

  return (
    <div
      ref={rootRef}
      className={`flex min-h-svh w-full flex-col justify-center text-white ${className}`.trim()}
    >
      <div className="w-full px-6 py-20 md:px-10 md:py-24 lg:px-14 lg:py-28 xl:px-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center border-b border-white/25 pb-14 text-center md:pb-16 lg:pb-20">
          <h2
            id="platform-heading"
            className={`${playfair.className} text-[2.35rem] leading-[1.12] font-medium tracking-tight text-white md:text-5xl md:leading-[1.1] lg:text-[3.35rem] lg:leading-[1.08]`}
          >
            {headline.line1}
            <br />
            {headline.line2}
          </h2>

          <p className="mt-8 max-w-2xl text-base leading-relaxed text-white/85 md:mt-10 md:text-[1.05rem] md:leading-8">
            {intro}
          </p>
        </div>

        <dl
          ref={statsRef}
          className="mt-14 grid gap-12 md:mt-16 md:grid-cols-3 md:gap-10 lg:mt-20 lg:gap-12"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="pt-8 md:pt-10"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd
                data-stat-value
                className={`${playfair.className} text-4xl font-medium tracking-tight text-white md:text-5xl lg:text-[3.25rem] lg:leading-none`}
              >
                {formatPlatformStatValue(stat.value, stat)}
              </dd>
              <dd className="mt-4 font-mono text-[10px] font-medium tracking-[0.18em] text-white/70 uppercase md:text-[11px]">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-14 text-center text-sm text-white/60 italic md:mt-16 lg:mt-20">
          {footnote}
        </p>
      </div>
    </div>
  );
}
