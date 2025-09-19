'use client'

import { useProducts } from '@/hooks/useCMS'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Eye, Trash2, Package } from 'lucide-react'
import Link from 'next/link'

export default function AdminProductsPage() {
  const { products, isLoading, error } = useProducts({ 
    pagination: { pageSize: 20 } 
  })

  // Debug logging
  console.log('🔍 DEBUG - Products data:', products)
  console.log('🔍 DEBUG - Products length:', products?.length)
  if (products && products.length > 0) {
    console.log('🔍 DEBUG - First product:', products[0])
    console.log('🔍 DEBUG - First product keys:', Object.keys(products[0]))
    if (products[0].attributes) {
      console.log('🔍 DEBUG - First product attributes:', products[0].attributes)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
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
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Products</h1>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Products Management</h1>
          <p className="text-gray-600">Manage your product catalog from Strapi CMS</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="http://localhost:1337/admin" target="_blank" rel="noopener noreferrer">
              <Package className="w-4 h-4 mr-2" />
              Open Strapi Admin
            </Link>
          </Button>
        </div>
      </div>

      {/* Debug Section */}
      {products && products.length > 0 && (
        <Card className="mb-6 bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800">🔍 Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <p><strong>Products Count:</strong> {products.length}</p>
              <p><strong>First Product Structure:</strong></p>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                {JSON.stringify(products[0], null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {products.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-4">
              You haven't created any products yet. Add your first product to get started.
            </p>
            <Button asChild>
              <Link href="http://localhost:1337/admin" target="_blank" rel="noopener noreferrer">
                <Plus className="w-4 h-4 mr-2" />
                Create Product in Strapi
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {products.map((product: any) => {
            // Flexible data access - handle both direct properties and nested attributes
            const productData = product.attributes || product
            const name = productData.name || productData.title || 'Unnamed Product'
            const price = productData.price || 0
            const sku = productData.sku || 'N/A'
            const shortDescription = productData.shortDescription || productData.description || 'No description available'
            const featured = productData.featured || false
            const productStatus = productData.productStatus || productData.status || 'Unknown'
            const images = productData.images || productData.image || null
            const variants = productData.variants || []

            return (
              <Card key={product.id || product.documentId} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        SKU: {sku} | 
                        Price: ${typeof price === 'number' ? price.toFixed(2) : '0.00'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={featured ? 'default' : 'secondary'}>
                        {featured ? 'Featured' : 'Regular'}
                      </Badge>
                      <Badge variant={
                        productStatus === 'published' ? 'default' : 
                        productStatus === 'draft' ? 'secondary' : 'destructive'
                      }>
                        {productStatus}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    {shortDescription}
                  </p>
                
                {images?.data?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Images: {images.data.length} available
                    </p>
                    <div className="flex gap-2">
                      {images.data.slice(0, 3).map((image: any, index: number) => (
                        <div key={index} className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center">
                          <span className="text-xs text-gray-500">IMG</span>
                        </div>
                      ))}
                      {images.data.length > 3 && (
                        <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center">
                          <span className="text-xs text-gray-500">+{images.data.length - 3}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {variants.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Variants: {variants.length} available
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {variants.slice(0, 3).map((variant: any, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {variant.name || `Variant ${index + 1}`}
                        </Badge>
                      ))}
                      {variants.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{variants.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`http://localhost:1337/admin/content-manager/collection-types/api::product-content-type.product-content-type/${product.id || product.documentId}`} target="_blank" rel="noopener noreferrer">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit in Strapi
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/shop/${productData.slug || product.id || product.documentId}`}>
                      <Eye className="w-4 h-4 mr-1" />
                      View Product
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            )
          })}
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Pro Tip</h3>
        <p className="text-blue-800 text-sm">
          This page shows products from your Strapi CMS. To add, edit, or delete products, 
          use the Strapi admin panel. Click "Open Strapi Admin" above to manage your content.
        </p>
      </div>
    </div>
  )
}
