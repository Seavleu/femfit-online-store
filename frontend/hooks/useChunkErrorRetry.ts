'use client';

import { useEffect } from 'react';

export function useChunkErrorRetry() {
  useEffect(() => {
    const handleChunkError = (event: ErrorEvent) => {
      const error = event.error;
      
      // Check if it's a chunk loading error
      if (
        error?.message?.includes('Loading chunk') ||
        error?.message?.includes('Loading CSS chunk') ||
        error?.name === 'ChunkLoadError' ||
        error?.message?.includes('ChunkLoadError')
      ) {
        console.warn('Chunk loading error detected, attempting to reload...');
        
        // Add a small delay to prevent rapid reloads
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      
      // Check if it's a chunk loading error in a promise rejection
      if (
        reason?.message?.includes('Loading chunk') ||
        reason?.message?.includes('Loading CSS chunk') ||
        reason?.name === 'ChunkLoadError' ||
        reason?.message?.includes('ChunkLoadError')
      ) {
        console.warn('Chunk loading error in promise rejection, attempting to reload...');
        
        // Prevent the default unhandled rejection behavior
        event.preventDefault();
        
        // Add a small delay to prevent rapid reloads
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    };

    // Listen for chunk loading errors
    window.addEventListener('error', handleChunkError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleChunkError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
}
