import React from "react";
import Card from "../ui/Card";
import Section from "../ui/Section";
import Button from "../ui/Button";
import { Calendar, MapPin, Users, Clock, Heart, Camera, BookOpen, PawPrint } from "lucide-react";

const CommunityEventsSection: React.FC = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: "Pet Adoption Fair",
      date: "March 15, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "Central Park, San Francisco",
      description: "Join us for our biggest adoption event of the year! Meet over 100 pets looking for their forever homes.",
      attendees: 250,
      type: "Adoption Event",
      icon: Heart,
      color: "from-pink-500 to-pink-600",
      featured: true,
    },
    {
      id: 2,
      title: "Pet Photography Workshop",
      date: "March 22, 2024",
      time: "2:00 PM - 5:00 PM",
      location: "Golden Gate Park",
      description: "Learn professional pet photography techniques from award-winning photographer Sarah Johnson.",
      attendees: 30,
      type: "Workshop",
      icon: Camera,
      color: "from-blue-500 to-blue-600",
      featured: false,
    },
    {
      id: 3,
      title: "Pet Care Education Seminar",
      date: "March 29, 2024",
      time: "6:00 PM - 8:00 PM",
      location: "Community Center, Oakland",
      description: "Essential pet care tips from veterinarians and pet behavior specialists.",
      attendees: 80,
      type: "Education",
      icon: BookOpen,
      color: "from-green-500 to-green-600",
      featured: false,
    },
    {
      id: 4,
      title: "Paws & Play Meetup",
      date: "April 5, 2024",
      time: "11:00 AM - 2:00 PM",
      location: "Crissy Field, San Francisco",
      description: "A fun social event for pets and their owners. Games, treats, and new friendships await!",
      attendees: 120,
      type: "Social",
      icon: PawPrint,
      color: "from-purple-500 to-purple-600",
      featured: true,
    },
  ];

  const eventCategories = [
    {
      name: "Adoption Events",
      count: 12,
      description: "Meet pets looking for homes",
      icon: Heart,
      color: "bg-pink-100 text-pink-600",
    },
    {
      name: "Educational Workshops",
      count: 8,
      description: "Learn about pet care",
      icon: BookOpen,
      color: "bg-blue-100 text-blue-600",
    },
    {
      name: "Social Meetups",
      count: 15,
      description: "Connect with other pet owners",
      icon: Users,
      color: "bg-green-100 text-green-600",
    },
    {
      name: "Special Events",
      count: 6,
      description: "Unique community activities",
      icon: Calendar,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <Section
      background="white"
      padding="xl"
      className="relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-blue-50/50 dark:from-green-900/10 dark:to-blue-900/10"></div>

      <div className="relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Community{" "}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Events
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join our vibrant community through events, workshops, and meetups.
            Connect with fellow pet lovers and make a difference together.
          </p>
        </div>

        {/* Event Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {eventCategories.map((category, index) => (
            <Card
              key={index}
              hover
              className="text-center group relative overflow-hidden bg-white/80 backdrop-blur-sm"
            >
              <div className="p-6">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {category.name}
                </h3>
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                  {category.count}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {category.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Upcoming Events */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Upcoming Events
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {upcomingEvents.map((event) => (
              <Card
                key={event.id}
                hover
                className={`group relative overflow-hidden bg-white/90 backdrop-blur-sm ${
                  event.featured ? 'ring-2 ring-pink-500' : ''
                }`}
              >
                {event.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${event.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <event.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {event.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {event.type}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{event.attendees} attendees</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className={`w-full bg-gradient-to-r ${event.color} hover:opacity-90`}
                  >
                    Join Event
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 max-w-4xl mx-auto text-white">
            <h3 className="text-3xl font-bold mb-4">
              Host Your Own Event
            </h3>
            <p className="text-green-100 mb-6 text-lg">
              Want to organize a pet-related event? We&apos;d love to help you
              connect with our community and make a positive impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-green-50 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                Host an Event
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-green-600 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                View All Events
              </button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default CommunityEventsSection;