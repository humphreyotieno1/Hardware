import apiClient from "./client"
import type { ServiceRequestDetails, ServiceRequestResponse, AcceptQuoteRequest } from "./types"

export const servicesApi = {
  async requestService(serviceData: ServiceRequestDetails): Promise<{ message: string; request_id: string }> {
    const response = await apiClient.post<{ message: string; request_id: string }>("/services/request", serviceData)
    return response.data!
  },

  async getUserServiceRequests(): Promise<ServiceRequestResponse[]> {
    const response = await apiClient.get<ServiceRequestResponse[]>("/services/requests")
    return response.data!
  },

  async getServiceRequestDetails(requestId: string): Promise<ServiceRequestResponse> {
    const response = await apiClient.get<ServiceRequestResponse>(`/services/requests/${requestId}`)
    return response.data!
  },

  async acceptQuote(requestId: string, quoteData: AcceptQuoteRequest): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(`/services/requests/${requestId}/accept-quote`, quoteData)
    return response.data!
  },
}