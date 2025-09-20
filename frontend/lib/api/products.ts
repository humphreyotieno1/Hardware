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
      console.log("Using cached total count:", cached.count)
      return cached.count
    }

    try {
      // Since the API doesn't return total, we need to count by making multiple calls
      let totalCount = 0
      let page = 1
      const limit = 100 // Use larger limit to reduce API calls
      
      while (true) {
        const response = await getApiClient().get("/catalog/products", { page, limit })
        const products = (response.data as any)?.products || []
        
        if (products.length === 0) {
          break // No more products
        }
        
        totalCount += products.length
        page++
        
        // Safety break to prevent infinite loops
        if (page > 50) {
          console.warn("Reached maximum page limit for counting products")
          break
        }
      }
      
      // Cache the result
      totalCountCache[cacheKey] = {
        count: totalCount,
        timestamp: Date.now()
      }
      
      console.log("Total product count calculated and cached:", totalCount)
      return totalCount
    } catch (error) {
      console.error("Failed to get product count:", error)
      return 0
    }
  },

  async getCategoryTotalCount(categorySlug: string): Promise<number> {
    const cacheKey = `category-${categorySlug}`
    const cached = totalCountCache[cacheKey]
    
    // Return cached value if still valid
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log("Using cached category count:", cached.count)
      return cached.count
    }

    try {
      // Since the API doesn't return total, we need to count by making multiple calls
      let totalCount = 0
      let page = 1
      const limit = 100 // Use larger limit to reduce API calls
      
      while (true) {
        const response = await getApiClient().get("/catalog/products", { 
          category: categorySlug, 
          page, 
          limit 
        })
        const products = (response.data as any)?.products || []
        
        if (products.length === 0) {
          break // No more products
        }
        
        totalCount += products.length
        page++
        
        // Safety break to prevent infinite loops
        if (page > 50) {
          console.warn("Reached maximum page limit for counting category products")
          break
        }
      }
      
      // Cache the result
      totalCountCache[cacheKey] = {
        count: totalCount,
        timestamp: Date.now()
      }
      
      console.log("Category total count calculated and cached:", totalCount)
      return totalCount
    } catch (error) {
      console.error("Failed to get category product count:", error)
      return 0
    }
  },

}
