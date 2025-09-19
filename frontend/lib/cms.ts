import strapi, { 
  StrapiResponse, 
  Product, 
  Category, 
  Page, 
  Banner, 
  Homepage 
} from './strapi'

// Query parameters interface
interface QueryParams {
  populate?: string | string[]
  filters?: Record<string, any>
  sort?: string | string[]
  pagination?: {
    page?: number
    pageSize?: number
  }
  locale?: string
}

// Generic API function
async function fetchFromStrapi<T>(
  endpoint: string,
  params: QueryParams = {}
): Promise<StrapiResponse<T>> {
  try {
    const response = await strapi.request('GET', `/api/${endpoint}`, {
      params: {
        populate: params.populate || '*',
        filters: params.filters,
        sort: params.sort,
        pagination: params.pagination,
        locale: params.locale,
      }
    })
    
    return response as StrapiResponse<T>
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error)
    throw error
  }
}

// Products API
export const productsApi = {
  // Get all products
  getAll: async (params: QueryParams = {}) => {
    return fetchFromStrapi<Product[]>('product-content-types', {
      ...params,
      populate: params.populate || '*'
    })
  },

  // Get product by ID
  getById: async (id: string | number, params: QueryParams = {}) => {
    try {
      const response = await strapi.request('GET', `/api/product-content-types/${id}`, {
        params: {
          populate: params.populate || '*'
        }
      })
      return response as StrapiResponse<Product>
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error)
      throw error
    }
  },

  // Get product by slug
  getBySlug: async (slug: string, params: QueryParams = {}) => {
    return fetchFromStrapi<Product[]>('product-content-types', {
      ...params,
      filters: { slug: { $eq: slug } },
      populate: params.populate || '*'
    })
  },

  // Get featured products
  getFeatured: async (params: QueryParams = {}) => {
    return fetchFromStrapi<Product[]>('product-content-types', {
      ...params,
      filters: { 
        featured: { $eq: true },
        productStatus: { $eq: 'published' }
      },
      populate: params.populate || '*'
    })
  },

  // Get products by category
  getByCategory: async (categorySlug: string, params: QueryParams = {}) => {
    return fetchFromStrapi<Product[]>('product-content-types', {
      ...params,
      filters: { 
        category: { slug: { $eq: categorySlug } },
        productStatus: { $eq: 'published' }
      },
      populate: params.populate || '*'
    })
  },

  // Search products
  search: async (query: string, params: QueryParams = {}) => {
    return fetchFromStrapi<Product[]>('product-content-types', {
      ...params,
      filters: {
        $or: [
          { name: { $containsi: query } },
          { description: { $containsi: query } },
          { shortDescription: { $containsi: query } }
        ],
        productStatus: { $eq: 'published' }
      },
      populate: params.populate || '*'
    })
  }
}

// Categories API
export const categoriesApi = {
  // Get all categories
  getAll: async (params: QueryParams = {}) => {
    return fetchFromStrapi<Category[]>('category-content-types', {
      ...params,
      // Remove filters for now since no categories exist yet
      populate: params.populate || '*'
    })
  },

  // Get category by slug
  getBySlug: async (slug: string, params: QueryParams = {}) => {
    return fetchFromStrapi<Category[]>('category-content-types', {
      ...params,
      filters: { 
        slug: { $eq: slug }
      },
      populate: params.populate || '*'
    })
  },

  // Get parent categories only
  getParents: async (params: QueryParams = {}) => {
    return fetchFromStrapi<Category[]>('category-content-types', {
      ...params,
      filters: { 
        parent: { $null: true }
      },
      populate: params.populate || '*'
    })
  }
}

// Pages API
export const pagesApi = {
  // Get all pages
  getAll: async (params: QueryParams = {}) => {
    return fetchFromStrapi<Page[]>('page-content-types', {
      ...params,
      filters: { pageStatus: { $eq: 'published' } },
      populate: params.populate || ['featuredImage', 'seo']
    })
  },

  // Get page by slug
  getBySlug: async (slug: string, params: QueryParams = {}) => {
    return fetchFromStrapi<Page[]>('page-content-types', {
      ...params,
      filters: { 
        slug: { $eq: slug },
        pageStatus: { $eq: 'published' }
      },
      populate: params.populate || ['featuredImage', 'seo']
    })
  }
}

// Banners API
export const bannersApi = {
  // Get all active banners
  getAll: async (params: QueryParams = {}) => {
    return fetchFromStrapi<Banner[]>('banner-content-types', {
      ...params,
      filters: { bannerStatus: { $eq: 'active' } },
      populate: params.populate || ['image'],
      sort: ['sortOrder:asc', 'createdAt:desc']
    })
  }
}

// Homepage API
export const homepageApi = {
  // Get homepage content
  get: async (params: QueryParams = {}) => {
    try {
      const response = await strapi.request('GET', '/api/homepage', {
        params: {
          populate: params.populate || [
            'heroImage',
            'featuredProducts',
            'featuredProducts.images',
            'featuredProducts.category',
            'aboutImage',
            'seo'
          ]
        }
      })
      return response as StrapiResponse<Homepage>
    } catch (error) {
      console.error('Error fetching homepage:', error)
      throw error
    }
  }
}

// Utility functions
export const cmsUtils = {
  // Get image URL from Strapi media object
  getImageUrl: (image: any, size: 'thumbnail' | 'small' | 'medium' | 'large' = 'medium') => {
    if (!image?.data?.attributes) return null
    
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
    const { url } = image.data.attributes
    
    if (url.startsWith('http')) return url
    return `${baseUrl}${url}`
  },

  // Format Strapi date
  formatDate: (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  },

  // Get SEO data
  getSEO: (entity: any) => {
    const seo = entity?.attributes?.seo
    if (!seo) return null

    return {
      title: seo.title || entity.attributes.name || entity.attributes.title,
      description: seo.description || entity.attributes.shortDescription || entity.attributes.excerpt,
      keywords: seo.keywords,
      ogImage: seo.ogImage ? cmsUtils.getImageUrl(seo.ogImage) : null
    }
  }
}

export default {
  products: productsApi,
  categories: categoriesApi,
  pages: pagesApi,
  banners: bannersApi,
  homepage: homepageApi,
  utils: cmsUtils
}
