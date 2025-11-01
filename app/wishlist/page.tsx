import type { Metadata } from "next"
import { WishlistPage } from "@/components/wishlist/wishlist-page"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProtectedRoute } from "@/components/auth/protected-route"

export const metadata: Metadata = {
  title: "Wishlist | Grahad Ventures Limited",
  description: "Your saved items and favorites",
}

export default function WishlistPageRoute() {
  return (
    <ProtectedRoute redirectTo="/auth/login?redirect=/wishlist">
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <WishlistPage />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}