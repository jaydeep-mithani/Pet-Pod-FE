import React from "react";
import Card from "../ui/Card";
import Section from "../ui/Section";
import Button from "../ui/Button";
import { 
  HandHeart, 
  Users, 
  Calendar, 
  MapPin, 
  Clock,
  Award,
  Heart,
  Shield
} from "lucide-react";

const VolunteerSection: React.FC = () => {
  const volunteerRoles = [
    {
      icon: HandHeart,
      title: "Pet Care Volunteer",
      description: "Help with feeding, grooming, and basic care for pets awaiting adoption",
      timeCommitment: "4-8 hours/week",
      requirements: ["Animal handling experience", "Compassionate nature", "Reliability"],
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: Users,
      title: "Adoption Counselor",
      description: "Guide potential adopters through the process and ensure perfect matches",
      timeCommitment: "6-10 hours/week",
      requirements: ["Communication skills", "Pet knowledge", "Interview experience"],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Calendar,
      title: "Event Coordinator",
      description: "Organize adoption events, fundraisers, and community meetups",
      timeCommitment: "8-12 hours/week",
      requirements: ["Event planning", "Leadership skills", "Social media savvy"],
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Shield,
      title: "Transport Volunteer",
      description: "Help transport pets to vet appointments, adoption events, and new homes",
      timeCommitment: "2-6 hours/week",
      requirements: ["Valid driver's license", "Reliable vehicle", "Flexible schedule"],
      color: "from-green-500 to-green-600"
    }
  ];

  const volunteerBenefits = [
    {
      icon: Heart,
      title: "Make a Real Difference",
      description: "Directly impact the lives of pets and families in your community"
    },
    {
      icon: Users,
      title: "Join a Caring Community",
      description: "Connect with like-minded people who share your passion for animals"
    },
    {
      icon: Award,
      title: "Gain Valuable Experience",
      description: "Develop skills in animal care, event planning, and community outreach"
    },
    {
      icon: Calendar,
      title: "Flexible Commitment",
      description: "Choose roles and schedules that fit your lifestyle and availability"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Williams",
      role: "Pet Care Volunteer",
      location: "San Francisco, CA",
      quote: "Volunteering with Pet Pod has been incredibly rewarding. I've helped over 50 pets find their forever homes, and each adoption brings tears of joy.",
      duration: "2 years"
    },
    {
      name: "Michael Rodriguez",
      role: "Transport Volunteer",
      location: "Austin, TX",
      quote: "The flexibility of volunteering allows me to help while maintaining my full-time job. The community support is amazing!",
      duration: "1.5 years"
    },
    {
      name: "Emily Chen",
      role: "Event Coordinator",
      location: "Seattle, WA",
      quote: "Organizing adoption events has taught me so much about community building. Seeing families unite with their new pets is magical.",
      duration: "3 years"
    }
  ];

  return (
    <Section
      background="gradient"
      padding="xl"
      className="relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-blue-50/50 dark:from-green-900/10 dark:to-blue-900/10"></div>

      <div className="relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Join Our{" "}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Volunteer Team
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Be part of something bigger. Our volunteers are the heart of our community, 
            making a real difference in the lives of pets and families every day.
          </p>
        </div>

        {/* Volunteer Roles */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Volunteer Opportunities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {volunteerRoles.map((role, index) => (
              <Card
                key={index}
                hover
                className="group relative overflow-hidden"
              >
                {/* Card background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                <div className="relative z-10">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${role.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <role.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {role.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        {role.description}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <Clock className="w-4 h-4" />
                        <span>{role.timeCommitment}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Requirements:
                    </h5>
                    <ul className="space-y-1">
                      {role.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Why Volunteer With Us?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {volunteerBenefits.map((benefit, index) => (
              <Card
                key={index}
                hover
                className="text-center group relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {benefit.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Volunteer Testimonials */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            What Our Volunteers Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                hover
                className="group relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role} • {testimonial.duration}
                      </p>
                    </div>
                  </div>
                  <blockquote className="text-gray-600 dark:text-gray-300 italic mb-3">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-1" />
                    {testimonial.location}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Make a Difference?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Join our volunteer community and help us create more success stories. 
              Every hour you give makes a difference in a pet&apos;s life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <HandHeart className="w-5 h-5 mr-2" />
                Become a Volunteer
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default VolunteerSection;