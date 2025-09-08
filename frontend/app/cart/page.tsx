import type { Metadata } from "next"
import { CartPage } from "@/components/cart/cart-page"

export const metadata: Metadata = {
  title: "Shopping Cart | Hardware Store",
  description: "Review and manage your cart items",
}

export default function CartPageRoute() {
  return <CartPage />
}