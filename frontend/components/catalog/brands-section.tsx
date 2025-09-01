"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

const brands = [
  {
    id: 1,
    name: "DeWalt",
    logo: "/images/hero/tools.jpg",
    fallback: "DeWalt",
    url: "/brands/dewalt",
    category: "Power Tools"
  },
  {
    id: 2,
    name: "Makita",
    logo: "/images/hero/tools.jpg",
    fallback: "Makita",
    url: "/brands/makita",
    category: "Power Tools"
  },
  {
    id: 3,
    name: "Milwaukee",
    logo: "/images/hero/tools.jpg",
    fallback: "Milwaukee",
    url: "/brands/milwaukee",
    category: "Power Tools"
  },
  {
    id: 4,
    name: "Bosch",
    logo: "/images/hero/tools.jpg",
    fallback: "Bosch",
    url: "/brands/bosch",
    category: "Power Tools"
  },
  {
    id: 5,
    name: "Stanley",
    logo: "/images/hero/tools.jpg",
    fallback: "Stanley",
    url: "/brands/stanley",
    category: "Hand Tools"
  },
  {
    id: 6,
    name: "Craftsman",
    logo: "/images/hero/tools.jpg",
    fallback: "Craftsman",
    url: "/brands/craftsman",
    category: "Hand Tools"
  },
  {
    id: 7,
    name: "Klein Tools",
    logo: "/images/hero/tools.jpg",
    fallback: "Klein",
    url: "/brands/klein",
    category: "Electrical"
  },
  {
    id: 8,
    name: "Southwire",
    logo: "/images/hero/tools.jpg",
    fallback: "Southwire",
    url: "/brands/southwire",
    category: "Electrical"
  },
  {
    id: 9,
    name: "Ridgid",
    logo: "/images/hero/tools.jpg",
    fallback: "Ridgid",
    url: "/brands/ridgid",
    category: "Plumbing"
  },
  {
    id: 10,
    name: "Knipex",
    logo: "/images/hero/tools.jpg",
    fallback: "Knipex",
    url: "/brands/knipex",
    category: "Hand Tools"
  },
  {
    id: 11,
    name: "Wera",
    logo: "/images/hero/tools.jpg",
    fallback: "Wera",
    url: "/brands/wera",
    category: "Hand Tools"
  },
  {
    id: 12,
    name: "Hilti",
    logo: "/images/hero/tools.jpg",
    fallback: "Hilti",
    url: "/brands/hilti",
    category: "Construction"
  }
]

export function BrandsSection() {
  const [isHovered, setIsHovered] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    let animationId: number
    let currentPosition = scrollPosition

    const animate = () => {
      if (!isHovered && scrollRef.current) {
        currentPosition += 0.5 // Adjust speed here
        if (currentPosition >= scrollRef.current.scrollWidth / 2) {
          currentPosition = 0
        }
        setScrollPosition(currentPosition)
        scrollRef.current.scrollLeft = currentPosition
      }
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isHovered, scrollPosition])

  const handleBrandClick = (brand: typeof brands[0]) => {
    // You can add analytics tracking here
    console.log(`Brand clicked: ${brand.name}`)
    // The Link component will handle the navigation
  }

  return (
    <section className="py-12 sm:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="animate-fade-in">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Trusted by Professionals
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
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 lg:w-20 bg-gradient-to-r from-muted/30 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 lg:w-20 bg-gradient-to-l from-muted/30 to-transparent z-10 pointer-events-none" />

          {/* Scrollable Brands */}
          <div
            ref={scrollRef}
            className="flex space-x-8 sm:space-x-12 md:space-x-16 lg:space-x-20 py-6 sm:py-8"
            style={{
              scrollBehavior: isHovered ? 'smooth' : 'auto'
            }}
          >
            {/* Duplicate brands for seamless infinite scroll */}
            {[...brands, ...brands].map((brand, index) => (
              <div
                key={`${brand.id}-${index}`}
                className="animate-fade-in-up hover:scale-110 hover:-translate-y-1 transition-all duration-200 flex-shrink-0"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Link
                  href={brand.url}
                  onClick={() => handleBrandClick(brand)}
                  className="group block"
                  aria-label={`Visit ${brand.name} brand page`}
                >
                  <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-primary/30">
                    {/* Logo Container */}
                    <div className="w-20 h-12 sm:w-24 sm:h-16 md:w-32 md:h-20 flex items-center justify-center mb-2 sm:mb-3">
                      {brand.logo ? (
                        <img
                          src={brand.logo}
                          alt={`${brand.name} logo`}
                          className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                        />
                      ) : (
                        <div className="text-center">
                          <div className="text-sm sm:text-lg md:text-xl font-bold text-muted-foreground group-hover:text-primary transition-colors">
                            {brand.fallback}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Brand Info */}
                    <div className="text-center">
                      <h3 className="font-semibold text-xs sm:text-sm md:text-base text-foreground group-hover:text-primary transition-colors mb-1">
                        {brand.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        {brand.category}
                      </p>
                      
                      {/* Visit Link */}
                      <div className="flex items-center justify-center space-x-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>Visit</span>
                        <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Hover Indicator */}
          {isHovered && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/20 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm pointer-events-none animate-fade-in">
              <span className="text-xs sm:text-sm font-medium">Scroll paused</span>
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
