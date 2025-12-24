"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/api"
import { cartApi, wishlistApi } from "@/lib/api"
import type { Product, WishlistItem } from "@/lib/api/types"
import { ShoppingCart, Heart, Star, Loader2, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect, memo } from "react"
import { useAuth } from "@/lib/hooks/use-auth"
import { useCart } from "@/lib/hooks/use-cart"
import { useWishlist } from "@/lib/hooks/use-wishlist"


interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: string) => void
  onAddToWishlist?: (productId: string) => void
  showCategory?: boolean
  className?: string
}

export const ProductCard = memo(function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  showCategory = true,
  className = ""
}: ProductCardProps) {
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
    const wishlistItem = wishlistItems.find((item: WishlistItem) => item.product_id === product.ID)
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
    <div className={`group relative h-full ${className}`}>
      <div className="h-full bg-background border border-border/40 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-border/80 hover:-translate-y-1">
        {/* Image Section with overlay */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Link href={`/products/${product.slug}`} className="block w-full h-full">
            {product.images_json && product.images_json.length > 0 ? (
              <Image
                src={product.images_json[0] || "/placeholder.svg"}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                No Image
              </div>
            )}
          </Link>

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Wishlist Button - Top right with independent hover */}
          <button
            onClick={handleWishlistToggle}
            disabled={loading.wishlist}
            className={`absolute top-3 right-3 z-10 h-9 w-9 rounded-full flex items-center justify-center transition-all duration-200 ${isInWishlist
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white/90 text-muted-foreground hover:bg-red-500 hover:text-white hover:scale-110 shadow-md'
              }`}
          >
            {loading.wishlist ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
            )}
          </button>

          {/* Stock Badge - Top left */}
          <div className="absolute top-3 left-3 z-10">
            {product.stock_quantity > 0 ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500 text-white shadow-sm">
                In Stock
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                Out of Stock
              </span>
            )}
          </div>

          {/* Quick Add Button - Appears on hover at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0 || loading.cart}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading.cart ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-2">
          {/* Category Tag */}
          {showCategory && product.category && (
            <span className="inline-block text-xs font-medium text-primary/80 uppercase tracking-wide">
              {product.category.name}
            </span>
          )}

          {/* Product Name - Clickable */}
          <Link href={`/products/${product.slug}`} className="block group/title">
            <h3 className="font-semibold text-foreground leading-snug line-clamp-2 group-hover/title:text-primary transition-colors duration-200">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">(5.0)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-lg font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
})
