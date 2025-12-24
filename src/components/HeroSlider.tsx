import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Slide {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface HeroSliderProps {
  slides: Slide[];
  isLoggedIn: boolean;
  onJoinClick: () => void;
}

const HeroSlider = ({ slides, isLoggedIn, onJoinClick }: HeroSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section id="home" className="relative w-full h-screen mt-20 overflow-hidden">
      <AnimatePresence mode="wait">
        {slides.map(
          (slide, index) =>
            index === currentSlide && (
              <motion.div
                key={slide.id}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Background Image */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-contain object-center"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-hero-gradient" />
                
                {/* Decorative Elements */}
                <div className="absolute top-1/4 left-10 w-32 h-32 border-2 border-primary-foreground/20 rounded-full animate-float" />
                <div className="absolute bottom-1/4 right-20 w-20 h-20 border-2 border-accent/30 rounded-full animate-float" style={{ animationDelay: "1s" }} />

                {/* Content */}
                <div className="relative h-full flex items-center">
                  <div className="container mx-auto px-6">
                    <motion.div
                      className="max-w-2xl ml-auto text-right"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      <motion.h2
                        className="text-primary-foreground text-5xl md:text-6xl lg:text-7xl font-display mb-6 leading-tight tracking-wide"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      >
                        {slide.title}
                      </motion.h2>
                      <motion.p
                        className="text-primary-foreground/90 text-lg md:text-xl mb-8 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                      >
                        {slide.description}
                      </motion.p>
                      {!isLoggedIn && (
                        <motion.button
                          onClick={onJoinClick}
                          className="btn-hero"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.6 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          JOIN THE TEAM
                        </motion.button>
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 
                   bg-primary-foreground/10 hover:bg-primary-foreground/20 
                   text-primary-foreground p-3 md:p-4 rounded-full transition-all duration-300
                   backdrop-blur-sm border border-primary-foreground/20"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 
                   bg-primary-foreground/10 hover:bg-primary-foreground/20 
                   text-primary-foreground p-3 md:p-4 rounded-full transition-all duration-300
                   backdrop-blur-sm border border-primary-foreground/20"
      >
        <ChevronRight size={28} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-accent w-8"
                : "bg-primary-foreground/50 hover:bg-primary-foreground/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
