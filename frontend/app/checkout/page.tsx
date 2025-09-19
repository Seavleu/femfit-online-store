'use client';

import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CheckoutFlow from '@/components/checkout/CheckoutFlow';
import { toast } from 'sonner';
import { LoadingState, EmptyState } from '@/components/design-system';
import { ShoppingCart } from 'lucide-react';

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
    return <LoadingState text="Loading checkout..." fullScreen />;
  }

  if (!user) {
    return (
      <EmptyState
        icon={<ShoppingCart className="w-16 h-16 text-gray-400" />}
        title="Please Sign In"
        description="You need to sign in to proceed with checkout"
        action={{
          label: 'Sign In',
          onClick: () => router.push('/auth/signin')
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CheckoutFlow onComplete={handleOrderComplete} />
    </div>
  );
}