'use client';

import { useState, useRef, useEffect } from 'react';
import { User, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import SignOutButton from './SignOutButton';
import { cn } from '@/lib/utils';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

export default function UserProfileDropdown() {
  const { user, session } = useSupabaseAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!session || !user) {
    return (
      <Link
        href="/auth/signin"
        className="text-sm font-light hover:text-luxury-gold transition-colors duration-300 tracking-wide"
      >
        Sign In
      </Link>
    );
  }

  // Default role to 'shopper' for now - you can extend this based on your user metadata
  const role: string = 'shopper';

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'shopper':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProfileLink = () => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'shopper':
        return '/dashboard';
      default:
        return '/profile';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-sm font-light hover:text-luxury-gold transition-colors nav-icon"
      >
          <User className="w-4 h-4" />
        <ChevronDown className={cn(
          "w-3 h-3 transition-transform duration-200",
          isOpen ? "rotate-180" : ""
        )} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                 <p className="font-medium text-gray-900 truncate">{user?.user_metadata?.full_name || 'User'}</p>
                 <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                <span className={cn(
                  "inline-block px-2 py-1 text-xs font-medium rounded-full mt-1",
                  getRoleBadgeColor(role)
                )}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              href={getProfileLink()}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Profile Settings
            </Link>
            <Link
              href="/orders"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              My Orders
            </Link>
            <Link
              href="/wishlist"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Wishlist
            </Link>
          </div>

          {/* Sign Out */}
          <div className="border-t border-gray-100 py-1">
            <SignOutButton />
          </div>
        </div>
      )}
    </div>
  );
}