"use client"

import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    id: 1,
    name: "John Kamau",
    role: "Construction Manager",
    company: "Nairobi",
    rating: 5,
    text: "Hardware Store has consistently provided top-quality materials for our construction projects. Their delivery is always on time, and their prices are competitive.",
    avatar: "/images/testimonials/john-kamau.jpg"
  },
  {
    id: 2,
    name: "Sarah Ochieng",
    role: "Independent Contractor",
    company: "Kisumu",
    rating: 5,
    text: "As a contractor, reliability is crucial. Hardware Store has never disappointed with their wide range of products and excellent customer service. They're my go-to supplier.",
    avatar: "/images/testimonials/sarah-ochieng.jpg"
  },
  {
    id: 3,
    name: "David Mutua",
    role: "Project Manager",
    company: "Mombasa",
    rating: 5,
    text: "The bulk ordering process is seamless, and their technical team is always ready to provide expert advice. Great experience working with them.",
    avatar: "/images/testimonials/david-mutua.jpg"
  },
  {
    id: 4,
    name: "Alice Wanjiku",
    role: "Property Developer",
    company: "Nairobi",
    rating: 5,
    text: "Best prices for quality building materials in Nairobi. Their product range is extensive, and the staff is knowledgeable and helpful.",
    avatar: "/images/testimonials/alice-wanjiku.jpg"
  },
  {
    id: 5,
    name: "James Kiprop",
    role: "Site Manager",
    company: "Eldoret",
    rating: 5,
    text: "Their online ordering system makes it easy to get materials delivered to our construction sites. Very professional service!",
    avatar: "/images/testimonials/james-kiprop.jpg"
  },
  {
    id: 6,
    name: "Mary Njeri",
    role: "DIY Enthusiast",
    company: "Nakuru",
    rating: 5,
    text: "As someone who loves DIY projects, I appreciate their wide selection and helpful staff. They always guide me to the right products.",
    avatar: "/images/testimonials/mary-njeri.jpg"
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="space-y-3 sm:space-y-4 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
              <Quote className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Customer Testimonials</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 text-balance">
              What Our Customers Say
            </h2>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl sm:max-w-3xl mx-auto text-pretty leading-relaxed px-2">
              Don't just take our word for it. Here's what construction professionals and homeowners have to say about our products and services.
            </p>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="animate-fade-in-up hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30">
                <CardContent className="p-4 sm:p-6">
                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-3 sm:mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 text-pretty leading-relaxed">
                    "{testimonial.text}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm sm:text-lg font-bold text-primary">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-foreground text-sm sm:text-base">
                        {testimonial.name}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {testimonial.role}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <div className="bg-primary text-primary-foreground rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-2xl sm:max-w-3xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              Join Thousands of Satisfied Customers
            </h3>
            <p className="text-primary-foreground/90 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg">
              Experience the same quality service and products that our customers love. 
              Start your project with confidence today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                href="/search"
                className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-primary rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm sm:text-base"
              >
                Start Shopping
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 border border-white text-white rounded-lg font-medium hover:bg-white hover:text-primary transition-colors text-sm sm:text-base"
              >
                Get Expert Advice
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
