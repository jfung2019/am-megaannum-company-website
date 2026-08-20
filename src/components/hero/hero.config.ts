export type HeroHeadingLine = {
  text: string;
  /** CSS colour for this line; the h1 is white, so only accents differ. */
  color: string;
};

export type HeroContent = {
  headingLines: HeroHeadingLine[];
  body: string;
};

export const HERO_CONTENT: HeroContent = {
  headingLines: [
    { text: "Transforming", color: "#ffffff" },
    { text: "Financial", color: "#ec721a" },
    { text: "Intelligence", color: "#ffffff" },
  ],
  body:
    "We combine institutional trading experience, deep liquidity access, and advanced AI systems to identify opportunities across global markets.",
};
