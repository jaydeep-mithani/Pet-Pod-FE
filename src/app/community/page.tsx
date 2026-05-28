import React from "react";
import {
  FeaturedPetsSection,
  CommunityStatsSection,
  SuccessStoriesSection,
  CommunityEventsSection,
  Footer,
} from "@/components";

export default function CommunityPage() {
  return (
    <main className="min-h-screen">
      <FeaturedPetsSection />
      <CommunityStatsSection />
      <SuccessStoriesSection />
      <CommunityEventsSection />
      <Footer />
    </main>
  );
}