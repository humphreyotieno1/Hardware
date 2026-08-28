"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"
import type { Product } from "@/lib/api/types"

type StoreUiContextType = {
  cartOpen: boolean
  searchOpen: boolean
  quickViewProduct: Product | null
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  openSearch: () => void
  closeSearch: () => void
  openQuickView: (product: Product) => void
  closeQuickView: () => void
}

const StoreUiContext = createContext<StoreUiContextType | undefined>(undefined)

export function StoreUiProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  const openCart = useCallback(() => setCartOpen(true), [])
  const closeCart = useCallback(() => setCartOpen(false), [])
  const toggleCart = useCallback(() => setCartOpen((v) => !v), [])
  const openSearch = useCallback(() => setSearchOpen(true), [])
  const closeSearch = useCallback(() => setSearchOpen(false), [])
  const openQuickView = useCallback((product: Product) => setQuickViewProduct(product), [])
  const closeQuickView = useCallback(() => setQuickViewProduct(null), [])

  const value = useMemo(
    () => ({
      cartOpen,
      searchOpen,
      quickViewProduct,
      openCart,
      closeCart,
      toggleCart,
      openSearch,
      closeSearch,
      openQuickView,
      closeQuickView,
    }),
    [cartOpen, searchOpen, quickViewProduct, openCart, closeCart, toggleCart, openSearch, closeSearch, openQuickView, closeQuickView]
  )

  return <StoreUiContext.Provider value={value}>{children}</StoreUiContext.Provider>
}

export function useStoreUi() {
  const ctx = useContext(StoreUiContext)
  if (!ctx) throw new Error("useStoreUi must be used within StoreUiProvider")
  return ctx
}
