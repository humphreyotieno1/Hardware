"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { Button } from "@/components/ui/button"
import { env } from "@/lib/config/env"
import { Icon } from "@/lib/icons"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

const SLIDES = [
  {
    image: "/images/hero/storefront.jpg",
    eyebrow: "Siaya, Kenya",
    title: "Professional hardware for every project",
    text: "Construction, plumbing, electrical and hardware supplies for contractors, technicians and customers.",
    cta: { href: "/shop", label: "Shop now" },
    secondary: { href: "/contact", label: "Contact us" },
  },
  {
    image: "/images/hero/building-blocks.jpg",
    eyebrow: "Building supplies",
    title: "Materials that keep the site moving",
    text: "Cement, blocks, timber, roofing, masonry and everyday construction stock from our store in Siaya.",
    cta: { href: "/categories/building", label: "Shop building" },
    secondary: { href: "/services", label: "Our services" },
  },
  {
    image: "/images/hero/block-yard.jpg",
    eyebrow: "From the yard",
    title: "Stock on the ground, ready for collection",
    text: "Visit us on Siaya-Bondo Highway, opposite Siaya Prison, or call us for availability and delivery.",
    cta: { href: "/shop", label: "Shop now" },
    secondary: { href: env.getWhatsAppUrl("Hello! I need help with a hardware order."), label: "Talk to us", external: true },
  },
]

export function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 28 }, [
    Autoplay({ delay: 6500, stopOnInteraction: false, stopOnMouseEnter: true }),
  ])
  const [index, setIndex] = useState(0)

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

  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {SLIDES.map((slide, i) => (
            <div key={slide.title} className="relative min-w-0 flex-[0_0_100%]">
              <div className="absolute inset-0">
                <img src={slide.image} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/30" />
              </div>
              <div className="relative container mx-auto flex min-h-[440px] flex-col justify-center px-4 py-14 sm:min-h-[520px] lg:min-h-[600px]">
                <div key={i === index ? `${slide.title}-on` : `${slide.title}-off`}>
                  {i === index ? (
                    <>
                      <p className="reveal-up mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">
                        {slide.eyebrow}
                      </p>
                      <h1 className="reveal-up stagger-1 max-w-xl font-display text-4xl font-semibold leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
                        {slide.title}
                      </h1>
                      <p className="reveal-up stagger-2 mt-4 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
                        {slide.text}
                      </p>
                      <div className="reveal-up stagger-3 mt-7 flex flex-col gap-3 sm:flex-row">
                        <Button asChild size="lg">
                          <Link href={slide.cta.href}>{slide.cta.label}</Link>
                        </Button>
                        {slide.secondary.external ? (
                          <Button asChild size="lg" variant="outline" className="border-white/35 bg-transparent text-white hover:bg-white/10">
                            <a href={slide.secondary.href}>{slide.secondary.label}</a>
                          </Button>
                        ) : (
                          <Button asChild size="lg" variant="outline" className="border-white/35 bg-transparent text-white hover:bg-white/10">
                            <Link href={slide.secondary.href}>{slide.secondary.label}</Link>
                          </Button>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">{slide.eyebrow}</p>
                      <h1 className="max-w-xl font-display text-4xl font-semibold leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">{slide.title}</h1>
                      <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">{slide.text}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="absolute left-3 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/70 md:flex"
        onClick={() => emblaApi?.scrollPrev()}
        aria-label="Previous slide"
      >
        <Icon icon={ArrowLeft01Icon} />
      </button>
      <button
        type="button"
        className="absolute right-3 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/70 md:flex"
        onClick={() => emblaApi?.scrollNext()}
        aria-label="Next slide"
      >
        <Icon icon={ArrowRight01Icon} />
      </button>

      <div className="absolute bottom-5 left-0 right-0 z-10 flex justify-center gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            className={cn("h-2 rounded-full transition-all duration-300", i === index ? "w-8 bg-primary" : "w-2 bg-white/40")}
            onClick={() => emblaApi?.scrollTo(i)}
          />
        ))}
      </div>
    </section>
  )
}
