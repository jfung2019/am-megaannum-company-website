import { forwardRef } from "react";

import PlatformSectionContent from "./PlatformSectionContent";
import { PLATFORM_SECTION_BACKGROUND } from "./platform/platform.config";

const PlatformSection = forwardRef<
  HTMLElement,
  { className?: string }
>(function PlatformSection({ className = "" }, ref) {
  return (
    <section
      ref={ref}
      id="platform"
      className={`relative min-h-svh w-full origin-center pointer-events-none ${className}`.trim()}
      style={{ backgroundColor: PLATFORM_SECTION_BACKGROUND }}
      aria-labelledby="platform-heading"
      aria-hidden
      data-platform-section
    >
      <PlatformSectionContent />
    </section>
  );
});

export default PlatformSection;
