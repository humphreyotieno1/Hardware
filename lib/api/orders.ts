import { getApiClient } from "./client"
import type { Order, CreateOrderRequest, CreateOrderResponse } from "./types"

export const ordersApi = {
  async getUserOrders(): Promise<Order[]> {
    const response = await getApiClient().get<Order[]>("/orders")
    return response.data!
  },

  async createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    const response = await getApiClient().post<CreateOrderResponse>("/orders", orderData)
    return response.data!
  },

  async getOrderDetails(orderId: string): Promise<Order> {
    const response = await getApiClient().get<Order>(`/orders/${orderId}`)
    return response.data!
  },

  async cancelOrder(orderId: string): Promise<{ message: string }> {
    const response = await getApiClient().post<{ message: string }>(`/orders/${orderId}/cancel`)
    return response.data!
  },
}