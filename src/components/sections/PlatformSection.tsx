import { forwardRef } from "react";

import PlatformSectionContent from "./PlatformSectionContent";

const PlatformSection = forwardRef<
  HTMLElement,
  { className?: string }
>(function PlatformSection({ className = "" }, ref) {
  return (
    <section
      ref={ref}
      id="platform"
      className={`relative min-h-svh w-full origin-center bg-[#f8f9fa] pointer-events-none ${className}`.trim()}
      aria-hidden
      data-platform-section
    >
      <PlatformSectionContent className="px-6 py-28 md:px-10" />
    </section>
  );
});

export default PlatformSection;
