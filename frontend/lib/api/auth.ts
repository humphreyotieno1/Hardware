import apiClient from "./client"
import type { AuthResponse, LoginRequest, RegisterRequest, User, RequestPasswordResetRequest, UpdateProfileRequest } from "./types"

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

    // Don't automatically set token - user needs to explicitly log in
    // if (response.data?.token) {
    //   apiClient.setToken(response.data.token)
    // }

    return response.data!
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post("/auth/password/reset", { token, password })
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout")
    } finally {
      apiClient.setToken(null)
    }
  },

  async requestPasswordReset(email: RequestPasswordResetRequest): Promise<void> {
    await apiClient.post("/auth/password/reset", { email })
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>("/profile")
    return response.data!
  },

  async updateProfile(profile: UpdateProfileRequest): Promise<void> {
    await apiClient.put("/profile", profile)
  },

  async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/refresh")

    if (response.data?.token) {
      apiClient.setToken(response.data.token)
    }

    return response.data!
  },
}
