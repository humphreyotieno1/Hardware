"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { productsApi } from "@/lib/api/products"
import type { Category } from "@/lib/api/types"
import { HIDDEN_CATEGORY_SLUGS } from "@/lib/catalog/category-meta"
import { CategoryTile } from "@/components/catalog/category-tile"
import { Button } from "@/components/ui/button"

export function CategoriesListing() {
  const [categories, setCategories] = useState<Category[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [cats, catCounts] = await Promise.all([
          productsApi.getCategories(),
          productsApi.getCategoryCounts().catch(() => ({})),
        ])
        setCategories(cats.filter((c) => !HIDDEN_CATEGORY_SLUGS.has(c.slug)))
        setCounts(catCounts)
      } catch {
        setError("Failed to load categories. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <section className="py-10 sm:py-14">
      <div className="container mx-auto px-4">
        <nav className="mb-5 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="font-medium text-foreground">Categories</span>
        </nav>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">Shop by category</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Construction, plumbing, electrical and hardware supplies organised by trade.
        </p>

        {loading ? (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : error ? (
          <div className="mt-10 rounded-3xl border bg-card px-6 py-16 text-center">
            <p className="font-display text-xl font-semibold">Couldn’t load categories</p>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <Button className="mt-6" onClick={() => window.location.reload()}>Try again</Button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
            {categories.map((category) => {
              const count = counts[category.slug]
              return (
                <CategoryTile
                  key={category.slug}
                  category={category}
                  caption={typeof count === "number" ? `${count.toLocaleString()} ${count === 1 ? "product" : "products"}` : undefined}
                />
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
