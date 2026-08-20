"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import gsap from "gsap";

import { HERO_CONTENT, type HeroContent } from "./hero.config";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

type HeroOverlayProps = {
  className?: string;
  content?: HeroContent;
};

export default function HeroOverlay({
  className = "",
  content = HERO_CONTENT,
}: HeroOverlayProps) {
  const { logo, brand, headingLines: lines, body } = content;
  const rootRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headingLineRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    const headingLines = headingLineRefs.current.filter(Boolean);
    if (!root || !panel || headingLines.length === 0) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set([...headingLines, panel], { clearProps: "all", opacity: 1 });
        return;
      }

      gsap.set(headingLines, { y: 36, opacity: 0 });
      gsap.set(panel, { y: 28, opacity: 0 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(headingLines, {
          y: 0,
          opacity: 1,
          duration: 0.95,
          stagger: 0.12,
        })
        .to(
          panel,
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
          },
          "-=0.35",
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={rootRef}
      className={`pointer-events-none absolute inset-0 z-10 flex h-full flex-col ${className}`.trim()}
    >
      <nav className="pointer-events-auto flex cursor-pointer items-center justify-between px-6 py-6 md:px-10 md:py-8 lg:px-14 xl:px-20">
        {logo ? (
          <Image
            src={logo.url}
            alt={brand}
            width={logo.width}
            height={logo.height}
            className="h-7 w-auto object-contain md:h-8"
            // The brand mark is the topmost thing on the page; lazy-loading it
            // would flash an empty nav on first paint.
            priority
          />
        ) : (
          <span className="text-lg font-bold text-[#ec721a] uppercase">
            {brand}
          </span>
        )}
        <div className="hidden items-center gap-5 text-sm text-white/70 md:flex lg:gap-7">
          <a href="#home" className="transition-colors hover:text-white">
            Home
          </a>
          <a href="#platform" className="transition-colors hover:text-white">
            Investment Edge
          </a>
          <a href="#partners" className="transition-colors hover:text-white">
            Partners
          </a>
          <a href="#team" className="transition-colors hover:text-white">
            Our Team
          </a>
          <a href="#contact" className="transition-colors hover:text-white">
            Contact
          </a>
          <a href="#platform" className="transition-colors hover:text-white">
            Client portal
          </a>
        </div>
      </nav>

      <div className="relative flex flex-1 flex-col px-6 pt-10 pb-48 md:px-10 md:pt-14 md:pb-56 lg:px-14 xl:px-20">
        <div className="mt-6 max-w-3xl md:mt-10 lg:mt-14">
          <h1
            className={`${playfair.className} text-5xl leading-[1.03] font-medium tracking-tight text-white md:text-6xl lg:text-7xl xl:text-[5.75rem]`}
          >
            {lines.map((line, index) => (
              <span
                key={`${line.text}-${index}`}
                ref={(el) => {
                  headingLineRefs.current[index] = el;
                }}
                className="block opacity-0"
                style={{ color: line.color }}
              >
                {line.text}
              </span>
            ))}
          </h1>
        </div>
      </div>

      <div
        ref={panelRef}
        className="pointer-events-auto absolute inset-x-0 bottom-0 border-y border-white/10 bg-[#071a33]/40 px-6 py-8 text-white opacity-0 shadow-2xl shadow-black/25 backdrop-blur-xl md:px-10 md:py-10 lg:px-14 xl:px-20"
      >
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl text-base leading-relaxed text-white/85 md:text-lg md:leading-8">
            <p>{body}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-4">
            <a
              href="#platform"
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-medium text-slate-950 transition hover:bg-sky-50"
            >
              Client portal
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
