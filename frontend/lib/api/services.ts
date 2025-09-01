import { apiClient } from "./client"
import type { ServiceRequest } from "../types"

export const servicesApi = {
  // Submit a new service request
  submitRequest: async (request: Omit<ServiceRequest, "id" | "status" | "created_at">) => {
    return apiClient.post("/services/requests", request)
  },

  // Get service request by ID
  getRequest: async (id: string) => {
    return apiClient.get(`/services/requests/${id}`)
  },

  // Get user's service requests
  getUserRequests: async () => {
    return apiClient.get("/services/requests")
  },

  // Update service request status (admin)
  updateRequestStatus: async (id: string, status: string, notes?: string) => {
    return apiClient.patch(`/services/requests/${id}/status`, { status, notes })
  },

  // Get available service types and pricing
  getServiceTypes: async () => {
    return apiClient.get("/services/types")
  },

  // Get technician availability
  getTechnicianAvailability: async (serviceType: string, date: string) => {
    return apiClient.get(`/services/availability?type=${serviceType}&date=${date}`)
  },
}
