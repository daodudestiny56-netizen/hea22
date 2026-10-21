import { EmergencyBand } from "@/components/landing/emergency-band";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ResponsibleUse } from "@/components/landing/responsible-use";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <HowItWorks />
        <ResponsibleUse />
        <EmergencyBand />
      </main>
      <SiteFooter />
    </>
  );
}
