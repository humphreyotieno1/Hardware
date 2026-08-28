"use client"

import { Button } from "@/components/ui/button"
import { Icon } from "@/lib/icons"
import { FavouriteIcon } from "@hugeicons/core-free-icons"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { useState } from "react"

interface WishlistButtonProps {
  productId: string
  className?: string
}

export function WishlistButton({ productId, className = "" }: WishlistButtonProps) {
  const { wishlistItems, addItem, removeItem } = useWishlist()
  const [loading, setLoading] = useState(false)
  const item = wishlistItems.find((entry) => entry.product_id === productId)
  const inWishlist = Boolean(item)

  return (
    <Button
      variant="outline"
      size="icon"
      className={className}
      disabled={loading}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      onClick={async () => {
        setLoading(true)
        try {
          if (item) await removeItem(item.ID)
          else await addItem(productId)
        } finally {
          setLoading(false)
        }
      }}
    >
      <Icon icon={FavouriteIcon} className={inWishlist ? "text-primary" : ""} strokeWidth={inWishlist ? 2 : 1.5} />
    </Button>
  )
}
