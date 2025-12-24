"use client"

import { memo } from "react"

interface ProductCardSkeletonProps {
    className?: string
}

export const ProductCardSkeleton = memo(function ProductCardSkeleton({
    className = ""
}: ProductCardSkeletonProps) {
    return (
        <div className={`bg-background border border-border/40 overflow-hidden animate-pulse ${className}`}>
            {/* Image placeholder */}
            <div className="aspect-square bg-muted"></div>

            {/* Content placeholder */}
            <div className="p-4 space-y-3">
                {/* Category tag */}
                <div className="h-3 bg-muted rounded w-1/3"></div>

                {/* Title */}
                <div className="h-4 bg-muted rounded w-3/4"></div>

                {/* Star ratings */}
                <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-3.5 w-3.5 bg-muted rounded-full"></div>
                    ))}
                </div>

                {/* Price */}
                <div className="h-5 bg-muted rounded w-1/2 mt-2"></div>
            </div>
        </div>
    )
})

interface ProductGridSkeletonProps {
    count?: number
    className?: string
}

export function ProductGridSkeleton({
    count = 4,
    className = ""
}: ProductGridSkeletonProps) {
    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    )
}
