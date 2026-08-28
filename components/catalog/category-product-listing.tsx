"use client"

import { ProductListing } from "@/components/catalog/product-listing"

interface CategoryProductListingProps {
  categorySlug: string
}

export function CategoryProductListing({ categorySlug }: CategoryProductListingProps) {
  return <ProductListing categorySlug={categorySlug} />
}
