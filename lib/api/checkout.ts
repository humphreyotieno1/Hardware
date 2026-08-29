import { getApiClient } from "./client"
import type { GuestOrderRequest, ShippingOption, PlaceOrderRequest, PlaceOrderResponse } from "./types"

export const checkoutApi = {
  async placeOrder(orderData: PlaceOrderRequest): Promise<PlaceOrderResponse> {
    const response = await getApiClient().post<PlaceOrderResponse>("/checkout/place", orderData)
    return response.data!
  },

  async placeGuestOrder(orderData: GuestOrderRequest): Promise<PlaceOrderResponse> {
    const response = await getApiClient().post<PlaceOrderResponse>("/checkout/guest", orderData)
    return response.data!
  },

  async getShippingOptions(): Promise<ShippingOption[]> {
    const response = await getApiClient().get<ShippingOption[]>("/checkout/shipping-options")
    return response.data!
  },
}
