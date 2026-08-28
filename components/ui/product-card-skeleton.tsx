"use client"

import { memo } from "react"

export const ProductCardSkeleton = memo(function ProductCardSkeleton({
  className = "",
}: {
  className?: string
}) {
  return (
    <div className={`overflow-hidden rounded-none border bg-card animate-pulse ${className}`}>
      <div className="aspect-square bg-muted" />
      <div className="space-y-2 p-2.5">
        <div className="h-2.5 w-1/3 rounded-full bg-muted" />
        <div className="h-3 w-3/4 rounded-full bg-muted" />
        <div className="h-4 w-1/2 rounded-full bg-muted" />
      </div>
    </div>
  )
})

export function ProductGridSkeleton({
  count = 4,
  className = "",
}: {
  count?: number
  className?: string
}) {
  return (
    <div className={`grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
