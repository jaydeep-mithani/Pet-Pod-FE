import React from "react";
import Card from "../ui/Card";
import Section from "../ui/Section";
import Button from "../ui/Button";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Heart,
  Camera,
  Gift,
  PawPrint,
} from "lucide-react";

const EventsSection: React.FC = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: "Spring Adoption Fair",
      date: "March 15, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "Central Park, New York",
      type: "Adoption Event",
      description:
        "Join us for our biggest adoption event of the year! Over 100 pets looking for their forever homes.",
      attendees: "500+ expected",
      pets: "100+ pets",
      icon: Heart,
      color: "from-pink-500 to-pink-600",
    },
    {
      id: 2,
      title: "Pet Photography Workshop",
      date: "March 22, 2024",
      time: "2:00 PM - 5:00 PM",
      location: "Community Center, Austin",
      type: "Educational",
      description:
        "Learn professional pet photography techniques to help pets look their best in adoption profiles.",
      attendees: "30 participants",
      pets: "N/A",
      icon: Camera,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: 3,
      title: "Volunteer Appreciation Gala",
      date: "April 5, 2024",
      time: "6:00 PM - 10:00 PM",
      location: "Grand Hotel, San Francisco",
      type: "Celebration",
      description:
        "Celebrate our amazing volunteers with dinner, awards, and recognition for their incredible work.",
      attendees: "200 volunteers",
      pets: "N/A",
      icon: Gift,
      color: "from-purple-500 to-purple-600",
    },
    {
      id: 4,
      title: "Pet Health & Wellness Expo",
      date: "April 12, 2024",
      time: "9:00 AM - 3:00 PM",
      location: "Convention Center, Seattle",
      type: "Educational",
      description:
        "Free health checks, vaccinations, and wellness tips from local veterinarians and pet experts.",
      attendees: "300+ families",
      pets: "200+ pets",
      icon: PawPrint,
      color: "from-green-500 to-green-600",
    },
  ];

  const eventTypes = [
    {
      icon: Heart,
      title: "Adoption Events",
      description: "Meet-and-greets where pets find their forever families",
      frequency: "Monthly",
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: Camera,
      title: "Educational Workshops",
      description:
        "Learn about pet care, training, and adoption best practices",
      frequency: "Bi-weekly",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Users,
      title: "Community Meetups",
      description: "Connect with fellow pet lovers and share experiences",
      frequency: "Weekly",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Gift,
      title: "Fundraising Events",
      description: "Support our mission through fun and engaging activities",
      frequency: "Quarterly",
      color: "from-green-500 to-green-600",
    },
  ];

  const pastEvents = [
    {
      title: "Winter Wonderland Adoption",
      date: "December 2023",
      outcome: "45 pets adopted",
      attendees: "300+ families",
      highlight: "All senior pets found homes!",
    },
    {
      title: "Pet Training Workshop",
      date: "November 2023",
      outcome: "25 families trained",
      attendees: "50 participants",
      highlight: "100% satisfaction rate",
    },
    {
      title: "Halloween Pet Costume Contest",
      date: "October 2023",
      outcome: "12 pets adopted",
      attendees: "150+ participants",
      highlight: "Raised $5,000 for medical care",
    },
  ];

  return (
    <Section
      background="white"
      padding="xl"
      className="relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10"></div>

      <div className="relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Community{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Events
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join us for exciting events that bring our community together. From
            adoption fairs to educational workshops, there&apos;s always
            something happening.
          </p>
        </div>

        {/* Event Types */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Types of Events
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {eventTypes.map((type, index) => (
              <Card
                key={index}
                hover
                className="text-center group relative overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                ></div>
                <div className="relative z-10">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${type.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <type.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {type.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                    {type.description}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {type.frequency}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Upcoming Events
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {upcomingEvents.map((event) => (
              <Card
                key={event.id}
                hover
                className="group relative overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${event.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                ></div>
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start space-x-4 mb-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${event.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <event.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {event.title}
                          </h4>
                          <span
                            className={`px-2 py-1 bg-gradient-to-r ${event.color} text-white text-xs rounded-full`}
                          >
                            {event.type}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                          {event.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{event.attendees}</span>
                      </div>
                    </div>

                    {event.pets !== "N/A" && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <Heart className="w-4 h-4" />
                        <span>{event.pets}</span>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Register Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Past Events Highlights */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Recent Success Stories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pastEvents.map((event, index) => (
              <Card
                key={index}
                hover
                className="text-center group relative overflow-hidden"
              >
                <div className="relative z-10">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {event.title}
                  </h4>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {event.date}
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>{event.outcome}</strong>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {event.attendees} attended
                    </div>
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                    {event.highlight}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Stay Connected
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Never miss an event! Subscribe to our newsletter and follow us on
              social media to stay updated on all community activities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Subscribe to Events
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                View Event Calendar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default EventsSection;
