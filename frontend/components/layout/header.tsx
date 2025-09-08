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
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileFlyoutOpen, setIsMobileFlyoutOpen] = useState(false)
  const [selectedMobileCategory, setSelectedMobileCategory] = useState<string | null>(null)
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
        for (const cat of cats) { // Fetch products for all categories
          try {
            const response = await productsApi.getProductsByCategory(cat.slug, { limit: 4 })
            productsMap[cat.slug] = response.products
            // console.log(`Loaded ${response.products.length} products for category: ${cat.slug}`)
          } catch (error) {
            console.error(`Failed to fetch products for category ${cat.slug}:`, error)
            // Add empty array so flyout still shows
            productsMap[cat.slug] = []
          }
        }
        setCategoryProducts(productsMap)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }

    fetchCategories()
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
    }
  }, [hoverTimeout])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleCategoryHover = (categorySlug: string) => {
    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    console.log('Hovering over category:', categorySlug)
    setHoveredCategory(categorySlug)
  }

  const handleCategoryLeave = () => {
    // Set a timeout to close the flyout after a delay
    const timeout = setTimeout(() => {
      console.log('Leaving category after delay')
      setHoveredCategory(null)
    }, 150) // 150ms delay
    setHoverTimeout(timeout)
  }

  const handleFlyoutEnter = () => {
    // Clear the timeout when entering the flyout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
  }

  const handleFlyoutLeave = () => {
    // Close the flyout immediately when leaving it
    console.log('Leaving flyout')
    setHoveredCategory(null)
  }

  // Mobile-specific handlers
  const handleMobileCategoryClick = (categorySlug: string) => {
    setSelectedMobileCategory(categorySlug)
    setIsMobileFlyoutOpen(true)
  }

  const handleMobileFlyoutClose = () => {
    setIsMobileFlyoutOpen(false)
    setSelectedMobileCategory(null)
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(price)
  }

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      {/* Top Tier - Contact Info */}
      <div className="bg-primary text-primary-foreground py-1 sm:py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
              <div className="flex items-center space-x-1">
                <Phone className="h-3 w-3" />
                <span className="hidden sm:inline">+254 700 000 000</span>
                <span className="sm:hidden">+254 700 000 000</span>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <Mail className="h-3 w-3" />
                <span>geocelenterprises20@gmail.com</span>
              </div>
              <div className="hidden lg:flex items-center space-x-2">
                <MapPin className="h-3 w-3" />
                <span>Siaya, Kenya</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="hidden sm:inline text-primary-foreground/80">Shop with us today</span>
              <span className="sm:hidden text-primary-foreground/80 text-xs">Shop with us today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Tier - Logo, Search, Cart */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Company Info */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm sm:text-base lg:text-lg">GV</span>
                </div>
              </Link>
              <div className="hidden sm:block">
                <span className="font-bold text-base sm:text-lg lg:text-2xl text-foreground">Grahad Ventures Limited</span>
                <p className="text-xs sm:text-sm text-muted-foreground">Your partner for quality construction and hardware supplies</p>
              </div>
            </div>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-2xl mx-4 lg:mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search products, brands, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-2 sm:py-3 bg-muted/50 border-muted focus:bg-background"
                />
              </div>
            </form>

            {/* Right side actions */}
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
              {/* Wishlist */}
              <Button variant="ghost" size="sm" asChild className="hidden md:flex relative">
                <Link href="/wishlist">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="ml-1 sm:ml-2 hidden lg:inline text-xs sm:text-sm">Wishlist</span>
                  {wishlistItemCount > 0 && (
                    <Badge className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 flex items-center justify-center p-0 text-xs bg-primary">
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
                        <span className="ml-1 sm:ml-2 hidden lg:inline text-xs sm:text-sm">{user.full_name}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
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
                          <DropdownMenuSeparator key="admin-separator" />
                          <DropdownMenuItem key="admin-panel" asChild>
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
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/auth/login">
                        <User className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="ml-1 sm:ml-2 hidden lg:inline text-xs sm:text-sm">Sign In</span>
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="/auth/register">
                        <UserPlus className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="ml-1 sm:ml-2 hidden lg:inline text-xs sm:text-sm">Sign Up</span>
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
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
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-2 sm:py-3 bg-muted/50 border-muted focus:bg-background"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Tier - Category Navigation with Fly-out */}
      <div className="bg-card border-b shadow-sm relative">
        <div className="container mx-auto px-4 relative">
          <nav className="relative">
            <ul className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6 xl:space-x-8 overflow-x-auto scrollbar-hide py-2 sm:py-3 lg:py-4">
              {categories.map((category) => (
                <li
                  key={category.slug}
                  className="relative group"
                  onMouseEnter={() => handleCategoryHover(category.slug)}
                  onMouseLeave={handleCategoryLeave}
                  onTouchStart={() => handleCategoryHover(category.slug)}
                >
                  <Link
                    href={`/categories/${category.slug}`}
                    className="flex items-center space-x-1 py-2 sm:py-3 lg:py-4 px-2 text-xs sm:text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap"
                  >
                    <span>{category.name}</span>
                    <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:rotate-180" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        {/* Fly-out Menu - Positioned outside the scrollable container */}
        {hoveredCategory && (
          <div
            className="absolute top-full left-0 w-full bg-white border shadow-lg rounded-lg p-4 sm:p-6 z-[9999]"
            style={{ 
              position: 'absolute',
              top: '100%',
              left: '0',
              right: '0',
              zIndex: 9999,
              opacity: 1,
              visibility: 'visible'
            }}
            onMouseEnter={handleFlyoutEnter}
            onMouseLeave={handleFlyoutLeave}
            onTouchStart={handleFlyoutEnter}
            onTouchEnd={handleFlyoutLeave}
          >
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-base sm:text-lg text-foreground border-b pb-2">
                    {categories.find(cat => cat.slug === hoveredCategory)?.name || 'Category'}
                  </h3>
                  <p className="text-sm text-muted-foreground">Loading products...</p>
                  {categoryProducts[hoveredCategory]?.slice(0, 4).map((product: Product) => (
                    <div
                      key={product.id}
                      className="hover:translate-x-1 transition-transform duration-200"
                    >
                      <Link
                        href={`/products/${product.slug}`}
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
                            {formatPrice(product.price)}
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
                      href={`/categories/${hoveredCategory}`}
                      className="block text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      View All {categories.find(cat => cat.slug === hoveredCategory)?.name || 'Category'}
                    </Link>
                    <Link
                      href={`/categories/${hoveredCategory}?sort=price_asc`}
                      className="block text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Price: Low to High
                    </Link>
                    <Link
                      href={`/categories/${hoveredCategory}?sort=price_desc`}
                      className="block text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Price: High to Low
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div
            key="mobile-overlay"
            className="fixed inset-0 mobile-menu-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            key="mobile-menu"
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
                  <Menu className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2 text-sm sm:text-base">Categories</h3>
                  <div className="space-y-1 sm:space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category.slug}
                        className="hover:translate-x-1 transition-transform duration-200"
                      >
                        <button
                          className="w-full flex items-center justify-between py-2 px-3 rounded hover:bg-muted/50 transition-colors text-sm sm:text-base text-left"
                          onClick={() => handleMobileCategoryClick(category.slug)}
                        >
                          <span>{category.name}</span>
                          <span className="text-muted-foreground">→</span>
                        </button>
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
                          key="account-settings"
                          href="/account"
                          className="flex items-center py-2 px-3 rounded hover:bg-muted/50 transition-colors text-sm sm:text-base"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Settings className="mr-3 h-4 w-4" />
                          Account Settings
                        </Link>
                        <Link
                          key="order-history"
                          href="/account/orders"
                          className="flex items-center py-2 px-3 rounded hover:bg-muted/50 transition-colors text-sm sm:text-base"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <ShoppingCart className="mr-3 h-4 w-4" />
                          Order History
                        </Link>
                        <Link
                          key="wishlist"
                          href="/wishlist"
                          className="flex items-center py-2 px-3 rounded hover:bg-muted/50 transition-colors text-sm sm:text-base"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Heart className="mr-3 h-4 w-4" />
                          Wishlist
                        </Link>
                        <button
                          key="logout"
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
                          key="login"
                          href="/auth/login"
                          className="flex items-center py-2 px-3 rounded hover:bg-muted/50 transition-colors text-sm sm:text-base"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User className="mr-3 h-4 w-4" />
                          Sign In
                        </Link>
                        <Link
                          key="register"
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

      {/* Mobile Flyout Overlay */}
      {isMobileFlyoutOpen && selectedMobileCategory && (
        <>
          <div
            key="mobile-flyout-overlay"
            className="fixed inset-0 bg-black/50 z-[9998]"
            onClick={handleMobileFlyoutClose}
          />
          <div key="mobile-flyout-content" className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">
                    {categories.find(cat => cat.slug === selectedMobileCategory)?.name || 'Category'}
                  </h3>
                  <button
                    onClick={handleMobileFlyoutClose}
                    className="p-2 hover:bg-muted/50 rounded-full transition-colors"
                  >
                    <span className="text-xl">×</span>
                  </button>
                </div>
              </div>
              
              <div className="p-4 overflow-y-auto max-h-[60vh]">
                <div className="space-y-4">
                  {/* Featured Products */}
                  <div>
                    <h4 className="font-medium mb-3 text-sm">Featured Products</h4>
                    <div className="space-y-2">
                      {categoryProducts[selectedMobileCategory]?.slice(0, 3).map((product: Product) => (
                        <div
                          key={product.id}
                          className="flex items-center space-x-3 p-2 rounded hover:bg-muted/50 transition-colors"
                        >
                          <div className="w-12 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                            {product.images_json && product.images_json.length > 0 ? (
                              <img
                                src={product.images_json[0]}
                                alt={product.name}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <span className="text-xs text-muted-foreground">No Image</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{formatPrice(product.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div>
                    <h4 className="font-medium mb-3 text-sm">Quick Links</h4>
                    <div className="space-y-2">
                      <Link
                        href={`/categories/${selectedMobileCategory}`}
                        className="block py-2 px-3 rounded hover:bg-muted/50 transition-colors text-sm"
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          handleMobileFlyoutClose()
                        }}
                      >
                        View All Products
                      </Link>
                      <Link
                        href={`/categories/${selectedMobileCategory}?sort=price_asc`}
                        className="block py-2 px-3 rounded hover:bg-muted/50 transition-colors text-sm"
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          handleMobileFlyoutClose()
                        }}
                      >
                        Price: Low to High
                      </Link>
                      <Link
                        href={`/categories/${selectedMobileCategory}?sort=price_desc`}
                        className="block py-2 px-3 rounded hover:bg-muted/50 transition-colors text-sm"
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          handleMobileFlyoutClose()
                        }}
                      >
                        Price: High to Low
                      </Link>
                    </div>
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