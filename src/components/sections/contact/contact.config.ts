export type ContactDetail = {
  label: string;
  value: string;
  href?: string;
};

export type ContactContent = {
  eyebrow: string;
  heading: string;
  subhead: string;
  details: ContactDetail[];
  form: {
    nameLabel: string;
    emailLabel: string;
    companyLabel: string;
    messageLabel: string;
    submitLabel: string;
  };
};

export const CONTACT_CONTENT: ContactContent = {
  eyebrow: "Contact",
  heading: "Let's build the future of treasury intelligence.",
  subhead:
    "Speak with our team about institutional onboarding, platform access, or partnership opportunities.",
  details: [
    { label: "General inquiries", value: "hello@megaannum.com", href: "mailto:hello@megaannum.com" },
    { label: "Institutional sales", value: "institutions@megaannum.com", href: "mailto:institutions@megaannum.com" },
    { label: "Headquarters", value: "Hong Kong · Singapore · United States", href: undefined },
  ],
  form: {
    nameLabel: "Full name",
    emailLabel: "Work email",
    companyLabel: "Organization",
    messageLabel: "How can we help?",
    submitLabel: "Send message",
  },
};
