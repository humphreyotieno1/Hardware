"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/hooks/use-auth"
import { useCart } from "@/lib/hooks/use-cart"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { Search, ShoppingCart, User, Menu, Heart, LogOut, Settings, Phone, Mail, MapPin, ChevronDown, UserPlus } from "lucide-react"
import { productsApi } from "@/lib/api"
import type { Category, Product } from "@/lib/api/types"

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryProducts, setCategoryProducts] = useState<Record<string, Product[]>>({})
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { itemCount: cartItemCount } = useCart()
  const { itemCount: wishlistItemCount } = useWishlist()
  const router = useRouter()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await productsApi.getCategories()
        setCategories(cats)
        
        // Fetch sample products for each category for the fly-out menu
        const productsMap: Record<string, Product[]> = {}
        for (const cat of cats.slice(0, 6)) { // Limit to 6 categories for performance
          try {
            const response = await productsApi.getProductsByCategory(cat.slug, { limit: 4 })
            productsMap[cat.slug] = response.products
          } catch (error) {
            console.error(`Failed to fetch products for category ${cat.slug}:`, error)
          }
        }
        setCategoryProducts(productsMap)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }

    fetchCategories()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Tier - Contact Info & Social */}
      <div className="bg-primary text-primary-foreground py-1.5 sm:py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Phone className="h-3 w-3" />
                <span className="hidden sm:inline">+254 700 000 000</span>
                <span className="sm:hidden">+254 700 000 000</span>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <Mail className="h-3 w-3" />
                <span>info@hardwarestore.co.ke</span>
              </div>
              <div className="hidden lg:flex items-center space-x-2">
                <MapPin className="h-3 w-3" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="hidden sm:inline text-primary-foreground/80">Free delivery on orders over KES 5,000</span>
              <span className="sm:hidden text-primary-foreground/80 text-xs">Free delivery over KES 5,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tier - Logo, Search, User Actions */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4">
          <div className="flex h-14 sm:h-16 lg:h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs sm:text-sm lg:text-lg">HS</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-base sm:text-lg lg:text-2xl text-foreground">Hardware Store</span>
                <p className="text-xs sm:text-sm text-muted-foreground">Professional Tools & Supplies</p>
              </div>
            </Link>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-2xl mx-4 lg:mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="search"
                  placeholder="Search for tools, materials, and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-11 sm:h-12 text-base bg-input border-2 focus:border-primary"
                />
              </div>
            </form>

            {/* Right side actions */}
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
              {/* Wishlist */}
              <Button variant="ghost" size="sm" asChild className="hidden md:flex relative">
                <Link href="/wishlist">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="ml-1 sm:ml-2 text-xs sm:text-sm">Wishlist</span>
                  {wishlistItemCount > 0 && (
                    <Badge className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 flex items-center justify-center p-0 text-xs bg-red-500">
                      {wishlistItemCount}
                    </Badge>
                  )}
                </Link>
              </Button>

              {/* Cart */}
              <Button variant="ghost" size="sm" asChild className="relative">
                <Link href="/cart">
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="ml-1 sm:ml-2 hidden md:inline text-xs sm:text-sm">Cart</span>
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 flex items-center justify-center p-0 text-xs bg-primary">
                      {cartItemCount}
                    </Badge>
                  )}
                </Link>
              </Button>

              {/* User menu - Only show on medium+ screens */}
              <div className="hidden md:block">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <User className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="ml-1 sm:ml-2 text-xs sm:text-sm">{user.full_name}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem asChild>
                        <Link href="/account">
                          <Settings className="mr-2 h-4 w-4" />
                          Account Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/account/orders">
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Order History
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/wishlist">
                          <Heart className="mr-2 h-4 w-4" />
                          Wishlist
                        </Link>
                      </DropdownMenuItem>
                      {user.role === "admin" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href="/admin">
                              <Settings className="mr-2 h-4 w-4" />
                              Admin Panel
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Button variant="ghost" size="sm" asChild className="text-xs sm:text-sm px-2 sm:px-3">
                      <Link href="/auth/login">
                        <User className="mr-1 sm:mr-2 h-4 w-4" />
                        Sign In
                      </Link>
                    </Button>
                    <Button size="sm" asChild className="text-xs sm:text-sm px-2 sm:px-3">
                      <Link href="/auth/register">
                        <UserPlus className="mr-1 sm:mr-2 h-4 w-4" />
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              {/* Mobile menu */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile search */}
          <div className="lg:hidden pb-3 sm:pb-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-input h-9 sm:h-10 lg:h-11 text-sm"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Tier - Category Navigation with Fly-out */}
      <div className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-4">
          <nav className="relative">
            <ul className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6 xl:space-x-8 overflow-x-auto scrollbar-hide py-2 sm:py-3 lg:py-4">
              {categories.map((category) => (
                <li
                  key={category.slug}
                  className="relative group"
                  onMouseEnter={() => setHoveredCategory(category.slug)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <Link
                    href={`/c/${category.slug}`}
                    className="flex items-center space-x-1 py-2 sm:py-3 lg:py-4 px-2 text-xs sm:text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap"
                  >
                    <span>{category.name}</span>
                    <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:rotate-180" />
                  </Link>

                  {/* Fly-out Menu */}
                  {hoveredCategory === category.slug && categoryProducts[category.slug] && (
                    <div
                      className="absolute top-full left-0 w-72 sm:w-80 lg:w-96 bg-background border shadow-lg rounded-lg p-4 sm:p-6 z-50"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-3">
                          <h3 className="font-semibold text-base sm:text-lg text-foreground border-b pb-2">
                            {category.name}
                          </h3>
                          {categoryProducts[category.slug]?.slice(0, 4).map((product) => (
                            <div
                              key={product.id}
                              className="hover:translate-x-1 transition-transform duration-200"
                            >
                              <Link
                                href={`/p/${product.slug}`}
                                className="flex items-center space-x-3 p-2 rounded hover:bg-muted transition-colors"
                              >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                                  {product.images_json?.[0] ? (
                                    <img
                                      src={product.images_json[0]}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-muted-foreground/20 flex items-center justify-center">
                                      <span className="text-xs text-muted-foreground">No Image</span>
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                                    {product.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    KES {product.price.toLocaleString()}
                                  </p>
                                </div>
                              </Link>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-medium text-xs sm:text-sm text-muted-foreground border-b pb-2">
                            Quick Links
                          </h4>
                          <div className="space-y-2">
                            <Link
                              href={`/c/${category.slug}`}
                              className="block text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors"
                            >
                              View All {category.name}
                            </Link>
                            <Link
                              href={`/c/${category.slug}?sort=price_asc`}
                              className="block text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                              Price: Low to High
                            </Link>
                            <Link
                              href={`/c/${category.slug}?sort=price_desc`}
                              className="block text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                              Price: High to Low
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 mobile-menu-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            className="fixed right-0 top-0 h-full w-72 sm:w-80 mobile-menu-bg shadow-xl border-l border-border/50 animate-slide-in-right"
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-semibold">Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h3 className="font-medium mb-2 text-sm sm:text-base">Categories</h3>
                  <div className="space-y-1 sm:space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category.slug}
                        className="hover:translate-x-1 transition-transform duration-200"
                      >
                        <Link
                          href={`/c/${category.slug}`}
                          className="block py-2 px-3 rounded hover:bg-muted/50 transition-colors text-sm sm:text-base"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {category.name}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2 text-sm sm:text-base">Account</h3>
                  <div className="space-y-1 sm:space-y-2">
                    {user ? (
                      <>
                        <Link
                          href="/account"
                          className="flex items-center py-2 px-3 rounded hover:bg-muted/50 transition-colors text-sm sm:text-base"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Settings className="mr-3 h-4 w-4" />
                          Account Settings
                        </Link>
                        <Link
                          href="/account/orders"
                          className="flex items-center py-2 px-3 rounded hover:bg-muted/50 transition-colors text-sm sm:text-base"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <ShoppingCart className="mr-3 h-4 w-4" />
                          Order History
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout()
                            setIsMobileMenuOpen(false)
                          }}
                          className="flex items-center w-full text-left py-2 px-3 rounded hover:bg-muted/50 transition-colors text-sm sm:text-base"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/auth/login"
                          className="flex items-center py-2 px-3 rounded hover:bg-muted/50 transition-colors text-sm sm:text-base"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User className="mr-3 h-4 w-4" />
                          Sign In
                        </Link>
                        <Link
                          href="/auth/register"
                          className="flex items-center py-2 px-3 rounded hover:bg-muted/50 transition-colors text-sm sm:text-base"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <UserPlus className="mr-3 h-4 w-4" />
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
