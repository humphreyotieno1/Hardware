import apiClient from "./client"
import type { Order, Address, ServiceRequest } from "./types"

export interface CheckoutRequest {
  address: Address
  service_request?: ServiceRequest
  payment_method: "M-Pesa" | "Card" | "Bank" | "Cash"
}

export const ordersApi = {
  async placeOrder(checkoutData: CheckoutRequest): Promise<Order> {
    const response = await apiClient.post<Order>("/checkout/place", checkoutData)
    return response.data!
  },

  async getOrders(
    page = 1,
    limit = 10,
  ): Promise<{
    orders: Order[]
    total: number
    page: number
    limit: number
  }> {
    const response = await apiClient.get("/orders", { page, limit })
    return response.data!
  },

  async getOrder(orderId: string): Promise<Order> {
    const response = await apiClient.get<Order>(`/orders/${orderId}`)
    return response.data!
  },

  async cancelOrder(orderId: string): Promise<Order> {
    const response = await apiClient.post<Order>(`/orders/${orderId}/cancel`)
    return response.data!
  },
}
