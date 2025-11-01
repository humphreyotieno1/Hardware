import type { Metadata } from "next"
import { ServiceTracker } from "@/components/services/service-tracker"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Track Service | Grahad Ventures Limited",
  description: "Track your service request status and updates",
}

export default function ServiceTrackPage() {
  return (
    <ProtectedRoute redirectTo="/auth/login?redirect=/services/track">
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <ServiceTracker />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
