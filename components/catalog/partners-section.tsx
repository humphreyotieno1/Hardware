"use client"

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
        <div className="relative overflow-hidden">
          {/* Gradient Overlays for Smooth Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 lg:w-16 bg-gradient-to-r from-muted/30 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 lg:w-16 bg-gradient-to-l from-muted/30 to-transparent z-10 pointer-events-none" />

          {/* Scrollable Partners */}
          <div
            className="flex justify-center items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 py-4 sm:py-6 overflow-x-auto snap-x snap-mandatory scroll-smooth"
            role="list"
            aria-label="Partners logos"
          >
            {/* Partners */}
            {partners.map(partner => (
              <div
                key={partner.id}
                data-partner-item
                className="animate-fade-in-up hover:scale-105 transition-all duration-200 flex-shrink-0 snap-start"
              >
                <Link
                  href={partner.url}
                  onClick={() => handlePartnerClick(partner)}
                  className="group block"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${partner.name} partner page`}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
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
                    <span className="text-sm sm:text-base font-medium text-foreground/90 group-hover:text-primary transition-colors">
                      {partner.name}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        {/* <div className="text-center mt-6 sm:mt-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
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
        </div> */}
      </div>
    </section>
  )
}
