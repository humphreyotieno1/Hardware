import { CheckoutPage } from "@/components/checkout/checkout-page"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function Checkout() {
  return (
    <ProtectedRoute redirectTo="/auth/login?redirect=/checkout">
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <CheckoutPage />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
