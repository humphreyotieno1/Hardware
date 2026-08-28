"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCart } from "@/lib/hooks/use-cart"
import { useStoreUi } from "@/lib/hooks/use-store-ui"
import { formatPrice } from "@/lib/api"
import { Icon } from "@/lib/icons"
import { Delete02Icon, MinusSignIcon, PlusSignIcon, ShoppingCart01Icon } from "@hugeicons/core-free-icons"

export function CartDrawer() {
  const { cart, itemCount, total, updateItem, removeItem, loading } = useCart()
  const { cartOpen, closeCart } = useStoreUi()
  const items = cart?.cart_items || []

  return (
    <Sheet open={cartOpen} onOpenChange={(open) => (!open ? closeCart() : undefined)}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle className="font-display text-xl tracking-wide">Your cart ({itemCount})</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <Icon icon={ShoppingCart01Icon} size={40} className="text-muted-foreground" />
              <p className="mt-4 font-display text-lg font-semibold">Your cart is empty</p>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Browse categories and add supplies for the next job.
              </p>
              <Button asChild className="mt-6" onClick={closeCart}>
                <Link href="/shop">View categories</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.ID} className="flex gap-3 border-b pb-4 last:border-0">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-muted">
                    {item.product?.images_json?.[0] ? (
                      <img src={item.product.images_json[0]} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${item.product?.slug || item.product_id}`}
                      onClick={closeCart}
                      className="line-clamp-2 text-sm font-semibold hover:text-primary"
                    >
                      {item.product?.name || "Product"}
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">{formatPrice(item.unit_price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        className="flex size-8 items-center justify-center rounded-full border"
                        onClick={() => updateItem(item.ID, Math.max(1, item.quantity - 1))}
                        aria-label="Decrease quantity"
                      >
                        <Icon icon={MinusSignIcon} size={14} />
                      </button>
                      <span className="min-w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        className="flex size-8 items-center justify-center rounded-full border"
                        onClick={() => updateItem(item.ID, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Icon icon={PlusSignIcon} size={14} />
                      </button>
                      <button
                        type="button"
                        className="ml-auto flex size-8 items-center justify-center rounded-full text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.ID)}
                        aria-label="Remove item"
                      >
                        <Icon icon={Delete02Icon} size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <div className="border-t px-5 py-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-display text-xl font-semibold">{formatPrice(total)}</span>
            </div>
            <div className="grid gap-2">
              <Button asChild className="h-12 w-full" onClick={closeCart}>
                <Link href="/checkout">Checkout</Link>
              </Button>
              <Button asChild variant="outline" className="h-12 w-full" onClick={closeCart}>
                <Link href="/cart">View cart</Link>
              </Button>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
