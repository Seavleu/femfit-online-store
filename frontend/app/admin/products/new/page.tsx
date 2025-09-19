'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink, Package } from 'lucide-react'
import Link from 'next/link'

export default function NewProductPage() {
  useEffect(() => {
    // Auto-redirect to Strapi admin after 3 seconds
    const timer = setTimeout(() => {
      window.open('http://localhost:1337/admin/content-manager/collection-types/api::product-content-type.product-content-type/create', '_blank')
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Create New Product</CardTitle>
          <p className="text-gray-600">
            Redirecting you to Strapi admin to create a new product...
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">
              Opening Strapi admin in a new tab...
            </p>
          </div>

          <div className="space-y-4">
            <Button asChild className="w-full">
              <a 
                href="http://localhost:1337/admin/content-manager/collection-types/api::product-content-type.product-content-type/create" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Strapi Admin Now
              </a>
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link href="/admin/products">
                Stay on This Page
              </Link>
            </Button>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 rounded-lg text-left">
            <h3 className="font-semibold text-yellow-900 mb-2">📝 How to Create a Product</h3>
            <ol className="text-yellow-800 text-sm space-y-1">
              <li>1. Click "Open Strapi Admin Now" above</li>
              <li>2. Fill in the product details (name, price, description, etc.)</li>
              <li>3. Upload product images</li>
              <li>4. Add product variants if needed</li>
              <li>5. Set SEO settings</li>
              <li>6. Save and publish the product</li>
              <li>7. Return to this admin panel to see your new product</li>
            </ol>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Pro Tip</h3>
            <p className="text-blue-800 text-sm">
              After creating a product in Strapi, it will automatically appear in your 
              Next.js admin panel and be available on your website. No additional setup required!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
