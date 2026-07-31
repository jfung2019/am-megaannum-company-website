import PlatformSectionContent from "./PlatformSectionContent";
import { PLATFORM_SECTION_BACKGROUND } from "./platform/platform.config";

type PlatformSectionProps = {
  className?: string;
};

export default function PlatformSection({
  className = "",
}: PlatformSectionProps) {
  return (
    <section
      id="platform"
      className={`relative min-h-svh w-full origin-center ${className}`.trim()}
      style={{ backgroundColor: PLATFORM_SECTION_BACKGROUND }}
      aria-labelledby="platform-heading"
      data-platform-section
    >
      <PlatformSectionContent />
    </section>
  );
}
