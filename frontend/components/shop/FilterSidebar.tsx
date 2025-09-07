'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Star, TrendingUp, Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterSidebarProps {
  selectedFilters: {
    category: string[];
    priceRange: string;
    size: string[];
    tags: string[];
    rating?: number;
    availability?: string;
  };
  onFilterChange: (filterType: string, value: string | string[] | number) => void;
  onClearFilters: () => void;
}

type SortOption = 'newest' | 'price-low' | 'price-high' | 'popular' | 'name' | 'rating' | 'discount';

const filterOptions = {
  categories: ['Accessories', 'Clothing', 'Jewelry', 'Home', 'Bags', 'Shoes', 'Beauty'],
  priceRanges: [
    { value: 'under-500', label: 'Under $500' },
    { value: '500-1000', label: '$500 - $1,000' },
    { value: '1000-3000', label: '$1,000 - $3,000' },
    { value: '3000-5000', label: '$3,000 - $5,000' },
    { value: 'over-5000', label: 'Over $5,000' }
  ],
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'],
  tags: ['New', 'Popular', 'Limited Edition', 'Bestseller', 'Sustainable', 'Sale', 'Trending'],
  availability: ['In Stock', 'Low Stock', 'Pre-order', 'Out of Stock']
};

const sortOptions = [
  { value: 'newest', label: 'Newest First', icon: '🆕' },
  { value: 'price-low', label: 'Price: Low to High', icon: '💰' },
  { value: 'price-high', label: 'Price: High to Low', icon: '💎' },
  { value: 'popular', label: 'Most Popular', icon: '🔥' },
  { value: 'rating', label: 'Highest Rated', icon: '⭐' },
  { value: 'discount', label: 'Biggest Discount', icon: '🏷️' },
  { value: 'name', label: 'Name: A to Z', icon: '🔤' }
];

export default function FilterSidebar({ selectedFilters, onFilterChange, onClearFilters }: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    sort: true,
    price: true,
    size: true,
    tags: true,
    rating: false,
    availability: false
  });
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const handleCategoryChange = (category: string) => {
    const newCategories = selectedFilters.category.includes(category)
      ? selectedFilters.category.filter(c => c !== category)
      : [...selectedFilters.category, category];
    onFilterChange('category', newCategories);
  };

  const handleSizeChange = (size: string) => {
    const newSizes = selectedFilters.size.includes(size)
      ? selectedFilters.size.filter(s => s !== size)
      : [...selectedFilters.size, size];
    onFilterChange('size', newSizes);
  };

  const handleTagChange = (tag: string) => {
    const newTags = selectedFilters.tags.includes(tag)
      ? selectedFilters.tags.filter(t => t !== tag)
      : [...selectedFilters.tags, tag];
    onFilterChange('tags', newTags);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    onFilterChange('sort', sort);
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange('rating', rating);
  };

  const handleAvailabilityChange = (availability: string) => {
    onFilterChange('availability', availability);
  };

  const FilterSection = ({ 
    title, 
    sectionKey, 
    children,
    icon
  }: { 
    title: string; 
    sectionKey: string; 
    children: React.ReactNode;
    icon?: string;
  }) => (
    <div className="border-b border-gray-100 pb-6">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full mb-4 text-left"
      >
        <div className="flex items-center space-x-2">
          {icon && <span className="text-lg">{icon}</span>}
          <h3 className="font-space-grotesk font-semibold">{title}</h3>
        </div>
        {expandedSections[sectionKey as keyof typeof expandedSections] ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {expandedSections[sectionKey as keyof typeof expandedSections] && (
        <div className="space-y-3">{children}</div>
      )}
    </div>
  );

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-6 h-fit sticky top-24">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-space-grotesk font-semibold">Filters</h2>
        <button
          onClick={onClearFilters}
          className="text-sm text-gray-500 hover:text-black transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Sort Options */}
      <FilterSection title="Sort By" sectionKey="sort" icon="🔄">
        <div className="space-y-2">
          {sortOptions.map(option => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="radio"
                name="sort"
                value={option.value}
                checked={sortBy === option.value}
                onChange={() => handleSortChange(option.value as SortOption)}
                className="w-4 h-4 text-black border-gray-300 focus:ring-black focus:ring-2"
              />
              <span className="text-sm group-hover:text-black transition-colors">{option.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Categories */}
      <FilterSection title="Category" sectionKey="category" icon="📂">
        {filterOptions.categories.map(category => (
          <label key={category} className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedFilters.category.includes(category)}
              onChange={() => handleCategoryChange(category)}
              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black focus:ring-2"
            />
            <span className="text-sm group-hover:text-black transition-colors">{category}</span>
          </label>
        ))}
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range" sectionKey="price" icon="💰">
        {filterOptions.priceRanges.map(range => (
          <label key={range.value} className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="radio"
              name="priceRange"
              value={range.value}
              checked={selectedFilters.priceRange === range.value}
              onChange={(e) => onFilterChange('priceRange', e.target.value)}
              className="w-4 h-4 text-black border-gray-300 focus:ring-black focus:ring-2"
            />
            <span className="text-sm group-hover:text-black transition-colors">{range.label}</span>
          </label>
        ))}
      </FilterSection>

      {/* Rating Filter */}
      <FilterSection title="Rating" sectionKey="rating" icon="⭐">
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map(rating => (
            <label key={rating} className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={selectedFilters.rating === rating}
                onChange={() => handleRatingChange(rating)}
                className="w-4 h-4 text-black border-gray-300 focus:ring-black focus:ring-2"
              />
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-500 ml-1">& up</span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Sizes */}
      <FilterSection title="Size" sectionKey="size" icon="📏">
        <div className="grid grid-cols-3 gap-2">
          {filterOptions.sizes.map(size => (
            <button
              key={size}
              onClick={() => handleSizeChange(size)}
              className={cn(
                "py-2 px-3 text-sm border rounded-lg transition-colors",
                selectedFilters.size.includes(size)
                  ? "bg-black text-white border-black"
                  : "border-gray-200 hover:border-black"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Tags */}
      <FilterSection title="Tags" sectionKey="tags" icon="🏷️">
        <div className="flex flex-wrap gap-2">
          {filterOptions.tags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagChange(tag)}
              className={cn(
                "px-3 py-1 text-xs rounded-full transition-colors",
                selectedFilters.tags.includes(tag)
                  ? "bg-luxury-gold text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability" sectionKey="availability" icon="📦">
        {filterOptions.availability.map(availability => (
          <label key={availability} className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="radio"
              name="availability"
              value={availability}
              checked={selectedFilters.availability === availability}
              onChange={() => handleAvailabilityChange(availability)}
              className="w-4 h-4 text-black border-gray-300 focus:ring-black focus:ring-2"
            />
            <span className="text-sm group-hover:text-black transition-colors">{availability}</span>
          </label>
        ))}
      </FilterSection>

      {/* Active Filters Summary */}
      {Object.values(selectedFilters).some(filter => 
        Array.isArray(filter) ? filter.length > 0 : filter !== '' && filter !== 'newest' && filter !== undefined
      ) && (
        <div className="pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedFilters).map(([key, value]) => {
              if (Array.isArray(value) && value.length > 0) {
                return value.map((item, index) => (
                  <span key={`${key}-${index}`} className="px-2 py-1 bg-luxury-gold/20 text-luxury-gold text-xs rounded-full">
                    {key}: {item}
                  </span>
                ));
              } else if (value && value !== 'newest') {
                return (
                  <span key={key} className="px-2 py-1 bg-luxury-gold/20 text-luxury-gold text-xs rounded-full">
                    {key}: {value}
                  </span>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}