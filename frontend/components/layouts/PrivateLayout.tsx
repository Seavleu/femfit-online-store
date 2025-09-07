'use client';

import { ReactNode, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

interface PrivateLayoutProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'user' | 'seller';
}

export default function PrivateLayout({ children, requiredRole }: PrivateLayoutProps) {
  const { user, session, loading } = useSupabaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Still loading

    if (!user) {
      router.push('/auth/signin');
      return;
    }

    // Check role-based access
    if (requiredRole && user.role !== requiredRole) {
      // Redirect to appropriate dashboard based on user role
      switch (user.role) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'seller':
          router.push('/b2b');
          break;
        case 'user':
          router.push('/user/home');
          break;
        default:
          router.push('/auth/signin');
      }
      return;
    }
  }, [user, loading, router, requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
}