"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { formatPrice } from "@/lib/api"
import type { CartItem as CartItemType } from "@/lib/api/types"
import { Icon } from "@/lib/icons"
import { Delete02Icon, MinusSignIcon, PlusSignIcon } from "@hugeicons/core-free-icons"

interface CartItemProps {
  item: CartItemType
  isUpdating: boolean
  setIsUpdating: (updating: boolean) => void
  onCartUpdate?: () => void
}

export function CartItem({ item, isUpdating, setIsUpdating, onCartUpdate }: CartItemProps) {
  const { toast } = useToast()
  const { updateItem, removeItem } = useCart()
  const [quantity, setQuantity] = useState(item.quantity)
  const [isRemoving, setIsRemoving] = useState(false)
  const itemTotal = item.quantity * item.unit_price

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return
    setIsUpdating(true)
    try {
      await updateItem(item.ID, newQuantity)
      setQuantity(newQuantity)
      onCartUpdate?.()
    } catch {
      toast({ title: "Error", description: "Failed to update quantity. Please try again.", variant: "destructive" })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    setIsRemoving(true)
    try {
      await removeItem(item.ID)
      onCartUpdate?.()
    } catch {
      toast({ title: "Error", description: "Failed to remove item. Please try again.", variant: "destructive" })
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <div className="flex gap-4">
      <Link href={`/products/${item.product?.slug || item.product_id}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-muted">
        {item.product?.images_json?.[0] ? (
          <img src={item.product.images_json[0]} alt={item.product?.name || "Product"} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No image</div>
        )}
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={`/products/${item.product?.slug || item.product_id}`} className="line-clamp-2 text-sm font-semibold hover:text-primary">
          {item.product?.name || "Product"}
        </Link>
        {item.product?.sku ? <p className="mt-1 text-xs text-muted-foreground">SKU: {item.product.sku}</p> : null}
        <div className="mt-2 flex items-center gap-2">
          <div className="inline-flex items-center rounded-full border">
            <Button variant="ghost" size="icon" className="size-8" onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 1 || isUpdating} aria-label="Decrease quantity">
              <Icon icon={MinusSignIcon} size={14} />
            </Button>
            <span className="min-w-8 text-center text-sm font-medium">{quantity}</span>
            <Button variant="ghost" size="icon" className="size-8" onClick={() => handleQuantityChange(quantity + 1)} disabled={isUpdating} aria-label="Increase quantity">
              <Icon icon={PlusSignIcon} size={14} />
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="size-8 text-muted-foreground" onClick={handleRemove} disabled={isRemoving} aria-label="Remove item">
            <Icon icon={Delete02Icon} size={16} />
          </Button>
        </div>
      </div>
      <p className="font-display text-lg font-semibold">{formatPrice(itemTotal)}</p>
    </div>
  )
}
