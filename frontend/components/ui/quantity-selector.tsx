'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  step = 1,
  size = 'md',
  className,
  disabled = false
}: QuantitySelectorProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const sizes = {
    sm: {
      button: 'w-8 h-8',
      text: 'text-sm w-12',
      container: 'text-sm'
    },
    md: {
      button: 'w-10 h-10',
      text: 'text-base w-16',
      container: 'text-base'
    },
    lg: {
      button: 'w-12 h-12',
      text: 'text-lg w-20',
      container: 'text-lg'
    }
  };

  const handleDecrease = () => {
    if (disabled || quantity <= min) return;
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 150);
    onQuantityChange(Math.max(min, quantity - step));
  };

  const handleIncrease = () => {
    if (disabled || quantity >= max) return;
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 150);
    onQuantityChange(Math.min(max, quantity + step));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || min;
    const clampedValue = Math.max(min, Math.min(max, value));
    onQuantityChange(clampedValue);
  };

  return (
    <div className={cn('flex items-center', className)}>
      <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
        <button
          onClick={handleDecrease}
          disabled={disabled || quantity <= min}
          className={cn(
            'flex items-center justify-center border-r border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
            sizes[size].button
          )}
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </button>
        
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          min={min}
          max={max}
          disabled={disabled}
          className={cn(
            'text-center font-semibold bg-transparent border-none outline-none disabled:cursor-not-allowed',
            sizes[size].text,
            isAnimating && 'animate-pulse'
          )}
          aria-label="Quantity"
        />
        
        <button
          onClick={handleIncrease}
          disabled={disabled || quantity >= max}
          className={cn(
            'flex items-center justify-center border-l border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
            sizes[size].button
          )}
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      {/* Stock indicator */}
      <div className={cn('ml-4 text-gray-600', sizes[size].container)}>
        <span className="font-medium">{max}</span> available
      </div>
    </div>
  );
}
