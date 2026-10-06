import Image from "next/image";

import { SILVERWATER_TEMP } from "@/lib/temp-branding";
import { FOOTER_CONTENT } from "./footer/footer.config";

type FooterProps = {
  className?: string;
};

export default function Footer({ className = "" }: FooterProps) {
  const year = new Date().getFullYear();
  const { brand, tagline, copyrightOwner, logo } = FOOTER_CONTENT;

  return (
    <footer
      className={`w-full ${
        SILVERWATER_TEMP
          ? "border-t-2 border-[#ec721a] bg-[#071a33] text-white"
          : "border-t border-white/10 bg-[#0a0a0a] text-white"
      } ${className}`.trim()}
    >
      <div className="flex w-full flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10 md:py-12 lg:px-14 xl:px-20">
        <div className="flex items-center gap-4">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className={
              SILVERWATER_TEMP
                ? "h-12 w-auto object-contain md:h-16"
                : "h-12 w-12 object-contain"
            }
            quality={100}
          />
          {!SILVERWATER_TEMP && (
            <div>
              <p className="font-mono text-[11px] font-medium tracking-[0.28em] text-white/45 uppercase">
                {brand}
              </p>
              <p className="mt-2 text-sm text-white/55">{tagline}</p>
            </div>
          )}
        </div>

        <p
          className={`font-mono text-[10px] tracking-[0.14em] uppercase md:text-right ${
            SILVERWATER_TEMP ? "text-white/60" : "text-white/40"
          }`}
        >
          © {year} {copyrightOwner}
        </p>
      </div>
    </footer>
  );
}
