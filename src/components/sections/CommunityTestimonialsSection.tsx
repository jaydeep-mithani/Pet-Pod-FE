import React from "react";
import Card from "../ui/Card";
import Section from "../ui/Section";
import Button from "../ui/Button";
import { 
  Star, 
  Heart, 
  Users, 
  Calendar,
  Award
} from "lucide-react";

const CommunityTestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: "Jennifer Martinez",
      role: "Pet Adopter",
      location: "Los Angeles, CA",
      pet: "Max (Golden Retriever)",
      rating: 5,
      quote: "Pet Pod made our adoption process so smooth and stress-free. The community support was incredible, and Max has been the perfect addition to our family. We couldn&apos;t be happier!",
      date: "2 months ago",
      image: "/assets/images/carousel1.jpg",
      highlight: "Perfect Match"
    },
    {
      id: 2,
      name: "David Thompson",
      role: "Volunteer",
      location: "Chicago, IL",
      pet: "N/A",
      rating: 5,
      quote: "Volunteering with Pet Pod has been one of the most rewarding experiences of my life. The community is amazing, and seeing pets find their forever homes never gets old.",
      date: "1 year ago",
      image: "/assets/images/carousel2.jpg",
      highlight: "Long-term Volunteer"
    },
    {
      id: 3,
      name: "Sarah Johnson",
      role: "Pet Foster Parent",
      location: "Austin, TX",
      pet: "Luna (Border Collie Mix)",
      rating: 5,
      quote: "Fostering through Pet Pod has been incredible. The support network is fantastic, and Luna found her perfect family within weeks. The community really cares about every pet.",
      date: "3 months ago",
      image: "/assets/images/carousel3.jpg",
      highlight: "Foster Success"
    },
    {
      id: 4,
      name: "Michael Chen",
      role: "Pet Adopter",
      location: "Seattle, WA",
      pet: "Whiskers (Persian Cat)",
      rating: 5,
      quote: "The matching system is incredible! Whiskers was exactly what we were looking for, and the adoption process was thorough but not overwhelming. Highly recommend!",
      date: "6 months ago",
      image: "/assets/images/carousel4.jpg",
      highlight: "Smart Matching"
    },
    {
      id: 5,
      name: "Emily Rodriguez",
      role: "Event Participant",
      location: "Miami, FL",
      pet: "N/A",
      rating: 5,
      quote: "The community events are fantastic! I've met so many wonderful people and learned so much about pet care. The workshops are incredibly helpful for new pet owners.",
      date: "1 month ago",
      image: "/assets/images/carousel1.jpg",
      highlight: "Community Events"
    },
    {
      id: 6,
      name: "Robert Kim",
      role: "Pet Adopter",
      location: "Denver, CO",
      pet: "Rocky (Mixed Breed)",
      rating: 5,
      quote: "Pet Pod helped us find Rocky after months of searching. The community's dedication to finding the right match is unmatched. Rocky is now the happiest dog in the world!",
      date: "4 months ago",
      image: "/assets/images/carousel2.jpg",
      highlight: "Perfect Timing"
    }
  ];

  const communityStats = [
    {
      icon: Star,
      value: "4.9/5",
      label: "Average Rating",
      description: "Based on 2,500+ reviews"
    },
    {
      icon: Heart,
      value: "98%",
      label: "Would Recommend",
      description: "Community satisfaction rate"
    },
    {
      icon: Users,
      value: "25,000+",
      label: "Happy Families",
      description: "Successful adoptions"
    },
    {
      icon: Award,
      value: "500+",
      label: "Active Volunteers",
      description: "Community supporters"
    }
  ];

  const featuredTestimonial = {
    name: "Lisa Anderson",
    role: "Community Leader",
    location: "San Francisco, CA",
    pet: "Bella (Rescue Dog)",
    rating: 5,
    quote: "Pet Pod isn't just a platform—it's a movement. The community has changed my life and helped me find my soulmate in Bella. The support, love, and dedication here is unlike anything I've experienced.",
    date: "6 months ago",
    highlight: "Community Leader",
    longQuote: "When I first joined Pet Pod, I was just looking to adopt a dog. What I found was so much more—a community of compassionate people who genuinely care about animal welfare. Bella and I are living proof that second chances can lead to the most beautiful relationships."
  };

  return (
    <Section
      background="gradient"
      padding="xl"
      className="relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10"></div>

      <div className="relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Community{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Testimonials
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Hear from our amazing community members about their experiences with Pet Pod. 
            Their stories inspire us every day to continue our mission.
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {communityStats.map((stat, index) => (
            <Card
              key={index}
              hover
              className="text-center group relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.description}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Featured Testimonial */}
        <div className="mb-16">
          <Card
            hover
            className="group relative overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
          >
            <div className="relative z-10 p-8">
              <div className="flex items-start space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {featuredTestimonial.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {featuredTestimonial.name}
                    </h3>
                    <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full">
                      {featuredTestimonial.highlight}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {featuredTestimonial.role} • {featuredTestimonial.location}
                  </p>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(featuredTestimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-lg text-gray-700 dark:text-gray-300 italic mb-4">
                    &ldquo;{featuredTestimonial.quote}&rdquo;
                  </blockquote>
                  <p className="text-gray-600 dark:text-gray-400">
                    {featuredTestimonial.longQuote}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Testimonials Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            What Our Community Says
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.id}
                hover
                className="group relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </h4>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                          {testimonial.highlight}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role} • {testimonial.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <blockquote className="text-gray-600 dark:text-gray-300 italic mb-3 text-sm">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{testimonial.date}</span>
                    </div>
                    {testimonial.pet !== "N/A" && (
                      <div className="flex items-center space-x-1">
                        <Heart className="w-3 h-3" />
                        <span>{testimonial.pet}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Join Our Community Today
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Be part of a community that&apos;s making a real difference in the lives of pets and families. 
              Your story could be the next one we celebrate!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Heart className="w-5 h-5 mr-2" />
                Share Your Story
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Users className="w-5 h-5 mr-2" />
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default CommunityTestimonialsSection;