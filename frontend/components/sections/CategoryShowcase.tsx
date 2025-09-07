'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LAYOUT_CONSTANTS, RESPONSIVE } from '@/lib/layout';

interface SpotlightItem {
  id: string;
  title: string;
  image: string;
  href: string;
}

interface Bag {
  id: string;
  name: string;
  image: string;
  href: string;
  price: string;
  colors?: string[];
  isNew?: boolean;
}

// ProductGridItem component (same as shop page)
interface ProductGridItemProps {
  product: Bag;
}

function ProductGridItem({ product }: ProductGridItemProps) {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group cursor-pointer transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className={cn(
        "relative aspect-[9/16] overflow-hidden bg-neutral-50 transition-all duration-300",
        isHovered ? "border-2 border-black" : "border-2 border-transparent"
      )}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
        
        {product.isNew && (
          <div className="absolute top-3 left-3">
            <span className="bg-black text-white text-xs px-2 py-1 font-medium">
              New product
            </span>
          </div>
        )}

        {/* Product Name - Always visible */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-sm">
          <h3 className={`${LAYOUT_CONSTANTS.PRODUCT_CARD} text-gray-900 text-center font-futura`}>
            {product.name}
          </h3>
        </div>
      </div>

      {/* Hover Details - Show only on hover */}
      <div className={cn(
        "transition-all duration-300 overflow-hidden",
        isHovered ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="p-2 bg-white border-2 border-black border-t-0 -mt-1">
          {/* Color Options */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex space-x-2 mb-2 justify-center">
              {product.colors.map((color, index) => (
                <button
                  key={index}
                  onMouseEnter={() => setHoveredColor(color)}
                  onMouseLeave={() => setHoveredColor(null)}
                  className={cn(
                    "w-4 h-4 rounded-full border-2 transition-all",
                    hoveredColor === color 
                      ? "border-black scale-110" 
                      : "border-gray-300 hover:border-gray-400"
                  )}
                  style={{ backgroundColor: color.toLowerCase() }}
                />
              ))}
            </div>
          )}

          {/* Size Selection */}
          <div className="flex space-x-1 mb-2 justify-center">
            {['35', '36', '37', '38', '39', '40', '41'].map((size, index) => (
              <button
                key={size}
                className={cn(
                  "w-8 h-8 text-xs border transition-colors flex items-center justify-center",
                  size === '38' 
                    ? "bg-white text-black border-black border-2" 
                    : ['36', '39', '40', '41'].includes(size)
                    ? "bg-gray-100 text-gray-400 border-gray-300"
                    : "bg-white text-black border-gray-300 hover:border-black"
                )}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Add to Shopping Bag Button */}
          <button className="w-full bg-gray-800 text-white text-xs py-2 px-3 font-medium hover:bg-gray-900 text-center transition-colors">
            ADD TO SHOPPING BAG
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CategoryShowcase() {
  const [currentSpotlightIndex, setCurrentSpotlightIndex] = useState(0);
  const [currentBagsIndex, setCurrentBagsIndex] = useState(0);
  const spotlightScrollRef = useRef<HTMLDivElement>(null);
  const bagsScrollRef = useRef<HTMLDivElement>(null);

  const spotlightItems: SpotlightItem[] = [
    {
      id: '1',
      title: 'WOMEN\'S GYMNASTIC',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop',
      href: '/shop/women/gymnastic-clothes'
    },
    {
      id: '2',
      title: 'MEN\'S GYMNASTIC',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop',
      href: '/shop/men/gymnastic-clothes'
    },
    {
      id: '3',
      title: 'WOMEN\'S PERFUME',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=500&fit=crop',
      href: '/shop/women/perfume'
    },
    {
      id: '4',
      title: 'MEN\'S PERFUME',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=500&fit=crop',
      href: '/shop/men/perfume'
    },
    {
      id: '5',
      title: 'GYMNASTIC EQUIPMENT',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop',
      href: '/shop/equipment'
    },
    {
      id: '6',
      title: 'COSMETICS',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop',
      href: '/shop/cosmetics'
    }
  ];

  const featuredProducts: Bag[] = [
    {
      id: '1',
      name: 'Women\'s Gymnastic Leotard - Black',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
      href: '/shop/women/gymnastic-clothes',
      price: '$89.99',
      colors: ['#000000', '#FF0000', '#0000FF'],
      isNew: true
    },
    {
      id: '2',
      name: 'Men\'s Gymnastic Tank Top - Navy',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
      href: '/shop/men/gymnastic-clothes',
      price: '$49.99',
      colors: ['#000080', '#000000', '#FFFFFF']
    },
    {
      id: '3',
      name: 'Women\'s Perfume - Floral Essence',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop',
      href: '/shop/women/perfume',
      price: '$129.99',
      colors: ['#FFB6C1', '#FFC0CB', '#DDA0DD'],
      isNew: true
    },
    {
      id: '4',
      name: 'Men\'s Cologne - Fresh Sport',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop',
      href: '/shop/men/perfume',
      price: '$99.99',
      colors: ['#4169E1', '#000080', '#2F4F4F']
    },
    {
      id: '5',
      name: 'Gymnastic Rings Set',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
      href: '/shop/equipment',
      price: '$199.99',
      colors: ['#000000', '#FF0000'],
      isNew: true
    },
    {
      id: '6',
      name: 'Premium Makeup Kit',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop',
      href: '/shop/cosmetics',
      price: '$79.99',
      colors: ['#FFB6C1', '#FFC0CB', '#DDA0DD']
    }
  ];

  const scrollSpotlight = (direction: 'left' | 'right') => {
    if (spotlightScrollRef.current) {
      const container = spotlightScrollRef.current;
      const itemWidth = container.offsetWidth / 3;
      const newIndex = direction === 'left' 
        ? Math.max(0, currentSpotlightIndex - 1)
        : Math.min(spotlightItems.length - 3, currentSpotlightIndex + 1);
      
      container.scrollTo({
        left: newIndex * itemWidth,
        behavior: 'smooth'
      });
      setCurrentSpotlightIndex(newIndex);
    }
  };

  const scrollFeatured = (direction: 'left' | 'right') => {
    if (bagsScrollRef.current) {
      const container = bagsScrollRef.current;
      const itemWidth = container.offsetWidth / 4;
      const newIndex = direction === 'left' 
        ? Math.max(0, currentBagsIndex - 1)
        : Math.min(featuredProducts.length - 4, currentBagsIndex + 1);
      
      container.scrollTo({
        left: newIndex * itemWidth,
        behavior: 'smooth'
      });
      setCurrentBagsIndex(newIndex);
    }
  };

  return (
    <div className="bg-white">
      {/* In the Spotlight Section */}
      <section className="py-2.5 bg-white">
        <div className={`${LAYOUT_CONSTANTS.CONTAINER_MAX_WIDTH} mx-auto ${LAYOUT_CONSTANTS.CONTAINER_PADDING}`}>
                  <div className="flex items-center justify-between mb-8">
          <h2 className={`${LAYOUT_CONSTANTS.SECTION_TITLE} font-bold text-black font-futura`}>In the Spotlight</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => scrollSpotlight('left')}
                className="p-2 hover:bg-gray-100 transition-colors rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollSpotlight('right')}
                className="p-2 hover:bg-gray-100 transition-colors rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
        </div>

          <div 
            ref={spotlightScrollRef}
            className="flex space-x-1 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {spotlightItems.map((item) => (
            <Link
                key={item.id}
                href={item.href}
                className="flex-shrink-0 w-80 group cursor-pointer"
              >
                <div className="relative overflow-hidden bg-neutral-50">
                  <div className="aspect-[9/16]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-8">
                    <h5 className="text-lg font-semibold text-black">{item.title}</h5>
                  </div>
                </div>
              </Link>
                  ))}
                </div>
              </div>
      </section>

      {/* Most Wanted: Featured Products Section */}
      <section className="py-2.5 bg-gray-50">
        <div className={`${LAYOUT_CONSTANTS.CONTAINER_MAX_WIDTH} mx-auto ${LAYOUT_CONSTANTS.CONTAINER_PADDING}`}>
                  <div className="flex items-center justify-between mb-8">
          <h2 className={`${LAYOUT_CONSTANTS.SECTION_TITLE} font-bold text-black font-futura`}>Most Wanted: Featured Products</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => scrollFeatured('left')}
                className="p-2 hover:bg-gray-100 transition-colors rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollFeatured('right')}
                className="p-2 hover:bg-gray-100 transition-colors rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
        </div>

          <div 
            ref={bagsScrollRef}
            className="flex space-x-0 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={product.href}
                className="flex-shrink-0 w-64"
              >
                <ProductGridItem product={product} />
          </Link>
            ))}
          </div>
        </div>
      </section>
      </div>
  );
}