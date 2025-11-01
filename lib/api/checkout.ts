import { getApiClient } from "./client"
import type { ShippingOption, PlaceOrderRequest, PlaceOrderResponse } from "./types"

export const checkoutApi = {
  async placeOrder(orderData: PlaceOrderRequest): Promise<PlaceOrderResponse> {
    const response = await getApiClient().post<PlaceOrderResponse>("/checkout/place", orderData)
    return response.data!
  },

  async getShippingOptions(): Promise<ShippingOption[]> {
    const response = await getApiClient().get<ShippingOption[]>("/checkout/shipping-options")
    return response.data!
  },
}
