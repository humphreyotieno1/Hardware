import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search, ArrowLeft } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="text-center max-w-lg mx-auto space-y-8">
                {/* 404 Number */}
                <div className="relative">
                    <h1 className="text-[150px] sm:text-[200px] font-bold text-muted/20 leading-none select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                                Page Not Found
                            </p>
                            <p className="text-muted-foreground">
                                Oops! The page you're looking for doesn't exist.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto">
                    The page you're trying to reach may have been moved, deleted, or never existed.
                    Let's get you back on track.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild variant="outline" size="lg">
                        <Link href="javascript:history.back()">
                            <ArrowLeft className="mr-2 h-5 w-5" />
                            Go Back
                        </Link>
                    </Button>
                    <Button asChild size="lg">
                        <Link href="/">
                            <Home className="mr-2 h-5 w-5" />
                            Back to Home
                        </Link>
                    </Button>
                </div>

                {/* Search suggestion */}
                <div className="pt-8 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-4">
                        Looking for something specific?
                    </p>
                    <Button asChild variant="secondary">
                        <Link href="/search">
                            <Search className="mr-2 h-4 w-4" />
                            Search Products
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
