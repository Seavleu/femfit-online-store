'use client';

import { ReactNode, useEffect, useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import PromotionalPopup from '@/components/ui/PromotionalPopup';
import BrandReveal from '@/components/ui/BrandReveal';
import { initSmoothScrolling } from '@/lib/smoothScroll';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    initSmoothScrolling();
  }, []);

  const handleBrandRevealComplete = () => {
    setShowContent(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <BrandReveal onComplete={handleBrandRevealComplete} />
      
      {showContent && (
        <>
          <Navigation />
          <main>
            {children}
          </main>
          <Footer />
          <PromotionalPopup />
        </>
      )}
    </div>
  );
}