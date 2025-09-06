"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { productsApi, formatPrice } from "@/lib/api"
import type { Product } from "@/lib/api/types"
import { ProductCard } from "@/components/ui/product-card"
import { ShoppingCart, Heart, Star, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react"

interface ProductDetailProps {
  productSlug: string
}

export function ProductDetail({ productSlug }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await productsApi.getProduct(productSlug)
        setProduct(productData)
        
        // Fetch related products from the same category
        if (productData.category) {
          try {
            const relatedData = await productsApi.getProductsByCategory(productData.category.slug, { limit: 4 })
            // Filter out the current product from related products
            const filteredRelated = relatedData.products.filter(p => p.id !== productData.id)
            setRelatedProducts(filteredRelated.slice(0, 3)) // Show max 3 related products
          } catch (error) {
            console.error("Failed to fetch related products:", error)
            setRelatedProducts([])
          }
        }
      } catch (error) {
        console.error("Failed to fetch product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productSlug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-6 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/search">Browse All Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  const images = product.images_json && product.images_json.length > 0 ? product.images_json : ["/placeholder.svg"]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        {product.category && (
          <>
            <Link href={`/categories/${product.category.slug}`} className="hover:text-foreground">
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-foreground font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img
              src={images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-accent" : "border-transparent"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 text-balance">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-muted-foreground ml-2">(4.5) • 127 reviews</span>
              </div>
            </div>
            <p className="text-muted-foreground text-pretty leading-relaxed">{product.description}</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-foreground">{formatPrice(product.price)}</span>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                <p className="text-sm text-muted-foreground">
                  Stock: {product.stock_quantity > 0 ? `${product.stock_quantity} available` : "Out of stock"}
                </p>
              </div>
            </div>

            {product.stock_quantity < 10 && product.stock_quantity > 0 && (
              <Badge variant="destructive">Only {product.stock_quantity} left in stock!</Badge>
            )}
          </div>

          <Separator />

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium">Quantity:</label>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 text-center min-w-[3rem]">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  disabled={quantity >= product.stock_quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1" size="lg" disabled={product.stock_quantity === 0}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="mr-2 h-5 w-5" />
                Add to Wishlist
              </Button>
            </div>
          </div>

          <Separator />

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-medium">Free Delivery</p>
                <p className="text-xs text-muted-foreground">Orders over KES 5,000</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-medium">Warranty</p>
                <p className="text-xs text-muted-foreground">1 year manufacturer</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <RotateCcw className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-muted-foreground">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                <h4 className="text-md font-semibold mt-6 mb-3">Key Features</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>High-quality construction for professional use</li>
                  <li>Durable materials built to last</li>
                  <li>Ergonomic design for comfortable handling</li>
                  <li>Compatible with standard accessories</li>
                  <li>Backed by manufacturer warranty</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">SKU</span>
                      <span className="text-muted-foreground">{product.sku}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Category</span>
                      <span className="text-muted-foreground">{product.category?.name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Weight</span>
                      <span className="text-muted-foreground">2.5 kg</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Dimensions</span>
                      <span className="text-muted-foreground">25 x 15 x 10 cm</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Material</span>
                      <span className="text-muted-foreground">Steel/Aluminum</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Color</span>
                      <span className="text-muted-foreground">Black/Silver</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Warranty</span>
                      <span className="text-muted-foreground">1 Year</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Origin</span>
                      <span className="text-muted-foreground">Germany</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Customer Reviews</h3>
                  <Button variant="outline">Write a Review</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-foreground mb-2">4.5</div>
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">Based on 127 reviews</p>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center space-x-2">
                        <span className="text-sm w-8">{stars}</span>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{
                              width: `${stars === 5 ? "60%" : stars === 4 ? "25%" : stars === 3 ? "10%" : stars === 2 ? "3%" : "2%"}`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground w-8">
                          {stars === 5 ? 76 : stars === 4 ? 32 : stars === 3 ? 13 : stars === 2 ? 4 : 2}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-6">
                  {[
                    {
                      name: "John M.",
                      rating: 5,
                      date: "2 weeks ago",
                      comment:
                        "Excellent quality tool. Very durable and works exactly as expected. Highly recommended for professional use.",
                    },
                    {
                      name: "Sarah K.",
                      rating: 4,
                      date: "1 month ago",
                      comment:
                        "Good product overall. The build quality is solid and it gets the job done. Only minor issue is the weight, but that's expected for this type of tool.",
                    },
                  ].map((review, index) => (
                    <div key={index} className="border-b pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{review.name}</span>
                          <div className="flex items-center space-x-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-muted-foreground text-pretty">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Related Products</h2>
            <p className="text-muted-foreground">You might also be interested in these products from the same category</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard 
                key={relatedProduct.id} 
                product={relatedProduct}
                showCategory={false}
                onAddToCart={(productId) => {
                  // Handle add to cart logic here
                  console.log('Add to cart:', productId)
                }}
                onAddToWishlist={(productId) => {
                  // Handle wishlist logic here
                  console.log('Add to wishlist:', productId)
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
