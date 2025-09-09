'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { animation, slideUp } from '@/motion';
import TextMask from '@/animation/TextMask';
import LinkHover from '@/animation/LinkHover';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import Button from '@/components/Button';
import ApplyStyleButton from '@/components/ApplyStyleButton';

interface HeroSectionProps {
  isScrolled: boolean;
}

export default function HeroSection({ isScrolled }: HeroSectionProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const heroImages = [
    {
      id: 1,
      leftTitle: 'DRY SEASON ',
      leftButton: 'SHOP EDITIONS',
      leftButtonHref: '/curated/dry-season',
      leftGradient: 'from-amber-200 to-orange-300',
      rightGradient: 'from-gray-100 to-gray-200'
    },
    {
      id: 2,
      leftTitle: 'WET SEASON ',
      leftButton: 'SHOP LATER',
      leftButtonHref: '/curated/wet-season',
      leftGradient: 'from-blue-200 to-blue-400',
      rightGradient: 'from-gray-100 to-gray-200'
    }
  ];

  const categories = [
    {
      id: 1,
      name: 'SHOULDER BAG',
      gradient: 'from-amber-200 to-amber-400',
      icon: '👜',
      href: '/shop/women/bags'
    },
    {
      id: 2,
      name: 'BOOTS',
      gradient: 'from-gray-300 to-gray-500',
      icon: '👢',
      href: '/shop/women/boots'
    },
    {
      id: 3,
      name: 'NEW PRODUCTS',
      gradient: 'from-green-200 to-green-400',
      icon: '✨',
      href: '/shop/women/new'
    },
    {
      id: 4,
      name: 'SHOES',
      gradient: 'from-blue-200 to-blue-400',
      icon: '👟',
      href: '/shop/women/shoes'
    },
    {
      id: 5,
      name: 'BAGS',
      gradient: 'from-purple-200 to-purple-400',
      icon: '🛍️',
      href: '/shop/women/bags'
    },
    {
      id: 6,
      name: 'LOAFERS',
      gradient: 'from-orange-200 to-orange-400',
      icon: '👞',
      href: '/shop/women/loafers'
    }
  ];

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const currentHero = heroImages[currentImage];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        ease: [0.76, 0, 0.24, 1] as const,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1] as const
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.76, 0, 0.24, 1] as const
      }
    }
  };

  return (
    <motion.div 
      className="relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Main Hero Section */}
      <div className="relative h-[80vh] overflow-hidden">
        {/* Full Background Image */}
        <motion.div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://www.charleskeith.com/on/demandware.static/-/Library-Sites-CharlesKeith/default/dw21fa4cb5/images/homepage/2025/charles-keith-home-s-week-36-kr-600x1000-mobile.jpg)'
          }}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Overlay for better text readability */}
          <motion.div 
            className="absolute inset-0 bg-black/30" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          
          {/* Content positioned over the image */}
          <motion.div 
            className="absolute bottom-20 left-12 text-white z-10"
            variants={itemVariants}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              >
                <TextMask>
                  {[currentHero.leftTitle]}
                </TextMask>
              </motion.div>
            </AnimatePresence>
            
            <motion.div variants={buttonVariants}>
              <ApplyStyleButton
                href={currentHero.leftButtonHref}
                title={currentHero.leftButton}
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Hero Navigation Dots */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          {heroImages.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index === currentImage 
                  ? "bg-white scale-125" 
                  : "bg-white/50 hover:bg-white/75"
              )}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </motion.div>
      </div>  
    </motion.div>
  );
}
