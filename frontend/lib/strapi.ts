// Simple fetch-based Strapi client
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const API_TOKEN = process.env.STRAPI_READONLY_TOKEN || process.env.STRAPI_API_TOKEN

// Strapi client using fetch
const strapi = {
  request: async (method: string, endpoint: string, options: any = {}) => {
    const url = `${STRAPI_URL}${endpoint}`
    const params = new URLSearchParams()
    
        if (options.params) {
          Object.entries(options.params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              if (key === 'populate' && Array.isArray(value)) {
                // Use populate=* for better compatibility
                params.append('populate', '*')
              } else if (key === 'populate' && value === '*') {
                params.append('populate', '*')
              } else if (key === 'filters' && typeof value === 'object') {
                // Handle nested filters - encode them properly
                Object.entries(value).forEach(([filterKey, filterValue]) => {
                  if (typeof filterValue === 'object' && filterValue !== null) {
                    Object.entries(filterValue).forEach(([opKey, opValue]) => {
                      // Use proper encoding for nested objects
                      const encodedKey = `filters[${filterKey}][${opKey}]`
                      params.append(encodedKey, String(opValue))
                    })
                  } else {
                    params.append(`filters[${filterKey}]`, String(filterValue))
                  }
                })
              } else if (key === 'sort' && Array.isArray(value)) {
                value.forEach((sortField, index) => {
                  params.append(`sort[${index}]`, sortField)
                })
              } else if (key === 'pagination' && typeof value === 'object') {
                Object.entries(value).forEach(([pKey, pValue]) => {
                  params.append(`pagination[${pKey}]`, String(pValue))
                })
              } else {
                params.append(key, String(value))
              }
            }
          })
        }
    
    const queryString = params.toString()
    const fullUrl = queryString ? `${url}?${queryString}` : url
    
    const response = await fetch(fullUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(API_TOKEN && { 'Authorization': `Bearer ${API_TOKEN}` }),
        ...options.headers,
      },
      ...options,
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  }
}

export default strapi

// Type definitions for Strapi responses
export interface StrapiResponse<T> {
  data: T
  meta: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface StrapiEntity {
  id: number
  attributes: Record<string, any>
  meta?: Record<string, any>
}

// Content type interfaces
export interface Product extends StrapiEntity {
  attributes: {
    name: string
    slug: string
    description: string
    shortDescription?: string
    price: number
    compareAtPrice?: number
    sku: string
    barcode?: string
    productStatus: 'draft' | 'published' | 'archived'
    featured: boolean
    images?: {
      data: Array<{
        id: number
        attributes: {
          url: string
          alternativeText?: string
          caption?: string
        }
      }>
    }
    category?: {
      data: Category
    }
    variants?: Array<{
      id: number
      name: string
      price: number
      sku?: string
      inventory?: number
      attributes?: Record<string, any>
    }>
    inventory?: {
      trackQuantity: boolean
      quantity: number
      allowBackorder: boolean
      lowStockThreshold: number
    }
    seo?: {
      title?: string
      description?: string
      keywords?: string
      ogImage?: {
        data: {
          attributes: {
            url: string
          }
        }
      }
    }
    createdAt: string
    updatedAt: string
    publishedAt?: string
  }
}

export interface Category extends StrapiEntity {
  attributes: {
    name: string
    slug: string
    description?: string
    image?: {
      data: {
        id: number
        attributes: {
          url: string
          alternativeText?: string
        }
      }
    }
    parent?: {
      data: Category
    }
    categoryStatus: 'active' | 'inactive'
    sortOrder?: number
    seo?: {
      title?: string
      description?: string
      keywords?: string
    }
    createdAt: string
    updatedAt: string
  }
}

export interface Page extends StrapiEntity {
  attributes: {
    title: string
    slug: string
    content: string
    excerpt?: string
    featuredImage?: {
      data: {
        id: number
        attributes: {
          url: string
          alternativeText?: string
        }
      }
    }
    pageStatus: 'draft' | 'published'
    seo?: {
      title?: string
      description?: string
      keywords?: string
    }
    createdAt: string
    updatedAt: string
    publishedAt?: string
  }
}

export interface Banner extends StrapiEntity {
  attributes: {
    title: string
    subtitle?: string
    image: {
      data: {
        id: number
        attributes: {
          url: string
          alternativeText?: string
        }
      }
    }
    link?: string
    buttonText?: string
    bannerStatus: 'active' | 'inactive'
    sortOrder?: number
    createdAt: string
    updatedAt: string
  }
}

export interface Homepage extends StrapiEntity {
  attributes: {
    heroTitle: string
    heroSubtitle?: string
    heroImage: {
      data: {
        id: number
        attributes: {
          url: string
          alternativeText?: string
        }
      }
    }
    heroButtonText?: string
    heroButtonLink?: string
    featuredProducts?: {
      data: Product[]
    }
    aboutTitle?: string
    aboutContent?: string
    aboutImage?: {
      data: {
        id: number
        attributes: {
          url: string
          alternativeText?: string
        }
      }
    }
    seo?: {
      title?: string
      description?: string
      keywords?: string
    }
    createdAt: string
    updatedAt: string
  }
}
