import type React from "react"
import type { Metadata, Viewport } from "next"
import { Poppins, Roboto } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/lib/hooks/use-auth"
import { CartProvider } from "@/lib/hooks/use-cart"
import { WishlistProvider } from "@/lib/hooks/use-wishlist"
import { StoreUiProvider } from "@/lib/hooks/use-store-ui"
import { QueryProvider } from "@/lib/providers/query-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthErrorBoundary } from "@/components/auth/auth-error-boundary"
import { StoreOverlays } from "@/components/layout/store-overlays"
import { Suspense } from "react"

import { GoogleAnalytics } from "@/components/seo/google-analytics"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Grahad Ventures Limited — Construction & Hardware Supplies",
  description: "Construction and hardware supplies in Siaya, Kenya. Quality tools, materials, plumbing, electrical products, delivery and bulk order support.",
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
      { url: "/logo.png", sizes: "any" },
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { url: "/logo.png", sizes: "192x192", type: "image/png" },
      { url: "/logo.png", sizes: "512x512", type: "image/png" },
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
        url: "/logo.png",
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
    images: ["/logo.png"],
  },
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0891b2",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${roboto.variable} ${poppins.variable}`}>
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""} />
        <Suspense fallback={<div className="h-1 w-full animate-pulse bg-primary/40" />}>
          <QueryProvider>
            <AuthErrorBoundary>
              <AuthProvider>
                <CartProvider>
                  <WishlistProvider>
                    <StoreUiProvider>
                      {children}
                      <StoreOverlays />
                    </StoreUiProvider>
                  </WishlistProvider>
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
