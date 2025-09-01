import apiClient from "./client"
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "./types"

export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials)

    if (response.data?.token) {
      apiClient.setToken(response.data.token)
    }

    return response.data!
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/register", userData)

    if (response.data?.token) {
      apiClient.setToken(response.data.token)
    }

    return response.data!
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout")
    } finally {
      apiClient.setToken(null)
    }
  },

  async requestPasswordReset(email: string): Promise<void> {
    await apiClient.post("/auth/password/reset", { email })
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post("/auth/password/reset/confirm", { token, password })
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>("/auth/me")
    return response.data!
  },

  async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/refresh")

    if (response.data?.token) {
      apiClient.setToken(response.data.token)
    }

    return response.data!
  },
}
