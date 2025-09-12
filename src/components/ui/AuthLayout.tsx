import React from 'react';
import { Heart, Users, Shield, Star } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  type: 'signup' | 'signin';
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, type }) => {
  const features = [
    {
      icon: Heart,
      title: 'Find Your Perfect Pet',
      description: 'Connect with loving animals waiting for their forever home',
    },
    {
      icon: Users,
      title: 'Join Our Community',
      description: 'Be part of a caring community of pet lovers and advocates',
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'All adoptions are verified and secure with our trusted platform',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 flex">
      {/* Left Side - Features (Desktop Only) */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 xl:px-16">
        <div className="max-w-md xl:max-w-lg">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Pet Pod</h1>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl xl:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Giving Pets a{' '}
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Second Chance
            </span>{' '}
            at Life
          </h2>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Join thousands of pet lovers who are making a difference in the lives of animals every day.
          </p>

          {/* Features */}
          <div className="space-y-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-pink-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">10K+</div>
              <div className="text-sm text-gray-600">Pets Adopted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">5K+</div>
              <div className="text-sm text-gray-600">Happy Families</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">50+</div>
              <div className="text-sm text-gray-600">Cities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 xl:p-12">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-300/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-300/20 to-pink-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-200/10 to-purple-300/10 rounded-full blur-3xl animate-gentle-float"></div>
        </div>

        {/* Auth Card */}
        <div className="relative z-10 w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;