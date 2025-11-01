"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  ShoppingCart, 
  Trash2, 
  Star, 
  Tag, 
  AlertCircle,
  Heart
} from "lucide-react"
import { formatPrice } from "@/lib/api"

interface WishlistItemProps {
  item: {
    id: string
    product: {
      id: string
      name: string
      price: number
      comparePrice: number
      image: string
      category: string
      brand: string
      rating: number
      reviewCount: number
      inStock: boolean
      stockCount: number
    }
    addedAt: string
    notes?: string
  }
  isSelected: boolean
  onSelectionChange: (itemId: string, selected: boolean) => void
  onRemove: (itemId: string) => void
  onMoveToCart: (itemId: string) => void
  viewMode: "grid" | "list"
}

export function WishlistItem({ 
  item, 
  isSelected, 
  onSelectionChange, 
  onRemove, 
  onMoveToCart, 
  viewMode 
}: WishlistItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const discountPercentage = item.product.comparePrice > item.product.price 
    ? Math.round(((item.product.comparePrice - item.product.price) / item.product.comparePrice) * 100)
    : 0

  if (viewMode === "list") {
    return (
      <Card className="group hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelectionChange(item.id, checked as boolean)}
            />
            <div className="flex items-center gap-2">
              {!item.product.inStock && (
                <Badge variant="destructive" className="text-xs">
                  Out of Stock
                </Badge>
              )}
              {discountPercentage > 0 && (
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                  {discountPercentage}% OFF
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-4">
            {/* Product Image */}
            <div className="relative flex-shrink-0">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-lg border"
              />
              {!item.product.inStock && (
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                    <Link href={`/products/${item.product.id}`} className="hover:underline">
                      {item.product.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">{item.product.brand}</p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-foreground">
                  {formatPrice(item.product.price)}
                </span>
                {item.product.comparePrice > item.product.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(item.product.comparePrice)}
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{item.product.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({item.product.reviewCount} reviews)
                </span>
              </div>

              {/* Notes */}
              {item.notes && (
                <div className="mb-3">
                  <p className="text-sm text-muted-foreground italic">
                    "{item.notes}"
                  </p>
                </div>
              )}

              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span>Added {formatDate(item.addedAt)}</span>
                <span className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {item.product.category}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  disabled={!item.product.inStock}
                  onClick={() => onMoveToCart(item.id)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {item.product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemove(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Grid view
  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelectionChange(item.id, checked as boolean)}
          />
          <div className="flex items-center gap-2">
            {!item.product.inStock && (
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            )}
            {discountPercentage > 0 && (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                {discountPercentage}% OFF
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 flex flex-col h-full">
        {/* Product Image */}
        <div className="relative mb-4">
          <img
            src={item.product.image}
            alt={item.product.name}
            className="w-full h-48 object-cover rounded-lg border group-hover:scale-105 transition-transform duration-300"
          />
          {!item.product.inStock && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-12 w-12 text-white" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Heart className="h-6 w-6 text-red-500 fill-red-500" />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <div className="mb-2">
            <h3 className="font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
              <Link href={`/products/${item.product.id}`} className="hover:underline">
                {item.product.name}
              </Link>
            </h3>
            <p className="text-sm text-muted-foreground mb-2">{item.product.brand}</p>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-bold text-foreground">
              {formatPrice(item.product.price)}
            </span>
            {item.product.comparePrice > item.product.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(item.product.comparePrice)}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{item.product.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({item.product.reviewCount} reviews)
            </span>
          </div>

          {/* Notes */}
          {item.notes && (
            <div className="mb-3">
              <p className="text-sm text-muted-foreground italic line-clamp-2">
                "{item.notes}"
              </p>
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
            <span>Added {formatDate(item.addedAt)}</span>
            <span className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {item.product.category}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto">
          <Button
            size="sm"
            className="flex-1"
            disabled={!item.product.inStock}
            onClick={() => onMoveToCart(item.id)}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {item.product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
