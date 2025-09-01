import { ProductDetail } from "@/components/catalog/product-detail"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ProductDetail productSlug={params.slug} />
      </main>
      <Footer />
    </div>
  )
}
