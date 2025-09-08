"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Heart, ArrowLeft, ShoppingCart, Trash2, Package, 
  Loader2, AlertCircle 
} from "lucide-react"
import { cartApi } from "@/lib/api"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { useCart } from "@/lib/hooks/use-cart"
import type { WishlistItem } from "@/lib/api/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { formatPrice } from "@/lib/api"

export function WishlistPage() {
  const { toast } = useToast()
  const { wishlistItems, removeItem: removeFromWishlistHook, loading: wishlistLoading } = useWishlist()
  const { addItem: addToCart } = useCart()
  const [loading, setLoading] = useState({
    removing: false,
    adding: false
  })


  const removeFromWishlist = async (itemId: string) => {
    try {
      setLoading(prev => ({ ...prev, removing: true }))
      await removeFromWishlistHook(itemId)
      
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist.",
      })
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(prev => ({ ...prev, removing: false }))
    }
  }

  const addToCartFromWishlist = async (productId: string, productName: string) => {
    try {
      setLoading(prev => ({ ...prev, adding: true }))
      await addToCart(productId, 1)
      
      toast({
        title: "Added to cart",
        description: `${productName} has been added to your cart.`,
      })
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(prev => ({ ...prev, adding: false }))
    }
  }

  if (wishlistLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading wishlist...</span>
        </div>
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">My Wishlist</h1>
              <p className="text-muted-foreground">Your saved items</p>
            </div>
          </div>

          {/* Empty Wishlist */}
          <Card>
            <CardContent className="py-12 text-center">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-6">
                Save items you love by clicking the heart icon on any product.
              </p>
              <Link href="/products">
                <Button>
                  <Package className="h-4 w-4 mr-2" />
                  Browse Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <Card key={item.ID} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                {/* Product Image */}
                <div className="relative mb-4">
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                    {item.product?.images_json?.[0] ? (
                      <img
                        src={item.product.images_json[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>
                  
                  {/* Remove from Wishlist Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0 bg-background/80 hover:bg-background"
                    onClick={() => removeFromWishlist(item.ID)}
                    disabled={loading.removing}
                  >
                    {loading.removing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                  
                  {/* Stock Badge */}
                  {item.product?.stock_quantity && item.product.stock_quantity > 0 ? (
                    <Badge variant="default" className="absolute top-2 left-2 bg-green-600 hover:bg-green-700 text-xs px-2 py-1">
                      In Stock
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="absolute top-2 left-2 text-xs px-2 py-1">
                      Out of Stock
                    </Badge>
                  )}
                </div>

                {/* Product Details */}
                <div className="space-y-2">
                  <Link href={`/products/${item.product?.slug}`}>
                    <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
                      {item.product?.name || 'Product'}
                    </h3>
                  </Link>
                  
                  <p className="text-sm text-muted-foreground">
                    SKU: {item.product?.sku || 'N/A'}
                  </p>
                  
                  {item.product?.category && (
                    <Badge variant="outline" className="text-xs">
                      {item.product.category.name}
                    </Badge>
                  )}
                  
                  <div className="text-lg font-bold text-primary">
                    {formatPrice(item.product?.price || 0)}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      disabled={(item.product?.stock_quantity || 0) <= 0 || loading.adding}
                      onClick={() => addToCartFromWishlist(item.product_id, item.product?.name || 'Product')}
                    >
                      {loading.adding ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <ShoppingCart className="h-4 w-4 mr-2" />
                      )}
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex justify-center">
          <Link href="/products">
            <Button variant="outline">
              <Package className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}