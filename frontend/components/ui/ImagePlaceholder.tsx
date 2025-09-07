'use client';

import { cn } from '@/lib/utils';

interface ImagePlaceholderProps {
  width?: number;
  height?: number;
  className?: string;
  children?: React.ReactNode;
  gradient?: string;
}

export default function ImagePlaceholder({ 
  width = 400, 
  height = 400, 
  className,
  children,
  gradient = "from-gray-200 to-gray-300"
}: ImagePlaceholderProps) {
  return (
    <div 
      className={cn(
        "flex items-center justify-center bg-gradient-to-br",
        gradient,
        className
      )}
      style={{ width, height }}
    >
      {children || (
        <div className="text-gray-500 text-center">
          <div className="text-2xl mb-2">📸</div>
          <div className="text-sm">Image Placeholder</div>
        </div>
      )}
    </div>
  );
}
