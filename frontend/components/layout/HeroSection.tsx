'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';

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
    <div className="relative">
      {/* Main Hero Section */}
      <div className="relative h-[80vh] overflow-hidden">
        {/* Full Background Image */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat animate-zoom-out"
          style={{
            backgroundImage: 'url(https://www.charleskeith.com/on/demandware.static/-/Library-Sites-CharlesKeith/default/dw21fa4cb5/images/homepage/2025/charles-keith-home-s-week-36-kr-600x1000-mobile.jpg)'
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30" />
          
          {/* Content positioned over the image */}
          <div className="absolute bottom-20 left-12 text-white z-10">
            <h2 className="text-4xl font-bold mb-6 tracking-wider break-words leading-tight">
              {currentHero.leftTitle}
            </h2>
            <Link
              href={currentHero.leftButtonHref}
              className="group relative flex h-12 w-[220px] items-center justify-between border-2 border-black rounded-lg bg-black font-medium text-white hover:bg-gray-800 transition-all duration-300"
            >
              <span className="pl-4 text-white">{currentHero.leftButton}</span>
              <div className="relative h-9 w-9 overflow-hidden bg-white rounded-full mr-1">
                <div className="absolute top-[0.7em] left-[-0.1em] grid place-content-center transition-all w-full h-full duration-200 group-hover:-translate-y-5 group-hover:translate-x-4">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 fill-black"
                  >
                    <path
                      d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mb-1 -translate-x-4 fill-black"
                  >
                    <path
                      d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
        

        {/* Brand Name Overlay */}
        {/* <div className={cn(
          "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-500",
          isScrolled ? "opacity-0 scale-95" : "opacity-100 scale-100"
        )}>
          <h1 className="text-4xl font-bold text-white tracking-wider drop-shadow-2xl">
            FEM & FIT
          </h1>
        </div> */}


        {/* Hero Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
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
