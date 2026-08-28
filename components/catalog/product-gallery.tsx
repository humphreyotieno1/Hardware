"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { Icon } from "@/lib/icons"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: images.length > 1 })
  const [index, setIndex] = useState(0)
  const [origin, setOrigin] = useState("50% 50%")
  const [zoomed, setZoomed] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, onSelect])

  useEffect(() => {
    emblaApi?.scrollTo(index)
  }, [index, emblaApi])

  const src = images[index] || "/placeholder.svg"

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-3xl bg-muted">
        <div className="overflow-hidden md:hidden" ref={emblaRef}>
          <div className="flex">
            {images.map((image, i) => (
              <div key={`${image}-${i}`} className="min-w-0 flex-[0_0_100%]">
                <img src={image} alt={`${name} ${i + 1}`} className="aspect-square w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div
          className="relative hidden aspect-square cursor-zoom-in overflow-hidden md:block"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            setOrigin(`${((e.clientX - rect.left) / rect.width) * 100}% ${((e.clientY - rect.top) / rect.height) * 100}%`)
            setZoomed(true)
          }}
          onMouseLeave={() => setZoomed(false)}
        >
          <img
            src={src}
            alt={name}
            className={cn("h-full w-full object-cover transition-transform duration-300", zoomed ? "scale-150" : "scale-100")}
            style={{ transformOrigin: origin }}
          />
        </div>
        {images.length > 1 ? (
          <>
            <button
              type="button"
              className="absolute left-3 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 shadow-sm md:flex"
              onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
              aria-label="Previous image"
            >
              <Icon icon={ArrowLeft01Icon} size={18} />
            </button>
            <button
              type="button"
              className="absolute right-3 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 shadow-sm md:flex"
              onClick={() => setIndex((i) => (i + 1) % images.length)}
              aria-label="Next image"
            >
              <Icon icon={ArrowRight01Icon} size={18} />
            </button>
          </>
        ) : null}
      </div>
      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {images.map((image, i) => (
            <button
              key={`${image}-thumb-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "aspect-square overflow-hidden rounded-2xl border-2 bg-muted",
                i === index ? "border-primary" : "border-transparent"
              )}
            >
              <img src={image} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
