'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useState, useEffect } from 'react';
import { animation, slideUp, opacity } from '@/motion';
import TextMask from '@/animation/TextMask';
import LogoMarquee from '@/animation/LogoMarquee';

interface BrandRevealProps {
  onComplete: () => void;
}

export default function BrandReveal({ onComplete }: BrandRevealProps) {
  const [showText, setShowText] = useState(false);
  const [showCurtain, setShowCurtain] = useState(true);
  const [showCurve, setShowCurve] = useState(false);

  useEffect(() => {
    // Start text animation after a brief delay
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 800);

    // Start curve animation
    const curveTimer = setTimeout(() => {
      setShowCurve(true);
    }, 2800);

    // Complete the entire animation sequence
    const completeTimer = setTimeout(() => {
      setShowCurtain(false);
      // Call onComplete after curtain animation finishes
      setTimeout(() => {
        onComplete();
      }, 1200);
    }, 4000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(curveTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    exit: {
      y: "-100vh",
      transition: {
        duration: 1.2,
        ease: "easeOut"
      }
    }
  };

  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 50, rotateX: -90, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.8,
        ease: "easeOut"
      }
    })
  };

  const brandText = "FEMFIT";
  const letters = brandText.split("");
  // const subtitlePhrases = ["PERFORMANCE", "STYLE", "CONFIDENCE"];

  return (
    <AnimatePresence>
      {showCurtain && (
        <motion.div
          className="fixed inset-0 z-50 bg-white flex items-center justify-center overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Background Marquee */}
          <div className="absolute inset-0 opacity-[0.02]">
            <LogoMarquee baseVelocity={20}>
              <span className="text-6xl font-light text-black whitespace-nowrap">
                FEMFIT • PERFORMANCE • STYLE • CONFIDENCE • FEMFIT • PERFORMANCE • STYLE • CONFIDENCE •
              </span>
            </LogoMarquee>
          </div>

          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="w-full h-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          </div>

          {/* Main Content */}
          <div className="text-center relative z-10">
            {/* Brand Name with Enhanced Animation */}
            <div className="flex justify-center items-center space-x-2 mb-8">
              {letters.map((letter, index) => (
                <motion.span
                  key={index}
                  className="text-8xl md:text-9xl font-light tracking-wider text-black relative"
                  custom={index}
                  variants={letterVariants}
                  initial="hidden"
                  animate={showText ? "visible" : "hidden"}
                  style={{
                    transformOrigin: "bottom center",
                    perspective: "1000px"
                  }}
                >
                  {letter}
                  {/* Subtle glow effect */}
                  <motion.span
                    className="absolute inset-0 text-black opacity-20 blur-sm"
                    initial={{ opacity: 0 }}
                    animate={showText ? { opacity: 0.1 } : { opacity: 0 }}
                    transition={{ delay: index * 0.15 + 0.5, duration: 0.6 }}
                  >
                    {letter}
                  </motion.span>
                </motion.span>
              ))}
            </div>

            {/* Subtitle with TextMask */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={showText ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              {/* <TextMask>
                {subtitlePhrases}
              </TextMask> */}
            </motion.div>

            {/* Enhanced Decorative Elements */}
            <motion.div
              className="mt-8 flex justify-center items-center space-x-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={showText ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ delay: 2.2, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            >
              <div className="w-16 h-px bg-black"></div>
              <motion.div
                className="w-2 h-2 bg-black rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <div className="w-16 h-px bg-black"></div>
            </motion.div>
          </div>

          {/* Enhanced Loading Indicator */}
          <motion.div
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={showText ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 2.8, duration: 0.6 }}
          >
            <div className="flex space-x-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-10 bg-black rounded-full"
                  animate={{
                    scaleY: [1, 0.2, 1],
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: [0.76, 0, 0.24, 1]
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Curve Transition Overlay */}
          {showCurve && (
            <motion.div
              className="absolute inset-0 bg-white"
              variants={slideUp}
              initial="initial"
              animate="exit"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
