"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import gsap from "gsap";

import { revealOnScroll } from "@/lib/gsap/revealOnScroll";
import { BOARD_CONTENT } from "./people/people.config";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

type OurPeopleSectionProps = {
  className?: string;
};

export default function OurPeopleSection({
  className = "",
}: OurPeopleSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const grid = gridRef.current;
    if (!section || !header || !grid) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const cleanups: Array<() => void> = [];
    let disconnectReveal: (() => void) | undefined;
    let introTl: gsap.core.Timeline | null = null;

    const ctx = gsap.context(() => {
      const eyebrow = header.querySelector("[data-people-eyebrow]");
      const heading = header.querySelector("[data-people-heading]");
      const accentLine = header.querySelector("[data-people-line]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-person-card]", grid);

      if (reducedMotion) {
        gsap.set([eyebrow, heading, accentLine, ...cards], {
          clearProps: "all",
          opacity: 1,
          y: 0,
          scaleX: 1,
        });
        return;
      }

      gsap.set([eyebrow, heading], { y: 56, opacity: 0 });
      gsap.set(accentLine, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(cards, { y: 80, opacity: 0 });

      introTl = gsap.timeline({ paused: true });
      introTl
        .to(eyebrow, { y: 0, opacity: 1, duration: 1, ease: "power3.out" })
        .to(
          heading,
          { y: 0, opacity: 1, duration: 1.15, ease: "power3.out" },
          "-=0.7",
        )
        .to(
          accentLine,
          { scaleX: 1, duration: 1.25, ease: "power2.inOut" },
          "-=0.75",
        )
        .to(
          cards,
          {
            y: 0,
            opacity: 1,
            duration: 1.05,
            stagger: 0.2,
            ease: "power3.out",
          },
          "-=0.55",
        );

      introTl.eventCallback("onComplete", () => {
        cards.forEach((card) => {
          const image = card.querySelector("[data-person-image]");
          if (image) {
            gsap.to(image, {
              scale: 1,
              duration: 1.6,
              ease: "power2.out",
            });
          }
        });
      });

      cards.forEach((card) => {
        const image = card.querySelector("[data-person-image]");
        const overlay = card.querySelector("[data-person-overlay]");
        if (!image) return;

        gsap.set(image, { scale: 1.12 });

        const onEnter = () => {
          gsap.to(card, { y: -10, duration: 0.65, ease: "power2.out" });
          gsap.to(image, { scale: 1.05, duration: 0.9, ease: "power2.out" });
          if (overlay) {
            gsap.to(overlay, { opacity: 0.35, duration: 0.5 });
          }
        };
        const onLeave = () => {
          gsap.to(card, { y: 0, duration: 0.65, ease: "power2.out" });
          gsap.to(image, { scale: 1, duration: 0.9, ease: "power2.out" });
          if (overlay) {
            gsap.to(overlay, { opacity: 0.55, duration: 0.5 });
          }
        };

        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          card.removeEventListener("mouseenter", onEnter);
          card.removeEventListener("mouseleave", onLeave);
        });
      });
    }, section);

    if (introTl) {
      disconnectReveal = revealOnScroll(section, introTl);
    }

    return () => {
      disconnectReveal?.();
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  const { eyebrow, heading, members } = BOARD_CONTENT;

  return (
    <section
      ref={sectionRef}
      className={`relative w-full overflow-hidden bg-[#0a0a0a] text-white ${className}`.trim()}
      aria-labelledby="our-people-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-10%,rgba(236,114,26,0.14),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-[#ec721a]/5 blur-3xl"
        aria-hidden
      />

      <div className="relative w-full px-6 py-24 md:px-10 md:py-32 lg:px-14 lg:py-28 xl:px-20 xl:py-40">
        <header ref={headerRef} className="max-w-3xl">
          <p
            data-people-eyebrow
            className="font-mono text-[11px] font-medium tracking-[0.28em] text-white/45 uppercase"
          >
            {eyebrow}
          </p>
          <h2
            id="our-people-heading"
            data-people-heading
            className={`${playfair.className} mt-6 text-4xl leading-[1.08] font-medium tracking-tight md:text-5xl lg:text-[3.5rem] lg:leading-[1.06]`}
          >
            {heading}
          </h2>
          <div
            data-people-line
            className="mt-10 h-px w-28 origin-left bg-gradient-to-r from-[#ec721a] to-[#ec721a]/20"
            aria-hidden
          />
        </header>

        <div
          ref={gridRef}
          className="mt-16 grid gap-12 sm:grid-cols-2 md:mt-20 lg:grid-cols-3 lg:gap-10"
        >
          {members.map((member, index) => (
            <article
              key={member.id}
              data-person-card
              className="group cursor-default opacity-0 will-change-transform"
              style={{ zIndex: members.length - index }}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900">
                <Image
                  src={member.image}
                  alt={member.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-top grayscale transition-[filter] duration-700 group-hover:grayscale-0"
                  data-person-image
                />
                <div
                  data-person-overlay
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-55"
                  aria-hidden
                />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                  <p className="font-mono text-[10px] tracking-[0.2em] text-[#ec721a] uppercase">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3
                    data-person-name
                    className={`${playfair.className} mt-2 text-2xl font-medium tracking-tight md:text-[1.65rem]`}
                  >
                    {member.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    {member.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
