import type { Metadata } from "next"
import { WishlistPage } from "@/components/wishlist/wishlist-page"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Wishlist | Hardware Store",
  description: "Save and organize your favorite hardware products for future purchase",
}

export default function Wishlist() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <WishlistPage />
      </main>
      <Footer />
    </div>
  )
}
