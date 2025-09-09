import { SearchResults } from "@/components/catalog/search-results"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Search | Grahad Ventures Limited",
  description: "Search for products",
}

interface SearchPageProps {
  searchParams: {
    q?: string
    page?: string
    sort?: string
    category?: string
    minPrice?: string
    maxPrice?: string
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <SearchResults searchParams={searchParams} />
      </main>
      <Footer />
    </div>
  )
}
