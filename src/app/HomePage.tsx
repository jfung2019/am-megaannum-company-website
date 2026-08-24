import Footer from "@/components/Footer";
import HeroSection from "@/components/hero/HeroSection";
import PartnersCarousel from "@/components/sections/PartnersCarousel";
import PlatformSection from "@/components/sections/PlatformSection";
import ContactSection from "@/components/sections/ContactSection";
import OurPeopleSection from "@/components/sections/OurPeopleSection";
import { getSiteContent } from "@/lib/cms/client";
import {
  contactContent,
  heroContent,
  partnerList,
  peopleContent,
  platformContent,
} from "@/lib/cms/map";

export default async function HomePage() {
  // Server-side on purpose. The sections' GSAP effects snapshot the DOM once at
  // mount, so content has to be in the initial HTML — a browser fetch would
  // leave cards stuck at their opacity-0 start state. It also keeps the site key
  // out of the client bundle. `null` here is a normal state: the mapper falls
  // back to the bundled configs.
  const cms = await getSiteContent();

  return (
    <main className="relative bg-[#f8f9fa]">
      <HeroSection content={heroContent(cms)} />
      <PlatformSection content={platformContent(cms)} />
      <div data-page-continuation className="relative z-10">
        <PartnersCarousel partners={partnerList(cms)} />
        <OurPeopleSection content={peopleContent(cms)} />
        <ContactSection content={contactContent(cms)} />
        <Footer />
      </div>
    </main>
  );
}
