/** Platform section background only (portal white fill stays separate) */
export const PLATFORM_SECTION_BACKGROUND = "#ec721a";

export type PlatformStat = {
  value: number;
  /** Count-up start; defaults to ~85% of value */
  from?: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

export type PlatformContent = {
  /** Rendered as one heading; the CMS stores it as a single string. */
  headline: string;
  intro: string;
  stats: PlatformStat[];
  footnote: string;
  /** Section background, from the CMS accent colour. */
  background: string;
};

export const PLATFORM_CONTENT: PlatformContent = {
  headline: "Our investment edge",
  intro:
    "We trade across multiple time frames—from seconds to months—with deep liquidity in every liquid symbol, including derivatives. Advanced AI and ML power our process, led by senior portfolio managers and traders from large banks and hedge funds.",
  stats: [
    {
      value: 20_000,
      from: 17_000,
      suffix: "+",
      label: "Investment decisions made",
    },
    {
      value: 20,
      from: 5,
      suffix: "+",
      label: "Years industry experience",
    },
    {
      value: 5,
      from: 0,
      label: "Distinct strategies deployed",
    },
  ],
  footnote: "All statistics as of July 2026",
  background: PLATFORM_SECTION_BACKGROUND,
};

export function formatPlatformStatValue(
  n: number,
  options: Pick<PlatformStat, "prefix" | "suffix"> = {},
): string {
  const { prefix = "", suffix = "" } = options;
  return `${prefix}${Math.round(n).toLocaleString("en-US")}${suffix}`;
}
