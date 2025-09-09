'use client';

import { Suspense, lazy } from 'react';
import { CartProvider } from '@/contexts/CartContext';
import { SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext';
import { TranslationProvider } from '@/components/providers/TranslationProvider';
import { ChunkErrorBoundary } from '@/components/common/ChunkErrorBoundary';
import { useChunkErrorRetry } from '@/hooks/useChunkErrorRetry';

// Lazy load heavy components to prevent chunk loading issues
const LazyToaster = lazy(() => import('sonner').then(module => ({ default: module.Toaster })));

function ProvidersContent({ children }: { children: React.ReactNode }) {
  // Use the chunk error retry hook
  useChunkErrorRetry();

  return (
    <TranslationProvider>
      <SupabaseAuthProvider>
        <CartProvider>
          {children}
          <Suspense fallback={null}>
            <LazyToaster 
              position="top-right" 
              richColors 
              closeButton
              duration={4000}
            />
          </Suspense>
        </CartProvider>
      </SupabaseAuthProvider>
    </TranslationProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChunkErrorBoundary>
      <ProvidersContent>
        {children}
      </ProvidersContent>
    </ChunkErrorBoundary>
  );
}
 