'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import LinkHover from '@/animation/LinkHover';
import { LAYOUT_CONSTANTS } from '@/lib/layout';

interface SpotlightItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  href: string;
  category: string;
  description?: string;
}

interface InertiaImageCardProps {
  item: SpotlightItem;
  isActive: boolean;
  index: number;
  onSelect: () => void;
}

function InertiaImageCard({ item, isActive, index, onSelect }: InertiaImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      const card = cardRef.current;
      
      // Smooth inertia effect on hover
      const handleMouseMove = (e: MouseEvent) => {
        if (!isHovered) return;
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      };

      const handleMouseLeave = () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      };

      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [isHovered]);

  return (
    <div
      ref={cardRef}
      className={`relative group cursor-pointer transition-all duration-700 ease-out ${
        isActive ? 'opacity-100 scale-100' : 'opacity-60 scale-95'
      }`}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg">
        <div className="aspect-[4/5] relative">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
            <div className="text-white">
              <span className="text-xs font-medium tracking-wider uppercase text-gray-300 mb-2 block">
                {item.category}
              </span>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              {item.subtitle && (
                <p className="text-sm text-gray-300 mb-4">{item.subtitle}</p>
              )}
              <LinkHover 
                href={item.href} 
                title="Explore Collection"
                className="inline-flex items-center text-sm font-medium text-white hover:text-gray-300 transition-colors"
              >
                Explore Collection
                <ArrowRight className="ml-2 w-4 h-4" />
              </LinkHover>
            </div>
          </div>
        </div>
      </div>
      
      {/* Active Indicator */}
      {isActive && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-black rounded-full" />
      )}
    </div>
  );
}

export default function SpotlightSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const spotlightItems: SpotlightItem[] = [
    {
      id: '1',
      title: 'Fitness Essentials',
      subtitle: 'Activewear Collection',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=750&fit=crop&crop=center',
      href: '/shop/activewear',
      category: 'activewear',
      description: 'High-performance activewear designed for your fitness journey'
    },
    {
      id: '2',
      title: 'Luxury Handbags',
      subtitle: 'Premium Collection',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=750&fit=crop&crop=center',
      href: '/shop/bags',
      category: 'bags',
      description: 'Elegant handbags that elevate your style'
    },
    {
      id: '3',
      title: 'Designer Shoes',
      subtitle: 'Footwear Collection',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=750&fit=crop&crop=center',
      href: '/shop/shoes',
      category: 'shoes',
      description: 'Comfortable and stylish footwear for every occasion'
    },
    {
      id: '4',
      title: 'Work Attire',
      subtitle: 'Professional Style',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=750&fit=crop&crop=center',
      href: '/shop/workwear',
      category: 'workwear',
      description: 'Professional attire that commands respect'
    },
    {
      id: '5',
      title: 'Evening Wear',
      subtitle: 'Elegant Collection',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=600&h=750&fit=crop&crop=center',
      href: '/shop/evening',
      category: 'evening',
      description: 'Sophisticated pieces for special occasions'
    }
  ];

  const handleSelectItem = (index: number) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const scrollLeft = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : spotlightItems.length - 1;
    handleSelectItem(newIndex);
  };

  const scrollRight = () => {
    const newIndex = currentIndex < spotlightItems.length - 1 ? currentIndex + 1 : 0;
    handleSelectItem(newIndex);
  };

  return (
    <section ref={containerRef} className={`${LAYOUT_CONSTANTS.SECTION_PADDING} bg-white relative`}>
      <div className={`${LAYOUT_CONSTANTS.CONTAINER_MAX_WIDTH} mx-auto ${LAYOUT_CONSTANTS.CONTAINER_PADDING}`}>
        {/* Section Header - Classic Minimal */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-light text-black mb-6 tracking-wide">
            Spotlight Collection
          </h2>
          <div className="w-24 h-px bg-black mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
            Curated essentials that define modern elegance
          </p>
        </div>

        {/* Main Content Area */}
        <div className="relative">
          {/* Navigation Controls - Minimal */}
          <div className="flex items-center justify-between mb-12">
            <button
              onClick={scrollLeft}
              disabled={isTransitioning}
              className="p-3 border border-gray-300 hover:border-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-black transition-colors" />
            </button>
            
            {/* Dots Indicator - Minimal */}
            <div className="flex space-x-3">
              {spotlightItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectItem(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-black scale-125' 
                      : 'bg-gray-300 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={scrollRight}
              disabled={isTransitioning}
              className="p-3 border border-gray-300 hover:border-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-black transition-colors" />
            </button>
          </div>

          {/* Inertia Image Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {spotlightItems.map((item, index) => (
              <InertiaImageCard
                key={item.id}
                item={item}
                isActive={index === currentIndex}
                index={index}
                onSelect={() => handleSelectItem(index)}
              />
            ))}
          </div>

          {/* Featured Item Details - Minimal */}
          <div className="mt-16 text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-light text-black mb-4">
                {spotlightItems[currentIndex].title}
              </h3>
              {spotlightItems[currentIndex].subtitle && (
                <p className="text-lg text-gray-600 mb-6 font-light">
                  {spotlightItems[currentIndex].subtitle}
                </p>
              )}
              {spotlightItems[currentIndex].description && (
                <p className="text-gray-500 mb-8 leading-relaxed">
                  {spotlightItems[currentIndex].description}
                </p>
              )}
              <LinkHover 
                href={spotlightItems[currentIndex].href} 
                title="Explore Collection"
                className="inline-block"
              >
                <button className="bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-all duration-300 border border-black hover:border-gray-800">
                  Explore Collection
                </button>
              </LinkHover>
            </div>
          </div>
        </div>

        {/* Bottom CTA - Minimal */}
        <div className="text-center mt-20 pt-16 border-t border-gray-200">
          <LinkHover 
            href="/shop" 
            title="View All Collections"
            className="inline-block"
          >
            <span className="text-gray-600 hover:text-black transition-colors duration-300 font-medium tracking-wide">
              View All Collections →
            </span>
          </LinkHover>
        </div>
      </div>
    </section>
  );
}