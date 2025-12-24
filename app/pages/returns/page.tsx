import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Construction, ArrowLeft, Home } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Under Construction | Grahad Ventures Limited",
    description: "This page is currently under construction. Check back soon!",
}

interface UnderConstructionPageProps {
    title?: string
    description?: string
}

export default function UnderConstructionPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="text-center max-w-md mx-auto space-y-6">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
                        <Construction className="h-10 w-10 text-primary" />
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                        Under Construction
                    </h1>

                    {/* Description */}
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        We're working hard to bring you this page. Please check back soon for updates!
                    </p>

                    {/* Progress indicator */}
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div className="bg-primary h-full rounded-full animate-pulse" style={{ width: '60%' }} />
                    </div>
                    <p className="text-sm text-muted-foreground">Coming Soon</p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button asChild variant="outline">
                            <Link href="javascript:history.back()">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Go Back
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
