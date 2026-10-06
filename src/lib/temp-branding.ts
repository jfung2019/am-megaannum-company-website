/**
 * TEMPORARY (2026-10-06, ~1 month): the site is served on silverwater-cm.com
 * with SilverWater branding. Set to false to restore Megaannum branding, the
 * contact form and the client portal.
 */
export const SILVERWATER_TEMP = true;

export const SILVERWATER_BRAND = {
  name: "SilverWater Capital Management",
  /** White-on-transparent, for the dark hero nav. */
  heroLogo: {
    url: "/images/silverwater_logo_all_white.png",
    width: 1674,
    height: 398,
    mime: "image/png",
  },
  /** White-on-transparent, for the navy footer. */
  footerLogo: {
    src: "/images/silverwater_logo_all_white.png",
    alt: "SilverWater Capital Management",
    width: 1674,
    height: 398,
  },
} as const;

/** Contact details shown instead of the CMS/bundled ones (from the SilverWater site). */
export const SILVERWATER_CONTACT_DETAILS = [
  { label: "General enquiries", value: "hello@silverwater-cm.com", href: "mailto:hello@silverwater-cm.com" },
  { label: "Headquarters", value: "Hong Kong · Singapore · United States", href: undefined },
];
