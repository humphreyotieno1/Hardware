import type { Metadata } from "next"
import { OrdersPage } from "@/components/orders/orders-page"

export const metadata: Metadata = {
  title: "My Orders | Grahad Ventures Limited",
  description: "View your order history and track shipments",
}

export default function OrdersPageRoute() {
  return <OrdersPage />
}
