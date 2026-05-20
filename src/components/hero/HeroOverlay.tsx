"use client";

// import Image from "next/image";
// import Link from "next/link";
import { forwardRef } from "react";

// const LOGO_SRC = "/images/Megaannum_Logo.ai.png";

type HeroOverlayProps = {
  className?: string;
};

const HeroOverlay = forwardRef<HTMLElement, HeroOverlayProps>(
  function HeroOverlay({ className = "" }, ref) {
    return (
      <header
        ref={ref}
        className={`pointer-events-none relative z-10 flex h-full flex-col ${className}`}
      >
        <nav className="pointer-events-auto cursor-pointer flex items-center justify-between px-6 py-6 md:px-10 md:py-8">
          {/* <Link href="/" className="relative block h-10 w-44 shrink-0 md:h-12 md:w-54">
            <Image
              src={LOGO_SRC}
              alt="Megaannum"
              fill
              priority
              className="object-contain object-left"
              sizes="(max-width: 768px) 144px, 160px"
            />
          </Link> */}
          {/* tracking-[0.2em] */}
          <span className="text-lg font-bold text-[#ec721a] uppercase">
            Megaannum
          </span>
          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <a href="#platform" className="transition-colors hover:text-white">
              Platform
            </a>
            <a href="#solutions" className="transition-colors hover:text-white">
              Solutions
            </a>
            <a href="#contact" className="transition-colors hover:text-white">
              Contact
            </a>
          </div>
        </nav>

        <div className="relative flex flex-1 flex-col justify-center px-6 pb-16 md:px-10 md:pb-24">
          <div data-hero-intro className="max-w-3xl">
            {/* <p className="mb-4 text-xs font-medium tracking-[0.25em] text-[#ec721a] uppercase">
              AI Treasury Intelligence
            </p> */}
            <h1 className="text-4xl leading-[1.08] font-semibold tracking-tight text-white md:text-6xl lg:text-7xl">
              {/* See liquidity
              <br />
              before the market moves. */}
              Transforming
              <br />
              <span className="text-[#ec721a]">Financial</span>
              <br />
              Intelligence
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
              Institutional-grade treasury orchestration powered by predictive
              AI — from energy to insight in a single cinematic flow.
            </p>
            <div className="pointer-events-auto mt-10 flex flex-wrap gap-4">
              <a
                href="#platform"
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-medium text-slate-950 transition hover:bg-sky-50"
              >
                Explore platform
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition hover:border-white/40 hover:bg-white/10"
              >
                Web Portal
              </a>
            </div>
          </div>

          <div
            data-hero-mid
            className="pointer-events-none absolute bottom-24 left-6 max-w-md opacity-0 md:left-10"
          >
            <p className="text-sm tracking-wide text-sky-200/80 uppercase">
              Holographic intelligence
            </p>
            <p className="mt-2 text-lg text-white/75">
              Dashboard states morph in real time as capital flows shift.
            </p>
          </div>

          <div
            data-hero-exit
            className="pointer-events-none absolute bottom-28 right-6 max-w-sm text-right opacity-0 md:right-10"
          >
            <p className="text-sm tracking-wide text-white/50 uppercase">
              Entering the dimension
            </p>
            <p className="mt-2 text-xl font-medium text-white/90">
              Continue into the platform
            </p>
          </div>
        </div>

        <div
          data-hero-vignette
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950/70 opacity-50"
          aria-hidden
        />
      </header>
    );
  },
);

export default HeroOverlay;
