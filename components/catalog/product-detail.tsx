"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { productsApi, formatPrice } from "@/lib/api"
import type { Product } from "@/lib/api/types"
import { useCart } from "@/lib/hooks/use-cart"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/hooks/use-auth"
import { useStoreUi } from "@/lib/hooks/use-store-ui"
import { Icon } from "@/lib/icons"
import { FavouriteIcon, Loading03Icon, MinusSignIcon, PlusSignIcon, RepeatIcon, ShoppingCart01Icon, TruckDeliveryIcon } from "@hugeicons/core-free-icons"
import { ProductGallery } from "@/components/catalog/product-gallery"
import { RelatedProducts } from "@/components/catalog/related-products"
import { env } from "@/lib/config/env"
import { cn } from "@/lib/utils"

interface ProductDetailProps {
  productSlug: string
}

export function ProductDetail({ productSlug }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null)
  const [showSticky, setShowSticky] = useState(false)
  const buyBoxRef = useRef<HTMLDivElement>(null)

  const { toast } = useToast()
  const { user } = useAuth()
  const { addItem: addToCart } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, wishlistItems } = useWishlist()
  const { openCart } = useStoreUi()

  useEffect(() => {
    if (!product) return
    const wishlistItem = wishlistItems.find((item) => item.product_id === product.ID)
    setIsInWishlist(Boolean(wishlistItem))
    setWishlistItemId(wishlistItem?.ID ?? null)
  }, [wishlistItems, product])

  useEffect(() => {
    const node = buyBoxRef.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting), { threshold: 0.2 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [product])

  const handleAddToCart = async () => {
    if (!product) return
    if (!user) {
      toast({ title: "Login required", description: "Please log in to add items to your cart.", variant: "destructive" })
      return
    }
    try {
      setIsAddingToCart(true)
      await addToCart(product.ID, quantity)
      openCart()
    } catch {
      toast({ title: "Error", description: "Failed to add item to cart. Please try again.", variant: "destructive" })
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleWishlistToggle = async () => {
    if (!product) return
    if (!user) {
      toast({ title: "Login required", description: "Please log in to manage your wishlist.", variant: "destructive" })
      return
    }
    try {
      setIsAddingToWishlist(true)
      if (isInWishlist && wishlistItemId) await removeFromWishlist(wishlistItemId)
      else await addToWishlist(product.ID)
    } catch {
      toast({ title: "Error", description: "Failed to update wishlist. Please try again.", variant: "destructive" })
    } finally {
      setIsAddingToWishlist(false)
    }
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await productsApi.getProduct(productSlug)
        setProduct(productData)
        if (productData.category) {
          try {
            const relatedData = await productsApi.getProductsByCategory(productData.category.slug, { limit: 8 })
            setRelatedProducts(relatedData.products.filter((p) => p.ID !== productData.ID).slice(0, 8))
          } catch {
            setRelatedProducts([])
          }
        }
      } catch {
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [productSlug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid animate-pulse grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="aspect-square rounded-3xl bg-muted" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded-full bg-muted" />
            <div className="h-6 w-1/2 rounded-full bg-muted" />
            <div className="h-24 rounded-3xl bg-muted" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-semibold">Product not found</h1>
        <p className="mt-2 text-muted-foreground">This product is unavailable or no longer listed.</p>
        <Button asChild className="mt-6">
          <Link href="/shop">Browse products</Link>
        </Button>
      </div>
    )
  }

  const images = product.images_json?.length ? product.images_json : ["/placeholder.svg"]
  const inStock = product.stock_quantity > 0

  return (
    <div className="container mx-auto px-4 py-6 pb-28 sm:py-8 lg:pb-8">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-foreground">Shop</Link>
        {product.category ? (
          <>
            <span>/</span>
            <Link href={`/categories/${product.category.slug}`} className="hover:text-foreground">
              {product.category.name}
            </Link>
          </>
        ) : null}
        <span>/</span>
        <span className="font-medium text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={images} name={product.name} />

        <div className="space-y-6">
          {product.category ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{product.category.name}</p>
          ) : null}
          <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">{product.name}</h1>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <p className="font-display text-3xl font-semibold">{formatPrice(product.price)}</p>
            <Badge className={cn("rounded-full", inStock ? "bg-emerald-700" : "bg-muted text-muted-foreground")}>
              {inStock ? `${product.stock_quantity} in stock` : "Out of stock"}
            </Badge>
          </div>
          {product.description ? (
            <p className="leading-relaxed text-muted-foreground">{product.description}</p>
          ) : null}

          <div ref={buyBoxRef} className="space-y-4 rounded-3xl border bg-card p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Quantity</span>
              <div className="inline-flex items-center rounded-full border">
                <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1} aria-label="Decrease quantity">
                  <Icon icon={MinusSignIcon} size={16} />
                </Button>
                <span className="min-w-10 text-center text-sm font-semibold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.min(Math.max(product.stock_quantity, 1), quantity + 1))}
                  disabled={!inStock || quantity >= product.stock_quantity}
                  aria-label="Increase quantity"
                >
                  <Icon icon={PlusSignIcon} size={16} />
                </Button>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button className="h-12" disabled={!inStock || isAddingToCart} onClick={handleAddToCart}>
                {isAddingToCart ? <Icon icon={Loading03Icon} className="animate-spin" /> : <Icon icon={ShoppingCart01Icon} />}
                {!inStock ? "Out of stock" : isAddingToCart ? "Adding…" : "Add to cart"}
              </Button>
              <Button variant="outline" className="h-12" disabled={isAddingToWishlist} onClick={handleWishlistToggle}>
                {isAddingToWishlist ? <Icon icon={Loading03Icon} className="animate-spin" /> : <Icon icon={FavouriteIcon} className={isInWishlist ? "text-primary" : ""} />}
                {isInWishlist ? "Wishlisted" : "Wishlist"}
              </Button>
            </div>
            <Button asChild variant="secondary" className="h-12 w-full">
              <a href={env.getWhatsAppUrl(`Hello! I’m interested in ${product.name} (SKU: ${product.sku}).`)}>Enquire on WhatsApp</a>
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex gap-3 rounded-3xl border bg-card p-4">
              <Icon icon={TruckDeliveryIcon} className="text-primary" />
              <div>
                <p className="text-sm font-semibold">Delivery</p>
                <p className="text-xs text-muted-foreground">Siaya and surrounding areas</p>
              </div>
            </div>
            <div className="flex gap-3 rounded-3xl border bg-card p-4">
              <Icon icon={RepeatIcon} className="text-primary" />
              <div>
                <p className="text-sm font-semibold">Returns</p>
                <p className="text-xs text-muted-foreground">See our returns policy</p>
              </div>
            </div>
          </div>

          <Accordion type="single" collapsible defaultValue="details" className="rounded-3xl border px-4">
            <AccordionItem value="details">
              <AccordionTrigger>Product details</AccordionTrigger>
              <AccordionContent>
                <dl className="grid gap-2 text-sm">
                  {product.sku ? (
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">SKU</dt>
                      <dd>{product.sku}</dd>
                    </div>
                  ) : null}
                  {product.category ? (
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Category</dt>
                      <dd>{product.category.name}</dd>
                    </div>
                  ) : null}
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Availability</dt>
                    <dd>{inStock ? "In stock" : "Out of stock"}</dd>
                  </div>
                </dl>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {showSticky ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 p-3 backdrop-blur lg:hidden">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{product.name}</p>
              <p className="font-display text-lg font-semibold">{formatPrice(product.price)}</p>
            </div>
            <Button className="min-h-11 shrink-0" disabled={!inStock || isAddingToCart} onClick={handleAddToCart}>
              {isAddingToCart ? <Icon icon={Loading03Icon} className="animate-spin" /> : <Icon icon={ShoppingCart01Icon} />}
              {inStock ? "Add" : "Out of stock"}
            </Button>
          </div>
        </div>
      ) : null}

      <RelatedProducts products={relatedProducts} />
    </div>
  )
}
