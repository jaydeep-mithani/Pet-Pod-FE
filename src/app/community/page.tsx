import {
  CommunityHeroSection,
  SuccessStoriesSection,
  CommunityStatsSection,
  VolunteerSection,
  EventsSection,
  CommunityTestimonialsSection,
  Footer,
} from '@/components';

export default function Community() {
  return (
    <main className="min-h-screen">
      <CommunityHeroSection />
      <SuccessStoriesSection />
      <CommunityStatsSection />
      <VolunteerSection />
      <EventsSection />
      <CommunityTestimonialsSection />
      <Footer />
    </main>
  );
}