import { SILVERWATER_BRAND, SILVERWATER_TEMP } from "@/lib/temp-branding";

const MEGAANNUM_FOOTER = {
  brand: "Megaannum",
  tagline: "AI treasury intelligence",
  copyrightOwner: "Megaannum Asset Management",
  logo: {
    src: "/images/Megaannum_Logo.ai.png",
    alt: "Megaannum crest logo",
    width: 56,
    height: 56,
  },
};

// Temporary SilverWater branding; see src/lib/temp-branding.ts.
const SILVERWATER_FOOTER = {
  brand: SILVERWATER_BRAND.name,
  tagline: "",
  copyrightOwner: SILVERWATER_BRAND.name,
  logo: SILVERWATER_BRAND.footerLogo,
};

export const FOOTER_CONTENT = SILVERWATER_TEMP ? SILVERWATER_FOOTER : MEGAANNUM_FOOTER;
