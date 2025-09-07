'use client';

import { useState, useEffect, useRef } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { ArrowRight, Heart, ShoppingCart, Plus, Eye } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { products, Product } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { ErrorHandler } from '@/lib/errorHandling';
import { formatPrice } from '@/lib/currency';
import { LAYOUT_CONSTANTS, RESPONSIVE } from '@/lib/layout';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const newSeasonProducts = {
  hero: {
    ...products[0],
    image: 'https://www.charleskeith.com/on/demandware.static/-/Library-Sites-CharlesKeith/default/dw8465b3fd/images/homepage/2025/charles-keith-home-b-week-36-kr-750x1000-desktop.jpg'
  },
  grid: [
    {
      ...products[1],
      image: 'https://www.charleskeith.com/dw/image/v2/BCWJ_PRD/on/demandware.static/-/Sites-ck-products/default/dw99335ae8/images/hi-res/2025-L3-CK1-60280474-01-1.jpg?sw=456&amp;sh=608',
      colors: ['brown', 'black'],
      isNew: true
    },
    {
      ...products[2],
      image: 'https://www.charleskeith.com/dw/image/v2/BCWJ_PRD/on/demandware.static/-/Sites-ck-products/default/dwa92ef6a9/images/hi-res/2024-L7-CK1-61720210-29-1.jpg?sw=456&sh=608',
      colors: ['black', 'brown'],
      isNew: false
    },
    {
      ...products[3],
      image: 'https://www.charleskeith.com/dw/image/v2/BCWJ_PRD/on/demandware.static/-/Sites-ck-products/default/dw8c77452f/images/hi-res/2025-L6-CK1-91720035-J6-1.jpg?sw=456&sh=608',
      colors: ['black', 'brown'],
      isNew: true
    },
    {
      ...products[4],
      image: 'https://www.charleskeith.com/dw/image/v2/BCWJ_PRD/on/demandware.static/-/Sites-ck-products/default/dw50629c76/images/hi-res/2025-L6-CK1-90920159-01-1.jpg?sw=456&sh=608',
      colors: ['brown', 'black'],
      isNew: false
    }
  ]
};

export default function RecommendationsSection() {
  const { user } = useSupabaseAuth();
  const { addToCart, openCart } = useCart();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(sectionRef.current.children,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, []);

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product, 1);
    openCart();
  };

  const handleLike = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      window.location.href = '/auth/signin';
      return;
    }

    try {
      const response = await fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, action: 'toggle' }),
      });

      if (!response.ok) throw new Error('Failed to update wishlist');

      const result = await response.json();
      
      if (result.success) {
        logger.info('Wishlist updated:', {
          productId: product.id,
          productName: product.name,
          userId: user.id,
          action: result.added ? 'added' : 'removed'
        });
        console.log(`Product ${result.added ? 'added to' : 'removed from'} wishlist`);
      }
    } catch (error) {
      const appError = ErrorHandler.normalizeError(error, {
        component: 'RecommendationsSection',
        action: 'TOGGLE_WISHLIST',
        userId: user.id,
        timestamp: new Date().toISOString()
      });
      appError.log();
      console.error('Failed to update wishlist:', appError.message);
    }
  };

  return (
    <section ref={sectionRef} className={`${LAYOUT_CONSTANTS.SECTION_PADDING} overflow-hidden`}>
      <div className={`${LAYOUT_CONSTANTS.CONTAINER_MAX_WIDTH} mx-auto ${LAYOUT_CONSTANTS.CONTAINER_PADDING}`}>
        <div className="flex flex-col lg:flex-row items-center justify-center">
          {/* Hero Image - Left Side */}
          <div className="relative group cursor-pointer overflow-hidden flex-shrink-0 w-full lg:w-1/2">
            <Link href="/shop/women/shoes" className="block">
              <div className="relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4]">
                <img
                  src={newSeasonProducts.hero.image}
                  alt="Trending Now"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-500" />
              </div>
              
              <div className="absolute top-4 left-4 text-black">
                <h2 className={`${LAYOUT_CONSTANTS.SECTION_TITLE} font-bold tracking-tight mb-2 font-futura`}>TRENDING NOW</h2>
                <div className="flex items-center space-x-2 group/shop hover:space-x-3 transition-all duration-300">
                  <span className="text-sm border-b border-black">SHOP HERE</span>
                  <ArrowRight className="w-4 h-4 group-hover/shop:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          </div>

          {/* Product Grid - Right Side */}
          <div className="grid grid-cols-2 grid-rows-2 w-full lg:w-1/2">
            {/* Row 1, Column 1 - img1 */}
            <ProductGridItem 
              product={newSeasonProducts.grid[0]} 
              onAddToCart={handleAddToCart}
              onLike={handleLike}
            />

            {/* Row 1, Column 2 - img2 */}
            <ProductGridItem 
              product={newSeasonProducts.grid[1]} 
              onAddToCart={handleAddToCart}
              onLike={handleLike}
            />

            {/* Row 2, Column 1 - img3 */}
            <ProductGridItem 
              product={newSeasonProducts.grid[2]} 
              onAddToCart={handleAddToCart}
              onLike={handleLike}
            />

            {/* Row 2, Column 2 - img4 */}
            <ProductGridItem 
              product={newSeasonProducts.grid[3]} 
              onAddToCart={handleAddToCart}
              onLike={handleLike}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface ProductGridItemProps {
  product: any;
  onAddToCart: (e: React.MouseEvent, product: any) => void;
  onLike: (e: React.MouseEvent, product: any) => void;
}

function ProductGridItem({ product, onAddToCart, onLike }: ProductGridItemProps) {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group cursor-pointer transition-all duration-300 relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/shop/${product.id}`} className="block h-full">
        <div className={cn(
          "relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] overflow-hidden transition-all duration-300 h-full",
          isHovered ? "border-2 border-black" : "border-2 border-transparent"
        )}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {product.isNew && (
            <div className="absolute bottom-2 right-2">
              <span className="text-white text-xs px-2 py-1 font-medium transform rotate-[260deg]">
                New In
              </span>
            </div>
          )}
        </div>

        <div className={cn(
          "absolute left-0 right-0 bottom-0 transition-all duration-300 z-10 bg-white",
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
        )}>
          <div className="p-2 border-2 border-black border-t-0">
            {product.colors && product.colors.length > 0 && (
              <div className="flex space-x-2 mb-2 justify-center">
                {product.colors.map((color: string, index: number) => (
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

            <div className="flex space-x-1 mb-2 justify-center">
              {['35', '36', '37', '38', '39', '40', '41'].map((size, index) => (
                <button
                  key={size}
                  className={cn(
                    "w-8 h-8 text-xs font-medium border transition-all flex items-center justify-center",
                    size === '38' 
                      ? "border-black bg-black text-white" 
                      : ['36', '39', '40', '41'].includes(size)
                      ? "border-gray-300 bg-gray-100 text-gray-400"
                      : "border-gray-300 hover:border-gray-400"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
       
            <button
              onClick={(e) => onAddToCart(e, product)}
              className="w-full bg-gray-800 text-white text-xs py-2 px-3 font-medium hover:bg-gray-900 text-center transition-colors"
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}