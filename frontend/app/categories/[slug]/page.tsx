import { CategoryProductListing } from "@/components/catalog/category-product-listing"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

interface CategoryPageProps {
  params: {
    slug: string
  }
  searchParams: {
    page?: string
    sort?: string
    brand?: string
    minPrice?: string
    maxPrice?: string
  }
}

export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <CategoryProductListing categorySlug={params.slug} searchParams={searchParams} />
      </main>
      <Footer />
    </div>
  )
}
