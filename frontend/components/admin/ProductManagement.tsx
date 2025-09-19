'use client'

import { useState, useEffect } from 'react'
import { useProducts } from '@/hooks/useCMS'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Package, 
  Search,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import Link from 'next/link'

interface ProductFilters {
  status: string[]
  featured: boolean | null
  category: string[]
  priceRange: [number, number]
  search: string
}

export default function ProductManagement() {
  const { products, isLoading, error } = useProducts({ 
    pagination: { pageSize: 50 } 
  })
  
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<ProductFilters>({
    status: [],
    featured: null,
    category: [],
    priceRange: [0, 1000],
    search: ''
  })
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    const productData = product.attributes || product
    
    // Search filter
    if (filters.search && !productData.name?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    
    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(productData.productStatus)) {
      return false
    }
    
    // Featured filter
    if (filters.featured !== null && productData.featured !== filters.featured) {
      return false
    }
    
    // Price range filter
    const price = productData.price || 0
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
      return false
    }
    
    return true
  }).sort((a, b) => {
    const aData = a.attributes || a
    const bData = b.attributes || b
    
    let aValue = aData[sortBy] || ''
    let bValue = bData[sortBy] || ''
    
    if (sortBy === 'price') {
      aValue = aData.price || 0
      bValue = bData.price || 0
    }
    
    if (typeof aValue === 'string') aValue = aValue.toLowerCase()
    if (typeof bValue === 'string') bValue = bValue.toLowerCase()
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id))
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedProducts.length === 0) return
    
    try {
      // In production, this would make API calls
      console.log(`Bulk ${action} for products:`, selectedProducts)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Clear selection
      setSelectedProducts([])
      
      // Show success message
      alert(`Successfully ${action}ed ${selectedProducts.length} products`)
    } catch (error) {
      console.error(`Bulk ${action} error:`, error)
      alert(`Failed to ${action} products`)
    }
  }

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Name', 'SKU', 'Price', 'Status', 'Featured', 'Stock'],
      ...filteredProducts.map(product => {
        const data = product.attributes || product
        return [
          product.id,
          data.name || '',
          data.sku || '',
          data.price || 0,
          data.productStatus || '',
          data.featured ? 'Yes' : 'No',
          data.inventory?.quantity || 0
        ]
      })
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `products-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2">Loading products...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Products</h3>
        <p className="text-gray-600">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Product Management</h2>
          <p className="text-gray-600">Manage your product catalog with advanced tools</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filters & Search</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <div className="space-y-2">
                    {['published', 'draft', 'archived'].map(status => (
                      <label key={status} className="flex items-center space-x-2">
                        <Checkbox
                          checked={filters.status.includes(status)}
                          onCheckedChange={(checked) => {
                            setFilters(prev => ({
                              ...prev,
                              status: checked 
                                ? [...prev.status, status]
                                : prev.status.filter(s => s !== status)
                            }))
                          }}
                        />
                        <span className="text-sm capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Featured</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <Checkbox
                        checked={filters.featured === true}
                        onCheckedChange={(checked) => {
                          setFilters(prev => ({ ...prev, featured: checked ? true : null }))
                        }}
                      />
                      <span className="text-sm">Featured only</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <Checkbox
                        checked={filters.featured === false}
                        onCheckedChange={(checked) => {
                          setFilters(prev => ({ ...prev, featured: checked ? false : null }))
                        }}
                      />
                      <span className="text-sm">Non-featured only</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Price Range</label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange[0]}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        priceRange: [parseInt(e.target.value) || 0, prev.priceRange[1]]
                      }))}
                    />
                    <span className="text-gray-500">to</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        priceRange: [prev.priceRange[0], parseInt(e.target.value) || 1000]
                      }))}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">
                  {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleBulkAction('publish')}>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Publish
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('draft')}>
                    <Edit className="w-4 h-4 mr-1" />
                    Draft
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('feature')}>
                    <Star className="w-4 h-4 mr-1" />
                    Feature
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedProducts([])}
              >
                Clear Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Products ({filteredProducts.length})
            </CardTitle>
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-200 rounded text-sm"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="createdAt">Sort by Date</option>
                <option value="productStatus">Sort by Status</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">
                    <Checkbox
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left p-3 font-medium">Product</th>
                  <th className="text-left p-3 font-medium">SKU</th>
                  <th className="text-left p-3 font-medium">Price</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Stock</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const productData = product.attributes || product
                  const isLowStock = (productData.inventory?.quantity || 0) < 10
                  const isOutOfStock = (productData.inventory?.quantity || 0) === 0
                  
                  return (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={() => handleSelectProduct(product.id)}
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                          <div>
                            <div className="font-medium">{productData.name || 'Unnamed Product'}</div>
                            <div className="text-sm text-gray-500">
                              {productData.shortDescription?.substring(0, 50)}...
                            </div>
                            {productData.featured && (
                              <Badge variant="secondary" className="text-xs mt-1">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {productData.sku || 'N/A'}
                      </td>
                      <td className="p-3 font-medium">
                        ${(productData.price || 0).toFixed(2)}
                      </td>
                      <td className="p-3">
                        <Badge variant={
                          productData.productStatus === 'published' ? 'default' :
                          productData.productStatus === 'draft' ? 'secondary' : 'destructive'
                        }>
                          {productData.productStatus || 'Unknown'}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">
                            {productData.inventory?.quantity || 0}
                          </span>
                          {isOutOfStock && (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          {isLowStock && !isOutOfStock && (
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/products/${product.id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`http://localhost:1337/admin/content-manager/collection-types/api::product-content-type.product-content-type/${product.id}`} target="_blank">
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
