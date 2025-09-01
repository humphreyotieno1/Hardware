import apiClient from "./client"
import type { Product, Category, Order, AdminStats, User } from "./types"

export interface CreateProductRequest {
  sku: string
  name: string
  slug: string
  category_id: string
  description: string
  price: number
  stock_quantity: number
  images_json: string[]
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string
}

export const adminApi = {
  // Categories Management
  async createCategory(data: { name: string; slug: string }): Promise<Category> {
    const response = await apiClient.post<Category>("/admin/categories", data)
    return response.data!
  },

  async updateCategory(id: string, data: Partial<{ name: string; slug: string }>): Promise<Category> {
    const response = await apiClient.put<Category>(`/admin/categories/${id}`, data)
    return response.data!
  },

  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete(`/admin/categories/${id}`)
  },

  // Products Management
  async createProduct(data: CreateProductRequest): Promise<Product> {
    const response = await apiClient.post<Product>("/admin/products", data)
    return response.data!
  },

  async updateProduct(data: UpdateProductRequest): Promise<Product> {
    const { id, ...updateData } = data
    const response = await apiClient.put<Product>(`/admin/products/${id}`, updateData)
    return response.data!
  },

  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`/admin/products/${id}`)
  },

  async updateInventory(productId: string, stockQuantity: number): Promise<Product> {
    const response = await apiClient.put<Product>("/admin/inventory", {
      product_id: productId,
      stock_quantity: stockQuantity,
    })
    return response.data!
  },

  // Orders Management
  async getAdminOrders(
    page = 1,
    limit = 20,
  ): Promise<{
    orders: Order[]
    total: number
    page: number
    limit: number
  }> {
    const response = await apiClient.get("/admin/orders", { page, limit })
    return response.data!
  },

  async updateOrderStatus(orderId: string, status: Order["status"]): Promise<Order> {
    const response = await apiClient.put<Order>(`/admin/orders/${orderId}`, { status })
    return response.data!
  },

  // Users Management
  async getUsers(
    page = 1,
    limit = 20,
  ): Promise<{
    users: User[]
    total: number
    page: number
    limit: number
  }> {
    const response = await apiClient.get("/admin/users", { page, limit })
    return response.data!
  },

  async updateUserRole(userId: string, role: User["role"]): Promise<User> {
    const response = await apiClient.put<User>(`/admin/users/${userId}`, { role })
    return response.data!
  },

  // Reports & Analytics
  async getStats(): Promise<AdminStats> {
    const response = await apiClient.get<AdminStats>("/admin/reports")
    return response.data!
  },

  async getSalesReport(
    startDate: string,
    endDate: string,
  ): Promise<{
    total_revenue: number
    total_orders: number
    daily_sales: Array<{ date: string; revenue: number; orders: number }>
  }> {
    const response = await apiClient.get("/admin/reports/sales", {
      start_date: startDate,
      end_date: endDate,
    })
    return response.data!
  },
}
