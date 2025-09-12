import React from 'react';
import { Heart } from 'lucide-react';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

const AuthCard: React.FC<AuthCardProps> = ({
  title,
  subtitle,
  children,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-3xl shadow-2xl p-6 md:p-8 lg:p-10 w-full max-w-sm md:max-w-md lg:max-w-lg mx-auto ${className}`}>
      {/* Header */}
      <div className="text-center mb-6 md:mb-8 lg:mb-10">
        <div className="flex justify-center mb-4 md:mb-6">
          <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
            <Heart className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white" />
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-3">{title}</h1>
        {subtitle && (
          <p className="text-gray-600 text-base md:text-lg lg:text-xl">{subtitle}</p>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4 md:space-y-6 lg:space-y-8">
        {children}
      </div>
    </div>
  );
};

export default AuthCard;