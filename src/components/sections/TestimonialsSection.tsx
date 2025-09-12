import React from 'react';
import Card from '../ui/Card';
import Section from '../ui/Section';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Dog Mom',
      image: '👩‍🦰',
      content: 'Pet Pod helped me find my perfect companion, Luna. The process was so smooth and the support team was incredible throughout the entire journey.',
      rating: 5,
    },
    {
      name: 'Mike Chen',
      role: 'Cat Dad',
      image: '👨‍💼',
      content: 'I was skeptical about online pet adoption, but Pet Pod made it feel safe and personal. Whiskers has been the best addition to our family.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Pet Foster',
      image: '👩‍⚕️',
      content: 'As a foster parent, I love how Pet Pod connects me with responsible adopters. The platform makes the adoption process transparent and trustworthy.',
      rating: 5,
    },
  ];

  return (
    <Section background="gray" padding="xl">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          What Our Community Says
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Real stories from real families who found their perfect pets through Pet Pod.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="relative">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-3">{testimonial.image}</div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {testimonial.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {testimonial.role}
                </p>
              </div>
            </div>
            
            <div className="flex mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-lg">⭐</span>
              ))}
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 italic">
              "{testimonial.content}"
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
};

export default TestimonialsSection;