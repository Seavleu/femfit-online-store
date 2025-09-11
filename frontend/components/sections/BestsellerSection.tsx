'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';
import LinkHover from '@/animation/LinkHover';
import { cn } from '@/lib/utils';
import { LAYOUT_CONSTANTS } from '@/lib/layout';

interface Product {
  id: string;
  name: string;
  image: string;
  href: string;
  price: string;
  colors?: string[];
  isNew?: boolean;
}

interface BestsellerSectionProps {
  title: string;
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

export default function BestsellerSection({ title, products, onAddToCart }: BestsellerSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredColor, setHoveredColor] = useState<{ [key: string]: string | null }>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const itemWidth = container.offsetWidth / 4; // Show 4 items at a time on desktop
      const newIndex = Math.max(0, Math.min(products.length - 4, index));
      
      container.scrollTo({
        left: newIndex * itemWidth,
        behavior: 'smooth'
      });
      setCurrentIndex(newIndex);
    }
  };

  const scrollLeft = () => scrollToIndex(currentIndex - 1);
  const scrollRight = () => scrollToIndex(currentIndex + 1);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  return (
    <section className={`${LAYOUT_CONSTANTS.SECTION_PADDING} bg-white`}>
      <div className={`${LAYOUT_CONSTANTS.CONTAINER_MAX_WIDTH} mx-auto ${LAYOUT_CONSTANTS.CONTAINER_PADDING}`}>
        <div className="flex items-center justify-between mb-8">
          <h2 className={`${LAYOUT_CONSTANTS.SECTION_TITLE} font-bold text-black font-futura`}>{title}</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={scrollLeft}
              disabled={currentIndex === 0}
              className="p-2 hover:bg-gray-50 transition-colors rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              disabled={currentIndex >= products.length - 4}
              className="p-2 hover:bg-gray-50 transition-colors rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
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
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-64 group cursor-pointer snap-start relative">
              <Link href={product.href} className="block">
                <div className="relative aspect-[3/4] mb-3 overflow-hidden bg-white">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Add to Cart Button */}
                  <button 
                    onClick={(e) => handleAddToCart(e, product)}
                    className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4 text-gray-700" />
                  </button>
                  
                  {/* New Product Badge */}
                  {product.isNew && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-black text-white text-xs px-2 py-1 font-medium">
                        New product
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Name - Always visible, 5px below card */}
                <div className="mt-1.5">
                  <h3 className={`${LAYOUT_CONSTANTS.PRODUCT_CARD} text-gray-900 group-hover:text-black transition-colors line-clamp-2 text-center font-futura`}>
                    {product.name}
                  </h3>
                </div>

                {/* Hover Details - Overlay with z-index */}
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-center items-center space-y-3">
                  {/* Color Options */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="flex space-x-1 justify-center">
                      {product.colors.map((color: string, index: number) => (
                        <button
                          key={index}
                          onMouseEnter={() => setHoveredColor(prev => ({ ...prev, [product.id]: color }))}
                          onMouseLeave={() => setHoveredColor(prev => ({ ...prev, [product.id]: null }))}
                          className={cn(
                            "w-3 h-3 rounded-full border-2 transition-all",
                            hoveredColor[product.id] === color 
                              ? "border-black scale-110" 
                              : "border-gray-300 hover:border-gray-400"
                          )}
                          style={{ backgroundColor: color.toLowerCase() }}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Price */}
                  <p className={`${LAYOUT_CONSTANTS.TEXT_SM} text-gray-600 text-center font-futura`}>{product.price}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
