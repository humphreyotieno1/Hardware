import { SearchResults } from "@/components/catalog/search-results"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

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
