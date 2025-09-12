import React from "react";
import Button from "../ui/Button";
import Carousel from "../ui/Carousel";
import FloatingElements from "../ui/FloatingElements";
import { ChevronDown } from "lucide-react";

const HeroSection: React.FC = () => {
  const carouselItems = [
    {
      id: 1,
      imageSrc:
        "https://images.unsplash.com/photo-1593134257782-e89567b7718a?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Find Your Perfect Dog",
      subtitle: "Loyal companions waiting for their forever home",
    },
    {
      id: 2,
      imageSrc:
        "https://images.unsplash.com/photo-1570450466756-c1c0bc431719?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Adopt a Loving Cat",
      subtitle: "Independent spirits ready to share their love",
    },
    {
      id: 3,
      imageSrc:
        "https://images.unsplash.com/photo-1619447257726-fe312296ee9b?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Small Pets, Big Hearts",
      subtitle: "Rabbits, hamsters, and more adorable companions",
    },
    {
      id: 4,
      imageSrc:
        "https://images.unsplash.com/photo-1523761467347-327dfb5a16f6?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Feathered Friends",
      subtitle: "Birds and exotic pets looking for caring families",
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Floating Pet Elements */}
      <FloatingElements />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="text-white space-y-8 animate-fade-in">
            <div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Pet Pod
                </span>
              </h1>
              <p className="text-2xl md:text-3xl font-semibold mb-4 text-blue-100">
                Giving pets a second chance at life
              </p>
              <p className="text-lg md:text-xl text-blue-100/80 max-w-lg">
                Connect loving animals with responsible, caring owners. Create
                lasting bonds while helping reduce pet abandonment in our
                community.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="min-w-[200px] shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Find Your Perfect Pet
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="min-w-[200px] border-white text-white hover:bg-white hover:!text-blue-600 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                List a Pet for Adoption
              </Button>
            </div>

            <div className="flex items-center space-x-6 text-blue-100/80">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">✨</span>
                <span>10,000+ Happy Families</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🏆</span>
                <span>98% Success Rate</span>
              </div>
            </div>
          </div>

          {/* Right Side - Carousel */}
          <div className="animate-fade-in-up">
            <Carousel
              items={carouselItems}
              className="h-96 md:h-[500px] shadow-2xl"
              autoPlay={true}
              interval={4000}
            />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white opacity-40" />
      </div>
    </section>
  );
};

export default HeroSection;
