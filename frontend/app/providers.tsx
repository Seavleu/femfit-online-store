'use client';

import { CartProvider } from '@/contexts/CartContext';
import { SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext';
import { TranslationProvider } from '@/components/providers/TranslationProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TranslationProvider>
      <SupabaseAuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </SupabaseAuthProvider>
    </TranslationProvider>
  );
}
 