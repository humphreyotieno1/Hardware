import { getApiClient } from "./client"
import type { Product, Category, ProductSearchParams } from "./types"

// Cache entries share a timestamped structure
interface CacheEntry<T> {
  value: T
  timestamp: number
}

// Cache for total counts to avoid repeated API calls
const totalCountCache: Record<string, CacheEntry<number>> = {}
let categoryCountCache: CacheEntry<Record<string, number>> | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

const isCacheValid = <T>(entry: CacheEntry<T> | null | undefined) =>
  !!entry && Date.now() - entry.timestamp < CACHE_DURATION

const computeCategoryKey = (product: any): string | undefined => {
  if (!product) return undefined
  if (product.category?.slug) return product.category.slug
  if (product.category_slug) return product.category_slug
  if (typeof product.category === "string") return product.category
  if (product.category_id) return String(product.category_id)
  return undefined
}

const buildCategoryCounts = (products: any[]): Record<string, number> => {
  return products.reduce<Record<string, number>>((acc, product) => {
    const categoryKey = computeCategoryKey(product)
    if (!categoryKey) {
      return acc
    }
    acc[categoryKey] = (acc[categoryKey] || 0) + 1
    return acc
  }, {})
}

const fetchCategoryCounts = async (): Promise<Record<string, number>> => {
  try {
    const response = await getApiClient().get("/catalog/products", {
      page: 1,
      limit: 10000,
    })
    const payload = response.data as any
    const products = payload?.products || []
    return buildCategoryCounts(products)
  } catch (error) {
    console.error("Error fetching category counts:", error)
    return {}
  }
}

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
    const response = await getApiClient().get<Product[]>("/catalog/featured", { limit })
    return response.data! as Product[]
  },

  async getTotalProductCount(): Promise<number> {
    const cacheKey = 'all-products'
    const cached = totalCountCache[cacheKey]

    // Return cached value if still valid
    if (isCacheValid(cached)) {
      return cached.value
    }

    try {
      const counts = await productsApi.getCategoryCounts()
      const total = Object.values(counts).reduce((sum, count) => sum + count, 0)

      totalCountCache[cacheKey] = {
        value: total,
        timestamp: Date.now(),
      }
      return total
    } catch (error) {
      // If the large limit fails, fall back to a reasonable estimate
      // This prevents the API overload issue while still providing useful data
      return 0
    }
  },

  async getCategoryTotalCount(categorySlug: string): Promise<number> {
    const cacheKey = `category-${categorySlug}`
    const cached = totalCountCache[cacheKey]

    if (isCacheValid(cached)) {
      return cached.value
    }

    try {
      const counts = await productsApi.getCategoryCounts()
      const count = counts[categorySlug] ?? 0

      totalCountCache[cacheKey] = {
        value: count,
        timestamp: Date.now(),
      }
      return count
    } catch (error) {
      // If the large limit fails, fall back to a reasonable estimate
      // This prevents the API overload issue while still providing useful data
      return 0
    }
  },

  async getCategoryCounts(): Promise<Record<string, number>> {
    if (isCacheValid(categoryCountCache)) {
      return categoryCountCache!.value
    }

    const counts = await fetchCategoryCounts()
    categoryCountCache = {
      value: counts,
      timestamp: Date.now(),
    }
    return counts
  },

}
