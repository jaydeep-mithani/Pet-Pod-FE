import React from "react";
import Button from "../ui/Button";
import FloatingElements from "../ui/FloatingElements";
import { Users, Heart, Star, Award } from "lucide-react";

const CommunityHeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Floating Pet Elements */}
      <FloatingElements />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Our Community
              </span>
            </h1>
            <p className="text-2xl md:text-3xl font-semibold mb-4 text-purple-100">
              Where Love Finds a Home
            </p>
            <p className="text-lg md:text-xl text-purple-100/80 max-w-4xl mx-auto">
              Join thousands of pet lovers who have made a difference in the lives of animals. 
              Our community is built on compassion, support, and the shared joy of giving pets 
              a second chance at happiness.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="min-w-[200px] shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Join Our Community
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="min-w-[200px] border-white text-white hover:bg-white hover:!text-purple-600 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Share Your Story
            </Button>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-white">25,000+</div>
              <div className="text-purple-200">Active Members</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-white">15,000+</div>
              <div className="text-purple-200">Successful Adoptions</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-white">4.9/5</div>
              <div className="text-purple-200">Community Rating</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-purple-200">Volunteers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityHeroSection;