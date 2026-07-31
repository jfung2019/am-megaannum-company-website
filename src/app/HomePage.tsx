import Footer from "@/components/Footer";
import HeroSection from "@/components/hero/HeroSection";
import PartnersCarousel from "@/components/sections/PartnersCarousel";
import PlatformSection from "@/components/sections/PlatformSection";
import ContactSection from "@/components/sections/ContactSection";
import OurPeopleSection from "@/components/sections/OurPeopleSection";

export default function HomePage() {
  return (
    <main className="relative bg-[#f8f9fa]">
      <HeroSection />
      <PlatformSection />
      <div data-page-continuation className="relative z-10">
        <PartnersCarousel />
        <OurPeopleSection />
        <ContactSection />
        <Footer />
      </div>
    </main>
  );
}
