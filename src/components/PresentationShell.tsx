import { useState, useEffect } from 'react';
import { SlideView } from './SlideView';
import { SlideControls } from './SlideControls';
import { slides } from '../slides';
import { useFullscreen } from '../hooks/useFullscreen';

export const PresentationShell = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { exitFullscreen } = useFullscreen();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        handlePrevious();
      } else if (e.key === 'Escape') {
        exitFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, exitFullscreen]);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSlideSelect = (index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentIndex(index);
    }
  };

  const currentSlide = slides[currentIndex];

  return (
    <div className="w-full h-screen overflow-hidden bg-dark">
      <SlideView slide={currentSlide} />
      <SlideControls
        currentIndex={currentIndex}
        totalSlides={slides.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSlideSelect={handleSlideSelect}
      />
    </div>
  );
};

