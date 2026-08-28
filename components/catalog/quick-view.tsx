"use client"

import { useState } from "react"
import Link from "next/link"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useStoreUi } from "@/lib/hooks/use-store-ui"
import { useCart } from "@/lib/hooks/use-cart"
import { useAuth } from "@/lib/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { formatPrice } from "@/lib/api"
import { Icon } from "@/lib/icons"
import { Loading03Icon, MinusSignIcon, PlusSignIcon, ShoppingCart01Icon } from "@hugeicons/core-free-icons"

export function QuickView() {
  const { quickViewProduct: product, closeQuickView, openCart } = useStoreUi()
  const { addItem } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(0)

  const open = Boolean(product)
  const images = product?.images_json?.length ? product.images_json : []
  const inStock = (product?.stock_quantity || 0) > 0

  const handleAdd = async () => {
    if (!product) return
    if (!user) {
      toast({ title: "Login required", description: "Please log in to add items to your cart.", variant: "destructive" })
      return
    }
    try {
      setLoading(true)
      await addItem(product.ID, qty)
      closeQuickView()
      openCart()
    } catch {
      toast({ title: "Could not add to cart", description: "Please try again.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          closeQuickView()
          setQty(1)
          setImage(0)
        }
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-3xl p-0">
        <DialogTitle className="sr-only">{product?.name || "Quick view"}</DialogTitle>
        {product ? (
          <div className="grid gap-0 md:grid-cols-2">
            <div className="bg-muted">
              <div className="relative aspect-square">
                {images[image] ? (
                  <img src={images[image]} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No image</div>
                )}
              </div>
            </div>
            <div className="flex flex-col p-6">
              {product.category ? (
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">{product.category.name}</p>
              ) : null}
              <h2 className="mt-2 font-display text-2xl font-semibold leading-tight">{product.name}</h2>
              <p className="mt-3 font-display text-3xl font-semibold">{formatPrice(product.price)}</p>
              <p className="mt-2 text-sm text-muted-foreground">{inStock ? "In stock" : "Out of stock"}</p>
              {product.description ? (
                <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
              ) : null}
              <div className="mt-6 flex items-center gap-3">
                <div className="inline-flex items-center rounded-full border">
                  <button
                    type="button"
                    className="flex size-10 items-center justify-center"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    <Icon icon={MinusSignIcon} size={16} />
                  </button>
                  <span className="min-w-8 text-center text-sm font-semibold">{qty}</span>
                  <button
                    type="button"
                    className="flex size-10 items-center justify-center"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                  >
                    <Icon icon={PlusSignIcon} size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-4 grid gap-2">
                <Button className="h-12 w-full" disabled={!inStock || loading} onClick={handleAdd}>
                  {loading ? <Icon icon={Loading03Icon} className="animate-spin" /> : <Icon icon={ShoppingCart01Icon} />}
                  {inStock ? (loading ? "Adding…" : "Add to cart") : "Out of stock"}
                </Button>
                <Button asChild variant="outline" className="h-12 w-full" onClick={closeQuickView}>
                  <Link href={`/products/${product.slug || product.ID}`}>View details</Link>
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
