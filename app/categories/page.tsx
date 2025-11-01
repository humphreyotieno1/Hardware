import { CategoriesListing } from "@/components/catalog/categories-listing"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Categories | Grahad Ventures Limited",
  description: "Our product categories",
}

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