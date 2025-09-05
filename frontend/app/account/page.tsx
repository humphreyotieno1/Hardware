import type { Metadata } from "next"
import { AccountDashboard } from "@/components/account/account-dashboard"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "My Account | Hardware Store",
  description: "Manage your account, orders, and preferences",
}

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <AccountDashboard />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
