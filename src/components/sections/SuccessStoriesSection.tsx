import React from "react";
import Card from "../ui/Card";
import Section from "../ui/Section";
import Button from "../ui/Button";
import { Heart, Calendar, MapPin } from "lucide-react";

const SuccessStoriesSection: React.FC = () => {
  const successStories = [
    {
      id: 1,
      petName: "Bella",
      petType: "Golden Retriever",
      age: "3 years old",
      location: "San Francisco, CA",
      adoptionDate: "March 2024",
      story: "Bella was found abandoned in a park, scared and malnourished. Thanks to our community's quick response and Sarah's loving home, Bella is now thriving and has become a therapy dog, bringing joy to nursing home residents.",
      adopter: "Sarah Johnson",
      adopterRole: "Therapy Dog Trainer",
      image: "/assets/images/carousel1.jpg",
      tags: ["Therapy Dog", "Rescue Success", "Community Impact"]
    },
    {
      id: 2,
      petName: "Whiskers",
      petType: "Persian Cat",
      age: "2 years old",
      location: "Austin, TX",
      adoptionDate: "February 2024",
      story: "Whiskers was surrendered by his previous family due to allergies. Our community helped him find the perfect home with Mike, who has experience with special-needs cats. Whiskers now enjoys a peaceful life with his new family.",
      adopter: "Mike Chen",
      adopterRole: "Software Engineer",
      image: "/assets/images/carousel2.jpg",
      tags: ["Special Needs", "Senior Pet", "Perfect Match"]
    },
    {
      id: 3,
      petName: "Rocky",
      petType: "Mixed Breed",
      age: "1 year old",
      location: "Denver, CO",
      adoptionDate: "January 2024",
      story: "Rocky was rescued from a hoarding situation with 20 other dogs. Despite his rough start, Rocky's playful personality won over the Martinez family. He's now the star of their local dog park and helps socialize other rescue dogs.",
      adopter: "Maria Martinez",
      adopterRole: "Veterinarian",
      image: "/assets/images/carousel3.jpg",
      tags: ["Hoarding Rescue", "Social Butterfly", "Family Pet"]
    },
    {
      id: 4,
      petName: "Luna",
      petType: "Border Collie Mix",
      age: "4 years old",
      location: "Seattle, WA",
      adoptionDate: "December 2023",
      story: "Luna was found as a stray with severe anxiety. Through our community's support network and David's patient training, Luna has overcome her fears and now competes in agility competitions, inspiring other anxious dogs.",
      adopter: "David Kim",
      adopterRole: "Dog Trainer",
      image: "/assets/images/carousel4.jpg",
      tags: ["Anxiety Recovery", "Agility Champion", "Inspiration"]
    }
  ];

  return (
    <Section
      background="gradient"
      padding="xl"
      className="relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10"></div>

      <div className="relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Success{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Stories
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Every adoption is a victory. Read the heartwarming stories of pets who found their 
            forever homes and the families who opened their hearts to them.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {successStories.map((story, index) => (
            <Card
              key={story.id}
              hover
              className="group relative overflow-hidden"
            >
              {/* Card background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-800 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {story.petName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      {story.petName}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {story.petType} • {story.age}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{story.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{story.adoptionDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                  {story.story}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {story.adopter}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      {story.adopterRole}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    {story.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Heart className="w-5 h-5 mr-2" />
            Share Your Success Story
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default SuccessStoriesSection;