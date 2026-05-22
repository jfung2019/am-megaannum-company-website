export type EducationalVideo = {
  id: string;
  title: string;
  description: string;
  /** Full YouTube URL (watch, youtu.be, or embed) */
  youtubeUrl: string;
};

export const EDUCATION_CONTENT = {
  eyebrow: "Resources",
  heading: "Educational videos",
  description:
    "Short explainers on treasury workflows, liquidity intelligence, and how teams use the Megaannum platform day to day.",
  videos: [
    {
      id: "platform-overview",
      title: "Platform overview",
      description:
        "A walkthrough of dashboards, signals, and how institutions onboard to Megaannum.",
      youtubeUrl: "https://www.youtube.com/watch?v=ZCFkWDdmXG8",
    },
    {
      id: "liquidity-signals",
      title: "Reading liquidity signals",
      description:
        "How predictive models surface stress before settlement windows tighten.",
      youtubeUrl: "https://www.youtube.com/watch?v=LXb3EKWsInQ",
    },
    {
      id: "treasury-workflows",
      title: "Treasury workflows in practice",
      description:
        "From alert to action — coordinating teams across entities and corridors.",
      youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
    },
  ] satisfies EducationalVideo[],
} as const;
