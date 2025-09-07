'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  image: string;
}

interface CategoryNavigationProps {
  categories: Category[];
  onCategorySelect: (categoryId: string | null) => void;
  selectedCategory: string | null;
}

export default function CategoryNavigation({ 
  categories, 
  onCategorySelect, 
  selectedCategory 
}: CategoryNavigationProps) {
  return (
    <div className="mb-12">
      {/* Category Images */}
     

      {/* Category Tags */}
      <div className="flex flex-wrap justify-center gap-3 text-sm">
        <button
          onClick={() => onCategorySelect(null)}
          className={cn(
            "px-4 py-2 transition-colors",
            !selectedCategory
              ? "text-black border-b-2 border-black font-medium"
              : "text-gray-500 hover:text-black"
          )}
        >
          all
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={cn(
              "px-4 py-2 transition-colors",
              selectedCategory === category.id
                ? "text-black border-b-2 border-black font-medium"
                : "text-gray-500 hover:text-black"
            )}
          >
            {category.name.toLowerCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
