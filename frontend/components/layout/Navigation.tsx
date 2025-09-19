'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Menu, X, User, Search, Heart, ShoppingBag, Bell } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LinkHover, TextHover } from '@/animation';
import CartDrawer from '@/components/cart/CartDrawer';
import MegaMenu from '@/components/layout/MegaMenu';
import SearchModal from '@/components/search/SearchModal';
import UserProfileDropdown from '@/components/auth/UserProfileDropdown';
import LanguageToggle from '@/components/common/LanguageToggle';
import ShopSidebar from '@/components/layout/ShopSidebar';
import AnimatedPromoBar from '@/components/layout/AnimatedPromoBar';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

// GSAP removed - using CSS animations instead

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

  // CSS-based animations instead of GSAP
  const navClasses = cn(
    "fixed top-0 left-0 right-0 z-40 transition-all duration-400",
    isScrolled 
      ? "bg-white/98 backdrop-blur-md" 
      : isHomePage 
        ? "bg-transparent" 
        : "bg-white/98 backdrop-blur-md"
  );

  const logoClasses = cn(
    "nav-text font-light tracking-wider transition-all duration-400",
    isScrolled || !isHomePage ? "opacity-100" : "opacity-0"
  );

  const textColor = isScrolled || !isHomePage ? "#000000" : "#ffffff";
  const iconColor = isScrolled || !isHomePage ? "#000000" : "#ffffff";

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
        className={navClasses}
        style={{
          height: '50px',
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
                style={{ color: iconColor }}
                data-cursor-hover
              >
                <Search className="w-4 h-4" />
              </button>
              
              {menuItems.map((item) => (
                <div key={item.name} className="relative group">
                  {item.type === 'sidebar' ? (
                    <button
                      onClick={() => setIsSidebarOpen(true)}
                      className="nav-text text-sm font-light transition-all duration-300 tracking-wide relative hover:opacity-80"
                      style={{ color: textColor }}
                      data-cursor-hover
                    >
                      {item.name}
                    </button>
                  ) : (
                    <div className="relative">
                      <Link
                        href={item.href}
                        className="nav-text text-sm font-light transition-all duration-300 tracking-wide relative hover:opacity-80"
                        style={{ color: textColor }}
                        data-cursor-hover
                      >
                        <TextHover
                          titile1={item.name}
                          titile2={item.name}
                        />
                      </Link>
                      {pathname === item.href && (
                        <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-current" />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Center Logo - Only shows when scrolled */}
            <div className="flex-shrink-0">
              <div 
                ref={logoRef}
                className={logoClasses}
                style={{ 
                  color: textColor,
                  fontSize: '0.875rem',
                }}
              >
                <Link
                  href="/"
                  className="nav-text font-light tracking-wider transition-all duration-400"
                  style={{ 
                    color: textColor,
                    fontSize: '0.875rem',
                  }}
                  data-cursor-hover
                >
                  <TextHover
                    titile1="FEM & FIT"
                    titile2="FEM & FIT"
                  />
                </Link>
              </div>
            </div>

            {/* Right Side Icons */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Notification Bell */}
              <button 
                className="nav-icon p-2 transition-colors duration-300 relative" 
                style={{ color: iconColor }}
                data-cursor-hover
              >
                <Bell className="w-4 h-4" />
              </button>
              
              {/* Heart/Wishlist */}
              <button 
                className="nav-icon p-2 transition-colors duration-300" 
                style={{ color: iconColor }}
                data-cursor-hover
              >
                <Heart className="w-4 h-4" />
              </button>
              
              {/* Shopping Bag/Cart */}
              <button 
                className="nav-icon p-2 transition-colors duration-300" 
                style={{ color: iconColor }}
                data-cursor-hover
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
              
              {/* User Profile */}
              <div className="nav-icon transition-colors duration-300" style={{ color: iconColor }}>
                <UserProfileDropdown />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-4 lg:hidden">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="nav-icon p-2 transition-colors duration-300"
                style={{ color: iconColor }}
              >
                <Search className="w-5 h-5" />
              </button>
              <button 
                className="nav-icon p-2 transition-colors duration-300"
                style={{ color: iconColor }}
              >
                <ShoppingBag className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="nav-icon p-2 transition-colors duration-300"
                style={{ color: iconColor }}
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
                <TextHover
                  titile1={item.name}
                  titile2={item.name}
                />
              </Link>
            )
          ))}
          {/* Components Showcase - Development Link */}
          <Link
            href="/components-showcase"
            className="menu-item text-lg font-medium hover:text-gray-600 transition-colors border-t pt-4"
            onClick={() => setIsMenuOpen(false)}
          >
            <TextHover
              titile1="Components Showcase"
              titile2="Components Showcase"
            />
          </Link>

          {user ? (
            <div className="menu-item text-center space-y-4">
              <Link
                href="/profile"
                className="block text-xl font-medium hover:text-gray-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <TextHover
                  titile1="Profile"
                  titile2="Profile"
                />
              </Link>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="menu-item p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <TextHover
                titile1="Sign In"
                titile2="Sign In"
              />
            </Link>
          )}
        </div>
      </div>

      {/* Large Logo Below Navbar - Only shows on home page when not scrolled */}
      {isHomePage && (
        <div className="fixed left-1/2 transform -translate-x-1/3 z-10 transition-all duration-400" style={{ top: isPromoBarVisible ? '130px' : '92px' }}>
          <Link
            href="/"
            className={cn(
              "text-white font-futura-bold tracking-wider transition-all duration-400",
              isScrolled ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"
            )}
            style={{ 
              fontSize: '1.8rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            <TextHover
              titile1="FEM & FIT"
              titile2="FEM & FIT"
            />
          </Link>
        </div>
      )}
      
      {/* Mobile Bottom Navigation - Removed for now */}
      
      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      {/* Animated Sidebar */}
      <ShopSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <CartDrawer />
    </>
  );
});

export default Navigation;