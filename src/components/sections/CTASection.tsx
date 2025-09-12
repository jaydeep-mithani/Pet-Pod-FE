import React from 'react';
import Button from '../ui/Button';
import Section from '../ui/Section';

const CTASection: React.FC = () => {
  return (
    <Section background="gradient" padding="xl" className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 right-10 w-40 h-40 bg-blue-300/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl"></div>
      </div>
      
      <div className="relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Ready to Find Your Perfect Pet?
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Join thousands of families who have found their perfect companions through Pet Pod. 
          Start your journey today and give a pet the loving home they deserve.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button size="lg" className="min-w-[200px]">
            Browse Available Pets
          </Button>
          <Button variant="outline" size="lg" className="min-w-[200px]">
            Learn More
          </Button>
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>🚀 Coming Soon - Sign up for early access!</p>
        </div>
      </div>
    </Section>
  );
};

export default CTASection;