"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { authApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { User, LoginRequest, RegisterRequest } from "@/lib/api/types"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginRequest) => Promise<{ user: User; token: string; refresh_token: string }>
  register: (userData: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  isAdmin: () => boolean
  isCustomer: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in on mount
    const initAuth = async () => {
      try {
        const currentUser = await authApi.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        // User not logged in or token expired
        console.log("No valid session found")
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginRequest) => {
    setLoading(true)
    try {
      const authResponse = await authApi.login(credentials)
      setUser(authResponse.user)
      toast({
        title: "Welcome back!",
        description: `Hello ${authResponse.user.full_name}, you're successfully signed in.`,
        variant: "success",
      })
      return authResponse
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: RegisterRequest) => {
    setLoading(true)
    try {
      const authResponse = await authApi.register(userData)
      // Don't automatically log in the user - they need to explicitly log in
      // Clear any existing auth state
      setUser(null)
      toast({
        title: "Account created successfully!",
        description: `Welcome ${authResponse.user.full_name}! Your account has been created. Please sign in to continue.`,
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please check your information and try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await authApi.logout()
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an issue signing you out, but you've been signed out locally.",
        variant: "destructive",
      })
    } finally {
      setUser(null)
      setLoading(false)
    }
  }

  const refreshUser = async () => {
    try {
      const currentUser = await authApi.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      // Handle error silently or logout user
      setUser(null)
    }
  }

  const isAdmin = () => {
    return user?.role === 'admin'
  }

  const isCustomer = () => {
    return user?.role === 'customer'
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isAdmin,
        isCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
