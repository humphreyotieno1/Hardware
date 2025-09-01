"use client"

import Link from "next/link"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/hooks/use-cart"
import { useAuth } from "@/lib/hooks/use-auth"
import { formatPrice } from "@/lib/api"
import { CheckoutSteps } from "@/components/checkout/checkout-steps"
import { AddressForm } from "@/components/checkout/address-form"
import { PaymentForm } from "@/components/checkout/payment-form"
import { ServiceOptions } from "@/components/checkout/service-options"
import { OrderReview } from "@/components/checkout/order-review"
import type { Address, ServiceRequest } from "@/lib/api/types"
import { ShoppingBag, Lock } from "lucide-react"

export function CheckoutPage() {
  const { cart, total, itemCount, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState(1)
  const [address, setAddress] = useState<Address | null>(null)
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground text-lg mb-8">You need items in your cart to proceed with checkout.</p>
          <Button asChild size="lg">
            <Link href="/search">Start Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  const subtotal = total
  const shipping = subtotal >= 5000 ? 0 : 500
  const serviceCharge = serviceRequest ? 1000 : 0 // Base service charge
  const tax = (subtotal + serviceCharge) * 0.16
  const finalTotal = subtotal + shipping + serviceCharge + tax

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handlePlaceOrder = async () => {
    if (!address || !paymentMethod) return

    setIsProcessing(true)
    try {
      // Place order logic here
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call
      await clearCart()
      router.push("/checkout/success")
    } catch (error) {
      console.error("Failed to place order:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Secure Checkout</h1>
        <div className="flex items-center justify-center space-x-2 text-muted-foreground">
          <Lock className="h-4 w-4" />
          <span>SSL Encrypted & Secure</span>
        </div>
      </div>

      {/* Progress Steps */}
      <CheckoutSteps currentStep={currentStep} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {currentStep === 1 && <AddressForm address={address} onAddressChange={setAddress} onNext={handleNext} />}
              {currentStep === 2 && (
                <ServiceOptions
                  serviceRequest={serviceRequest}
                  onServiceChange={setServiceRequest}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              {currentStep === 3 && (
                <PaymentForm
                  paymentMethod={paymentMethod}
                  onPaymentMethodChange={setPaymentMethod}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              {currentStep === 4 && (
                <OrderReview
                  cart={cart}
                  address={address}
                  serviceRequest={serviceRequest}
                  paymentMethod={paymentMethod}
                  onBack={handleBack}
                  onPlaceOrder={handlePlaceOrder}
                  isProcessing={isProcessing}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Order Summary
                <Badge variant="secondary">{itemCount} items</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items Preview */}
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      {item.product?.images_json && item.product.images_json.length > 0 ? (
                        <img
                          src={item.product.images_json[0] || "/placeholder.svg"}
                          alt={item.product?.name || "Product"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-1">
                        {item.product?.name || "Unknown Product"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(item.unit_price)} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium">{formatPrice(item.quantity * item.unit_price)}</p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? <span className="text-primary">Free</span> : formatPrice(shipping)}</span>
                </div>
                {serviceRequest && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service Charge</span>
                    <span>{formatPrice(serviceCharge)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">VAT (16%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 space-y-2">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3 text-primary" />
                  <span>Secure SSL encryption</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <ShoppingBag className="h-3 w-3 text-primary" />
                  <span>30-day return policy</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
