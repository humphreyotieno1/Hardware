"use client"

import Link from "next/link"
import Image from "next/image"
import type { Product, WishlistItem } from "@/lib/api/types"
import { formatPrice } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect, memo } from "react"
import { useAuth } from "@/lib/hooks/use-auth"
import { useCart } from "@/lib/hooks/use-cart"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { useStoreUi } from "@/lib/hooks/use-store-ui"
import { Icon } from "@/lib/icons"
import { EyeIcon, FavouriteIcon, Loading03Icon, ShoppingCart01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

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
  className = "",
}: ProductCardProps) {
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
    try {
      setLoading((prev) => ({ ...prev, cart: true }))
      await addToCart(product.ID, 1, product)
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
      if (isInWishlist && wishlistItemId) {
        await removeFromWishlist(wishlistItemId)
      } else {
        await addToWishlist(product.ID)
      }
    } catch {
      toast({ title: "Error", description: "Failed to update wishlist.", variant: "destructive" })
    } finally {
      setLoading((prev) => ({ ...prev, wishlist: false }))
    }
  }

  const productUrl = `/products/${product.slug || product.ID}`
  const images = product.images_json || []

  return (
    <article className={cn("group flex h-full flex-col overflow-hidden rounded-none border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md", className)}>
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link href={productUrl} className="block h-full w-full">
          {images[0] ? (
            <>
              <Image
                src={images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                className={cn("object-cover transition-all duration-500 group-hover:scale-105", images[1] && "group-hover:opacity-0")}
                loading="lazy"
              />
              {images[1] ? (
                <Image
                  src={images[1]}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  loading="lazy"
                />
              ) : null}
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">No image</div>
          )}
        </Link>
        <button
          type="button"
          onClick={handleWishlistToggle}
          disabled={loading.wishlist}
          className="absolute right-2 top-2 z-10 flex size-8 items-center justify-center rounded-full bg-card/95 shadow-sm transition hover:scale-105"
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          {loading.wishlist ? (
            <Icon icon={Loading03Icon} size={14} className="animate-spin" />
          ) : (
            <Icon icon={FavouriteIcon} size={14} strokeWidth={isInWishlist ? 2 : 1.5} className={isInWishlist ? "text-primary" : ""} />
          )}
        </button>
        <div className="absolute inset-x-2 bottom-2 z-10 hidden translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:flex md:gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              openQuickView(product)
            }}
            className="flex h-8 flex-1 items-center justify-center gap-1 rounded-full bg-card text-[11px] font-semibold shadow-sm hover:bg-muted"
          >
            <Icon icon={EyeIcon} size={13} /> View
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={loading.cart}
            className="flex h-8 flex-1 items-center justify-center gap-1 rounded-full bg-primary text-[11px] font-semibold text-primary-foreground shadow-sm disabled:opacity-50"
          >
            {loading.cart ? <Icon icon={Loading03Icon} size={13} className="animate-spin" /> : <Icon icon={ShoppingCart01Icon} size={13} />}
            {added ? "Added" : "Add"}
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-2.5">
        {showCategory && product.category ? (
          <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">{product.category.name}</p>
        ) : null}
        <Link href={productUrl} className="mt-0.5">
          <h3 className="line-clamp-2 min-h-8 text-xs font-semibold leading-snug transition-colors hover:text-primary sm:text-sm">{product.name}</h3>
        </Link>
        <p className="mt-1.5 font-display text-sm font-semibold sm:text-base">{formatPrice(product.price)}</p>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={loading.cart}
          className="mt-2 inline-flex min-h-8 w-full items-center justify-center gap-1.5 rounded-full bg-secondary text-[11px] font-semibold text-secondary-foreground transition hover:bg-secondary/90 disabled:opacity-50 md:hidden"
        >
          {loading.cart ? <Icon icon={Loading03Icon} size={14} className="animate-spin" /> : <Icon icon={ShoppingCart01Icon} size={14} />}
          {added ? "Added" : "Add to cart"}
        </button>
      </div>
    </article>
  )
})
