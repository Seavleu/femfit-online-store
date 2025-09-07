'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Menu, X, User, Search, Heart, ShoppingBag, Bell } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CartDrawer from '@/components/cart/CartDrawer';
import MegaMenu from '@/components/layout/MegaMenu';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import SearchModal from '@/components/search/SearchModal';
import UserProfileDropdown from '@/components/auth/UserProfileDropdown';
import LanguageToggle from '@/components/common/LanguageToggle';
import ShopSidebar from '@/components/layout/ShopSidebar';
import AnimatedPromoBar from '@/components/layout/AnimatedPromoBar';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Navigation = React.memo(function Navigation() {
  const { user } = useSupabaseAuth();
  const { t } = useTranslation();
  
  // Memoize navigation items to prevent unnecessary re-renders
  const navigationItems = useMemo(() => [
    { href: '/', label: t('nav.home') },
    { href: '/shop', label: t('nav.shop') },
    { href: '/about', label: t('nav.about') },
    { href: '/contact', label: t('nav.contact') },
  ], [t]);
  
  // Memoize user menu items
  const userMenuItems = useMemo(() => {
    if (!user) return [];
    
    return [
      { href: '/dashboard', label: t('nav.dashboard') },
      { href: '/profile', label: t('nav.profile') },
      { href: '/orders', label: t('nav.orders') },
      { href: '/wishlist', label: t('nav.wishlist') },
    ];
  }, [user, t]);
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPromoBarVisible, setIsPromoBarVisible] = useState(true);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  
  // Check if we're on the home page
  const isHomePage = pathname === '/';

  // Check if promo bar is closed on mount
  useEffect(() => {
    const isPromoBarClosed = localStorage.getItem('promoBarClosed');
    if (isPromoBarClosed === 'true') {
      setIsPromoBarVisible(false);
    }
  }, []);

  // Listen for promo bar close event
  useEffect(() => {
    const handlePromoBarClose = () => {
      setIsPromoBarVisible(false);
    };

    window.addEventListener('promoBarClosed', handlePromoBarClose);
    return () => window.removeEventListener('promoBarClosed', handlePromoBarClose);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const shouldBeScrolled = scrollY > 50;
      
      if (shouldBeScrolled !== isScrolled) {
        setIsScrolled(shouldBeScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  useEffect(() => {
    if (navRef.current && logoRef.current) {
      if (isScrolled) {
        // Scrolled state - compact navbar with logo visible in center
        gsap.to(navRef.current, {
          height: '50px',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(10px)',
          duration: 0.4,
          ease: 'power2.out'
        });
        
        // Show logo in navbar center - same size as menu items
        gsap.to(logoRef.current, {
          opacity: 1,
          fontSize: '0.875rem',
          fontWeight: '500',
          duration: 0.4,
          ease: 'power2.out'
        });

        // Change text colors to dark
        gsap.to('.nav-text', {
          color: '#000000',
          duration: 0.4,
          ease: 'power2.out'
        });

        gsap.to('.nav-icon', {
          color: '#000000',
          duration: 0.4,
          ease: 'power2.out'
        });
      } else {
        // Initial state - behavior depends on page
        if (isHomePage) {
          // Home page - transparent navbar with large logo below
          gsap.to(navRef.current, {
            height: '50px',
            backgroundColor: 'transparent',
            backdropFilter: 'none',
            duration: 0.4,
            ease: 'power2.out'
          });
          
          // Hide logo in navbar (it will be shown large below navbar)
          gsap.to(logoRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.out'
          });

          // Change text colors to white
          gsap.to('.nav-text', {
            color: '#ffffff',
            duration: 0.4,
            ease: 'power2.out'
          });

          gsap.to('.nav-icon', {
            color: '#ffffff',
            duration: 0.4,
            ease: 'power2.out'
          });
        } else {
          // Other pages - always show logo in center
          gsap.to(navRef.current, {
            height: '50px',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(10px)',
            duration: 0.4,
            ease: 'power2.out'
          });
          
          // Show logo in navbar center
          gsap.to(logoRef.current, {
            opacity: 1,
            fontSize: '0.875rem',
            fontWeight: '500',
            duration: 0.4,
            ease: 'power2.out'
          });

          // Change text colors to dark
          gsap.to('.nav-text', {
            color: '#000000',
            duration: 0.4,
            ease: 'power2.out'
          });

          gsap.to('.nav-icon', {
            color: '#000000',
            duration: 0.4,
            ease: 'power2.out'
          });
        }
      }
    }
  }, [isScrolled, isHomePage, isPromoBarVisible]);

  const menuItems = [
    { name: 'GO SHOPPING', type: 'sidebar' },
    { name: 'NEW PRODUCTS', href: '/shop?tags=New', type: 'link' }
  ];

  return (
    <>
      {/* Animated Promo Messages Bar */}
      <AnimatedPromoBar />

      <nav 
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-400"
        style={{
          height: '50px',
          backgroundColor: 'transparent',
          marginTop: isPromoBarVisible ? '38px' : '0px' // Account for the promo bar height
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Left Side Items */}
            <div className="hidden lg:flex items-center space-x-6">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="nav-icon p-2 transition-colors duration-300"
                style={{ color: '#ffffff' }}
              >
                <Search className="w-4 h-4" />
              </button>
              
              {menuItems.map((item) => (
                <div key={item.name} className="relative group">
                  {item.type === 'sidebar' ? (
                    <button
                      onClick={() => setIsSidebarOpen(true)}
                      className="nav-text text-sm font-light transition-all duration-300 tracking-wide relative hover:opacity-80"
                      style={{ color: '#ffffff' }}
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="nav-text text-sm font-light transition-all duration-300 tracking-wide relative hover:opacity-80"
                      style={{ color: '#ffffff' }}
                    >
                      {item.name}
                      {pathname === item.href && (
                        <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-current" />
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </div>
            
            {/* Center Logo - Only shows when scrolled */}
            <div className="flex-shrink-0">
              <Link href="/">
                <div 
                  ref={logoRef}
                  className="nav-text font-light tracking-wider transition-all duration-400 opacity-0"
                  style={{ 
                    color: '#ffffff',
                    fontSize: '0.875rem',
                  }}
                >
                  FEM & FIT
                </div>
              </Link>
            </div>

            {/* Right Side Icons */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Notification Bell */}
              <button className="nav-icon p-2 transition-colors duration-300 relative">
                <Bell className="w-4 h-4" />
              </button>
              
              {/* Heart/Wishlist */}
              <button className="nav-icon p-2 transition-colors duration-300">
                <Heart className="w-4 h-4" />
              </button>
              
              {/* Shopping Bag/Cart */}
              <button className="nav-icon p-2 transition-colors duration-300">
                <ShoppingBag className="w-4 h-4" />
              </button>
              
              {/* User Profile */}
              <div className="nav-icon transition-colors duration-300">
                <UserProfileDropdown />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-4 lg:hidden">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="nav-icon p-2 transition-colors duration-300"
              >
                <Search className="w-5 h-5" />
              </button>
              <button className="nav-icon p-2 transition-colors duration-300">
                <ShoppingBag className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="nav-icon p-2 transition-colors duration-300"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={cn(
        "fixed inset-0 z-30 bg-white transform transition-transform duration-500 lg:hidden",
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col items-center justify-center h-full space-y-8 pt-16">
          {menuItems.map((item, index) => (
            item.type === 'sidebar' ? (
              <button
                key={item.name}
                onClick={() => {
                  setIsSidebarOpen(true);
                  setIsMenuOpen(false);
                }}
                className="menu-item text-2xl font-bold tracking-wide hover:text-gray-600 transition-colors"
              >
                {item.name}
              </button>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className="menu-item text-2xl font-bold tracking-wide hover:text-gray-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            )
          ))}
          {user ? (
            <div className="menu-item text-center space-y-4">
              <Link
                href="/profile"
                className="block text-xl font-medium hover:text-gray-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="menu-item p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="w-6 h-6" />
            </Link>
          )}
        </div>
      </div>

      {/* Large Logo Below Navbar - Only shows on home page when not scrolled */}
      {isHomePage && (
        <div className="fixed left-1/2 transform -translate-x-1/3 z-10 transition-all duration-400" style={{ top: isPromoBarVisible ? '130px' : '92px' }}>
          <Link href="/">
            <div 
              className={cn(
                "text-white font-futura-bold tracking-wider transition-all duration-400",
                isScrolled ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"
              )}
              style={{ 
                fontSize: '1.8rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              FEM & FIT
            </div>
          </Link>
        </div>
      )}
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
      
      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      {/* Animated Sidebar */}
      <ShopSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <CartDrawer />
    </>
  );
});

export default Navigation;