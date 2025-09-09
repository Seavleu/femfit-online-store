'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Eye, ShoppingCart } from 'lucide-react';
import AnimatedButton from '@/components/AnimatedButton';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const products = [
  {
    id: 1,
    name: 'Signature Collection',
    price: '$2,850',
    image: 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg',
    description: 'Handcrafted excellence with premium materials'
  },
  {
    id: 2,
    name: 'Limited Edition',
    price: '$4,200',
    image: 'https://images.pexels.com/photos/2866077/pexels-photo-2866077.jpeg',
    description: 'Exclusive design for discerning collectors'
  },
  {
    id: 3,
    name: 'Heritage Series',
    price: '$3,650',
    image: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg',
    description: 'Timeless appeal with modern sophistication'
  }
];

export default function ProductShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      // Staggered fade/slide-in animation
      gsap.fromTo(card,
        { y: 80, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          delay: index * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Enhanced hover animations
      const image = card.querySelector('.product-image');
      const quickActions = card.querySelector('.quick-actions');
      const addToCartBtn = card.querySelector('.add-to-cart-btn');
      
      if (image && quickActions && addToCartBtn) {
        card.addEventListener('mouseenter', () => {
          // Slow zoom on image
          gsap.to(image, { scale: 1.08, duration: 0.8, ease: 'power2.out' });
          // Fade in quick actions
          gsap.to(quickActions, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
          // Slide up add to cart button
          gsap.to(addToCartBtn, { y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: 'power2.out' });
        });

        card.addEventListener('mouseleave', () => {
          // Reset image scale
          gsap.to(image, { scale: 1, duration: 0.8, ease: 'power2.out' });
          // Fade out quick actions
          gsap.to(quickActions, { opacity: 0, y: 10, duration: 0.3, ease: 'power2.out' });
          // Hide add to cart button
          gsap.to(addToCartBtn, { y: 20, opacity: 0, duration: 0.3, ease: 'power2.out' });
        });
      }
    });
  }, []);

  return (
    <section ref={sectionRef} id="collections" className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-playfair font-bold tracking-tight mb-6 leading-[0.9]">
            Featured Collections
          </h2>
          <p className="body-text text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our curated selection of premium pieces, each representing 
            the pinnacle of luxury and sophistication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 md:overflow-x-auto md:snap-x md:snap-mandatory">
          {products.map((product, index) => (
            <div
              key={product.id}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="group cursor-pointer relative md:snap-start md:flex-shrink-0"
            >
              {/* Product Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-6 group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image w-full h-full object-cover"
                />
                
                {/* Quick Actions Overlay */}
                <div className="quick-actions absolute inset-0 bg-black/30 opacity-0 flex items-center justify-center translate-y-2">
                  <button className="bg-white/90 backdrop-blur-sm text-black px-6 py-3 font-medium hover:bg-luxury-gold hover:text-white transition-all duration-300 flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>Quick View</span>
                  </button>
                </div>
                
                {/* Floating Add to Cart Button */}
                <button className="add-to-cart-btn absolute bottom-4 right-4 bg-black text-white p-3 rounded-full opacity-0 translate-y-5 hover:bg-luxury-gold transition-all duration-300 shadow-lg">
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
              
              {/* Product Information */}
              <div className="space-y-3">
                <h3 className="text-xl font-space-grotesk font-semibold tracking-wide">{product.name}</h3>
                <p className="body-text text-gray-500 text-sm leading-relaxed tracking-wide font-light">
                  {product.description}
                </p>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-lg font-space-grotesk font-bold tracking-wider">{product.price}</p>
                  <AnimatedButton 
                    href={`/products/${product.id}`}
                    title="View Details"
                    variant="primary"
                    size="sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}