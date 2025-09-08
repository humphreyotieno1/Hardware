"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/api"
import { cartApi, wishlistApi } from "@/lib/api"
import type { Product } from "@/lib/api/types"
import { ShoppingCart, Heart, Star, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: string) => void
  onAddToWishlist?: (productId: string) => void
  showCategory?: boolean
  className?: string
}

export function ProductCard({ 
  product, 
  onAddToCart, 
  onAddToWishlist, 
  showCategory = true,
  className = ""
}: ProductCardProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState({
    cart: false,
    wishlist: false
  })

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (onAddToCart) {
      onAddToCart(product.id)
      return
    }

    try {
      setLoading(prev => ({ ...prev, cart: true }))
      await cartApi.addItem({
        product_id: product.id,
        quantity: 1
      })
      
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(prev => ({ ...prev, cart: false }))
    }
  }

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (onAddToWishlist) {
      onAddToWishlist(product.id)
      return
    }

    try {
      setLoading(prev => ({ ...prev, wishlist: true }))
      await wishlistApi.addItem({
        product_id: product.id
      })
      
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      })
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      toast({
        title: "Error",
        description: "Failed to add item to wishlist. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(prev => ({ ...prev, wishlist: false }))
    }
  }

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 h-full flex flex-col ${className}`}>
      <CardContent className="p-3 flex flex-col h-full">
        {/* Image Section */}
        <div className="relative mb-3">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            {product.images_json && product.images_json.length > 0 ? (
              <img
                src={product.images_json[0] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
          </div>
          
          {/* Wishlist Button - Independent click */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-1.5 right-1.5 h-7 w-7 p-0 bg-background/80 hover:bg-background"
            onClick={handleAddToWishlist}
            disabled={loading.wishlist}
          >
            {loading.wishlist ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Heart className="h-3.5 w-3.5" />
            )}
          </Button>
          
          {/* Stock Badge */}
          {product.stock_quantity > 0 && (
            <Badge variant="default" className="absolute top-1.5 left-1.5 bg-green-600 hover:bg-green-700 text-xs px-1.5 py-0.5">
              In Stock
            </Badge>
          )}
          {product.stock_quantity === 0 && (
            <Badge variant="secondary" className="absolute top-1.5 left-1.5 text-xs px-1.5 py-0.5">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Content Section */}
        <div className="space-y-2 flex-1 flex flex-col">
          {/* Product Name - Clickable */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2 text-sm leading-tight">
              {product.name}
            </h3>
          </Link>

          {/* SKU */}
          <div className="text-xs text-muted-foreground">
            SKU: {product.sku}
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-1 flex-1">
            {product.description}
          </p>

          {/* Category */}
          {showCategory && product.category && (
            <div className="text-xs text-primary font-medium">
              {product.category.name}
            </div>
          )}

          {/* Star Ratings */}
          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-xs text-muted-foreground ml-1">(5.0)</span>
          </div>

          {/* Price */}
          <div className="text-base font-bold text-foreground">
            {formatPrice(product.price)}
          </div>

          {/* Add to Cart Button - Independent click */}
          <Button 
            className="w-full mt-auto text-sm py-2" 
            disabled={product.stock_quantity === 0 || loading.cart}
            onClick={handleAddToCart}
          >
            {loading.cart ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
            )}
            {loading.cart ? "Adding..." : product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
