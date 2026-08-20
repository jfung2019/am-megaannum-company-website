export type HeroHeadingLine = {
  text: string;
  /** CSS colour for this line; the h1 is white, so only accents differ. */
  color: string;
};

import type { CmsImage } from "@/lib/cms/map";

export type HeroContent = {
  /** Brand mark from the CMS. Null falls back to the `brand` wordmark below. */
  logo: CmsImage | null;
  brand: string;
  headingLines: HeroHeadingLine[];
  body: string;
};

export const HERO_CONTENT: HeroContent = {
  logo: null,
  brand: "Megaannum",
  headingLines: [
    { text: "Transforming", color: "#ffffff" },
    { text: "Financial", color: "#ec721a" },
    { text: "Intelligence", color: "#ffffff" },
  ],
  body:
    "We combine institutional trading experience, deep liquidity access, and advanced AI systems to identify opportunities across global markets.",
};
