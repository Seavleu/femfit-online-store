'use client';

import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CheckoutFlow from '@/components/checkout/CheckoutFlow';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const { user, session, loading } = useSupabaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      toast.error('Please sign in to checkout');
      router.push('/auth/signin');
      return;
    }
  }, [loading, user, router]);

  const handleOrderComplete = (orderId: string) => {
    console.log('Order completed:', orderId);
    // Additional order completion logic can be added here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CheckoutFlow onComplete={handleOrderComplete} />
    </div>
  );
}