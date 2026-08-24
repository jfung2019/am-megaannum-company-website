import PlatformSectionContent from "./PlatformSectionContent";
import {
  PLATFORM_CONTENT,
  type PlatformContent,
} from "./platform/platform.config";

type PlatformSectionProps = {
  className?: string;
  content?: PlatformContent;
};

export default function PlatformSection({
  className = "",
  content = PLATFORM_CONTENT,
}: PlatformSectionProps) {
  return (
    <section
      id="platform"
      className={`relative min-h-svh w-full origin-center ${className}`.trim()}
      style={{ backgroundColor: content.background }}
      aria-labelledby="platform-heading"
      data-platform-section
    >
      <PlatformSectionContent content={content} />
    </section>
  );
}
