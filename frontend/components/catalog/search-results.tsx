"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { productsApi, formatPrice } from "@/lib/api"
import type { Product, ProductSearchParams } from "@/lib/api/types"
import { ShoppingCart, Heart, Star, Filter, Grid, List, Search } from "lucide-react"
import Link from "next/link"

interface SearchResultsProps {
  searchParams: {
    q?: string
    page?: string
    sort?: string
    category?: string
    minPrice?: string
    maxPrice?: string
  }
}

export function SearchResults({ searchParams }: SearchResultsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [searchQuery, setSearchQuery] = useState(searchParams.q || "")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [showFilters, setShowFilters] = useState(false)

  const router = useRouter()
  const currentPage = Number.parseInt(searchParams.page || "1")
  const currentSort = searchParams.sort || "name"

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params: ProductSearchParams = {
          q: searchParams.q,
          category: searchParams.category,
          page: currentPage,
          limit: 12,
          sort: currentSort as any,
        }

        const response = await productsApi.searchProducts(params)
        setProducts(response.products)
        setTotal(response.total)
      } catch (error) {
        console.error("Failed to search products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchParams.q, searchParams.category, currentPage, currentSort])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const url = new URL(window.location.href)
    if (searchQuery.trim()) {
      url.searchParams.set("q", searchQuery.trim())
    } else {
      url.searchParams.delete("q")
    }
    url.searchParams.delete("page") // Reset to first page
    router.push(url.toString())
  }

  const handleSortChange = (sort: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set("sort", sort)
    url.searchParams.delete("page") // Reset to first page
    router.push(url.toString())
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="aspect-square bg-muted rounded-lg mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          {searchParams.q ? `Search Results for "${searchParams.q}"` : "All Products"}
        </h1>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input"
            />
          </div>
        </form>

        <p className="text-muted-foreground">
          {total} {total === 1 ? "product" : "products"} found
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-lg p-1">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Filter Toggle */}
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Sort */}
        <Select value={currentSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name A-Z</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Filters</h3>

              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <Label className="text-sm font-medium">Price Range</Label>
                  <div className="mt-2">
                    <Slider value={priceRange} onValueChange={setPriceRange} max={10000} step={100} className="mb-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Categories */}
                <div>
                  <Label className="text-sm font-medium">Categories</Label>
                  <div className="mt-2 space-y-2">
                    {["Construction", "Tools", "Plumbing", "Electrical", "Paint", "Hardware"].map((category) => (
                      <label key={category} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Brand Filter */}
                <div>
                  <Label className="text-sm font-medium">Brand</Label>
                  <div className="mt-2 space-y-2">
                    {["DeWalt", "Makita", "Bosch", "Stanley", "Black & Decker"].map((brand) => (
                      <label key={brand} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Availability */}
                <div>
                  <Label className="text-sm font-medium">Availability</Label>
                  <div className="mt-2 space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">In Stock</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Out of Stock</span>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                {searchParams.q ? `No products found for "${searchParams.q}"` : "No products found."}
              </p>
              <Button asChild>
                <Link href="/">Browse Categories</Link>
              </Button>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {products.map((product) => (
                <Card
                  key={product.id}
                  className={`group hover:shadow-lg transition-all duration-300 ${viewMode === "list" ? "flex" : ""}`}
                >
                  <CardContent className={`p-4 ${viewMode === "list" ? "flex items-center space-x-4 w-full" : ""}`}>
                    <div className={`relative ${viewMode === "list" ? "w-32 h-32 flex-shrink-0" : "mb-4"}`}>
                      <div
                        className={`${viewMode === "list" ? "w-32 h-32" : "aspect-square"} bg-muted rounded-lg overflow-hidden`}
                      >
                        {product.images_json && product.images_json.length > 0 ? (
                          <img
                            src={product.images_json[0] || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            No Image
                          </div>
                        )}
                      </div>
                      {viewMode === "grid" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 h-8 w-8 p-0 bg-background/80 hover:bg-background"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                          {product.stock_quantity < 10 && product.stock_quantity > 0 && (
                            <Badge variant="destructive" className="absolute top-2 left-2">
                              Low Stock
                            </Badge>
                          )}
                          {product.stock_quantity === 0 && (
                            <Badge variant="secondary" className="absolute top-2 left-2">
                              Out of Stock
                            </Badge>
                          )}
                        </>
                      )}
                    </div>

                    <div className={`space-y-2 ${viewMode === "list" ? "flex-1" : ""}`}>
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-sm text-muted-foreground ml-2">(4.5)</span>
                      </div>

                      <div
                        className={`flex items-center ${viewMode === "list" ? "justify-between" : "justify-between"}`}
                      >
                        <span className="text-lg font-bold text-foreground">{formatPrice(product.price)}</span>
                        <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
                      </div>

                      {viewMode === "list" && (
                        <div className="flex items-center space-x-2">
                          {product.stock_quantity < 10 && product.stock_quantity > 0 && (
                            <Badge variant="destructive">Low Stock</Badge>
                          )}
                          {product.stock_quantity === 0 && <Badge variant="secondary">Out of Stock</Badge>}
                        </div>
                      )}

                      <Button className="w-full" disabled={product.stock_quantity === 0}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {total > 12 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-2">
                <Button variant="outline" disabled={currentPage === 1}>
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {Math.ceil(total / 12)}
                </span>
                <Button variant="outline" disabled={currentPage >= Math.ceil(total / 12)}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
