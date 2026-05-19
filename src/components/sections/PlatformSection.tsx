import PlatformSectionContent from "./PlatformSectionContent";

export default function PlatformSection() {
  return (
    <section
      id="platform"
      className="relative min-h-screen bg-[#f8f9fa] pointer-events-none"
      aria-hidden
      data-platform-section
    >
      <PlatformSectionContent className="px-6 py-28 md:px-10" />
    </section>
  );
}
