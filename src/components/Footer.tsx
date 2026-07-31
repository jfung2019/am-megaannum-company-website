import Image from "next/image";

import { FOOTER_CONTENT } from "./footer/footer.config";

type FooterProps = {
  className?: string;
};

export default function Footer({ className = "" }: FooterProps) {
  const year = new Date().getFullYear();
  const { brand, tagline, copyrightOwner, logo } = FOOTER_CONTENT;

  return (
    <footer
      className={`w-full border-t border-white/10 bg-[#0a0a0a] text-white ${className}`.trim()}
    >
      <div className="flex w-full flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10 md:py-12 lg:px-14 xl:px-20">
        <div className="flex items-center gap-4">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={56}
            height={56}
            className="h-12 w-12 object-contain"
          />
          <div>
            <p className="font-mono text-[11px] font-medium tracking-[0.28em] text-white/45 uppercase">
              {brand}
            </p>
            <p className="mt-2 text-sm text-white/55">{tagline}</p>
          </div>
        </div>

        <p className="font-mono text-[10px] tracking-[0.14em] text-white/40 uppercase md:text-right">
          © {year} {copyrightOwner}
        </p>
      </div>
    </footer>
  );
}
