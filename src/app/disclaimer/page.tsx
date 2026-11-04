import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Playfair_Display } from "next/font/google";

import Footer from "@/components/footer/Footer";
import { DISCLAIMER_CONTENT } from "@/components/disclaimer/disclaimer.config";
import {
  SILVERWATER_BRAND,
  SILVERWATER_TEMP,
} from "@/lib/temp-branding";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: `${DISCLAIMER_CONTENT.title} | ${SILVERWATER_BRAND.name}`,
  description:
    "Important information about the use of this website and the risks of investing.",
};

export default function DisclaimerPage() {
  // The wording names Silverwater, so it must not show under Megaannum branding.
  if (!SILVERWATER_TEMP) notFound();

  const { title, paragraphs } = DISCLAIMER_CONTENT;

  return (
    <>
      <main className="min-h-svh bg-white text-[#1c1c1c]">
        <div className="w-full px-6 py-16 md:px-10 md:py-24 lg:px-14 xl:px-20">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/"
              className="font-mono text-[11px] tracking-[0.22em] text-black/50 uppercase underline-offset-4 transition hover:text-black hover:underline"
            >
              ← Back to home
            </Link>

            <h1
              className={`${playfair.className} mt-10 text-3xl leading-[1.1] font-medium tracking-tight md:text-4xl lg:text-[2.75rem]`}
            >
              {title}
            </h1>

            <div className="mt-10 space-y-6 text-base leading-relaxed text-black/70 md:text-[1.05rem] md:leading-8">
              {paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
