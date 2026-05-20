import { Playfair_Display } from "next/font/google";

import VisionVideo from "./vision/VisionVideo";
import { VISION_CONTENT } from "./vision/vision.config";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

type VisionSectionProps = {
  className?: string;
};

export default function VisionSection({ className = "" }: VisionSectionProps) {
  const { headingLine1, headingLine2, body } = VISION_CONTENT;

  return (
    <section
      className={`w-full bg-black text-white ${className}`.trim()}
      aria-labelledby="vision-heading"
    >
      <div className="grid w-full items-stretch gap-12 py-16 md:gap-0 md:py-0 lg:grid-cols-[minmax(0,42%)_1fr]">
        <div className="flex flex-col justify-center px-6 py-8 md:px-10 md:py-20 lg:px-14 lg:py-28 xl:px-20">
          <h2
            id="vision-heading"
            className={`${playfair.className} text-4xl leading-[1.08] font-medium tracking-tight md:text-5xl lg:text-[3.25rem] lg:leading-[1.06]`}
          >
            {headingLine1}
            <br />
            {headingLine2}
          </h2>
          <p className="mt-8 max-w-md text-base leading-relaxed text-white/78 md:mt-10 md:text-[1.05rem] md:leading-8">
            {body}
          </p>
        </div>

        <VisionVideo className="w-full min-h-[min(56vw,420px)] shadow-2xl shadow-black/50 md:min-h-[min(50vh,520px)] lg:min-h-[min(72vh,720px)] lg:shadow-none" />
      </div>
    </section>
  );
}
