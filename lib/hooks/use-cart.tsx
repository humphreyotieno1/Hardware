"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { cartApi, productsApi } from "@/lib/api"
import type { Cart, Product } from "@/lib/api/types"
import { useAuth } from "@/lib/hooks/use-auth"
import { guestCart } from "@/lib/cart/guest-cart"

interface CartContextType {
  cart: Cart | null
  loading: boolean
  itemCount: number
  total: number
  addItem: (productId: string, quantity?: number, product?: Product) => Promise<void>
  updateItem: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)

  const itemCount = cart?.cart_items?.reduce((sum, item) => sum + item.quantity, 0) || 0
  const total = cart?.cart_items?.reduce((sum, item) => sum + item.quantity * item.unit_price, 0) || 0

  const refreshCart = async () => {
    if (user) {
      try {
        const cartData = await cartApi.getCart()
        setCart(cartData)
      } catch (error) {
        console.error("Failed to fetch cart:", error)
        setCart(null)
      }
      return
    }
    setCart(guestCart.get())
  }

  useEffect(() => {
    if (authLoading) return

    const initCart = async () => {
      setLoading(true)
      if (user) {
        const pending = guestCart.get().cart_items
        if (pending.length > 0) {
          try {
            for (const item of pending) {
              await cartApi.addItem({ product_id: item.product_id, quantity: item.quantity })
            }
            guestCart.clear()
          } catch (error) {
            console.error("Failed to merge guest cart:", error)
          }
        }
      }
      await refreshCart()
      setLoading(false)
    }

    initCart()
    // refreshCart is stable enough for this init; user/authLoading are the real triggers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading])

  const addItem = async (productId: string, quantity = 1, product?: Product) => {
    if (user) {
      await cartApi.addItem({ product_id: productId, quantity })
      await refreshCart()
      return
    }

    let snapshot = product
    if (!snapshot) {
      try {
        snapshot = await productsApi.getProduct(productId)
      } catch {
        throw new Error("Could not add item to cart")
      }
    }
    setCart(guestCart.add(snapshot, quantity))
  }

  const updateItem = async (itemId: string, quantity: number) => {
    if (user) {
      await cartApi.updateItem(itemId, { quantity })
      await refreshCart()
      return
    }
    setCart(guestCart.update(itemId, quantity))
  }

  const removeItem = async (itemId: string) => {
    if (user) {
      await cartApi.removeItem(itemId)
      await refreshCart()
      return
    }
    setCart(guestCart.remove(itemId))
  }

  const clearCart = async () => {
    if (user) {
      await cartApi.clearCart()
    }
    setCart(guestCart.clear())
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
