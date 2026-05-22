import { Playfair_Display } from "next/font/google";

import EducationalVideoCard from "./education/EducationalVideoCard";
import { EDUCATION_CONTENT } from "./education/education.config";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

type EducationalVideosSectionProps = {
  className?: string;
};

export default function EducationalVideosSection({
  className = "",
}: EducationalVideosSectionProps) {
  const { eyebrow, heading, description, videos } = EDUCATION_CONTENT;

  return (
    <section
      id="education"
      className={`w-full bg-[#f8f9fa] text-[#1c1c1c] ${className}`.trim()}
      aria-labelledby="education-heading"
    >
      <div className="w-full px-6 py-24 md:px-10 md:py-28 lg:px-14 lg:py-32 xl:px-20">
        <header className="max-w-2xl">
          <p className="font-mono text-[11px] font-medium tracking-[0.28em] text-black/45 uppercase">
            {eyebrow}
          </p>
          <h2
            id="education-heading"
            className={`${playfair.className} mt-6 text-4xl leading-[1.08] font-medium tracking-tight md:text-5xl lg:text-[3.25rem] lg:leading-[1.06]`}
          >
            {heading}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-black/65 md:mt-8 md:text-[1.05rem] md:leading-8">
            {description}
          </p>
          <div
            className="mt-10 h-px w-28 origin-left bg-linear-to-r from-[#ec721a] to-[#ec721a]/20"
            aria-hidden
          />
        </header>

        <ul
          className="mt-16 grid list-none gap-10 sm:grid-cols-2 md:mt-20 lg:grid-cols-3 lg:gap-8"
          role="list"
        >
          {videos.map((video) => (
            <li key={video.id} role="listitem">
              <EducationalVideoCard
                title={video.title}
                description={video.description}
                youtubeUrl={video.youtubeUrl}
                className="h-full"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
