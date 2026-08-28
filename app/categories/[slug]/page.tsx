import { CategoryProductListing } from "@/components/catalog/category-product-listing"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Category | Grahad Ventures Limited",
  description: "Our products in this category",
}

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <CategoryProductListing categorySlug={slug} />
      </main>
      <Footer />
    </div>
  )
}
