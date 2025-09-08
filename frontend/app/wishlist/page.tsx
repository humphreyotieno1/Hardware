import type { Metadata } from "next"
import { WishlistPage } from "@/components/wishlist/wishlist-page"

export const metadata: Metadata = {
  title: "Wishlist | Hardware Store",
  description: "Your saved items and favorites",
}

export default function WishlistPageRoute() {
  return <WishlistPage />
}