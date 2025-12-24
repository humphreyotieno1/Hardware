"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { productsApi } from "@/lib/api"
import type { Product } from "@/lib/api/types"
import { ProductCard } from "@/components/ui/product-card"
import { ProductGridSkeleton } from "@/components/ui/product-card-skeleton"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"

const ROWS_DESKTOP = 2
const COLS_DESKTOP = 4
const VISIBLE_CARDS_DESKTOP = ROWS_DESKTOP * COLS_DESKTOP // 8 cards (4x2)
const VISIBLE_CARDS_TABLET = 4 // 2x2
const VISIBLE_CARDS_MOBILE = 2 // 2x1
const TOTAL_PRODUCTS_TO_FETCH = 24

function useVisibleConfig() {
  const [config, setConfig] = useState({ cards: VISIBLE_CARDS_DESKTOP, cols: COLS_DESKTOP })

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        setConfig({ cards: VISIBLE_CARDS_MOBILE, cols: 2 })
      } else if (window.innerWidth < 1024) {
        setConfig({ cards: VISIBLE_CARDS_TABLET, cols: 2 })
      } else {
        setConfig({ cards: VISIBLE_CARDS_DESKTOP, cols: COLS_DESKTOP })
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return config
}

export function FeaturedProducts() {
  const { cards: visibleCards, cols } = useVisibleConfig()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })]
  )

  const { data, isLoading } = useQuery({
    queryKey: ['featured-products-carousel'],
    queryFn: async () => {
      const res = await productsApi.searchProducts({ limit: TOTAL_PRODUCTS_TO_FETCH, page: 1 })
      return res
    },
  })

  const products = data?.products || []

  // Group products into slides (each slide contains visibleCards products)
  const slides: Product[][] = []
  for (let i = 0; i < products.length; i += visibleCards) {
    slides.push(products.slice(i, i + visibleCards))
  }

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  if (isLoading) {
    return (
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Featured Products</h2>
          </div>
          <ProductGridSkeleton count={visibleCards} />
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2 text-balance">Featured Products</h2>
            <p className="text-muted-foreground text-lg text-pretty">Discover our most popular tools and materials</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Navigation Arrows */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={scrollPrev}
                className="h-10 w-10 rounded-full border border-border bg-background hover:bg-muted flex items-center justify-center transition-colors"
                aria-label="Previous products"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={scrollNext}
                className="h-10 w-10 rounded-full border border-border bg-background hover:bg-muted flex items-center justify-center transition-colors"
                aria-label="Next products"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <Button variant="outline" asChild className="md:flex bg-transparent hidden">
              <Link href="/search">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            No featured products found.
          </div>
        ) : (
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {slides.map((slideProducts, slideIndex) => (
                <div
                  key={slideIndex}
                  className="flex-none w-full"
                >
                  <div
                    className="grid gap-4"
                    style={{
                      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                    }}
                  >
                    {slideProducts.map((product: Product) => (
                      <ProductCard key={product.ID} product={product} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        <div className="flex items-center justify-center gap-4 mt-6 md:hidden">
          <button
            onClick={scrollPrev}
            className="h-10 w-10 rounded-full border border-border bg-background hover:bg-muted flex items-center justify-center transition-colors"
            aria-label="Previous products"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            className="h-10 w-10 rounded-full border border-border bg-background hover:bg-muted flex items-center justify-center transition-colors"
            aria-label="Next products"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

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
