import apiClient from "./client"
import type { WishlistItem, AddToWishlistRequest } from "./types"

export const wishlistApi = {
  async getWishlist(): Promise<WishlistItem[]> {
    const response = await apiClient.get<WishlistItem[]>("/wishlist")
    return response.data!
  },

  async addItem(item: AddToWishlistRequest): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>("/wishlist/items", item)
    return response.data!
  },

  async removeItem(itemId: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/wishlist/items/${itemId}`)
    return response.data!
  },
}