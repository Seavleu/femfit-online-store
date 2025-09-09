'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import LinkHover from '@/animation/LinkHover';
import { cn } from '@/lib/utils';
import { LAYOUT_CONSTANTS } from '@/lib/layout';

interface SpotlightItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  href: string;
  category: string;
}

export default function SpotlightSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const spotlightItems: SpotlightItem[] = [
    {
      id: '1',
      title: 'Edna Recycled Suede Hobo Bag - Espresso Brown',
      image: 'https://www.charleskeith.com/on/demandware.static/-/Library-Sites-CharlesKeith/default/dw03836c03/images/homepage/2025/charles-keith-home-c-1-week-36-kr-600x800-desktop.jpg',
      href: '/shop/bags/hobo',
      category: 'bags'
    },
    {
      id: '2',
      title: 'Trending Now: Shoes',
      subtitle: 'New Collection',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop&crop=center',
      href: '/shop/shoes?tags=trending',
      category: 'shoes'
    },
    {
      id: '3',
      title: 'Work Look',
      subtitle: 'Professional Style',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop&crop=center',
      href: '/shop/bags?category=work',
      category: 'bags'
    },
    {
      id: '4',
      title: 'Online Only',
      subtitle: 'Exclusive Collection',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop&crop=center',
      href: '/shop/online-only',
      category: 'exclusive'
    },
    {
      id: '5',
      title: 'Pointed T',
      subtitle: 'Elegant Footwear',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=400&h=500&fit=crop&crop=center',
      href: '/shop/shoes?category=pumps',
      category: 'shoes'
    }
  ];

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const itemWidth = container.offsetWidth / 3; // Show 3 items at a time on desktop
      const newIndex = Math.max(0, Math.min(spotlightItems.length - 3, index));
      
      container.scrollTo({
        left: newIndex * itemWidth,
        behavior: 'smooth'
      });
      setCurrentIndex(newIndex);
    }
  };

  const scrollLeft = () => scrollToIndex(currentIndex - 1);
  const scrollRight = () => scrollToIndex(currentIndex + 1);

  return (
    <section className={`${LAYOUT_CONSTANTS.SECTION_PADDING} bg-white`}>
      <div className={`${LAYOUT_CONSTANTS.CONTAINER_MAX_WIDTH} mx-auto ${LAYOUT_CONSTANTS.CONTAINER_PADDING}`}>
        <div className="flex items-center justify-between mb-8">
          <h2 className={`${LAYOUT_CONSTANTS.SECTION_TITLE} font-bold text-black font-futura`}>Spotlight</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={scrollLeft}
              disabled={currentIndex === 0}
              className="p-2 hover:bg-gray-100 transition-colors rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              disabled={currentIndex >= spotlightItems.length - 3}
              className="p-2 hover:bg-gray-100 transition-colors rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex space-x-1 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {spotlightItems.map((item) => (
            <LinkHover
              key={item.id}
              href={item.href}
              className="flex-shrink-0 w-80 group cursor-pointer snap-start"
            >
              <div className="relative overflow-hidden bg-neutral-50">
                <div className="aspect-[4/5]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              </div>
              {/* Title below image */}
              <div className="mt-4">
                <h3 className={`${LAYOUT_CONSTANTS.PRODUCT_CARD} text-black font-futura text-center`}>
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className={`${LAYOUT_CONSTANTS.TEXT_SM} text-gray-600 text-center font-futura mt-1`}>
                    {item.subtitle}
                  </p>
                )}
              </div>
            </LinkHover>
          ))}
        </div>
      </div>
    </section>
  );
}
