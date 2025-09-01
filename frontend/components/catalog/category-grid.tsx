import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Wrench, Hammer, Zap, Droplets, PaintBucket, Drill, HardHat, HardDrive as Screwdriver, Star, TrendingUp } from "lucide-react"

const categories = [
  {
    name: "Building Materials",
    slug: "building-materials",
    icon: HardHat,
    description: "Cement, steel bars, bricks, and construction essentials",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    priceRange: "From KES 500",
    popular: true,
    discount: "Bulk discounts available",
    backgroundImage: "/images/hero/crown.jpg"
  },
  {
    name: "Power Tools",
    slug: "power-tools",
    icon: Drill,
    description: "Professional electric and battery-powered tools",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    priceRange: "From KES 8,000",
    popular: true,
    discount: "Save up to 20%",
    backgroundImage: "/images/hero/tools.jpg"
  },
  {
    name: "Hand Tools",
    slug: "hand-tools",
    icon: Hammer,
    description: "Quality hand tools for every trade and DIY project",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    priceRange: "From KES 1,200",
    popular: false,
    discount: "Professional grade",
    backgroundImage: "/images/hero/tools.jpg"
  },
  {
    name: "Electrical Supplies",
    slug: "electrical",
    icon: Zap,
    description: "Wiring, switches, outlets, and electrical components",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    priceRange: "From KES 300",
    popular: true,
    discount: "Wide selection",
    backgroundImage: "/images/hero/crown.jpg"
  },
  {
    name: "Plumbing",
    slug: "plumbing",
    icon: Droplets,
    description: "Pipes, fittings, fixtures, and plumbing supplies",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    priceRange: "From KES 150",
    popular: false,
    discount: "Quality guaranteed",
    backgroundImage: "/images/hero/tools.jpg"
  },
  {
    name: "Paint & Finishes",
    slug: "paint",
    icon: PaintBucket,
    description: "Interior and exterior paints, brushes, and supplies",
    color: "text-green-600",
    bgColor: "bg-green-50",
    priceRange: "From KES 800",
    popular: true,
    discount: "Easter sale 15% off",
    backgroundImage: "/images/hero/crown.jpg"
  },
  {
    name: "Hardware",
    slug: "hardware",
    icon: Screwdriver,
    description: "Screws, bolts, nails, and fasteners for any project",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    priceRange: "From KES 50",
    popular: false,
    discount: "Bulk pricing",
    backgroundImage: "/images/hero/tools.jpg"
  },
  {
    name: "Tiles & Sanitary",
    slug: "tiles-sanitary",
    icon: Wrench,
    description: "Floor tiles, wall tiles, and bathroom accessories",
    color: "text-red-600",
    bgColor: "bg-red-50",
    priceRange: "From KES 1,500",
    popular: true,
    discount: "Installation support",
    backgroundImage: "/images/hero/tools.jpg"
  }
]

export function CategoryGrid() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Enhanced Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="space-y-3 sm:space-y-4 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Most Popular Categories</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 text-balance">
              Shop by Category
            </h2>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl sm:max-w-3xl mx-auto text-pretty leading-relaxed px-2">
              Find exactly what you need from our comprehensive selection of hardware and construction supplies. 
              Quality products at competitive prices with expert support.
            </p>
          </div>
        </div>

        {/* Enhanced Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <div
                key={category.slug}
                className="animate-fade-in-up hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link href={`/categories/${category.slug}`}>
                  <Card className={`h-full hover:shadow-xl transition-all duration-300 group border-2 hover:border-primary/30 relative overflow-hidden ${category.bgColor}`}>
                    {/* Faded Background Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                      style={{ backgroundImage: `url(${category.backgroundImage})` }}
                    />
                    {/* Content Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/80" />
                    <CardContent className="p-4 sm:p-6 text-center relative z-10">
                      {/* Popular Badge */}
                      {category.popular && (
                        <div className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 bg-primary text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold shadow-lg">
                          <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        </div>
                      )}
                      
                      {/* Icon */}
                      <div className="mb-3 sm:mb-4">
                        <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-white shadow-md group-hover:shadow-lg transition-all duration-300`}>
                          <IconComponent
                            className={`h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 ${category.color} group-hover:scale-110 transition-transform duration-300`}
                          />
                        </div>
                      </div>
                      
                      {/* Category Info */}
                      <h3 className="font-bold text-base sm:text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 text-pretty leading-relaxed">
                        {category.description}
                      </p>
                      
                      {/* Price Range */}
                      <div className="text-xs sm:text-sm font-semibold text-foreground mb-2">
                        {category.priceRange}
                      </div>
                      
                      {/* Discount/Feature */}
                      <div className="text-xs text-primary font-medium">
                        {category.discount}
                      </div>
                      
                      {/* Hover Effect */}
                      <div className="mt-3 sm:mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="inline-flex items-center text-primary text-xs sm:text-sm font-medium">
                          <span>Explore {category.name}</span>
                          <svg className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8 sm:mt-12 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <div className="bg-muted/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              Our expert team can help you source any specific products or provide technical advice for your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/search"
                className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm sm:text-base"
              >
                Browse All Products
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-colors text-sm sm:text-base"
              >
                Contact Our Experts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
