import type { Metadata } from "next"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const metadata: Metadata = {
  title: "Admin Dashboard | Hardware Store",
  description: "Manage products, orders, inventory, and analytics",
}

export default function AdminPage() {
  return <AdminDashboard />
}
