import type { Metadata } from "next"
import { ServiceRequestForm } from "@/components/services/service-request-form"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Request Service | Grahad Ventures Limited",
  description: "Request professional services for your hardware needs",
}

export default function ServiceRequestPage() {
  return (
    <ProtectedRoute redirectTo="/auth/login?redirect=/services/request">
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Request a Service</h1>
              <p className="text-muted-foreground">
                Get professional help with delivery, installation, cutting, or consultation
              </p>
            </div>
            <ServiceRequestForm />
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
