import { CheckoutSuccessPage } from "@/components/checkout/checkout-success-page"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Checkout Success | Grahad Ventures Limited",
  description: "Your order has been placed successfully",
}

export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <CheckoutSuccessPage />
      </main>
      <Footer />
    </div>
  )
}
