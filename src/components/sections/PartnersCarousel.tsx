import Image from "next/image";

import { PARTNERS, type PartnerView } from "./partners/partners.config";

type PartnersCarouselProps = {
  className?: string;
  partners?: PartnerView[];
};

const FALLBACK: PartnerView[] = PARTNERS.map((p) => ({
  id: p.id,
  name: p.name,
  image: null,
  Logo: p.Logo,
}));

export default function PartnersCarousel({
  className = "",
  partners = FALLBACK,
}: PartnersCarouselProps) {
  // Doubled inside the component now that the list is a prop. The exact 2x
  // matters: the CSS marquee translates -50%, so any other multiple makes the
  // loop visibly jump.
  const marquee = [...partners, ...partners];

  return (
    <section
      id="partners"
      className={`relative overflow-hidden bg-[#f8f9fa] py-14 md:py-20 ${className}`.trim()}
      aria-label="Trusted partners"
    >
      {/* tracking-[0.28em] */}
      <p className="text-center font-mono text-[11px] font-medium text-black/45 uppercase">
        Our Partners
      </p>

      <div className="relative mt-10 md:mt-12">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-[#f8f9fa] to-transparent md:w-28"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-[#f8f9fa] to-transparent md:w-28"
          aria-hidden
        />

        <ul
          className="partners-marquee-track flex w-max items-center gap-14 px-8 md:gap-20 md:px-12"
          role="list"
        >
          {marquee.map((partner, index) => {
            const { Logo, image } = partner;
            return (
              <li
                key={`${partner.id}-${index}`}
                className="flex shrink-0 items-center"
                role="listitem"
                aria-label={partner.name}
              >
                {image ? (
                  <Image
                    src={image.url}
                    alt={partner.name}
                    width={image.width}
                    height={image.height}
                    className="h-7 w-auto object-contain md:h-8"
                    // Above the fold on most viewports, and the marquee has no
                    // scroll trigger to lazily wait for.
                    priority={index < partners.length}
                  />
                ) : Logo ? (
                  <Logo className="h-7 w-auto text-black md:h-8" />
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
