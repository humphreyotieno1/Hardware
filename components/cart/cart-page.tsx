"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/hooks/use-cart"
import { formatPrice } from "@/lib/api"
import { CartItem } from "@/components/cart/cart-item"
import { Icon } from "@/lib/icons"
import { ArrowLeft01Icon, ShoppingBag01Icon, TruckDeliveryIcon } from "@hugeicons/core-free-icons"
import { useState } from "react"

export function CartPage() {
  const { cart, loading, itemCount, total, refreshCart } = useCart()
  const [isUpdating, setIsUpdating] = useState(false)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-10 w-48 animate-pulse rounded-full bg-muted" />
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="h-64 animate-pulse rounded-3xl bg-muted lg:col-span-2" />
          <div className="h-48 animate-pulse rounded-3xl bg-muted" />
        </div>
      </div>
    )
  }

  if (!cart?.cart_items?.length) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Icon icon={ShoppingBag01Icon} size={48} className="mx-auto text-muted-foreground" />
        <h1 className="mt-5 font-display text-3xl font-semibold">Your cart is empty</h1>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Browse categories and add supplies for the next job.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Shopping cart</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/shop">
            <Icon icon={ArrowLeft01Icon} size={16} /> Continue shopping
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card className="rounded-3xl lg:col-span-2">
          <CardContent className="divide-y p-0">
            {cart.cart_items.map((item) => (
              <div key={item.ID} className="p-5">
                <CartItem item={item} isUpdating={isUpdating} setIsUpdating={setIsUpdating} onCartUpdate={refreshCart} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="h-fit rounded-3xl">
          <CardHeader>
            <CardTitle className="font-display text-xl">Order summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-display text-xl font-semibold">{formatPrice(total)}</span>
            </div>
            <Separator />
            <p className="text-sm text-muted-foreground">Delivery is arranged at checkout for Siaya and surrounding areas.</p>
            <Button className="h-12 w-full" size="lg" asChild disabled={isUpdating}>
              <Link href="/checkout">Proceed to checkout</Link>
            </Button>
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon icon={TruckDeliveryIcon} size={14} className="text-primary" /> Local delivery support for project orders
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
