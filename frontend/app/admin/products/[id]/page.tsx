'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  Trash2, 
  Eye, 
  Package,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

interface Product {
  id: string
  attributes: {
    name: string
    slug: string
    shortDescription: string
    price: number
    sku: string
    productStatus: string
    featured: boolean
    images?: {
      data: Array<{
        id: number
        attributes: {
          url: string
          name: string
        }
      }>
    }
    variants?: Array<{
      id: number
      name: string
      price: number
      sku: string
    }>
  }
}

export default function AdminProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editData, setEditData] = useState<any>({})

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Try to fetch from Strapi
        const response = await fetch(`http://localhost:1337/api/product-content-types/${productId}?populate=*`)
        
        if (!response.ok) {
          throw new Error(`Product not found: ${response.status}`)
        }
        
        const data = await response.json()
        setProduct(data.data)
        setEditData(data.data.attributes)
        
      } catch (err) {
        console.error('Error fetching product:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch product')
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      const response = await fetch(`http://localhost:1337/api/product-content-types/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: editData
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update product')
      }
      
      const updatedProduct = await response.json()
      setProduct(updatedProduct.data)
      setIsEditing(false)
      
    } catch (err) {
      console.error('Error saving product:', err)
      setError(err instanceof Error ? err.message : 'Failed to save product')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return
    }
    
    try {
      const response = await fetch(`http://localhost:1337/api/product-content-types/${productId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete product')
      }
      
      router.push('/admin/products')
      
    } catch (err) {
      console.error('Error deleting product:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete product')
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2">Loading product...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Error Loading Product</h2>
            </div>
            <p className="text-red-700 mt-2">{error}</p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button asChild>
                <Link href="/admin/products">
                  <Package className="w-4 h-4 mr-2" />
                  All Products
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/admin/products">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const productData = product.attributes

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditing ? 'Edit Product' : productData.name}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Update product information' : `Product ID: ${product.id}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" asChild>
                <Link href={`http://localhost:1337/admin/content-manager/collection-types/api::product-content-type.product-content-type/${product.id}`} target="_blank">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit in Strapi
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/shop/${productData.slug}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Product
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Product Name</label>
                {isEditing ? (
                  <Input
                    value={editData.name || ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                ) : (
                  <p className="text-lg font-medium">{productData.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Slug</label>
                {isEditing ? (
                  <Input
                    value={editData.slug || ''}
                    onChange={(e) => setEditData({ ...editData, slug: e.target.value })}
                  />
                ) : (
                  <p className="text-gray-600">{productData.slug}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                {isEditing ? (
                  <Textarea
                    value={editData.shortDescription || ''}
                    onChange={(e) => setEditData({ ...editData, shortDescription: e.target.value })}
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-700">{productData.shortDescription}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price</label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editData.price || 0}
                      onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
                    />
                  ) : (
                    <p className="text-lg font-semibold">${productData.price?.toFixed(2) || '0.00'}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">SKU</label>
                  {isEditing ? (
                    <Input
                      value={editData.sku || ''}
                      onChange={(e) => setEditData({ ...editData, sku: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-600">{productData.sku || 'N/A'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Status & Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                {isEditing ? (
                  <select
                    value={editData.productStatus || 'draft'}
                    onChange={(e) => setEditData({ ...editData, productStatus: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                ) : (
                  <Badge variant={
                    productData.productStatus === 'published' ? 'default' : 
                    productData.productStatus === 'draft' ? 'secondary' : 'destructive'
                  }>
                    {productData.productStatus}
                  </Badge>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Featured</label>
                {isEditing ? (
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editData.featured || false}
                      onChange={(e) => setEditData({ ...editData, featured: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">Featured Product</span>
                  </label>
                ) : (
                  <Badge variant={productData.featured ? 'default' : 'secondary'}>
                    {productData.featured ? 'Featured' : 'Regular'}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          {productData.images?.data?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {productData.images.data.map((image: any) => (
                    <div key={image.id} className="aspect-square bg-gray-100 rounded border flex items-center justify-center">
                      <span className="text-xs text-gray-500">IMG</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-800">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Product
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
