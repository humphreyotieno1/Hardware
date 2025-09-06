import type React from "react"
import type { Metadata } from "next"
import { AdminGuard } from "@/components/auth/admin-guard"

export const metadata: Metadata = {
  title: "Admin | Hardware Store",
  description: "Admin portal for managing hardware store operations",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminGuard>
      {children}
    </AdminGuard>
  )
}
