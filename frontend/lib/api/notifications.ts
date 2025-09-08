import apiClient from "./client"
import type { NotificationsResponse } from "./types"

export const notificationsApi = {
  async getUserNotifications(limit: number = 20, offset: number = 0): Promise<NotificationsResponse> {
    const response = await apiClient.get<NotificationsResponse>(`/notifications?limit=${limit}&offset=${offset}`)
    return response.data!
  },

  async markAsRead(notificationId: string): Promise<{ message: string; id: string }> {
    const response = await apiClient.put<{ message: string; id: string }>(`/notifications/${notificationId}/read`)
    return response.data!
  },
}
