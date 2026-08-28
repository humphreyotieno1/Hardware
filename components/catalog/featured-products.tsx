"use client"

import { useQuery } from "@tanstack/react-query"
import { productsApi } from "@/lib/api"
import { ProductCard } from "@/components/ui/product-card"
import { ProductGridSkeleton } from "@/components/ui/product-card-skeleton"
import { SectionHeader } from "@/components/layout/section-header"

export function FeaturedProducts() {
  const featured = useQuery({
    queryKey: ["home-featured"],
    queryFn: () => productsApi.getFeaturedProducts(10),
  })
  const catalog = useQuery({
    queryKey: ["home-products"],
    queryFn: () => productsApi.searchProducts({ limit: 10, page: 1, sort: "name" }),
    enabled: !featured.isLoading && !featured.data?.length,
  })

  const products = featured.data?.length ? featured.data : catalog.data?.products || []
  const isLoading = featured.isLoading || (catalog.isFetching && products.length === 0)

  return (
    <section className="bg-card py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <SectionHeader
          eyebrow="Stocked and ready"
          title="Featured products"
          description="A snapshot of supplies currently listed in the shop."
          href="/shop"
          linkLabel="Shop all"
        />
        {isLoading ? (
          <ProductGridSkeleton count={10} />
        ) : products.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
              <ProductCard key={product.ID} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
