'use client'

import { useProducts, useCategories, useHomepage } from '@/hooks/useCMS'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function CMSIntegrationTest() {
  const { products, isLoading: productsLoading, error: productsError } = useProducts({ pagination: { pageSize: 3 } })
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories({ pagination: { pageSize: 3 } })
  const { homepage, isLoading: homepageLoading, error: homepageError } = useHomepage()

  const getStatusIcon = (loading: boolean, error: any) => {
    if (loading) return <Loader2 className="w-4 h-4 animate-spin" />
    if (error) return <XCircle className="w-4 h-4 text-red-500" />
    return <CheckCircle className="w-4 h-4 text-green-500" />
  }

  const getStatusText = (loading: boolean, error: any, data: any) => {
    if (loading) return "Loading..."
    if (error) return `Error: ${error.message}`
    if (data?.length === 0) return "No data found"
    return `Success: ${data?.length || 1} item(s) loaded`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>CMS Integration Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              {getStatusIcon(productsLoading, productsError)}
              <div>
                <p className="font-medium">Products API</p>
                <p className="text-sm text-muted-foreground">
                  {getStatusText(productsLoading, productsError, products)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {getStatusIcon(categoriesLoading, categoriesError)}
              <div>
                <p className="font-medium">Categories API</p>
                <p className="text-sm text-muted-foreground">
                  {getStatusText(categoriesLoading, categoriesError, categories)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {getStatusIcon(homepageLoading, homepageError)}
              <div>
                <p className="font-medium">Homepage API</p>
                <p className="text-sm text-muted-foreground">
                  {getStatusText(homepageLoading, homepageError, homepage)}
                </p>
              </div>
            </div>
          </div>

          {/* Environment Check */}
          <Alert>
            <AlertDescription>
              <strong>Environment:</strong> {process.env.NEXT_PUBLIC_STRAPI_URL || 'Not configured'}
              <br />
              <strong>API Token:</strong> {process.env.STRAPI_API_TOKEN ? 'Configured' : 'Not configured'}
            </AlertDescription>
          </Alert>

          {/* Sample Data Display */}
          {!productsLoading && !productsError && products.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Sample Products:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.slice(0, 3).map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-4">
                      <h4 className="font-medium">{product.attributes.name}</h4>
                      <p className="text-sm text-muted-foreground">${product.attributes.price}</p>
                      <Badge variant={
                        product.attributes.productStatus === 'published' ? 'default' : 'secondary'
                      }>
                        {product.attributes.productStatus}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {!categoriesLoading && !categoriesError && categories.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Sample Categories:</h3>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 5).map((category) => (
                  <Badge key={category.id} variant="outline">
                    {category.attributes.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {!homepageLoading && !homepageError && homepage && (
            <div>
              <h3 className="font-semibold mb-2">Homepage Content:</h3>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium">{homepage.attributes.heroTitle}</h4>
                  {homepage.attributes.heroSubtitle && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {homepage.attributes.heroSubtitle}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
