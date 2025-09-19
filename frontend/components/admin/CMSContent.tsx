'use client'

import { useState } from 'react'
import { useHomepage, useBanners, usePages } from '@/hooks/useCMS'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Edit, Eye, Plus, FileText, Image as ImageIcon, Home } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function CMSContent() {
  const { homepage, isLoading: homepageLoading, error: homepageError } = useHomepage()
  const { banners, isLoading: bannersLoading, error: bannersError } = useBanners()
  const { pages, isLoading: pagesLoading, error: pagesError } = usePages()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Content Management</h1>
        <p className="text-muted-foreground">Manage your website content and pages</p>
      </div>

      <Tabs defaultValue="homepage" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
        </TabsList>

        {/* Homepage Tab */}
        <TabsContent value="homepage" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Homepage Content
                </CardTitle>
                <Button asChild>
                  <Link href="/admin/homepage/edit">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Homepage
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {homepageLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-48 w-full" />
                </div>
              ) : homepageError ? (
                <div className="text-center text-red-600">
                  Error loading homepage: {homepageError.message}
                </div>
              ) : homepage ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold">{homepage.attributes.heroTitle}</h3>
                    {homepage.attributes.heroSubtitle && (
                      <p className="text-muted-foreground mt-2">{homepage.attributes.heroSubtitle}</p>
                    )}
                  </div>
                  
                  {homepage.attributes.heroImage?.data && (
                    <div className="relative h-48 w-full rounded overflow-hidden">
                      <Image
                        src={homepage.attributes.heroImage.data.attributes.url}
                        alt={homepage.attributes.heroTitle}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {homepage.attributes.featuredProducts?.data && (
                    <div>
                      <h4 className="font-semibold mb-2">Featured Products ({homepage.attributes.featuredProducts.data.length})</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {homepage.attributes.featuredProducts.data.slice(0, 4).map((product) => (
                          <div key={product.id} className="text-sm">
                            {product.attributes.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Home className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No homepage content found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pages Tab */}
        <TabsContent value="pages" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Pages</h2>
              <p className="text-muted-foreground">Manage your website pages</p>
            </div>
            <Button asChild>
              <Link href="/admin/pages/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Page
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pagesLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardContent>
                </Card>
              ))
            ) : pagesError ? (
              <div className="col-span-full text-center text-red-600">
                Error loading pages: {pagesError.message}
              </div>
            ) : pages.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No pages found</p>
              </div>
            ) : (
              pages.map((page) => (
                <Card key={page.id}>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold line-clamp-2">{page.attributes.title}</h3>
                        <Badge variant={
                          page.attributes.pageStatus === 'published' ? 'default' : 'secondary'
                        }>
                          {page.attributes.pageStatus}
                        </Badge>
                      </div>
                      
                      {page.attributes.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {page.attributes.excerpt}
                        </p>
                      )}

                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/pages/${page.id}/edit`}>
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/pages/${page.attributes.slug}`}>
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Banners Tab */}
        <TabsContent value="banners" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Banners</h2>
              <p className="text-muted-foreground">Manage promotional banners</p>
            </div>
            <Button asChild>
              <Link href="/admin/banners/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Banner
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bannersLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-32 w-full mb-4" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))
            ) : bannersError ? (
              <div className="col-span-full text-center text-red-600">
                Error loading banners: {bannersError.message}
              </div>
            ) : banners.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No banners found</p>
              </div>
            ) : (
              banners.map((banner) => (
                <Card key={banner.id}>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {banner.attributes.image?.data && (
                        <div className="relative h-32 w-full rounded overflow-hidden">
                          <Image
                            src={banner.attributes.image.data.attributes.url}
                            alt={banner.attributes.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold">{banner.attributes.title}</h3>
                          <Badge variant={
                            banner.attributes.bannerStatus === 'active' ? 'default' : 'secondary'
                          }>
                            {banner.attributes.bannerStatus}
                          </Badge>
                        </div>
                        
                        {banner.attributes.subtitle && (
                          <p className="text-sm text-muted-foreground">
                            {banner.attributes.subtitle}
                          </p>
                        )}

                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/admin/banners/${banner.id}/edit`}>
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
