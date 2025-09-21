import { getApiClient } from "./client"
import type { Product, Category, ProductSearchParams } from "./types"

// Cache for total counts to avoid repeated API calls
const totalCountCache: { [key: string]: { count: number; timestamp: number } } = {}
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const productsApi = {
  async getCategories(): Promise<Category[]> {
    const response = await getApiClient().get<Category[]>("/catalog/categories")
    return response.data!
  },

  async searchProducts(params: ProductSearchParams = {}): Promise<{
    products: Product[]
    total: number
    page: number
    limit: number
  }> {
    const response = await getApiClient().get("/catalog/products", params)
    return response.data! as {
      products: Product[]
      total: number
      page: number
      limit: number
    }
  },

  async getProduct(slug: string): Promise<Product> {
    const response = await getApiClient().get<Product>(`/catalog/products/${slug}`)
    return response.data! as Product
  },

  async getProductsByCategory(
    categorySlug: string,
    params: Omit<ProductSearchParams, "category"> = {},
  ): Promise<{
    products: Product[]
    total: number
    page: number
    limit: number
  }> {
    const response = await getApiClient().get("/catalog/products", { ...params, category: categorySlug })
    return response.data! as {
      products: Product[]
      total: number
      page: number
      limit: number
    }
  },

  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    const response = await getApiClient().get<Product[]>("/products/featured", { limit })
    return response.data! as Product[]
  },

  async getTotalProductCount(): Promise<number> {
    const cacheKey = 'all-products'
    const cached = totalCountCache[cacheKey]
    
    // Return cached value if still valid
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.count
    }

    try {
      // Try to get total count with a single API call using a large limit
      // This is more efficient than multiple paginated calls
      const response = await getApiClient().get("/catalog/products", { 
        page: 1, 
        limit: 10000 // Use a very large limit to get all products in one call
      })
      const products = (response.data as any)?.products || []
      
      // Cache the result
      totalCountCache[cacheKey] = {
        count: products.length,
        timestamp: Date.now()
      }
      
      return products.length
    } catch (error) {
      // If the large limit fails, fall back to a reasonable estimate
      // This prevents the API overload issue while still providing useful data
      return 0
    }
  },

  async getCategoryTotalCount(categorySlug: string): Promise<number> {
    const cacheKey = `category-${categorySlug}`
    const cached = totalCountCache[cacheKey]
    
    // Return cached value if still valid
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.count
    }

    try {
      // Try to get total count with a single API call using a large limit
      // This is more efficient than multiple paginated calls
      const response = await getApiClient().get("/catalog/products", { 
        category: categorySlug,
        page: 1, 
        limit: 10000 // Use a very large limit to get all products in one call
      })
      const products = (response.data as any)?.products || []
      
      // Cache the result
      totalCountCache[cacheKey] = {
        count: products.length,
        timestamp: Date.now()
      }
      
      return products.length
    } catch (error) {
      // If the large limit fails, fall back to a reasonable estimate
      // This prevents the API overload issue while still providing useful data
      return 0
    }
  },

}
