import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"
import { Home } from "lucide-react"

export const metadata: Metadata = {
  title: "Sign In | Hardware Store",
  description: "Sign in to your account to access your dashboard and manage your orders",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Home className="h-5 w-5" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Grahad Ventures Limited</h1>
          <p className="text-muted-foreground">Your trusted partner for construction and hardware supplies</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}