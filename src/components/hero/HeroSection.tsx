import HeroOverlay from "./HeroOverlay";
import { HERO_CONTENT, type HeroContent } from "./hero.config";

type HeroSectionProps = {
  className?: string;
  content?: HeroContent;
};

export default function HeroSection({
  className = "",
  content = HERO_CONTENT,
}: HeroSectionProps) {
  return (
    <section
      id="home"
      className={`relative h-svh w-full overflow-hidden bg-[#030712] ${className}`.trim()}
      aria-label="Megaannum introduction"
    >
      {/* src on the element, not a typed <source>: the CMS serves whatever mime
          was uploaded and a wrong `type` makes the browser skip the file. */}
      <video
        key={content.videoUrl}
        src={content.videoUrl}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.35)_0%,rgba(2,6,23,0.18)_45%,rgba(2,6,23,0.85)_100%)]"
        aria-hidden
      />
      <HeroOverlay content={content} />
    </section>
  );
}
