import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ExternalLink } from "lucide-react"
import Link from "next/link"

// Dummy brand data
const brands = [
  {
    id: "dewalt",
    name: "DeWalt",
    description: "Professional power tools and accessories",
    logo: "🔨",
    productCount: 45,
    category: "Power Tools",
    established: "1924",
    country: "USA",
    website: "https://dewalt.com"
  },
  {
    id: "makita",
    name: "Makita",
    description: "Cordless and corded power tools",
    logo: "⚡",
    productCount: 38,
    category: "Power Tools",
    established: "1915",
    country: "Japan",
    website: "https://makita.com"
  },
  {
    id: "milwaukee",
    name: "Milwaukee",
    description: "Heavy-duty power tools and accessories",
    logo: "🔧",
    productCount: 52,
    category: "Power Tools",
    established: "1924",
    country: "USA",
    website: "https://milwaukeetool.com"
  },
  {
    id: "stanley",
    name: "Stanley",
    description: "Hand tools and measuring instruments",
    logo: "📏",
    productCount: 67,
    category: "Hand Tools",
    established: "1843",
    country: "USA",
    website: "https://stanleytools.com"
  },
  {
    id: "bosch",
    name: "Bosch",
    description: "Power tools and automotive equipment",
    logo: "⚙️",
    productCount: 41,
    category: "Power Tools",
    established: "1886",
    country: "Germany",
    website: "https://bosch.com"
  },
  {
    id: "craftsman",
    name: "Craftsman",
    description: "Professional and DIY tools",
    logo: "🛠️",
    productCount: 29,
    category: "Hand Tools",
    established: "1927",
    country: "USA",
    website: "https://craftsman.com"
  },
  {
    id: "hilti",
    name: "Hilti",
    description: "Construction and building technology",
    logo: "🏗️",
    productCount: 33,
    category: "Construction",
    established: "1941",
    country: "Liechtenstein",
    website: "https://hilti.com"
  },
  {
    id: "festool",
    name: "Festool",
    description: "Precision power tools and systems",
    logo: "🎯",
    productCount: 24,
    category: "Precision Tools",
    established: "1925",
    country: "Germany",
    website: "https://festool.com"
  },
  {
    id: "ridgid",
    name: "Ridgid",
    description: "Professional plumbing and pipe tools",
    logo: "🔩",
    productCount: 19,
    category: "Plumbing",
    established: "1923",
    country: "USA",
    website: "https://ridgid.com"
  },
  {
    id: "knipex",
    name: "Knipex",
    description: "High-quality pliers and cutting tools",
    logo: "✂️",
    productCount: 31,
    category: "Hand Tools",
    established: "1882",
    country: "Germany",
    website: "https://knipex.com"
  },
  {
    id: "wera",
    name: "Wera",
    description: "Screwdrivers and hand tools",
    logo: "🔩",
    productCount: 26,
    category: "Hand Tools",
    established: "1936",
    country: "Germany",
    website: "https://wera.com"
  },
  {
    id: "fluke",
    name: "Fluke",
    description: "Electronic test and measurement tools",
    logo: "📊",
    productCount: 18,
    category: "Measurement",
    established: "1948",
    country: "USA",
    website: "https://fluke.com"
  }
]

export default function BrandsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Our Brand Partners</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We partner with the world's leading brands to provide you with quality tools and materials. 
            Each brand represents decades of innovation and craftsmanship.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">{brands.length}</div>
            <div className="text-sm text-muted-foreground">Trusted Brands</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {brands.reduce((sum, brand) => sum + brand.productCount, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Products Available</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">100+</div>
            <div className="text-sm text-muted-foreground">Years Combined Experience</div>
          </div>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <Card key={brand.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                {/* Brand Logo and Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{brand.logo}</div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                      {brand.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{brand.country}</span>
                      <span>•</span>
                      <span>Since {brand.established}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {brand.description}
                </p>

                {/* Category Badge */}
                <div className="mb-4">
                  <Badge variant="secondary" className="text-xs">
                    {brand.category}
                  </Badge>
                </div>

                {/* Product Count */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">
                    {brand.productCount} products
                  </span>
                  <Link 
                    href={`/search?brand=${brand.name.toLowerCase()}`}
                    className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                  >
                    View Products
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                {/* Website Link */}
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  Visit Website
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-muted-foreground mb-6">
            Browse our complete product catalog or contact us for custom solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}