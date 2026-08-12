import client from "../client"
import type { OrderDto, PagedResult, PayoutRequestResponse, PayoutSummaryResponse, SellerSaleResponse } from "../types"

export async function getOrdersByUserApi(userId: string): Promise<OrderDto[]> {
  const { data } = await client.get(`/api/v1/orders/user/${encodeURIComponent(userId)}`)
  return data as OrderDto[]
}

export async function getOrderByIdApi(orderId: number): Promise<OrderDto> {
  const { data } = await client.get(`/api/v1/orders/${orderId}`)
  return data as OrderDto
}

export interface ConfirmDeliveryRequest {
  confirm: boolean
  note?: string | null
}

export interface ConfirmDeliveryResponse {
  orderId: number
  orderNumber: string
  status: string
}

export async function confirmOrderDeliveryApi(
  orderId: number,
  payload: ConfirmDeliveryRequest,
): Promise<ConfirmDeliveryResponse> {
  const { data } = await client.post(`/api/v1/orders/${orderId}/confirm-delivery`, payload)
  return data as ConfirmDeliveryResponse
}

export async function getSellerPayoutSummaryApi(): Promise<PayoutSummaryResponse> {
  const { data } = await client.get("/api/v1/seller/payout-summary")
  return data as PayoutSummaryResponse
}

export async function getSellerSalesApi(
  pageNumber = 1,
  pageSize = 10,
): Promise<PagedResult<SellerSaleResponse>> {
  const { data } = await client.get("/api/v1/seller/sales", {
    params: { pageNumber, pageSize },
  })
  return data as PagedResult<SellerSaleResponse>
}

export async function requestSellerPayoutApi(orderId: number): Promise<PayoutRequestResponse> {
  const { data } = await client.post("/api/v1/seller/payout-requests", { orderId })
  return data as PayoutRequestResponse
}
