export type TeamMember = {
  id: string;
  name: string;
  role: string;
  /** Empty when the CMS has no photo for this person; the card renders a placeholder. */
  image: string;
  /** From the CMS ImageRef; drives whether the card skips next/image optimization for SVGs. */
  imageMime: string;
  imageAlt: string;
};

export type PeopleContent = {
  eyebrow: string;
  heading: string;
  members: TeamMember[];
  portfolioTeam: {
    heading: string;
    members: TeamMember[];
  };
};

export const BOARD_CONTENT: PeopleContent = {
  eyebrow: "Board of Directors",
  heading: "They make it possible",
  members: [
    {
      id: "ceo",
      name: "Dr. Sam",
      role: "Chief Executive Officer",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&h=1200&fit=crop&q=80",
      imageMime: "image/jpeg",
      imageAlt: "Portrait of DR. Sam, Chief Executive Officer",
    },
    {
      id: "coo",
      name: "Joanna",
      role: "Compliance Officer & Chief Operating Officer",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=900&h=1200&fit=crop&q=80",
      imageMime: "image/jpeg",
      imageAlt: "Portrait of Joanna, Compliance Officer & Chief Operating Officer",
    },
    {
      id: "cto",
      name: "Teddy",
      role: "Chief Technology Officer",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=900&h=1200&fit=crop&q=80",
      imageMime: "image/jpeg",
      imageAlt: "Portrait of Teddy, Chief Technology Officer",
    },
  ],
  portfolioTeam: {
    heading: "Portfolio management team",
    members: [
      {
        id: "jackson",
        name: "Jackson",
        role: "Portfolio Manager",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&q=80",
      imageMime: "image/jpeg",
        imageAlt: "Portrait of Jackson, Portfolio Manager",
      },
      {
        id: "wilson",
        name: "Wilson",
        role: "Portfolio Manager",
        image:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=800&fit=crop&q=80",
      imageMime: "image/jpeg",
        imageAlt: "Portrait of Wilson, Portfolio Manager",
      },
      {
        id: "hale",
        name: "Hale",
        role: "Portfolio Manager",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop&q=80",
      imageMime: "image/jpeg",
        imageAlt: "Portrait of Hale, Portfolio Manager",
      },
      {
        id: "amy",
        name: "Amy",
        role: "Portfolio Manager",
        image:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=800&fit=crop&q=80",
      imageMime: "image/jpeg",
        imageAlt: "Portrait of Amy, Portfolio Manager",
      },
    ],
  },
};
