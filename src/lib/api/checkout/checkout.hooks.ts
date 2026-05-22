import { useQuery, useMutation } from "@tanstack/react-query"
import { withMock } from "../use-mock"
import {
  startCheckoutApi,
  getCheckoutSessionApi,
  payCheckoutSessionApi,
  cancelCheckoutSessionApi,
  completeCheckoutSessionApi,
} from "./checkout.api"
import type { CheckoutSessionResponse, OrderResponse } from "../types"

const mockSession: CheckoutSessionResponse = {
  sessionId: "mock-session-id",
  status: "Pending",
  totalAmount: 0,
  expiresAt: new Date(Date.now() + 3600000).toISOString(),
  isExpired: false,
  sellerGroups: [],
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
    mutationFn: () => withMock(mockSession, () => startCheckoutApi()),
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
      withMock(mockSession, () => payCheckoutSessionApi(sessionId)),
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
