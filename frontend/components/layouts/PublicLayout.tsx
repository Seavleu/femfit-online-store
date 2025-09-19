'use client';

import { ReactNode, useEffect } from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import PromotionalPopup from '@/components/ui/PromotionalPopup';
import CustomCursor from '@/components/ui/CustomCursor';
// Smooth scrolling removed - using CSS instead

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  // Smooth scrolling handled by CSS

  return (
    <div className="min-h-screen bg-white">
      <CustomCursor />
      <Navigation />
      <main>
        {children}
      </main>
      <Footer />
      <PromotionalPopup />
    </div>
  );
}