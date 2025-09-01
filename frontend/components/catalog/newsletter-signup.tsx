"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"

const backgroundImages = [
  {
    src: "/images/newsletter/tools.jpg",
    alt: "Professional tools and equipment",
    fallback: "bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800"
  },
  {
    src: "/images/newsletter/crown.jpg",
    alt: "Construction site and materials",
    fallback: "bg-gradient-to-br from-orange-500 via-red-600 to-pink-700"
  },
  {
    src: "/images/newsletter/crown.jpg",
    alt: "Electrical supplies and wiring",
    fallback: "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600"
  },
  {
    src: "/images/newsletter/tools.jpg",
    alt: "Hardware store interior",
    fallback: "bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700"
  }
]

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentBgIndex, setCurrentBgIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 6000) // Change background every 6 seconds

    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubscribed(true)
    setIsLoading(false)
    setEmail("")
  }

  const nextBackground = () => {
    setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length)
  }

  const prevBackground = () => {
    setCurrentBgIndex((prev) => (prev - 1 + backgroundImages.length) % backgroundImages.length)
  }

  if (isSubscribed) {
    return (
      <section className="relative py-16 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 ${index === currentBgIndex ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1500`}
            >
              <div className={`absolute inset-0 ${image.fallback}`} />
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${image.src})`,
                }}
              />
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="animate-fade-in-up">
            <Card className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="animate-scale-in">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2 animate-fade-in-up">
                  Thank You!
                </h2>
                <p className="text-muted-foreground animate-fade-in-up">
                  You've successfully subscribed to our newsletter. You'll receive updates on new products, special
                  offers, and industry news.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 ${index === currentBgIndex ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1500`}
          >
            <div className={`absolute inset-0 ${image.fallback}`} />
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${image.src})`,
              }}
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
      </div>

      {/* Background Navigation */}
      <div className="absolute top-4 right-4 z-20 flex space-x-2">
        <button
          onClick={prevBackground}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-300 backdrop-blur-sm"
          aria-label="Previous background"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={nextBackground}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-300 backdrop-blur-sm"
          aria-label="Next background"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Background Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBgIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentBgIndex
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to background ${index + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="animate-fade-in-up">
          <Card className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="animate-scale-in">
                <Mail className="h-12 w-12 sm:h-16 sm:w-16 text-accent-foreground mx-auto mb-4 sm:mb-6" />
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 text-balance">
                Stay Updated with Latest Products & Offers
              </h2>
              
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-4 sm:mb-6 text-pretty px-2">
                Get notified about new arrivals, special offers, and industry insights. Join thousands of professionals
                who trust our updates. Skip traffic hours with our convenient online shopping experience.
              </p>

              {/* Benefits List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <span>Exclusive member discounts</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <span>Early access to sales</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <span>Technical tips & guides</span>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto animate-fade-in-up"
              >
                <div className="flex-1 hover:scale-105 transition-transform duration-200">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background border-2 focus:border-primary transition-all duration-300 h-10 sm:h-11 text-sm sm:text-base"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="hover:scale-105 active:scale-95 transition-transform duration-200">
                  <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="bg-primary hover:bg-primary/90 transition-all duration-300 w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base"
                  >
                    {isLoading ? "Subscribing..." : "Subscribe"}
                  </Button>
                </div>
              </form>

              <p className="text-xs text-muted-foreground mt-3 sm:mt-4 animate-fade-in">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
