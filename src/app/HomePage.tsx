import Footer from "@/components/footer/Footer";
import HeroSection from "@/components/hero/HeroSection";
import PartnersSection from "@/components/sections/partners/PartnersSection";
import PlatformSection from "@/components/sections/platform/PlatformSection";
import ContactSection from "@/components/sections/contact/ContactSection";
import TeamSection from "@/components/sections/team/TeamSection";
import { SILVERWATER_TEMP } from "@/lib/temp-branding";
import { getSiteContent } from "@/lib/cms/client";
import {
  contactContent,
  heroContent,
  partnerList,
  teamContent,
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
        {/* Hidden while SILVERWATER_TEMP is on. The CMS cannot hide it: an empty
            partner list falls back to the bundled partners. */}
        {!SILVERWATER_TEMP && <PartnersSection partners={partnerList(cms)} />}
        {/* Hidden while SILVERWATER_TEMP is on. Contact is white, unlike
            the navy footer, so the page still alternates colours. */}
        {!SILVERWATER_TEMP && (
          <TeamSection content={teamContent(cms)} />
        )}
        <ContactSection content={contactContent(cms)} />
        <Footer />
      </div>
    </main>
  );
}
