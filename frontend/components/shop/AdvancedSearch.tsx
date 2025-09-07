'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, ChevronDown, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SearchFilters {
  search: string;
  category: string[];
  minPrice: number | null;
  maxPrice: number | null;
  tags: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface AdvancedSearchProps {
  categories: string[];
  tags: string[];
  onFiltersChange: (filters: SearchFilters) => void;
  totalResults: number;
  currentPage: number;
  totalPages: number;
}

export default function AdvancedSearch({
  categories,
  tags,
  onFiltersChange,
  totalResults,
  currentPage,
  totalPages
}: AdvancedSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<SearchFilters>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category')?.split(',').filter(Boolean) || [],
    minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : null,
    maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : null,
    tags: searchParams.get('tags')?.split(',').filter(Boolean) || [],
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.search) params.set('search', filters.search);
    if (filters.category.length > 0) params.set('category', filters.category.join(','));
    if (filters.minPrice !== null) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== null) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.tags.length > 0) params.set('tags', filters.tags.join(','));
    if (filters.sortBy !== 'createdAt') params.set('sortBy', filters.sortBy);
    if (filters.sortOrder !== 'desc') params.set('sortOrder', filters.sortOrder);
    
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.push(`/shop${newUrl}`, { scroll: false });
    
    onFiltersChange(filters);
  }, [filters, router, onFiltersChange]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCategoryToggle = (category: string) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...prev.category, category]
    }));
  };

  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: [],
      minPrice: null,
      maxPrice: null,
      tags: [],
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const hasActiveFilters = filters.search || 
    filters.category.length > 0 || 
    filters.minPrice !== null || 
    filters.maxPrice !== null || 
    filters.tags.length > 0 || 
    filters.sortBy !== 'createdAt' || 
    filters.sortOrder !== 'desc';

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="pl-10 pr-4 py-3 text-lg"
        />
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Results Info */}
        <div className="text-sm text-gray-600">
          {totalResults > 0 ? (
            <>
              Showing {((currentPage - 1) * 12) + 1} to {Math.min(currentPage * 12, totalResults)} of {totalResults} results
            </>
          ) : (
            'No results found'
          )}
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="ml-2"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {filters.category.length + filters.tags.length + (filters.minPrice !== null ? 1 : 0) + (filters.maxPrice !== null ? 1 : 0)}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="gap-2">
              Search: {filters.search}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => handleFilterChange('search', '')}
              />
            </Badge>
          )}
          
          {filters.category.map(cat => (
            <Badge key={cat} variant="secondary" className="gap-2">
              Category: {cat}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => handleCategoryToggle(cat)}
              />
            </Badge>
          ))}
          
          {filters.minPrice !== null && (
            <Badge variant="secondary" className="gap-2">
              Min: ${filters.minPrice}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => handleFilterChange('minPrice', null)}
              />
            </Badge>
          )}
          
          {filters.maxPrice !== null && (
            <Badge variant="secondary" className="gap-2">
              Max: ${filters.maxPrice}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => handleFilterChange('maxPrice', null)}
              />
            </Badge>
          )}
          
          {filters.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="gap-2">
              {tag}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => handleTagToggle(tag)}
              />
            </Badge>
          ))}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Advanced Filters Panel */}
      {isFilterOpen && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFilterOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Categories */}
            <div>
              <h4 className="font-medium mb-3">Categories</h4>
              <div className="space-y-2">
                {categories.map(category => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.category.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="font-medium mb-3">Price Range</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Min Price</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice || ''}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Max Price</label>
                  <Input
                    type="number"
                    placeholder="1000"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h4 className="font-medium mb-3">Tags</h4>
              <div className="space-y-2">
                {tags.map(tag => (
                  <label key={tag} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.tags.includes(tag)}
                      onChange={() => handleTagToggle(tag)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{tag}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Sorting */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Sort By</h4>
            <div className="flex items-center gap-4">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="border border-gray-300 rounded px-3 py-2"
              >
                <option value="createdAt">Date Added</option>
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
                <option value="sales">Popularity</option>
              </select>
              
              <Button
                variant={filters.sortOrder === 'asc' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('sortOrder', 'asc')}
              >
                ↑ Ascending
              </Button>
              
              <Button
                variant={filters.sortOrder === 'desc' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('sortOrder', 'desc')}
              >
                ↓ Descending
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => {
              const newParams = new URLSearchParams(searchParams);
              newParams.set('page', (currentPage - 1).toString());
              router.push(`/shop?${newParams.toString()}`);
            }}
          >
            Previous
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.set('page', page.toString());
                router.push(`/shop?${newParams.toString()}`);
              }}
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => {
              const newParams = new URLSearchParams(searchParams);
              newParams.set('page', (currentPage + 1).toString());
              router.push(`/shop?${newParams.toString()}`);
            }}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
