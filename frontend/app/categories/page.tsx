import { CategoriesListing } from "@/components/catalog/categories-listing"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <CategoriesListing />
      </main>
      <Footer />
    </div>
  )
}