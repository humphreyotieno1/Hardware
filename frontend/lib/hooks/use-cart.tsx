"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { cartApi } from "@/lib/api"
import type { Cart } from "@/lib/api/types"

interface CartContextType {
  cart: Cart | null
  loading: boolean
  itemCount: number
  total: number
  addItem: (productId: string, quantity?: number) => Promise<void>
  updateItem: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
  const total = cart?.items?.reduce((sum, item) => sum + item.quantity * item.unit_price, 0) || 0

  const refreshCart = async () => {
    try {
      const cartData = await cartApi.getCart()
      setCart(cartData)
    } catch (error) {
      console.error("Failed to fetch cart:", error)
      setCart(null)
    }
  }

  useEffect(() => {
    const initCart = async () => {
      setLoading(true)
      await refreshCart()
      setLoading(false)
    }

    initCart()
  }, [])

  const addItem = async (productId: string, quantity = 1) => {
    try {
      await cartApi.addItem(productId, quantity)
      await refreshCart()
    } catch (error) {
      console.error("Failed to add item to cart:", error)
      throw error
    }
  }

  const updateItem = async (itemId: string, quantity: number) => {
    try {
      await cartApi.updateItem(itemId, quantity)
      await refreshCart()
    } catch (error) {
      console.error("Failed to update cart item:", error)
      throw error
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      await cartApi.removeItem(itemId)
      await refreshCart()
    } catch (error) {
      console.error("Failed to remove cart item:", error)
      throw error
    }
  }

  const clearCart = async () => {
    try {
      await cartApi.clearCart()
      setCart(null)
    } catch (error) {
      console.error("Failed to clear cart:", error)
      throw error
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemCount,
        total,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
