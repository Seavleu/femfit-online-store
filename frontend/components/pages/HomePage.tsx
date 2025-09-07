'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/components/layout/HeroSection';
import BrandLogos from '@/components/sections/BrandLogos';
import RecommendationsSection from '@/components/sections/RecommendationsSection';
import AutoScrollingProducts from '@/components/sections/AutoScrollingProducts';
import DiscountSection from '@/components/sections/DiscountSection';
import CategoryShowcase from '@/components/sections/CategoryShowcase';
import StorySection from '@/components/sections/StorySection';
import BentoGrid from '@/components/sections/BentoGrid';
import NewsletterSection from '@/components/sections/NewsletterSection';
import CategoryGrid from '@/components/sections/FeaturedProducts';
import SpotlightSection from '@/components/sections/SpotlightSection';
import BestsellerSection from '@/components/sections/BestsellerSection';
import AnimatedBrandSection from '@/components/sections/AnimatedBrandSection';
import HorizontalScrollSection from '@/components/sections/HorizontalScrollSection';
import { initSmoothScrolling } from '@/lib/smoothScroll';
import { LAYOUT_CONSTANTS } from '@/lib/layout';

// Mock data for bestseller sections
const bestsellerBags = [
  {
    id: '1',
    name: 'Color Tote Bag - Espresso Brown',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=400&fit=crop&crop=center',
    href: '/shop/bags/tote',
    price: '$89.99',
    colors: ['brown', 'black'],
    isNew: true
  },
  {
    id: '2',
    name: 'Edna Recycled Suede Hobo Bag - Espresso Brown',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=400&fit=crop&crop=center',
    href: '/shop/bags/hobo',
    price: '$129.99',
    colors: ['brown', 'black'],
    isNew: false
  },
  {
    id: '3',
    name: 'Edna Tote Bag - Black',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=400&fit=crop&crop=center',
    href: '/shop/bags/tote',
    price: '$99.99',
    colors: ['black', 'brown'],
    isNew: true
  },
  {
    id: '4',
    name: 'Naan Elongated-Handle Shoulder Bag - Nair',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=400&fit=crop&crop=center',
    href: '/shop/bags/shoulder',
    price: '$149.99',
    colors: ['brown', 'black'],
    isNew: false
  },
  {
    id: '5',
    name: 'Laila Tubular Slouchy Tote - Brown',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=400&fit=crop&crop=center',
    href: '/shop/bags/tote',
    price: '$119.99',
    colors: ['brown', 'black'],
    isNew: true
  }
];

const bestsellerShoes = [
  {
    id: '1',
    name: 'Braided-Strap Back-Zip Knee-High Boots - Black',
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=300&h=400&fit=crop&crop=center',
    href: '/shop/shoes/boots',
    price: '$199.99',
    colors: ['black', 'brown'],
    isNew: true
  },
  {
    id: '2',
    name: 'Braided-Chain Black-Heel Mary Jane Pumps - Black',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=400&fit=crop&crop=center',
    href: '/shop/shoes/pumps',
    price: '$159.99',
    colors: ['black', 'brown'],
    isNew: false
  },
  {
    id: '3',
    name: 'Patent Leather Cut-out Painted-Toe Blade-Heel Pumps - Burgundy',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=400&fit=crop&crop=center',
    href: '/shop/shoes/pumps',
    price: '$179.99',
    colors: ['burgundy', 'black'],
    isNew: true
  },
  {
    id: '4',
    name: 'Circa Buckle Mid-Calf Biker Boots - Black',
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=300&h=400&fit=crop&crop=center',
    href: '/shop/shoes/boots',
    price: '$189.99',
    colors: ['black', 'brown'],
    isNew: false
  },
  {
    id: '5',
    name: 'Cody Leather Painted-Toe Kitten Heel - Black',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&h=400&fit=crop&crop=center',
    href: '/shop/shoes/heels',
    price: '$139.99',
    colors: ['black', 'brown'],
    isNew: true
  }
];

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    initSmoothScrolling();
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = (product: any) => {
    console.log('Added to cart:', product);
    // Add to cart logic here
  };

  return (
    <div className="bg-white text-black overflow-x-hidden">
      
      
      {/* Hero Section */}
      <HeroSection isScrolled={isScrolled} />
      
      {/* Horizontal Scroll Section */}
      <HorizontalScrollSection />

      <BrandLogos />
      <AutoScrollingProducts/>
      <RecommendationsSection />
        
      <div className="space-y-2.5">
        <SpotlightSection />
        
        {/* Bestseller: Bags Section */}
        <BestsellerSection 
          title="Bestseller: Bags" 
          products={bestsellerBags}
          onAddToCart={handleAddToCart}
        />
        
        {/* Bestseller: Shoes Section */}
        <BestsellerSection 
          title="Bestseller: Shoes" 
          products={bestsellerShoes}
          onAddToCart={handleAddToCart}
        />
        
        {/* <CategoryShowcase /> */}
      </div>
    </div>
  );
}