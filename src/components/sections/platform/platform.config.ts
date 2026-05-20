/** Platform section background only (portal white fill stays separate) */
export const PLATFORM_SECTION_BACKGROUND = "#ec721a";

export type PlatformStat = {
  value: string;
  label: string;
};

export const PLATFORM_CONTENT = {
  headline: {
    line1: "Multiple Signals.",
    line2: "Infinite Opportunities.",
    line3: "One Platform.",
  },
  intro:
    "Megaannum is an AI-native treasury intelligence platform that unifies liquidity analytics, risk surveillance, and governed execution for institutional teams operating across entities, corridors, and settlement windows.",
  stats: [
    { value: "$2.4T+", label: "Liquidity monitored daily¹" },
    { value: "40+", label: "Global treasury desks²" },
    { value: "99.2%", label: "Forecast accuracy on stress events³" },
  ] satisfies PlatformStat[],
  footnote: "All statistics as of May 1, 2026",
} as const;
