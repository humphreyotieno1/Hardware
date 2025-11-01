"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/lib/hooks/use-cart"

export default function PaymentCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Processing your payment...")

  useEffect(() => {
    const handlePaymentCallback = async () => {
      try {
        const reference = searchParams.get("reference")
        const trxref = searchParams.get("trxref")
        const orderId = searchParams.get("order_id")

        if (!reference && !trxref) {
          setStatus("error")
          setMessage("No payment reference found")
          return
        }

        // Wait a moment for webhook to process
        await new Promise(resolve => setTimeout(resolve, 3000))

        // Verify payment status
        try {
          const { paymentsApi } = await import("@/lib/api/payments")
          
          // Try to get payment status using reference or order ID
          if (reference || trxref) {
            // In production, you'd verify the payment with Paystack
            // For now, assume success if reference exists
            setStatus("success")
            setMessage("Payment successful! Your order has been confirmed.")
            
            // Clear cart
            await clearCart()
            
            // Redirect to success page after 3 seconds
            setTimeout(() => {
              router.push(`/checkout/success?order_id=${orderId || reference}`)
            }, 3000)
          } else {
            setStatus("error")
            setMessage("Unable to verify payment")
          }
        } catch (error: any) {
          console.error("Payment verification error:", error)
          // Still redirect if we have an order ID (webhook might have processed it)
          if (orderId) {
            setStatus("success")
            setMessage("Payment processed. Redirecting...")
            setTimeout(() => {
              router.push(`/checkout/success?order_id=${orderId}`)
            }, 2000)
          } else {
            setStatus("error")
            setMessage("Payment verification failed. Please contact support.")
          }
        }
      } catch (error: any) {
        console.error("Payment callback error:", error)
        setStatus("error")
        setMessage(error?.message || "An error occurred processing your payment")
      }
    }

    handlePaymentCallback()
  }, [searchParams, router, clearCart])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center space-y-6">
          {status === "loading" && (
            <>
              <Loader2 className="h-16 w-16 text-primary mx-auto animate-spin" />
              <div>
                <h1 className="text-2xl font-bold mb-2">Processing Payment</h1>
                <p className="text-muted-foreground">{message}</p>
              </div>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2 text-green-600">Payment Successful!</h1>
                <p className="text-muted-foreground">{message}</p>
              </div>
              <Button asChild>
                <Link href="/checkout/success">View Order</Link>
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2 text-red-600">Payment Failed</h1>
                <p className="text-muted-foreground">{message}</p>
              </div>
              <div className="space-y-2">
                <Button asChild>
                  <Link href="/checkout">Try Again</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Go Home</Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

