import {
  CommunityHeroSection,
  FinalCTASection,
  Footer,
  MissionSection,
  ResourcesSection,
} from "@/components";

export default function CommunityPage() {
  return (
    <main className="min-h-screen">
      <CommunityHeroSection />
      <MissionSection />
      <ResourcesSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
