'use client';

import React from 'react';
import { Home, Search, Heart, User, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

export default function MobileBottomNav() {
  const { user } = useSupabaseAuth();
  const pathname = usePathname();
  const { state } = useCart();

  const navItems = [
    {
      name: 'Home',
      href: user?.role === 'shopper' ? '/dashboard' : 
            user?.role === 'admin' ? '/admin/dashboard' :
            '/',
      icon: Home,
      active: pathname === '/' || 
              (user?.role === 'shopper' && pathname === '/dashboard') ||
              (user?.role === 'admin' && pathname.startsWith('/admin'))
    },
    {
      name: 'Shop',
      href: '/shop',
      icon: ShoppingBag,
      active: pathname.startsWith('/shop')
    },
    {
      name: 'Cart',
      href: '/cart',
      icon: ShoppingBag,
      active: pathname === '/cart',
      badge: state.itemCount > 0 ? state.itemCount : undefined
    },
    {
      name: 'Wishlist',
      href: '/wishlist',
      icon: Heart,
      active: pathname === '/wishlist'
    },
    {
      name: user ? 'Profile' : 'Sign In',
      href: user ? '/profile' : '/auth/signin',
      icon: User,
      active: pathname.startsWith('/profile') || pathname.startsWith('/auth')
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 lg:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 transition-colors relative",
              item.active ? "text-luxury-gold" : "text-gray-500 hover:text-black"
            )}
          >
            <div className="relative">
              <item.icon className="w-5 h-5" />
              {item.badge && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-luxury-gold text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            <span className="text-xs font-medium">{item.name}</span>
            {item.active && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-luxury-gold rounded-full" />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}