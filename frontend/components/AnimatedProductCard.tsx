'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import SquareButton from '@/components/SquareButton';
import LinkHover from '@/animation/LinkHover';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';

interface AnimatedProductCardProps {
  product: {
    id: string;
    name: string;
    price: string;
    image: string;
    rating?: number;
    isNew?: boolean;
    colors?: string[];
  };
  onAddToCart?: (product: any) => void;
  onAddToWishlist?: (product: any) => void;
  className?: string;
}

export default function AnimatedProductCard({ 
  product, 
  onAddToCart, 
  onAddToWishlist,
  className = '' 
}: AnimatedProductCardProps) {
  return (
    <motion.div
      className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${className}`}
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay with Rounded Buttons */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex gap-3">
            {/* Quick View Button */}
            <SquareButton
              backgroundColor="#fff"
              className="w-12 h-12 flex items-center justify-center cursor-pointer rounded-lg"
            >
              <Eye className="w-5 h-5 text-black z-10" />
            </SquareButton>
            
            {/* Add to Cart Button */}
            <button
              onClick={() => onAddToCart?.(product)}
              className="w-12 h-12 flex items-center justify-center cursor-pointer rounded-lg"
            >
              <SquareButton
                backgroundColor="#000"
                className="w-12 h-12 flex items-center justify-center rounded-lg"
              >
                <ShoppingCart className="w-5 h-5 text-white z-10" />
              </SquareButton>
            </button>
            
            {/* Wishlist Button */}
            <button
              onClick={() => onAddToWishlist?.(product)}
              className="w-12 h-12 flex items-center justify-center cursor-pointer rounded-lg"
            >
              <SquareButton
                backgroundColor="#ef4444"
                className="w-12 h-12 flex items-center justify-center rounded-lg"
              >
                <Heart className="w-5 h-5 text-white z-10" />
              </SquareButton>
            </button>
          </div>
        </div>

        {/* New Badge */}
        {product.isNew && (
          <div className="absolute top-4 left-4">
            <SquareButton
              backgroundColor="#10b981"
              className="px-3 py-1 rounded-lg"
            >
              <span className="text-white text-xs font-bold z-10">NEW</span>
            </SquareButton>
          </div>
        )}

        {/* Rating Badge */}
        {product.rating && (
          <div className="absolute top-4 right-4">
            <SquareButton
              backgroundColor="#f59e0b"
              className="px-2 py-1 flex items-center gap-1 rounded-lg"
            >
              <Star className="w-3 h-3 text-white z-10 fill-current" />
              <span className="text-white text-xs font-bold z-10">{product.rating}</span>
            </SquareButton>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-6">
        <LinkHover
          href={`/products/${product.id}`}
          title={product.name}
          className="text-lg font-bold text-gray-900 mb-2 group-hover:text-luxury-gold transition-colors block"
        />
        
        {/* Color Options */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-2 mb-3">
            {product.colors.map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">{product.price}</span>
          
          {/* Add to Cart Button */}
          <button
            onClick={() => onAddToCart?.(product)}
            className="px-4 py-2 cursor-pointer rounded-lg"
          >
            <SquareButton
              backgroundColor="#000"
              className="px-4 py-2 rounded-lg"
            >
              <span className="text-white font-medium z-10">Add to Cart</span>
            </SquareButton>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
