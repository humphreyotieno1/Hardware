"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Search, 
  Filter, 
  SortAsc, 
  Eye,
  Share2,
  Download,
  ArrowLeft,
  Star,
  Package,
  Tag,
  Clock,
  AlertCircle
} from "lucide-react"
import { formatPrice } from "@/lib/api"
import { WishlistItem } from "./wishlist-item"
import { useWishlist } from "@/lib/hooks/use-wishlist"

// Mock wishlist data - replace with actual API calls
const mockWishlistItems = [
  {
    id: "1",
    product: {
      id: "prod-1",
      name: "Professional Drill Set",
      price: 8500,
      comparePrice: 12000,
      image: "/images/hero/tools.jpg",
      category: "Power Tools",
      brand: "Makita",
      rating: 4.8,
      reviewCount: 127,
      inStock: true,
      stockCount: 15
    },
    addedAt: "2024-01-15T10:30:00Z",
    notes: "Need for upcoming renovation project"
  },
  {
    id: "2",
    product: {
      id: "prod-2",
      name: "Premium Safety Helmet",
      price: 2500,
      comparePrice: 3500,
      image: "/images/hero/crown.jpg",
      category: "Safety Equipment",
      brand: "3M",
      rating: 4.9,
      reviewCount: 89,
      inStock: true,
      stockCount: 8
    },
    addedAt: "2024-01-10T14:20:00Z",
    notes: "For construction site safety"
  },
  {
    id: "3",
    product: {
      id: "prod-3",
      name: "Heavy Duty Hammer",
      price: 1800,
      comparePrice: 2200,
      image: "/images/hero/tools.jpg",
      category: "Hand Tools",
      brand: "Stanley",
      rating: 4.7,
      reviewCount: 203,
      inStock: false,
      stockCount: 0
    },
    addedAt: "2024-01-08T09:15:00Z",
    notes: "Professional grade for daily use"
  },
  {
    id: "4",
    product: {
      id: "prod-4",
      name: "LED Work Light",
      price: 3200,
      comparePrice: 4500,
      image: "/images/hero/crown.jpg",
      category: "Electrical",
      brand: "Bosch",
      rating: 4.6,
      reviewCount: 156,
      inStock: true,
      stockCount: 12
    },
    addedAt: "2024-01-05T16:45:00Z",
    notes: "Perfect for night work"
  },
  {
    id: "5",
    product: {
      id: "prod-5",
      name: "Professional Paint Brush Set",
      price: 1200,
      comparePrice: 1800,
      image: "/images/hero/tools.jpg",
      category: "Paint & Finishes",
      brand: "Purdy",
      rating: 4.8,
      reviewCount: 94,
      inStock: true,
      stockCount: 25
    },
    addedAt: "2024-01-03T11:30:00Z",
    notes: "High quality for smooth finish"
  },
  {
    id: "6",
    product: {
      id: "prod-6",
      name: "Concrete Mix (25kg)",
      price: 800,
      comparePrice: 1000,
      image: "/images/hero/crown.jpg",
      category: "Building Materials",
      brand: "Bamburi",
      rating: 4.5,
      reviewCount: 312,
      inStock: true,
      stockCount: 50
    },
    addedAt: "2024-01-01T08:00:00Z",
    notes: "For foundation work"
  }
]

export function WishlistPage() {
  const { 
    wishlistItems, 
    loading, 
    removeWishlistItem, 
    moveToCart, 
    removeMultipleItems, 
    moveMultipleToCart 
  } = useWishlist()
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("addedAt")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Filter and sort wishlist items
  const filteredItems = wishlistItems
    .filter(item => {
      const matchesSearch = item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.notes.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === "all" || item.product.category === categoryFilter
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.product.name.localeCompare(b.product.name)
        case "price":
          return a.product.price - b.product.price
        case "rating":
          return b.product.rating - a.product.rating
        case "addedAt":
        default:
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      }
    })

  // Handle item selection
  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map(item => item.id))
    }
  }

  // Handle bulk actions
  const removeSelectedItems = () => {
    removeMultipleItems(selectedItems)
    setSelectedItems([])
  }

  const handleMoveToCart = (itemId: string) => {
    moveToCart(itemId)
  }

  const moveSelectedToCart = () => {
    moveMultipleToCart(selectedItems)
    setSelectedItems([])
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  // Calculate total value
  const totalValue = filteredItems.reduce((sum, item) => sum + item.product.price, 0)
  const totalSavings = filteredItems.reduce((sum, item) => sum + (item.product.comparePrice - item.product.price), 0)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-48 bg-muted rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Your Wishlist is Empty</h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            Start building your wishlist by saving products you love. You'll be notified about price drops and stock updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/search">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Start Shopping
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/categories">
                Browse Categories
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">
            {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"} • 
            Total Value: <span className="font-semibold text-foreground">{formatPrice(totalValue)}</span>
            {totalSavings > 0 && (
              <span className="text-green-600 ml-2">
                Save {formatPrice(totalSavings)}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/search">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your wishlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Power Tools">Power Tools</SelectItem>
                <SelectItem value="Hand Tools">Hand Tools</SelectItem>
                <SelectItem value="Safety Equipment">Safety Equipment</SelectItem>
                <SelectItem value="Electrical">Electrical</SelectItem>
                <SelectItem value="Paint & Finishes">Paint & Finishes</SelectItem>
                <SelectItem value="Building Materials">Building Materials</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="addedAt">Recently Added</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price">Price Low to High</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Package className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedItems.length === filteredItems.length}
                  onCheckedChange={toggleSelectAll}
                />
                <span className="text-sm font-medium">
                  {selectedItems.length} {selectedItems.length === 1 ? "item" : "items"} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={moveSelectedToCart}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Move to Cart
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={removeSelectedItems}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wishlist Items */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {filteredItems.map((item) => (
          <WishlistItem
            key={item.id}
            item={item}
            isSelected={selectedItems.includes(item.id)}
            onSelectionChange={toggleItemSelection}
            onRemove={removeWishlistItem}
            onMoveToCart={handleMoveToCart}
            viewMode={viewMode}
          />
        ))}
      </div>

      {/* Empty State for Filtered Results */}
      {filteredItems.length === 0 && wishlistItems.length > 0 && (
        <div className="text-center py-16">
          <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No items found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <Button variant="outline" onClick={() => {
            setSearchQuery("")
            setCategoryFilter("all")
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
