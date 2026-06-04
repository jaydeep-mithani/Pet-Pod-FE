import React from "react";
import Card from "../ui/Card";
import Section from "../ui/Section";
import { Users, Heart, Home, Award, TrendingUp, Shield } from "lucide-react";

const CommunityStatsSection: React.FC = () => {
  const stats = [
    {
      icon: Users,
      number: "50,000+",
      label: "Active Members",
      description: "Pet lovers in our community",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Heart,
      number: "25,000+",
      label: "Successful Adoptions",
      description: "Happy pets in loving homes",
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: Home,
      number: "15,000+",
      label: "Pets Available",
      description: "Currently looking for homes",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Award,
      number: "98%",
      label: "Success Rate",
      description: "Adoption satisfaction rate",
      color: "from-green-500 to-green-600",
    },
    {
      icon: TrendingUp,
      number: "500+",
      label: "Monthly Adoptions",
      description: "Average successful matches",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: Shield,
      number: "24/7",
      label: "Support Available",
      description: "Community help and guidance",
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  const achievements = [
    {
      title: "Community Impact",
      description: "Reduced pet abandonment by 40% in our service areas",
      icon: "🌍",
    },
    {
      title: "Health & Safety",
      description: "100% of pets are health-checked and vaccinated",
      icon: "🏥",
    },
    {
      title: "Education",
      description: "Over 10,000 pet care workshops conducted",
      icon: "📚",
    },
    {
      title: "Innovation",
      description: "AI-powered matching system with 95% accuracy",
      icon: "🤖",
    },
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
            Our Community{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Impact
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Together, we&apos;re building a better world for pets and their
            families. See how our community is making a real difference.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <Card
              key={index}
              hover
              className="text-center group relative overflow-hidden bg-white/80 backdrop-blur-sm"
            >
              {/* Card background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              ></div>

              <div className="relative z-10">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </h3>
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {stat.label}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {stat.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Achievements Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Community Achievements
            </h3>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Our community has achieved remarkable milestones in pet welfare
              and adoption success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">
                      {achievement.title}
                    </h4>
                    <p className="text-blue-100">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 max-w-4xl mx-auto text-white">
            <h3 className="text-3xl font-bold mb-4">
              Join Our Growing Community
            </h3>
            <p className="text-pink-100 mb-6 text-lg">
              Be part of something bigger. Help us create more happy endings for
              pets in need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-pink-600 px-8 py-3 rounded-xl font-semibold hover:bg-pink-50 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                Become a Member
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-pink-600 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                Share Your Story
              </button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default CommunityStatsSection;
