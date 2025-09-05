// create a page for the services section

import { ServicesContent } from "@/components/services/services-content"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { NewsletterSignup } from "@/components/catalog/newsletter-signup"

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mt-10">
        <ServicesContent />
        <NewsletterSignup />
      </main>
      <Footer />
    </div>
  )
}