"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

const brands = [
  {
    id: 1,
    name: "DeWalt",
    logo: "/images/hero/dewalt.png",
    fallback: "DW",
    url: "/brands/dewalt"
  },
  {
    id: 2,
    name: "Makita",
    logo: "/images/hero/makita.png",
    fallback: "MK",
    url: "/brands/makita"
  },
  {
    id: 3,
    name: "Milwaukee",
    logo: "/images/hero/milwaukee.png",
    fallback: "MW",
    url: "/brands/milwaukee"
  },
  {
    id: 4,
    name: "Bosch",
    logo: "/images/hero/bosch.png",
    fallback: "BC",
    url: "/brands/bosch"
  },
  {
    id: 5,
    name: "Stanley",
    logo: "/images/hero/stanley.png",
    fallback: "ST",
    url: "/brands/stanley"
  },
  {
    id: 6,
    name: "Craftsman",
    logo: "/images/hero/craftsman.png",
    fallback: "CM",
    url: "/brands/craftsman"
  },
  {
    id: 7,
    name: "Klein Tools",
    logo: "/images/hero/klein.png",
    fallback: "KL",
    url: "/brands/klein"
  },
  {
    id: 8,
    name: "Southwire",
    logo: "/images/hero/southwire.png",
    fallback: "SW",
    url: "/brands/southwire"
  },
  {
    id: 9,
    name: "Ridgid",
    logo: "/images/hero/ridgid.png",
    fallback: "RG",
    url: "/brands/ridgid"
  },
  {
    id: 10,
    name: "Knipex",
    logo: "/images/hero/knipex.png",
    fallback: "KP",
    url: "/brands/knipex"
  },
  {
    id: 11,
    name: "Wera",
    logo: "/images/hero/wera.png",
    fallback: "WR",
    url: "/brands/wera"
  },
  {
    id: 12,
    name: "Hilti",
    logo: "/images/hero/hilti.png",
    fallback: "HT",
    url: "/brands/hilti"
  }
]

export function BrandsSection() {
  const [isHovered, setIsHovered] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const animate = () => {
      if (!isHovered && scrollRef.current) {
        const currentScroll = scrollRef.current.scrollLeft
        const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth
        const newScroll = currentScroll + 1.5 // Increased speed for more visible movement
        
        if (newScroll >= maxScroll) {
          scrollRef.current.scrollLeft = 0
        } else {
          scrollRef.current.scrollLeft = newScroll
        }
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isHovered])

  const handleBrandClick = (brand: typeof brands[0]) => {
    console.log(`Brand clicked: ${brand.name}`)
  }

  return (
    <section className="py-12 sm:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="animate-fade-in">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Trusted Brands
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              We partner with the world's leading brands to provide you with quality tools and materials
            </p>
          </div>
        </div>

        {/* Brands Scroll Container */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Gradient Overlays for Smooth Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 lg:w-16 bg-gradient-to-r from-muted/30 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 lg:w-16 bg-gradient-to-l from-muted/30 to-transparent z-10 pointer-events-none" />

          {/* Scrollable Brands */}
          <div
            ref={scrollRef}
            className="flex space-x-6 sm:space-x-8 md:space-x-10 lg:space-x-12 py-4 sm:py-6"
            style={{
              scrollBehavior: isHovered ? 'smooth' : 'auto'
            }}
          >
            {/* Duplicate brands for seamless infinite scroll */}
            {[...brands, ...brands].map((brand, index) => (
              <div
                key={`${brand.id}-${index}`}
                className="animate-fade-in-up hover:scale-105 transition-all duration-200 flex-shrink-0"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <Link
                  href={brand.url}
                  onClick={() => handleBrandClick(brand)}
                  className="group block"
                  aria-label={`Visit ${brand.name} brand page`}
                >
                  <div className="bg-white rounded-full p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-border/50 hover:border-primary/30">
                    {/* Logo Container - Smaller and Rounded */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center">
                      {brand.logo ? (
                        <img
                          src={brand.logo}
                          alt={`${brand.name} logo`}
                          className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted rounded-full flex items-center justify-center">
                          <span className="text-xs sm:text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors">
                            {brand.fallback}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Hover Indicator */}
          {isHovered && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/20 text-white px-3 py-1.5 rounded-full backdrop-blur-sm pointer-events-none animate-fade-in">
              <span className="text-xs font-medium">Scroll paused</span>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-6 sm:mt-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            Can't find your preferred brand? We can source it for you.
          </p>
          <Link
            href="/brands"
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors text-sm sm:text-base"
          >
            View All Brands
            <ExternalLink className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
