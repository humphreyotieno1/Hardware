import apiClient from "./client"
import type { Product, Category, ProductSearchParams } from "./types"

export const productsApi = {
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>("/catalog/categories")
    return response.data!
  },

  async searchProducts(params: ProductSearchParams = {}): Promise<{
    products: Product[]
    total: number
    page: number
    limit: number
  }> {
    const response = await apiClient.get("/catalog/products", params)
    return response.data! as {
      products: Product[]
      total: number
      page: number
      limit: number
    }
  },

  async getProduct(slug: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/catalog/products/${slug}`)
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
    const response = await apiClient.get("/products", { ...params, category: categorySlug })
    return response.data! as {
      products: Product[]
      total: number
      page: number
      limit: number
    }
  },

  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    const response = await apiClient.get<Product[]>("/products/featured", { limit })
    return response.data! as Product[]
  },

}
