"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, ChevronLeft, ChevronRight } from "lucide-react"

const heroImages = [
  {
    src: "/images/hero/tools.jpg",
    alt: "Professional construction tools",
  },
  {
    src: "/images/hero/crown.jpg",
    alt: "Building materials",
  },
  {
    src: "/images/hero/tools.jpg",
    alt: "Hardware supplies",
  }
]

const benefits = [
  "Fast and reliable delivery",
  "Quality guaranteed products",
  "Expert technical support",
  "Bulk order discounts"
]

const collageImages = [
  { src: "/images/hero/tools.jpg", rotate: "-6deg", translateY: "15px" },
  { src: "/images/hero/crown.jpg", rotate: "4deg", translateY: "-10px" },
  { src: "/images/hero/tools.jpg", rotate: "-3deg", translateY: "25px" },
  { src: "/images/hero/crown.jpg", rotate: "5deg", translateY: "0px" }
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroImages.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] overflow-hidden">
      {/* Carousel Background */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${image.src})` }}
            />
          </div>
        ))}

        {/* Multi-layer overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all duration-300 border border-white/20 shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all duration-300 border border-white/20 shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
              ? "w-8 bg-white"
              : "w-2 bg-white/50 hover:bg-white/70"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full text-sm font-medium border border-primary/30">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Now Open for Orders
              </div>

              {/* Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                Quick and Easy{" "}
                <span className="text-primary">Building Solutions</span>
              </h1>

              {/* Description */}
              <p className="text-white/80 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Quality products at competitive prices. Your one-stop shop for construction, plumbing, electrical work, and more.
                Trusted by professionals across Kenya with reliable delivery and expert support.
              </p>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 text-white/90">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                <Button size="lg" asChild className="group shadow-lg shadow-primary/25">
                  <Link href="/search">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white bg-white/5 backdrop-blur-sm"
                >
                  <Link href="/services">
                    View Services
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right - Tilted Image Collage */}
            <div className="hidden lg:block relative h-[450px]">
              <div className="absolute inset-0 grid grid-cols-2 gap-4">
                {collageImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-105 hover:z-10 group"
                    style={{
                      transform: `rotate(${image.rotate}) translateY(${image.translateY})`,
                    }}
                  >
                    {/* Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${image.src})` }}
                    />

                    {/* Darkening Overlay - Always visible */}
                    <div className="absolute inset-0 bg-black/30" />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Border */}
                    <div className="absolute inset-0 border-4 border-white/20 rounded-2xl shadow-inner" />
                  </div>
                ))}
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -top-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

              {/* Floating dots */}
              <div className="absolute top-1/3 -right-4 w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary/50" />
              <div className="absolute bottom-1/4 -left-3 w-3 h-3 bg-white/60 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
