"use client";

import { useRef } from "react";

import HeroSection from "@/components/hero/HeroSection";
import PlatformSection from "@/components/sections/PlatformSection";

export default function HomePage() {
  const platformRef = useRef<HTMLElement>(null);

  return (
    <main className="relative bg-[#f8f9fa]">
      {/* Pinned cinematic block — hero on top, platform behind during portal */}
      <div
        data-hero-stack
        className="relative grid min-h-svh w-full grid-cols-1 [&>*]:col-start-1 [&>*]:row-start-1"
      >
        <HeroSection
          platformRef={platformRef}
          className="relative z-20 min-h-svh w-full isolate"
        />

        <PlatformSection
          ref={platformRef}
          className="relative z-0 min-h-svh w-full origin-center"
        />
      </div>

      {/* Rest of the site scrolls normally after the hero handoff */}
      <div data-page-continuation className="relative z-10">
        {/* Add more sections below as components */}
        <div className="relative z-0 min-h-svh w-full origin-center bg-red-200">
          <h1>testing new section component</h1>
        </div>
      </div>
    </main>
  );
}
