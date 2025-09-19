'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled' | 'processing' | 'shipped' | 'delivered' | 'returned' | 'refunded';
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function StatusBadge({ 
  status, 
  variant = 'default', 
  size = 'md',
  className 
}: StatusBadgeProps) {
  const statusConfig = {
    active: {
      label: 'Active',
      className: 'bg-green-100 text-green-800 border-green-200'
    },
    inactive: {
      label: 'Inactive',
      className: 'bg-gray-100 text-gray-800 border-gray-200'
    },
    pending: {
      label: 'Pending',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    completed: {
      label: 'Completed',
      className: 'bg-green-100 text-green-800 border-green-200'
    },
    cancelled: {
      label: 'Cancelled',
      className: 'bg-red-100 text-red-800 border-red-200'
    },
    processing: {
      label: 'Processing',
      className: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    shipped: {
      label: 'Shipped',
      className: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    delivered: {
      label: 'Delivered',
      className: 'bg-green-100 text-green-800 border-green-200'
    },
    returned: {
      label: 'Returned',
      className: 'bg-orange-100 text-orange-800 border-orange-200'
    },
    refunded: {
      label: 'Refunded',
      className: 'bg-gray-100 text-gray-800 border-gray-200'
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2.5 py-1.5',
    lg: 'text-base px-3 py-2'
  };

  const config = statusConfig[status];

  return (
    <Badge
      variant={variant}
      className={cn(
        config.className,
        sizeClasses[size],
        'font-medium',
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
