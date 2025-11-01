import { ProductDetail } from "@/components/catalog/product-detail"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Product | Grahad Ventures Limited",
  description: "Our product details",
}

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ProductDetail productSlug={slug} />
      </main>
      <Footer />
    </div>
  )
}
