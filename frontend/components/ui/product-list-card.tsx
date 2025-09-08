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
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/hooks/use-auth"
import { useCart } from "@/lib/hooks/use-cart"
import { useWishlist } from "@/lib/hooks/use-wishlist"

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
  const { toast } = useToast()
  const { user } = useAuth()
  const { addItem: addToCart } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, wishlistItems } = useWishlist()
  const [loading, setLoading] = useState({
    cart: false,
    wishlist: false
  })
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null)

  // Check if product is in wishlist using hook data
  useEffect(() => {
    const wishlistItem = wishlistItems.find(item => item.product_id === product.ID)
    if (wishlistItem) {
      setIsInWishlist(true)
      setWishlistItemId(wishlistItem.ID)
    } else {
      setIsInWishlist(false)
      setWishlistItemId(null)
    }
  }, [wishlistItems, product.ID])

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (onAddToCart) {
      onAddToCart(product.ID)
      return
    }

    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart.",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(prev => ({ ...prev, cart: true }))
      await addToCart(product.ID, 1)
      
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

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (onAddToWishlist) {
      onAddToWishlist(product.ID)
      return
    }

    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to manage your wishlist.",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(prev => ({ ...prev, wishlist: true }))
      
      if (isInWishlist && wishlistItemId) {
        // Remove from wishlist
        await removeFromWishlist(wishlistItemId)
        toast({
          title: "Removed from wishlist",
          description: `${product.name} has been removed from your wishlist.`,
        })
      } else {
        // Add to wishlist
        await addToWishlist(product.ID)
        toast({
          title: "Added to wishlist",
          description: `${product.name} has been added to your wishlist.`,
        })
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(prev => ({ ...prev, wishlist: false }))
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
                  className={`h-8 w-8 p-0 ${
                    isInWishlist ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'
                  }`}
                  onClick={handleWishlistToggle}
                  disabled={loading.wishlist}
                >
                  {loading.wishlist ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isInWishlist ? (
                    <Heart className="h-4 w-4 fill-current" />
                  ) : (
                    <Heart className="h-4 w-4" />
                  )}
                </Button>

                {/* Add to Cart Button */}
                <Button 
                  size="sm" 
                  disabled={product.stock_quantity === 0 || loading.cart}
                  onClick={handleAddToCart}
                  className="text-xs px-3 py-1"
                >
                  {loading.cart ? (
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  ) : (
                    <ShoppingCart className="mr-1 h-3 w-3" />
                  )}
                  {loading.cart ? "Adding..." : product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
