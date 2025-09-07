'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  colors: string[];
  sizes: string[];
  isNew?: boolean;
}

interface EnhancedProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
}

export default function EnhancedProductCard({ 
  product, 
  onAddToCart, 
  onAddToWishlist 
}: EnhancedProductCardProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handlePreviousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => prev > 0 ? prev - 1 : product.colors.length - 1);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => prev < product.colors.length - 1 ? prev + 1 : 0);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToWishlist?.(product);
  };

  return (
    <div 
      className={cn(
        "group relative bg-white transition-all duration-300 cursor-pointer",
        isHovered && "transform -translate-y-2 shadow-2xl border-2 border-black"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Navigation Arrows - Only show on hover */}
        {isHovered && product.colors.length > 1 && (
          <>
            <button
              onClick={handlePreviousImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          </>
        )}
        
        {/* New Product Badge */}
        {product.isNew && (
          <div className="absolute top-3 left-3">
            <span className="bg-black text-white text-xs px-2 py-1 font-medium">
              New product
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        {/* Color Options */}
        <div className="flex space-x-1 mb-3">
          {product.colors.map((color, index) => (
            <button
              key={index}
              onClick={() => setSelectedColor(color)}
              className={cn(
                "w-4 h-4 rounded-full border-2 transition-all",
                selectedColor === color 
                  ? "border-black scale-110" 
                  : "border-gray-300 hover:border-gray-400"
              )}
              style={{ backgroundColor: color.toLowerCase() }}
            />
          ))}
        </div>
        
        <p className="text-sm text-gray-600 font-medium">{product.price}</p>
      </div>

      {/* Extended Info Panel - Only show on hover */}
      {isHovered && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 transform translate-y-full opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
          {/* Size Options */}
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-700 mb-2">Size</p>
            <div className="flex space-x-1">
              {product.sizes.map((size, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "w-8 h-8 text-xs font-medium border rounded transition-all",
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-gray-300 hover:border-gray-400"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-1">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-black text-white py-2 px-4 text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
            <button
              onClick={handleAddToWishlist}
              className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
            >
              <Heart className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
