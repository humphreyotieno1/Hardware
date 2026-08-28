import { HeroSection } from "@/components/catalog/hero-section"
import { TrustStrip } from "@/components/catalog/trust-strip"
import { CategoryGrid } from "@/components/catalog/category-grid"
import { FeaturedProducts } from "@/components/catalog/featured-products"
import { PromoBanner } from "@/components/catalog/promo-banner"
import { BulkOrders } from "@/components/catalog/bulk-orders"
import { HomeServices } from "@/components/catalog/home-services"
import { PartnersSection } from "@/components/catalog/partners-section"
import { WhyGrahad } from "@/components/catalog/why-grahad"
import dynamic from "next/dynamic"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

const NewsletterSignup = dynamic(
  () => import("@/components/catalog/newsletter-signup").then((mod) => ({ default: mod.NewsletterSignup })),
  { loading: () => <div className="h-32 bg-muted" /> }
)

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <TrustStrip />
        <CategoryGrid />
        <FeaturedProducts />
        <PromoBanner />
        <BulkOrders />
        <HomeServices />
        <WhyGrahad />
        <PartnersSection />
        <NewsletterSignup />
      </main>
      <Footer />
    </div>
  )
}
