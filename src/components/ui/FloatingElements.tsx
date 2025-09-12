import React from 'react';

const FloatingElements: React.FC = () => {
  const floatingItems = [
    { emoji: '🐕', delay: '0s', duration: '6s', left: '10%', top: '20%' },
    { emoji: '🐱', delay: '1s', duration: '8s', left: '85%', top: '15%' },
    { emoji: '🐰', delay: '2s', duration: '7s', left: '15%', top: '70%' },
    { emoji: '🐹', delay: '3s', duration: '9s', left: '80%', top: '75%' },
    { emoji: '🐦', delay: '4s', duration: '5s', left: '5%', top: '50%' },
    { emoji: '🐠', delay: '5s', duration: '6s', left: '90%', top: '60%' },
    { emoji: '🦎', delay: '6s', duration: '8s', left: '25%', top: '10%' },
    { emoji: '🐢', delay: '7s', duration: '10s', left: '70%', top: '85%' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {floatingItems.map((item, index) => (
        <div
          key={index}
          className="absolute text-4xl opacity-20 animate-float"
          style={{
            left: item.left,
            top: item.top,
            animationDelay: item.delay,
            animationDuration: item.duration,
          }}
        >
          {item.emoji}
        </div>
      ))}
    </div>
  );
};

export default FloatingElements;