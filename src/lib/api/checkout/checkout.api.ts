import client from "../client"
import type {
  CheckoutSessionResponse,
  OrderResponse,
  PaymentInitiateResponse,
  PaymentStatusResponse,
  CheckoutStartRequest,
} from "../types"

export async function startCheckoutApi(body: CheckoutStartRequest): Promise<CheckoutSessionResponse> {
  const { data } = await client.post("/api/v1/checkout/start", body)
  return data as CheckoutSessionResponse
}

export async function getCheckoutSessionApi(sessionId: string): Promise<CheckoutSessionResponse> {
  const { data } = await client.get(`/api/v1/checkout/${sessionId}`)
  return data as CheckoutSessionResponse
}

export async function payCheckoutSessionApi(sessionId: string): Promise<PaymentInitiateResponse> {
  const { data } = await client.post(`/api/v1/checkout/${sessionId}/pay`)
  return data as PaymentInitiateResponse
}

export async function getPaymentStatusApi(sessionId: string): Promise<PaymentStatusResponse> {
  const { data } = await client.get(`/api/v1/checkout/${sessionId}/payment-status`)
  return data as PaymentStatusResponse
}

export async function cancelCheckoutSessionApi(sessionId: string): Promise<CheckoutSessionResponse> {
  const { data } = await client.post(`/api/v1/checkout/${sessionId}/cancel`)
  return data as CheckoutSessionResponse
}

export async function completeCheckoutSessionApi(sessionId: string): Promise<OrderResponse> {
  const { data } = await client.post(`/api/v1/checkout/${sessionId}/complete`)
  return data as OrderResponse
}
