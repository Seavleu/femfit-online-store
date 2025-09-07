'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SpotlightItem {
  id: string;
  title: string;
  image: string;
  href: string;
}

export default function InTheSpotlightSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const spotlightItems: SpotlightItem[] = [
    {
      id: '1',
      title: '9 TO 5',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop',
      href: '/shop?occasion=work'
    },
    {
      id: '2',
      title: 'TREND ALERT',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop',
      href: '/shop?filter=trending'
    },
    {
      id: '3',
      title: 'ON CAMPUS',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop',
      href: '/shop?occasion=campus'
    },
    {
      id: '4',
      title: 'GIFTS FOR HER',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop',
      href: '/shop/gifts'
    },
    {
      id: '5',
      title: 'CHARMIF',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop',
      href: '/shop/accessories'
    }
  ];

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemWidth = container.offsetWidth / 3; // Show 3 items at a time
      container.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth'
      });
    }
    setCurrentIndex(index);
  };

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : spotlightItems.length - 3;
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex < spotlightItems.length - 3 ? currentIndex + 1 : 0;
    scrollToIndex(newIndex);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-black">In the Spotlight</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevious}
              className="p-2 border border-gray-300 hover:border-black transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 border border-gray-300 hover:border-black transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {spotlightItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex-shrink-0 w-80 group cursor-pointer"
            >
              <div className="relative overflow-hidden bg-gray-100">
                <div className="aspect-[4/5]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4">
                  <h3 className="text-lg font-semibold text-black">{item.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
