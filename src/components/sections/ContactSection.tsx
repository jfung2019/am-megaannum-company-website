"use client";

import { useEffect, useRef } from "react";
import { Playfair_Display } from "next/font/google";
import gsap from "gsap";

import { revealOnScroll } from "@/lib/gsap/revealOnScroll";
import { CONTACT_CONTENT } from "./contact/contact.config";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

type ContactSectionProps = {
  className?: string;
};

export default function ContactSection({ className = "" }: ContactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let disconnectReveal: (() => void) | undefined;
    let revealTl: gsap.core.Timeline | null = null;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(content, { clearProps: "all", opacity: 1, y: 0 });
        return;
      }

      gsap.set(content, { y: 48, opacity: 0 });

      revealTl = gsap.timeline({ paused: true });
      revealTl.to(content, {
        y: 0,
        opacity: 1,
        duration: 1.05,
        ease: "power3.out",
      });
    }, section);

    if (revealTl) {
      disconnectReveal = revealOnScroll(section, revealTl, {
        threshold: 0.2,
        rootMargin: "0px 0px -28% 0px",
        syncStartRatio: 0.68,
      });
    }

    return () => {
      disconnectReveal?.();
      ctx.revert();
    };
  }, []);

  const { eyebrow, heading, subhead, details, form } = CONTACT_CONTENT;

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={`w-full bg-[#f8f9fa] text-[#1c1c1c] ${className}`.trim()}
      aria-labelledby="contact-heading"
    >
      <div className="w-full px-6 py-24 md:px-10 md:py-28 lg:px-14 lg:py-32 xl:px-20">
        <div className="mx-auto max-w-2xl">
          <div ref={contentRef} className="text-center opacity-0">
            <p className="font-mono text-[11px] font-medium tracking-[0.22em] text-black/45 uppercase">
              {eyebrow}
            </p>
            <h2
              id="contact-heading"
              className={`${playfair.className} mx-auto mt-5 max-w-xl text-3xl leading-[1.1] font-medium tracking-tight md:text-4xl lg:text-[2.75rem]`}
            >
              {heading}
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-black/60 md:text-[1.05rem] md:leading-8">
              {subhead}
            </p>

            <ul className="mt-10 space-y-5 border-t border-black/10 pt-10">
              {details.map((item) => (
                <li key={item.label}>
                  <p className="font-mono text-[10px] tracking-[0.18em] text-black/40 uppercase">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="mt-1 inline-block text-base text-[#1c1c1c] underline-offset-4 transition hover:text-[#ec721a] hover:underline"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-base text-[#1c1c1c]">
                      {item.value}
                    </p>
                  )}
                </li>
              ))}
            </ul>

            <form
              className="mt-12 space-y-5 text-left"
              onSubmit={(e) => e.preventDefault()}
              noValidate
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-medium tracking-wide text-black/50 uppercase">
                    {form.nameLabel}
                  </span>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    className="w-full border border-black/12 bg-white px-4 py-3 text-sm text-[#1c1c1c] outline-none transition focus:border-[#ec721a]/60 focus:ring-2 focus:ring-[#ec721a]/15"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-medium tracking-wide text-black/50 uppercase">
                    {form.emailLabel}
                  </span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    className="w-full border border-black/12 bg-white px-4 py-3 text-sm text-[#1c1c1c] outline-none transition focus:border-[#ec721a]/60 focus:ring-2 focus:ring-[#ec721a]/15"
                  />
                </label>
              </div>
              <label className="block">
                <span className="mb-2 block text-xs font-medium tracking-wide text-black/50 uppercase">
                  {form.companyLabel}
                </span>
                <input
                  type="text"
                  name="company"
                  autoComplete="organization"
                  className="w-full border border-black/12 bg-white px-4 py-3 text-sm text-[#1c1c1c] outline-none transition focus:border-[#ec721a]/60 focus:ring-2 focus:ring-[#ec721a]/15"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-medium tracking-wide text-black/50 uppercase">
                  {form.messageLabel}
                </span>
                <textarea
                  name="message"
                  rows={4}
                  className="w-full resize-y border border-black/12 bg-white px-4 py-3 text-sm text-[#1c1c1c] outline-none transition focus:border-[#ec721a]/60 focus:ring-2 focus:ring-[#ec721a]/15"
                />
              </label>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-[#ec721a] px-8 py-3.5 text-sm font-medium text-white transition hover:bg-[#d66512] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ec721a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8f9fa]"
              >
                {form.submitLabel}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
