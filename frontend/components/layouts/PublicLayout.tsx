'use client';

import { ReactNode, useEffect, useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import PromotionalPopup from '@/components/ui/PromotionalPopup';
import HorizontalScrollSection from '@/components/sections/HorizontalScrollSection';
import { initSmoothScrolling } from '@/lib/smoothScroll';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [showMainWebsite, setShowMainWebsite] = useState(false);

  useEffect(() => {
    initSmoothScrolling();
    
    // Listen for the custom event to show main website
    const handleShowMainWebsite = () => {
      setShowMainWebsite(true);
    };

    window.addEventListener('showMainWebsite', handleShowMainWebsite);
    
    return () => {
      window.removeEventListener('showMainWebsite', handleShowMainWebsite);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Horizontal Scroll Section - shown initially */}
      {!showMainWebsite && <HorizontalScrollSection />}
      
      {/* Main Website - hidden initially */}
      <div id="main-website" style={{ display: showMainWebsite ? 'block' : 'none' }}>
        <Navigation />
        <main>
          {children}
        </main>
        <Footer />
        <PromotionalPopup />
      </div>
    </div>
  );
}