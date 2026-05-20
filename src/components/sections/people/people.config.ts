export type BoardMember = {
  id: string;
  name: string;
  role: string;
  image: string;
  imageAlt: string;
};

export const BOARD_CONTENT = {
  eyebrow: "Board of Directors",
  heading: "They make it possible",
  members: [
    {
      id: "ceo",
      name: "Elena Vasquez",
      role: "Chief Executive Officer",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&h=1200&fit=crop&q=80",
      imageAlt: "Portrait of Elena Vasquez, Chief Executive Officer",
    },
    {
      id: "coo",
      name: "James Whitfield",
      role: "Chief Operating Officer",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=900&h=1200&fit=crop&q=80",
      imageAlt: "Portrait of James Whitfield, Chief Operating Officer",
    },
    {
      id: "cfo",
      name: "Amara Okonkwo",
      role: "Chief Financial Officer",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=900&h=1200&fit=crop&q=80",
      imageAlt: "Portrait of Amara Okonkwo, Chief Financial Officer",
    },
  ] satisfies BoardMember[],
} as const;
