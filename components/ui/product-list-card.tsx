"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/api"
import type { Product, WishlistItem } from "@/lib/api/types"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/hooks/use-auth"
import { useCart } from "@/lib/hooks/use-cart"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { useStoreUi } from "@/lib/hooks/use-store-ui"
import { Icon } from "@/lib/icons"
import { FavouriteIcon, Loading03Icon, ShoppingCart01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

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
  className = "",
}: ProductListCardProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const { addItem: addToCart } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, wishlistItems } = useWishlist()
  const { openCart, openQuickView } = useStoreUi()
  const [loading, setLoading] = useState({ cart: false, wishlist: false })
  const [added, setAdded] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null)

  useEffect(() => {
    const wishlistItem = wishlistItems.find((item: WishlistItem) => item.product_id === product.ID)
    setIsInWishlist(Boolean(wishlistItem))
    setWishlistItemId(wishlistItem?.ID ?? null)
  }, [wishlistItems, product.ID])

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onAddToCart) {
      onAddToCart(product.ID)
      return
    }
    if (!user) {
      toast({ title: "Login required", description: "Please log in to add items to your cart.", variant: "destructive" })
      return
    }
    try {
      setLoading((prev) => ({ ...prev, cart: true }))
      await addToCart(product.ID, 1)
      setAdded(true)
      openCart()
      window.setTimeout(() => setAdded(false), 1600)
    } catch {
      toast({ title: "Error", description: "Failed to add item to cart.", variant: "destructive" })
    } finally {
      setLoading((prev) => ({ ...prev, cart: false }))
    }
  }

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onAddToWishlist) {
      onAddToWishlist(product.ID)
      return
    }
    if (!user) {
      toast({ title: "Login required", description: "Please log in to manage your wishlist.", variant: "destructive" })
      return
    }
    try {
      setLoading((prev) => ({ ...prev, wishlist: true }))
      if (isInWishlist && wishlistItemId) await removeFromWishlist(wishlistItemId)
      else await addToWishlist(product.ID)
    } catch {
      toast({ title: "Error", description: "Failed to update wishlist.", variant: "destructive" })
    } finally {
      setLoading((prev) => ({ ...prev, wishlist: false }))
    }
  }

  const productUrl = `/products/${product.slug || product.ID}`
  const inStock = product.stock_quantity > 0

  return (
    <article className={cn("group flex gap-4 overflow-hidden rounded-none border bg-card p-3 transition-all duration-300 hover:shadow-md sm:p-4", className)}>
      <Link href={productUrl} className="relative h-28 w-28 shrink-0 overflow-hidden bg-muted sm:h-32 sm:w-32">
        {product.images_json?.[0] ? (
          <img src={product.images_json[0]} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No image</div>
        )}
      </Link>
      <div className="min-w-0 flex-1">
        {showCategory && product.category ? (
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{product.category.name}</p>
        ) : null}
        <Link href={productUrl}>
          <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold hover:text-primary sm:text-base">{product.name}</h3>
        </Link>
        {product.sku ? <p className="mt-1 text-xs text-muted-foreground">SKU: {product.sku}</p> : null}
        <p className="mt-2 font-display text-lg font-semibold">{formatPrice(product.price)}</p>
        <p className="text-xs text-muted-foreground">{inStock ? "In stock" : "Out of stock"}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" disabled={!inStock || loading.cart} onClick={handleAddToCart}>
            {loading.cart ? <Icon icon={Loading03Icon} size={14} className="animate-spin" /> : <Icon icon={ShoppingCart01Icon} size={14} />}
            {added ? "Added" : inStock ? "Add to cart" : "Out of stock"}
          </Button>
          <Button size="sm" variant="outline" className="hidden sm:inline-flex" onClick={(e) => { e.preventDefault(); openQuickView(product) }}>
            Quick view
          </Button>
          <button
            type="button"
            onClick={handleWishlistToggle}
            disabled={loading.wishlist}
            className="flex size-9 items-center justify-center rounded-full border"
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            {loading.wishlist ? (
              <Icon icon={Loading03Icon} size={16} className="animate-spin" />
            ) : (
              <Icon icon={FavouriteIcon} size={16} className={isInWishlist ? "text-primary" : ""} />
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
