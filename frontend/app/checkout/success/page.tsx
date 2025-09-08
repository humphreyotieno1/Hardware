import { CheckoutSuccessPage } from "@/components/checkout/checkout-success-page"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function CheckoutSuccess() {
  return (
    <ProtectedRoute redirectTo="/auth/login?redirect=/checkout/success">
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <CheckoutSuccessPage />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
