import { useState, useEffect } from 'react'
import useSWR from 'swr'
import cms from '@/lib/cms'
import { Product, Category, Page, Banner, Homepage } from '@/lib/strapi'

// Generic fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json())

// Products hooks
export const useProducts = (params?: any) => {
  const { data, error, isLoading } = useSWR(
    ['products', params],
    () => cms.products.getAll(params),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  )

  return {
    products: data?.data || [],
    meta: data?.meta,
    isLoading,
    error
  }
}

export const useProduct = (id: string | number) => {
  const { data, error, isLoading } = useSWR(
    id ? ['product', id] : null,
    () => cms.products.getById(id),
    {
      revalidateOnFocus: false,
    }
  )

  return {
    product: data?.data,
    isLoading,
    error
  }
}

export const useProductBySlug = (slug: string) => {
  const { data, error, isLoading } = useSWR(
    slug ? ['product-slug', slug] : null,
    () => cms.products.getBySlug(slug),
    {
      revalidateOnFocus: false,
    }
  )

  return {
    product: data?.data?.[0],
    isLoading,
    error
  }
}

export const useFeaturedProducts = (params?: any) => {
  const { data, error, isLoading } = useSWR(
    ['featured-products', params],
    () => cms.products.getFeatured(params),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  )

  return {
    products: data?.data || [],
    meta: data?.meta,
    isLoading,
    error
  }
}

export const useProductsByCategory = (categorySlug: string, params?: any) => {
  const { data, error, isLoading } = useSWR(
    categorySlug ? ['products-category', categorySlug, params] : null,
    () => cms.products.getByCategory(categorySlug, params),
    {
      revalidateOnFocus: false,
    }
  )

  return {
    products: data?.data || [],
    meta: data?.meta,
    isLoading,
    error
  }
}

export const useProductSearch = (query: string, params?: any) => {
  const { data, error, isLoading } = useSWR(
    query ? ['product-search', query, params] : null,
    () => cms.products.search(query, params),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30 seconds
    }
  )

  return {
    products: data?.data || [],
    meta: data?.meta,
    isLoading,
    error
  }
}

// Categories hooks
export const useCategories = (params?: any) => {
  const { data, error, isLoading } = useSWR(
    ['categories', params],
    () => cms.categories.getAll(params),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  )

  return {
    categories: data?.data || [],
    meta: data?.meta,
    isLoading,
    error
  }
}

export const useCategoryBySlug = (slug: string) => {
  const { data, error, isLoading } = useSWR(
    slug ? ['category-slug', slug] : null,
    () => cms.categories.getBySlug(slug),
    {
      revalidateOnFocus: false,
    }
  )

  return {
    category: data?.data?.[0],
    isLoading,
    error
  }
}

export const useParentCategories = (params?: any) => {
  const { data, error, isLoading } = useSWR(
    ['parent-categories', params],
    () => cms.categories.getParents(params),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  )

  return {
    categories: data?.data || [],
    meta: data?.meta,
    isLoading,
    error
  }
}

// Pages hooks
export const usePages = (params?: any) => {
  const { data, error, isLoading } = useSWR(
    ['pages', params],
    () => cms.pages.getAll(params),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  )

  return {
    pages: data?.data || [],
    meta: data?.meta,
    isLoading,
    error
  }
}

export const usePageBySlug = (slug: string) => {
  const { data, error, isLoading } = useSWR(
    slug ? ['page-slug', slug] : null,
    () => cms.pages.getBySlug(slug),
    {
      revalidateOnFocus: false,
    }
  )

  return {
    page: data?.data?.[0],
    isLoading,
    error
  }
}

// Banners hooks
export const useBanners = (params?: any) => {
  const { data, error, isLoading } = useSWR(
    ['banners', params],
    () => cms.banners.getAll(params),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  )

  return {
    banners: data?.data || [],
    meta: data?.meta,
    isLoading,
    error
  }
}

// Homepage hook
export const useHomepage = (params?: any) => {
  const { data, error, isLoading } = useSWR(
    ['homepage', params],
    () => cms.homepage.get(params),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  )

  return {
    homepage: data?.data,
    isLoading,
    error
  }
}

// Custom hook for image handling
export const useImageUrl = (image: any, size: 'thumbnail' | 'small' | 'medium' | 'large' = 'medium') => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (image) {
      const url = cms.utils.getImageUrl(image, size)
      setImageUrl(url)
    }
  }, [image, size])

  return imageUrl
}

// Custom hook for SEO data
export const useSEO = (entity: any) => {
  const [seo, setSEO] = useState<any>(null)

  useEffect(() => {
    if (entity) {
      const seoData = cms.utils.getSEO(entity)
      setSEO(seoData)
    }
  }, [entity])

  return seo
}
