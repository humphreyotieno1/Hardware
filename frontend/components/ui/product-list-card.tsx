"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/api"
import type { Product } from "@/lib/api/types"
import { ShoppingCart, Heart, Star } from "lucide-react"

interface ProductListCardProps {
  product: Product
  onAddToCart?: (productId: string) => void
  onAddToWishlist?: (productId: string) => void
  showCategory?: boolean
  className?: string
}

export function ProductListCard({ 
  product, 
  onAddToCart, 
  onAddToWishlist, 
  showCategory = true,
  className = ""
}: ProductListCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onAddToCart) {
      onAddToCart(product.id)
    } else {
      console.log('Add to cart:', product.id)
    }
  }

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onAddToWishlist) {
      onAddToWishlist(product.id)
    } else {
      console.log('Add to wishlist:', product.id)
    }
  }

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* Image Section */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <div className="w-full h-full bg-muted rounded-lg overflow-hidden">
              {product.images_json && product.images_json.length > 0 ? (
                <img
                  src={product.images_json[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                  No Image
                </div>
              )}
            </div>
            
            {/* Stock Badge */}
            {product.stock_quantity > 0 && (
              <Badge variant="default" className="absolute -top-1 -right-1 bg-green-600 hover:bg-green-700 text-xs px-1 py-0.5">
                In Stock
              </Badge>
            )}
            {product.stock_quantity === 0 && (
              <Badge variant="secondary" className="absolute -top-1 -right-1 text-xs px-1 py-0.5">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                {/* Product Name */}
                <Link href={`/products/${product.slug}`} className="block">
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-1 text-sm mb-1">
                    {product.name}
                  </h3>
                </Link>

                {/* SKU */}
                <div className="text-xs text-muted-foreground mb-1">
                  SKU: {product.sku}
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {product.description}
                </p>

                {/* Category */}
                {showCategory && product.category && (
                  <div className="text-xs text-primary font-medium mb-2">
                    {product.category.name}
                  </div>
                )}

                {/* Star Ratings */}
                <div className="flex items-center space-x-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">(5.0)</span>
                </div>
              </div>

              {/* Right Section - Price and Actions */}
              <div className="flex flex-col items-end space-y-2 ml-4">
                {/* Price */}
                <div className="text-lg font-bold text-foreground">
                  {formatPrice(product.price)}
                </div>

                {/* Wishlist Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={handleAddToWishlist}
                >
                  <Heart className="h-4 w-4" />
                </Button>

                {/* Add to Cart Button */}
                <Button 
                  size="sm" 
                  disabled={product.stock_quantity === 0}
                  onClick={handleAddToCart}
                  className="text-xs px-3 py-1"
                >
                  <ShoppingCart className="mr-1 h-3 w-3" />
                  {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
