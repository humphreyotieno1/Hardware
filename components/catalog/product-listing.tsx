"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { productsApi, formatPrice } from "@/lib/api"
import type { Category, Product } from "@/lib/api/types"
import { ProductCard } from "@/components/ui/product-card"
import { ProductGridSkeleton } from "@/components/ui/product-card-skeleton"
import { Pagination } from "@/components/ui/pagination"
import { CATALOG_SORTS } from "@/lib/catalog/sort"
import { HIDDEN_CATEGORY_SLUGS } from "@/lib/catalog/category-meta"
import { Icon } from "@/lib/icons"
import {
  Cancel01Icon,
  FilterHorizontalIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 20

type Availability = "all" | "in-stock" | "out-of-stock"

interface ProductListingProps {
  categorySlug?: string
  heading?: string
}

function FilterFields({
  priceRange,
  onPriceCommit,
  dynamicPriceRange,
  availability,
  onAvailability,
  categories,
  selectedCategory,
  onCategory,
  showCategories,
  inputName,
}: {
  priceRange: number[]
  onPriceCommit: (value: number[]) => void
  dynamicPriceRange: number[]
  availability: Availability
  onAvailability: (value: Availability) => void
  categories: Category[]
  selectedCategory?: string
  onCategory: (slug?: string) => void
  showCategories: boolean
  inputName: string
}) {
  const [draftPrice, setDraftPrice] = useState(priceRange)
  useEffect(() => setDraftPrice(priceRange), [priceRange])

  return (
    <div className="space-y-7">
      <div>
        <Label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Price</Label>
        <Slider
          value={draftPrice}
          onValueChange={setDraftPrice}
          onValueCommit={onPriceCommit}
          min={dynamicPriceRange[0]}
          max={dynamicPriceRange[1]}
          step={50}
          className="mt-4 mb-2"
          disabled={dynamicPriceRange[0] === dynamicPriceRange[1]}
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatPrice(draftPrice[0])}</span>
          <span>{formatPrice(draftPrice[1])}</span>
        </div>
      </div>
      <div>
        <Label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Availability</Label>
        <div className="mt-3 space-y-1">
          {(
            [
              ["all", "All products"],
              ["in-stock", "In stock"],
              ["out-of-stock", "Out of stock"],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-full px-2 hover:bg-muted">
              <input
                type="radio"
                name={inputName}
                className="accent-primary"
                checked={availability === value}
                onChange={() => onAvailability(value)}
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>
      {showCategories ? (
        <div>
          <Label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Category</Label>
          <div className="mt-3 max-h-72 space-y-1 overflow-y-auto">
            <button
              type="button"
              onClick={() => onCategory(undefined)}
              className={cn(
                "flex min-h-10 w-full items-center rounded-full px-3 text-left text-sm",
                !selectedCategory ? "bg-secondary text-secondary-foreground" : "hover:bg-muted"
              )}
            >
              All categories
            </button>
            {categories.map((category) => (
              <button
                key={category.slug}
                type="button"
                onClick={() => onCategory(category.slug)}
                className={cn(
                  "flex min-h-10 w-full items-center rounded-full px-3 text-left text-sm",
                  selectedCategory === category.slug ? "bg-secondary text-secondary-foreground" : "hover:bg-muted"
                )}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function ProductListing({ categorySlug, heading }: ProductListingProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "")
  const [dynamicPriceRange, setDynamicPriceRange] = useState([0, 10000])

  const q = searchParams.get("q") || ""
  const category = categorySlug || searchParams.get("category") || undefined
  const currentPage = Number.parseInt(searchParams.get("page") || "1", 10)
  const currentSort = searchParams.get("sort") || "name"
  const minPrice = searchParams.get("min_price")
  const maxPrice = searchParams.get("max_price")
  const availability = (searchParams.get("availability") as Availability) || "all"

  const priceRange = useMemo(
    () => [
      minPrice ? Number(minPrice) : dynamicPriceRange[0],
      maxPrice ? Number(maxPrice) : dynamicPriceRange[1],
    ],
    [minPrice, maxPrice, dynamicPriceRange]
  )

  const pushParams = (mutate: (url: URL) => void) => {
    const url = new URL(window.location.href)
    mutate(url)
    url.searchParams.delete("page")
    router.push(`${url.pathname}?${url.searchParams.toString()}`)
  }

  useEffect(() => {
    setSearchInput(q)
  }, [q])

  useEffect(() => {
    productsApi
      .getCategories()
      .then((cats) => setCategories(cats.filter((c) => !HIDDEN_CATEGORY_SLUGS.has(c.slug))))
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await productsApi.searchProducts({
          q: q || undefined,
          category,
          page: currentPage,
          limit: PAGE_SIZE,
          sort: currentSort as "name" | "price_asc" | "price_desc" | "newest",
          min_price: minPrice ? Number(minPrice) : undefined,
          max_price: maxPrice ? Number(maxPrice) : undefined,
          in_stock: availability === "all" ? undefined : availability === "in-stock",
        })
        const list = response.products || []
        const filtered =
          availability === "in-stock"
            ? list.filter((p) => p.stock_quantity > 0)
            : availability === "out-of-stock"
              ? list.filter((p) => p.stock_quantity === 0)
              : list
        setProducts(filtered)
        setTotal(response.total || filtered.length)
        if (response.products.length > 0) {
          const prices = response.products.map((p) => p.price)
          const lo = Math.max(0, Math.floor(Math.min(...prices) / 50) * 50)
          const hi = Math.max(lo + 50, Math.ceil(Math.max(...prices) / 50) * 50)
          setDynamicPriceRange((prev) => (minPrice || maxPrice ? prev : [lo, hi]))
        }
      } catch {
        setProducts([])
        setTotal(0)
        setError("We couldn’t load products just now. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [q, category, currentPage, currentSort, minPrice, maxPrice, availability])

  const activeFiltersCount =
    (minPrice || maxPrice ? 1 : 0) + (availability !== "all" ? 1 : 0) + (!categorySlug && category ? 1 : 0)

  const categoryName = categories.find((c) => c.slug === category)?.name
  const title =
    heading ||
    (q ? `Results for “${q}”` : categoryName || "Shop products")

  const clearFilters = () => {
    const url = new URL(window.location.href)
    url.searchParams.delete("min_price")
    url.searchParams.delete("max_price")
    url.searchParams.delete("availability")
    url.searchParams.delete("page")
    if (!categorySlug) url.searchParams.delete("category")
    router.push(`${url.pathname}?${url.searchParams.toString()}`)
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        {categorySlug ? (
          <>
            <Link href="/shop" className="hover:text-foreground">Shop</Link>
            <span>/</span>
            <span className="font-medium text-foreground">{categoryName || heading || categorySlug}</span>
          </>
        ) : (
          <span className="font-medium text-foreground">Shop</span>
        )}
      </nav>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {loading ? "Loading products…" : `${total.toLocaleString()} ${total === 1 ? "product" : "products"}`}
          </p>
        </div>
        {!categorySlug ? (
          <form
            className="relative w-full max-w-md"
            onSubmit={(e) => {
              e.preventDefault()
              pushParams((url) => {
                if (searchInput.trim()) url.searchParams.set("q", searchInput.trim())
                else url.searchParams.delete("q")
              })
            }}
          >
            <Icon icon={Search01Icon} size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="h-11 w-full rounded-full border bg-card pl-10 pr-4 text-sm outline-none ring-ring/40 focus:ring-2"
            />
          </form>
        ) : null}
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Button variant="outline" className="lg:hidden" onClick={() => setFiltersOpen(true)}>
          <Icon icon={FilterHorizontalIcon} size={16} />
          Filter {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:inline">Sort</span>
          <Select value={currentSort} onValueChange={(sort) => pushParams((url) => url.searchParams.set("sort", sort))}>
            <SelectTrigger className="h-11 w-[180px] rounded-full sm:w-[210px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              {CATALOG_SORTS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-28 rounded-3xl border bg-card p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Filters</h2>
              {activeFiltersCount > 0 ? (
                <button type="button" onClick={clearFilters} className="text-xs font-semibold text-primary">
                  Clear
                </button>
              ) : null}
            </div>
            <FilterFields
              priceRange={priceRange}
              onPriceCommit={(value) =>
                pushParams((url) => {
                  url.searchParams.set("min_price", String(value[0]))
                  url.searchParams.set("max_price", String(value[1]))
                })
              }
              dynamicPriceRange={dynamicPriceRange}
              availability={availability}
              onAvailability={(value) =>
                pushParams((url) => {
                  if (value === "all") url.searchParams.delete("availability")
                  else url.searchParams.set("availability", value)
                })
              }
              categories={categories}
              selectedCategory={category}
              onCategory={(slug) =>
                pushParams((url) => {
                  if (slug) url.searchParams.set("category", slug)
                  else url.searchParams.delete("category")
                })
              }
              showCategories={!categorySlug}
              inputName="availability-desktop"
            />
          </div>
        </aside>

        <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
          <SheetContent side="bottom" className="max-h-[88vh] rounded-t-[2rem] p-0">
            <SheetHeader className="border-b px-5 py-4">
              <SheetTitle className="font-display text-xl">Filter</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto px-5 py-5">
              <FilterFields
                priceRange={priceRange}
                onPriceCommit={(value) =>
                  pushParams((url) => {
                    url.searchParams.set("min_price", String(value[0]))
                    url.searchParams.set("max_price", String(value[1]))
                  })
                }
                dynamicPriceRange={dynamicPriceRange}
                availability={availability}
                onAvailability={(value) =>
                  pushParams((url) => {
                    if (value === "all") url.searchParams.delete("availability")
                    else url.searchParams.set("availability", value)
                  })
                }
                categories={categories}
                selectedCategory={category}
                onCategory={(slug) =>
                  pushParams((url) => {
                    if (slug) url.searchParams.set("category", slug)
                    else url.searchParams.delete("category")
                  })
                }
                showCategories={!categorySlug}
                inputName="availability-mobile"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 border-t p-4">
              <Button variant="outline" onClick={clearFilters}>Clear</Button>
              <Button onClick={() => setFiltersOpen(false)}>Show results</Button>
            </div>
          </SheetContent>
        </Sheet>

        <div className="min-w-0 flex-1">
          {loading ? (
            <ProductGridSkeleton count={10} className="grid-cols-2 sm:grid-cols-3 xl:grid-cols-4" />
          ) : error ? (
            <div className="rounded-3xl border bg-card px-6 py-16 text-center">
              <p className="font-display text-xl font-semibold">Something went wrong</p>
              <p className="mt-2 text-sm text-muted-foreground">{error}</p>
              <Button className="mt-6" onClick={() => router.refresh()}>Try again</Button>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-3xl border bg-card px-6 py-16 text-center">
              <p className="font-display text-xl font-semibold">No products found</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try another search or browse our categories.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {activeFiltersCount > 0 ? (
                  <Button variant="outline" onClick={clearFilters}>
                    <Icon icon={Cancel01Icon} size={16} /> Clear filters
                  </Button>
                ) : null}
                <Button asChild>
                  <Link href="/categories">View categories</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.ID} product={product} showCategory={!categorySlug} />
              ))}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(total / PAGE_SIZE)}
            totalItems={total}
            itemsPerPage={PAGE_SIZE}
            onPageChange={(page) => {
              const url = new URL(window.location.href)
              url.searchParams.set("page", String(page))
              router.push(`${url.pathname}?${url.searchParams.toString()}`)
            }}
          />
        </div>
      </div>
    </div>
  )
}
