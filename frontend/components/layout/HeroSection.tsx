'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LinkHover } from '@/animation';
import { ImagePlaceholder } from '@/components/ui';
import { Button } from '@/components/ui';

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

  return (
    <div className="relative animate-fade-in">
      {/* Main Hero Section */}
      <div className="relative h-[80vh] overflow-hidden">
        {/* Full Background Image */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat animate-scale-in"
          style={{
            backgroundImage: 'url(https://www.charleskeith.com/on/demandware.static/-/Library-Sites-CharlesKeith/default/dw21fa4cb5/images/homepage/2025/charles-keith-home-s-week-36-kr-600x1000-mobile.jpg)'
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30 animate-fade-in-delayed" />
          
          {/* Content positioned over the image */}
          <div className="absolute bottom-20 left-12 text-white z-10 animate-slide-up">
            <div className="animate-fade-in-slide">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {currentHero.leftTitle}
              </h1>
            </div>
            
            <div className="animate-scale-in-delayed">
              <Button
                asChild
                className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              >
                <Link href={currentHero.leftButtonHref}>
                  {currentHero.leftButton}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Hero Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10 animate-fade-in-delayed">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95",
                index === currentImage 
                  ? "bg-white scale-125" 
                  : "bg-white/50 hover:bg-white/75"
              )}
            />
          ))}
        </div>
      </div>  
    </div>
  );
}
