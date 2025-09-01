"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/hooks/use-cart"
import { formatPrice } from "@/lib/api"
import type { Address, ServiceRequest } from "@/lib/api/types"
import { Check, MapPin, CreditCard, Wrench } from "lucide-react"

interface OrderReviewProps {
  address: Address
  serviceRequest: ServiceRequest | null
  paymentMethod: string
  onPlaceOrder: () => void
  onBack: () => void
  isProcessing: boolean
}

export function OrderReview({ 
  address, 
  serviceRequest, 
  paymentMethod, 
  onPlaceOrder, 
  onBack, 
  isProcessing 
}: OrderReviewProps) {
  const { cart, total } = useCart()

  const subtotal = total
  const shipping = subtotal >= 5000 ? 0 : 500
  const serviceCharge = serviceRequest ? 1000 : 0
  const tax = (subtotal + serviceCharge) * 0.16
  const finalTotal = subtotal + shipping + serviceCharge + tax

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "mpesa": return "M-Pesa"
      case "card": return "Credit/Debit Card"
      case "bank": return "Bank Transfer"
      default: return method
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Review</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Summary */}
        <div>
          <h3 className="font-semibold mb-3">Order Summary</h3>
          <div className="space-y-2">
            {cart?.items?.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-muted-foreground ml-2">x{item.quantity}</span>
                </div>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Shipping Address
          </h3>
          <div className="bg-muted p-3 rounded-md">
            <p>{address.street}</p>
            <p>{address.city}, {address.state} {address.postal_code}</p>
            <p>{address.country}</p>
          </div>
        </div>

        {/* Services */}
        {serviceRequest && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <Wrench className="h-4 w-4 mr-2" />
              Selected Services
            </h3>
            <div className="space-y-2">
              {serviceRequest.services.map((service) => (
                <Badge key={service} variant="secondary" className="mr-2">
                  {service}
                </Badge>
              ))}
              {serviceRequest.description && (
                <p className="text-sm text-muted-foreground mt-2">
                  {serviceRequest.description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Payment Method */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment Method
          </h3>
          <Badge variant="outline">{getPaymentMethodLabel(paymentMethod)}</Badge>
        </div>

        {/* Cost Breakdown */}
        <div>
          <h3 className="font-semibold mb-3">Cost Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            {serviceCharge > 0 && (
              <div className="flex justify-between">
                <span>Services</span>
                <span>{formatPrice(serviceCharge)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax (16% VAT)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-bold text-lg">
              <span>Total</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button 
            onClick={onPlaceOrder} 
            disabled={isProcessing}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Place Order
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
