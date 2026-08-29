"use client"

import { CartDrawer } from "@/components/layout/cart-drawer"
import { SearchOverlay } from "@/components/layout/search-overlay"
import { QuickView } from "@/components/catalog/quick-view"
import { FloatingActions } from "@/components/layout/floating-actions"

export function StoreOverlays() {
  return (
    <>
      <CartDrawer />
      <SearchOverlay />
      <QuickView />
      <FloatingActions />
    </>
  )
}
