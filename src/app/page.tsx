import {
  HeroSection,
  LivePetsPreviewSection,
  HowItWorksSection,
  WhyNoMoneySection,
  FinalCTASection,
  Footer,
} from "@/components";

export const revalidate = 60;

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <LivePetsPreviewSection />
      <HowItWorksSection />
      <WhyNoMoneySection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
