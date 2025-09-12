import React from 'react';
import Section from '../ui/Section';

const StatsSection: React.FC = () => {
  const stats = [
    {
      number: '10,000+',
      label: 'Pets Adopted',
      description: 'Happy families created',
    },
    {
      number: '5,000+',
      label: 'Active Users',
      description: 'Pet lovers in our community',
    },
    {
      number: '98%',
      label: 'Success Rate',
      description: 'Successful adoptions',
    },
    {
      number: '24/7',
      label: 'Support',
      description: 'Always here to help',
    },
  ];

  return (
    <Section background="blue" padding="lg" className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Making a Difference Together
          </h2>
          <p className="text-lg text-blue-100">
            Our community impact in numbers
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-white mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-blue-100">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default StatsSection;