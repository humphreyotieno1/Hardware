"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Wrench, 
  Hammer, 
  Zap, 
  Droplets, 
  PaintBucket, 
  Drill, 
  HardHat, 
  Settings as Screwdriver,
  Package,
  ArrowRight
} from "lucide-react"
import { useEffect, useState } from "react"
import { productsApi } from "@/lib/api/products"
import type { Category, Product } from "@/lib/api/types"

interface CategoryWithCount extends Category {
  productCount: number
  icon: any
  description: string
  color: string
  bgColor: string
  priceRange: string
  popular: boolean
  discount: string
}

const categoryData = [
  {
    slug: "building-materials",
    icon: HardHat,
    description: "Cement, steel bars, bricks, and construction essentials",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    priceRange: "From KES 500",
    popular: true,
    discount: "Bulk discounts available"
  },
  {
    slug: "power-tools",
    icon: Drill,
    description: "Professional electric and battery-powered tools",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    priceRange: "From KES 8,000",
    popular: true,
    discount: "Save up to 20%"
  },
  {
    slug: "hand-tools",
    icon: Hammer,
    description: "Quality hand tools for every trade and DIY project",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    priceRange: "From KES 1,200",
    popular: false,
    discount: "Professional grade"
  },
  {
    slug: "electrical",
    icon: Zap,
    description: "Wiring, switches, outlets, and electrical components",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    priceRange: "From KES 300",
    popular: true,
    discount: "Wide selection"
  },
  {
    slug: "plumbing",
    icon: Droplets,
    description: "Pipes, fittings, fixtures, and plumbing supplies",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    priceRange: "From KES 150",
    popular: false,
    discount: "Quality guaranteed"
  },
  {
    slug: "paint",
    icon: PaintBucket,
    description: "Interior and exterior paints, brushes, and supplies",
    color: "text-green-600",
    bgColor: "bg-green-50",
    priceRange: "From KES 800",
    popular: true,
    discount: "Easter sale 15% off"
  },
  {
    slug: "hardware",
    icon: Screwdriver,
    description: "Screws, bolts, nails, and fasteners for any project",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    priceRange: "From KES 50",
    popular: false,
    discount: "Bulk pricing"
  },
  {
    slug: "tiles-sanitary",
    icon: Wrench,
    description: "Floor tiles, wall tiles, and bathroom accessories",
    color: "text-red-600",
    bgColor: "bg-red-50",
    priceRange: "From KES 1,500",
    popular: true,
    discount: "Installation support"
  }
]

export function CategoriesListing() {
  const [categoriesWithCounts, setCategoriesWithCounts] = useState<CategoryWithCount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategoriesWithCounts = async () => {
      try {
        setLoading(true)
        
        // Get all categories from API
        const categories = await productsApi.getCategories()
        
        // Get product counts for each category
        const categoriesWithCounts = await Promise.all(
          categories.map(async (category) => {
            try {
              const result = await productsApi.getProductsByCategory(category.slug, { limit: 1 })
              const categoryInfo = categoryData.find(c => c.slug === category.slug)
              
              return {
                ...category,
                productCount: result.total,
                ...(categoryInfo || {
                  icon: Wrench,
                  description: "Various products and supplies",
                  color: "text-gray-600",
                  bgColor: "bg-gray-50",
                  priceRange: "From KES 100",
                  popular: false,
                  discount: "Quality products"
                })
              } as CategoryWithCount
            } catch (error) {
              console.error(`Error fetching products for category ${category.slug}:`, error)
              const categoryInfo = categoryData.find(c => c.slug === category.slug)
              return {
                ...category,
                productCount: 0,
                ...(categoryInfo || {
                  icon: Wrench,
                  description: "Various products and supplies",
                  color: "text-gray-600",
                  bgColor: "bg-gray-50",
                  priceRange: "From KES 100",
                  popular: false,
                  discount: "Quality products"
                })
              } as CategoryWithCount
            }
          })
        )
        
        setCategoriesWithCounts(categoriesWithCounts)
      } catch (error) {
        console.error("Error fetching categories:", error)
        // Fallback to static data if API fails
        setCategoriesWithCounts(
          categoryData.map(cat => ({
            id: cat.slug,
            name: cat.slug.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
            slug: cat.slug,
            productCount: 0,
            ...cat
          }))
        )
      } finally {
        setLoading(false)
      }
    }

    fetchCategoriesWithCounts()
  }, [])

  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Browse Categories
            </h1>
            <p className="text-muted-foreground">
              Loading categories...
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-16 w-16 bg-muted rounded-full mx-auto mb-4" />
                  <div className="h-6 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded mb-4" />
                  <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Browse Categories
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive selection of hardware and construction supplies organized by category
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoriesWithCounts.map((category, index) => {
            const IconComponent = category.icon
            return (
              <div
                key={category.slug}
                className="animate-fade-in-up hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link href={`/categories/${category.slug}`}>
                  <Card className={`h-full hover:shadow-xl transition-all duration-300 group border-2 hover:border-primary/30 relative overflow-hidden ${category.bgColor}`}>
                    <CardContent className="p-6 text-center relative z-10">
                      {/* Popular Badge */}
                      {category.popular && (
                        <div className="absolute -top-2 -right-2 bg-primary text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                          Popular
                        </div>
                      )}
                      
                      {/* Icon */}
                      <div className="mb-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md group-hover:shadow-lg transition-all duration-300">
                          <IconComponent
                            className={`h-8 w-8 ${category.color} group-hover:scale-110 transition-transform duration-300`}
                          />
                        </div>
                      </div>
                      
                      {/* Category Info */}
                      <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {category.description}
                      </p>
                      
                      {/* Product Count */}
                      <div className="mb-3">
                        <Badge variant="secondary" className="text-sm">
                          <Package className="h-3 w-3 mr-1" />
                          {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
                        </Badge>
                      </div>
                      
                      {/* Price Range */}
                      <div className="text-sm font-semibold text-foreground mb-2">
                        {category.priceRange}
                      </div>
                      
                      {/* Discount/Feature */}
                      <div className="text-xs text-primary font-medium mb-4">
                        {category.discount}
                      </div>
                      
                      {/* Hover Effect */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="inline-flex items-center text-primary text-sm font-medium">
                          <span>Explore {category.name}</span>
                          <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
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
        <div className="text-center mt-12">
          <div className="bg-muted/50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Need Help Finding Something?
            </h3>
            <p className="text-muted-foreground mb-6">
              Our expert team can help you source any specific products or provide technical advice for your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/search"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Search All Products
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Get Expert Help
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
