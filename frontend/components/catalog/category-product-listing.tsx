"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { productsApi, formatPrice } from "@/lib/api"
import type { Product, ProductSearchParams } from "@/lib/api/types"
import { ProductCard } from "@/components/ui/product-card"
import { ProductListCard } from "@/components/ui/product-list-card"
import { Pagination } from "@/components/ui/pagination"
import { ProductControls } from "@/components/ui/product-controls"
import { Filter, Grid, List } from "lucide-react"
import Link from "next/link"

interface CategoryProductListingProps {
  categorySlug: string
}

export function CategoryProductListing({ categorySlug }: CategoryProductListingProps) {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  
  // Filter states
  const [priceRange, setPriceRange] = useState([
    Number.parseInt(searchParams.get("minPrice") || "0"),
    Number.parseInt(searchParams.get("maxPrice") || "10000")
  ])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "in-stock" | "out-of-stock">("all")
  const [availableBrands, setAvailableBrands] = useState<string[]>([])
  const [dynamicPriceRange, setDynamicPriceRange] = useState<number[]>([0, 10000])

  const router = useRouter()
  const currentPage = Number.parseInt(searchParams.get("page") || "1")
  const currentSort = searchParams.get("sort") || "name"

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params: ProductSearchParams = {
          category: categorySlug,
          page: currentPage,
          limit: 12,
          sort: currentSort as any,
        }

        console.log("API call params:", params)
        const response = await productsApi.getProductsByCategory(categorySlug, params)
        console.log("API response:", { products: response.products.length, total: response.total, page: response.page })
        
        // Extract unique brands from products for filter options
        const brands = [...new Set(response.products.map(p => p.name.split(' ')[0]))].filter(Boolean)
        setAvailableBrands(brands)
        
        // Calculate dynamic price range from products
        if (response.products.length > 0) {
          const prices = response.products.map(p => p.price)
          const minPrice = Math.floor(Math.min(...prices) / 100) * 100 // Round down to nearest 100
          const maxPrice = Math.ceil(Math.max(...prices) / 100) * 100 // Round up to nearest 100
          setDynamicPriceRange([minPrice, maxPrice])
          
          // Update price range if it's still at default values
          if (priceRange[0] === 0 && priceRange[1] === 10000) {
            setPriceRange([minPrice, maxPrice])
          }
        }
        
        // Apply client-side filters
        let filteredProducts = response.products
        
        // Price filter
        filteredProducts = filteredProducts.filter(p => 
          p.price >= priceRange[0] && p.price <= priceRange[1]
        )
        
        // Brand filter
        if (selectedBrands.length > 0) {
          filteredProducts = filteredProducts.filter(p => 
            selectedBrands.some(brand => p.name.toLowerCase().includes(brand.toLowerCase()))
          )
        }
        
        // Availability filter
        if (availabilityFilter === "in-stock") {
          filteredProducts = filteredProducts.filter(p => p.stock_quantity > 0)
        } else if (availabilityFilter === "out-of-stock") {
          filteredProducts = filteredProducts.filter(p => p.stock_quantity === 0)
        }
        
        setProducts(filteredProducts)
        
        // Get the correct category total count
        const categoryTotal = await productsApi.getCategoryTotalCount(categorySlug)
        setTotal(categoryTotal)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [categorySlug, searchParams, currentPage, currentSort, priceRange, selectedBrands, availabilityFilter])

  const handleSortChange = (sort: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set("sort", sort)
    url.searchParams.delete("page") // Reset to first page
    router.push(url.toString())
  }

  const handlePageChange = (page: number) => {
    const url = new URL(window.location.href)
    url.searchParams.set("page", page.toString())
    router.push(url.toString())
  }


  const handlePriceRangeChange = (newRange: number[]) => {
    setPriceRange(newRange)
    // Update URL with price range
    const url = new URL(window.location.href)
    url.searchParams.set("minPrice", newRange[0].toString())
    url.searchParams.set("maxPrice", newRange[1].toString())
    url.searchParams.delete("page") // Reset to first page
    router.push(url.toString())
  }

  const handleBrandToggle = (brand: string) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand]
    setSelectedBrands(newBrands)
  }

  const handleAvailabilityChange = (availability: "all" | "in-stock" | "out-of-stock") => {
    setAvailabilityFilter(availability)
  }

  const clearAllFilters = () => {
    setPriceRange([0, 10000])
    setSelectedBrands([])
    setAvailabilityFilter("all")
    const url = new URL(window.location.href)
    url.searchParams.delete("minPrice")
    url.searchParams.delete("maxPrice")
    url.searchParams.delete("page")
    router.push(url.toString())
  }

  const categoryName = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace("-", " ")
  const activeFiltersCount = (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0) + 
                            selectedBrands.length + 
                            (availabilityFilter !== "all" ? 1 : 0)

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
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{categoryName}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{categoryName}</h1>
          <p className="text-muted-foreground">
            {total} {total === 1 ? "product" : "products"} found
          </p>
        </div>

        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-lg p-1">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Enhanced Controls */}
        <ProductControls
          currentSort={currentSort}
          onSortChange={handleSortChange}
          totalItems={total}
        />

          {/* Filter Toggle */}
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
            <Filter className="h-4 w-4 mr-2" />
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Filters</h3>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
                    Clear All
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <Label className="text-sm font-medium">Price Range</Label>
                  <div className="mt-2">
                    <Slider 
                      value={priceRange} 
                      onValueChange={handlePriceRangeChange} 
                      min={dynamicPriceRange[0]}
                      max={dynamicPriceRange[1]}
                      step={100} 
                      className="mb-2" 
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Brand Filter */}
                <div>
                  <Label className="text-sm font-medium">Brand</Label>
                  <div className="mt-2 space-y-2">
                    {availableBrands.length > 0 ? (
                      availableBrands.map((brand) => (
                        <label key={brand} className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            className="rounded" 
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleBrandToggle(brand)}
                          />
                          <span className="text-sm">{brand}</span>
                        </label>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No brands available</p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Availability */}
                <div>
                  <Label className="text-sm font-medium">Availability</Label>
                  <div className="mt-2 space-y-2">
                    <label className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        name="availability" 
                        className="rounded" 
                        checked={availabilityFilter === "all"}
                        onChange={() => handleAvailabilityChange("all")}
                      />
                      <span className="text-sm">All Products</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        name="availability" 
                        className="rounded" 
                        checked={availabilityFilter === "in-stock"}
                        onChange={() => handleAvailabilityChange("in-stock")}
                      />
                      <span className="text-sm">In Stock</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        name="availability" 
                        className="rounded" 
                        checked={availabilityFilter === "out-of-stock"}
                        onChange={() => handleAvailabilityChange("out-of-stock")}
                      />
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
              <p className="text-muted-foreground text-lg">No products found in this category.</p>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-3"}>
              {products.map((product) => (
                viewMode === "grid" ? (
                  <ProductCard 
                    key={product.ID} 
                    product={product}
                    showCategory={false}
                  />
                ) : (
                  <ProductListCard 
                    key={product.ID} 
                    product={product}
                    showCategory={false}
                  />
                )
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(total / 12)}
            totalItems={total}
            itemsPerPage={12}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  )
}
