"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { wishlistApi } from "@/lib/api"
import type { WishlistItem } from "@/lib/api/types"

interface WishlistContextType {
  wishlistItems: WishlistItem[]
  loading: boolean
  itemCount: number
  addItem: (productId: string) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  refreshWishlist: () => Promise<void>
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  const itemCount = wishlistItems.length

  const refreshWishlist = async () => {
    try {
      const wishlistData = await wishlistApi.getWishlist()
      setWishlistItems(wishlistData)
    } catch (error) {
      console.error("Failed to fetch wishlist:", error)
      setWishlistItems([])
    }
  }

  useEffect(() => {
    const initWishlist = async () => {
      setLoading(true)
      await refreshWishlist()
      setLoading(false)
    }

    initWishlist()
  }, [])

  const addItem = async (productId: string) => {
    try {
      await wishlistApi.addItem({ product_id: productId })
      await refreshWishlist()
    } catch (error) {
      console.error("Failed to add item to wishlist:", error)
      throw error
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      await wishlistApi.removeItem(itemId)
      await refreshWishlist()
    } catch (error) {
      console.error("Failed to remove wishlist item:", error)
      throw error
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        itemCount,
        addItem,
        removeItem,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}