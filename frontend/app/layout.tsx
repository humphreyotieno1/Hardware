import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/lib/hooks/use-auth"
import { CartProvider } from "@/lib/hooks/use-cart"
import { WishlistProvider } from "@/lib/hooks/use-wishlist"
import { Toaster } from "@/components/ui/toaster"
import { AuthErrorBoundary } from "@/components/auth/auth-error-boundary"
import { Suspense } from "react"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Hardware Store - Professional Tools & Supplies",
  description: "Your trusted partner for construction and hardware supplies",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${montserrat.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthErrorBoundary>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>{children}</WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </AuthErrorBoundary>
        </Suspense>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
