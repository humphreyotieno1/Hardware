"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

const partners = [
  {
    id: 1,
    name: "Bamburi Cement",
    logo: "/images/partners/bamburi.jpeg",
    fallback: "BC",
    url: "https://www.facebook.com/BamburiCementPLC/"
  },
  {
    id: 2,
    name: "Muthokinju",
    logo: "/images/partners/muthokinju.jpeg",
    fallback: "MK",
    url: "https://www.muthokinju.co.ke/"
  },
  {
    id: 3,
    name: "Crown Paints",
    logo: "/images/partners/crownpaints.jpeg",
    fallback: "CP",
    url: "https://www.crownpaints.co.ke/"
  },
  {
    id: 4,
    name: "CCL Kisumu",
    logo: "/images/partners/cclkisumu.jpg",
    fallback: "CK",
    url: "https://www.instagram.com/ccl.ltd/"
  },
  {
    id: 5,
    name: "Coolbase",
    logo: "/images/partners/coolbase.jpg",
    fallback: "CB",
    url: "https://www.facebook.com/Coolbasehardware/"
  }
]

export function PartnersSection() {
  const [isHovered, setIsHovered] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  const itemWidthRef = useRef<number>(0)

  useEffect(() => {
    const animate = () => {
      if (!isHovered && scrollRef.current) {
        const currentScroll = scrollRef.current.scrollLeft
        const itemWidth = itemWidthRef.current
        
        if (itemWidth > 0) {
          const newScroll = currentScroll + 1.5
          const totalWidth = partners.length * itemWidth
          
          // Reset to beginning when we've scrolled through all partners
          if (newScroll >= totalWidth) {
            scrollRef.current.scrollLeft = 0
          } else {
            scrollRef.current.scrollLeft = newScroll
          }
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

  // Calculate item width after component mounts
  useEffect(() => {
    if (scrollRef.current) {
      const firstItem = scrollRef.current.querySelector('[data-partner-item]') as HTMLElement
      if (firstItem) {
        itemWidthRef.current = firstItem.offsetWidth + 24 // 24px for spacing
      }
    }
  }, [])

  const handlePartnerClick = (partner: typeof partners[0]) => {
    console.log(`Partner clicked: ${partner.name}`)
  }

  return (
    <section className="py-12 sm:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="animate-fade-in">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Our Partners
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              We partner with trusted companies to provide you with quality materials and services
            </p>
          </div>
        </div>

        {/* Partners Scroll Container */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Gradient Overlays for Smooth Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 lg:w-16 bg-gradient-to-r from-muted/30 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 lg:w-16 bg-gradient-to-l from-muted/30 to-transparent z-10 pointer-events-none" />

          {/* Scrollable Partners */}
          <div
            ref={scrollRef}
            className="flex justify-center space-x-6 sm:space-x-8 md:space-x-10 lg:space-x-12 py-4 sm:py-6"
            style={{
              scrollBehavior: isHovered ? 'smooth' : 'auto'
            }}
          >
            {/* Partners */}
            {partners.map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                data-partner-item
                className="animate-fade-in-up hover:scale-105 transition-all duration-200 flex-shrink-0"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <Link
                  href={partner.url}
                  onClick={() => handlePartnerClick(partner)}
                  className="group block"
                  aria-label={`Visit ${partner.name} partner page`}
                >
                  <div className="bg-white rounded-full p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-border/50 hover:border-primary/30">
                    {/* Logo Container - Smaller and Rounded */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center">
                      {partner.logo ? (
                        <img
                          src={partner.logo}
                          alt={`${partner.name} logo`}
                          className="w-full h-full object-contain filter group-hover:grayscale-0 transition-all duration-300 rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted rounded-full flex items-center justify-center">
                          <span className="text-xs sm:text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors">
                            {partner.fallback}
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
            Interested in partnering with us? Let's work together.
          </p>
          <Link
            href="/partners"
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors text-sm sm:text-base"
          >
            View All Partners
            <ExternalLink className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
