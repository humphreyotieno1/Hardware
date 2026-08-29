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
  const [paymentMethod, setPaymentMethod] = useState<string>("whatsapp")
  const [isProcessing, setIsProcessing] = useState(false)

  if (!cart || !cart.cart_items || cart.cart_items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground text-lg mb-8">You need items in your cart to proceed with checkout.</p>
          <Button asChild size="lg">
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  const subtotal = total
  const serviceCharge = serviceRequest ? 3 : 0
  const finalTotal = subtotal + serviceCharge

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
    if (!address || !paymentMethod || !cart?.cart_items?.length) return
    if (!address.name?.trim() || !address.phone?.trim()) {
      alert("Please add your name and phone number.")
      setCurrentStep(1)
      return
    }

    setIsProcessing(true)
    try {
      const { checkoutApi } = await import("@/lib/api/checkout")
      const { paymentsApi } = await import("@/lib/api/payments")
      const { openWhatsAppOrder } = await import("@/lib/cart/whatsapp-order")

      const apiAddress = {
        label: address.name || "Delivery Address",
        line: address.street || address.line || "",
        city: address.city,
        country: address.country || "Kenya",
        name: address.name,
        phone: address.phone,
      }

      const service = serviceRequest
        ? {
            type: (serviceRequest as any).type || "installation",
            details: (serviceRequest as any).details || {
              services: (serviceRequest as any).services || [],
              description: (serviceRequest as any).description || "",
            },
          }
        : undefined

      const orderResponse = user
        ? await checkoutApi.placeOrder({
            address: apiAddress,
            service_request: service,
            payment_method: paymentMethod,
          })
        : await checkoutApi.placeGuestOrder({
            name: address.name,
            phone: address.phone,
            address: {
              line: apiAddress.line,
              city: apiAddress.city,
              country: apiAddress.country,
            },
            items: cart.cart_items.map((item) => ({
              product_id: item.product_id,
              quantity: item.quantity,
            })),
            payment_method: paymentMethod,
          })

      sessionStorage.setItem(
        "last_order",
        JSON.stringify({
          order_id: orderResponse.order_id,
          total: orderResponse.total,
          payment_method: paymentMethod,
          address,
          items: cart.cart_items.map((item) => ({
            name: item.product?.name || "Product",
            quantity: item.quantity,
            price: item.unit_price,
            image: item.product?.images_json?.[0],
          })),
        })
      )

      if (paymentMethod === "whatsapp") {
        openWhatsAppOrder(cart.cart_items, total, {
          name: address.name,
          phone: address.phone,
          location: [apiAddress.line, apiAddress.city].filter(Boolean).join(", "),
        })
        await clearCart()
        router.push(`/checkout/success?order_id=${orderResponse.order_id}`)
        return
      }

      if (user && (paymentMethod === "paystack" || paymentMethod === "mpesa")) {
        const paymentResponse = await paymentsApi.initiatePayment({
          order_id: orderResponse.order_id,
          payment_method: paymentMethod,
          amount: orderResponse.total,
        })

        if (paymentResponse.paystack?.authorization_url) {
          sessionStorage.setItem("pending_order_id", orderResponse.order_id)
          window.location.href = paymentResponse.paystack.authorization_url
          return
        }
      }

      await clearCart()
      router.push(`/checkout/success?order_id=${orderResponse.order_id}`)
    } catch (error: any) {
      console.error("Failed to place order:", error)
      alert(error?.message || "Failed to place order. Please try again.")
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Checkout</h1>
        <div className="flex items-center justify-center space-x-2 text-muted-foreground">
          <Lock className="h-4 w-4" />
          <span>{user ? "Signed in" : "Guest checkout — no account needed"}</span>
        </div>
        {!user ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login?redirect=/checkout" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        ) : null}
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
                  onServiceRequestChange={setServiceRequest}
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
                  guest={!user}
                />
              )}
              {currentStep === 4 && address && (
                <OrderReview
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
                {cart.cart_items.map((item) => (
                  <div key={item.ID} className="flex items-center space-x-3">
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
                {serviceRequest && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service Charge</span>
                    <span>{formatPrice(serviceCharge)}</span>
                  </div>
                )}
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
