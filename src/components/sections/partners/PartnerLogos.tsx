type LogoProps = {
  className?: string;
};

export function MeridianLogo({ className = "" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 148 32"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="16" r="7" />
      <text
        x="28"
        y="21"
        fontSize="17"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="600"
      >
        meridian
      </text>
    </svg>
  );
}

export function HorizonLogo({ className = "" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 148 32"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path
        d="M6 22c5-10 14-14 22-10 4 2 7 6 8 10H6z"
        opacity="0.9"
      />
      <text
        x="38"
        y="21"
        fontSize="14"
        fontFamily="system-ui, sans-serif"
        fontWeight="600"
        letterSpacing="0.14em"
      >
        HORIZON
      </text>
    </svg>
  );
}

export function VaultlineLogo({ className = "" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 148 32"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <rect
        x="4"
        y="8"
        width="18"
        height="16"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M9 14h8M9 18h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <text
        x="30"
        y="21"
        fontSize="15"
        fontFamily="system-ui, sans-serif"
        fontWeight="600"
      >
        vaultline
      </text>
    </svg>
  );
}

export function NorthgateLogo({ className = "" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 168 32"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <circle cx="10" cy="16" r="2.5" />
      <circle cx="18" cy="11" r="2.5" />
      <circle cx="18" cy="21" r="2.5" />
      <line x1="10" y1="16" x2="18" y2="11" stroke="currentColor" strokeWidth="1.2" />
      <line x1="10" y1="16" x2="18" y2="21" stroke="currentColor" strokeWidth="1.2" />
      <text
        x="28"
        y="21"
        fontSize="15"
        fontFamily="system-ui, sans-serif"
        fontWeight="600"
      >
        Northgate
      </text>
      <text
        x="102"
        y="21"
        fontSize="13"
        fontFamily="system-ui, sans-serif"
        fontWeight="500"
        opacity="0.7"
      >
        .ai
      </text>
    </svg>
  );
}

export function ClearflowLogo({ className = "" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 148 32"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path
        d="M16 16a6 6 0 1 0-6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 16l3 3 7-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="30"
        y="21"
        fontSize="15"
        fontFamily="system-ui, sans-serif"
        fontWeight="700"
      >
        Clearflow
      </text>
    </svg>
  );
}

export function LatticeLogo({ className = "" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 128 32"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <rect x="4" y="8" width="7" height="7" rx="1" />
      <rect x="13" y="8" width="7" height="7" rx="1" />
      <rect x="4" y="17" width="7" height="7" rx="1" />
      <rect x="13" y="17" width="7" height="7" rx="1" />
      <text
        x="28"
        y="21"
        fontSize="17"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontStyle="italic"
      >
        lattice
      </text>
    </svg>
  );
}
