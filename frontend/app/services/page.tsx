// create a page for the services section

import { ServicesContent } from "@/components/services/services-content"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { NewsletterSignup } from "@/components/catalog/newsletter-signup"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Services | Grahad Ventures Limited",
  description: "Our services for your hardware needs",
}

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