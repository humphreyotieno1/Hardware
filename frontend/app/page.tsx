import { HeroSection } from "@/components/catalog/hero-section"
import { CategoryGrid } from "@/components/catalog/category-grid"
import { FeaturedProducts } from "@/components/catalog/featured-products"
import { BrandsSection } from "@/components/catalog/brands-section"
import { TestimonialsSection } from "@/components/catalog/testimonials-section"
import { NewsletterSignup } from "@/components/catalog/newsletter-signup"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <CategoryGrid />
        <BrandsSection />
        <TestimonialsSection />
        <NewsletterSignup />
      </main>
      <Footer />
    </div>
  )
}
