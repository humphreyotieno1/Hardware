import type React from "react"
import type { Metadata, Viewport } from "next"
import { Sen } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/lib/hooks/use-auth"
import { CartProvider } from "@/lib/hooks/use-cart"
import { WishlistProvider } from "@/lib/hooks/use-wishlist"
import { QueryProvider } from "@/lib/providers/query-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthErrorBoundary } from "@/components/auth/auth-error-boundary"
import { Suspense } from "react"

import { GoogleAnalytics } from "@/components/seo/google-analytics"

const sen = Sen({
  subsets: ["latin"],
  variable: "--font-sen",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Grahad Ventures Limited - Professional Tools & Supplies",
  description: "Your trusted partner for construction and hardware supplies in Siaya, Kenya. Quality tools, materials, and professional building solutions.",
  keywords: ["hardware", "construction", "tools", "building materials", "Siaya", "Kenya", "Grahad Ventures"],
  authors: [{ name: "Grahad Ventures Limited" }],
  creator: "Grahad Ventures Limited",
  publisher: "Grahad Ventures Limited",
  metadataBase: new URL("https://www.grahadventures.co.ke"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/grahad.png", sizes: "any" },
      { url: "/grahad.png", sizes: "16x16", type: "image/png" },
      { url: "/grahad.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/grahad.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { url: "/grahad.png", sizes: "192x192", type: "image/png" },
      { url: "/grahad.png", sizes: "512x512", type: "image/png" },
    ],
  },
  verification: {
    google: "OWwUo9gXPSEXe_7oWa-tFBggaJaT5o-drEu0o2v_ICU",
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://www.grahadventures.co.ke",
    siteName: "Grahad Ventures Limited",
    title: "Grahad Ventures Limited - Professional Tools & Supplies",
    description: "Your trusted partner for construction and hardware supplies in Siaya, Kenya.",
    images: [
      {
        url: "/grahad.png",
        width: 1200,
        height: 630,
        alt: "Grahad Ventures Limited",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Grahad Ventures Limited - Professional Tools & Supplies",
    description: "Your trusted partner for construction and hardware supplies in Siaya, Kenya.",
    images: ["/grahad.png"],
  },
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#171717",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${sen.variable}`}>
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""} />
        <Suspense fallback={<div>Loading...</div>}>
          <QueryProvider>
            <AuthErrorBoundary>
              <AuthProvider>
                <CartProvider>
                  <WishlistProvider>{children}</WishlistProvider>
                </CartProvider>
              </AuthProvider>
            </AuthErrorBoundary>
          </QueryProvider>
        </Suspense>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
