"use client"

import { ProductCard } from "@/components/ui/product-card"
import type { Product } from "@/lib/api/types"

interface ProductGridProps {
  products: Product[]
  onAddToCart?: (productId: string) => void
  onAddToWishlist?: (productId: string) => void
  showCategory?: boolean
  className?: string
  gridCols?: "1" | "2" | "3" | "4" | "5" | "6"
}

export function ProductGrid({ 
  products, 
  onAddToCart, 
  onAddToWishlist, 
  showCategory = true,
  className = "",
  gridCols = "4"
}: ProductGridProps) {
  const gridColsClass = {
    "1": "grid-cols-1",
    "2": "grid-cols-1 sm:grid-cols-2",
    "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    "5": "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    "6": "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        No products found.
      </div>
    )
  }

  return (
    <div className={`grid ${gridColsClass[gridCols]} gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product}
          showCategory={showCategory}
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
        />
      ))}
    </div>
  )
}
