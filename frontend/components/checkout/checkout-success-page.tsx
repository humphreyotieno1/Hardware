"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/api"
import { CheckCircle, Package, Truck, Mail, ArrowLeft, Download, Share2 } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"

interface OrderDetails {
  orderId: string
  orderNumber: string
  total: number
  status: string
  estimatedDelivery: string
  items: Array<{
    name: string
    quantity: number
    price: number
    image?: string
  }>
  address: {
    label: string
    line: string
    city: string
    country: string
  }
  paymentMethod: string
}

export function CheckoutSuccessPage() {
  const { user } = useAuth()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch order details from the URL params or API
    // For now, we'll simulate the order data
    const simulateOrderData = () => {
      setTimeout(() => {
        setOrderDetails({
          orderId: "ORD-2024-001234",
          orderNumber: "001234",
          total: 15750,
          status: "confirmed",
          estimatedDelivery: "3-5 business days",
          items: [
            {
              name: "Cordless Drill",
              quantity: 2,
              price: 8999,
              image: "/placeholder.svg"
            },
            {
              name: "Hammer Set",
              quantity: 1,
              price: 3751,
              image: "/placeholder.svg"
            }
          ],
          address: {
            label: "Home",
            line: "123 Main Street",
            city: "Nairobi",
            country: "Kenya"
          },
          paymentMethod: "M-Pesa"
        })
        setLoading(false)
      }, 1000)
    }

    simulateOrderData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="text-center mb-8">
            <div className="h-12 bg-muted rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-6 bg-muted rounded w-1/4 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-64 bg-muted rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold text-foreground mb-4">Order Not Found</h1>
          <p className="text-muted-foreground text-lg mb-8">We couldn't find your order details.</p>
          <Button asChild size="lg">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground text-lg">
          Thank you for your purchase, {user?.full_name || "Customer"}!
        </p>
        <p className="text-muted-foreground">
          Your order #{orderDetails.orderNumber} has been successfully placed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Order Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Order Number</span>
              <span className="font-mono text-sm">{orderDetails.orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                {orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Amount</span>
              <span className="font-bold text-lg">{formatPrice(orderDetails.total)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Payment Method</span>
              <span className="font-medium">{orderDetails.paymentMethod}</span>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h4 className="font-medium">Items Ordered</h4>
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{formatPrice(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Delivery Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5" />
              <span>Delivery Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Delivery Address</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{orderDetails.address.label}</p>
                <p>{orderDetails.address.line}</p>
                <p>{orderDetails.address.city}, {orderDetails.address.country}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2">Estimated Delivery</h4>
              <p className="text-sm text-muted-foreground">{orderDetails.estimatedDelivery}</p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2">What's Next?</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• You'll receive an email confirmation shortly</p>
                <p>• We'll send you tracking information once your order ships</p>
                <p>• Our team will contact you if we need any additional information</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild variant="outline">
          <Link href="/orders">
            <Package className="mr-2 h-4 w-4" />
            View All Orders
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/search">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download Receipt
        </Button>
        <Button variant="outline">
          <Share2 className="mr-2 h-4 w-4" />
          Share Order
        </Button>
      </div>

      {/* Support Information */}
      <Card className="mt-8">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
            <p className="text-muted-foreground mb-4">
              If you have any questions about your order, our customer support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link href="/contact">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Support
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/help">
                  View Help Center
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
