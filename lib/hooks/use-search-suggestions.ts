"use client"

import { useEffect, useState } from "react"
import { productsApi } from "@/lib/api"
import type { Category, Product } from "@/lib/api/types"

export function useSearchSuggestions(query: string, category?: string, enabled = true) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const term = query.trim()
    if (!enabled || term.length < 1) {
      setProducts([])
      setCategories([])
      setLoading(false)
      return
    }

    let cancelled = false
    const timer = window.setTimeout(async () => {
      setLoading(true)
      try {
        const data = await productsApi.suggest({
          q: term,
          category: category && category !== "all" ? category : undefined,
          limit: 8,
        })
        if (cancelled) return
        setProducts(data.products || [])
        setCategories(data.categories || [])
      } catch {
        if (cancelled) return
        setProducts([])
        setCategories([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 160)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [query, category, enabled])

  return { products, categories, loading }
}
