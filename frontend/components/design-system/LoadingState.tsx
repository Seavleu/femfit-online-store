'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullScreen?: boolean;
  children?: ReactNode;
}

export default function LoadingState({
  text = 'Loading...',
  size = 'md',
  className,
  fullScreen = false,
  children
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const containerClasses = fullScreen
    ? 'min-h-screen flex items-center justify-center'
    : 'flex items-center justify-center py-12';

  return (
    <div className={cn(containerClasses, className)}>
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className={cn(
          'border-2 border-gray-200 border-t-black rounded-full animate-spin',
          sizeClasses[size]
        )} />

        {/* Text */}
        {text && (
          <p className={cn(
            'text-gray-600 font-medium',
            textSizeClasses[size]
          )}>
            {text}
          </p>
        )}

        {/* Custom content */}
        {children}
      </div>
    </div>
  );
}
