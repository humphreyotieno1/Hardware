"use client"

import { CartDrawer } from "@/components/layout/cart-drawer"
import { SearchOverlay } from "@/components/layout/search-overlay"
import { QuickView } from "@/components/catalog/quick-view"

export function StoreOverlays() {
  return (
    <>
      <CartDrawer />
      <SearchOverlay />
      <QuickView />
    </>
  )
}
