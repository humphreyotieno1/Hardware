import { SearchResults } from "@/components/catalog/search-results"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Search | Grahad Ventures Limited",
  description: "Search for products",
}

export default function SearchPage() {
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
