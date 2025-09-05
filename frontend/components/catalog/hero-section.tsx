"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Wrench, Hammer, Zap, ChevronLeft, ChevronRight } from "lucide-react"

const heroImages = [
  {
    src: "/images/hero/tools.jpg",
    alt: "Professional construction tools and equipment",
    fallback: "bg-gradient-to-br from-blue-600 to-blue-800"
  },
  {
    src: "/images/hero/tools.jpg", 
    alt: "Electrical supplies and components",
    fallback: "bg-gradient-to-br from-yellow-500 to-orange-600"
  },
  {
    src: "/images/hero/tools.jpg",
    alt: "Plumbing materials and fixtures",
    fallback: "bg-gradient-to-br from-cyan-500 to-blue-600"
  },
  {
    src: "/images/hero/tools.jpg",
    alt: "Well-stocked hardware store interior",
    fallback: "bg-gradient-to-br from-green-600 to-emerald-700"
  }
]

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      nextImage()
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [currentImageIndex])

  const nextImage = () => {
    if (!isTransitioning) {
      setIsTransitioning(true)
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
      setTimeout(() => setIsTransitioning(false), 500)
    }
  }

  const prevImage = () => {
    if (!isTransitioning) {
      setIsTransitioning(true)
      setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)
      setTimeout(() => setIsTransitioning(false), 500)
    }
  }

  const goToImage = (index: number) => {
    if (!isTransitioning && index !== currentImageIndex) {
      setIsTransitioning(true)
      setCurrentImageIndex(index)
      setTimeout(() => setIsTransitioning(false), 500)
    }
  }

  return (
    <section className="relative h-[600px] sm:h-[550px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Carousel Background */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Try to load image, fallback to gradient if fails */}
            <div className="relative w-full h-full">
              <div className={`absolute inset-0 ${image.fallback}`} />
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${image.src})`,
                }}
              />
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black/30" />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Hidden on very small screens */}
      <button
        onClick={prevImage}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-1.5 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-300 backdrop-blur-sm"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
      </button>
      
      <button
        onClick={nextImage}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-1.5 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-300 backdrop-blur-sm"
        aria-label="Next image"
      >
        <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 flex space-x-1.5 sm:space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6 text-white text-center lg:text-left">
              <div className="space-y-3 sm:space-y-4 animate-fade-in">
                {/* Special Offer Badge */}
                <div className="inline-block bg-primary/90 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-sm animate-scale-in">
                  🎯 Get started. Save Big
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-balance leading-tight drop-shadow-lg">
                  Quick and Easy Building Solutions
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 text-pretty leading-relaxed drop-shadow-md max-w-2xl mx-auto lg:mx-0">
                  Quality products at competitive prices. Your one-stop shop for construction, plumbing, electrical work, and more. 
                  Trusted by professionals across Kenya with reliable delivery and expert support.
                </p>

                {/* Key Benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 pt-2 sm:pt-4">
                  <div className="flex items-center space-x-2 text-white/90">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full flex-shrink-0"></div>
                    <span className="text-xs sm:text-sm">Fast and reliable delivery</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/90">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full flex-shrink-0"></div>
                    <span className="text-xs sm:text-sm">Quality guaranteed products</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/90">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full flex-shrink-0"></div>
                    <span className="text-xs sm:text-sm">Expert technical support</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/90">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full flex-shrink-0"></div>
                    <span className="text-xs sm:text-sm">Bulk order discounts</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4 justify-center lg:justify-start">
                  <Button size="lg" variant="secondary" asChild className="text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6">
                    <Link href="/search">
                      Shop Now
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-primary bg-transparent text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6"
                    asChild
                  >
                    <Link href="/services">View Services</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Feature Cards - Enhanced with A&D Store inspiration */}
            <div className="hidden md:block relative">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 animate-slide-in-right">
                    <Wrench className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mx-auto mb-2 sm:mb-3 lg:mb-4 text-secondary" />
                    <h3 className="font-semibold mb-1 sm:mb-2 lg:mb-2 text-white text-sm sm:text-base">Professional Tools</h3>
                    <p className="text-xs sm:text-sm text-white/80">High-quality tools for every trade</p>
                    <div className="mt-2 sm:mt-3 text-xs text-white/60">Get quality tools at affordable prices</div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 animate-slide-in-right">
                    <Zap className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mx-auto mb-2 sm:mb-3 lg:mb-4 text-secondary" />
                    <h3 className="font-semibold mb-1 sm:mb-2 lg:mb-2 text-white text-sm sm:text-base">Electrical Supplies</h3>
                    <p className="text-xs sm:text-sm text-white/80">Complete electrical solutions</p>
                    <div className="mt-2 sm:mt-3 text-xs text-white/60">Wide range available</div>
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 animate-slide-in-left">
                    <Hammer className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mx-auto mb-2 sm:mb-3 lg:mb-4 text-secondary" />
                    <h3 className="font-semibold mb-1 sm:mb-2 lg:mb-2 text-white text-sm sm:text-base">Building Materials</h3>
                    <p className="text-xs sm:text-sm text-white/80">Cement, steel, and more</p>
                    <div className="mt-2 sm:mt-3 text-xs text-white/60">Bulk order discounts</div>
                  </div>
                </div>
              </div>

              {/* Floating Promo Card */}
              <div className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-primary text-white p-3 sm:p-4 rounded-lg shadow-lg border border-primary/20 animate-bounce-in">
                <div className="text-center">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold">Save Big</div>
                  <div className="text-xs">Limited Time</div>
                  <div className="text-xs opacity-80">Get Started</div>
                </div>
              </div>
            </div>

            {/* Mobile Feature Summary - Enhanced */}
            <div className="md:hidden text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white/20 animate-fade-in">
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  <div className="text-center">
                    <Wrench className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-secondary" />
                    <p className="text-xs sm:text-sm text-white/80">Tools</p>
                    <div className="text-xs text-white/60">Get quality tools at affordable prices</div>
                  </div>
                  <div className="text-center">
                    <Zap className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-secondary" />
                    <p className="text-xs sm:text-sm text-white/80">Electrical</p>
                    <div className="text-xs text-white/60">Wide Range</div>
                  </div>
                  <div className="text-center">
                    <Hammer className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-secondary" />
                    <p className="text-xs sm:text-sm text-white/80">Materials</p>
                    <div className="text-xs text-white/60">Bulk Discounts</div>
                  </div>
                </div>
                
                {/* Mobile Promo Badge */}
                <div className="mt-3 sm:mt-4 bg-primary/90 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs font-semibold">
                  🎯 Get Started. Save Big
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
