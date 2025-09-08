import { getApiClient } from "./client"
import type { InitiatePaymentRequest, InitiatePaymentResponse, Payment } from "./types"

export const paymentsApi = {
  async initiatePayment(paymentData: InitiatePaymentRequest): Promise<InitiatePaymentResponse> {
    const response = await getApiClient().post<InitiatePaymentResponse>("/payments/initiate", paymentData)
    return response.data!
  },

  async getPaymentStatus(paymentId: string): Promise<Payment> {
    const response = await getApiClient().get<Payment>(`/payments/${paymentId}/status`)
    return response.data!
  },

  async processWebhook(webhookData: any): Promise<{ message: string }> {
    const response = await getApiClient().post<{ message: string }>("/payments/webhook", webhookData)
    return response.data!
  },
}
