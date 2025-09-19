'use client';

import React, { useRef, useMemo, useCallback, useState } from 'react';
import { Eye, ShoppingCart, Heart, Star, TrendingUp, Clock, Zap } from 'lucide-react';
import Link from 'next/link';
import LinkHover from '@/animation/LinkHover';
import { cn } from '@/lib/utils';
import { useCart, Product } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/currency';

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  index: number;
}

const ProductCard = React.memo(function ProductCard({ product, viewMode, index }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  // CSS-based animations instead of GSAP

  // Memoize event handlers to prevent unnecessary re-renders
  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  }, [addToCart, product]);

  // Memoize computed values
  const productPrice = useMemo(() => formatPrice(product.price, 'USD'), [product.price]);
  const productImage = useMemo(() => product.image, [product.image]);
  const productName = useMemo(() => product.name, [product.name]);
  
  const hasDiscount = product.originalPrice && product.originalPrice.usd > product.price.usd;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice.usd - product.price.usd) / product.originalPrice.usd) * 100)
    : 0;

  const isLowStock = product.stock && product.stock <= 5;
  const isNew = product.tags.includes('New');
  const isPopular = product.tags.includes('Popular');
  const isLimited = product.tags.includes('Limited Edition');

  if (viewMode === 'list') {
    return (
      <div
        ref={cardRef}
        className="flex flex-col sm:flex-row gap-1 p-6 border border-gray-100 rounded-2xl hover:shadow-lg transition-all duration-300 group animate-fade-in-up"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-full sm:w-48 h-64 sm:h-48 overflow-hidden rounded-xl bg-white flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="product-image w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Status Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {isNew && (
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                New
              </span>
            )}
            {isLimited && (
              <span className="px-2 py-1 bg-purple-500 text-white text-xs font-medium rounded-full">
                Limited
              </span>
            )}
            {hasDiscount && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                -{discountPercentage}%
              </span>
            )}
          </div>

          {/* Stock Status */}
          {isLowStock && (
            <div className="absolute bottom-3 left-3">
              <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
                Low Stock
              </span>
            </div>
          )}

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <LinkHover
              href={`/shop/${product.id}`}
              title="Quick View"
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-luxury-gold hover:text-white transition-colors shadow-lg"
            >
              <Eye className="w-4 h-4" />
            </LinkHover>
            <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-lg">
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-1 bg-luxury-gold/10 text-luxury-gold text-xs font-medium rounded-full">
                {tag}
              </span>
            ))}
          </div>
          
          <div>
            <h3 className="text-xl font-space-grotesk font-semibold mb-2 group-hover:text-luxury-gold transition-colors">
              {product.name}
            </h3>
            <p className="body-text text-gray-600 text-sm leading-relaxed mb-4">{product.description}</p>
            
            {/* Rating */}
            {product.rating && (
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating!) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews || 0} reviews)
                </span>
              </div>
            )}
            
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <p className="text-lg font-space-grotesk font-bold">{formatPrice(product.price, 'USD')}</p>
                {hasDiscount && (
                  <p className="text-lg text-gray-500 line-through">{formatPrice(product.originalPrice!, 'USD')}</p>
                )}
              </div>
              <p className="text-sm text-gray-500">{formatPrice(product.price, 'KHR')}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <LinkHover
              href={`/shop/${product.id}`}
              title="View Details"
              className="flex-1 bg-black text-white px-6 py-3 font-medium text-center hover:bg-luxury-gold hover:text-black transition-colors duration-300 rounded-lg"
            >
              View Details
            </LinkHover>
            <button 
              onClick={handleAddToCart}
              className="p-3 border border-gray-200 rounded-full hover:border-luxury-gold hover:bg-luxury-gold hover:text-white transition-colors"
              title="Add to Cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={cardRef} 
      className="group cursor-pointer animate-fade-in-up"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-white mb-6 rounded-xl">
        <img
          src={product.image}
          alt={product.name}
          className="product-image w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {isNew && (
            <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
              New
            </span>
          )}
          {isLimited && (
            <span className="px-2 py-1 bg-purple-500 text-white text-xs font-medium rounded-full">
              Limited
            </span>
          )}
          {hasDiscount && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Stock Status */}
        {isLowStock && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
              Low Stock
            </span>
          </div>
        )}
        
        {/* Overlay with Quick Actions */}
        <div className="product-overlay absolute inset-0 bg-black/30 opacity-0 flex items-center justify-center transition-opacity duration-300">
          <div className="quick-actions flex space-x-4 translate-y-5 opacity-0 transition-all duration-300">
            <LinkHover
              href={`/shop/${product.id}`}
              title="Quick View"
              className="bg-white/90 backdrop-blur-sm text-black px-6 py-3 font-medium hover:bg-luxury-gold hover:text-white transition-all duration-300 flex items-center space-x-2 rounded-full"
            >
              <Eye className="w-4 h-4" />
              <span>Quick View</span>
            </LinkHover>
          </div>
        </div>
        
        {/* Floating Actions */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={handleAddToCart}
            className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-luxury-gold hover:text-white transition-colors shadow-lg"
            title="Add to Cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
          <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-lg">
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex flex-wrap gap-1 mb-2">
          {product.tags.slice(0, 2).map(tag => (
            <span key={tag} className="px-2 py-1 bg-luxury-gold/10 text-luxury-gold text-xs font-medium rounded-full">
              {tag}
            </span>
          ))}
        </div>
        
        <h3 className="text-lg font-space-grotesk font-semibold group-hover:text-luxury-gold transition-colors">
          {product.name}
        </h3>
        <p className="body-text text-gray-500 text-sm leading-relaxed font-light">{product.description}</p>
        
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating!) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviews || 0})</span>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <p className="text-lg font-space-grotesk font-bold">{formatPrice(product.price, 'USD')}</p>
              {hasDiscount && (
                <p className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice!, 'USD')}</p>
              )}
            </div>
            <p className="text-xs text-gray-500">{formatPrice(product.price, 'KHR')}</p>
          </div>
          <LinkHover
            href={`/shop/${product.id}`}
            title="View Details →"
            className="text-sm font-medium text-black hover:text-luxury-gold transition-colors duration-300"
          >
            View Details →
          </LinkHover>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;