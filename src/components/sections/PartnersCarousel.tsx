import { PARTNERS } from "./partners/partners.config";

type PartnersCarouselProps = {
  className?: string;
};

const MARQUEE_PARTNERS = [...PARTNERS, ...PARTNERS];

export default function PartnersCarousel({
  className = "",
}: PartnersCarouselProps) {
  return (
    <section
      className={`relative overflow-hidden bg-[#f8f9fa] py-14 md:py-20 ${className}`.trim()}
      aria-label="Trusted partners"
    >
      {/* tracking-[0.28em] */}
      <p className="text-center font-mono text-[11px] font-medium text-black/45 uppercase">
        Our Partners
      </p>

      <div className="relative mt-10 md:mt-12">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#f8f9fa] to-transparent md:w-28"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#f8f9fa] to-transparent md:w-28"
          aria-hidden
        />

        <ul
          className="partners-marquee-track flex w-max items-center gap-14 px-8 md:gap-20 md:px-12"
          role="list"
        >
          {MARQUEE_PARTNERS.map((partner, index) => {
            const { Logo } = partner;
            return (
              <li
                key={`${partner.id}-${index}`}
                className="flex shrink-0 items-center"
                role="listitem"
                aria-label={partner.name}
              >
                <Logo className="h-7 w-auto text-black md:h-8" />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
