import { Playfair_Display } from "next/font/google";

import { PLATFORM_CONTENT } from "./platform/platform.config";

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
  const { headline, intro, stats, footnote } = PLATFORM_CONTENT;

  return (
    <div
      className={`flex min-h-svh w-full flex-col justify-center text-white ${className}`.trim()}
    >
      <div className="w-full px-6 py-20 md:px-10 md:py-24 lg:px-14 lg:py-28 xl:px-20">
        <div className="grid items-start gap-10 border-b border-white/25 pb-14 md:gap-12 md:pb-16 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16 lg:pb-20">
          <h2
            id="platform-heading"
            className={`${playfair.className} max-w-3xl text-[2.35rem] leading-[1.12] font-medium tracking-tight text-white md:text-5xl md:leading-[1.1] lg:text-[3.35rem] lg:leading-[1.08]`}
          >
            {headline.line1}
            <br />
            {headline.line2}
            <br />
            {headline.line3}
          </h2>

          <p className="max-w-md text-base leading-relaxed text-white/85 md:text-[1.05rem] md:leading-8 lg:pt-1">
            {intro}
          </p>
        </div>

        <dl className="mt-14 grid gap-12 md:mt-16 md:grid-cols-3 md:gap-10 lg:mt-20 lg:gap-12">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border-t border-white/30 pt-8 md:pt-10"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd
                className={`${playfair.className} text-4xl font-medium tracking-tight text-white md:text-5xl lg:text-[3.25rem] lg:leading-none`}
              >
                {stat.value}
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
