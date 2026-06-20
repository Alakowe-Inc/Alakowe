import { useQuery, useMutation } from "@tanstack/react-query"
import { withMock } from "../use-mock"
import {
  startCheckoutApi,
  getCheckoutSessionApi,
  payCheckoutSessionApi,
  cancelCheckoutSessionApi,
  completeCheckoutSessionApi,
  getPaymentStatusApi,
} from "./checkout.api"
import type {
  CheckoutSessionResponse,
  OrderResponse,
  PaymentInitiateResponse,
  PaymentStatusResponse,
  CheckoutStartRequest,
} from "../types"

const mockSession: CheckoutSessionResponse = {
  sessionId: "mock-session-id",
  status: "Pending",
  totalAmount: 0,
  expiresAt: new Date(Date.now() + 3600000).toISOString(),
  isExpired: false,
  sellerGroups: [],
}

const mockPaymentInitiate: PaymentInitiateResponse = {
  accessCode: "mock-access-code",
  authorizationUrl: null,
  reference: "mock-reference",
  expiresAt: new Date(Date.now() + 3600000).toISOString(),
}

const mockPaymentStatus: PaymentStatusResponse = {
  status: "pending",
  reference: "mock-reference",
  message: null,
  paidAt: null,
  orders: [],
}

const mockOrder: OrderResponse = {
  orderId: 1,
  orderNumber: "ORD-001",
  status: "Completed",
  totalAmount: 0,
  orderDate: new Date().toISOString(),
  sessionId: "mock-session-id",
  sellerGroups: [],
}

export function useStartCheckout() {
  return useMutation({
    mutationFn: (body: CheckoutStartRequest) =>
      withMock(mockSession, () => startCheckoutApi(body)),
  })
}

export function useCheckoutSession(sessionId: string) {
  return useQuery({
    queryKey: ["checkout", sessionId],
    queryFn: () => withMock(mockSession, () => getCheckoutSessionApi(sessionId)),
    enabled: !!sessionId,
  })
}

export function usePayCheckout() {
  return useMutation({
    mutationFn: (sessionId: string) =>
      withMock(mockPaymentInitiate, () => payCheckoutSessionApi(sessionId)),
  })
}

export function usePaymentStatus(sessionId: string) {
  return useQuery({
    queryKey: ["payment-status", sessionId],
    queryFn: () => withMock(mockPaymentStatus, () => getPaymentStatusApi(sessionId)),
    enabled: !!sessionId,
  })
}

export function useCancelCheckout() {
  return useMutation({
    mutationFn: (sessionId: string) =>
      withMock(mockSession, () => cancelCheckoutSessionApi(sessionId)),
  })
}

export function useCompleteCheckout() {
  return useMutation({
    mutationFn: (sessionId: string) =>
      withMock(mockOrder, () => completeCheckoutSessionApi(sessionId)),
  })
}
