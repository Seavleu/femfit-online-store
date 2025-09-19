'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  actions?: ReactNode;
  className?: string;
  showBackButton?: boolean;
  backHref?: string;
}

export default function PageHeader({
  title,
  subtitle,
  description,
  breadcrumbs,
  actions,
  className,
  showBackButton = false,
  backHref = '/'
}: PageHeaderProps) {
  return (
    <div className={cn("bg-white border-b border-gray-200", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-2 py-4 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700 transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span>/</span>
                {crumb.href ? (
                  <Link 
                    href={crumb.href} 
                    className="hover:text-gray-700 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-900 font-medium">{crumb.label}</span>
                )}
              </div>
            ))}
          </nav>
        )}

        {/* Header Content */}
        <div className="py-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {/* Back Button */}
              {showBackButton && (
                <div className="mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Link href={backHref}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Link>
                  </Button>
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                {title}
              </h1>

              {/* Subtitle */}
              {subtitle && (
                <p className="mt-2 text-lg text-gray-600">
                  {subtitle}
                </p>
              )}

              {/* Description */}
              {description && (
                <p className="mt-3 text-base text-gray-500 max-w-3xl">
                  {description}
                </p>
              )}
            </div>

            {/* Actions */}
            {actions && (
              <div className="ml-6 flex-shrink-0">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
