import { motion } from 'framer-motion';
import { Slide } from '../slides';
import { useEffect, useRef } from 'react';

interface SlideViewProps {
  slide: Slide;
}

export const SlideView = ({ slide }: SlideViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const accentVideoRef = useRef<HTMLVideoElement>(null);
  const isReversingRef = useRef(false);
  const accentIsReversingRef = useRef(false);
  const animationFrameRef = useRef<number>();
  const accentAnimationFrameRef = useRef<number>();

  // Helper function to setup ping-pong loop for any video
  const setupPingPongLoop = (
    video: HTMLVideoElement,
    isReversing: React.MutableRefObject<boolean>,
    animationFrame: React.MutableRefObject<number | undefined>
  ) => {
    video.playbackRate = 0.6;
    isReversing.current = false;
    
    const pingPongLoop = () => {
      if (!video) return;
      
      const currentTime = video.currentTime;
      const duration = video.duration;
      
      if (isNaN(duration) || duration === 0) {
        animationFrame.current = requestAnimationFrame(pingPongLoop);
        return;
      }
      
      if (!isReversing.current) {
        // Playing forward
        if (currentTime >= duration - 0.1) {
          // Reached end, start reversing
          isReversing.current = true;
          video.pause();
        }
      } else {
        // Playing in reverse (by manually decreasing currentTime)
        if (currentTime <= 0.1) {
          // Reached start, resume forward
          isReversing.current = false;
          video.playbackRate = 0.6;
          video.play().catch(console.error);
        } else {
          // Decrease time to simulate reverse playback
          const step = (1 / 60) * 0.6; // ~60fps * playbackRate
          video.currentTime = Math.max(0, currentTime - step);
        }
      }
      
      animationFrame.current = requestAnimationFrame(pingPongLoop);
    };

    const handleLoadedMetadata = () => {
      video.playbackRate = 0.6;
      video.play().catch(console.error);
      animationFrame.current = requestAnimationFrame(pingPongLoop);
    };

    const handleCanPlay = () => {
      if (!animationFrame.current) {
        handleLoadedMetadata();
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleCanPlay);
    
    if (video.readyState >= 2) {
      handleLoadedMetadata();
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = undefined;
      }
    };
  };

  // Setup ping-pong for background video
  useEffect(() => {
    if (slide.mediaType === 'video' && videoRef.current) {
      return setupPingPongLoop(videoRef.current, isReversingRef, animationFrameRef);
    }
  }, [slide.mediaType, slide.mediaSrc]);

  // Setup ping-pong for accent video
  useEffect(() => {
    const isAccentVideo = slide.accentObjectSrc?.endsWith('.mp4');
    if (isAccentVideo && accentVideoRef.current) {
      return setupPingPongLoop(accentVideoRef.current, accentIsReversingRef, accentAnimationFrameRef);
    }
  }, [slide.accentObjectSrc]);

  const isAccentVideo = slide.accentObjectSrc?.endsWith('.mp4');

  return (
    <div className="relative w-full h-full overflow-hidden bg-dark">
      {/* Background Media */}
      <div className="absolute inset-0 w-full h-full">
        {slide.mediaType === 'video' ? (
          <>
            <motion.video
              ref={videoRef}
              src={slide.mediaSrc}
              autoPlay
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ scale: 1.02 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            {/* Dark overlay for background videos */}
            <div className="absolute inset-0 bg-black/60" />
          </>
        ) : (
          <motion.img
            src={slide.mediaSrc}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.02 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        )}
        
        {/* Extra dark overlay for Slide 2 only */}
        {slide.id === 2 && (
          <div className="absolute inset-0 bg-black/70 z-10" />
        )}
        
        {/* Dark gradient overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        <div 
          className="absolute inset-0" 
          style={{
            background: 'radial-gradient(circle, transparent 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)'
          }}
        />
      </div>

      {/* Accent Object */}
      {slide.accentObjectSrc && !isAccentVideo && (
        <motion.img
          src={slide.accentObjectSrc}
          alt=""
          className="absolute top-8 right-8 w-32 md:w-40 lg:w-56 opacity-90 z-10"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {slide.accentObjectSrc && isAccentVideo && (
        <motion.div
          className="absolute top-8 right-8 w-48 md:w-64 lg:w-80 z-10 rounded-lg overflow-hidden glow-teal"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <video
            ref={accentVideoRef}
            src={slide.accentObjectSrc}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}

      {/* Foreground Content */}
      <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl"
        >
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gold mb-4 leading-tight">
            {slide.title}
          </h1>

          {/* "Presented by:" + Logo on Slide 1, Subtitle on other slides */}
          {slide.id === 1 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center gap-4 mb-8"
            >
              <span className="text-gold text-lg md:text-xl lg:text-2xl font-light">
                Presented by:
              </span>
              <img
                src="/media/logo.png"
                alt="Titan Global.sa"
                className="h-10 md:h-12 lg:h-[52px]"
              />
            </motion.div>
          ) : slide.subtitle ? (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl lg:text-3xl text-teal mb-8 font-light"
            >
              {slide.subtitle}
            </motion.p>
          ) : null}

          {/* Bullets */}
          {slide.bullets && slide.bullets.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-4 md:space-y-6 mb-8"
            >
              {slide.bullets.map((bullet, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="text-lg md:text-xl lg:text-2xl text-white flex items-start"
                >
                  <span className="text-teal mr-4 text-2xl">▸</span>
                  <span className="leading-relaxed">{bullet}</span>
                </motion.li>
              ))}
            </motion.ul>
          )}

          {/* Highlight */}
          {slide.highlight && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: slide.bullets ? 1.2 : 0.6 }}
              className="mt-8 md:mt-12 p-6 md:p-8 border-l-4 border-gold bg-black/40 backdrop-blur-sm rounded-r-lg"
            >
              <p className="text-lg md:text-xl lg:text-2xl text-gold font-semibold leading-relaxed italic">
                {slide.highlight}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

