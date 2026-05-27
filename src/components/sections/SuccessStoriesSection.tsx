import React from "react";
import Card from "../ui/Card";
import Section from "../ui/Section";
import { Quote, Star, Calendar } from "lucide-react";
import Image from "next/image";

const SuccessStoriesSection: React.FC = () => {
  const successStories = [
    {
      id: 1,
      petName: "Buddy",
      petType: "Golden Retriever",
      ownerName: "Sarah Johnson",
      location: "San Francisco, CA",
      story:
        "Buddy has brought so much joy to our family. He was shy at first, but now he's the most confident and loving dog. The adoption process was smooth, and the support from Pet Pod was incredible.",
      rating: 5,
      adoptionDate: "March 2024",
      image: "/assets/images/carousel1.jpg",
      ownerImage:
        "https://images.unsplash.com/photo-1534083220759-4c3c00112ea0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 2,
      petName: "Luna",
      petType: "Siamese Cat",
      ownerName: "Michael Chen",
      location: "Los Angeles, CA",
      story:
        "Luna is perfect for our apartment lifestyle. She's independent yet affectionate. The matching system really understood what we needed. Couldn't be happier!",
      rating: 5,
      adoptionDate: "February 2024",
      image: "/assets/images/carousel2.jpg",
      ownerImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 3,
      petName: "Max",
      petType: "Labrador Mix",
      ownerName: "Emily Rodriguez",
      location: "Seattle, WA",
      story:
        "Max has been a blessing to our family. He's great with our kids and has helped them learn responsibility. The community support during the transition was amazing.",
      rating: 5,
      adoptionDate: "January 2024",
      image: "/assets/images/carousel3.jpg",
      ownerImage:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 4,
      petName: "Bella",
      petType: "Persian Cat",
      ownerName: "David Kim",
      location: "Portland, OR",
      story:
        "Bella is the perfect companion for my quiet lifestyle. She's elegant, calm, and brings such peace to my home. The adoption process exceeded my expectations.",
      rating: 5,
      adoptionDate: "December 2023",
      image: "/assets/images/carousel4.jpg",
      ownerImage:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
  ];

  const featuredStory = {
    petName: "Charlie",
    petType: "Beagle",
    ownerName: "The Thompson Family",
    location: "Denver, CO",
    story:
      "Charlie came into our lives when we needed him most. After losing our previous dog, we weren't sure we were ready for another pet. But Charlie's gentle nature and the support from the Pet Pod community helped us heal. He's now the heart of our family, bringing laughter and love to our home every day.",
    rating: 5,
    adoptionDate: "November 2023",
    image: "/assets/images/carousel1.jpg",
    ownerImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    specialNote: "Featured Success Story",
  };

  return (
    <Section
      background="gradient"
      padding="xl"
      className="relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Success{" "}
            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Stories
            </span>
          </h2>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Real stories from real families. See how Pet Pod has helped create
            lasting bonds between pets and their new families.
          </p>
        </div>

        {/* Featured Story */}
        <div className="mb-16">
          <Card className="bg-white/95 backdrop-blur-sm max-w-4xl mx-auto overflow-hidden">
            <div className="relative">
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>{featuredStory.specialNote}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Pet Image */}
                <div className="relative h-80 lg:h-full">
                  <Image
                    fill
                    src={featuredStory.image}
                    alt={featuredStory.petName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                {/* Story Content */}
                <div className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <Image
                      width={100}
                      height={100}
                      src={featuredStory.ownerImage}
                      alt={featuredStory.ownerName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {featuredStory.petName}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-500">
                        {featuredStory.petType}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-600">
                        Adopted by {featuredStory.ownerName}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <Quote className="w-8 h-8 text-pink-600 dark:text-pink-500 mb-4" />
                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                      &ldquo;{featuredStory.story}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[...Array(featuredStory.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Perfect Match!
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{featuredStory.adoptionDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Other Success Stories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {successStories.map((story) => (
            <Card
              key={story.id}
              hover
              className="bg-white/90 backdrop-blur-sm group overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <Image
                    width={80}
                    height={80}
                    src={story.ownerImage}
                    alt={story.ownerName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {story.petName} & {story.ownerName}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-500">
                      {story.petType}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-600">
                      {story.location}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <Quote className="w-6 h-6 text-pink-500 mb-2" />
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    &ldquo;{story.story}&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-600 text-sm">
                    <Calendar className="w-3 h-3" />
                    <span>{story.adoptionDate}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">
              Share Your Success Story
            </h3>
            <p className="text-purple-100 mb-6 text-lg">
              Have you adopted a pet through Pet Pod? We&apos;d love to hear
              about your experience and share it with our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-purple-50 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                Share Your Story
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-purple-600 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                Read More Stories
              </button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default SuccessStoriesSection;
