import { HeroSection } from "@/components/catalog/hero-section"
import { CategoryGrid } from "@/components/catalog/category-grid"
import { FeaturedProducts } from "@/components/catalog/featured-products"
import { PartnersSection } from "@/components/catalog/partners-section"
import { TestimonialsSection } from "@/components/catalog/testimonials-section"
import dynamic from "next/dynamic"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

const NewsletterSignup = dynamic(() => import("@/components/catalog/newsletter-signup").then(mod => ({ default: mod.NewsletterSignup })), {
  loading: () => <div className="h-64 bg-muted animate-pulse" />,
})

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <CategoryGrid />
        <PartnersSection />
        {/* <TestimonialsSection /> */}
        <NewsletterSignup />
      </main>
      <Footer />
    </div>
  )
}
