import apiClient from "./client"
import type { Order, CreateOrderRequest, CreateOrderResponse } from "./types"

export const ordersApi = {
  async getUserOrders(): Promise<Order[]> {
    const response = await apiClient.get<Order[]>("/orders")
    return response.data!
  },

  async createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    const response = await apiClient.post<CreateOrderResponse>("/orders", orderData)
    return response.data!
  },

  async getOrderDetails(orderId: string): Promise<Order> {
    const response = await apiClient.get<Order>(`/orders/${orderId}`)
    return response.data!
  },

  async cancelOrder(orderId: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(`/orders/${orderId}/cancel`)
    return response.data!
  },
}