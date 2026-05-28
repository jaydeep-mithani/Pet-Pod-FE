import React from "react";
import Card from "../ui/Card";
import Section from "../ui/Section";
import Button from "../ui/Button";
import { Heart, MapPin, Calendar, Users } from "lucide-react";
import Image from "next/image";

const FeaturedPetsSection: React.FC = () => {
  const featuredPets = [
    {
      id: 1,
      name: "Buddy",
      breed: "Golden Retriever",
      age: "2 years",
      location: "San Francisco, CA",
      image: "/assets/images/carousel1.jpg",
      description:
        "Friendly and energetic, loves playing fetch and going on long walks.",
      isAdopted: false,
      featured: true,
    },
    {
      id: 2,
      name: "Luna",
      breed: "Siamese Cat",
      age: "1 year",
      location: "Los Angeles, CA",
      image: "/assets/images/carousel2.jpg",
      description:
        "Gentle and affectionate, perfect for families with children.",
      isAdopted: false,
      featured: true,
    },
    {
      id: 3,
      name: "Max",
      breed: "Labrador Mix",
      age: "3 years",
      location: "Seattle, WA",
      image: "/assets/images/carousel3.jpg",
      description: "Well-trained and socialized, great with other pets.",
      isAdopted: true,
      featured: true,
    },
    {
      id: 4,
      name: "Bella",
      breed: "Persian Cat",
      age: "4 years",
      location: "Portland, OR",
      image: "/assets/images/carousel4.jpg",
      description: "Calm and independent, ideal for quiet households.",
      isAdopted: false,
      featured: true,
    },
    {
      id: 5,
      name: "Charlie",
      breed: "Beagle",
      age: "1.5 years",
      location: "Denver, CO",
      image: "/assets/images/carousel5.jpg",
      description: "Playful and curious, loves exploring new environments.",
      isAdopted: false,
      featured: true,
    },
    {
      id: 6,
      name: "Mia",
      breed: "Maine Coon",
      age: "2.5 years",
      location: "Austin, TX",
      image: "/assets/images/carousel6.jpg",
      description:
        "Large and gentle, perfect for families looking for a big cat.",
      isAdopted: true,
      featured: true,
    },
  ];

  return (
    <Section
      background="gradient"
      padding="xl"
      className="relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Featured Pet{" "}
            <span className="bg-gradient-to-r from-pink-300 to-yellow-300 bg-clip-text text-transparent">
              Listings
            </span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Meet some of our amazing pets looking for their forever homes. Each
            one has a unique personality and story waiting to be part of your
            family.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-blue-100/80">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>Loved & Cared For</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Community Verified</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Health Checked</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredPets.map((pet) => (
            <Card
              key={pet.id}
              hover
              className="group relative overflow-hidden bg-white/95 backdrop-blur-sm"
            >
              {/* Pet Image */}
              <div className="relative h-64 overflow-hidden rounded-t-xl">
                <Image
                  fill
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  {pet.isAdopted ? (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Adopted
                    </span>
                  ) : (
                    <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Available
                    </span>
                  )}
                </div>

                {/* Featured Badge */}
                {pet.featured && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <span>⭐</span>
                      <span>Featured</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Pet Info */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {pet.name}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                    {pet.breed}
                  </p>
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{pet.location}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {pet.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {pet.age}
                  </span>
                  {!pet.isAdopted && (
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    >
                      Learn More
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">
              Can&apos;t Find Your Perfect Match?
            </h3>
            <p className="text-blue-100 mb-6 text-lg">
              Browse our complete database of pets or create a profile to get
              personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Browse All Pets
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:!text-blue-600 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Create Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default FeaturedPetsSection;
