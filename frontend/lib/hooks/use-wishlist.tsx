"use client"

import { useState, useEffect, useCallback } from "react"

export interface WishlistItem {
  id: string
  product: {
    id: string
    name: string
    price: number
    comparePrice: number
    image: string
    category: string
    brand: string
    rating: number
    reviewCount: number
    inStock: boolean
    stockCount: number
  }
  addedAt: string
  notes?: string
}

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const stored = localStorage.getItem("hardware-store-wishlist")
        if (stored) {
          setWishlistItems(JSON.parse(stored))
        }
      } catch (error) {
        console.error("Failed to load wishlist from localStorage:", error)
      } finally {
        setLoading(false)
      }
    }

    loadWishlist()
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("hardware-store-wishlist", JSON.stringify(wishlistItems))
    }
  }, [wishlistItems, loading])

  // Add item to wishlist
  const addToWishlist = useCallback((product: WishlistItem["product"], notes?: string) => {
    setWishlistItems(prev => {
      // Check if product already exists in wishlist
      const existingIndex = prev.findIndex(item => item.product.id === product.id)
      
      if (existingIndex >= 0) {
        // Update existing item
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          notes: notes || updated[existingIndex].notes,
          addedAt: new Date().toISOString()
        }
        return updated
      } else {
        // Add new item
        const newItem: WishlistItem = {
          id: `wish-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          product,
          addedAt: new Date().toISOString(),
          notes
        }
        return [...prev, newItem]
      }
    })
  }, [])

  // Remove item from wishlist
  const removeFromWishlist = useCallback((productId: string) => {
    setWishlistItems(prev => prev.filter(item => item.product.id !== productId))
  }, [])

  // Remove wishlist item by wishlist item ID
  const removeWishlistItem = useCallback((wishlistItemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== wishlistItemId))
  }, [])

  // Update wishlist item notes
  const updateWishlistItemNotes = useCallback((wishlistItemId: string, notes: string) => {
    setWishlistItems(prev => 
      prev.map(item => 
        item.id === wishlistItemId 
          ? { ...item, notes }
          : item
      )
    )
  }, [])

  // Check if product is in wishlist
  const isInWishlist = useCallback((productId: string) => {
    return wishlistItems.some(item => item.product.id === productId)
  }, [wishlistItems])

  // Get wishlist item count
  const itemCount = wishlistItems.length

  // Clear entire wishlist
  const clearWishlist = useCallback(() => {
    setWishlistItems([])
  }, [])

  // Move item to cart (this would integrate with cart hook)
  const moveToCart = useCallback((wishlistItemId: string) => {
    // TODO: Integrate with cart hook to actually add to cart
    console.log("Moving wishlist item to cart:", wishlistItemId)
    
    // For now, just remove from wishlist
    removeWishlistItem(wishlistItemId)
  }, [removeWishlistItem])

  // Bulk operations
  const removeMultipleItems = useCallback((wishlistItemIds: string[]) => {
    setWishlistItems(prev => prev.filter(item => !wishlistItemIds.includes(item.id)))
  }, [])

  const moveMultipleToCart = useCallback((wishlistItemIds: string[]) => {
    // TODO: Integrate with cart hook
    wishlistItemIds.forEach(moveToCart)
  }, [moveToCart])

  return {
    wishlistItems,
    loading,
    itemCount,
    addToWishlist,
    removeFromWishlist,
    removeWishlistItem,
    updateWishlistItemNotes,
    isInWishlist,
    clearWishlist,
    moveToCart,
    removeMultipleItems,
    moveMultipleToCart
  }
}
