import type { Metadata } from "next"
import { AccountDashboard } from "@/components/account/account-dashboard"

export const metadata: Metadata = {
  title: "My Account | Hardware Store",
  description: "Manage your account, orders, and preferences",
}

export default function AccountPage() {
  return <AccountDashboard />
}
