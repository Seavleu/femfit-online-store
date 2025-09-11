'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
import { initSmoothScrolling } from '@/lib/smoothScroll';
import { LAYOUT_CONSTANTS } from '@/lib/layout';
import { animation } from '@/motion';
import ScrollAnimation from '@/components/ui/ScrollAnimation';
import Curve from '@/components/Curve/Curve';
import Marquee from '@/components/Marquee';

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
    
    // Initialize Locomotive Scroll
    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      const locomotiveScroll = new LocomotiveScroll();
    })();
    
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

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1]
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  return (
    <Curve backgroundColor="#ffffff">
      {/* Hero Section */}
      <div className="relative">
        <HeroSection isScrolled={isScrolled} />
        
        {/* Marquee Section - Overlapping Hero */}
        {/* <div className="absolute bottom-0 left-0 w-full bg-black z-20 rounded-t-[20px] py-8 -mb-8">
          <Marquee
            title="new products arrival"
            className="pb-[50px] lg:pb-[40px] md:pb-[30px] sm:pb-[20px] text-[540px] leading-[330px] lg:text-[380px] lg:leading-[240px] md:text-[300px] md:leading-[160px] sm:text-[230px] sm:leading-[140px] xm:text-[130px] xm:leading-[80px]"
          />
        </div> */}
      </div>
      
      {/* Scroll-Triggered Animated Sections */}
      <ScrollAnimation direction="up" delay={0.1}>
        <BrandLogos />
      </ScrollAnimation>
      
      <ScrollAnimation direction="up" delay={0.2}>
        <AutoScrollingProducts/>
      </ScrollAnimation>
      
      <ScrollAnimation direction="up" delay={0.3}>
        <RecommendationsSection />
      </ScrollAnimation>
      
        
      <div className="space-y-2.5">
        <ScrollAnimation direction="up" delay={0.4}>
          <SpotlightSection />
        </ScrollAnimation>
        
        {/* Bestseller: Bags Section */}
        <ScrollAnimation direction="up" delay={0.5}>
          <BestsellerSection 
            title="Bestseller: Bags" 
            products={bestsellerBags}
            onAddToCart={handleAddToCart}
          />
        </ScrollAnimation>
        
        {/* Bestseller: Shoes Section */}
        <ScrollAnimation direction="up" delay={0.6}>
          <BestsellerSection 
            title="Bestseller: Shoes" 
            products={bestsellerShoes}
            onAddToCart={handleAddToCart}
          />
        </ScrollAnimation>
        
        {/* <CategoryShowcase /> */}
      </div>
    </Curve>
  );
}