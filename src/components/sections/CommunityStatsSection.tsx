import React from "react";
import Section from "../ui/Section";
import Card from "../ui/Card";
import { 
  Users, 
  Heart, 
  Home, 
  Shield, 
  TrendingUp, 
  Award,
  Calendar,
  MapPin
} from "lucide-react";

const CommunityStatsSection: React.FC = () => {
  const stats = [
    {
      icon: Users,
      value: "25,000+",
      label: "Active Community Members",
      description: "Pet lovers from all over the country",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Heart,
      value: "15,000+",
      label: "Successful Adoptions",
      description: "Pets finding their forever homes",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: Home,
      value: "98%",
      label: "Adoption Success Rate",
      description: "Pets staying in their new homes",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Shield,
      value: "500+",
      label: "Active Volunteers",
      description: "Dedicated community helpers",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: TrendingUp,
      value: "45%",
      label: "Year-over-Year Growth",
      description: "Community expansion rate",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Award,
      value: "4.9/5",
      label: "Community Rating",
      description: "Based on member feedback",
      color: "from-yellow-500 to-yellow-600"
    }
  ];

  const achievements = [
    {
      title: "National Recognition",
      description: "Featured in Pet Adoption Magazine's 'Top 10 Platforms'",
      year: "2024"
    },
    {
      title: "Community Impact Award",
      description: "Recognized for reducing pet abandonment rates by 30%",
      year: "2023"
    },
    {
      title: "Volunteer Excellence",
      description: "500+ active volunteers across 50+ cities",
      year: "2024"
    }
  ];

  return (
    <Section
      background="white"
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
              Impact
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Numbers tell a story of love, compassion, and community spirit. 
            See how our community is making a real difference in the lives of pets and families.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <Card
              key={index}
              hover
              className="text-center group relative overflow-hidden"
            >
              {/* Card background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

              <div className="relative z-10">
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {stat.label}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {stat.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Achievements Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Community Achievements
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Recognition and milestones that showcase our community&apos;s impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {achievement.year}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {achievement.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-4 text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Join our monthly community events</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Available in 50+ cities nationwide</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default CommunityStatsSection;