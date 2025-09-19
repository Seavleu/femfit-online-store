'use client'

import { useState } from 'react'
import { useCategories } from '@/hooks/useCMS'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Plus, Edit, Trash2, Folder } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function CMSCategories() {
  const [searchQuery, setSearchQuery] = useState('')
  
  const { categories, isLoading, error } = useCategories({
    filters: {
      ...(searchQuery && { name: { $containsi: searchQuery } })
    },
    sort: ['sortOrder:asc', 'name:asc']
  })

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Error loading categories: {error.message}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage product categories</p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories List */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-16 w-16 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : categories.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Folder className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No categories found</p>
            </CardContent>
          </Card>
        ) : (
          categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  {/* Category Image */}
                  <div className="relative h-16 w-16 rounded overflow-hidden bg-gray-100">
                    {category.attributes.image?.data ? (
                      <Image
                        src={category.attributes.image.data.attributes.url}
                        alt={category.attributes.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <Folder className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Category Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold truncate">{category.attributes.name}</h3>
                      <Badge variant={
                        category.attributes.categoryStatus === 'active' ? 'default' : 'secondary'
                      }>
                        {category.attributes.categoryStatus}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {category.attributes.description || 'No description'}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <span>Slug: {category.attributes.slug}</span>
                      {category.attributes.parent?.data && (
                        <span>Parent: {category.attributes.parent.data.attributes.name}</span>
                      )}
                      {category.attributes.sortOrder && (
                        <span>Order: {category.attributes.sortOrder}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/categories/${category.id}/edit`}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/shop/category/${category.attributes.slug}`}>
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
    </div>
  )
}
