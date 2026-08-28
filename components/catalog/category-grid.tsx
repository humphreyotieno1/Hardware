"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { productsApi } from "@/lib/api/products"
import type { Category } from "@/lib/api/types"
import { HIDDEN_CATEGORY_SLUGS } from "@/lib/catalog/category-meta"
import { NAV_GROUPS } from "@/lib/catalog/nav-groups"
import { CategoryTile } from "@/components/catalog/category-tile"
import { Icon } from "@/lib/icons"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

function sortShopCategories(categories: Category[]) {
  const order = NAV_GROUPS.flatMap((group) => group.slugs)
  return [...categories].sort((a, b) => {
    const ia = order.indexOf(a.slug)
    const ib = order.indexOf(b.slug)
    return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib)
  })
}

function columnsOfTwo(categories: Category[]) {
  const columns: Category[][] = []
  for (let i = 0; i < categories.length; i += 2) {
    columns.push(categories.slice(i, i + 2))
  }
  return columns
}

export function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([])
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    slidesToScroll: 1,
  })

  useEffect(() => {
    productsApi
      .getCategories()
      .then((cats) => setCategories(sortShopCategories(cats.filter((c) => !HIDDEN_CATEGORY_SLUGS.has(c.slug)))))
      .catch(() => setCategories([]))
  }, [])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanPrev(emblaApi.canScrollPrev())
    setCanNext(emblaApi.canScrollNext())
  }, [emblaApi])

  const columns = useMemo(() => columnsOfTwo(categories), [categories])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.reInit()
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect, columns.length])

  if (categories.length === 0) return null

  return (
    <section className="bg-background py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
          <h2 className="font-display text-3xl font-semibold uppercase tracking-[0.12em] text-foreground sm:text-4xl">
            Shop by categories
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Find supplies by trade — from building materials to plumbing, electrical, paints and hardware.
          </p>
        </div>

        <div className="relative px-0 sm:px-8">
          <button
            type="button"
            disabled={!canPrev}
            onClick={() => emblaApi?.scrollPrev()}
            className={cn(
              "absolute left-0 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border bg-card shadow-sm transition hover:border-primary hover:text-primary disabled:opacity-30 sm:flex",
              "sm:-translate-x-1"
            )}
            aria-label="Previous categories"
          >
            <Icon icon={ArrowLeft01Icon} size={18} />
          </button>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {columns.map((column) => (
                <div
                  key={column.map((item) => item.slug).join("-")}
                  className="min-w-0 flex-[0_0_50%] px-1.5 sm:flex-[0_0_33.333%] md:flex-[0_0_25%] lg:flex-[0_0_20%] xl:flex-[0_0_14.285%]"
                >
                  <div className="flex flex-col gap-3">
                    {column.map((category) => (
                      <CategoryTile key={category.slug} category={category} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={!canNext}
            onClick={() => emblaApi?.scrollNext()}
            className={cn(
              "absolute right-0 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border bg-card shadow-sm transition hover:border-primary hover:text-primary disabled:opacity-30 sm:flex",
              "sm:translate-x-1"
            )}
            aria-label="Next categories"
          >
            <Icon icon={ArrowRight01Icon} size={18} />
          </button>
        </div>

        <div className="mt-4 flex justify-center gap-2 sm:hidden">
          <button
            type="button"
            disabled={!canPrev}
            onClick={() => emblaApi?.scrollPrev()}
            className="flex size-10 items-center justify-center rounded-full border bg-card disabled:opacity-30"
            aria-label="Previous categories"
          >
            <Icon icon={ArrowLeft01Icon} size={18} />
          </button>
          <button
            type="button"
            disabled={!canNext}
            onClick={() => emblaApi?.scrollNext()}
            className="flex size-10 items-center justify-center rounded-full border bg-card disabled:opacity-30"
            aria-label="Next categories"
          >
            <Icon icon={ArrowRight01Icon} size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
