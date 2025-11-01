import { getApiClient } from "./client"
import type { Cart, AddToCartRequest, UpdateCartItemRequest } from "./types"

export const cartApi = {
  async getCart(): Promise<Cart> {
    const response = await getApiClient().get<Cart>("/cart")
    return response.data!
  },

  async addItem(item: AddToCartRequest): Promise<{ message: string }> {
    const response = await getApiClient().post<{ message: string }>("/cart/items", item)
    return response.data!
  },

  async updateItem(itemId: string, update: UpdateCartItemRequest): Promise<{ message: string }> {
    const response = await getApiClient().put<{ message: string }>(`/cart/items/${itemId}`, update)
    return response.data!
  },

  async removeItem(itemId: string): Promise<{ message: string }> {
    const response = await getApiClient().delete<{ message: string }>(`/cart/items/${itemId}`)
    return response.data!
  },

  async clearCart(): Promise<{ message: string }> {
    const response = await getApiClient().delete<{ message: string }>("/cart")
    return response.data!
  },
}