import React from "react";
import Card from "../ui/Card";
import Section from "../ui/Section";

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: "🐕",
      title: "Safe & Secure",
      description:
        "All pets are verified and health-checked. We ensure every adoption is safe and responsible.",
    },
    {
      icon: "❤️",
      title: "Community Driven",
      description:
        "Built by pet lovers, for pet lovers. Our community helps every pet find their perfect home.",
    },
    {
      icon: "🏠",
      title: "Perfect Matching",
      description:
        "Our smart matching system connects pets with families based on lifestyle, preferences, and needs.",
    },
    {
      icon: "📱",
      title: "Easy to Use",
      description:
        "Simple, intuitive platform that makes pet adoption accessible to everyone, everywhere.",
    },
    {
      icon: "🛡️",
      title: "Support Network",
      description:
        "24/7 support and resources to help you and your new pet adjust to life together.",
    },
    {
      icon: "🌟",
      title: "Premium Features",
      description:
        "Optional premium features to enhance your pet adoption experience and support our mission.",
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
            Why Choose{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pet Pod
            </span>
            ?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We&apos;re more than just a pet adoption platform. We&apos;re a
            community dedicated to creating happy, healthy relationships between
            pets and their families.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              hover
              className="text-center group relative overflow-hidden"
            >
              {/* Card background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default FeaturesSection;
