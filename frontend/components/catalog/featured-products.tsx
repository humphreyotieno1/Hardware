"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { productsApi } from "@/lib/api"
import type { Product } from "@/lib/api/types"
import { ProductCard } from "@/components/ui/product-card"
import { SimplePagination } from "@/components/ui/pagination"
import { ArrowRight } from "lucide-react"

const PAGE_SIZE_DESKTOP = 8
const PAGE_SIZE_MOBILE = 4

function useResponsivePageSize() {
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DESKTOP)

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) {
        setPageSize(PAGE_SIZE_MOBILE)
      } else {
        setPageSize(PAGE_SIZE_DESKTOP)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return pageSize
}

export function FeaturedProducts() {
  const pageSize = useResponsivePageSize()
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    const fetchProducts = async () => {
      try {
        const res = await productsApi.searchProducts({ limit: pageSize, page })
        if (isMounted) {
          setProducts(res.products)
          setTotal(res.total)
        }
      } catch (error) {
        if (isMounted) {
          setProducts([])
          setTotal(0)
        }
        console.error("Failed to fetch products:", error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchProducts()
    return () => {
      isMounted = false
    }
  }, [page, pageSize])

  // Reset to page 1 if pageSize changes (e.g., device orientation/responsive)
  useEffect(() => {
    setPage(1)
  }, [pageSize])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const handlePageChange = (newPage: number) => {
    // Ensure the new page is within valid bounds
    const validPage = Math.max(1, Math.min(newPage, totalPages))
    setPage(validPage)
  }

  if (loading) {
    return (
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Featured Products</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: pageSize }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="aspect-square bg-muted rounded-lg mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
          {totalPages > 1 && (
            <SimplePagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-4 text-balance">Featured Products</h2>
            <p className="text-muted-foreground text-lg text-pretty">Discover our most popular tools and materials</p>
          </div>
          <Button variant="outline" asChild className="md:flex bg-transparent hidden">
            <Link href="/search">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-12">
              No featured products found.
            </div>
          ) : (
            products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                onAddToCart={(productId) => {
                  // Handle add to cart logic here
                  console.log('Add to cart:', productId)
                }}
                onAddToWishlist={(productId) => {
                  // Handle wishlist logic here
                  console.log('Add to wishlist:', productId)
                }}
              />
            ))
          )}
        </div>

        {totalPages > 1 && (
          <SimplePagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        <div className="text-center mt-8 md:hidden">
          <Button variant="outline" asChild>
            <Link href="/search">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
