"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/hooks/use-cart"
import { formatPrice } from "@/lib/api"
import type { CartItem as CartItemType } from "@/lib/api/types"
import { Minus, Plus, Trash2, Heart } from "lucide-react"

interface CartItemProps {
  item: CartItemType
  isUpdating: boolean
  setIsUpdating: (updating: boolean) => void
}

export function CartItem({ item, isUpdating, setIsUpdating }: CartItemProps) {
  const { updateItem, removeItem } = useCart()
  const [quantity, setQuantity] = useState(item.quantity)
  const [isRemoving, setIsRemoving] = useState(false)

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return

    setIsUpdating(true)
    try {
      await updateItem(item.id, newQuantity)
      setQuantity(newQuantity)
    } catch (error) {
      console.error("Failed to update quantity:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    setIsRemoving(true)
    try {
      await removeItem(item.id)
    } catch (error) {
      console.error("Failed to remove item:", error)
      setIsRemoving(false)
    }
  }

  const itemTotal = item.quantity * item.unit_price

  return (
    <div className="flex items-center space-x-4">
      {/* Product Image */}
      <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
        {item.product?.images_json && item.product.images_json.length > 0 ? (
          <img
            src={item.product.images_json[0] || "/placeholder.svg"}
            alt={item.product?.name || "Product"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No Image</div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/p/${item.product?.slug || ""}`}
          className="font-medium text-foreground hover:text-accent transition-colors line-clamp-2"
        >
          {item.product?.name || "Unknown Product"}
        </Link>
        <p className="text-sm text-muted-foreground mt-1">
          SKU: {item.product?.sku || "N/A"} • {formatPrice(item.unit_price)} each
        </p>
        <div className="flex items-center space-x-4 mt-2">
          <div className="flex items-center border rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || isUpdating}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">{quantity}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={isUpdating}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Heart className="h-4 w-4" />
              <span className="sr-only">Add to wishlist</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={isRemoving}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove item</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="text-right">
        <p className="font-bold text-lg text-foreground">{formatPrice(itemTotal)}</p>
        {item.quantity > 1 && (
          <p className="text-sm text-muted-foreground">
            {formatPrice(item.unit_price)} × {item.quantity}
          </p>
        )}
      </div>
    </div>
  )
}
