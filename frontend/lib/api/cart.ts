import apiClient from "./client"
import type { Cart, CartItem } from "./types"

export const cartApi = {
  async getCart(): Promise<Cart> {
    const response = await apiClient.get<Cart>("/cart")
    return response.data!
  },

  async addItem(productId: string, quantity = 1): Promise<CartItem> {
    const response = await apiClient.post<CartItem>("/cart/items", {
      product_id: productId,
      quantity,
    })
    return response.data!
  },

  async updateItem(itemId: string, quantity: number): Promise<CartItem> {
    const response = await apiClient.put<CartItem>(`/cart/items/${itemId}`, {
      quantity,
    })
    return response.data!
  },

  async removeItem(itemId: string): Promise<void> {
    await apiClient.delete(`/cart/items/${itemId}`)
  },

  async clearCart(): Promise<void> {
    await apiClient.delete("/cart")
  },
}
