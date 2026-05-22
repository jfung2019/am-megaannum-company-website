"use client";

import { useRef } from "react";

import HeroSection from "@/components/hero/HeroSection";
import PartnersCarousel from "@/components/sections/PartnersCarousel";
import PlatformSection from "@/components/sections/PlatformSection";
import ContactSection from "@/components/sections/ContactSection";
import EducationalVideosSection from "@/components/sections/EducationalVideosSection";
import OurPeopleSection from "@/components/sections/OurPeopleSection";
import VisionSection from "@/components/sections/VisionSection";

export default function HomePage() {
  const platformRef = useRef<HTMLElement>(null);

  return (
    <main className="relative bg-[#f8f9fa]">
      {/* Pinned cinematic block — hero on top, platform behind during portal */}
      <div
        data-hero-stack
        className="relative grid min-h-svh w-full grid-cols-1 *:col-start-1 *:row-start-1"
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
        <PartnersCarousel />
        <VisionSection />
        <EducationalVideosSection />
        <OurPeopleSection />
        <ContactSection />
      </div>
    </main>
  );
}
