'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FormCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export default function FormCard({
  children,
  title,
  subtitle,
  description,
  className,
  padding = 'md'
}: FormCardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div
      className={cn(
        'bg-white border border-gray-200 rounded-lg shadow-sm',
        paddingClasses[padding],
        className
      )}
    >
      {/* Header */}
      {(title || subtitle || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-xl font-semibold text-gray-900">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600">
              {subtitle}
            </p>
          )}
          {description && (
            <p className="mt-2 text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Form Content */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}
