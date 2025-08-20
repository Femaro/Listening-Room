"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop&auto=format",
    message: "Every sunrise brings new hope",
    subtitle: "Your story isn't over yet",
  },
  {
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=600&fit=crop&auto=format",
    message: "You are stronger than you know",
    subtitle: "Tomorrow holds endless possibilities",
  },
  {
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=600&fit=crop&auto=format",
    message: "Your voice matters, your life has meaning",
    subtitle: "There are people who care about you",
  },
  {
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop&auto=format",
    message: "Light always finds a way through darkness",
    subtitle: "Healing is possible, hope is real",
  },
];

export default function InspirationalSlides() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative h-96 overflow-hidden"
      aria-label="Inspirational messages"
    >
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.image})`,
                filter: "grayscale(100%) contrast(1.2)",
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            <div className="relative h-full flex items-center justify-center text-center px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                  {slide.message}
                </h2>
                <p className="text-xl md:text-2xl text-white/90 drop-shadow-md">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() =>
          setCurrentSlide((prev) =>
            prev === 0 ? slides.length - 1 : prev - 1,
          )
        }
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-200"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-200"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
