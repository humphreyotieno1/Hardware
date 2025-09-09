import type { Metadata } from "next"
import { CartPage } from "@/components/cart/cart-page"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProtectedRoute } from "@/components/auth/protected-route"

export const metadata: Metadata = {
  title: "Shopping Cart | Grahad Ventures Limited",
  description: "Review and manage your cart items",
}

export default function CartPageRoute() {
  return (
    <ProtectedRoute redirectTo="/auth/login?redirect=/cart">
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <CartPage />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}