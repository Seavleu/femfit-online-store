'use client';

import { ReactNode, useEffect } from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import AnimatedBrandSection from '@/components/sections/AnimatedBrandSection';
import PromotionalPopup from '@/components/ui/PromotionalPopup';
import { initSmoothScrolling } from '@/lib/smoothScroll';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  useEffect(() => {
    initSmoothScrolling();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        {children}
      </main>
      <Footer />
      <AnimatedBrandSection />
      <PromotionalPopup />
    </div>
  );
}