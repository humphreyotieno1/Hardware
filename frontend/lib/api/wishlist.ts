import apiClient from "./client"
import type { Product } from "./types"

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  product?: Product
}

export const wishlistApi = {
  async getWishlist(): Promise<WishlistItem[]> {
    const response = await apiClient.get<WishlistItem[]>("/wishlist")
    return response.data!
  },

  async addItem(productId: string): Promise<WishlistItem> {
    const response = await apiClient.post<WishlistItem>("/wishlist/items", {
      product_id: productId,
    })
    return response.data!
  },

  async removeItem(itemId: string): Promise<void> {
    await apiClient.delete(`/wishlist/items/${itemId}`)
  },

  async isInWishlist(productId: string): Promise<boolean> {
    try {
      const wishlist = await this.getWishlist()
      return wishlist.some((item) => item.product_id === productId)
    } catch {
      return false
    }
  },
}
