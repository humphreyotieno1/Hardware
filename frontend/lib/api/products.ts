import apiClient from "./client"
import type { Product, Category, ProductSearchParams } from "./types"

export const productsApi = {
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>("/categories")
    return response.data!
  },

  async searchProducts(params: ProductSearchParams = {}): Promise<{
    products: Product[]
    total: number
    page: number
    limit: number
  }> {
    const response = await apiClient.get("/products", params)
    return response.data!
  },

  async getProduct(slug: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${slug}`)
    return response.data!
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
    const response = await apiClient.get("/products", { ...params, category: categorySlug })
    return response.data!
  },

  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    const response = await apiClient.get<Product[]>("/products/featured", { limit })
    return response.data!
  },
}
