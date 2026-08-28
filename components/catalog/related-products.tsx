"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import type { Product } from "@/lib/api/types"
import { ProductCard } from "@/components/ui/product-card"
import { Icon } from "@/lib/icons"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"

export function RelatedProducts({ products }: { products: Product[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  })
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanPrev(emblaApi.canScrollPrev())
    setCanNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
  }, [emblaApi, onSelect])

  if (products.length === 0) return null

  return (
    <section className="mt-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">More from this category</p>
          <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">Related products</h2>
        </div>
        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            disabled={!canPrev}
            onClick={() => emblaApi?.scrollPrev()}
            className="flex size-10 items-center justify-center rounded-full border disabled:opacity-40"
            aria-label="Previous related products"
          >
            <Icon icon={ArrowLeft01Icon} size={18} />
          </button>
          <button
            type="button"
            disabled={!canNext}
            onClick={() => emblaApi?.scrollNext()}
            className="flex size-10 items-center justify-center rounded-full border disabled:opacity-40"
            aria-label="Next related products"
          >
            <Icon icon={ArrowRight01Icon} size={18} />
          </button>
        </div>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-2.5">
          {products.map((product) => (
            <div key={product.ID} className="min-w-0 flex-[0_0_46%] sm:flex-[0_0_31%] lg:flex-[0_0_20%] xl:flex-[0_0_16.5%]">
              <ProductCard product={product} showCategory={false} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
