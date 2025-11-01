"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import type { WishlistItem } from "@/lib/hooks/use-wishlist"

interface WishlistButtonProps {
  product: WishlistItem["product"]
  size?: "sm" | "md" | "lg"
  variant?: "default" | "outline" | "ghost"
  showText?: boolean
  className?: string
}

export function WishlistButton({ 
  product, 
  size = "md", 
  variant = "outline", 
  showText = true,
  className = ""
}: WishlistButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const [isAdding, setIsAdding] = useState(false)

  const inWishlist = isInWishlist(product.id)

  const handleToggleWishlist = async () => {
    setIsAdding(true)
    try {
      if (inWishlist) {
        removeFromWishlist(product.id)
      } else {
        addToWishlist(product)
      }
    } catch (error) {
      console.error("Failed to toggle wishlist:", error)
    } finally {
      setIsAdding(false)
    }
  }

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  }

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleWishlist}
      disabled={isAdding}
      className={`${sizeClasses[size]} ${className} transition-all duration-200 ${
        inWishlist 
          ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100" 
          : ""
      }`}
      title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart 
        className={`${iconSizes[size]} ${
          inWishlist 
            ? "fill-red-500 text-red-500" 
            : "text-muted-foreground group-hover:text-red-500"
        } transition-colors duration-200`} 
      />
      {showText && (
        <span className={`ml-2 ${textSizes[size]} ${
          inWishlist ? "text-red-600" : ""
        }`}>
          {inWishlist ? "Saved" : "Save"}
        </span>
      )}
    </Button>
  )
}
