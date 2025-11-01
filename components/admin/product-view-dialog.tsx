"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { adminApi, AdminProduct, Category } from "@/lib/api/admin"
import { formatPrice } from "@/lib/api"
import { Eye, Package, Calendar, DollarSign, Hash, Tag, CheckCircle, XCircle, Star } from "lucide-react"
import { useState, useEffect } from "react"

interface ProductViewDialogProps {
  product: AdminProduct
  trigger?: React.ReactNode
}

export function ProductViewDialog({ product, trigger }: ProductViewDialogProps) {
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && product.category_id) {
      loadCategory()
    }
  }, [open, product.category_id])

  const loadCategory = async () => {
    try {
      setLoading(true)
      const categories = await adminApi.getCategories()
      const foundCategory = categories.find(cat => cat.ID === product.category_id)
      setCategory(foundCategory || null)
    } catch (error) {
      console.error("Error loading category:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
        <XCircle className="h-3 w-3 mr-1" />
        Inactive
      </Badge>
    )
  }

  const getFeaturedBadge = (isFeatured: boolean) => {
    return isFeatured ? (
      <Badge variant="default" className="bg-yellow-100 text-yellow-800">
        <Star className="h-3 w-3 mr-1" />
        Featured
      </Badge>
    ) : null
  }

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    } else if (stock < 10) {
      return <Badge variant="destructive" className="bg-orange-100 text-orange-800">
        Low Stock
      </Badge>
    } else {
      return <Badge variant="default" className="bg-green-100 text-green-800">
        In Stock
      </Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Product Details</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Product Header */}
          <div className="flex items-start space-x-4">
            {product.images_json && product.images_json.length > 0 ? (
              <img
                src={product.images_json[0]}
                alt={product.name}
                className="h-24 w-24 rounded-lg object-cover"
              />
            ) : (
              <div className="h-24 w-24 rounded-lg bg-muted flex items-center justify-center">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">{product.name}</h2>
              <div className="flex items-center space-x-4 mb-2">
                {getStatusBadge(product.is_active)}
                {getStockBadge(product.stock_quantity)}
                {getFeaturedBadge(product.is_featured)}
              </div>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          </div>

          {/* Product Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 flex items-center space-x-2">
                  <Hash className="h-4 w-4" />
                  <span>Basic Information</span>
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">SKU</label>
                    <p className="text-sm font-mono bg-muted px-2 py-1 rounded">{product.sku}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Slug</label>
                    <p className="text-sm">{product.slug}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Category</label>
                    <p className="text-sm">
                      {loading ? "Loading..." : category ? category.name : "Unknown"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Stock */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Pricing & Stock</span>
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Price</label>
                    <p className="text-lg font-bold text-foreground">{formatPrice(product.price)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Stock Quantity</label>
                    <p className="text-lg font-semibold text-foreground">{product.stock_quantity} units</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Images */}
          {product.images_json && product.images_json.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 flex items-center space-x-2">
                  <Package className="h-4 w-4" />
                  <span>Product Images</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {product.images_json.map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Timestamps</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created At</label>
                  <p className="text-sm">{new Date(product.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Updated At</label>
                  <p className="text-sm">{new Date(product.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
