import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Account | Grahad Ventures Limited",
  description: "Manage your account settings and preferences",
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
