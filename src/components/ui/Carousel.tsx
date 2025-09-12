"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselItem {
  id: number;
  image?: string;
  imageSrc: string;
  title: string;
  subtitle: string;
  gradient?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

const Carousel: React.FC<CarouselProps> = ({
  items,
  autoPlay = true,
  interval = 5000,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, items.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + items.length) % items.length
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className} carousel-component`}
    >
      {/* Carousel Slides */}
      <div className="relative h-full">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="h-full w-full relative overflow-hidden">
              {/* Background Image */}
              <Image
                src={item.imageSrc}
                alt={item.title}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Gradient Overlay */}
              <div
                className={`absolute inset-0 ${item.gradient} opacity-80`}
              ></div>

              {/* Subtle Backdrop */}
              <div className="absolute inset-0 bg-black/30"></div>

              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white/30 rounded-full blur-xl"></div>
                <div className="absolute top-20 right-20 w-24 h-24 bg-white/20 rounded-full blur-lg"></div>
                <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-white/25 rounded-full blur-2xl"></div>
                <div className="absolute bottom-10 right-1/3 w-28 h-28 bg-white/15 rounded-full blur-lg"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 flex items-center justify-center h-full">
                <div className="text-center text-white px-8">
                  <div className="text-6xl mb-4 animate-bounce">
                    {item.image}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-2 animate-fade-in-up">
                    {item.title}
                  </h2>
                  <p className="text-xl md:text-2xl opacity-90 animate-fade-in-up">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm z-50 carousel-slide-button"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm z-50 carousel-slide-button"
      >
        <ChevronRight />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-50">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
