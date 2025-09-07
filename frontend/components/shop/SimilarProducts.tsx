'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SimilarProduct {
  id: string;
  name: string;
  price: string;
  image: string;
}

interface SimilarProductsProps {
  products: SimilarProduct[];
}

export default function SimilarProducts({ products }: SimilarProductsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const productsPerView = 5;

  const nextSlide = () => {
    setCurrentIndex(prev => 
      prev + productsPerView >= products.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex(prev => 
      prev === 0 ? Math.max(0, products.length - productsPerView) : prev - 1
    );
  };

  const visibleProducts = products.slice(currentIndex, currentIndex + productsPerView);

  return (
    <div className="mt-16">
      <h2 className="text-xl font-medium mb-8">SIMILAR PRODUCTS</h2>
      
      <div className="relative">
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Products Carousel */}
        <div className="flex space-x-6 overflow-hidden">
          {visibleProducts.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-64">
              <div className="group cursor-pointer">
                <div className="aspect-[3/4] mb-4 overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600">{product.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center space-x-2 mt-6">
          {Array.from({ length: Math.ceil(products.length / productsPerView) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * productsPerView)}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                Math.floor(currentIndex / productsPerView) === index
                  ? "bg-black"
                  : "bg-gray-300"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
