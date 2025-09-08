import { getApiClient } from "./client"
import type { AuthResponse, LoginRequest, RegisterRequest, User, RequestPasswordResetRequest, UpdateProfileRequest } from "./types"

export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await getApiClient().post<AuthResponse>("/auth/login", credentials)

    if (response.data?.token) {
      getApiClient().setToken(response.data.token)
    }

    return response.data!
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await getApiClient().post<AuthResponse>("/auth/register", userData)

    // Don't automatically set token - user needs to explicitly log in
    // if (response.data?.token) {
    //   getApiClient().setToken(response.data.token)
    // }

    return response.data!
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await getApiClient().post("/auth/password/reset", { token, password })
  },

  async logout(): Promise<void> {
    try {
      await getApiClient().post("/auth/logout")
    } finally {
      getApiClient().setToken(null)
    }
  },

  async requestPasswordReset(email: RequestPasswordResetRequest): Promise<void> {
    await getApiClient().post("/auth/password/reset", { email })
  },

  async getCurrentUser(): Promise<User> {
    const response = await getApiClient().get<User>("/profile")
    return response.data!
  },

  async updateProfile(profile: UpdateProfileRequest): Promise<{ message: string }> {
    const response = await getApiClient().put<{ message: string }>("/profile", profile)
    return response.data!
  },

  async refreshToken(): Promise<AuthResponse> {
    const response = await getApiClient().post<AuthResponse>("/auth/refresh")

    if (response.data?.token) {
      getApiClient().setToken(response.data.token)
    }

    return response.data!
  },
}
