import { motion } from 'framer-motion';
import { slides } from '../slides';

interface SlideControlsProps {
  currentIndex: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
  onSlideSelect?: (index: number) => void;
}

export const SlideControls = ({ currentIndex, totalSlides, onPrevious, onNext, onSlideSelect }: SlideControlsProps) => {
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < totalSlides - 1;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-8 py-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Previous Button */}
        <motion.button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={`p-3 md:p-4 rounded-lg border-2 ${
            canGoPrevious
              ? 'border-gold text-gold hover:bg-gold/10 glow-gold cursor-pointer'
              : 'border-gray-600 text-gray-600 cursor-not-allowed opacity-50'
          } transition-all`}
          whileHover={canGoPrevious ? { scale: 1.1 } : {}}
          whileTap={canGoPrevious ? { scale: 0.95 } : {}}
        >
          <svg
            className="w-6 h-6 md:w-8 md:h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>

        {/* Slide Indicator */}
        <div className="flex items-center space-x-4">
          {/* Dots */}
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => onSlideSelect?.(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-gold w-8' : 'bg-gray-600'
                }`}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>
          
          {/* Text Indicator */}
          <span className="text-white text-sm md:text-base font-medium">
            {currentIndex + 1} / {totalSlides}
          </span>
        </div>

        {/* Next Button */}
        <motion.button
          onClick={onNext}
          disabled={!canGoNext}
          className={`p-3 md:p-4 rounded-lg border-2 ${
            canGoNext
              ? 'border-gold text-gold hover:bg-gold/10 glow-gold cursor-pointer'
              : 'border-gray-600 text-gray-600 cursor-not-allowed opacity-50'
          } transition-all`}
          whileHover={canGoNext ? { scale: 1.1 } : {}}
          whileTap={canGoNext ? { scale: 0.95 } : {}}
        >
          <svg
            className="w-6 h-6 md:w-8 md:h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden max-w-7xl mx-auto">
        <motion.div
          className="h-full bg-gradient-to-r from-teal to-gold"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / totalSlides) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};

