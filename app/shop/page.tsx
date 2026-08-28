import { SearchResults } from "@/components/catalog/search-results"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shop | Grahad Ventures Limited",
  description: "Shop construction and hardware supplies from Grahad Ventures Limited in Siaya, Kenya.",
}

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <SearchResults />
      </main>
      <Footer />
    </div>
  )
}
